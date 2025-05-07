---
title: javaScript数据可视化
author: lazySir
tags: [js,html5]
description: canvas和svg
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js.png
date: 2022-09-28
---

@[TOC](文章目录)
# canvas画布

1. HTML5中新增的一个特性，双闭合标签
2. 默认宽高300*150
3. 浏览器认为canvas标签是一张图片
4. 给canvas画布添加文本内容没有任何意义
5. 给canvas标签添加子节点也没有任何意义
6. 想操作canvas画布：画布当中绘制图形、显示文字 都需要通过js完成
7. canvas标签的w|h需要通过canvas标签属性width|height设置(如果通过样式设置会将坐标轴的xy变化 导致绘画的图形变化)

# 介绍

## 绘制线段

### 起始点设置

moveTo(x,y):把路径移动到画布中的指定点，不创建线条

### 其他点设置（可以有多个）

lineTo(x,y):添加一个新点，然后再画布中创建该点到最后指定点的线条

### 划线方法

stroke（）：起点-->其他店--->最终点

closePath():起始点连接终点

## 属性

### 填充

fillStyle=‘color’ 颜色设置

fill()  填充

### 线段颜色

strokeStyle=‘color’

### 线段宽度

lineWidth=‘20’

### 线段例子

```javascript
// 切记不能通过样式去设置画布的宽度与高度
<canvas height:'500' width:'500'></canvas>
//canvas标签任何操作务必通过JS完成
//通过JS当中“笔”去完成
let canvas = document.querySelector('canvas')
//获取画布的笔{上下文}
let ctx = canvas.getContext('2d');
//绘制线段：绘制线段的起点的设置
ctx.moveTo(100,100)
//其他点的设置
ctx.lineTo(100,200)
ctx.lineTo(200,100)
//设置图形的填充的颜色
ctx.fillStyle='red'
ctx.fill()
//设置线段的颜色
ctx.strokeStyle='blue'
//设置线段的宽度
ctx.lineWidth='20'
//设置起点与终点连接
ctx.closePath()
//stroke方法绘制线段
ctx.stroke()
```

## 绘制矩形

### 第一种方式：

strokeRect（x,y,width,height）

x：距离x轴的距离

y：距离y轴的距离

width、height：矩形的长宽

（没有办法设置填充的颜色）

### 第二种方式

fillRect(x,y,width,height)   

与第一种相比 带填充颜色的矩形  默认是黑色

填充颜色可以替换 （fillStyle=‘color’）

但是需要在fillRect方式之前

### 矩形例子

```javascript
//获取dom对象
let canvas = document.querySelector('canvas')
//获取上下文
let ctx = canvas.getContext('2d')
//绘制矩形第一种方式：参数x,y,w,h
//这种的矩形没有办法设置填充颜色
ctx.strokeRect(100,200,100,200);
//第二种方法绘制矩形
//填充颜色可以替换
//绘制图形之前设置填充颜色
ctx.fillStyle='skyblue'
ctx.fill()//可以不写
ctx.fillRect(300,200,100,200)

```

## 绘制圆形

arc(x,y,radius,starAngle,endAngle,anticlockwise)

x:圆心x的坐标

y：圆心y的坐标

radius：半径

starAngle：开始角度

endAngle：结束角度

anticlockwise：是否逆时针绘制

### 圆形例子

```javascript
//获取dom
let canvas = document.querySelector('canvas')
//获取上下文
let ctx = canvas.getContext('2d')
//绘制圆形
ctx.beginPath();
//绘制圆形的方法：xy，r，起始弧度，结束的弧度，是否逆时针
ctx.arc(100,100,50,0,2*Math.PI,true)
//设置填充颜色
ctx.fillStyle='red'
ctx.fill()
//绘制圆形
ctx.stroke()

//绘制一个圆   
//2 派 弧 = 360 
//所以1弧大约等于57  
ctx.arc(200,200,50,0,1,false)
ctx.stroke()
```

## 清除画布

clearRect(x,y,width,height):

