# 数据库API

## CRUD 增删改查操作

### db.insert 插入数据

**HTTP请求Body**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.insert", 
    "params": {
        "tag":"device001",
        "time":"2022-08-11 08:26:10",
        "val":{
            "temp":24.3,
            "humidity":65.4,
            "pm10":11.3,
            "pm25":22.4
        }
    }, 
    "id": 1
}
```

**HTTP返回Body**

```json
{
    "jsonrpc": "2.0",
    "method": "db.insert",
    "id": 1,
    "result": "ok"
}
```

#### 插入图片文件

**请求**

```json
{
    "jsonrpc": "2.0", "method": "db.insert", 
    "params": {
        "tag": "智慧园区.东门.入口",
        "time": "2020-02-14 20:20:20",
        "val": {
            "plateNo":"浙AG6666",
            "laneNo":"1",
            "gateName":"东门",
        },
        "file":[
            {
                "name":"picVehicle.jpg",
                "type":"jpg",
                "data":"ADGddfdfknggnnsldkf.........."
            },
            {
                "name":"picPlate.jpg",
                "type":"jpg",
                "data":"ADGddfdfknggnnsldkf.........."
            }
        ]
    }, 
    "id": 1
}
```

**参数**

**file** 数据元携带的文件数据，可以携带多个

**name** `string` 数据元附带的文件数据的名称,注意该名称需要带后缀

**type** `string` 数据元附带的文件数据的类型

`jpg` base64编码的jpg图片数据

`text` 文本数据

`json` json文本数据

`curve` 曲线文件，TDB内置数据类型，数据来自某个监控点的高频采样

**data** `string` 数据元附带的文件数据的base64编码

#### 插入曲线文件

**请求**

```json
{
    "jsonrpc": "2.0", "method": "db.insert", 
    "params": {
        "tag": "1#.1J1.Ia",
        "time": "2020-02-14 20:20:20",
        "file":{
             "type":"curve",
             "data":{
                "interval":40,
                "pt":[1,2,1.1,......]
             }
         }
    }, 
    "id": 1
}
```

曲线文件是TDB的内置类型，插入曲线文件后，在对应监控点目录下，会生成 curveList.json的曲线索引文件。

使用如下请求获取曲线索引数据:

```json
{
    "jsonrpc": "2.0", "method": "db.select", 
    "params": {
        "tag": "1#.1J1.Ia",
        "deType": "curveIdx",
        "time":"1d"
    }, 
    "id": 1
}
```

使用如下请求获取一条具体的曲线数据

```json
{
    "jsonrpc": "2.0", "method": "db.select", 
    "params": {
        "tag": "1#.1J1.Ia",
        "deType": "curve",
        "time":"2022-11-12 11:11:11"
    }, 
    "id": 1
}
```

### db.select 查询数据

#### 查询离散数据点

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": {
        "tag":"device001",    
        "time":"10h3m10s",         
        "match":"temp>26&&humidity>65"  
    }, 
    "id": 1
}
```

tag : 位号

time : 查询最近10小时3分钟10秒内的数据

match: 查询温度大于25度，湿度小于65的数据

**响应**

```json
{
    "jsonrpc": "2.0",
    "method": "db.select",
    "id": 1,
    "result": [
        {
            "time": "2022-08-11 11:41:53",
            "val": {
                "humidity": 66.4,
                "pm10": 11.3,
                "pm25": 22.4,
                "temp": 26.3
            }
        },
        {
            "time": "2022-08-11 11:41:57",
            "val": {
                "humidity": 68.4,
                "pm10": 11.3,
                "pm25": 22.4,
                "temp": 27.3
            }
        }
    ]
}
```

#### 查询曲线数据

同时查询3条曲线, 返回的曲线列表顺序，和 tag中的请求位号顺序保持一致

**请求**

