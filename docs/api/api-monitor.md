# 数据服务接口 - 监控部分API

## 概要

API定义了**数据服务**与**客户端**之间的应用层协议。

包含了面向数据的采集、存储、分析的功能。

协议功能包含：

- 获取实时数据，获取历史数据，获取报警数据
- 设备控制指令输出
- 数据库数据读写
- 获取硬件配置数据和保存硬件配置数据

协议格式基于JSON RPC标准，见：[JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

## 传输协议

### http

```http
Post /rpc HTTP/1.1
Host: 192.168.0.100
Authorization: Token
Content-Type: text/plain

{
    "jsonrpc": "2.0", 
    "method": "input", 
    "params": {}, 
    "id": 1
}
```

### websocket

嵌入 WebSocket，以 text 模式发送

## 访问鉴权(Auth)

所有的通信数据包必须携带  user和token。

token通过使用用户名密码登录获取。token需要在过期前刷新。

### login 登录

 **请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "login", 
    "params":{
        "user":"ceshi",
        "sign": "XXXX"     //签名
        "time": "2022-06-01 12:00:00"
    },
    "id": 1
}
```

**参数**

**user**="" `string` 用户名。

**pwd** = '' `string` 密码明文。用于低安全需求场景，方便开发。

**sign** = "" `string` 签名

time="" `string` unix时间戳

**签名方法**

将用户名，密码，时间戳拼接为一个字符串，并使用HMAC-SHA256算法计算的签名。

```javascript
/**
Run the code online with this jsfiddle. Dependent upon an open source js library calledhttp:/code.google.com/p/crypto-js/.
**/

<script src="https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js"></script>

<script>
  var user = "ceshi";
  var pwd = "123";
  var time = new Date().getTime().toString();
  var msg = user + time;
  var hash= CryptoJS.HmacSHA256(msg, pwd);
  var sign= hash.toString().toUpperCase();
</script>
```

**响应**

```json
{
     "jsonrpc": "2.0",
     "method": "login",
     "id": 1,
     "result": {
         "name": "admin",     //用户名
         "org": "",           //所属组织结构
         "permission": null,  //权限信息
         "role": "管理员",     //用户角色
         "token": "43E003F5-8685-455f-B5A9-22AA199A2AE4",   //Access Token
         "tokenExpire":3600
    }
}
```

### refreshToken 刷新访问Token

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "refreshToken", 
    "params":{
    },
    "token": "XXXX-XXXX"
}
```

**响应**

```json
{
     "jsonrpc": "2.0",
     "method": "refreshToken",
     "id": 1,
     "result": {
         "token": "XXX-XXXX",     //新的token
         "tokenExpire": 3600           //过期时间，单位秒
     }
}
```

## 对象管理(Obj)

### 基本概念

#### 对象的层级

对象在系统中以一个树形结构的方式组织。父节点的children字段中包含子节点。getObj命令获得树上的一个节点及其子节点信息。

对象树自上而下包含三个层级:

- 组织结构层  `org`

- 监控对象层  `mo`

- 监控点层  `mp`

#### 对象的类型

对象可以配置类型，配置好后，在接口请求中使用 `type` 字段来请求指定的类型

