// utils/blogStructure.ts

// --- 工具一：提取 frontmatter ---
const matterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;

function parseFrontmatter(content: string): Record<string, any> {
    const match = content.match(matterRegex);
    const frontmatter: Record<string, any> = {};

    if (match) {
        const yaml = match[1];
        const lines = yaml.split('\n');

        for (const line of lines) {
            const [key, ...rest] = line.split(':');
            if (!key) continue;

            const value = rest.join(':').trim();

            if (value.startsWith('[') && value.endsWith(']')) {
                frontmatter[key.trim()] = value
                    .slice(1, -1)
                    .split(',')
                    .map((v) => v.trim());
            } else {
                frontmatter[key.trim()] = value;
            }
        }
    }

    return frontmatter;
}

// --- 工具三：综合获取所有博客并按文件夹分组 ---
export async function getStructuredBlogList() {
    // 加载所有 Markdown 源码（使用 ?raw）
    const modules = import.meta.glob('/src/views/blog/dir/*/*.md', {
        import: 'default',
        query: '?raw',
    });

    // 临时文件夹映射：{ folder: [fileData, fileData, ...] }
    const folderMap: Record<string, any[]> = {};

    for (const path in modules) {
        const rawContent = await (modules[path] as () => Promise<string>)();
        const frontmatter = parseFrontmatter(rawContent);

        const match = path.match(/\/src\/views\/blog\/dir\/([^\/]+)\/([^\/]+\.md)/);
        if (match) {
            const [, folder, file] = match;

            const fileData = {
                path: path.replace(/^\/?src/, ''),
                filename: file,
                ...frontmatter,
            };

            if (!folderMap[folder]) {
                folderMap[folder] = [];
            }

            folderMap[folder].push(fileData);
        }
    }

    // 排序每个文件夹下的文件（按日期）
    const result = Object.entries(folderMap).map(([folder, files]) => ({
        folder,
        files: files.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }),
    }));

    return result;
}


// --- 新增：将结构化数据拍平成纯数组 ---
export async function getBlogList(folder: string): Promise<blogAPITypes.BlogFile[]> {
    const structuredList = await getStructuredBlogList()
    // 如果传入的是 'all'，返回所有文件
    if (folder === 'all') {
        return structuredList.flatMap(({ folder, files }) =>
            files.map((file) => ({
                ...file,
                folder, // 添加文件夹信息
            }))
        )
    }

    // 否则筛选出指定文件夹的文件
    const filteredList = structuredList
        .filter((item) => item.folder === folder)
        .flatMap(({ folder, files }) =>
            files.map((file) => ({
                ...file,
                folder, // 添加文件夹信息
            }))
        )

    return filteredList
}