```json5
{
    "method": "db.select",
    "id": "2024-02-02 16:17:51.W1112#J2",
    "params": {
        "rootTag":"W1112#.W1112#J2.电参数",
        "tag": [
            "Ia",
            "Ib",
            "Ic"
        ],
        "time": "2024-02-02 16:33:40",
        "deType": "curve"
    }
}
```

**响应**

```json5
{
   "method": "db.select",
   "id": "2024-02-02 16:17:51.W1112#J2",
   "result": [
      {
         "interval": 25,
         "pt": [0,0,0,0,0.254,1.864,2.795 .....]
      },{
         "interval": 25,
         "pt": [0,0,0,0,0.253,1.764,2.332 .....]
      },{
         "interval": 25,
         "pt": [0,0,0,0,0.249,1.523,2.431 .....]
      }
   ]
}
```

### db.update 更新数据

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.update", 
    "params": {
        "tag":"device001",
        "time":"2022-08-11 11:41:53",
        "val":{
                "humidity": 66.4,
                "pm10": 11.3456789,
                "pm25": 22.4,
                "temp": 26.3
        }
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0",
    "method": "db.update",
    "id": 1,
    "result": "ok"
}
```

db.merge 合并更新数据

假设数据库中位号device001有一条数据

```json
{
    "time":"2022-08-11 11:41:53",
    "temprature":25.1,
    "humidity":65.1,
    "id": 1
}
```

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.merge", 
    "params": {
        "tag":"device001",
        "time":"2022-08-11 11:41:53",
        "desc":"此时下雨,天台门打开时测试的室内温湿度"
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0",
    "method": "db.merge",
    "id": 1,
    "result": "ok"
}
```

执行后数据库中的数据

```json
{
    "time":"2022-08-11 11:41:53",
    "temprature":25.1,
    "humidity":65.1,
    "desc":"此时下雨,天台门打开时测试的室内温湿度",
    "id": 1
}
```

**

