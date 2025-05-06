---
title: SQL笔记总结
author: lazySir
tags: [sql,mysql]
description: mysql笔记总结
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结.png
date: 2024-05-17
---
# 一、SQL基础
## 1.SQL SELECT
SELECT语句用于从数据库中选取数据
结果被存储在一个结果表中，称为结果集。
### 1.语法
```sql
#这个是搜索table表中column1，column2的内容
SELECT column1, column2, ...
FROM table
```
与
```sql
#这个是搜索table表的所有内容
SELECT * FROM table
```
## 2.SQL SELECT DSITINCT
用于返回唯一不同的值
```
# 假设以下表的名字为table表
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
+----+--------------+---------------------------+-------+---------+

```
当我只想要返回country有什么不同的值时，
```sql
select distinct country from table
```
则结果集
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/SQL笔记总结1.png)

## 3.SELECT WHERE语句
where子句用于提取那些满足指定条件的记录

### 1.运算符
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结2.png)

### 2.逻辑运算
And:与 同时满足两个条件的值。
```sql
Select * from emp where sal > 2000 and sal < 3000;
查询 EMP 表中 SAL 列中大于 2000 小于 3000 的值。
```
Or:或 满足其中一个条件的值
```sql
Select * from emp where sal > 2000 or comm > 500;
查询 emp 表中 SAL 大于 2000 或 COMM 大于500的值。
```
Not:非 满足不包含该条件的值。
```sql
select * from emp where not sal > 1500;
查询EMP表中 sal 小于等于 1500 的值。
```
### 3.逻辑运算的优先级：

()    not        and         or
### 4.特殊条件
1.空值判断： is null
```sql
Select * from emp where comm is null;
查询 emp 表中 comm 列中的空值。
```
2.between and (在 之间的值)
```sql
Select * from emp where sal between 1500 and 3000;
查询 emp 表中 SAL 列中大于 1500 的小于 3000 的值。

注意：大于等于 1500 且小于等于 3000， 1500 为下限，3000 为上限，下限在前，上限在后，查询的范围包涵有上下限的值。
```
3.In
```sql
Select * from emp where sal in (5000,3000,1500);
查询 EMP 表 SAL 列中等于 5000，3000，1500 的值。
```
4.like

Like模糊查询
```sql
Select * from emp where ename like 'M%';
查询 EMP 表中 Ename 列中有 M 的值，M 为要查询内容中的模糊信息。
```
 1. % 表示多个字值，_ 下划线表示一个字符；
 2. M% : 为能配符，正则表达式，表示的意思为模糊查询信息为 M 开头的。
 3. %M% : 表示查询包含M的所有内容。
 4. %M_ : 表示查询以M在倒数第二位的所有内容。

### 5.不带比较运算符的 WHERE 子句：

WHERE 子句并不一定带比较运算符，当不带运算符时，会执行一个隐式转换。当 0 时转化为 false，1 转化为 true。例如：

SELECT studentNO FROM student WHERE 0
则会返回一个空集，因为每一行记录 WHERE 都返回 false。

SELECT  studentNO  FROM student WHERE 1
返回 student 表所有行中 studentNO 列的值。因为每一行记录 WHERE 都返回 true。

## 4.SQL ORDER BY
order by关键字用于对结果集进行排序。
默认是升序排序（ASC），如果需要降序排序（DESC）
```sql
SELECT column1, column2, ...
FROM table_name
ORDER BY column1, column2, ... ASC|DESC;
```

## 5.SQL INSERT INTO
insert into语句用于向表中插入新纪录
### 1.语法
1. 第一种形式无需指定要插入数据的列名，只需提供被插入的值即可：
```sql
INSERT INTO table_name
VALUES (value1,value2,value3,...);
```
2. 第二种形式需要指定列名及被插入的值：
```sql
INSERT INTO table_name (column1,column2,column3,...)
VALUES (value1,value2,value3,...);
```
### 2.参数说明：
>table_name：需要插入新记录的表名。
column1, column2, ...：需要插入的字段名。
value1, value2, ...：需要插入的字段值。

