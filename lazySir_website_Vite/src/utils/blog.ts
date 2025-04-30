// utils/blogStructure.ts

// --- 工具一：提取 frontmatter ---

// 匹配 frontmatter（开头到第一个 --- 之间的内容）
const matterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * 解析 Markdown 文件中的 frontmatter
 * @param content Markdown 文件的文本内容
 * @returns frontmatter 对象
 */
export function parseFrontmatter(content: string): Record<string, any> {
    const match = content.match(matterRegex);
    const frontmatter: Record<string, any> = {};

    if (match) {
        const yaml = match[1]; // 提取 frontmatter 内容
        const lines = yaml.split('\n'); // 按行分割

        for (const line of lines) {
            const [key, ...rest] = line.split(':');
            if (!key) continue;

            const value = rest.join(':').trim(); // 可能存在值里有冒号的情况

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

// --- 工具二：综合获取所有博客并按文件夹分组 ---

/**
 * 加载所有博客 Markdown 文件，并按文件夹结构整理
 * @returns 按文件夹分组的博客数据
 */
export async function getStructuredBlogList() {
    // 动态导入所有博客 Markdown 源码，使用 raw 格式
    const modules = import.meta.glob('/src/views/blog/dir/*/*.md', {
        import: 'default',
        query: '?raw',
    });

    const folderMap: Record<string, any[]> = {}; // 文件夹名到文件列表的映射

    for (const path in modules) {
        // 加载单个 Markdown 文件内容
        const rawContent = await (modules[path] as () => Promise<string>)();
        const frontmatter = parseFrontmatter(rawContent); // 提取 frontmatter

        // 使用正则提取路径中的 folder 和 filename
        const match = path.match(/\/src\/views\/blog\/dir\/([^\/]+)\/([^\/]+\.md)/);
        if (match) {
            const [, folder, file] = match;

            const fileData = {
                path: path.replace(/^\/?src/, ''), // 去除 src 前缀，形成相对路径
                filename: file, // 文件名
                ...frontmatter, // 展开 frontmatter 字段
            };

            // 将文件加入对应的文件夹
            if (!folderMap[folder]) {
                folderMap[folder] = [];
            }
            folderMap[folder].push(fileData);
        }
    }

    // 将 folderMap 转成数组，并对每个文件夹内的文件按日期排序（最新在前）
    const result = Object.entries(folderMap).map(([folder, files]) => ({
        folder,
        files: files.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }),
    }));

    return result;
}

// --- 工具三：将结构化数据拍平成纯数组 ---

/**
 * 获取指定文件夹下的博客列表，或获取全部博客
 * @param folder 文件夹名，如果为 'all' 返回全部
 * @returns 博客文件列表
 */
export async function getBlogList(folder: string): Promise<blogAPITypes.BlogFile[]> {
    const structuredList = await getStructuredBlogList();

    if (folder === 'all') {
        // 返回所有文件
        return structuredList.flatMap(({ folder, files }) =>
            files.map((file) => ({
                ...file,
                folder, // 记录文件所属文件夹
            }))
        );
    }

    // 筛选指定文件夹
    const filteredList = structuredList
        .filter((item) => item.folder === folder)
        .flatMap(({ folder, files }) =>
            files.map((file) => ({
                ...file,
                folder, // 记录文件所属文件夹
            }))
        );

    return filteredList;
}

/**
 * 计算 Markdown 内容的阅读时间（单位：分钟）
 * @param content Markdown 文件内容
 * @returns 阅读时间（最少 1 分钟）
 */
export function calcReadingTime(content: string): number {
    // 先移除 frontmatter 和 Markdown 语法，只保留正文
    const cleanContent = content
        .replace(/^---\r?\n([\s\S]*?)\r?\n---/, '') // 去掉 frontmatter
        .replace(/!\[.*?\]\(.*?\)/g, '')             // 去掉图片
        .replace(/\[.*?\]\(.*?\)/g, '')              // 去掉链接
        .replace(/`{1,3}.*?`{1,3}/g, '')             // 去掉行内代码
        .replace(/>\s.+/g, '')                      // 去掉引用
        .replace(/#+\s.+/g, '')                     // 去掉标题
        .replace(/[*_\-~`>]/g, '')                  // 去掉特殊符号
        .replace(/\s+/g, '');                       // 去掉多余空白

    const textLength = cleanContent.length;

    // 设定每分钟阅读 300 字
    const wordsPerMinute = 300;
    const minutes = Math.ceil(textLength / wordsPerMinute);

    return minutes || 1; // 至少 1 分钟
}