### db.delete 删除数据

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.delete", 
    "params": {
        "tag":"device001",
        "time":"2022-08-11 11:41:53"
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0",
    "method": "db.delete",
    "id": 1,
    "result": "ok"
}
```

## 数据库查询模型

时序数据库当中的每一个采集数据点称为**数据元**

所有的数据元都可以通过 时间，空间两个纬度来查询

在TDS中，空间维通过**位号 tag**参数来指定，时间维通过**时间 time**参数指定

### 单位号查询

下图查询了单个数据元和1个位号在一段时间内的数据

![](/core/db.svg)

### 多位号查询

多位号查询被看做是一定的空间范围在时间维上的截面

![](/core/db2.svg)

### 数据集格式

**单列模式**

只有一列数值列，列名称为 "val"

```json
[
    {
        "time":"2020-02-02 11:30:00",
        "tag":"温度",
        "val":25
    },
    {
        "time":"2020-02-02 11:30:00",
        "tag":"湿度",
        "val":60
    },
    {
        "time":"2020-02-02 12:30:00",
        "tag":"温度",
        "val":26
    },
    {
        "time":"2020-02-02 12:30:00",
        "tag":"湿度",
        "val":61
    },
]
```

**多列模式**

有多列数值列，位号名称做为列名称。

在请求时使用  col 参数代替 tag 参数，返回结果按照多列模式返回

> 多列模式类似于传统数据库中的表
> 
> 只是表的列可以在每次查询中任意组合
> 
> 例如有5台空气质量传感器，可以把一个监控对象作为1个表，
> 
> 每个表有 温度，湿度，PM25 等列
> 
> 也可以把每台空气质量传感器的温度作为1列，构建一个有5列温度的表

```json
[
    {
        "time":"2020-02-02 11:30:00",
        "温度":25,
        "湿度":60
    },
    {
        "time":"2020-02-02 12:30:00",
        "温度":26,
        "湿度":61
    }
]
```

## 基本参数

### time 时间选择器

#### 时间点模式

| 值                     |             |
| --------------------- | ----------- |
| `2020-02-14 20:20:20` | 获得指定时间点的数据元 |

#### 多时间点模式

| 值                                               |               |
| ----------------------------------------------- | ------------- |
| `["2020-02-14 20:20:20","2020-02-14 20:20:20"]` | 获得指定多个时间点的数据元 |

#### 时间区间模式

| 模式       | 值                                         |                                                           |
| -------- | ----------------------------------------- | --------------------------------------------------------- |
| 绝对时间区间模式 | `2020-02-14 20:20:20~2020-02-15 20:20:20` | 获得数据元列表                                                   |
| 绝对日期区间模式 | `2020-02-14~2020-02-15`                   | 效果同上。对应的具体时间区间为 `2020-02-14 00:00:00~2020-02-15 23:59:59` |
| 相对时间区间模式 | `1d1h1m30s`                               | 选择最近1天1小时1分钟30秒的数据                                        |
|          | `3h`                                      | 选择最近3小时的数据                                                |
| 数据元个数模式  | `3e`                                      | 选择最近的 3个数据元(data element)                                 |
| 时间宏      | `this month`                              | 本月                                                        |
| 时间宏      | `last month`                              | 上个月                                                       |
| 时间宏      | yesterday                                 |                                                           |
|          |                                           |                                                           |

#### 同类时间区间模式

| 模式             | 值                                         |                  |
| -------------- | ----------------------------------------- | ---------------- |
| 多条件模式，使用&&组合条件 | `06:00:00~07:00:00@2020-02-10~2020-02-15` | 选择每一天的6点到7点之间的数据 |

#### snapshot时间截面选择器

选择指定时间点之前最近的一个数据。一般选择多个位号，查看多个位号在该时间点的数值。

![](/core/snapshot.svg)

```json5
{
    "method":"db.select",
    "params":{
        "time":"2025-05-22 18:00:00.123",  //支持毫秒
        "tag":["A","B","C"],
        "snapshot":true
    }
}
```



### db 数据库选择器

指定一个数据库，例如我们可以指定一个**温度**数据和**湿度**数据库，然后在2个不同的数据库，使用相同的位号来查询数据

```json5
"db":"温度"
```

### tag 空间选择器

**选择一个位号**

"tag":"浙江.杭州.滨江.pm25"
精确指定可以忽略根节点

**选择多个位号**

（使用 * 符号,* 符号代表 0-n 个任意字符）

| 格式                      | 效果                                                |
| ----------------------- | ------------------------------------------------- |
| "tag":"*"               | 整个项目所有的监测点                                        |
| "tag":"浙江.杭州.*"         | 选中浙江.杭州的子监测点                                      |
| "tag":"浙江.杭州*"          | 可以选中 浙江.杭州南.XXX格式的位号                              |
| "tag":"*.北."            | 可以选中此格式下带一个“北"字的位号 浙江.杭州.下沙.pm25;江苏.徐州.和睦小区.pm25; |
| "tag":["一楼.温度","二楼.温度"] | 通过数组精确指定多个位号                                      |
|                         |                                                   |

### deType数据元类型选择器

deType指定了时序数据中单个数据元的类型，缺省时表示单个采样的离散数据

| 取值       | 含义    |
| -------- | ----- |
| null     | 离散数据点 |
| curveIdx | 曲线索引  |
| curve    | 曲线数据元 |

### match 条件选择器

使用javascript表达式，并且可以使用一些常用的javascript函数。

表达式中的变量是val的属性

例如表达式：

```javascript
"match":"params.CpHeater > 950 && params.CpObj == 968 && params.comment.indexOf(\"60度\")>=0"
```

indexOf是查找是否包含子字符串的函数。注意字符串中包含 " 符号需要转义。

可以查询到以下数据元：

```json
{
    "time": "2021-09-30 15:15:33",
    "val": {
      "mpType": "TCA3DP",
      "params": {
        "CpHeater": 1000,
        "CpObj": 968,
        "closeFanAheadTime": 10,
        "closeOilBathAfterTest": true,
        "comment": "60度测试"
      },
      "result": {
        "Acr": 8.111388257912006e-07,
        "Ain": 1.0285184798848156e-05
      },
      "type": "json"
    }
  }