## 6.SQL UPDATE
update语句用于更新表中的记录

### 1.语法
```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```
### 2.参数说明：

1. table_name：要修改的表名称。
2. column1, column2, ...：要修改的字段名称，可以为多个字段。
3. value1, value2, ...：要修改的值，可以为多个值。
4. condition：修改条件，用于指定哪些数据要修改。

## 7.SEL DELETE
DELETE 语句用于删除表中的记录

### 1.语法
```sql
DELETE FROM table_name
WHERE condition;
```
### 2.参数说明：

table_name：要删除的表名称。
condition：删除条件，用于指定哪些数据要删除。

# 二、SQL高级教程
## 1.SQL SELECT TOP
SELECT TOP 子句用于规定要返回的记录的数目。

SELECT TOP 子句对于拥有数千条记录的大型表来说，是非常有用的。
>
>SELECT TOP 子句用于规定要返回的记录的数目。
>SELECT TOP 子句对于拥有数千条记录的大型表来说，是非常有用的。

### 1.SQL Server / MS Access 语法
```sql
# 可以选择具体的数据或者百分比
SELECT TOP number|percent column_name(s)
FROM table_name;
```
### 2.MySQL 语法
```sql
SELECT column_name(s)
FROM table_name
LIMIT number;
```
### 3.Oracle 语法
```sql
SELECT column_name(s)
FROM table_name
WHERE ROWNUM <= number;
#实例
SELECT *
FROM Persons
WHERE ROWNUM <=5;
```
## 2.SQL通配符
在 SQL 中，通配符与 SQL LIKE 操作符一起使用。

SQL 通配符用于搜索表中的数据。

在 SQL 中，可使用以下通配符：![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结3.png)

### 1.使用SQL[charlist]通配符
下面的 SQL 语句选取 name 以 "G"、"F" 或 "s" 开始的所有网站：
```sql
SELECT * FROM Websites
WHERE name REGEXP '^[GFs]';
```
下面的 SQL 语句选取 name 以 A 到 H 字母开头的网站：
```sql
SELECT * FROM Websites
WHERE name REGEXP '^[A-H]';
```
下面的 SQL 语句选取 name 不以 A 到 H 字母开头的网站：
```sql
SELECT * FROM Websites
WHERE name REGEXP '^[^A-H]';
```
## 3.SQL IN
### 1.语法
IN 操作符允许您在 WHERE 子句中规定多个值。
```sql
SELECT column1, column2, ...
FROM table_name
WHERE column IN (value1, value2, ...);
```
### 2.参数说明：

column1, column2, ...：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
table_name：要查询的表名称。
column：要查询的字段名称。
value1, value2, ...：要查询的值，可以为多个值。

## 4.SQL 别名
通过使用 SQL，可以为表名称或列名称指定别名。

基本上，创建别名是为了让列名称的可读性更强。

### 1.列的 SQL 别名语法
```sql
SELECT column_name AS alias_name
FROM table_name;
```
### 2.表的 SQL 别名语法
```sql
SELECT column_name(s)
FROM table_name AS alias_name;
```

### 3.列的别名实例
下面的 SQL 语句指定了两个别名，一个是 name 列的别名，一个是 country 列的别名。
>提示：如果列名称包含空格，要求使用双引号或方括号：
```sql
SELECT name AS n, country AS c
FROM Websites;
```
执行输出结果
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结4.png)

### 4.concat
在下面的 SQL 语句中，我们把三个列（url、alexa 和 country）结合在一起，并创建一个名为 "site_info" 的别名：
```sql
SELECT name, CONCAT(url, ', ', alexa, ', ', country) AS site_info
FROM Websites;
```
执行输出结果
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结5.png)

