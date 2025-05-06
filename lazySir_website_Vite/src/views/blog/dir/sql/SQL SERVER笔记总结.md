---
title: SQL SERVER笔记总结
author: lazySir
tags: [sql,sql server]
description: SQL SERVER是微软公司开发的一款关系型数据库管理系统，广泛应用于企业级应用和数据分析。本文总结了SQL SERVER的一些基本概念、常用命令和技巧，帮助读者更好地理解和使用SQL SERVER。
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/sqlServer笔记总结.png
date: 2024-07-26
---

# 一、sqlserver介绍

**打开数据库：**

1. cmd：net start sqlmysql
2. sql server配置管理器
3. windows服务



**备份**

1. 数据库的分离与附加（分离和删除的区别在于硬盘上是否还留存有数据库文件）
2. 数据库的备份与还原
3. 数据库脚本的保存



**后缀**

mdf：数据文件 

ldf：日志文件

# 二、创建数据库

## 1.检查数据库名是否存在

如果需要创建数据库，可能出现数据库名字重名的现象，可以用以下代码查询数据库名是否存在，存在则删除此数据库

```sql
if exists(select * from sys.databases where name = 'DBname') 
	drop database DBname
```

> 系统数据库->master-->视图-->系统视图-->sys.databases存着所有的数据库信息

此代码检查数据库中是否存在DBname数据库，如果存在时则删除此数据库，此处理方式最好只在学习阶段使用，在正式生存环境中慎用，操作不当可能删除重要数据。


## 2.语法

```sql
create database DBname --DBname 为自定义库名
on --数据文件
(
	name = 'DBname', --逻辑名称 一般与库名保持一致
	filename = 'D:\SQL server\DB\study\DBTEST.mdf',--物理路径和名称
    size = 5MB,--文件的初始大小
	filegrowth = 2MB--数据文件的增长大小，也可以写百分比，比如5mb满了变7MB

    
)

log on --日志文件
(
	name = 'DBname_log', --逻辑名称 一般与库名保持一致
	filename = 'D:\SQL server\DB\study\DBTEST_log.ldf',--物理路径和名称
    size = 5MB,--文件的初始大小
	filegrowth = 2MB--数据文件的增长大小，也可以写百分比，比如5mb满了变7MB
)
```

以上代码创建DBname数据库，分别用on和log on 规定了数据文件和日志文件的信息。

创建数据库也可以按照如下简单语法来创建：
## 3.  创建数据库简写
```sql
create database DBname2
```

如果按照这个方法，数据库的文件和日志相关信息，全部采用默认值



# 三、创建数据库表

## 1.语法

```sql
-- 切换数据库
use DBname

-- 创建表基本语法
create table 表名
(
	字段名1 数据类型
	字段名2 数据类型
)
```

## 2.检查数据库表是否存在

在对应数据库里-->视图-->系统视图-->sys.objects 可以查看所有已创建的表

```sql
-- 判断表是否存在
if exists(select * from sys.objects where name = 'Department' and type='U')
	drop table Department
```

## 3.字符类型说明

```sql
-- char：定长，char(10),里面可以存储十个字节，无论存储是否到达十个字节，都要占十个字节。
-- varchar：变长，varchar(10)最多占用10个字节
-- text：长文本
-- char，varchar，text前面加个n存储，存储unicode字符，对中文友好
-- varchar（100）存储100个字母或者50个汉字
-- nvarchar（100）存储100个字母或者100
```

## 4.案例

```sql
--创建表基本语法
create table Department
(
	-- 部门编号 primary key:主键，identity（1，1，）：自动增长，初始值1，增长步长1
	DepartmentId int primary key identity(1,1),
	--部门名称
	DepartmentName varchar(50) not null,
	-- 部门描述
	DepartmentRemark text
)
create table [Rank]  -- 关键字 用[]包裹
(
	-- 职级编号 primary key:主键，identity（1，1，）：自动增长，初始值1，增长步长1
	RankId int primary key identity(1,1),
	-- 职级名称
	RankName varchar(50) not null,
	-- 职级描述
	RankRemark text
)
create table People
( 
	-- 员工编号 primary key:主键，identity（1，1，）：自动增长，初始值1，增长步长1
	PeopleId int primary key identity(1,1),
	DepartmentID int references Department(DepartmentId) not null, -- 引用外键部门
	RankId int references[Rank](RankId)not null,-- 职级（应用外键）
	-- 员工名称
	Name varchar(50) not null,
	-- 性别
	Sex nvarchar(1) default('男') check(sex='男' or sex = '女'),
	-- 生日
	Birth smalldatetime not null, -- date 没有加时分秒 datetime 加了时分秒 smalldatetime 范围小 上下百年也许
	-- 月薪
	Salary decimal(12,2) check(salary>=1000 and salary<=100000)  not null, -- 总长度12 ，2代表小数点后面两位
	Phone varchar(20) unique not null,-- 唯一,为数据提供唯一性保证
	-- 地址
	Address varchar(300),
	-- 添加时间
	AddTime  smalldatetime  default(getdate()) -- 用于获取系统当前时间
)
```

# 四、表结构和约束的维护

## 1.表结构维护



### （1）添加列

语法：

```sql
 alter table 表名 add 新的列名 数据类型
```

给员工表添加一列邮箱

```sql
use DBname
alter table People add  EMail varchar(200)
```

### （2）删除列

语法：

```sql
 alter table 表名 drop column 列名
```

删除员工表的邮箱

```sql
alter table People drop column Email
```

### （3）修改列

语法：

```sql
alter table 表名 alter column 列名 数据类型
```

修改地址varchar（300）为varchar（200）

```sql
alter table People alter column Address varchar(200)
```



## 2.维护约束（删除，添加）

**查询约束的两种方法**

1. 打开表设计 右键check约束 找到name
2. 打开本数据库，点视图，系统视图，找到sys.object ,选择前1000列，根据type_desc找到name
 3. 打开表设计 右键check约束 找到对应要的约束直接

### （1）删除约束
**语法：**
```sql
alter table 表名 drop constraint 约束名 
```
**删除月薪的约束**
```sql
alter table  People drop constraint CK__People__Salary__300424B4
```

### （2）添加约束（check约束）
```sql
alter table 表名 add constraint 约束名 check(表达式)
```
添加工资字段的约束，工资必须在1000到1000000之间
```sql
alter table People add constraint PeopleSalay check(Salary>=1000 and Salary<=1000000)
```

###  （3）添加约束（主键）
**语法：**
```sql
alter table 表名 add constraint 约束名 primary key(列名)
```
### （4）添加唯一约束
**语法：**
```sql
 alter table 表名 add constraint 约束名 unique(列名)
```
### （5）添加约束（默认值）
**语法：**
```sql
alter table 表名 add constraint 约束名 default 默认值 for 列名
```
### （6）添加约束（外键）
**语法：**
```sql
alter table 表名 add constraint 约束名 foreign key（列名） referencts 关联的表名(列名(主键))
```
# 五、插入数据
## 1.语法：
```sql
insert into 表名(字段1,字段2,字段3) values('数据1','数据2','数据3')
```
## 2.简写：
```sql
insert into 表名 values ('数据1','数据2')
```
> 这种写法数据的顺序要和表结构的顺序完全一致，不推荐这种写法


## 3.多条插入
**语法：**
```sql
insert into 表名(key1,key2,...)
select 'value1','value2',.... union 
select 'value1','value2',.... union
select 'value1','value2',....
```
## 4.例子
```sql
-- 单条插入
insert into[Rank](RankName,RankRemark)
values ('初级','....')

--多条插入
insert into[Rank](RankName,RankRemark)
select '中级','....' union
select '高级','....' 
```

# 六、数据的修改和删除
## 1.修改
语法：
```sql
update 表名 set key1 = value1 ,  key2 = value2 where 条件
```

工资调整：每个人加薪1000元
```sql
update People set Salay = Salay +1000
```
工资调整：将员工编号为7的人加薪500
```sql
update People set Salay = Salay +500
 where peoPleId = 7 
```
将软件部（部门编号1）人员工资低于10000的调整成10000
```sql
update People set Salay = 10000 
where DepartmentId = 1 and Salary < 10000
```
修改刘备的工资是以前的两倍，并且把刘备的地址修改为北京
```sql
update People set Salary =  Salary*2 , Address = '北京'
where Name = '刘备' 
```
## 2.删除
**语法**
```sql
delete from 表名 where 条件
```

删除员工表所有记录
```sql
delete from People
```

删除市场部（编号为3）中工资大于一万的人
```sql
delete from People
where Salary > 10000 and DepartmentId = 3
```

## 3.关于删除（drop，truncate，delete）
drop table People  删除表对象
truncate table People 删除数据（清空数据）
delete from People 删除所有数据 

