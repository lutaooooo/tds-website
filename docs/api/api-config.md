# 组态功能

## 概述

TDS已经自带了组态的页面，如果您需要自主开发组态的页面，才需要用到此文档中的接口

## 项目运行参数

某个具体项目相关的运行参数

### 获取

#### 单个配置

**请求**
获取单个配置

```json
{
    "jsonrpc": "2.0", 
    "method": "getProjectConf", 
    "params":"BASIC.framerate",
    "id": 1
}
```

**响应** 

```json
```json
{
    "jsonrpc": "2.0", 
    "method": "getProjectConf", 
    "result":{
        "BASIC.framerate":133
    },
    "id": 1
}
```

#### 多个配置 Flatten模式

**请求**

获取多个配置

**请求**

```json
{
 "jsonrpc": "2.0", 
"method": "getProjectConf", 
"params":[
 "BASIC.framerate",
 "BASIC.samplingInterval"
 ],
 "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "getProjectConf", 
    "params":{
        "BASIC.framerate":13,
        "BASIC.samplingInterval":24
    },
    "id": 1
} 
```

#### 多个配置 Nested模式

获取多个配置 

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getProjectConf", 
    "params":{
        "BASIC":{
            "framerate":null,
            "samplingInterval":null
        }
    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "getProjectConf", 
    "params":{
        "BASIC":{
            "framerate":31,
            "samplingInterval":12
        }
    },
    "id": 1
}
```

### 设置

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "setProjectConf", 
    "params":{
        "BASIC.framerate":31
    },
    "id": 1
}
```

**响应**

设置成功

```json
{
    "jsonrpc": "2.0", 
    "method": "setProjectConf", 
    "result":{
        "BASIC.framerate":31
    },
    "id": 1
}
```

设置失败

```json
{
    "jsonrpc": "2.0", 
    "method": "setProjectConf", 
    "error":{
        ....
    },
    "id": 1
}
```

## 程序运行参数

程序运行参数与具体的项目组态无关，无需加载项目组态配置就可以生效

**请求**

设置单个或多个

```json
{
    "jsonrpc": "2.0", 
    "method": "setAppConf", 
    "params":{
        "language":"zh"
    },
    "id": 1
}
```

设置单个(分组设置)

一般后端使用ini存储配置，groupName对应ini的 [] 中括号分组，itemName代表分组内的某个具体项目

```json
{
    "jsonrpc": "2.0", 
    "method": "setAppConf", 
    "params":[
        {
            "group":"BASIC",
            "item":"language"
            "value":"zh"
        }
    ]
    },
    "id": 1
}
```

**响应**

设置成功

```json
{
    "jsonrpc": "2.0", 
    "method": "setProjcetConf", 
    "result":{
        "language":"zh"
    },
    "id": 1
}
```

```json
{
    "jsonrpc": "2.0", 
    "method": "setProjcetConf", 
    "result":[
        {
            "group":"BASIC",
            "item":"language"
            "value":"zh"
        }
    ],
    "id": 1
}
```

设置失败

```json
{
    "jsonrpc": "2.0", 
    "method": "setProjcetConf", 
    "error":{
        ....
    },
    "id": 1
}
```

## 监控对象组态命令

### 设置对象信息 【setObj】

**请求**

设置单个对象

```json
{
    "jsonrpc": "2.0", 
    "method": "setObj", 
    "params":{
        //仅获取指定对象的配置
        "tag":"1层.风管机1#",
        "tasks":[
            {
                "name":"自动开机",
                "startDate":"2023-01-01",
                "endDate":"2023-12-31",
                "time":"08:00:00"
            },{
                "name":"自动关机",
                "startDate":"2023-01-01",
                "endDate":"2023-12-31",
                "time":"18:00:00"
            }
        ]
    },
    "id": 1
}
```

**参数**

**tag**="" `string` 指定需要获取的对象的位号。空字符串表示根节点。*表示任意1-n个字符

**rootTag** = '' `string` 指定返回对象根节点位号。默认为根节点。使用rootTag后，所有对象的位号都会以相对rootTag的相对位号来表示。

其他参数为需要设置的字段名称，仅设置指定的字段

设置多个对象

```json
{
    "jsonrpc": "2.0", 
    "method": "setObj", 
    "params":[
    {
        "tag":"1层.风管机1#",
        "tasks":[
            {
                "name":"自动开机",
                "startDate":"2023-01-01",
                "endDate":"2023-12-31",
                "time":"08:00:00"
            },{
                "name":"自动关机",
                "startDate":"2023-01-01",
                "endDate":"2023-12-31",
                "time":"18:00:00"
            }
        ]
    },{
        "tag":"1层.风管机2#",
        "tasks":[
            {
                "name":"自动开机",
                "startDate":"2023-01-01",
                "endDate":"2023-12-31",
                "time":"08:00:00"
            },{
                "name":"自动关机",
                "startDate":"2023-01-01",
                "endDate":"2023-12-31",
                "time":"18:00:00"
            }
        ]
    }
    ],
    "id": 1
}
```

设置整个监控对象树
```json
{
    "children": [
        {
            "name": "监控对象",
            "level": "mo",
            "defaultVal": "",
            "children": [
                {
                    "name": "监控点1",
                    "level": "mp",
                    "saveInterval": {
                        "hour": 0,
                        "minute": 5,
                        "second": 0
                    },
                    "alarmLimit": {
                        "enableHigh": false,
                        "high": 0,
                        "enableLow": false,
                        "low": 0
                    },
                    "validRange": {
                        "enable": false,
                        "min": 0,
                        "max": 0
                    },
                    "defaultVal": "",
                    "k": 1,
                    "b": 0
                },
                {
                    "name": "监控点2",
                    "level": "mp",
                    "saveInterval": {
                        "hour": 0,
                        "minute": 5,
                        "second": 0
                    },
                    "alarmLimit": {
                        "enableHigh": false,
                        "high": 0,
                        "enableLow": false,
                        "low": 0
                    },
                    "validRange": {
                        "enable": false,
                        "min": 0,
                        "max": 0
                    },
                    "defaultVal": "",
                    "k": 1,
                    "b": 0
                },
                {
                    "name": "监控点3",
                    "level": "mp",
                    "saveInterval": {
                        "hour": 0,
                        "minute": 5,
                        "second": 0
                    },
                    "alarmLimit": {
                        "enableHigh": false,
                        "high": 0,
                        "enableLow": false,
                        "low": 0
                    },
                    "validRange": {
                        "enable": false,
                        "min": 0,
                        "max": 0
                    },
                    "defaultVal": "",
                    "k": 1,
                    "b": 0,
                    "ioType": "v",
                    "expression": "(val(\"监控点1\") + val(\"监控点2\"))/2"
                }
            ]
        }
    ],
    "name": "组织结构",
    "level": "root",
    "defaultVal": "",
    "tag": ""
}
```

### 设置监控点参考曲线【setRefCurve】

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "setRefCurve", 
    "params":{
        "tag":"1#.1J1.P",
        "name":"定到反扳动",
        "curve":{
            "interval":15,
            "pt":[1,2,3,.........]
        }
    },
    "id": 1
}
```

