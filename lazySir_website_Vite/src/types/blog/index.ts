declare namespace blogAPITypes {
    interface BlogFile {
        path: string
        filename: string
        title?: string
        author?: string
        tags?: string[]
        description?: string
        cover?: string
        date?: string
    }

    interface BlogFolder {
        folder: string
        files: BlogFile[]
    }
    // 展示样式的类型定义
    type DisplayMode = 'waterfall' | 'card' | 'list'

    // 展示样式列表项的接口定义
    interface DisplayModeOption {
        name: string
        key: DisplayMode
        value: string // icon 名称
    }
}