//--------------------------------------------------------------------------------引包区--------------------------------------
const express = require('express')
//引入解析json的包
const bodyParser = require('body-parser')
//解决跨域问题
const cors = require('cors')
//引入dotenv env  加载 .env 文件中的环境变量，并把它们注入到 Node.js 的 process.env 中。
require('dotenv').config()
//引入path
const path = require('path')

// 引入响应中间件
const responseMiddleware = require('./middleware/responseMiddleware')
// 引入JWT中间件
// const jwtMiddleware = require('./middleware/jwtMiddleware')
// 引入 Token 提取中间件
const extractToken = require('./utils/token')
// 引入错误处理中间件
const errorMiddleware = require('./middleware/errorMiddleware') // 引入错误处理模块
// 引入接口判断
const apiCheckMiddleware = require('./middleware/checkApiMiddleware')
//引入数据库连接检测
const checkDbReady = require('./middleware/checkDbReady')
//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------构建服务器实例区---------------
//创建express实例
const app = express()
//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------使用服务器插件区域-------------
//自定义错误处理函数
app.use(responseMiddleware)
// ✅ 一行搞定数据库检测
app.use(checkDbReady)
app.use(cors())
//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))
//配置解析json数据的中间件
// 使用express.json()来解析json请求体
app.use(express.json())
// 解析URL编码的请求体（表单数据）
app.use(express.urlencoded({ extended: true }))
//---------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------静态资源------------------------------
app.use(express.static(path.join(__dirname, 'public')))
//---------------------------------------------------------------------------路由之前的中间件------------------------

//处理token格式
app.use(extractToken)
// 解析token
// app.use(jwtMiddleware)
// 判断权限
app.use(apiCheckMiddleware)
//---------------------------------------------------------------------------------------------------------------------
//-------------前台模块-------------------------
const frontendRoutes = require('./router/front/index')
app.use('/user', frontendRoutes) // 前台路由
//---------------------------------------------------------------------------------管理员路由模块------------------------
//-------------后台模块-------------------------
const adminRoutes = require('./router/admin/index')
app.use('/admin', adminRoutes) // 后台路由
//---------------------------------------------------------------------------------------------------------------------
// 使用抽离的错误处理中间件
app.use(errorMiddleware)
// 启动服务器
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