### 5.表的别名实例
下面的 SQL 语句选取 "菜鸟教程" 的所有访问记录。我们使用 "Websites" 和 "access_log" 表，并分别为它们指定表别名 "w" 和 "a"（通过使用别名让 SQL 更简短）：
```sql
SELECT w.name, w.url, a.count, a.date FROM Websites AS w, access_log AS a  WHERE a.site_id=w.id and w.name="菜鸟教程";
```
执行输出结果
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结6.png)

## 5.SQL 连接（JOIN）
### 1.SQL JOIN
SQL JOIN 子句用于把来自两个或多个表的行结合起来，基于这些表之间的共同字段。

最常见的 JOIN 类型：SQL INNER JOIN（简单的 JOIN）。 SQL INNER JOIN 从多个表中返回满足 JOIN 条件的所有行。

**语句**
```sql
SELECT column1, column2, ...
FROM table1
JOIN table2 ON condition;
```
**参数结果**
column1, column2, ...：要选择的字段名称，可以为多个字段。如果不指定字段名称，则会选择所有字段。
table1：要连接的第一个表。
table2：要连接的第二个表。
condition：连接条件，用于指定连接方式。

**演示数据库**
```
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
| 7  | stackoverflow | http://stackoverflow.com/ |   0 | IND     |
+----+---------------+---------------------------+-------+---------+

```
下面是 "access_log" 网站访问记录表的数据：
```
mysql> SELECT * FROM access_log;
+-----+---------+-------+------------+
| aid | site_id | count | date       |
+-----+---------+-------+------------+
|   1 |       1 |    45 | 2016-05-10 |
|   2 |       3 |   100 | 2016-05-13 |
|   3 |       1 |   230 | 2016-05-14 |
|   4 |       2 |    10 | 2016-05-14 |
|   5 |       5 |   205 | 2016-05-14 |
|   6 |       4 |    13 | 2016-05-15 |
|   7 |       3 |   220 | 2016-05-15 |
|   8 |       5 |   545 | 2016-05-16 |
|   9 |       3 |   201 | 2016-05-17 |
+-----+---------+-------+------------+
9 rows in set (0.00 sec)

```
请注意，"Websites" 表中的 "id" 列指向 "access_log" 表中的字段 "site_id"。上面这两个表是通过 "site_id" 列联系起来的。

然后，如果我们运行下面的 SQL 语句（包含 INNER JOIN）：

**实例**
```sql
SELECT Websites.id, Websites.name, access_log.count, access_log.date FROM WebsitesINNER JOIN access_logON Websites.id=access_log.site_id;
```

### 2.SQL INNER JOIN
INNER JOIN 关键字在表中存在至少一个匹配时返回行。
**SQL INNER JOIN语法**
```sql
SELECT column_name(s)
FROM table1
INNER JOIN table2
ON table1.column_name=table2.column_name;
```
或者
```sql
SELECT column_name(s)
FROM table1
JOIN table2
ON table1.column_name=table2.column_name;
```
**参数说明：**
1. columns：要显示的列名。
2. table1：表1的名称。
3. table2：表2的名称
4. column_name：表中用于连接的列名。
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结7.png)

### 3.SQL LEFT JOIN 关键字
LEFT JOIN 关键字从左表（table1）返回所有的行，即使右表（table2）中没有匹配。如果右表中没有匹配，则结果为 NULL。

**SQL LEFT JOIN 语法**
```sql
SELECT column_name(s)
FROM table1
LEFT JOIN table2
ON table1.column_name=table2.column_name;
```
或：
```sql
SELECT column_name(s)
FROM table1
LEFT OUTER JOIN table2
ON table1.column_name=table2.column_name;
```
**演示数据库**
下面是选自 "Websites" 表的数据：
```
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
| 7  | stackoverflow | http://stackoverflow.com/ |   0 | IND     |
+----+---------------+---------------------------+-------+---------+

```
下面是 "access_log" 网站访问记录表的数据：
```
mysql> SELECT * FROM access_log;
+-----+---------+-------+------------+
| aid | site_id | count | date       |
+-----+---------+-------+------------+
|   1 |       1 |    45 | 2016-05-10 |
|   2 |       3 |   100 | 2016-05-13 |
|   3 |       1 |   230 | 2016-05-14 |
|   4 |       2 |    10 | 2016-05-14 |
|   5 |       5 |   205 | 2016-05-14 |
|   6 |       4 |    13 | 2016-05-15 |
|   7 |       3 |   220 | 2016-05-15 |
|   8 |       5 |   545 | 2016-05-16 |
|   9 |       3 |   201 | 2016-05-17 |
+-----+---------+-------+------------+
9 rows in set (0.00 sec)

```
**SQL LEFT JOIN 实例**
下面的 SQL 语句将返回所有网站及他们的访问量（如果有的话）。