**truncate 和 delete 区别**

1. truncate 清空所有数据，不能有条件，delete可以删除所有数据，也可以带条件删除符合条件的数据
2. 自动编号：假设表中自动编号1，2，3，4，5。使用truncate清空数据之后在添加数据，编号仍然是1，2，3，4，5.使用delete删除数据，删除的自动编号将永远不存在了，继续添加数据会是6，7，8，9，10.

# 	七、基础查询

查询所有列所有行
```sql
select * from Department 
select * from [Rank]
select *from People
```
查询指定列（姓名，性别，生日，月薪，电话）
```sql
select Name,Sex,Birth,Salary,phone from People
```
查询指定列（姓名，性别，生日，月薪，电话）（显示中文列名）
```sql
select Name as 姓名,Sex as 性别,Birth as 生日,Salary as 月薪,phone as 电话 
from People
```
>可以省略as

查询员工所在城市
```sql
select Address from People
```
查询员工所在城市(不需要重复数据显示)
```sql
select distinct(Address) from People
```
假设准备加工资（上调20%），查询出加工资前和加工资后员工的数据对比
```sql
select 
Name,
Sex,
Salary 加薪前,
Salary * 1.2 加薪后工资 
from People
```
# 八、条件查询
## 1.SQL常用表达式
```
=：等于，比较是否相等及赋值
！=：比较不等于
'>': 比较大于
<：比较小于
‘>=’：比较大于等于
<= :比较小于等于
Is NULL：比较为空
IS NOT NULL :比较不为空
in ： 比较是否在其中
like：模糊查询
between。。。and。。。 比较是否在两者之间
and：逻辑与 （两个条件同时成立表达式成立）
or：逻辑或（两个条件有一个成立表达式成立）
not：逻辑非（条件成立则表达式不成立，条件不成立则表达式成立）
```
## 2.例子
查询性别为女的员工信息
```sql
select * from People where Sex ='女'
```
查询工资大于等于10000元的员工信息
```sql
select * from People where Salary >=10000
```
查询出性别为女，工资大于等于10000元的员工信息
```sql
select * from People 
where Sex='女' and Salary>=10000
```
查询月薪大于等于10000的员工，或者月薪大于等于8000的女员工
```sql
select * from People
where Salary >=10000  or
( Salary >=8000 and Sex = '女')
```
查询出出生年月在1980-1-1之后，而且月薪大于等于10000的女员工
```sql
select * from People
where Birth >= '1980-1-1' 
and (Salary >=10000 and Sex = '女') 
```
查询月薪在10000到20000之间的员工信息
```sql
-- 方式一：
select * from People 
where Salary >=10000 and Salary <=20000

--方式二：

select * from People 
where Salary between 10000 and 20000
```
查询出地址在武汉或者北京的员工信息
```sql
-- 方式一：
select * from People 
where Address = '武汉' or Address = ‘北京’
-- 方式二：
select * from People 
where Address in('武汉','北京')
```
## 3.排序
默认是升序可以不写asc，降序是desc

 查询所有员工信息，根据工资排序，降序
 ```sql
 select * from People 
 order by Salary desc
 ```
 查询所有员工信息，根据名字长度排序（降序）
 ```sql
 select * from People
 order by len(Name) desc
 ```
 查询出工资最高的五个人的信息
 ```sql
 -- 方式一
  select top  5 * from People 
 order by Salary desc
```
查询出工资最高的10%的员工信息
 ```sql
 -- 方式一
 select top  10 percent
  * from People 
 order by Salary desc
```
## 4.null
查询出地址没有填写的员工信息
```sql
select * from People
where Address is null
```
查询出地址填写的员工信息
```sql
select * from People 
where Address is not null
```
## 5.比较查询
查询出80后的员工信息
```sql
--方式一：
select * from People
where Birth>='1980-1-1' and Birth <='1989-12-31'
 --方式二：
 select * from People
where Birth between ‘1980-1-1’ and '1989-12-31'
 -- 方式三
where year(Birth) between 1980 and 1989
```
查询30-40岁之间，并且工资在15000-30000之间的员工信息
假设 年龄= 当前年份-生日年份
```sql
select * from People 
where (year(getdate() - year(Birth)) between 30 and 40 ) 
and (Salary between 15000 and 30000)
```
查询出星座是巨蟹座的员工信息（6.22-7.22）
```sql
select * from People 
where (month(Birth)=6 and day(Birth)>= 22)
or
where (month(Birth)=7 and day(Birth)<= 22)
```
查询出工资比赵云高的人的信息
```sql
select * from People where  Salary >  
(select Salary from People where Name = '赵云').
```
查询出和赵云在一个城市的人的信息
```sql
select * from People where Address = 

select Address from People where Name = '赵云'
```
## 6.添加栏位
查询出生效是鼠的人的人员信息

鼠、牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪、
 4 、  5 、 6 、 7、 8 、9 、 10 、 11 、 0 、 1 、 2 、 3

```sql
select * from People where year(Birth) % 12 = 4
```
查询所有员工信息，添加一列，显示生肖
```sql
select *, 
case 
	when year(Birth) % 12 = 4 then '鼠'
	when year(Birth) % 12 = 5 then '牛'
	when year(Birth) % 12 = 6 then '虎'
	when year(Birth) % 12 = 7 then '兔'
	when year(Birth) % 12 = 8 then '龙'
	when year(Birth) % 12 = 9 then '蛇'
	when year(Birth) % 12 = 10 then '马'
	when year(Birth) % 12 = 11 then '猴'
	when year(Birth) % 12 = 0 then '鸡'
	when year(Birth) % 12 = 1 then '狗'
	when year(Birth) % 12 = 2 then '兔'
	when year(Birth) % 12 = 3 then '猪'
	else ''
end 生肖
from People 

-- 简写
select *, 
case year(Birth) % 12
	when  4 then '鼠'
	when  5 then '牛'
	when  6 then '虎'
	when  7 then '兔'
	when  8 then '龙'
	when  9 then '蛇'
	when  10 then '马'
	when  11 then '猴'
	when  0 then '鸡'
	when  1 then '狗'
	when  2 then '兔'
	when  3 then '猪'
	else ''
end 生肖
from People 
```
# 九、模糊查询
## 1.通配符
模糊查询使用like关键字和通配符结合来实现，通配符具体含义如下：
```
%:代表匹配0个字符、1个字符或多个字符
_:代表匹配有且只有1个字符
[]:代表匹配范围内
[^]:代表匹配不在范围内
```
## 2.案例
查询出姓刘的员工信息
```sql
select * from People where Name like '刘%'
```
查询出名字中含有‘尚’的员工信息
```sql
select * from People where Name like '%尚%'
```
查询出名字中含有”尚“或者“史”的员工信息
```sql
select * from People 
where Name like '%尚%' or Name like  '%史%' 
```
查询出姓刘的员工信息，且名字是两个字
```sql
--方式一
select * from People where Name = '刘_'

--方式二
select * from People 
where SUBSTRING(Name,1,1) = '刘'
and len(Name)=2
```
查询名字最后一个字为香，名字一共是三个字的员工信息
```sql
-- 方式一：
select * from People where SUBSTRING(Name,3,1)='香' and len(Name)=3
-- 方式二：
select * from People where Name = '__香'
```
查询出电话号码开头为138的员工信息
```sql
select * from People where Phone like '138%'
```
查询出电话号码开头为138的，第四位为7或者8，最后一个号码是5
```sql
select * from People 
where Phone like'138[7,8]%5'
```
查询出电话号码开头为138的，第四位好像是2-5之间，最后一个号码不是2和3
```sql
select * from People 
where Phone like '138[2,3,4,5]%[^2,3]'

select * from People 
where Phone like '138[2-5]%[^2-3]'
```
# 十、聚合函数
## 1.聚合函数
SQL SERVER中聚合函数主要有：
```
count : 求数量
max：求最大值
min：求最小值
sum：求和
avg: 求平均值
```

## 2.例子
求员工总人数
```sql
select count(*)  as 人数 from People
```
求最大值，求最高工资
```sql
select max(Salary) 最高工资 from People
```
求最小值，求最小工资
```sql
select min(Salary) 最低工资 from People
```
求和，求所有员工的工资总和
```sql
select sum(Salary) 总和 from People
```
求平均值，求所有员工的平均工资
```sql
select avg(Salary) from People

select round(具体的数据,保留的位数,处理)
```

