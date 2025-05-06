---
title: nuxt3-prisma配置
author: lazySir
tags: [prisma,orm,nuxt3]
description: nuxt3+prisma配置
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/prisma笔记总结.png
date: 2023-08-16
---

# 一、初始化
```
npm install prisma typescript ts-node @types/node --save-dev
```
> ts-node 用来执行main函数更新数据库 根据实际情况安装，如果不需要的话只需要安装prisma

tsconfig.json添加配置
```ts
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,
    "lib": ["esnext"],
    "esModuleInterop": true
  }
}
```
现在你可以通过前缀npx来调用Prisma CLI:
```
npx prisma
```
接下来，通过使用以下命令创建Prisma schema文件来设置Prisma项目:
```
npx prisma init
```
这个命令创建了一个名为prisma的新目录，其中包含一个名为`schema.prisma`的文件和一个位于项目根目录中的`.env`文件`schema.prisma`包含prisma模式以及数据库连接和prisma客户端生成器。` .env`是一个dotenv用于定义环境变量的文件（用于数据库连接）。
# 二、修改配置
1. 将.env文件中的DATABASE_URL设置为指向现有数据库（修改.env文件中的DATABASE_URL）；
2. 修改schema.prisma文件中的datasource下的provider（有下列选项）；
```
postgresql, mysql, sqlite, sqlserver, mongodb , cockroachdb
```

# 三、创建数据库表
这是官网的示例(直接写在schema.prisma文件中)
```ts
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String   @db.VarChar(255)
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  posts   Post[]
  profile Profile?
}

```
向schema.prisma添加model执行
```
npx prisma migrate dev --name init
```
之后，终端会显示`Your database is now in sync with your schema.`

运行以下命令来检查数据库:
```
npx prisma db pull
```
这个命令读取.env中定义的DATABASE_URL环境变量。并连接到数据库。一旦建立了连接，它就会对数据库进行内省(即读取数据库模式)。然后将数据库模式从SQL转换为Prisma数据模型

>如果使用的是sqlite数据库 可以使用 npx prisma studio命令可视化数据库

# 四、安装Prisma客户端
```
npm install @prisma/client
```
# 五、查询数据库
在server/api中新增getUserInfo.ts文件
```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getFindMany = async () => {
  return await prisma.user.findMany();
};

export default defineEventHandler(async (event) => {
  try {
    const data = await getFindMany();
    return {
      code: 200,
      data,
    };
  } catch (error) {
    console.error(error);
    return sendError(event, createError("Failed to retrieve data!"));
  }
});

```
页面中调用
```ts
$fetch("/api/getUserInfo", {
    method: "get",
  });

```