以下实例中我们把 Websites 作为左表，access_log 作为右表：
```sql
SELECT Websites.name, access_log.count, access_log.date
	FROM Websites
	LEFT JOIN access_log
	ON Websites.id=access_log.site_id
	ORDER BY access_log.count DESC;
```
执行后
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结8.png)

### 4.SQL RIGHT JOIN 关键字
RIGHT JOIN 关键字从右表（table2）返回所有的行，即使左表（table1）中没有匹配。如果左表中没有匹配，则结果为 NULL。

**SQL RIGHT JOIN 语法**
```sql
SELECT column_name(s)
FROM table1
RIGHT JOIN table2
ON table1.column_name=table2.column_name;
#或：
SELECT column_name(s)
FROM table1
RIGHT OUTER JOIN table2
ON table1.column_name=table2.column_name;
```
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结9.png)

**演示数据库**
下面是选自 "Websites" 表的数据：
```
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
| 7  | stackoverflow | http://stackoverflow.com/ |   0 | IND     |
+----+---------------+---------------------------+-------+---------+

```
下面是 "access_log" 网站访问记录表的数据：
```
mysql> SELECT * FROM access_log;
+-----+---------+-------+------------+
| aid | site_id | count | date       |
+-----+---------+-------+------------+
|   1 |       1 |    45 | 2016-05-10 |
|   2 |       3 |   100 | 2016-05-13 |
|   3 |       1 |   230 | 2016-05-14 |
|   4 |       2 |    10 | 2016-05-14 |
|   5 |       5 |   205 | 2016-05-14 |
|   6 |       4 |    13 | 2016-05-15 |
|   7 |       3 |   220 | 2016-05-15 |
|   8 |       5 |   545 | 2016-05-16 |
|   9 |       3 |   201 | 2016-05-17 |
|  10 |       6 |   111 | 2016-03-19 |
+-----+---------+-------+------------+
9 rows in set (0.00 sec)

```
**SQL RIGHT JOIN 实例**
下面的 SQL 语句将返回网站的访问记录。

以下实例中我们把 Websites 作为左表，access_log 作为右表
```sql
SELECT websites.name, access_log.count, access_log.date
FROM websites
RIGHT JOIN access_log
ON access_log.site_id=websites.id
ORDER BY access_log.count DESC;
```
执行SQL输出后
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结10.png)

### 5.SQL FULL JOIN
FULL OUTER JOIN 关键字只要左表（table1）和右表（table2）其中一个表中存在匹配，则返回行.

FULL OUTER JOIN 关键字结合了 LEFT JOIN 和 RIGHT JOIN 的结果。

**SQL FULL OUTER JOIN 语法**
```sql
SELECT column_name(s)
FROM table1
FULL OUTER JOIN table2
ON table1.column_name=table2.column_name;
```
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结11.png)

**演示数据库**
在本教程中，我们将使用 RUNOOB 样本数据库。