### 获取对象信息 【getObj】

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getObj", 
    "params":{
        //仅获取指定对象的配置
        "tag":"测试机场.煤气炮1#",
        "getConf":ture

        //获取某项目完整的包含监控点的树形结构
        "tag":"测试机场",
        "getChild":"true",
        "getMp":true

        //不需要配置。轮询实时状态
        "tag":"测试机场",
        "getChild":true,
        "getMp":true,
        "getStatus":true
    },
    "id": 1
}
```

获取整个监控对象树
```json
{
    "jsonrpc": "2.0",
    "method": "getObj",
    "params": {
        "tag": "",
        "getChild": true,
        "getMp": true
    }
}
```
**基础参数**
| 参数    |      类型      | 功能描述 |
| :----------- | :----------- | :---- |
|**tag**=""| `string` |指定需要获取的对象的位号。空字符串表示根节点。*表示任意1-n个字符|
| **getConf** = true | `bool`  |是否获取配置信息。只需实时数据，设为false以减少轮询数据大小。|
|**getChild**= false| `bool`| 是否获取子对象。|
|**getMp** = false|`bool` |是否在监控对象树中携带监控点|
|**getStatus** = false| `'bool'` |是否在监控对象中携带报警状态、数据更新时间、在线离线等运行时属性|

**高级参数**  *(确认理解对象树及其查询的基本概念后使用，一般缺省即可)* 

| 参数    |      类型      | 功能描述 |
| :----------- | :----------- | :---- |
|**rootTag** = '' |`string` |指定返回对象根节点位号。默认为根节点。使用rootTag后，所有对象的位号都会以相对rootTag的相对位号来表示。|
|**level**="*"|`string` |指定返回对象的层级，可选`org`,`mo`,`mp`|
|**type** = "*" |`string` |指定返回的对象类型。默认所有类型。|
|**flatten**=false |`bool` |是否将多层级的树形子节点压缩为只有一个层级的列表。|
|**withMp**="温度,湿度"|`string`| 子节点包含指定监控点名称的对象才返回|
|**withoutMp**="温度,湿度"|`string` |子节点不包含指定监控点名称的对象才返回|
|**withDevType**="gap,power"|`string` |子节点包含指定监控点名称的对象才返回|
|**withoutDevType**="gap,power"|`string` |子节点不包含指定监控点名称的对象才返回|
|**leafLevel** = 'mo'| `string` |指定返回对象树的叶子节点的对象类型。默认“mo”类型。|

可选：

- `'org'` 组织结构节点

- `'mo'` 所有监控对象类型

- 组态中自定义的监控对象类型**自定义的监控对象类型**或**自定义的组织结构类型**，中文或拼音首字母皆可以。

### 获得组织结构信息【 getOrg】

**请求**

获得所有机场列表

```json
{
    "jsonrpc": "2.0", "method": "getOrg", 
    "params":{
        "tag":"*",
        "type":"机场"
    },
    "id": 1
}
```

### 获得监控对象信息【 getMo】

**请求**

获得所有机场列表

```json
{
    "jsonrpc": "2.0", "method": "getMo", 
    "params":{
        "tag":"*",
        "type":"煤气炮"
    },
    "id": 1
}
```

### 获得监控对象属性【 getMoAttr】

监控对象下的监控点或者监控点组，统一被看成是监控对象的属性

该接口可以获得监控对象的属性表，每一个监控点都是表中的一列属性

该接口是的可以方便的查看系统中所有某一类的设备的当前实时状态

用来查看某一类的自定义监控对象。

列名将以第一个监控对象的下属监控点为准

**请求**

获得所有朝阳市的所有供热站设备的实时状态信息

```json
{
  "jsonrpc": "2.0",
  "method": "getMoAttr",
  "params": {
    "rootTag": "朝阳市",
    "tag":"*",
    "type":"供热站"
  },
  "id": 1
}
```

**参数**

**rootTag**="" `string` 指定所有获取对象的根位号。不属于该根位号的不会被选中

**tag**="" `string` 指定需要获取的对象的位号。空字符串表示根节点。*表示任意1-n个字符

**mode**="list" `string` 返回数据的格式

* table   表格模式。数组第0个元素为列名称。其他元素为列数值

* list       列表模式。每个元素以列名作为key,值作为value

**type**= `string` 必须指定。自定义监控对象的类型。

**columeLabel**="tag" `string` 

* tag 以监控点的位号作为列名称。将自动省略rootTag。

* name 以监控点的名称作为列名称

**valFmt**=“val” `string` 值的显示格式

* val 值形式

* valStr 值字符串

* valStr-unit 值字符串加单位

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "getMoAttr",
   "id": 1,
   "result": [
      {
         "位号": "朝阳县农信社南双庙信用社",
         "在线": true,
         "站点编号": "0001",
         "供热面积": "400",
         "热能泵.开关机": true,
         "热能泵.模式设置": 8,
         "热能泵.出水温度": 46.1,
         "热能泵.回水温度": 46.1,
         "热能泵.制热温度设置": 45,
         "用电统计.光伏总电量": 51964.148438,
         "用电统计.光伏上网电量": 34025.570313,
         "用电统计.光伏供热电量": null,
         "用电统计.供热总电量": 62558.839844,
         "环境参数.室外温度": -8,
         "环境参数.室内温度": 22.4
      },
      {
         "位号": "广达报警喀左办事处",
         "在线": true,
         "站点编号": "0002",
         "供热面积": "400",
         "热能泵.开关机": 1,
         "热能泵.模式设置": null,
         "热能泵.出水温度": 37.9,
         "热能泵.回水温度": 34.7,
         "热能泵.制热温度设置": null,
         "用电统计.光伏总电量": null,
         "用电统计.光伏上网电量": null,
         "用电统计.光伏供热电量": null,
         "用电统计.供热总电量": 4478.52002,
         "环境参数.室外温度": -8.8,
         "环境参数.室内温度": 14.1
      }
   ]
}
```

### 获得监控点信息【getMp】

**请求**

 查询监测点的配置或者状态数据

```json
{
    "jsonrpc": "2.0", "method": "getMp", 
    "id": 1
}
```

**参数**

**tag**="" `string` 指定需要获取的对象的位号。空字符串表示根节点。

**mode**="array" `string` 

- `'array'` 以列表的形式返回

- `'map'` 以对象形式返回，可以使用监控点位号来索引对象

**getConf** = true `bool` 是否获取配置信息。只需实时数据，设为false以减少轮询数据大小。

**getVal** = false`bool` 返回 `'val'` 字段，监控点当前值。

**getValDesc** = false `bool`  返回 `'valDesc'`字段，当前值的描述信息。

bool类型的监控点的2种状态可能配置为“正常”，“故障”两种状态，那么valDesc直接返回“正常”或“故障”字符串。

int类型的监控点可能被配置为枚举监控点，并且配置了枚举描述，比如风速监控点，0=自动,1=一档，2=二档，3=三挡，那么valDesc直接返回“自动”，”一档“等描述字符串。

**getUnit** = false `bool` 当监控点位浮点类型时，valDesc字段是否需要携带单位信息

**getStatus** = false `bool` 是否在监控对象中携带当前值，报警状态，数据更新时间等运行时属性。包含了getVal指定的返回内容

**getStatusDesc** = false `bool` 是否包含状态描述信息。包含了getValDesc指定的返回内容。

**高级参数** *(确认理解对象树及其查询的基本概念后使用，一般缺省即可)*

**rootTag** = '' `string` 指定返回对象根节点位号。默认为根节点。使用rootTag后，所有对象的位号都会以相对rootTag的相对位号来表示。

**响应**

```json
{
    "jsonrpc": "2.0", "method": "getMp", 
    "result": [
        {
            "tag": "客厅.温度",
            "time": "2020-02-14 20:20:20",
            "val": 35
        },{
            "tag": "厨房.温度",
            "time": "2020-02-14 20:20:20",
            "val": 35
        },{
            "tag": "卧室.温度",
            "time": "2020-02-14 20:20:20",
            "val": 35
        }
    ],
    "id": 1
}
```

### 获得对象统计信息【getObjStatis】

分别统计4个节点下的对象信息，按类型进行分类

**请求**