x:离x轴的距离

y:离y轴的距离

width：清除的宽

height：清除的高

### 清除例子

```javascript
//获取dom对象
let canvas = document.querySelector('canvas')
//获取上下文
let ctx = canvas.getContext('2d')
//绘制矩形
ctx.fillRect(100,200,100,200)
//清除整个画布（设置的画布长宽400 600）
ctx.clearRect(0,0,600,400)
```

## 绘制文字

fillText('内容',x,y)

### 属性

font=‘20px 微软雅黑’  大小与字体

<br/>

# svg

## 介绍：

svg是一种基于xml的图像文件格式，它的英文全称为Scalable Vector Graphics 

意味可缩放的矢量图形

## 基本的svg元素
- svg包裹并定义整个矢量图形。svg标签之于矢量图就如同<html>标签之于一个web界面
- <line>创建一条直线
- <polyline>创建折线
- <rect>创建矩形
- <circle>创建圆
- <ellipse>创建园和椭圆
- <polygon>创建多边形
- <path>通过指定点以及点和点之间的线来创建任意形状

## 例子

```javascript
//svg双闭合标签：默认宽度与高度300*150 svg绘制图形务必在svg标签内
//与canvas不同的是svg可以使用css来改变大小等
<svg>

  //绘制直线
  //x1 y1 第一个点的坐标 x2 y2第二个点的坐标 stroke 线的颜色
  //stroke-width=‘’ 线的宽度
  <line x1='100' y1='100' x2='200' y2='200' stroke='red'></line>
  
  
  
    //绘制折线
    //points: x1 y1,x2 y2,x3 y3.....  
    //fill-opacity='0' 设置颜色的透明度  不填充颜色  因为默认是填充黑色
    //stroke='color' 改变颜色
    <polyline fill-opacity='0' stroke='color' points='300 300,50 100,120 400></polyine>


   //绘制矩形
   //fill:填充的颜色
   <rect x='' y='' width='' height='' fill=''></rect>
   
   //绘制圆形
   //cx cy圆心坐标
   //r 半径
   //style  stroke： 线条颜色 fill 填充颜色 等都需要写在style里面
   <circle cx='' cy='' r='' style=''>
   
   //多边形  和折现差不多
   <polygon points='' >
   
   //任意图形
   M 移动到初始位置
   L 画线
   Z 将结束和开始点闭合
   <path d='
   M x0 y0
   L x1 y1
   L x2 y2
   L x3 y3
   Z
   '></path>
</svg>

  
```

# echarts

## 下载

- 在 https://www.jsdelivr.com/package/npm/echarts 选择 dist/echarts.js，点击并保存为 echarts.js 文件。
- 在boot cdn中找在线链接

## 引入

```html
    <!-- 引入刚刚下载的 ECharts 文件 -->
    <script src="echarts.js"></script>
    或者链接
    vue中:import * as echarts from 'echarts'
```

## 基本使用

```javascript
//基于准备好的DOM初始化echarts实例
let dom = document.querySelector('div')
//创建echarts实例
let mycharts = echarts.init(dom)
//指定图标的配置项与数据
mycharts.setOption({
  //图标的标题
  title：{
    //大标题
    text:'数据可视化',
    //子标题
    subtext:'echarts基本使用',
    
    //主标题的颜色
    textStyle：{
      color：''
    },
    //设置标题的位置
    left：center
  },
  //x轴的配置项
  xAxis:{
    //数据
    data:['衣服','直播','游戏','电影']
  },
  //y轴的配置项
  yAxis:{
    //显示y轴的线
    axisLine:{
      show:true
    },
    //显示y轴的刻度
    axisTick:{
      show:true
    }
  },
  //系列的设置：绘制什么样类型的图形，数据的展示在这里设置
  series:[{
    //图标类型的设置
    type:'bar' //柱状图bar  折线图line pie饼图
    //图标的数据
    data:[10,20,30,40]
  }]
})
```

## 展示多个图形

建立多个dom对象 创建多个echarts实例 以及多个图形的配置