```sql
ROUND ( numeric_e-xpression , length [ , function ] )

当 length 是负数时，无论什么数据类型，ROUND 都将返回一个四舍五入的 numeric_e-xpression。
ROUND(748.58, -1) 750.00
ROUND(748.58, -2) 700.00
ROUND(748.58, -3) 1000.00
```
求数量，年龄最大值，年龄最小值，年龄总和，年龄平均值
```sql
--方案一：
select 
count(*) 人数,
max(year(getDate())-year(Birth)) 最大年龄,
min(year(getDate())-year(Birth)) 最小年龄,
sum(year(getDate())-year(Birth))年龄总和,
avg(year(getDate())-year(Birth)) 平均年龄
from People
-- 方案二： 
-- 参数1:差值单位   year month day
-- 参数2：减数
-- 参数3：被减数
select DATEDIFF(year,'1993','1991')   --   答案：-2
```
计算出月薪在10000以上的男性员工的最大年龄，最小年龄和平均年龄。
```sql
select 
max(DATEDIFF(YEAR,Birth,getDate())) 最大年龄,
min(DATEDIFF(YEAR,Birth,getDate())) 最小年龄,
avg(DATEDIFF(YEAR,Birth,getDate())) 平均年龄
from People 
where Salary >10000 and Sex = '男'
```
统计出所在地在 武汉或上海 的所有女员工数量以及最大年龄，最小年龄，平均年龄
```sql
select '武汉或上海的女员工' 描述,
count(*),
max(DATEDIFF(YEAR,Birth,getDate())) 最大年龄,
min(DATEDIFF(YEAR,Birth,getDate())) 最小年龄,
avg(DATEDIFF(YEAR,Birth,getDate())) 平均年龄
from People 
where  Sex = '女' and Address in('武汉','上海')
```
年龄比平均年龄高的人员信息
```sql
select * from People
where DATEDIFF(YEAR,Birth,GETDATE())>
(select AVG(DATEDIFF(YEAR,Birth,GETDATE())) from People)
```
# 十一、分组查询
根据员工所在地区分组统计员工人数，员工工资总和，平均工资，最高工资和最低工资
```sql
select Address 地区,
count(*) 人数,
sum(Salary)员工工资总和,
avg(Salary)平均工资,
max(Salary)最高工资 ,
min(Salary)最低工资 
from People group by Address
```
## 1.Group By
根据员工所在地区分统计员工人数，员工工资总和，平均工资，最高工资和最低工资，1985年及以后出身的员工不参与统计
```sql
select Address 地区,
count(*) 人数,
sum(Salary)员工工资总和,
avg(Salary)平均工资,
max(Salary)最高工资 ,
min(Salary)最低工资 
from People 
where YEAR(Birth)<1985
group by Address 
```
## 2.having
根据员工所在地区分组统计员工人数，员工工资总和，平均工资，最高工资和最低工资，要求筛选出员工人数至少在2人及以上的记录，并且1985年及以后出身的员工不参与统计。
```sql
select Address 地区,
count(*) 人数,
sum(Salary)员工工资总和,
avg(Salary)平均工资,
max(Salary)最高工资 ,
min(Salary)最低工资 
from People 
where YEAR(Birth)>1985 
group by Address 
having  count(*)>=2
```
# 十二、多表查询
## 1.笛卡尔乘积
```sql
select * from People,Department
```
此查询结果会将People表的所有数据和Department表的所有数据进行依次排列组合形成新的记录。例如People表有十条记录，Deparent表有3条记录，那么排列组合之后查询结果会有10*3=30条记录。

## 2.简单多条查询
查询员工信息显示部门
```sql
select * from People,Department where
People.DepartmentId = Department.DepartmentId
```
查询员工信息，显示职级名称
```sql
select * from People,[Rank] where
People.RankId= [Rank].RankId
```
查询员工信息，显示职级名称,显示部门
```sql
select * from People,[Rank],Department where
People.DepartmentId = Department.DepartmentId and
People.RankId= [Rank].RankId
```

## 3.内连接
查询员工信息显示部门
```sql
select * from People p 
inner join Department d on p.DepartmentID = d.DepartmentId
```
查询员工信息，显示职级名称
```sql
select * from People p 
inner join [Rank] r on p.RankId= r.RankId
```
查询员工信息，显示职级名称,显示部门
```sql
select * from People p 
inner join Department d on p.DepartmentID = d.DepartmentId
inner join [Rank] r on p.RankId= r.RankId
```
>简单夺标查询和内连接的共同特点：
>不符合主外键关系的数据不会被显示出来

## 4.外连接
### （1）左外联
以左表为主表进行数据显示，主外键关系找不到的数据null取代
```sql
select * from People
left join Department on People.DepartmenteId = Department.DepartmentId
```
### （2）右外联
以右表为主表进行数据显示，主外键关系找不到的数据null取代
```sql
select * from People
right join Department on People.DepartmenteId = Department.DepartmentId
```
### （3）全外联
两张表的数据，无论是否符合关系，都要显示
```sql
select * from People
full join Department on People.DepartmenteId = Department.DepartmentId
```

## 5.案例
查询出武汉地区所有的员工信息，要求显示部门名称以及员工的详细资料
```sql
select PeopleId 员工编号, DepartmentName 部门名称, Name 员工姓名,
Sex 性别, Salary 月薪,Phone 电话, Address 地址
from People p 
left join Department d on  p.DepartmentID = d.DepartmentId
```
查询出武汉地区所有员工信息，要求显示部门名称，职级名称以及员工的详细资料
```sql
select PeopleId 员工编号, DepartmentName 部门名称, Name 员工姓名,
Sex 性别, Salary 月薪,Phone 电话, Address 地址,RankName 职级
from People p 
left join Department d on  p.DepartmentID = d.DepartmentId
left join [Rank] r on p.RankId=r.RankId
where Address = '武汉'
```
根据部门分组统计员工人数，员工工资总和，平均工资，最高工资和最低工资
```sql
select 
d.DepartmentName 部门,
max(Salary) 最高工资, min(Salary) 最低工资,avg(Salary) 平均工资,count(*) 总人数
from People p
left join Department d on p.DepartmentID = d.DepartmentId
group by d.DepartmentName

```
根据部门分组统计员工人数，员工工资总和，平均工资，最高、最低工资，平均工资在10000以下的不参与统计，并且根据平均工资降序排序。
```sql
select 
DepartmentName 部门名称,
count(*) 人数 , min(Salary) 最低工资 ,max(Salary) 最高工资 ,
avg(Salary)平均工资,sum(Salary) 总和
from People
left join Department on People.DepartmentID = Department.DepartmentId
group by DepartmentName
having avg(Salary) >=10000
order by avg(Salary) desc
```
根据部门名称，然后根据职位名称。分组统计员工人数，员工工资总和，平均工资，最高工资和最低工资
```sql
select 
DepartmentName 部门名称,
RankName 职级名称 ,
count(*) 人数 , min(Salary) 最低工资 ,max(Salary) 最高工资 ,
avg(Salary)平均工资,sum(Salary) 总和
from People p
left join Department d on p.DepartmentID = d.DepartmentId
left join [Rank] r  on p.RankId=r.RankId
group by d.DepartmentName,r.RankName
```
## 6.自连接
数据
```sql
create table Dept
(
	DeptId int Primary key, --部门编号
	DeptName nvarchar(50),--部门名称
	ParentId int --上级部门编号
)
-- 一级
insert into Dept(DeptId,DeptName,ParentId) values (1,'软件部',0)
insert into Dept(DeptId,DeptName,ParentId) values (2,'硬件部',0)
-- 二级
insert into Dept(DeptId,DeptName,ParentId) values (3,'软件研发部',1)
insert into Dept(DeptId,DeptName,ParentId) values (4,'软件测试部',1)
insert into Dept(DeptId,DeptName,ParentId) values (5,'软件实施部',1)
insert into Dept(DeptId,DeptName,ParentId) values (6,'硬件研发部',2)
insert into Dept(DeptId,DeptName,ParentId) values (7,'硬件测试部',2)
insert into Dept(DeptId,DeptName,ParentId) values (8,'硬件实施部',2)
```
![sqlServer笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/sqlServer笔记总结1.png)

```sql
select B.DeptId 部门编号,A.DeptName 上级部门,B.DeptName 部门名称
from Dept A
inner join Dept B
on A.DeptId=B.ParentId
```
![sqlServer笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/sqlServer笔记总结2.png)

