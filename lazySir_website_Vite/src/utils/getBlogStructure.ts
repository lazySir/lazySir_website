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

export async function getBlogList() {
    const modules = import.meta.glob('@/views/blog/dir/**/*.md', {
        query: '?raw',
        import: 'default',
    });

    const blogList: any[] = [];

    for (const path in modules) {
        const rawContent = await (modules[path] as () => Promise<string>)(); // 类型断言

        // 假设 parseFrontmatter 会提取出 title, date, author, tags 等
        const frontmatter = parseFrontmatter(rawContent);

        blogList.push({
            path: path.replace(/^\/?src/, ''),       // 去掉 /src 前缀
            filename: path.split('/').pop(),         // 提取文件名
            ...frontmatter,
        });
    }

    // ✅ 按照 date 字段从新到旧排序（前提：格式为 yyyy-MM-dd 或 ISO 8601）
    blogList.sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return timeB - timeA;
    });

    return blogList;
}