参考曲线存储在 配置目录/refCurve/1#/1J1/电参数/P/定到反扳动.json

```json
{
        "tag":"1#.1J1.P",
        "time":"2023-12-13 11:11:11",
        "user":"admin",
        "detail":"螺栓松动前异常曲线",   //正常曲线/.. 描述该参考曲线的功能
        "curve":{
            "interval":15,
            "pt":[1,2,3,.........]
        }
}
```

### 获取监控点参考曲线【getRefCurve】

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getRefCurve", 
    "params":{
        "tag":"1#.1J1.P",
        "name":"定到反扳动"
    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "getRefCurve", 
    "result":{
        "tag":"1#.1J1.P",
        "time":"2023-12-13 11:11:11",
        "user":"admin",
        "name":"定到反扳动",
        "curve":{
            "interval":15,
            "pt":[1,2,3,.........]
        }
    },
    "id": 1
}
```

### 设置设备信息 【deleteObj】

## IO设备组态命令

### 设置设备信息 【getDev】
```json
{
    "jsonrpc": "2.0",
    "method": "getDev",
    "params": {
        "getStatus": true,
        "pageSize": 20,
        "pageNo": 1,
        "getStatis": true
    }
}
```

### 设置设备信息 【setDev】

设置设备配置

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "setDev", 
    "params":{
        "addrType":"deviceId", //决定了addr字段内部的有效字段
        "addr":{
            "id":"1",   //采用ip地址方案时，该字段不存在
            "ip":"192.168.0.1",  //采用id方案时，ip,port..不存在
            "port":8899,
            "localPort":10000,
        },
        "ioAddr":"192.168.0.1/1", //与nodeID选1，用于区分哪一台设备
        "nodeId":"xxxxxxxxx", //配置对象的uuid，工程项目当中唯一
        "category":"workparams",
        "tagBind":"1#.1J1", //绑定的位号
        "children":[], //子设备
        "channels":[  //下属通道
    
        ]
    },
    "id": 1
}
```

**参数**

**addrType**= "deviceID" `string` tcpClient，tcpServer,udpServer,udpClient,deviceID,httpClient,httpServer

**tagBind** = '' `string` 绑定的位号

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

### 设置设

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

### 设置设备硬件配置【setDevHwConf】

