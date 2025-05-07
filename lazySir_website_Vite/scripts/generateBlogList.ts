import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

// 自定义的 frontmatter 解析函数
function parseFrontmatter(content: string): Record<string, any> {
    const matterRegex = /^---\s*[\r\n]+([\s\S]*?)\s*---/; // 用于提取 YAML frontmatter
    const match = content.match(matterRegex);
    const frontmatter: Record<string, any> = {};

    if (match) {
        const yaml = match[1]; // 提取 frontmatter 内容
        const lines = yaml.split('\n'); // 按行分割

        for (const line of lines) {
            const [key, ...rest] = line.split(':');
            if (!key) continue;

            const value = rest.join(':').trim(); // 处理冒号和多值情况

            if (value.startsWith('[') && value.endsWith(']')) {
                // 解析数组类型的字段
                frontmatter[key.trim()] = value
                    .slice(1, -1)
                    .split(',')
                    .map((v) => v.trim());
            } else {
                // 普通字符串字段
                frontmatter[key.trim()] = value;
            }
        }
    }

    return frontmatter;
}

// 获取当前文件夹路径
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 设置路径
const blogDir = path.resolve(__dirname, '../src/views/blog/dir');
const outputFile = path.resolve(__dirname, '../public/blog/blogData.json');

// 获取所有 md 文件路径（支持递归）
const mdFiles = fg.sync('**/*.md', { cwd: blogDir });

// 按文件夹分组数据
const folderMap: Record<string, any[]> = {}; // 文件夹名到文件列表的映射

// 处理每个文件，生成博客数据
mdFiles.forEach((relativePath) => {
    const fullPath = path.join(blogDir, relativePath);
    const content = fs.readFileSync(fullPath, 'utf-8');

    // 使用自定义的解析函数解析 frontmatter
    const frontmatter = parseFrontmatter(content);

    // 使用正则提取路径中的 folder 和 filename
    const match = relativePath.match(/([^\/]+)\/([^\/]+\.md)/);
    if (match) {
        const [, folder, file] = match;

        const fileData = {
            path: `/src/views/blog/dir/${relativePath}`, // 原始路径，可用于动态加载
            filename: file, // 文件名
            ...frontmatter, // 展开 frontmatter 字段
        };

        // 将文件加入对应的文件夹
        if (!folderMap[folder]) {
            folderMap[folder] = [];
        }
        folderMap[folder].push(fileData);
    }
});

// 将文件夹内的文件按日期排序（最新在前）
const structuredData = Object.entries(folderMap).map(([folder, files]) => ({
    folder,
    files: files.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }),
}));

// 写入 JSON 文件
fs.writeFileSync(outputFile, JSON.stringify(structuredData, null, 2), 'utf-8');

console.log(`✅ Generated blogData.json with ${structuredData.length} folders.`);
