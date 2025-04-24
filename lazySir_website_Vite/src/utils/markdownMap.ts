// 自动引入 markdown 文件并生成映射表
// {
//     'test': () => Promise<string>,
//     'vue3入门': () => Promise<string>,
//     ...
//   }
export const markdownMap: Record<string, () => Promise<string>> = Object.fromEntries(
    Object.entries(
        import.meta.glob('@/views/blog/dir/**/*.md', { as: 'raw' })
    ).map(([path, loader]) => {
        // 提取文件名（包含 .md）作为 key，例如：test测试.md
        const match = path.match(/\/([^/]+\.md)$/)
        const key = match ? match[1] : path
        return [key, loader]
    })
)