```

### interval 降采样选择器

```json
"interval":3   //每隔3个数据元返回1个数据
```

```json
"interval":"3h10m"  //每隔3小时10分钟返回1个数据
```

### when 关联选择器

与另外一个位号的数据进行关联，只选择符合关联关系的数据点

选在位号*1#.1J1.过车信号* 满足val==true 之前和之后的数据

```json
"when":{
    "tag":"1#.1J1.过车信号",
    "match":"val==true", 
    "status": true,   //和 match参数取
    "relation":[
        {
            "type":"preceding",  //过车事件往前数第5个数据点
            "offset": 5,
            "count": 1
        },{
            "type":"following",  //过车事件往后数第5个数据点
            "offset": 5,
            "count": 1
        }
    ]
}
```

 **relation.type** `string` 时序关系类型

- preceding  之前的一个元素
- following 之后的一个元素
- during 之间的所有元素
- before 之前的所有元素
- after 之后的所有元素

**match** `string` 状态条件，配置一个js表达式。match可以替代 status 的功能，但是status有更好的性能

**status** `json` 状态值，表示当该位号处于该状态时。

### timeFmt 指定返回时间格式

年月日使用大写，时分秒使用小写

```json
"timeFmt":"YYYY-MM-DD hh:mm:ss"   //指定数据元字段名称分组 
```

如果不需要完整的字符串，可以如下请求

仅返回月，日，时，分

```json
"timeFmt":"MM-DD hh:mm"   //指定数据元字段名称分组 
```

仅返回时，分 

```json
"timeFmt":"hh:mm"   //指定数据元字段名称分组 
```

### timeFill 时间截面位号补全

该选项在**多位号查询**与**单列模式**时起作用，为true时，每个时间点都将补全每个位号的数据，数据的值引用上一个时间点该位号的值。多列模式默认都进行补全。

### valType 指定输出值类型

数据库的val字段可能被存储为string类型，通过valType指定输出，可以将string转换成float类型

valType 可以取  number,float,bool，缺省则保持原样

## 统计查询

### groupby 分组参数

#### 按时间分组

day,hour,month为固定的关键字

按天分组

```json
"groupby":"day"   //指定数据元字段名称分组 
```

按小时分组

```json
"groupby":"hour"   //指定数据元字段名称分组 
```

按月分组

```json
"groupby":"month"   //指定数据元字段名称分组 
```

#### 按属性分组

数据元是json类型，根据数据元字段分组

```json
"groupby":"val.type"   //指定数据元字段名称分组
```

### sort 排序参数

```json
"a-sort":"temp"   //ascending sort 指定数据元字段名称升序排列
```

```json
"d-sort":"temp"   //descending sort 指定数据元字段名称降序排列
```

### limit 分页查询

```json
"limit":10   //返回前10条记录,offset缺省,默认为0
```

```json
"offset":5   //从第几条记录开始，索引从0开始
"limit":10   //记录条数
```

### page 分页查询

**请求**

```json
"pageNo":1
"pageSize":10
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": {
        "pageNo":1,     //当前页编号
        "pagesize":10,  //分页大小  
        "pageCount":50,  //总页码 
        "deCount":499,   //数据元总数
        "pageData":[  //数据列表
            {
                "time":...
                "val":..   
            },{
                "time":...
                "val":..   
            }        
        ]
    }, 
    "id": 1
} 
```

## 聚合查询【aggr】

也可以使用关键字 aggregate

### 单字段单类型聚合

对默认字段 val 进行一种 max 类型的聚合查询

**请求**

查询最近5天的每天的最大值

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": {
        "tag":"杭州市.科技大厦.用电统计.供热总电量",
        "time":"5d",
        "groupby":"day",
        "aggr":"max"
    }, 
    "id": 1
} 
```

**aggregate** `string` 聚合模式

* max 最大值

* min 最小值

* avg 平均值