# 十三、数据库结构设计三范式
## 1.第一范式：原子性
是对属性的原子性，要求属性具有原子性，不可再分解
```sql
create table Student --学生表
(
StuId varchar(2o)primary key,-学号
StuName var char(20)not nu11,--学生姓名
StuContact varchar(50)not nul1,--联系方式
)

insert into Student(stuId,StuName,StuContact)
va1ues('001','刘备'，'QQ:185699887:Te1:13885874587')
select * from Student
```
上述设计则不满足第一范式，联系方式这一列并不是不可再分的最小单元，应修改为如下结构
```sql
create table Student--学生表
(
StuId varchar(20)primary key,-学号
StuName varchar(20)not null,--学生姓名
Te1 varchar(20)not nu11,--联系电话
QQ varchar(20)not nu11,--联系Qq
)
```
## 2.第二范式：唯一性
要求记录有唯一标识，即实体的唯一性，既不存在部分依赖；
```sql
--选课成绩表
create table StudentCourse
(
StuId varchar(20),--学号
StuName varchar(20)not null,--学生姓名
CourseId varchar(20)not null,--课程编号
CourseName varchar(20)not null,--选课课程名称
CourseScore int not null,--考试成绩
)

insert into StudentCourse(StuId,StuName,CourseId,CourseName,CourseScore)
values('001','刘备','001','语文',80)

insert into StudentCourse(StuId,StuName,CourseId,CourseName,Coursescore)
values('001','刘备','002','数学',70)

insert into StudentCourse(StuId,StuName,CourseId,CourseName,CourseScore)
values('002','关羽','003','英语',80)

insert into StudentCourse(StuId,StuName,CourseId,CourseName,Coursescore)
values('003','张飞','003','英语',90)
```
上述设计中有两个事物，一个学生信息，一个课程信息，这两个事物都没有保证实体的唯一性，这里的姓名依赖学号，课程名称依赖课程号，所以不符合二范式。
```sql
create table Course--课程
(
Courseld int primary key identity(1,1),--课程编号
CourseName varchar(30) not null,--课程名称
CourseContent text--课程介绍
)

insert into Course(CourseName,CourseContent)values('HTML','静态网页的制作')
insert into Course(CourseName,CourseContent)values('WinForm','Windows,应用程序开发')

create table Student--学生
(
StuId int primary key identity(1,1),-- 学生编号
StuName varchar(50)not null,--学生名字
StuSex char(2)not null--学生性别
)

insert into Student(StuName,StuSex)values('刘备','男')
insert into Student(StuName,StuSex)values('关羽','男')


create Table Exam--考试信息表
(
Examld int primary key identity(1,1),--选课成绩编号
Stuld int not null,--学生编号
Courseld int not null,--课程编号
Score int not null,--考试分数
)
insert into Exam(Stuld,Courseld,Score)values(1,1,90)
insert into Exam(Stuld,Courseld,Score)values(1,2,80)
insert into Exam(Stuld,Courseld,Score)values(2,2,85)

-- 查询
select e.Stuld 学号,s.StuName 姓名,c.CourseName 课程名称 ,e.Score 分数
from Exam e
inner join Student s on s.StuId = e.Stuld
inner join Course c on c.Courseld = e.Courseld
```
![sqlServer笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/sqlServer笔记总结3.png)



## 3.第三范式：无冗余
要求任何字段不能由其他字段派生出来，它要求字段没有冗余，即不存在传递依赖

```sql
create table Student
(
StuId varchar(20)primary key,--学号
StuName varchar(20)not null,--学生姓名
ProfessionalId int not null,--专业编号
ProfessionalName varchar(50),--专业名将
ProfessionalRemark varchar(200),--专业介绍
)
insert into Student(StuId,StuName,ProfessionalId,ProfessionalName,ProfessionalRemark)
values('001','刘备',1,'计算机','最牛的专业')
insert into Student(StuId,StuName,ProfessionalId,ProfessionalName,ProfessionalRemark)
values('002','关羽',2,'工商管理','管理学的基础专业')
insert into Student(StuId,StuName,ProfessionalId,ProfessionalName,ProfessionalRemark)
values('003','张飞',1,'计算机','最牛的专业')

```
上述设计各种专业名称字段和专业介绍字段，在数据库中会产生很多冗余数据，不满足第三范式，优化方案如下
```sql
create table Professional
(
ProfessionalId int primary key identity(1,1),--专业编号
ProfessionalName varchar(50),--专业名称
ProfessionalRemark varchar(200),--专业介绍
)
insert into Professional(ProfessionalName,ProfessionalRemark)values('计算机','最牛的专业')
insert into Professional(ProfessionalName,ProfessionalRemark)values('工商管理','管理学的基础专业')

create table Student
(
StuId varchar(20)primary key,--学号
StuName varchar(20)not null,--学生姓名
ProfessionalId int not null,--专业编号
)

insert into Student (StuId,StuName,ProfessionalId) values ('001','刘备',1)
insert into Student(StuId,StuName,ProfessionalId)values('002','关羽',2)
insert into Student(StuId,StuName,ProfessionalId)values('003','张飞',1)

```
# 十四、表关系
## 1.一对多
一对多（专业表，学生表）
在多的那张表添加少的那张表的主键
```sql
create table Profession --专业表
(
	ProId int primary key identity(1,1),
	proName varchar(50) not null --专业名称
)
create table Student(
	StuId int primary key identity(1,1),--学生编号
	ProId int references Profession(ProId) not null,-- 专业编号 此字段用于关联专业表
	stuName varchar(50), --学生姓名
	stuSex varchar(2) not null --学生性别
)
insert into Profession values('语文')
insert into Profession values('计算机')
insert into Student values(1,'刘备','男')
insert into Student values(2,'关羽','男')
insert into Student values(3,'赵云','男')
insert into Student values(4,'张飞','男')
```
## 2.一对一
一对多包含一对一。
```sql
--一对一关系（学生基本信息（学号，姓名，性别），学生详细信息（电话，邮箱，地址）)
create table StudentBasicInfo--学生基本信息
(
StuNo varchar(20)primary key not null,--学号
StuName varchar(20)not null,--姓名
StuSex nvarchar(1)not null--性别
)

create table StudentDetailInfo--学生详细信息
(
StuNo varchar(20)primary key not null,
StuQQ varchar(20),--QQ
stuPhone varchar(20),--电话
StuMail varchar(100),--邮箱
StuBirth date--生日
)
```
## 3.多对多
新建一张C表
将A表的主键和B表的主键 都加入到C表中

# 十五、示例数据库介绍
```sql
----------------业务需求说明------------------------
-模拟银行业务，设计简易版的银行数据库表结构，要求可以完成以下基本功能需求
-1.银行开户（注册个人信息）及开卡（办理银行卡）（一个人可以办理多张银行卡，但是最多只能办理3帐
-2.存钱
-3.查询余额
-4.取钱
-5.转账
-6.查看交易记录
-7.账户挂失
-8.账户注销
----------------------表设计----------------------
-1.账户信息表
-2.银行卡表，
-3.交易信息表（存储存钱和取钱的记录）
~-4.转账信息表（存储转账信息记录）
-5.状态信息变化表（存储银行卡状态1：正常，2：挂失，3：冻结，4：注销）
--------------------表结构设计--------------------------

create database Bank
use Bank

create table AccountInfo --账户信息表
(
AccountId int primary key identity(1,1),--账户编号
AccountCode varchar(20)not null,--身份证号码
AccountPhone varchar(20)not null,--电话号码
RealName varchar(20)not null,--真实姓名
OpenTime smalldatetime not null--开户时间
)

create table BankCard--银行卡
(
CardNo varchar(30)primary key,--银行卡卡号
AccountId int references AccountInfo(AccountId) not null,--账户编号（与账户信息表形成主外键关系）
CardPwd varchar(30)not null,--银行卡密码
CardMoney money not null,--银行卡余额
CardState int check(CardState in (1,2,3,4)) not null,--1:正常，2挂失3：冻结，4：注销
CardTime smalldatetime default(getdate())--开卡时间
)

create table CardExchange--父易信息表（存储存钱和取钱的记录
(
ExchangeId int primary key identity(1,1),--交易自动编号
CardNo varchar(30) references BankCard(CardNo) not null,--银行卡号（与银行卡表形成主外键关系）
MoneyInBank money not null,--存钱金额
MoneyOutBank money not null,--取钱金额
ExchangeTime smalldatetime not null,--交易时间

)

create table CardTransfer--转账信息表（存储转账信息记录）
(
Transferld int primary key identity(1,1),--转账自动编号
CardNoOut varchar(30) references BankCard(CardNo) not null,--转出银行卡号（与银行卡表形成主外键关系）
CardNoIn varchar(30) references BankCard(CardNo) not null,--转入银行卡号（与银行卡表形成主外键关系）
TransferMoney money not null,--交易金额
TransferTime smalldatetime not null,--交易时间
)

create table CardStateChange--状态信息变化表（存储银行卡状态l:正常，2挂失，3：冻结，4：注销）
(
Stateld int primary key identity(1,1),--状态信息自动编号
CardNo varchar(30) references BankCard(CardNo) not null,--银行卡号（与银行卡表形成主外键关系）
OldState int not null,--银行卡原始状态
NewState int not null,--银行卡新状态
StateWhy varchar(200)not null,--状态变化原因
StateTime smalldatetime not null,--记录产生时间
)

------------------初始数据-----------------------------

insert into AccountInfo(AccountCode,AccountPhone,RealName,OpenTime)
values('420107198905064135','13554785425','刘备',GETDATE())
insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
values('6225125478544587',1,'123456',0,1)

insert into AccountInfo(AccountCode,AccountPhone,RealName,OpenTime)
values('420107199507104133','13454788854','关羽',GETDATE())
Insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
values('6225547858741265',2,'123456',0,1)

insert into AccountInfo(AccountCode,AccountPhone,RealName,OpenTime)
values('420107199602034138','13456896321','张飞',GETDATE())
insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
values('6225547854125656',3,'123456',0,1)


--进行存钱操作，刘备存钱2000元，关羽存钱：8000元，张飞存钱：500000元
select * from AccountInfo
update BankCard set CardMoney=CardMoney+2000 where CardNo ='6225125478544587'
insert into CardExchange(CardNo,MoneyInBank,MoneyOutBank,ExchangeTime)
values('6225125478544587',2000,0,GETDATE())

update BankCard set CardMoney=CardMoney+8000 where CardNo ='6225547858741265'
insert into CardExchange(CardNo,MoneyInBank,MoneyOutBank,ExchangeTime)
values('6225547858741265',8000,0,GETDATE())

update BankCard set CardMoney=CardMoney+500000 where CardNo ='6225547854125656'
insert into CardExchange(CardNo,MoneyInBank,MoneyOutBank,ExchangeTime)
values('6225547854125656',5000000,0,GETDATE())

--转账：刘备给张飞转账1000元
update BankCard set CardMoney =CardMoney -1000 where CardNo ='6225125478544587'
update BankCard set CardMoney =CardMoney +.1000 where CardNo ='6225547854125656'
insert into CardTransfer(CardNoOut,CardNoIn,TransferMoney,TransferTime)
values('6225125478544587','6225547854125656',1000,GETDATE())
```