下面是选自 "Websites" 表的数据：
```sql
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
| 7  | stackoverflow | http://stackoverflow.com/ |   0 | IND     |
+----+---------------+---------------------------+-------+---------+

```
下面是 "access_log" 网站访问记录表的数据：
```
+-----+---------+-------+------------+
| aid | site_id | count | date       |
+-----+---------+-------+------------+
|   1 |       1 |    45 | 2016-05-10 |
|   2 |       3 |   100 | 2016-05-13 |
|   3 |       1 |   230 | 2016-05-14 |
|   4 |       2 |    10 | 2016-05-14 |
|   5 |       5 |   205 | 2016-05-14 |
|   6 |       4 |    13 | 2016-05-15 |
|   7 |       3 |   220 | 2016-05-15 |
|   8 |       5 |   545 | 2016-05-16 |
|   9 |       3 |   201 | 2016-05-17 |
+-----+---------+-------+------------+
9 rows in set (0.00 sec)


```
**SQL FULL OUTER JOIN 实例**
下面的 SQL 语句选取所有网站访问记录。

MySQL中不支持 FULL OUTER JOIN，你可以在 SQL Server 测试以下实例。
```sql
SELECT Websites.name, access_log.count, access_log.date
	FROM Websites

	FULL OUTER JOIN access_log
	ON Websites.id=access_log.site_id
	ORDER BY access_log.count DESC;

```
>注释：FULL OUTER JOIN 关键字返回左表（Websites）和右表（access_log）中所有的行。如果 "Websites" 表中的行在 "access_log" 中没有匹配或者 "access_log" 表中的行在 "Websites" 表中没有匹配，也会列出这些行。
### 6.小记
A inner join B 取交集。

A left join B 取 A 全部，B 没有对应的值为 null。

A right join B 取 B 全部 A 没有对应的值为 null。

A full outer join B 取并集，彼此没有对应的值为 null。

对应条件在 on 后面填写。

## 6.SQL UNION 操作符
SQL UNION 操作符合并两个或多个 SELECT 语句的结果。
UNION 操作符用于合并两个或多个 SELECT 语句的结果集。

请注意，UNION 内部的每个 SELECT 语句必须拥有相同数量的列。列也必须拥有相似的数据类型。同时，每个 SELECT 语句中的列的顺序必须相同。

**SQL UNION 语法**
```sql
SELECT column_name(s) FROM table1
UNION
SELECT column_name(s) FROM table2;
```
注释：默认地，UNION 操作符选取不同的值。如果允许重复的值，请使用 UNION ALL。

**SQL UNION ALL 语法**
```sql
SELECT column_name(s) FROM table1
UNION ALL
SELECT column_name(s) FROM table2;

```
>注释：UNION 结果集中的列名总是等于 UNION 中第一个 SELECT 语句中的列名。

**演示数据库**

websites
```
mysql> SELECT * FROM Websites;
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
| 7  | stackoverflow | http://stackoverflow.com/ |   0 | IND     |
+----+---------------+---------------------------+-------+---------+

```
apps APP
```
mysql> SELECT * FROM apps;
+----+------------+-------------------------+---------+
| id | app_name   | url                     | country |
+----+------------+-------------------------+---------+
|  1 | QQ APP     | http://im.qq.com/       | CN      |
|  2 | 微博 APP | http://weibo.com/       | CN      |
|  3 | 淘宝 APP | https://www.taobao.com/ | CN      |
+----+------------+-------------------------+---------+
3 rows in set (0.00 sec)

```
**SQL UNION 实例**
下面的 SQL 语句从 "Websites" 和 "apps" 表中选取所有不同的country（只有不同的值）：
```sql
SELECT country FROM WebsitesUNIONSELECT country FROM appsORDER BY country;
```
执行SQL输出结果如下
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结12.png)

>注释：UNION 不能用于列出两个表中所有的country。如果一些网站和APP来自同一个国家，每个国家只会列出一次。UNION 只会选取不同的值。请使用 UNION ALL 来选取重复的值！

```sql
SELECT country FROM WebsitesUNION ALLSELECT country FROM apps
	ORDER BY country;
```
执行SQL输出结果如下
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结13.png)


## 7.SQL SELECT INTO
通过 SQL，您可以从一个表复制信息到另一个表。

SELECT INTO 语句从一个表复制数据，然后把数据插入到另一个新表中。