* sum 求和

* diff 求最大与最小值之差

* diff.last-first 分组最后一条记录 减去 第一条记录的值

* diff.first-last 分组第一条记录 减去 最后一条记录的值

* first 分组第一条记录

* last 分组最后一条记录

* count 记录数量

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "db.select",
   "id": 1,
   "info": "files:6,data elements:2554,rows:6",
   "result": [
      {
         "time": "2023-01-05",
         "val": 40151.2
      },
      {
         "time": "2023-01-06",
         "val": 41012
      },
      {
         "time": "2023-01-07",
         "val": 41896.8
      },
      {
         "time": "2023-01-08",
         "val": 42716
      },
      {
         "time": "2023-01-09",
         "val": 43509.6
      }
   ]
}
```

### 多字段单类型聚合

如果请求的数据元是个json数据结构，可以指定每一个字段的聚合方式，每个字段的聚合方式可以各不相同

例如如下数据元 

```json
{
  "time":"2023-07-22 11:12:13",
  "humidity": 65,
  "temperature":25,
  "pm25":786.3,
  "pm10":566.3  
} 
```

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": {
        "tag":"杭州市.科技大厦.空气质量",
        "time":"5d",
        "groupby":"day",
        "aggregate":{
            "humidity":"max",
            "temperature":"avg",
            "pm25":"diff",
            "pm10":"diff"
        }
    }, 
    "id": 1
} 
```

### 单字段多类型聚合

对同一个字段同时进行多种聚合，返回的聚合结果以聚合方式作为key

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": {
        "tag":"杭州市.科技大厦.温度",
        "time":"5d",
        "groupby":"day",
        "aggregate":"max,avg,min"
    }, 
    "id": 1
} 
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": [
        {
            "time":"2023-10-01",
            "max":"29",
            "avg":"23",
            "min":"20"
        },{
            "time":"2023-10-01",
            "max":"31",
            "avg":"25",
            "min":"21"
        },
        ...
    ], 
    "id": 1
} 
```

### 多级字段

当数据元为一个json对象时，可以对对象中的任意一个字段进行聚合

假设数据元结构如下，对co2和pm10进行聚合查询

```json5
{
   "time": "2024-01-26 00:29:00.000",
   "val": {
      "humi": 67,
      "temp": 25,
      "空气质量": {
         "co2": 35,
         "pm10": 57
      }
   }
 }
```

**请求**

```json
{
  "jsonrpc": "2.0",
  "method": "db.select",
  "params": {
    "tag": "智慧园区.科技大厦.10楼.空气综合参数",
    "time":"5d",
    "groupby":"day",
    "aggr":{
      "val.空气质量.pm10":"max",
      "val.空气质量.co2":"max"
    }
  }
} 
```

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "db.select",
   "id": 1,
   "result": [
      {
         "time": "2024-01-26",
         "val.空气质量.co2": 37,
         "val.空气质量.pm10": 123
      },{
         "time": "2024-01-27",
         "val.空气质量.co2": 39,
         "val.空气质量.pm10": 156
      }
      ....
   ]
}
```

### increase聚合

该聚合方式应用于时间被分段，例如分为“早，中，晚”班；分为早高峰，晚高峰；A班上班时间，B班上班时间等。

当对不同的时间分段进行某个计量值的变化累计时，可以使用increase聚合。

increase聚合一般搭配 timeSlots字段使用

**请求**

```json
{
    "method":"db.select",
    "params":{
        "time":"2023-10-01~2023-10-07",
        "tag":"造纸车间.用电量",
        "aggr":"increase",
        "timeSlot":{
            "A班":[
                "2023-10-01 08:00:00~2023-10-01 16:00:00",
                "2023-10-02 08:00:00~2023-10-02 16:00:00",
                ....
            ]，
            "B班":[
                "2023-10-01 08:00:00~2023-10-01 16:00:00",
                "2023-10-02 08:00:00~2023-10-02 16:00:00",
                ....
            ]，
            "C班":[
                "2023-10-01 08:00:00~2023-10-01 16:00:00",
                "2023-10-02 08:00:00~2023-10-02 16:00:00",
                ....
            ]
        }   
    }
}
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": [
        {
            "time":"2023-10-01~2023-10-07",
            "tag":"造纸车间.用电量",
            "A班": 143,
            "B班": 245,
            "C班": 198
        }
    ], 
    "id": 1
} 
```

