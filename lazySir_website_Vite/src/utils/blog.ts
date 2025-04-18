// utils/getBlogStructure.ts
const modules = import.meta.glob('/src/views/blog/dir/*/*.md'); // 不用 eager

const folderMap: Record<string, string[]> = {};

for (const path in modules) {
    const match = path.match(/\/src\/views\/blog\/dir\/([^\/]+)\/([^\/]+\.md)/);
    if (match) {
        const [, folder, file] = match;
        if (!folderMap[folder]) {
            folderMap[folder] = [];
        }
        folderMap[folder].push(file);
    }
}

// 转换为目标格式
const folderList = Object.entries(folderMap).map(([folder, file]) => ({
    folder,
    file,
}));

export default folderList;