>注意：
MySQL 数据库不支持 SELECT ... INTO 语句，但支持 INSERT INTO ... SELECT 。
当然你可以使用以下语句来拷贝表结构及数据：
```sql
CREATE TABLE 新表
AS
SELECT * FROM 旧表 

```
**SQL SELECT INTO 语法**

```sql
#我们可以复制所有的列插入到新表中：
SELECT *
INTO newtable [IN externaldb]
FROM table1;
#或者只复制希望的列插入到新表中：
SELECT column_name(s)
INTO newtable [IN externaldb]
FROM table1;
```

## 8.SQL INSERT INTO SELECT
通过 SQL，您可以从一个表复制信息到另一个表。

INSERT INTO SELECT 语句从一个表复制数据，然后把数据插入到一个已存在的表中。

**SQL INSERT INTO SELECT 语句**
INSERT INTO SELECT 语句从一个表复制数据，然后把数据插入到一个已存在的表中。目标表中任何已存在的行都不会受影响。

**SQL INSERT INTO SELECT 语法**
我们可以从一个表中复制所有的列插入到另一个已存在的表中：
```sql
INSERT INTO table2
SELECT * FROM table1;

#或者我们可以只复制指定的列插入到另一个已存在的表中：

INSERT INTO table2
(column_name(s))
SELECT column_name(s)
FROM table1;
```
## 9.SQL CREATE DATABASE
用于创建数据库
**语法**
```sql
CREATE DATABASE dbname;
```

## 10.SQL CREATE TABLE 语句
SQL CREATE TABLE 语句
CREATE TABLE 语句用于创建数据库中的表。

表由行和列组成，每个表都必须有个表名。

SQL CREATE TABLE 语句
CREATE TABLE 语句用于创建数据库中的表。

表由行和列组成，每个表都必须有个表名。

**SQL CREATE TABLE 语法**
```sql
CREATE TABLE table_name
(
column_name1 data_type(size),
column_name2 data_type(size),
column_name3 data_type(size),
....
);
```
column_name 参数规定表中列的名称。

data_type 参数规定列的数据类型（例如 varchar、integer、decimal、date 等等）。

size 参数规定表中列的最大长度。
**实例**
```sql
CREATE TABLE Persons
(
PersonID int,
LastName varchar(255),
FirstName varchar(255),
Address varchar(255),
City varchar(255)
);
```

## 11.SQL约束
1. NOT NULL - 指示某列不能存储 NULL 值。
2. UNIQUE - 保证某列的每行必须有唯一的值。
3. PRIMARY KEY - NOT NULL 和 UNIQUE 的结合。确保某列（或两个列多个列的结合）有唯一标识，有助于更容易更快速地找到表中的一个特定的记录。
4. FOREIGN KEY - 保证一个表中的数据匹配另一个表中的值的参照完整性。
5. CHECK - 保证列中的值符合指定的条件。
6. DEFAULT - 规定没有给列赋值时的默认值。

### 1.外键介绍
一个表中的 FOREIGN KEY 指向另一个表中的 UNIQUE KEY(唯一约束的键)。

让我们通过一个实例来解释外键。请看下面两个表：
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结14.png)

### 2.约束介绍
CHECK 约束用于限制列中的值的范围。

如果对单个列定义 CHECK 约束，那么该列只允许特定的值。

如果对一个表定义 CHECK 约束，那么此约束会基于行中其他列的值在特定的列中对值进行限制。

**ALTER TABLE 时的 SQL CHECK 约束**

