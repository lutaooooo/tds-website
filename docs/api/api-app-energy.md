# API应用 - 能耗监测

监控对象树按以下结构

*  能耗系统
  
  * 企业1电表
    
    * 总电量
    
    * 尖
    
    * 峰
    
    * 平
    
    * 谷
  
  * 企业2电表
    
    - 总电量
    
    - 尖
    
    - 峰
    
    - 平
    
    - 谷

## 电表用电排名

**请求**

```json
{
  "jsonrpc": "2.0",
  "method": "db.select",
  "params": {
    "rootTag":"能耗系统",
    "tag": "*总电量",   //  选出所有企业的电表
    "time": "30d",     //  取最近30天的数据
    "groupby":"tag",   //  按电表名称分组
    "aggr":"diff",     //  每个分组进行求最大最小差值聚合操作
    "d-sort":"val"     //  按照val字段，降序排列 descending sort
  },
  "id": 1
}

```

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "db.select",
   "id": 1,
   "info": "aggregate type is diff,auto cast value type string to number",
   "dbLog": "tags:26,files:676,data elements:18476,rows:26",
   "result": [
      {
         "time": "30d",
         "val": 1588.24,    //用电量
         "tag": "三立[3-1南].总电量"    //电表ID 
      },
      {
         "time": "30d",
         "val": 1255.12,
         "tag": "生达[3-2北].总电量"
      },
      ...此处省略其他电表
   ]
}
```

## 累计用电

**请求**

```json
{
  "jsonrpc": "2.0",
  "method": "db.select",
  "params": {
    "tag": "*.总电量",   //  选出所有企业的电表
    "time": "this-day", //  选出今天的所有数据
    "groupby":"tag",    //  按电表名称分组
    "aggr":"diff.last-first",   //每个分组最后一个值减去第一个值聚合操作
    "calc":"sum"        //  对聚合后的数据集进行计算，使用sum求和函数
  },
  "id": 1
}
```

time 参数选择

 `this-year`    求本年累计用电

`this-month`    求本月累计用电

`this-day`    求本日累计用电

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "db.select",
   "id": 1,
   "result": 297.98
}
```
