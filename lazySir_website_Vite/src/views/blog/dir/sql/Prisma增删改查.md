---
title: Prisma增删改查
author: lazySir
tags: [prisma,orm]
description: Prisma是一个现代的ORM工具，支持多种数据库。它提供了类型安全的查询和迁移功能，简化了数据库操作。本文将介绍Prisma的基本用法，包括增、删、改、查等操作。
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/prisma笔记总结.png
date: 2023-08-16
---
@[TOC](目录)

<hr>

#  一、单表

**模型**
```ts
model User {
  id    Int     @id @default(autoincrement()) //自增 主键
  createAt DateTime @default(now()) //默认当前时间
  updateAt DateTime @updatedAt //默认当前时间
  name  String?
  email String  @unique
}
```
## 1.增
```ts
//新增用户
const createUser = async (name: string, email: string) => {
  return await prisma.user.create({
    data: {
      name,
      email,
    },
  });
};
```
发送
![Prisma增删改查](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/prisma增删改查1.png)

再次发送
![Prisma增删改查](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/prisma增删改查2.png)
## 自增问题
假如有需要做访问量加一可以使用increment关键字通过数据库底层的操作，避免了分布式模式下的数据抢占问题，同时也不用去专门的去写一个加锁去加一
```ts
async function increment(id:int){
return await prisma.post.update({
where:{id:Number(id)}
}),
data:{
	viewCount:{
	increment:1
	}
}
}


```
## 2.查询所有信息
```ts
const getFindMany = async () => {
  return await prisma.user.findMany();
};
```

```json
{
	"code": 200,
	"data": [
		{
			"id": 1,
			"createAt": "2023-08-16T05:54:56.108Z",
			"updateAt": "2023-08-16T05:54:56.108Z",
			"name": "liu",
			"email": "1@qq.com"
		},
		{
			"id": 7,
			"createAt": "2023-08-16T05:57:26.809Z",
			"updateAt": "2023-08-16T05:57:26.809Z",
			"name": "zzz",
			"email": "2@qq.com"
		}
	]
}
```
## 3.查询以l开头的数据
```ts
const getFindManyWhere = async () => {
  return await prisma.user.findMany({
    where: {
      name: {
        startsWith: "l",
      },
    },
  });
};
```
```ts
{
	"code": 200,
	"data": [
		{
			"id": 1,
			"createAt": "2023-08-16T05:54:56.108Z",
			"updateAt": "2023-08-16T05:54:56.108Z",
			"name": "liu",
			"email": "1@qq.com"
		}
	]
}
```
## 4.查询限定数据
```ts
const getFindManySelect = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      // email:false 这个不行  开始的想法是只写email false 但是不行  
    },
  });
};
```
```json
{
	"code": 200,
	"data": [
		{
			"id": 1,
			"name": "liu"
		},
		{
			"id": 7,
			"name": "zzz"
		}
	]
}
```

## 5.查询唯一的数据
```ts
prisma.user.findUnique({ where: { id } });
```
`prisma.user.findUnique({ where: { id } });` 和 `prisma.user.findMany({ where: { id } })` 都是使用 Prisma 进行数据库查询的方法，但它们之间有一些区别。

1. `prisma.user.findUnique({ where: { id } });`：
   - 这个方法用于查找满足特定条件的单个唯一记录。
   - 它期望返回一个单一的记录，或者如果没有找到匹配的记录，则返回 `null`。
   - 这对于需要获取一条特定记录的情况非常有用，例如使用唯一的主键来查找用户的详细信息。

2. `prisma.user.findMany({ where: { id } })`：
   - 这个方法用于查找满足特定条件的多个记录。
   - 它返回一个记录数组，数组中包含满足查询条件的所有记录。
   - 这对于需要获取多个满足条件的记录的情况非常有用，例如查找所有具有特定属性的用户。