```json
{
  "jsonrpc": "2.0",
  "method": "getObjStatis",
  "params": {
    "rootTag": ["视频监控系统","消控系统","能耗系统","出入口系统"],
    "mode":"groupByType"
  },
  "id": 1,
  "user": "admin",
  "pwd": "123"
}
```

**参数**

**rootTag**="" `string` /`array` 指定需要进行统计的根节点位号。string表示统计1个节点，返回1个对象。array 表示统计多个节点，返回多个统计结果对象

**mode**="groupByType" `string`

- `'groupByType'` 按照对象类型分类统计

- `'total'` 统计所有，不分类

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "getObjStatis",
   "id": 1,
   "result": {
      "出入口系统": [],
      "消控系统": [
         {
            "alarm": 0,
            "count": 164,
            "type": "信号阀M",
            "fault": 0,
            "normal": 164,
            "offline": 0,
            "online": 164
         },
         {
            "alarm": 0,
            "count": 30,
            "type": "压力开关",
            "fault": 0,
            "normal": 30,
            "offline": 0,
            "online": 30
         }
      ],
      "能耗系统": [
         {
            "alarm": 0,
            "count": 26,
            "type": "电表",
            "fault": 0,
            "normal": 26,
            "offline": 26,
            "online": 0
         }
      ],
      "视频监控系统": [
         {
            "alarm": 0,
            "count": 46,
            "type": "摄像头",
            "fault": 0,
            "normal": 46,
            "offline": 0,
            "online": 46
         }
      ]
   }
}
```

**请求** 统计整个系统中的所有对象，并且不按对象进行分类

rootTag = ""表示整个系统的根节点

```json
{
  "jsonrpc": "2.0",
  "method": "getObjStatis",
  "params": {
    "rootTag": "",
    "mode":"total"
  },
  "id": 1
}
```

**响应** 

```json
{
   "jsonrpc": "2.0",
   "method": "getObjStatis",
   "id": 1,
   "result": {
      "alarm": 0,
      "count": 10395,
      "type": "*",
      "fault": 0,
      "normal": 10395,
      "offline": 266,
      "online": 10129
   }
}
```

```**请求**
rootTag = ""表示整个系统的根节点

```json
{
  "jsonrpc": "2.0",
  "method": "getObjStatis",
  "params": {
    "rootTag": "能耗系统",
    "mode":"total"
  },
  "id": 1
}
```

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "getObjStatis",
   "id": 1,
   "result": {
      "alarm": 0,
      "count": 26,
      "type": "*",
      "fault": 0,
      "normal": 26,
      "offline": 26,
      "online": 0
   }
}
```

### 获取对象模板【getObjTemplate】

**请求**

```json
{
    "jsonrpc": "2.0", "method": "getObjTemplate", 
    "params": {
    }, 
    "id": 1
}
```

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "getObjTemplate",
   "id": 1,
   "result": [
      {
         "data": {
            "children": [
               {
                  "name": "1#X1"
                  .......
               }
            ],
            "name": "1#",
            "type": "道岔"
            .....
         },
         "name": "道岔"   //模板名称
      }
   ]
}
```

### 设置对象模板【setObjTemplate】

**请求**