### duration聚合

该聚合用于统计一个监控点处于某一个数值的时间，一般用于统计bool和int类型

#### bool量统计查询

统计一个或者多个bool 量，获得其处于 true，或者false值的时间长度和占比

**请求**

```json
{
    "method":"db.select",
    "params":{
        "time":"2023-10-01~2023-10-07",
        "tag":"造纸车间.断纸状态",
        "aggr":"duration"
    }
}
```

**响应**

```json
{
    "method":"db.select",
    "result":[
        {
            "time":"2023-10-01~2023-10-07",
            "tag":"造纸车间.断纸状态",
            "val":[
                {
                    "slot":true,
                    "duration":133443,
                    "percentage":23
                }，{
                    "slot":false,
                    "duration":133443,
                    "percentage":23
                }
            ]
        }    
    ]
}
```

#### 整形统计查询

假设监控点  "造纸车间.生产状态" 是一个整形，并在监控对象当中配置了枚举表

0 = 生产
1 = 断纸
2 = 停机 

**请求**

```json
{
    "method":"db.select",
    "params":{
        "time":"2023-10-01~2023-10-07",
        "tag":"造纸车间.生产状态",
        "aggr":"duration"
    }
}
```

**响应**

```json
{
    "method":"db.select",
    "result":[
        {
            "time":"2023-10-01~2023-10-07",
            "tag":"造纸车间.断纸状态",
            "val":[
                {
                    "slot":0,
                    "duration":133443,
                    "percentage":23
                }，{
                    "slot":1,
                    "duration":133443,
                    "percentage":23
                }
            ]
        }    
    ]
}
```

## 计算结果集 calc

tds提供多种函数，对查询出来的结果集进行计算。

### count 统计数量

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": {
        "tag":"出入口系统.东门.入口",
        "time":"5d",
        "calc":"count"
    }, 
    "id": 1
} 
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "result": 788, 
    "id": 1
} 
```

### sum 求和

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": {
        "tag": "*.总电量",
        "time": "this-year",
        "aggr":"diff.last-first"
        "calc":"sum"
    }, 
    "id": 1
} 
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "result": 2378, 
    "id": 1
} 
```

### aes 绝对差值和

查询最近3天的阻力曲线，并与指定参考曲线计算绝对误差和

aea 绝对差值平均

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": {
        "tag": "1#.1J1.阻力",
        "time": "3d",
        "deType":"curveIdx",
        "calc":{
            "alg":"aes",  // or aea
            "baseCurve":"2024-10-11 23:24:35"
        }
    }, 
    "id": 1
} 
```

**参数**

**baseCurve** `string` 基准曲线   

* `2024-10-10 23:11:12` 指定时间戳  

* `previous` 当前记录的前一条

* `first` 数据集的第一条记录

* `last` 数据集的最后一条记录

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "result": 2378, 
    "id": 1
} 
```

### dtw 曲线差异

查询最近3天的阻力曲线，并与指定参考曲线计算dtw误差

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": {
        "tag": "1#.1J1.阻力",
        "time": "3d",
        "deType":"curveIdx",
        "calc":{
            "alg":"dtw",
            "baseCurve":"2024-10-11 23:24:35"
        }
    }, 
    "id": 1
} 
```

**参数**

**baseCurve** `string` 基准曲线

- `2024-10-10 23:11:12` 指定时间戳

- `refCurve` 参考曲线

- `previous` 当前记录的前一条

- `first` 数据集的第一条记录

- `last` 数据集的最后一条记录

- `beforeEvent` 事件前的一条记录

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "result": 2378, 
    "id": 1
} 
```