# 十六、T-SQL编程
## 1.信息打印
```
-- print：直接打印信息
-- select：在表格中打印消息，可以设置多列，以及每一列的名字
```
```sql
print('hello')
select ('world')
```
![sqlServer笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/sqlServer笔记总结4.png)

![sqlServer笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/sqlServer笔记总结5.png)


## 2.变量
T-SQL中变量分为
1. 局部变量：以@开头
2. 全局变量：以@@开头
### （1）局部变量
(1)以@作为前缀(2)先声明，在赋值
```sql
declare @str varchar (20)
set @str='我爱数据库编程'
select @str='我爱数据库编程'
print @str
```
>备注：==set赋值和select赋值区别：==
set:赋给变量指定的值
select:一般用于从表中查i间出的数据，查间记录如果有多条，将最后一条记录的值赋给变量，
例如：
select @变量名 = 字段名 from 表名
在赋值过程中，如果是表中查间的数据，如果记录只有一条，使用set和select都可以，但是习惯上使用select。

### （2）全局变量
以@@开头，由系统进行定义和维护
```
--@@ERROR:返回执行的上一个语句的错误号
--@@IDENTITY:返回最后插入的标识值
--@@MAX_CONNECTIONS:返回允许同时进行的最大用户连接数
--@@ROWCOUNT:返回受上一语句影响的行数
--@@SERVERNAME:返回运行SQL Server的本地服务器的名称
--@@SERVICENAME:返回SQL Server正在其下运行的注册表项的名称
--@@TRANCOUNT:返回当前连接的活动事务数
--@@LOCK_TIMEOUT:返回当前会话的当前锁定超时设置（毫秒）
```
为赵云此人进行开户开卡操作，赵云身份证号码为：420107199904054233
```sql
insert into AccountInfo(AccountCode,AccountPhone,RealName,OpenTime)
values('420107199904054233','13554785965','赵云',GETDATE())
print @@identity
declare @AccountId int
set @AccountId = @@identity
insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
values('6225125478544588',@AccountId,'123456',0,1)
select * from BankCard
```
需要求出张飞的银行卡卡号和余额，张飞身份证：420107199602034138
```sql
--方案一：
select CardNo 银行卡号,CardMoney 余额 from BankCard 
inner join AccountInfo on BankCard.AccountId = AccountInfo.AccountId
where RealName = '张飞'
--方案二
declare @AccountId int
select @AccountId = (select AccountId from AccountInfo where RealName = '张飞')
select CardNo 银行卡号,CardMoney 余额 from BankCard  where AccountId=@AccountId

```
## 3.GO语句
（1）等待go语句之前代码执行完成之后才能执行后面的代码
（2）批处理结束的一个标志
```sql

--go语句
--（1）等待go语句之前代码执行完成之后才能执行后面的代码
create database DBTEST1
go --这里的目的是为了等待DBTEST1 创建完成 否则后面的语句可能没创建完就想切换会报错
use DBTEST1
create table AccountInfo(
	AccountId int primary key identity(1,1)
)
--（2）批处理结束的一个标志
declare @num int --@num 作用范围 在下面两行代码是存在的
set @num =100
set @num =200

go
declare @num1 int  --@num1的作用范围是在go之前，或两个go之间
set @num1 =100
go
set @num1 =200

```
## 4.运算符

T-SQL中使用的运算符分为7种
```
算粉运算符：加(+)、减(-)、乘(·)、除(/)、模(%)
逻辑运算符：AND、OR、LIKE、BETWEEN、IN、EXISTS、NOT、ALL、ANY、
赋值运算符：=
字符串运算符：+
比较运算符：=、>、<、>=、<=、<>
位运算符：|、&、A
复合运算符：+=、-=、/=、%=、*=
```
（1）已知长方形的长和宽，求长方形的周长和面积
```sql
declare @a int =10
declare @b int = 5
declare @c int 
declare @s int
set @c = (@a+@b)*2
set @s = @a * @b
print('圆周长'+Convert(varchar(10),@c))
print('圆面积'+Convert(varchar(10),@s))

print('圆周长'+cast(@c as varchar(10)))
print('圆面积'+cast(@s as varchar(10)))
```
>数据库语言不能进行自动类型转换，所以要用函数Convert或者case

（2）查询银行卡状态为冻结，并且余额超过100000的银行卡信息
```sql
select * from BankCard where CardState =3 and CardMoney>100000
```
（3）查询出姓名中含有‘刘’的账户信息以及银行卡信息
```sql
select * from AccountInfo Inner join BankCard on BankCard.AccountId = AccountInfo.AccountId 
where RealName like '%刘%' 
```
查询出余额在2000到5000之间的银行卡信息
```sql
select * from BankCard where CardMoney between 2000 and 5000
```
查询出银行卡状态为冻结或者注销的银行卡信息
```sql
select * from BankCard where CardState in(3,4)
```
关羽身份证：420107199507104133，关羽到银行来开户，
查询身份证在账户表是否存在，不存在则进行开户开卡，存在则不开户直接开卡。
```sql
declare @AccountId int
if EXISTS(select * from AccountInfo where AccountCode = 420107199507104133)
	begin--存在此人
	print('进入if说明关羽存在')
	select @AccountId =(select AccountId from AccountInfo where AccountCode = 420107199507104133) 
	insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
	values('6225547858741264',@AccountId,'123456',0,1)
	end

else--不存在此人
	begin
	print('进入else，说明关羽不存在')
	--开户
		insert into AccountInfo(AccountCode,AccountPhone,RealName,OpenTime)
		values(420107199507104133,'15987456325','关羽',GETDATE())
		set @AccountId = @@IDENTITY
	-- 开卡
		insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
		values ('6225547858741264',@AccountId,'123456',0,1)
	end

```
上面需求添加一个限制，即一个人最多只能开3张银行卡
```sql
declare @AccountId int --账户编号
declare @CardCount int  -- 卡数量

if EXISTS(select * from AccountInfo where AccountCode = 420107199507104133) 
	begin--存在此人
	print('此人存在')
	select @AccountId =(select AccountId from AccountInfo where AccountCode = 420107199507104133) --查询ID
	select @cardCount = (select count(*) from BankCard where AccountId =@AccountId)	--查询卡数量
	print @cardCount
	if @CardCount<3
		begin
		
			print('卡的数量小于3')
	--开卡操作
			insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
			values('6225547858741268',@AccountId,'123456',0,1)
		end
	else 
		begin
			print('卡的数量最多只能有三张')
		end
	end;
else--不存在此人
	begin
	print('进入else，说明关羽不存在')
	--开户
		insert into AccountInfo(AccountCode,AccountPhone,RealName,OpenTime)
		values(420107199507104133,'15987456325','关羽',GETDATE())
		set @AccountId = @@IDENTITY
	-- 开卡
		insert into BankCard(CardNo,AccountId,CardPwd,CardMoney,CardState)
		values ('6225547858741264',@AccountId,'123456',0,1)
end
```
查询银行账户余额，是不是所有的账户余额都超过了3000.
```sql
if(3000<All(select CardMoney from BankCard))
	begin
		print('成立')
	end
else
	begin
		print('不成立')
	end
```
查询银行卡账户余额，是否含有账户余额超过3000000的信息
```sql
if(300000000<Any(select CardMoney from BankCard))
	begin
		print('成立')
	end
else
	begin
		print('不成立')
	end
```
## 5.流程控制
### 1.选择分支结构