```json
{
    "jsonrpc": "2.0", "method": "setObjTemplate", 
    "params": [
      {
         "data": {
            "children": [
               {
                  "name": "1#X1"
                  .......
               }
            ],
            "name": "1#",
            "type": "道岔"
            .....
         },
         "name": "道岔"   //模板名称
      }
   ], 
    "id": 1
}
```

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "setObjTemplate",
   "id": 1,
   "result": "ok"
}
```

## 数据IO

### 输入数据 【input】

IO设备采集的数据*主动*输入到tds服务中的某个监控对象

#### 单位号输入

**请求**   

```json
{
    "jsonrpc": "2.0", "method": "input", 
    "params": {
        "tag": "客厅.温度",
        "time": "2020-02-14 20:20:20",
        "val": 35
    }, 
    "id": 1
}
```

#### 多位号输入

多点输入，并且多点的采集时间相同

**请求

```json
{
    "jsonrpc": "2.0", "method": "input", 
    "params": [
        {
            "tag": "客厅.温度",
            "time": "2020-02-14 20:20:20",
            "val": 26.5
        },{
            "tag": "客厅.湿度",
            "time": "2020-02-14 20:20:20",
            "val": 65.1
        } 
    ]
    "id": 1
}
```

#### 多位号输入 (相同采集时间)

多点输入，并且多点的采集时间相同

**请求

```json
{
    "jsonrpc": "2.0", "method": "input", 
    "params": {
        "tag": ["客厅.温度","客厅.湿度"],
        "time": "2020-02-14 20:20:20",
        "val": [26.5,65.1]
    }, 
    "id": 1
}
```

#### 对象属性模式输入

多点输入，并且多点的采集时间相同。先通过tag指定对象，再通过data指定输入到该对象的多个数据元，数据元中的tag字段指定对象属性的相对位号

**请求** 

```json
{
    "jsonrpc": "2.0", "method": "input", 
    "params": {
        "tag":"客厅",
        "data":[
            {
                "tag":"温度",
                "val":26.5
            },{
                "tag":"湿度",
                "val":23.5
            }
        ]
    }, 
    "id": 1
}
```

#### 对象属性模式输入(指定objID)

多点输入，先通过对象ID指定对象，再指定输入到该对象的多个数据元

例如将监控对象**北部软件园.12#楼.良途软件**的对象ID设置为电表的ID,则采集到数据后，可以利用电表ID找到该对象，并输入该对象子位号的数值。下例中,data数组元素的tag字段，是相对于objID对应的对象的子位号

**请求** 

```json
{
    "jsonrpc": "2.0", "method": "input", 
    "params": {
        "objID":"2022700998107",
        "data":[
            {
                "tag":"总电量",
                "val":7898
            },{
                "tag":"尖",
                "val":1211
            },{
                "tag":"峰",
                "val":2211
            },{
                "tag":"平",
                "val":19
            },{
                "tag":"谷",
                "val":4257
            }
        ]
    }, 
    "id": 1
}
```

#### 树形结构数据输入

**请求**

```json
{
    "jsonrpc": "2.0", "method": "input", 
    "params": {
        "name":"客厅",
        "children":[
            {
                "name":"温度",
                "val":23.11
            },{
                "name":"湿度",
                "val":65.23
            }
        ]
    }, 
    "id": 1
}
```

#### 带图片或其他文件数据输入

  **请求**

```json
{
    "jsonrpc": "2.0", "method": "input", 
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

**data** `string` 数据元附带的文件数据的base64编码

#### 数据曲线输入

数据曲线是格式特定的文件数据，来自于硬件在某一段时间对输入通道进行高频采样形成。

**请求**

```json
{
    "jsonrpc": "2.0", "method": "input", 
    "params": {
        "tag": "1号线.西湖文化广场.1#.多频曲线S",
        "time": "2020-02-14 20:20:20",
        "file":{
            "type":"curve.json",
            "data":{
                "data_fmt":    "point.xy",
                "start":    "1689869240",
                "end":    "1689869266",
                "unit_y":    "RL",
                "unit_x":    "Hz",
                "CarSta":    "none",
                "Disturb":    "jump",
                "CapWay":    "normal",
                "lastDi":    {
                    "start":    "0",
                    "end":    "0",
                    "val":    ""
                },
                "last2Di":    {
                    "start":    "0",
                    "end":    "0",
                    "val":    ""
                },
                "data":    [{
                    "x":    59750,
                    "y":    5566
                }, {
                    "x":    59930,
                    "y":    6652
                }, {
                    "x":    60110,
                    "y":    6105
                },
                ...... 
                ],
                "data_attr":    [{
                    "name":    "temperature",
                    "label":    "温度",
                    "value":    24.5
                },
                ...... 
                ],
                "time":    "2023-07-21 00:07:46"
                }
        }
    }, 
    "id": 1
}
```

**参数**

**file** 数据元携带的曲线文件数据

**type** = curve.json`string` 

**data** `string` 曲线文件数据内容

### 输出数据【output】

将执行指令通过tds服务的监控对象输出，发送给到绑定的IO设备。

**请求** 

#### 单点输出

```json
{
    "jsonrpc": "2.0", "method": "output", 
    "params": {
        "tag": "客厅.暖光灯",
        "val": true
    }, 
    "id": 1
}
```

#### 多点输出

```json
{
    "jsonrpc": "2.0", "method": "output", 
    "params": [
        {
            "tag": "客厅.暖光灯",
            "val": true
        },{
            "tag": "餐厅.冷光灯",
            "val": false
        }
    ], 
    "id": 1
}
```

**响应**

返回输出成功的通道值

```json
{
    "jsonrpc": "2.0", "method": "output", 
    "result": {
        "tag": "客厅.暖光灯",
        "val": true
    }, 
    "id": 1
}
```

### 输出数据【hexSend/sendToDev】

hexSend用于向某一个设备发送自定义的16进制数据包。支持tcp,udp连接的设备，根据IO管理中配置的设备地址模式，调用对应的通信方式向设备发送数据。

该命令支持向子服务转发请求。

如下假设每幢楼部署了一个TDS服务，整个园区部署了总服务作为上级服务。

在2幢的子服务IO设备管理中，将支持TCP通信的温控器设备绑定到了位号"1层.温控器"

在主服务，通过位号"2幢.1层.温控器" 定位设备

请求

```json
{
    "jsonrpc": "2.0", "method": "hexSend", 
    "params": {
        "tag":"2幢.1层.温控器",  //如果直接请求子服务，此处填 "1层.温控器"
        "data":"01 02 0A 0B"
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "hexSend", 
    "result": "ok", 
    "id": 1
}
```

### 执行设备命令交互【doDevTransaction】

向某一个设备发送自定义的16进制数据包，并等待响应

请求

```json
{
    "jsonrpc": "2.0", "method": "doTransaction", 
    "params": {
        "ioAddr":"192.168.1.2/1", 
        "req":"01 02 0A 0B"
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "doTransaction", 
    "result":{
        "ioAddr":"192.168.1.2/1", 
        "req":"01 02 0A 0B",
        "resp":"01 02 03 0A 0b"
    }, 
    "id": 1
}
```

### 状态更新通知 【onDataUpdate】

该数据包由服务器主动通知，仅发送给连接到  rpc 地址的websocket连接

websocket连接建立后，必须先发送一次subscribe命令

在服务器关闭鉴权的情况下，无需subscribe，默认按照订阅所有发送通知

格式与input相同，但是数据值经过了kb转换和上下限处理

```json
{
    "jsonrpc": "2.0", "method": "onDataUpdate", 
    "params": [
        {
            "tag":"客厅.温度",
            "time":"2020-02-14 20:20:20",
            "val":26.5
        }, {
            "tag":"客厅.湿度",
            "time":"2020-02-14 20:20:20",
            "val":65.1
        }
    ], 
    "id": 1
}
```

## 设备管理(Dev)

### 获取设备信息【getDev】

设备以一个列表的方式存储，网关功能设备可能携带子设备。设备可能会有通道。

本接口用于获取1个或多个设备。以及设备的状态信息

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getDev", 
    "params":{
        "getStatus":true,
        "getChan":true
    },
    "id": 1
}
```

**参数**

**ioAddr**="" `string` 默认获取所有设备。可以指定获取单台设备

**tag**="" `string` 默认获取绑定位号为任意的设备，也包含未绑定设备。tag支持按照位号选择器的格式进行查询，例如  *.温度 可以查询所有尾部为温度的位号。

**rootTag** = '' `string` 获取所有绑定位号可以被rootTag选中的设备。

**getConf**=true `bool` 是否获取配置信息。仅需刷新状态可以设置为false以节省流量。

**getChan** = true `bool` 是否获取通道信息

**getStatus** = false`'bool'` 是否在设备对象中携带报警实时状态、数据更新时间等运行时属性

**type**="" `string` 需要获取的设备类型

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "getDev",
   "id": 1,
   "result": [
      {
         "addr": {
            "ip": "192.168.0.110",
            "port": "4011"
         },
         "addrMode": "tcpClient",
         "tagBind": "1#.1J1",
         "type": "gap"
      },{
         "addr": {
            "ip": "192.168.0.111",
            "port": "4011"
         },
         "addrMode": "tcpClient",
         "tagBind": "1#.1J2",
         "type": "gap"
      }
   ]
}
```

