import { defineStore } from 'pinia'
// 引入获取博客结构化数据的工具方法
import { getStructuredBlogList } from '@/utils/blog'
import dayjs from 'dayjs' // 要安装 dayjs，npm install dayjs
import router from "@/router";

//1.定义容器
//参数1：容器的ID，必须唯一（可以自己取名），将来Pinia会把所有的容器挂在到跟容器
export const useBlogStore = defineStore('blogStore', {
    // 开启数据持久化
    persist: {
        // enabled:true,
        storage: window.sessionStorage,
    },
    state: () => {
        return {
            blogList: [] as blogAPITypes.BlogFolder[],//所有的文章数据
            showList: [] as blogAPITypes.BlogFile[],//展示的文章数据
            currentBlog: {} as blogAPITypes.BlogFile,         //当前选中的文章
            total: 0, //总计条数
            activeTab: 'all' as string, // 默认选中第一个标签，防止为空
            showStyle: 'list' as blogAPITypes.DisplayMode, // 默认展示样式
            currentPage: 1, // 当前页码
            pageSize: 5, // 每页条数
            //md主题的preview-theme
            previewTheme: 'default',
            //md主题的代码块高亮显示code
            codeColor: 'atom'
        }
    },
    //相当于computed
    getters: {
        //获取所有博客的总条数
        getTotal(): number {
            return this.blogList.flatMap(item => item.files).length
        },
        //// 计算属性：提取每个博客文件夹的 folder 名称用于导航标签
        folderNames(): string[] {
            const folderList = this.blogList.map(item => item.folder)
            folderList.unshift('all') // 在数组的开头插入 'all'
            return folderList
        },
        //// 计算当前页数据函数
        getPageList(): blogAPITypes.BlogFile[] {
            const start = (this.currentPage - 1) * this.pageSize
            const end = start + this.pageSize
            return this.blogList.flatMap(item => item.files).slice(start, end)
        },
        //计算本月新增博客数量
        monthlyUpdate(): number {
            const currentMonth = dayjs().format('YYYY-MM')
            let count = 0
            this.blogList.forEach((folder) => {
                folder.files.forEach((file) => {
                    if (dayjs(file.date).format('YYYY-MM') === currentMonth) {
                        count++
                    }
                })
            })
            return count
        },
        //计算本周新增博客数量
        weeklyUpdate(): number {
            const startOfWeek = dayjs().startOf('week')
            const endOfWeek = dayjs().endOf('week')
            let count = 0
            this.blogList.forEach((folder) => {
                folder.files.forEach((file) => {
                    const fileDate = dayjs(file.date)
                    if (fileDate.isAfter(startOfWeek) && fileDate.isBefore(endOfWeek)) {
                        count++
                    }
                })
            })
            return count
        },
        //获取所有的标签
        tags(): string[] {
            return [...new Set(this.blogList.flatMap(folder => folder.files.flatMap(file => file.tags || [])))]
        },
        //获取指定分类的文章列表
        filteredBlogList(state) {
            // 扁平化 blogList
            const flatList = state.blogList.flatMap(({ folder, files }) =>
                files.map(file => ({
                    ...file,
                    folder,
                }))
            )

            // 根据 tab 过滤
            const filtered = state.activeTab === 'all'
                ? flatList
                : flatList.filter(file => file.folder === state.activeTab)

            // 按时间字段降序排序
            const sorted = filtered.sort((a, b) => {
                const dateA = new Date(a.date ?? '1970-01-01').getTime() // 如果 date 为 undefined，使用默认日期
                const dateB = new Date(b.date ?? '1970-01-01').getTime() // 同上
                return dateB - dateA
            })
            //更新total
            state.total = sorted.length

            // 分页处理
            const start = (state.currentPage - 1) * state.pageSize
            const end = start + state.pageSize
            return sorted.slice(start, end)
        },
        //根据当前选中的文章的tags，获取所有相关的文章
        relatedBlogs(state) {
            const tags = state.currentBlog.tags || []
            return state.blogList.flatMap(folder => folder.files).filter(file => {
                return tags.some(tag => file.tags?.includes(tag))
            })
        },
        // 获取最新的五篇文章
        latestBlogs(): blogAPITypes.BlogFile[] {
            const flatList = this.blogList.flatMap(({ folder, files }) =>
                files.map(file => ({
                    ...file,
                    folder,
                }))
            )

            // 按时间字段降序排序
            const sorted = flatList.sort((a, b) => {
                const dateA = new Date(a.date ?? '1970-01-01').getTime()
                const dateB = new Date(b.date ?? '1970-01-01').getTime()
                return dateB - dateA
            })

            // 返回前五篇最新的文章
            return sorted.slice(0, 7)
        },
    },

    //相当于methods
    actions: {
        //获取博客结构化数据
        async getBlogList() {
            this.blogList = await getStructuredBlogList()
            // 计算总条数
            this.total = this.blogList.flatMap(item => item.files).length
        },
        //修改当前选中的标签
        changeActiveTab(tab: string) {
            this.activeTab = tab
        },
        //修改当前展示的样式
        changeShowStyle(style: blogAPITypes.DisplayMode) {
            this.showStyle = style
        },
        //修改当前选中的文章
        changeCurrentBlog(blog: blogAPITypes.BlogFile) {
            this.currentBlog = blog
            router.push(`/blog/article/${blog.filename}`)
        }
    }
})


