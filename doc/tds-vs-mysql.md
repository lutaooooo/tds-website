# TDS与mySql对比测试报告

测试流程：
1. 使用mysqlWorkbench插入10k条测试数据
2. 使用nodeJS访问mysql数据库，查询10k数据
3. 使用postMan调用TDS-Rpc查询10k条数据
4. 增加数据过滤条件对比



## 插入10k条记录到mysql

![image-20220502215048686](tds-vs-mysql\image-20220502215048686.png)

![image-20220502215157071](tds-vs-mysql\image-20220502215157071.png)

## 使用nodejs连接数据库测试查询

不带过滤条件，测试结果47ms

![image-20220502215344164](tds-vs-mysql\image-20220502215344164.png)

## TDS生成10k条测试记录

使用tds自带的命令行工具生成10k条仿真记录

![image-20220502221348065](tds-vs-mysql\image-20220502221348065.png)

## 使用postMan查询（不带过滤条件）

测试结果18ms

![image-20220502221528681](tds-vs-mysql\image-20220502221528681.png)

##  使用过滤条件查询mysql

测试结果48ms

![image-20220502221653808](tds-vs-mysql\image-20220502221653808.png)

## 使用过滤条件查询TDS

测试结果37ms

![image-20220502221814950](tds-vs-mysql\image-20220502221814950.png)