### 获取设备硬件配置【getDevHwConf】

读取硬件中的参数配置

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getDevHwConf", 
    "params":{
        "updateFromHw":true,
        "category":"workparams",
        "type":"tdsp",
        "ioAddr":"192.168.0.100"
    },
    "id": 1
}
```

**参数**

**updateFromHw**= true `bool` 是否从设备更新一次，否则直接读取服务端内存中缓存的

**category** = '' `string` 硬件参数分组，可能硬件有非常多的参数，可以指定一个分组。

**type** = '' `string` 硬件类型。

**ioAddr** = '' `string` 硬件地址。

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "getDevHwConf", 
    "result":{
        "switchStartCurrentThreshold": 500,  //单位mA
        "switchStartCurrentLastTime": 100 ,  //单位
        "type":"tdsp",
        "ioAddr":"192.168.0.100"
    },
    "id": 1
}
```

### 设置设备硬件配置【getDevHwConf】

读取硬件中的参数配置

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getDevHwConf", 
    "params":{
        "updateFromHw":true,
        "category":"workparams",
        "type":"tdsp",
        "ioAddr":"192.168.0.100"
    },
    "id": 1
}
```

**参数**

**updateFromHw**= true `bool` 是否从设备更新一次，否则直接读取服务端内存中缓存的

**category** = '' `string` 硬件参数分组，可能硬件有非常多的参数，可以指定一个分组。

**type** = '' `string` 硬件类型。

**ioAddr** = '' `string` 硬件地址。

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "getDevHwConf", 
    "result":{
        "switchStartCurrentThreshold": 500,  //单位mA
        "switchStartCurrentLastTime": 100 ,  //单位
        "type":"tdsp",
        "ioAddr":"192.168.0.100"
    },
    "id": 1
}
```

## 报警管理(Alarm)

提供了报警常用的增删改查接口。

### 核心概念

| 概念    | 含义  | 表头3 |
| ----- | --- | --- |
| 未恢复报警 | 数据2 | 数据3 |
| 未确认报警 | 数据5 | 数据6 |
| 当前报警  |     |     |
| 历史报警  |     |     |

**事件报警** 

 发生在某个时间点，具有瞬时性或短暂持续性的动作、变化或情况。不认为发生该事件后，监控对象进入到某种状态。例如：行人闯入闸机，我们一般不会说该道闸处于行人闯入状态，下一个有权限的人进入闸机时，恢复该状态。使用 addAlarm添加事件报警时，设置 needRecover:false。该类型的报警，界面上的“是否恢复”列，显示一条横线，表示没有此功能。

**状态报警** 

报警产生后，对象进入一种持续报警状态。例如温度大于40度，对象进入温度过高状态，当温度低于40度时，该状态可以恢复。addAlarm添加的报警，默认都是带状态的，也就是needRecover:true

**当前报警** 

未恢复或者未确认的报警，称为当前报警，界面展示时，可以在同一张表里面展示，该表必须有两列，**是否恢复**、**是否确认**

### 报警查询

包括getAlarmCurrent、getAlarmHistory、getAlarmUnrecover、getAlarmUnack、getAlm接口。其中常用getAlarmCurrent、getAlarmHistory。