--(1)某用户银行卡号为"6225547854125656”，该用户执行取钱操作，取钱5000元，余额充足则进行取钱操作，
--并提示"取钱成功”，否则提示”余额不足”。
```sql
declare @balance money
select @balance (select CardMoney from Bankcard where CardNo='6225547854125656')
if @balance >5000
	begin
		update Bankcard set CardMoney-=5000
		insert into CardExchange(CardNo,MoneyInBank,MoneyoutBank,ExchangeTime)
		values('6225547854125656',0,5000,GETDATE())
	end
else
	begin
		print'余额不足'
	end
```
-（2)查询银行卡信息，将银行卡状态1,2,3,4分别转换为汉字“正常，挂失，冻结，注销”，
并且根据银行卡余额显示银行卡等级
30万以下为“普通用户”，30万及以上为"VIP用户"
示列分别为卡号，身份证，姓名，余额，用户等级，银行卡状态。
```sql
select CardNo 卡号,AccountCode 身份证号,RealName 真实姓名,CardMoney 余额,
 case 
	when CardMoney >=300000 then 'VIP用户'
	else '普通用户'
end 用户等级,
case CardState
	when  1  then '正常'
	when  2  then '挂失'
	when  3  then '冻结'
	when  4  then '注销'
	else '异常'
end 银行卡状态
from BankCard
inner join AccountInfo on BankCard.AccountId = AccountInfo.AccountId
```
### 2.循环结构（while）
（1）循环打印1-10
```sql
declare @i int = 1
while(@i < 10)
begin 
	set @i += 1
	print @i
end
```

（2）循环打印九九乘法表
```sql
-- 打印九九乘法表
--特殊字符：char(9)：制表符 char(10):换行符
declare @i int = 1
while(@i <= 9)
begin
	declare @str varchar(1000)=''
    declare @j int = 1
    while (@j <= @i)
    begin
		set @str=@str+cast(@i as varchar(10)) + '*' + cast(@j as varchar(10)) + '=' + cast(@i * @j as varchar(10))+char(9)
        set @j += 1
    end
	print @str
    set @i += 1
end
```
## 6.子查询
--(1)关羽的银行卡号为"6225547858741265”,查间出余额比关羽多的银行卡信息,显示卡号,身份证,姓名,余额。
```sql
-- 方案一：变量
declare @moneyFlag int 
-- 找出关羽的银行卡余额
select @moneyFlag = (select CardMoney from BankCard where CardNo = '6225547858741265')
select @moneyFlag
select CardNo 银行卡号,AccountCode 身份证, CardMoney 余额 from AccountInfo a 
inner join BankCard b on a.AccountId = b.AccountId 
where CardMoney >=@moneyFlag and RealName <> '关羽'
--方案二：子查询
select CardNo 银行卡号,AccountCode 身份证, CardMoney 余额 from AccountInfo a 
inner join BankCard b on a.AccountId = b.AccountId 
where CardMoney >=
(select CardMoney from BankCard where CardNo = '6225547858741265')
and RealName <> '关羽'
```
从所有账户信息中查询出余额最高的交易明细（存钱取钱的信息）
```sql
-- 下面这种方法只能查询出一个
select * from CardExchange where CardNo=
(select top 1 CardNo from BankCard order by CardMoney desc)

--如果有多个人余额一样，并且都是最高，需要都查出来

select * from CardExchange  where CardNo in
(select  CardNo from BankCard where CardMoney = 
	(select max(CardMoney) from BankCard)
)
```
查询出有取款记录的银行卡及账户信息
```sql
select b.CardNo 银行卡号,a.RealName 姓名,a.AccountCode 身份证, b.CardMoney 余额 from AccountInfo a 
inner join BankCard b on a.AccountId = b.AccountId 
where CardNo in 
(
select CardNo from CardExchange where MoneyOutBank>0
)
```
查询出没有取款记录的银行卡及账户信息
```sql

select b.CardNo 银行卡号,a.RealName 姓名,a.AccountCode 身份证, b.CardMoney 余额 from AccountInfo a 
inner join BankCard b on a.AccountId = b.AccountId 
where CardNo not in 
(
select CardNo from CardExchange where MoneyOutBank>0
)
```
--查询出交易次数（存款取款操作）最多的银行卡账户信息
--显示：卡号，身份证，姓名，余额，交易次数
```sql
select a.AccountCode 身份证,b.CardNo 卡号,a.RealName 姓名,b.CardMoney 余额,c.myCount 次数 
from AccountInfo a
inner join BankCard b on a.AccountId = b.AccountId
--找出有交易次数的所有银行卡账户信息
right join (select CardNo ,count(*) myCount from CardExchange group by CardNo) c on b.CardNo = c.CardNo
where c.myCount =  
-- 找出交易次数的最大值
(select max(c.myCount) from (select CardNo ,count(*) myCount from CardExchange group by CardNo) c)

```
查询出没有转账记录的银行卡账户信息，显示卡号，身份证，姓名，余额
```sql
select a.AccountCode 身份证,b.CardNo 卡号,a.RealName 姓名,b.CardMoney 余额
from AccountInfo a
inner join BankCard b on a.AccountId = b.AccountId
where CardNo not in 
--有转入记录的
(select CardNoOut from CardTransfer group by CardNoOut) 
or 
--有转出记录的
CardNo not in (select CardNoIn from CardTransfer group by CardNoIn)
````

# 十七、分页查询
## 1.数据准备
```sql
create table Student
(
	StuId int primary key identity(1,1),
	StuName varchar(20),
	StuSex varchar(4)
)

-- 1
INSERT INTO Student (StuName, StuSex) VALUES ('张三', '男');
-- 2
INSERT INTO Student (StuName, StuSex) VALUES ('李四', '女');
-- 3
INSERT INTO Student (StuName, StuSex) VALUES ('王五', '男');
-- 4
INSERT INTO Student (StuName, StuSex) VALUES ('赵六', '女');
-- 5
INSERT INTO Student (StuName, StuSex) VALUES ('孙七', '男');
-- 6
INSERT INTO Student (StuName, StuSex) VALUES ('周八', '女');
-- 7
INSERT INTO Student (StuName, StuSex) VALUES ('吴九', '男');
-- 8
INSERT INTO Student (StuName, StuSex) VALUES ('郑十', '女');
-- 9
INSERT INTO Student (StuName, StuSex) VALUES ('陈一', '男');
-- 10
INSERT INTO Student (StuName, StuSex) VALUES ('林二', '女');
-- 11
INSERT INTO Student (StuName, StuSex) VALUES ('徐三', '男');
-- 12
INSERT INTO Student (StuName, StuSex) VALUES ('胡四', '女');
-- 13
INSERT INTO Student (StuName, StuSex) VALUES ('朱五', '男');
-- 14
INSERT INTO Student (StuName, StuSex) VALUES ('高六', '女');
-- 15
INSERT INTO Student (StuName, StuSex) VALUES ('马七', '男');
-- 16
INSERT INTO Student (StuName, StuSex) VALUES ('刘八', '女');
-- 17
INSERT INTO Student (StuName, StuSex) VALUES ('何九', '男');
-- 18
INSERT INTO Student (StuName, StuSex) VALUES ('梁十', '女');
-- 19
INSERT INTO Student (StuName, StuSex) VALUES ('郭一', '男');
-- 20
INSERT INTO Student (StuName, StuSex) VALUES ('黄二', '女');
-- 21
INSERT INTO Student (StuName, StuSex) VALUES ('宋三', '男');
-- 22
INSERT INTO Student (StuName, StuSex) VALUES ('曹四', '女');
-- 23
INSERT INTO Student (StuName, StuSex) VALUES ('许五', '男');
-- 24
INSERT INTO Student (StuName, StuSex) VALUES ('韩六', '女');
-- 25
INSERT INTO Student (StuName, StuSex) VALUES ('冯七', '男');
-- 26
INSERT INTO Student (StuName, StuSex) VALUES ('邓八', '女');
-- 27
INSERT INTO Student (StuName, StuSex) VALUES ('潘九', '男');
-- 28
INSERT INTO Student (StuName, StuSex) VALUES ('蒋十', '女');
-- 29
INSERT INTO Student (StuName, StuSex) VALUES ('蔡一', '男');
-- 30
INSERT INTO Student (StuName, StuSex) VALUES ('贾二', '女');
```
## 方案一：TOP
```sql
--分页
--假设每页五条数据
--查询第一页
select top 5 * from Student
--第二页
select top 5 * from Student
where StuId not in (select top 5 StuId from Student)
--第三页
select top 5 * from Student
where StuId not in (select top 10 StuId from Student)
--规律 方案一：top方式分页
declare @PageSize int = 5
declare @PageIndex int =1
select top(@PageSize) * from Student --top后面如果是个变量要括号起来
where StuId not in (select top(@PageSize*(@PageIndex-1)) StuId from Student)
```
## 方案二：ROW_NUMBER
```sql
-- 方案二：使用ROW_NUMBER
-- ROW_NUMBER返回数字集
-- over函数OVER用于为行定义一个窗口，它对一组值进行操作，不需要使用GROUP BY子句对数据进行分组，能够在同一行中同时返回基础行的列和聚合列。
declare @PageSize1 int = 5
declare @PageIndex1 int =1
select * from (select ROW_NUMBER()over(order by StuId) RowId ,* from Student ) s
where RowId  between (@PageIndex1-1)*@PageSize1+1 and (@PageIndex1)*@PageSize1
```
## 方案三：OFFSET 和FETCH
```sql
--方案三：`OFFSET` 和 `FETCH`
declare @PageSize2 int = 5
declare @PageIndex2 int =1
-- 以下是使用 `OFFSET` 和 `FETCH` 语句的示例，获取年龄从大到小排序后的第 3 页，每页 5 条记录
SELECT * 
FROM Student s
ORDER BY s.StuSex DESC  -- 按照性别降序排序
OFFSET @PageIndex2 *  @PageSize2 ROWS
FETCH NEXT @PageSize2 ROWS ONLY;
```

# 十八、事物
## 1.模板
```sql
--开始事物
begin transaction
declare @myError int = 0
--数据库语句1