读取硬件中的参数配置

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "setDevHwConf", 
    "params":{
        "category":"workparams",
        "hwConf":{
            "switchStartCurrentThreshold": 500,  //单位mA
            "switchStartCurrentLastTime": 100 ,  //单位
        },
        "ioAddr":"192.168.0.100"
    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "getDevHwConf", 
    "result":"ok",
    "id": 1
}
```

**

### 设置设备信息 【deleteDev】

### 设置设备信息 【addDev】

```json
{
    "jsonrpc": "2.0",
    "method": "addDev",
    "params": {
        "name": [
            "智能设备",
            "TDSP设备"
        ],
        "level": "device",
        "type": "tdsp-device",
        "parent_type": "tds",
        "typeLabel": "TDSP设备",
        "addr": {
            "id": "",
            "ip": "192.168.2.83",
            "port": 10081
        },
        "child_type": "channel",
        "online": false,
        "manageStatus": "managed",
        "modified": false,
        "children": [],
        "nodeID": "6cb5e055-5087-4aab-9a7f-ae31f2a24bd9",
        "parentID": null,
        "channels": [],
        "addrType": "tcpClient"
    },
    "id": 32,
    "language": "zh",
    "user": "admin",
    "token": "c6c56417-2f86-4ace-\u00001c1-c97cdb7b2b4d"
}
```

## 用户组态命令

### 添加用户 【addUser】

```json
{
    "jsonrpc": "2.0", 
    "method": "addUser", 
    "params":{
        "name":"公众号用户_openID",
        "gzhOpenID":"xxxxxxx",
        "enable":true,
        "pwd":"123",
        "role":"观察员",
        "org":""
    },
    "id": 1
}
```

### 获取用户列表【getUsers】

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getUsers", 
    "params":{

    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0",
    "method": "getUsers",
    "id": 1,
    "result": [
       {
          "createTime": "2023-03-22 09:53:55",
          "enable": true,
          "name": "admin",
          "org": "",
          "pwd": "123",
          "role": "管理员",
          "gzhOpenID":"xxxxxxx"
       },
       {
          "createTime": "2023-05-10 13:16:34",
          "enable": true,
          "name": "test",
          "org": "",
          "pwd": "test",
          "role": "管理员",
          "gzhOpenID":"xxxxxxx"
       }
    ]
 }
```

### 设置用户配置【setUsers】

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "setUsers", 
    "params":[
       {
          "createTime": "2023-03-22 09:53:55",
          "enable": true,
          "name": "admin",
          "org": "",
          "pwd": "123",
          "role": "管理员",
          "gzhOpenID":"xxxxxxx"
       },
       {
          "createTime": "2023-05-10 13:16:34",
          "enable": true,
          "name": "test",
          "org": "",
          "pwd": "test",
          "role": "管理员",
          "gzhOpenID":"xxxxxxx"
       }
    ],
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0",
    "method": "setUsers",
    "id": 1,
    "result": "ok"
 }
```

### 删除用户配置【deleteUser】

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "deleteUser", 
    "params":{
        "name":"张"
    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0",
    "method": "setUsers",
    "id": 1,
    "result": "ok"
 }
```

## 自定义配置文件

前端调用接口直接读写项目配置目录的配置文件，tds仅做透传，该配置文件由前端管理

### 写自定义配置文件【setConfFile】

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "setConfFile", 
    "params":{
        "path":"shiftPlan/202312.json",
        "data":"abcdefg"
    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0",
    "method": "setConfFile",
    "id": 1,
    "result": "ok"
 }
```

### 读自定义配置文件【getConfFile】

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getConfFile", 
    "params":{
        "path":"shiftPlan/202312.json"
    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0",
    "method": "getConfFile",
    "id": 1,
    "result": {
        "path":"shiftPlan/202312.json",
        "data":"abcdefg"
    }
 }
```

### 写二进制文件

#### 写图片

需要将图片保存为配置

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "setConfFile", 
    "params":{
        "path":"dashboard/images/1.pic",
        "encode":"base64",
        "data":"abcdefg"
    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0",
    "method": "setConfFile",
    "id": 1,
    "result": "ok"
 }
```

#### 写自定义二进制文件

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "setConfFile", 
    "params":{
        "path":"GapFeatureConf/1J1/GapFeatureConf_Invert.grh",
        "mode":"overwrite"
        "encode":"hexStr",
        "data":"01F18712......"
    },
    "id": 1
}
```

**参数**

**mode**= "rewrite"`string`  rewrite重写整个文件； overwrite 从指定的offset位置覆盖写入到指定文件中

**offset** = 0 `int` 写入数据的偏移量，仅overwrite有效,不存在默认取0。

**encode** = ""`string`  base64/hexStr(16进制字符串)

**data** = '' `string` 文件数据

**说明**

**响应**

```json
{
    "jsonrpc": "2.0",
    "method": "setConfFile",
    "id": 1,
    "result": "ok"
 }
```