---
title: vue2封装分页器
author: lazySir
tags: [vue2]
description: vue2封装分页器
cover: 
date: 2022-09-16
---
# 分页器封装业务分析:

## 封装分页器组件的时候：需要知道哪些条件？

1.total ----【100条数据】：分页器组件需要知道我一共展示多少条数据

2.pageSize------【每一页3条数据】：每一个需要展示几条数据

3.pageNo-------[当前在第几页]需要知道当前在第几页

4.continues-------【连续页码数】：需要知道连续页码数【起始数字、结束数字：连续页码数市场当中一般5、7、9】奇数，对称好看 

显示连续页码数：

```JavaScript
<template>
  <div class="pagination">
    <button 
    :disabled='this.pageNo==1' 
    @click='backTo(pageNo-1)'>上一页</button>
    <button @click='backTo(1)' :class='{active:pageNo==1}'>1</button>
    <button v-if='starNumAndEndNum.start>2'>···</button>
    <button 
    v-for="(page,index) in starNumAndEndNum.end" 
    :key='index' v-if='page>starNumAndEndNum.start'
    @click='backTo(page)'
      :class='{active:pageNo==page}'
    >{{page}}</button>
    <button v-if='starNumAndEndNum.end<totalPage-1'>···</button>
    <button 
    @click='backTo(this.totalPage)' 
    v-if='starNumAndEndNum.end<totalPage'
          :class='{active:pageNo==totalPage}'
    >{{totalPage}}</button>
    <button :disabled='pageNo==totalPage' @click='backTo(pageNo+1)'>下一页</button>
    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props:['pageNo','pageSize','total','continues'],
  computed:{
    //计算出总共多少页
    totalPage(){
      return Math.ceil(this.total/this.pageSize)
    },
    //计算出起始的连续数字
    starNumAndEndNum(){
      const { continues, pageNo, totalPage } = this;
      //定义初始和结束位置
      let start=0,end=1
      //不正常现象 ：连续页码数大于总页数
      if(continues>totalPage){
        start=1
        end=totalPage
      }else{
        //正常情况  连续页码数小于总页数
        start=pageNo-parseInt(continues/2)
        end=pageNo+parseInt(continues/2)
        //如果出现不正常现象（start数字小于等于0）
        if(start<=0){
          start=1,
          end=continues
        }
        if(end>totalPage){
          end=totalPage
          start=totalPage - continues + 1  
          //总共31   
          //pageNo=30    
           //27 28 29 30 31
        }
        
      }
       return { start, end };
    }
  },
  methods:{
    backTo(target){
     return  this.$emit('getPageNo',target)
    }
  }
}
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
```

3)分页器封装
3.1进行单元测试

连续页码5: 8   [6,7,8,9,10] 
连续页码7: 8   [5,6,7,8,9,10,11]

连续页码5:  8   [6,7,8,9,10]
连续页码7:  8   [5,6,7,8,9,10,11]

经典面试题：v-for与v-if优先级？ v-for优先级更高

//正常情况：再回来因该还是第一页【遇见脑袋xxxx产品可能有这种操作】
4)需求：最后这个需求可以书写、可以不书写【正常说：没有这个需求的】
比如:2021年10月30日11:47:44 点击分页器   第四页 ->网站关闭了
但是2021年11月11日11:48:12  打开这个项目 第四页 -->本地存储