### curvePtAggr 曲线点聚合

对一条曲线内的数据点进行聚合

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "params": {
        "tag": "1#.1J1.阻力",
        "time": "3d",
        "deType":"curveIdx",
        "calc":{
            "alg":"curvePtAggr",
            "aggr":"first,last,min,max,diff"
        }
    }, 
    "id": 1
} 
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.select", 
    "result": [
        {
            "time": "2024-12-25 13:34:34",
            "move_direct": 1,
            "bFrictionCurve": false,
            "bFullScale": false,
            "bShyWindow": false,
            "start_time": "2024-11-02 07:59:22.240",
            "end_time": "2024-11-02 07:59:29",
            "max": 2125,
            "time": "07:59:22",
            "acq_type": 1
            "curvePtAggr":{
                "first": 234,
                "last": 134,
                "min": 345,
                "max": 234,
                "diff": 345
            }
        }, {
           "time": "2024-12-25 23:34:34",
            "first": 234,
            "last": 134,
            "min": 345,
            "max": 234,
            "diff": 345
        }, {
           "time": "2024-12-25 23:34:34",
            "first": 234,
            "last": 134,
            "min": 345,
            "max": 234,
            "diff": 345
        }
    ],
    "id": 1
} 
```

## 查询示例

### 统计查询示例1

查询指定时间段的数据，指定多个位号作为列，并对每个位号按天进行统计

```json
{
   "jsonrpc": "2.0",
   "method": "db.select",
   "id": 1,
   "params": {
      "colume": [
         {
            "aggregate": "diff",
            "label": "用电量",
            "tag": "用电统计.供热总电量"
         },
         {
            "aggregate": "diff",
            "label": "发电量",
            "tag": "用电统计.光伏总电量"
         },
         {
            "aggregate": "diff",
            "label": "上网电量",
            "tag": "用电统计.光伏上网电量"
         },
         {
            "aggregate": "avg",
            "label": "室内温度",
            "tag": "环境参数.室内温度"
         },
         {
            "aggregate": "avg",
            "label": "室外温度",
            "tag": "环境参数.室外温度"
         }
      ],
      "groupby": "day",
      "rootTag": "杭州市.科技大厦",
      "time": "2022-12-01 00:00:00~2022-12-28 23:59:59"
   }
}
```

**label** `string`  查询出来的列名称。类似sql的  as 关键字功能

**tag** `string` 指定要选哪个位号作为1列

**aggregate** `string` 本列数据的聚合算法

### 查询上一个月的最后一个数值

```json
{
 "jsonrpc": "2.0", 
 "method": "db.select", 
 "params": {
   "tag":"杭州市.科技大厦.用电统计.供热总热量",
   "time":"this month",
   "groupby":"day"
 }, 
"id": 1
}
```

### 查询曲线数据

曲线是硬件设备在短时间内进行高频数据采集产生的数据曲线，一般采样时间间隔达到毫秒级，曲线在数据库中存储为一个单独文件，并且会存储一个曲线索引列表

## 辅助功能

### db.saveImage

监控点默认关联图片存储存储到数据库路径     {month}/{day}/{tag}/123000.image.jpg ，

可以根据约定http路径访问该图片.该图片可能是 jjpg 图片

info可以分多次存储，

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.saveImage", 
    "params": {
        "tag": "1#.视频检测.直尖轨段1",
        "time": "2022-12-25 12:30:11",
        "data": "xxxxxxxxxxxxxxxxxxxx....."   //base64编码的图片数据
        "info":{
            "objContour":[
                {
                    "type":"rail_surface_crack",
                    "bbox":[1,2,3,4],
                    "mask":"....."
                }
            ],
            "objBBox":[
                {
                    "type":"rail_surface_crack",
                    "bbox":[1,2,3,4]
                }
            ]
        }
    }, 
    "id": 1
} 
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "db.saveImage", 
    "result": "ok",
    "id": 1
} 
```