当表已被创建时，如需在 "P_Id" 列创建 CHECK 约束，请使用下面的 SQL：
```sql
MySQL / SQL Server / Oracle / MS Access:

ALTER TABLE Persons
ADD CHECK (P_Id>0)
```
如需命名 CHECK 约束，并定义多个列的 CHECK 约束，请使用下面的 SQL 语法：
```sql
MySQL / SQL Server / Oracle / MS Access：

ALTER TABLE Persons
ADD CONSTRAINT chk_Person CHECK (P_Id>0 AND City='Sandnes')
```
撤销 CHECK 约束
如需撤销 CHECK 约束，请使用下面的 SQL：
```sql
SQL Server / Oracle / MS Access：

ALTER TABLE Persons
DROP CONSTRAINT chk_Person
MySQL：

ALTER TABLE Persons
DROP CHECK chk_Person
```
# 三、函数
## 1.平均值
AVG函数
```sql
SELECT AVG(column_name) FROM table_name
```
## 2.返回条数
SQL COUNT(column_name) 语法
```sql
COUNT(column_name) 函数返回指定列的值的数目（NULL 不计入）：

SELECT COUNT(column_name) FROM table_name;
SQL COUNT(*) 语法
COUNT(*) 函数返回表中的记录数：

SELECT COUNT(*) FROM table_name;
```

## 3.第一个值
FIRST（）
## 4.最后一个值
LAST()
## 5.最大值
MAX（）
## 6.最小值
MIN（）
## 7.求和
SUM()

## 8.分组、聚合

GROUP BY 语句用于结合聚合函数，根据一个或多个列对结果集进行分组。

**演示数据库**

下面是选自 "Websites" 表的数据：
```
+----+--------------+---------------------------+-------+---------+
| id | name         | url                       | alexa | country |
+----+--------------+---------------------------+-------+---------+
| 1  | Google       | https://www.google.cm/    | 1     | USA     |
| 2  | 淘宝          | https://www.taobao.com/   | 13    | CN      |
| 3  | 菜鸟教程      | http://www.runoob.com/    | 4689  | CN      |
| 4  | 微博          | http://weibo.com/         | 20    | CN      |
| 5  | Facebook     | https://www.facebook.com/ | 3     | USA     |
| 7  | stackoverflow | http://stackoverflow.com/ |   0 | IND     |
+----+---------------+---------------------------+-------+---------+

```

下面是 "access_log" 网站访问记录表的数据：
```
mysql> SELECT * FROM access_log;
+-----+---------+-------+------------+
| aid | site_id | count | date       |
+-----+---------+-------+------------+
|   1 |       1 |    45 | 2016-05-10 |
|   2 |       3 |   100 | 2016-05-13 |
|   3 |       1 |   230 | 2016-05-14 |
|   4 |       2 |    10 | 2016-05-14 |
|   5 |       5 |   205 | 2016-05-14 |
|   6 |       4 |    13 | 2016-05-15 |
|   7 |       3 |   220 | 2016-05-15 |
|   8 |       5 |   545 | 2016-05-16 |
|   9 |       3 |   201 | 2016-05-17 |
+-----+---------+-------+------------+
9 rows in set (0.00 sec)

```
**实例**
```sql
SELECT site_id, SUM(access_log.count) AS 
	nums FROM access_log GROUP BY site_id;

```
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结15.png)

## 9.筛选
在 SQL 中增加 HAVING 子句原因是，WHERE 关键字无法与聚合函数一起使用。

HAVING 子句可以让我们筛选分组后的各组数据。

```sql
SELECT Websites.name, Websites.url, SUM(access_log.count) AS nums FROM (access_log
INNER JOIN Websites
ON access_log.site_id=Websites.id)
GROUP BY Websites.name
HAVING SUM(access_log.count) > 200;
```

## 11.字段转大写
UCASE（）
```sql
SELECT UCASE(name) AS site_title, urlFROM Websites;

```
## 12.字段转小写
LCASE（）

## 13.截取字符
MID()
```sql
SELECT MID(column_name[,start,length]) FROM table_name;
```
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结16.png)

## 14.返回字段长度
LEN（）

```sql
SELECT LEN(column_name) FROM table_name;
```

## 15.四舍五入
ROUND（）
```sql
SELECT ROUND(column_name,decimals) FROM TABLE_NAME;
```
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结17.png)

## 16.格式化
FORMAT()
```sql
SELECT FORMAT(column_name,format) FROM table_name;
```
![MySQL笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/mysql笔记总结18.png)



