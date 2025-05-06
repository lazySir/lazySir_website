---
title: node连接mysql
author: lazySir
tags: [node.js,npm]
description: node连接mysql
cover: 
date: 2022-10-01
---
# 一、下载

```JavaScript
npm i mysql
```

# 二、配置文件
在使用 mysql 模块操作 MySQL 数据库之前，必须先对 mysql 模块进行必要的配置，主要的配置步骤如下：
```JavaScript
const mysql = require('mysql')

const db=mysql.createPool({
host:'localhost',//要连接到的数据库的主机名。（默认值：localhost)
port:'3306',//要连接到的端口号。（默认值：3306)
user:'root',
password:'',
database:'shop'//数据库名
})

module.exports=db
```

# 三、使用

```JavaScript
//导入数据库
const db = require('配置位置')
```

# 四、mysql的方法
## 1.增删改查操作
### 1.1查询数据
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d20aff54104206f08f0afb2760c6a1ee.png)
### 1.2插入数据
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/90f4409228078a81cfc0e3f0993d4112.png)
#### 2.1.1插入数据的便捷方式
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/43bc82abea2b257172a9295d7c350e2f.png)

> 要求：
向表中新增数据时，如果数据对象的每个属性和数据表的字段一一对应，则可以通过如下方式快速插入数据：

### 1.3更新数据
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2964b2c653944362d0d493846c0734fc.png)
#### 3.1.1更新数据的便捷方式
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/78ba7dee4884e1846e61a03732d9240c.png)

>要求
更新表数据时，如果数据对象的每个属性和数据表的字段一一对应，则可以通过如下方式快速更新表数据：

### 1.4删除数据
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/87644f78cc352dcb6e4f204aee8de4f8.png)
#### 1.4.1 标记删除
使用 DELETE 语句，会把真正的把数据从表中删除掉。为了保险起见，推荐使用标记删除的形式，来模拟删除的动作。
所谓的标记删除，就是在表中设置类似于 status 这样的状态字段，来标记当前这条数据是否被删除。
当用户执行了删除的动作时，我们并没有执行 DELETE 语句把数据删除掉，而是执行了 UPDATE 语句，将这条数据对应的 status 字段标记为删除即可。
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6aede684bdd48d746bf5a7c21857693a.png)

## 2.查询总数count

```javascript
 let total=0
 const sql = 'select count(*) as total from 表名 '
      db.query(sql, (err, results) => {
        if (err) reject(err)
        if (results == null) reject('无记录')
        //results[0]代表的就是total 总共条数
        total = results[0]['total']
        }
```
## 3.限制查询limit
格式 limit x,x  
例子：limit 3，5 表示从第三条数据开始往后面获取五条数据  4，5，6，7，8
### 3.1案例：page（分页器）

```javascript
	const {limit,page} = req.params //获取前端传过来的页数和显示条数
    //所以先计算出起始位置
    page = (page - 1) * limit
    const sqlA = `select * from 表明limit ${page},${limit}  `
    db.query(sqlA, (err, results1) => {
      if (err) return res.cc(err)
      //results1就是获取到的数据
      res.json({
        code: 200,
        message: '获取数据成功',
        data: {
          total,
          list: results1,
        },
      })
    })
```
