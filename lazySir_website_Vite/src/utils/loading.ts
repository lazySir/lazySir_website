//加载动画
import { ElLoading } from 'element-plus'

let loading = '' as any // 设置为 null 初始化

//配置加载动画接口
interface Options {
  lock: boolean,
  text: string,
  background: string
}

//配置加载动画
const options: Options = {
  lock: true,
  text: '加载中...',
  background: 'rgba(0,0,0,0.7)'
}

//开始加载
export const startLoading = () => {
  if (!loading) {  // 确保没有加载动画正在运行
    loading = ElLoading.service(options)
  }
}

//结束加载
export const endLoading = () => {
  if (loading) {  // 确保 loading 存在
    loading.close();
    loading = null;  // 结束后将 loading 设置为 null
  }
}