@myError += @ERROR
--数据库语句2

@myError += @ERROR
if(@myError =  0)
	begin
		commit transaction --执行
		print('执行成功')
	end
else
	begin
	rollback transaction --回滚
	print('执行失败')
	end
```
## 2.例子

--（1）假设刘备取款6000 添加check约束 设置账户余额必须大于0 要求：使用事务实现，修改余额和添加取款记录两部操作使用事务
```sql
-- 420107198905064135  6225125478544587 刘备
-- 420107199507104133 6225547858741265 关羽
-- 420107199602034138  6225547854125656 张飞

--添加约束
alter table BankCard add constraint ck_money check(CardMoney>=0)
begin transaction --开始事物
declare @myError int = 0
update BankCard set CardMoney-=1 where CardNo = 6225125478544587
set @myError +=@@ERROR 
insert into CardExchange (CardNo,MoneyInBank,MoneyOutBank,ExchangeTime)
values (6225125478544587,0,6000,GETDATE())
set @myError +=@@ERROR 
if @myError = 0
	begin
		commit transaction
		print'取款成功'
	end
else
	begin
		rollback transaction
		print'取款失败'
	end
```
（2）假设刘备向张飞转账1000元，（添加chck约束，设置账户余额必须>=0）：分析步骤有三步(1)张飞添加1000元，(2)刘备扣除1000元，(3)生成转账记录：使用事务解决此问题。
```sql
begin transaction
declare @myError int = 0 
update BankCard set CardMoney -=1000 where CardNo =6225125478544587 
set @myError +=@@ERROR
update BankCard set CardMoney +=1000 where CardNo = 6225547854125656
set @myError +=@@ERROR 
insert into CardTransfer (CardNoOut,CardNoIn,TransferMoney,TransferTime)
values (6225125478544587,6225547854125656,1000,GETDATE())
set @myError +=@@ERROR 
if(@myError = 0)
	begin
		commit transaction
		print '执行成功'
	end
else
	begin
		rollback transaction
		print '执行失败'
	end
```
# 十九、索引
## 1.作用
索引：提高检索查询效率。
## 2.类型
SQL SERVER索引类型：按存储结构区分：“聚集索引（又称聚类索引，簇集索引）”，“非聚集索引（非聚类索引，
非簇集索引)”：

**聚集索引**：根据数据行的键值在表或视图中的排序存储这些数据行，每个表只有一个聚集索引。聚集索引是一种对
磁盘上实际数据重新组织以按指定的一列或多列值排序（类似字典中的拼音索引）（物理存储顺序）。
**非聚集索引**：具有独立于数据行的结构，包含非聚集索引键值，且每个键值项都有指向包含该键值的数据行的指
针。（类似字典中的偏旁部首索引）（逻辑存储顺序）。
**SQL SERVER索引其他分类：**
按数据唯一性区分：“唯一索引”，“非唯一索”；按键列个数区分：“单列索”，“多列索引“。
## 3.创建索引的方式
创建索引的方式：
1. 通过显式的CREATE INDEX命令
2. 在创建约束时作为隐含的对象
	- 主键约束（聚集索引）
	- 唯一约束（唯一索引）
## 4.创建索引语法
```sql
CREATE [UNIQUE] [CLUSTERED | NONCLUSTERED] --唯一索引 ，聚集索引 |非聚集索引
INDEX <index name> ON <table or view name>(<column name>[ASC | DESC][,....n])
-- index name：索引名字
-- on：作用域
--column name：字段名

```
## 5.例子
```sql
-- 给AccountInfo表中的AccountCode字段添加索引
-- 已经有主键了 所以选择非聚集性索引， AccountCode是唯一的 所以可以加上unique
create unique nonclustered index index_code 
on AccountInfo(AccountCode)
--索引查看（sys.indexes）
select * from sys.indexes where name = 'index_code'
--删除索引
drop index index_code on AccountInfo
--按照显式指定的索引进行查询
select * from AccountInfo with(index=index_code)
where AccountCode ='420107199507104133'

```
# 二十、视图（虚拟表）
(1)编写视图实现查询出所有银行卡账户信息，显示卡号，身份证，姓名，余额。
```sql
create view CardAndAccount as
select CardNo卡号，AccountCode身份证，RealName姓名，Car dMoney余额from Bankcard
left join AccountInfo on Bankcard.AccountId AccountInfo.AccountId
go
```
如果要进行相应信息的查询，不需要编写复杂的SQL语句，直接使用视图，如下：
```sql
-- 1.显示卡号、身份证、姓名、余额
select CardNo 卡号,AccountCode 身份证,RealName 姓名,CardMoney 余额 from BankCard
inner join AccountInfo on BankCard.AccountId = AccountInfo.AccountId

--创建视图，实现显示卡号、身份证、姓名、余额
create view View_CardAndAccount
as
select CardNo 卡号,AccountCode 身份证,RealName 姓名,CardMoney 余额 from BankCard
inner join AccountInfo on BankCard.AccountId = AccountInfo.AccountId
go
--删除视图
drop view View_CardAndAccount
--查询
select * from View_CardAndAccount
```
>真实表的数据修改之后视图表里的数据也会进行修改

# 二十一、游标
## 1.作用
游标：定位结果集中某一行。
## 2.游标分类：
(1)静态游标（Static):在操作游标的时候，数据发生变化，游标中数据不变
(2)动态游（Dynamic):在操作游标的创候，数据发生变化，游标中数据改变，默认值，
(3)键集驱动游标（KeySet):在操作游标的时候，被标识的列发生改变，游标中数据改变，其他列改变，游标中数据不变。
假设有如下表结构和故据：
## 3.数据准备
```sql
create table Member
(
MemberId int primary key identity(1,1),
MemberAccount nvarchar (20)unique check(len(MemberAccount)between 6 and 12),
MemberPwd nvarchar (20),
MemberNickname nvarchar (20),
MemberPhone nvarchar (20)
)
INSERT INTO Member (MemberAccount, MemberPwd, MemberNickname, MemberPhone)
VALUES ('LiuBei', 'pwd1', '刘备', '1234567890'),
       ('GuanYu', 'pwd2', '关羽', '0987654321'),
       ('ZhangFei', 'pwd3', '张飞', '1112223333'),
       ('CaoCao', 'pwd4', '曹操', '4445556666'),
       ('SunQuan', 'pwd5', '孙权', '7778889999');
select * from Member