总之，`findUnique` 用于返回一个单一的唯一记录，而 `findMany` 用于返回多个记录。选择使用哪种方法取决于你想要的查询结果是单个记录还是多个记录。
## 6.分页查询
```ts
const getFindManySkip = async () => {
  return await prisma.user.findMany({
    skip: 0,//从skip开始（不包含skip）
    take: 1,//取几条
  });
};
```
skip 等于0 take等于1
```ts
{
	"code": 200,
	"data": [
		{
			"id": 1,
			"createAt": "2023-08-16T05:54:56.108Z",
			"updateAt": "2023-08-16T05:54:56.108Z",
			"name": "liu",
			"email": "1@qq.com"
		}
	]
}
```
skip 等于0 take等于2
```ts
{
	"code": 200,
	"data": [
		{
			"id": 1,
			"createAt": "2023-08-16T05:54:56.108Z",
			"updateAt": "2023-08-16T05:54:56.108Z",
			"name": "liu",
			"email": "1@qq.com"
		},
		{
			"id": 7,
			"createAt": "2023-08-16T05:57:26.809Z",
			"updateAt": "2023-08-16T05:57:26.809Z",
			"name": "zzz",
			"email": "2@qq.com"
		}
	]
}
```
## 7.改
where 里面填要查找的数据，data里面填要修改的数据
```ts
const updateUser = async (name: string, email: string) => {
  return await prisma.user.update({
    where: {
      email,
    },
    data: {
      name,
    },
  });
};
```
## 8.删
```ts
async function deleteUser(id) {
   try {
     const user = await prisma.user.delete({ where: { id } });
     return user;
  } catch (error) {
     console.error(error);
     // 处理错误
 } finally {
    await prisma.$disconnect();
 }
 }
```
# 二、联表
模型
```ts
model User {
  id    Int     @id @default(autoincrement()) //自增 主键
  createAt DateTime @default(now()) //默认当前时间
  updateAt DateTime @default(now()) //默认当前时间
  name  String?
  email String  @unique
  //[]表示一对多 一个User可以有多个Post
  posts Post[] //关联Post 如果不写这个 Post表的authorId字段会报错
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false) //默认false
  authorId  Int?
  //关联User fields: [authorId] 为Post的字段，references: [id] 为User的字段
  author    User?   @relation(fields: [authorId], references: [id])
}

```
## 1.新增文章
```ts
const createArticle = async () => {
  return await prisma.post.create({
    data: {
      title: "hello world",
    },
  });
};
```
```ts
{
	"code": 200,
	"data": {
		"id": 4,
		"title": "hello world",
		"content": null,
		"published": false,
		"authorId": null
	}
}
```
## 2.将文章和用户关联
```ts
const updateArticle = async (id: number, title: string) => {
  return await prisma.post.update({
    where: {
      id: 4,
    },
    //即根据email字段查询user表，然后将查询到的user表的id字段赋值给authorId字段
    data: {
      author: { connect: { email: "1@qq.com" } },
    },
  });
};
```
```ts
{
	"code": 200,
	"data": {
		"id": 4,
		"title": "hello world",
		"content": null,
		"published": false,
		"authorId": 1  //这里是根据1@qq.com的Id来决定的
	}
}
```
## 3.查询用户的同时查询用户的文章
```ts
const findUser = async () => {
  return await prisma.user.findUnique({
    where: {
      email: "1@qq.com",
    },
    //下面这句话表示将与user表关联的表也查询出来
    include: {
      posts: true,
    },
  });
};
```
```ts
{
	"code": 200,
	"data": {
		"id": 1,
		"createAt": "2023-08-16T05:54:56.108Z",
		"updateAt": "2023-08-16T05:54:56.108Z",
		"name": "liu",
		"email": "1@qq.com",
		"posts": [
			{
				"id": 4,
				"title": "hello world",
				"content": null,
				"published": false,
				"authorId": 1
			}
		]
	}
}
```
## 4.关联查询（级联操作，链式调用）
查询了用户表要查询它的关联表中的某种数据
```ts
const findUserDraft = async () => {
  return await prisma.user
    .findUnique({
      where: {
        email: "",
      },
    })
    .posts({
      where: {
        published: false,
      },
    });
};
```