#### 获取当前报警 getAlarmCurrent

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getAlarmCurrent", 
    "params":{},
    "id": 1
}
```

##### params参数说明

| 字段          | 类型              | 描述                                                                                     |
| ----------- | --------------- | -------------------------------------------------------------------------------------- |
| rootTag     | String          | 例 "1号线.站1"                                                                             |
| tag         | string或string数组 | 可用\*通配  例 "3#.3#J1.\*"  ，["站1.*", "站2.\*"]                                             |
| type        | string或string数组 | 可用\*通配 例"gap over limit \*",["缺口超标", "阻力超标\*"] .当为string时，可用逗号分隔，例"缺口超标, 阻力超标\*"       |
| time        | String          | "2020-10-10 10:10:10~2020-10-10 10:10:10"  或 "1d2h3m4s"  (最近的1天2时3分4秒)或 "20e" (最近的20个) |
| level       | string或string数组 | “一级” ， ["告警", "预警"]否                                                                   |
| isRecover   | bool            | true、false                                                                             |
| isAck       | bool            | true、false                                                                             |
| needRecover | bool            | 默认 true                                                                                |
| needAck     | bool            | 默认 true                                                                                |

| 字段        | 类型              | 描述                                                                                     |
| --------- | --------------- | -------------------------------------------------------------------------------------- |
| rootTag   | String          | 例 "1号线.站1"                                                                             |
| tag       | string或string数组 | 可用\*通配  例 "3#.3#J1.\*"  ，["站1.*", "站2.\*"]                                             |
| type      | string或string数组 | 可用\*通配 例"gap over limit \*",["缺口超标", "阻力超标\*"] .当为string时，可用逗号分隔，例"缺口超标, 阻力超标\*"       |
| time      | String          | "2020-10-10 10:10:10~2020-10-10 10:10:10"  或 "1d2h3m4s"  (最近的1天2时3分4秒)或 "20e" (最近的20个) |
| level     | string或string数组 | “一级” ， ["告警", "预警"]否                                                                   |
| isRecover | bool            | true、false                                                                             |
| isAck     | bool            | true、false                                                                             |
|           |                 |                                                                                        |

每多一个字段 就多一项 "且"条件，当字段的值为数组时该字段的多个值为或的关系。例：
"params":{
  "rootTag":"1line.station1",
  "tag":["3#.3#J1.*","3#.3#J2.*"],
  "isAck":false
},
相当于查找满足如下条件的记录：
rootTag=="1line.station1"   &&  (tag 匹配 "3#.3#J1.*" || tag 匹配 "3#.3#J2.*")  && isAck==false 。

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "getAlarmCurrent",
   "id": 1,
   "result": [
      {
         "ackInfo": "",
         "ackTime": "0000-00-00 00:00:00",
         "ackUser": "",
         "dbPath": "\\alarms\\current",
         "desc": "aa1",
         "detail": "",
         "isAck": false,
         "isRecover": false,
         "level": "alarm",
         "levelLabel": "告警",
         "picUrl": "",
         "recoverTime": "0000-00-00 00:00:00",
         "suggest": "",
         "tag": "3#.3#J1.gap",
         "time": "2024-05-04 13:07:01",
         "type": "power over a1",
         "typeLabel": "power over a1"
},
.........
}
```

#### 获取当前未恢复报警 getAlarmUnrecover

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getAlarmUnrecover", 
    "params":{},
    "id": 1
}
```

params字段说明请参考getAlarmCurrent。
其查询逻辑相当于在getAlarmCurrent的基础上自动增加了isRecover==true

#### 获取当前未确认报警 getAlarmUnack

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getAlarmUnrecover", 
    "params":{},
    "id": 1
}
```

params字段说明请参考getAlarmCurrent。
其查询逻辑相当于在getAlarmCurrent的基础上自动增加了isAck==true

#### 获取历史报警 getAlarmHistory

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getAlarmHistory", 
    "params":{
        "time":"2023-12-25~2023-12-30"
    },
    "id": 1
}
```

##### params参数说明

| 字段        | 类型              | 描述                                                                                     |
| --------- | --------------- | -------------------------------------------------------------------------------------- |
| rootTag   | String          | 例 "1号线.站1"                                                                             |
| tag       | string或string数组 | 可用\*通配  例 "3#.3#J1.\*"  ，["站1.\*", "站2.\*"]                                            |
| type      | string或string数组 | 可用\*通配 例"gap over limit \*",["缺口超标", "阻力超标\*"]。当为string时，可用逗号分隔，例"缺口超标, 阻力超标\*"        |
| time      | String          | "2020-10-10 10:10:10~2020-10-10 10:10:10"  或 "1d2h3m4s"  (最近的1天2时3分4秒)或 "20e" (最近的20个) |
| level     | string或string数组 | “一级” ， ["告警", "预警"]否                                                                   |
| isRecover | bool            | true、false                                                                             |
| isAck     | bool            | true、false                                                                             |
| keyword   | string          | 使用空格分割的字符串，多个部分同时匹配时则选中。将会在 tag,time,type,level,desc,detail字段中进行匹配                     |

每多一个字段 就多一项 "且"条件，当字段的值为数组时该字段的多个值为或的关系。例：
"params":{
  "rootTag":"1line.station1",
  "tag":["3#.3#J1.*","3#.3#J2.*"],
  "isAck":false
},
相当于查找满足如下条件的记录：
rootTag=="1line.station1"   &&  (tag 匹配 "3#.3#J1.*" || tag 匹配 "3#.3#J2.*")  && isAck==false 。

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "getAlarmHistory",
   "id": 1,
   "result": [
      {
         "ackInfo": "",
         "ackTime": "0000-00-00 00:00:00",
         "ackUser": "",
         "dbPath": "\\alarms\\history",
         "desc": "aa1",
         "detail": "",
         "isAck": false,
         "isRecover": false,
         "level": "alarm",
         "levelLabel": "告警",
         "picUrl": "",
         "recoverTime": "0000-00-00 00:00:00",
         "suggest": "",
         "tag": "3#.3#J1.gap",
         "time": "2024-05-04 13:07:01",
         "type": "power over a1",
         "typeLabel": "power over a1"
},
.........
}
```