```
## 4.单列游标例子
### （1）创建游标
```sql
--创建游标（scroll：滚动游标，如果没有scroll只进，游标只能向下移动）
declare mycur cursor scroll
for select MemberAccount from Member 
```
### （2）打开游标
```sql
-- 游标打开
open mycur
```
### （3）提取游标
```sql
-- 提取某行数据
fetch first from mycur --提取第一行
fetch last  from mycur --提取最后一行
fetch absolute 2 from mycur --绝对提取：提取第二行
fetch relative 2 from mycur --相对提取：在当前行在下两行
fetch next from mycur --下移一行
fetch prior from mycur --上移一行
--提取游标数据存入变量，进行查询所有列信息
declare @acc varchar(20) 
fetch absolute 2 from mycur into @acc
select * from Member where MemberAccount = @acc
```
### （4）遍历游标
```sql
--遍历游遍
declare @accc varchar(20)
fetch absolute 1 from mycur into @accc
--@@fetch_status:0提取成功  -1 提取失败
while @@FETCH_STATUS=0
	begin
		print '提取成功' + @accc
		fetch next from mycur into @accc
	end
-- 利用游标进行数据的修改和删除
select * from Member 
fetch absolute 2from mycur
update Member set MemberPwd = '1234'  where current of mycur
delete from Member where current of mycur
```
![sqlServer笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/sqlServer笔记总结6.png)


### （5）关闭游标
```sql
-- 关闭游标
close mycur
```
### （6）删除游标
```sql
--删除游标
deallocate mycur
```
## 5.多列游标例子
```sql
-- 创建指向某行多列的游标，循环显示多列数据
declare mycur cursor scroll
for select MemberAccount,MemberPwd,MemberNickName from Member
open mycur
declare @ac varchar(20)
declare @pwd varchar(20)
declare @nk varchar(20)
fetch absolute 1 from mycur into @ac,@pwd,@nk
--@@fetch_status:0提取成功  -1 提取失败
while @@FETCH_STATUS=0
	begin
		print '用户名:' + @ac+';密码:'+@pwd+';昵称:'+@nk
		fetch next from mycur into @ac,@pwd,@nk
	end
-- 关闭游标
close mycur
-- 删除游标
deallocate mycur
```
![sqlServer笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/sqlServer笔记总结7.png)

# 二十二、函数
## 1.分类
1. 系统函数
2. 自定义函数
	- 标量值函数（返回单个值）
	- 表值函数（返回查询结果）

## 2.自定义函数例子
编写一个函数求该银行的金额总和
```sql
--编写一个函数求该银行的金额总和
create function GetSumMoney() returns money 
as
begin
	declare @sum money
	select @sum= (select sum(CardMoney) from BankCard)
	return @sum
end

select dbo.GetSumMoney()
```
>标量函数调用的时候记得加上dbo.函数名称（）

传入账户编号，返回真实姓名
```sql
go
create function GetRealNameById(@accid int) returns varchar(30)
as
	begin
		declare @name varchar(30)
		select @name = (select RealName from AccountInfo where AccountId = @accid)
	    return @name
	end
go

select dbo.GetRealNameById(2)
```
传递开始时间和结束时间，返回交易记录（存钱取钱）
交易记录中包含 真实姓名，卡号，存钱，取钱时间，交易时间
```sql
--方案一：
go
create function GetRecordByTime(@star varchar(30),@end varchar(30)) 
returns @result table
(
	RealName varchar(20),
	CardNo varchar(30) ,
	MoneyInBank money ,
	MoneyOutBank money ,
	ExchangeTime smalldatetime 
)
as 
begin
	insert into @result
	select RealName 姓名,c.CardNo 卡号,
	MoneyInBank 存钱金额,MoneyOutBank 取钱金额,
	ExchangeTime 交易时间
	from CardExchange c
	inner join BankCard b on b.CardNo=c.CardNo
	inner join AccountInfo a on a.AccountId = b.AccountId
	where ExchangeTime between @star+' 00:00:00' and @end+' 23:59:59'
	return 
end
go
select * from GetRecordByTime('2024-1-1','2024-12-12')

```
>这种写法比较复杂，但是函数体除了sql查询之外还可以由其他逻辑代码


![sqlServer笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/sqlServer笔记总结8.png)

```sql
--方案二：
go
create function GetRecordByTime(@star varchar(30),@end varchar(30)) 
returns  table

as 
	return
	select RealName 姓名,c.CardNo 卡号,
	MoneyInBank 存钱金额,MoneyOutBank 取钱金额,
	ExchangeTime 交易时间
	from CardExchange c
	inner join BankCard b on b.CardNo=c.CardNo
	inner join AccountInfo a on a.AccountId = b.AccountId
	where ExchangeTime between @star+' 00:00:00' and @end+' 23:59:59'

go
select * from GetRecordByTime('2024-1-1','2024-12-12')
```
>这种写法比较简便，但是这种函数体内只能由return + sql 查询结果

![sqlServer笔记总结](https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/sql/sqlServer笔记总结9.png)
查询银行卡信息，将银行卡状态1,2,3,4分别转换为汉字“正常，挂失，冻结，注销”，
并且根据银行卡余额显示银行卡等级
30万以下为“普通用户”，30万及以上为"VIP用户"
示列分别为卡号，身份证，姓名，余额，用户等级，银行卡状态。
```sql
--用户等级
go
create function GetGrade(@cardmoney money) returns varchar(30)
as
begin
	declare @result varchar(30)
	if @cardmoney >=30000
		set @result = 'VIP'
	else
		set @result = '普通用户'
	return @result
end
go

--求银行卡状态
go
create function GetState(@state int) returns varchar(30)
as
begin
	declare @res varchar(30)
	if		@state = 1
		set @res = '正常'
	else if @state =2
		set @res = '挂失'
	else if @state = 3
		set @res = '冻结'
	else
		set @res = '异常'
	return  @res
end
go
--分别显示卡号，身份证，姓名，余额，用户等级，银行卡状态
select CardNo 卡号,AccountCode 身份证号,RealName 真实姓名,CardMoney 余额,
dbo.GetGrade(CardMoney) 用户等级 , dbo.GetState(CardState) 银行卡状态
from BankCard
inner join AccountInfo on BankCard.AccountId = AccountInfo.AccountId
```
编写函数，根据出生日期求年龄，
```sql

go
create function getAge(@birth varchar(20))
returns varchar(20)
as
	begin
	declare @age int
	set @age =year(GETDATE())-year(@birth)
	if month(getdate())<month(@birth)
		set @age-=1
	if month(getdate())=month(@birth) and day(getdate())<day(@birth)
		set @age-=1
	return @age
	end
go

select * ,year(GETDATE())-year(birth) 年龄,dbo.getAge(birth) 实岁 from Empt
```
# 二十三、触发器
## 1.分类
1. instead of 触发器：在执行操作之前被执行
2. After触发器：在执行操作之后被执行

## 2.例子
数据准备
```sql
--部门
create table Department
(
DepartmentId int primary key,--主键，自动增长
DepartmentName nvarchar(50),--门名称
)

--人员信息
create table People(
PeopleId int primary key identity(1,1),--主键，自动增长
DepartmentId int,--部门编号，外键，与部门表关联
PeopleName nvarchar(20),--人员姓名
PeopleSe nvarchar(2),--人员性别
PeoplePhone nvarchar(20),--电话，联系方式
)

insert into Department values
(1,'总经办'),
(2,'市场部'),
(3,'人事部'),
(4,'财务部'),
(5,'软件部')

insert into People values(1,'刘备','男',123124135)
insert into People values(2,'关羽','男',12312413123)
insert into People values(3,'张飞','男',12312411235)
```
假设有部门表和员工表，在添加员工的时候，该员工的部门编号在部门表中找不到，则自动添加部门信息，部门名称为新部门
```sql
go
create trigger tri_InsertPeople on people after insert
as
	if not exists(select * from department where departmentid = (select departmentid from inserted))
		begin
			insert into department values((select departmentid from inserted),'新部门')
		end
go
```
触发器实现，删除一个部门的时候将部门下员工全部删除
```sql
go
create trigger tri_DeleteDept on Department after delete
as
	begin
		delete from people where departmentid = (select departmentid from deleted)
	end
go
```
创建一个触发器，删除一个部门的时候判断该部门下是否有员工，有则部删除，没有则删除
```sql
go
create trigger tri_DeleteDept on Department instead of delete
as
	begin
		if not exists(select * from people where departmentid =(select departmentid from deleted))
		delete from department where departmentid = (select departmentid from deleted)
	end
go
```
修改一个部门编号之后，将该部门下所有员工的部门编号同步进行修改
```sql
--老编号：删除的表里deleted
--新编号：插入的表里inserted
go
create trigger tri_UpdateDept on Department after update
as
		begin
			update people set departmentid = (select departmentid from inserted)
			where departmentid = (select departmentid from deleted)
		end
go
```