## 一个容器展示多个图形

series:[] 里多写对象

## dataset与encode

echarts 4.0新特性 

encode ： 可以设置data的哪个维度被编码成什么

```javascript
let  data=[
['衣服',11,23,'x',30]
['直播',14,25,'y',40]
['游戏',16,21,'z',50]
['电影',18,22,'t',60]
]
let dom = document.querySelect('.e1')
let mycharts = echarts.init(dom)
mycharts.setOption({
  //设置字符集
  datasete:{
    //数据源
    source:data
  },
  xAxis:{    
    data:['衣服','直播','游戏','电影'
    ]},
  yAxis:{},
  series:[
    {
      //饼图
    type:'pie',
    //大小
    width:150,
    height:150,
    //位置
    left：150
    top:100
    //半径
    radius:25
    //data:[]  有了数据源之后就不用写data了
    encode:{
      //饼图旁边的文字
      itemName:3,  //data中索引为3的
      value:4     //data中索引为4的
    }
    }，
    {
      //折线图
      type:'line',
      color:'pink'
      encode:{
        y:2//就是使用data中索引值为2的数据：23,21,25,22
      }
    },
    {
      //柱状图
      type:'bar',
      color:'red',
      encode:{
        y:1 //就是使用data中索引值为1的数据：11，14，16，18
      }
    }
    
    
    
  ]
})
```

## Echarts：组件

除了绘图之外其他部分，都可抽象为【组件】。例如：xAxis、yAxis、grid(直角坐标系底板)、angleAxis(极坐标系角度轴)

![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的数据可视化1.png)


### 组件介绍

- 系列切换组件：legend
- 工具栏组件（下载，缩放等）：toolbox
- 提示框组件：tooltip
- 观看某个区域的（调节x轴）：dataZoom
- 调整布局：grid

### 组件实例

```javascript
let dom = document.querySelector('div')
let mycharts = echarts.init(dom)

mycharts.setOptiton({
  title:{text:"echarts组件"},
  xAxis:{data:['游戏','电影','直播','娱乐']},
  yAxis:{},
  series:[{name:'柱状图',tyoe:'bar',data:[20,30,40,50]},{name:'折线图',type:'line',data:[30,40,50,60]}],
  //提示框组件
  tooltip:{
    //提示框文字颜色
    textStyle:{
      color：'red'
    }
  },
  //图例组件：展示不同的图标,系列切换
  legend:{
    data:['柱状图','折线图']
  },
  //工具栏组件
  toolbox：{}，
  //
})
```

## echarts：坐标系

### 单坐标

![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的数据可视化2.png)


### 双坐标系

![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的数据可视化3.png)


### 多坐标系

![js](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js的数据可视化4.png)


### 一个坐标系：散点图例子

```javascript
let dom = document.querySelector('div')
let mycharts =  echarts.init(dom)

mycharts.setOption({
title:{text:'散点图'},
//x轴
xAxis:{
  //合理化散点图
  type:'category'
},
//y轴
yAxis:{},
series:{
  //散点图的类型
type:'scatter',
//散点图的数据
data:[[10,20],[2,4],[14,53]]
}

}

)
```

### 双坐标系例子

```javascript
let dom =  document.querySelector('div')
let mycharts= echarts.init(dom)

mycharts.setOption({
  title:{text:'双坐标'},
  xAxis:{data:['游戏','直播','经济','娱乐']},
  yAxis:[
{
      //显示y轴的线
    axisLine:{show:true},
    //显示Y轴的刻度
    axisTick:{show:true},
},{
      //显示y轴的线
    axisLine:{show:true},
    //显示Y轴的刻度
    axisTick:{show:true},
}
    ],//如果要两个y轴那么就要将y轴改为数组
  series:[
    {type:'line',data:[10,20,30,40],yAxisIndex:0//用的是y轴数组里的哪一个索引
    },
    {type:'bar',data:[10,20,30,50]},yAxisIndex:1//用的是y轴数组里的哪一个索引
    ],

})
```