以上4种请求返回的格式相同，都是一个报警数组

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "getAlm",
   "id": 1,
   "result": [
      {
         "ackInfo": "",
         "ackTime": "2023-09-23 08:30:00",
         "ackUser": "",
         "desc": "报警值3.600000,上限值3.000000",
         "detail": "",
         "isAck": true,
         "isRecover": false,
         "level": "alarm",
         "levelLabel": "告警",
         "picUrl": "",
         "recoverTime": "",
         "suggest": "",
         "tag": "杭州地铁.1号线.西湖文化广场.1J1",
         "typeTag":[
            {"线路":"1号线"},
            {"站点":"西湖文化广场"},
            {"机位":"1J1"}
         ],
         "time": "2023-09-22 15:38:03",
         "type": "超高限",
         "typeLabel": "超高限"
      },
      {
         "ackInfo": "",
         "ackTime": "2023-09-23 08:40:00",
         "ackUser": "",
         "desc": "报警值14.000000,上限值10.000000",
         "detail": "",
         "isAck": true,
         "isRecover": false,
         "level": "alarm",
         "levelLabel": "告警",
         "picUrl": "",
         "recoverTime": "",
         "suggest": "",
         "tag": "杭州地铁.9号线昌达试车线.仿真调试id01.温度",
         "time": "2023-09-21 09:14:37",
         "type": "超高限",
         "typeLabel": "超高限"
      }
   ]
}
```

### 添加报警

#### 添加报警 【addAlarm】

向报警服务添加报警，可用于

```json
{
    "jsonrpc": "2.0", 
    "method": "addAlarm", 
    "params": {
         "time":"2023-08-08 11:12:23",
         "desc": "感烟探测器报警,回路:69,设备地址:01",
         "level": "告警",
         "tag": "1幢B6区3层",
         "type": "感烟探测器",
         "id":"69001"
    }, 
    "id": 1
}
```

time字段可以缺省，报警时间使用收到报警的时间

产生报警 【addAlarm】

像报警服务添加报警

```json
{
    "jsonrpc": "2.0", 
    "method": "addAlarm", 
    "params": {
         "time":"2023-08-08 11:12:23",
         "desc": "感烟探测器报警,回路:69,设备地址:01",
         "level": "告警",
         "tag": "1幢B6区3层",
         "type": "感烟探测器",
         "id":"69001"
    }, 
    "id": 1
}
```

time字段可以缺省，报警时间使用收到报警的时间

#### 恢复报警 【recoverAlarm】

```json
{
    "jsonrpc": "2.0", 
    "method": "recoverAlarm", 
    "params": {
         "time":"2023-08-08 11:12:23",
         "tag": "1幢B6区3层",
         "type": "感烟探测器",
         "id":"69001"
    }, 
    "id": 1
}
```

根据tag + type + id 组成的报警key来恢复先前生成的报警

#### 确认报警 【ackAlarm】

请求形式1

```json
{
    "jsonrpc": "2.0", 
    "method": "ackAlarm", 
    "params": {
        "time":"2024-04-25 15:40:46",
        "tag": "车站.3#.3#J1.阻力",
        "type": "power over limit1",
        "ackInfo":"设备故障"
    }, 
    "id": 1
}
```

##### params参数说明

| 字段                                                       | 类型     | 描述                    | 备注  |
| -------------------------------------------------------- | ------ | --------------------- | --- |
| tag                                                      | string |                       | 必选  |
| time                                                     | String | "2020-10-10 10:10:10" | 可选  |
| type                                                     | string | 报警类型                  | 可选  |
| ackInfo                                                  | string | 确认信息                  | 可选  |
| 说明：通过tag+time+type唯一匹配一个报警记录，当time和type不全存在时返回匹配到的最后一个记录 |        |                       |     |

请求形式2

```json
{
    "jsonrpc": "2.0", 
    "method": "ackAlarm", 
    "params": {
        "uuid":"xxx...",
        "ackInfo":"设备故障"
    }, 
    "id": 1
}
```

##### params参数说明

| 字段                  | 类型     | 描述   | 备注  |
| ------------------- | ------ | ---- | --- |
| uuid                | string |      | 必选  |
| ackInfo             | string | 确认信息 | 可选  |
| 说明：通过uuid唯一匹配一个报警记录 |        |      |     |

请求形式3

```json
{
    "jsonrpc": "2.0", 
    "method": "ackAlarm", 
    "params": {
         "time":"2023-08-08 11:12:23",
         "tag": "1幢B6区3层",
         "type": "感烟探测器",
         "id":"69001"
    }, 
    "id": 1
}
```

根据tag + type + id 组成的报警key来恢复先前生成的报警

### 数据通知

以下通知事件会通知给TDS的客户端

#### 报警更新通知通知 【onAlarmupdate】

更新报警通知

```json
{
    "jsonrpc": "2.0", 
    "method": "onAlarmUpdate", 
    "ioAddr": "192.168.2.83:10081",
    "params": {
         "time":"2023-08-08 11:12:23",
         "desc": "报警更新",
         "level": "L3",
         "tag": "1#.直尖轨段1",
         "type": "DJ1脱落",
         "needRecover": true,
         "multiUnack": false
    }
}
```
将level从L3改为normal，可以恢复报警

#### 报警产生通知 【onAlarmAdd】

向报警服务添加报警

```json
{
    "jsonrpc": "2.0", 
    "method": "onAlarmAdd", 
    "params": {
         "time":"2023-08-08 11:12:23",
         "desc": "感烟探测器报警,回路:69,设备地址:01",
         "level": "告警",
         "tag": "1幢B6区3层",
         "type": "感烟探测器",
         "id":"69001"
    }, 
    "id": 1
}
```

time字段可以缺省，报警时间使用收到报警的时间

#### 报警恢复通知 【onAlarmRecover】

```json
{
    "jsonrpc": "2.0", 
    "method": "onAlarmRecover", 
    "params": {
         "time":"2023-08-08 11:12:23",
         "tag": "1幢B6区3层",
         "type": "感烟探测器",
         "id":"69001"
    }, 
    "id": 1
}
```

根据tag + type + id 组成的报警key来恢复先前生成的报警

#### 报警确认通知 【onAlarmAck】

```json
{
    "jsonrpc": "2.0", 
    "method": "onAlarmAck", 
    "params": {
         "time":"2023-08-08 11:12:23",
         "tag": "1幢B6区3层",
         "type": "感烟探测器",
         "id":"69001"
    }, 
    "id": 1
}
```

根据tag + type + id 组成的报警key来恢复先前生成的报警###  

## 事件日志管理(Log)

### 获取事件日志 getLog

**请求**

获取最近一天的事件日志

```json
{
    "jsonrpc": "2.0", 
    "method": "getLog", 
    "params":{
        "time":"1d"
    },
    "id": 1
}
```

**参数**

**time** `string` 参考事件选择器

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "getLog",
   "id": 1,
   "result": [
      {
         "info": "",
         "level": "信息",
         "object": "系统",
         "org": "",
         "src": "用户:",
         "time": "2023-03-02 13:42:51",
         "type": "登录"
      },
      {
         "info": "设置为:3",
         "level": "信息",
         "object": "良途软件实验室.主灯亮度",
         "org": "",
         "src": "用户:admin",
         "time": "2023-03-02 13:41:52",
         "type": "控制输出"
      }
   ]
}
```

## 添加事件日志 addLog

**请求**

获取最近一天的事件日志

```json
{
    "jsonrpc": "2.0", 
    "method": "addLog", 
    "params":{
        "src":"设备",
        "type":"自检故障",
        "level":"中等",
        "info": "1#.尖轨曲段1 探头脱落"
    },
    "id": 1
}
```

**参数**

**src** `string` 事件源，可以填写 `用户`，`系统`,`脚本`,`设备`

**level** `string` 可以填  轻微，中等，严重。或者自定义

**type** `string` 可以填 控制输出，系统配置，自检故障等。或者自定义

**响应**

```json
{
   "jsonrpc": "2.0",
   "method": "addLog",
   "id": 1,
   "result": "ok"
}
```

## 高频数据流(data stream)

类似于视频码流，高频采样的数据点（毫秒级采样），可以从服务拉取数据流。使用websocket连接服务，获取指定位号的实时数据流推送。

websocket的URL地址格式：

> ws://cloud.tds.com:667/stream/良途软件实验室.空气质量.温度.de
> 
> wss://cloud.tds.com:666/stream/良途软件实验室.空气质量.温度.de
> 
> [服务地址]/stream/[位号].de

服务连接成功后，单个websocket数据包推送一个数据元(data element),持续不间断推送，数据元格式如下:

```json
{
    "time":"2022-11-11 11:11:11.124",
    "val": 25.34
}
```

### 请求服务端主动推流

请求服务端主动连接当前请求命令的主机，连接指定端口并开始推送数据流

```json
{
    "method":"startPushStream",
    "params": {
        "srcTag":"正弦信号",
        "destTag":"良途软件实验室.正弦信号",
        "port":"665",
        "ip":"127.0.0.1",
        "socketType":"tcp"
    }
}  
```

**参数**

**srcTag** `string` 数据源位号

**destTag** `string` 推流目标位号

**port**`Int` 推流的目的端口号

**ip** `string` 推流的目的ip，如果缺省，向发送请求的主机推送

**socketType**`string` tcp,udp

首发包

```json
{
    "method":"devRegister",
    "params": {
        "devType":"streamPusher",
        "tag":"良途软件实验室.正弦信号"
    }
}
```

## 服务路由(Rpc Route)

在TDS物联网系统中，设备或者子服务也会提供rpc服务，在请求中加入会话参数，可以对请求进行路由转发

### 使用tag路由

tag可能是子服务或者是设备，请求将被转发到该对象进行处理

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getDevInfo", 
    "params":{

    },
    "id": 1,
    "tag":"浙江.杭州.良途软件实验室"
}
```

该请求将被转发到 位号为“浙江.杭州.良途软件实验室”的子服务,并由该子服务执行getDevInfo命令

### 使用ioAddr路由

加入 ioAddr 参数

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "acq", 
    "params":{
    },
    "id": 1,
    "ioAddr":"192.168.6.101"
}
```

该请求将被转发到 地址为“192.168.6.101”的TDSP设备

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "acq", 
    "params":{
    },
    "id": 1,
    "tag":"良途软件实验室.空气质量"
}
```

该请求将被转发到 绑定了位号“良途软件实验室.空气质量”的TDSP设备

## 附录

### HMAC-SHA256 实现

#### javascript

```javascript
/**
Run the code online with this jsfiddle. Dependent upon an open source js library calledhttp://code.google.com/p/crypto-js/.
**/

<script src="https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js"></script>

<script>
  var hash = CryptoJS.HmacSHA256("Message", "secret");
  var hashInBase64 = hash.toString().toUpperCase();
  document.write(hashInBase64);
</script>
```

#### java

```java
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

public static String sha256HMAC(String content, String secret) {
    Mac sha256HMAC = null;
    try {
        sha256HMAC = Mac.getInstance("HmacSHA256");
    } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
    }
    SecretKey secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
    try {
        sha256HMAC.init(secretKey);
    } catch (InvalidKeyException e) {
        e.printStackTrace();
    }
    byte[] digest = sha256HMAC.doFinal(content.getBytes(StandardCharsets.UTF_8));
    return new HexBinaryAdapter().marshal(digest).toUpperCase();
}
```

#### C#

```csharp
using System;
using System.Security.Cryptography;

namespace Test
{
  public class MyHmac
  {
    public static string Encrypt(string message, string secret)
            {
                secret = secret ?? "";
                var encoding = new System.Text.UTF8Encoding();
                byte[] keyByte = encoding.GetBytes(secret);
                byte[] messageBytes = encoding.GetBytes(message);
                using (var hmacsha256 = new HMACSHA256(keyByte))
                {
                    byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);
                    StringBuilder builder = new StringBuilder();
                    for (int i = 0; i < hashmessage.Length; i++)
                    {
                        builder.Append(hashmessage[i].ToString("x2"));
                    }
                    return builder.ToString().ToUpper();
                }
            }
  }
}
```

```

```
