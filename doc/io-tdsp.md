# 

```
{
    "method": "input",  
    "params": [
        1.2,
        2.33,
        4.5,
        2.17
    ] 
}
```

# 一、概要

## 规范

DEV-RPC协议是设备向平台提供的rpc协议。用于io设备与tds平台之间的通信

协议基于JsonRPC标准，参https://www.jsonrpc.org/

## 组包方式(framing)

使用tcp直接传输，每个数据包后面 加两个换行符  \n\n ，用于包分割。

socket收到数据后，检测到两个\n直接分割为1个数据包，并解析为json对象，如果解析为对象失败，认为数据格式错误丢弃该包。

## 数据包类型

| **包类型** | **格式** | **使用场景**              |
| ------- | ------ | --------------------- |
| 请求响应包   | 携带id字段 | 用于平台向设备请求设备返回时将id原样返回 |
| 通知包     | 没有id字段 | 用于设备主动通知平台            |

## 包格式

以下为1个完整的数据包示例，是查询设备信息的响应数据包:

```
{
    "jsonrpc": "2.0", 
    "method": "getDevInfo",   //命令类型
    "result": {               //命令返回结果
        "softVer":  "1.0.0",
        "hardVer":  "1.0.0",
        "mfrDate":  "2021-10-29",
        "IMEI":  "xxxxxxxxx",
        "IMSI":  "xxxxxxxxx"
    }, 
    "id": 1,  //命令序号. 响应包和请求包一致    
    "ioAddr": "0000000000001",  //硬件的io地址，使用IMEI
    "clientId": "XXXXXXXX"      //请求者的标识.响应包和请求包一致
}
\n
\n
```

## 嵌入式开发环境 JSON数据包处理

github上有很多的json开源库可以下载。用的比较多的是cJSON，网上能搜到比较多的cJSON用在单片机上的资料，github地址：

https://github.com/DaveGamble/cJSON.git

如果github比较慢，也可以到这里下载：

http://www.liangtusoft.com/download/常用代码库/cJSON.zip

都是纯C开发，一个.h一个.c，一些参考资料：

https://zhuanlan.zhihu.com/p/137992824

https://zhuanlan.zhihu.com/p/207117976

## 与平台的交互机制

- 设备以tcp客户端模式连接到平台
- 主动发送第一个数据包，并携带 ioAddr字段，填入设备ID(字符串格式)，煤气炮设备下，ID直接使用IMEI. 主动发送的第一个数据包发送  getDevInfo命令.
- 平台解析数据包中的ioAddr，寻找平台上配置该设备的ID，从而知道具体是哪台设备
- 设备发送的每个数据包，都需要携带ioAddr字段
- 平台发送的数据包中，也会携带ioAddr字段，设备无需解析该字段，因为平台不会将非该ioAddr的数据包发给此设备。

# 二、数据输入输出

## 获取当前数据 【acq】

acq 指令由一个io设备执行,io设备根据指定ioAddr参数,采集所有该io设备的下级io地址的当前值.

请求  主机->**设备**

```json
{
    "jsonrpc": "2.0", "method": "acq",  
    "params": {
       "ioAddr":  "*"//通道地址. * 表示读取所有通道
    }, 
    "id": 1,  //命令序号. 响应包和请求包一致    
    "ioAddr": "0000000000001",  //硬件的io地址，使用IMEI
    "clientId": "XXXXXXXX"      //请求者的标识.响应包和请求包一致
}
```

**group**  `string` 通道组，只采集指定通道组的通道数据

**addr**  `string` 需要采集的通道地址 

**响应  设备****->****主机**

如果设备目前不支持该数据，返回中不包含该项即可

数组模式返回（数组模式可以为没个通道数据附加一些信息）

```
{
    "jsonrpc": "2.0", "method": "acq",  
    "result": [
        {
        "ioAddr": "voltage",
        "val": 25.0
        },{
        "addr": "current",
        "val": 5.0
        }
    ], 
    "id": 1,  //和服务器发送的保持一致    
    "ioAddr": "xxxxxxxxx"  //本机的io地址，使用IMEI
}
```

对象模式返回(对象模式可以节省数据长度)

```
{
    "jsonrpc": "2.0", "method": "acq",  
    "result": {
        "voltage": 25.0,
        "current": 5.0
    }, 
    "id": 1,  //和服务器发送的保持一致    
    "ioAddr": "xxxxxxxxx"  //本机的io地址，使用IMEI
}
```

数组模式返回(默认使用序号作为通道号)

请求

```json
{
    "method": "acq"
}
```

响应

数组元素的index就表示通道编号，通道从0开始编号

```json
{
    "method": "acq",  
    "result": [
        1.2,
        2.33,
        4.5,
        2.17
    ] 
}
```

## 主动上送数据 【input】

### 按通道输入数据

通知 设备->主机     数组模式

```
{
    "jsonrpc": "2.0", "method": "input",  
    "params": [
        {
        "ioAddr": "voltage",
        "val": 25.0
        },{
        "addr": "current",
        "val": 5.0
        }
    ],  
    "ioAddr": "xxxxxxxxx"  
}
```

对象模式返回(对象模式可以节省数据长度)

```
{
    "jsonrpc": "2.0", "method": "input",  
    "params": {
        "voltage": 25.0,
        "current": 5.0
    }, 
    "ioAddr": "xxxxxxxxx"  
}
```

数组模式返回(默认使用序号作为通道号)

```
{
    "method": "input",  
    "params": [
        1.2,
        2.33,
        4.5,
        2.17
    ] 
}
```

### 数组模式返回

```json
["i",[1.2,2.33,4.5,2.17]]\n\n
```

### 

### 按位号输入数据

当设备被绑定到某一个对象，并知道相对于该对象的相对位号时，可以使用**tag**来输入数据

例如某大厦安装温湿度监控，每层房间1，房间2各安装了一个温湿度监控设备，

在io配置中，ioAddr = 192.168.1.100的设备已经被绑定到了位号**科技大厦.1楼**

在做好1楼对象内部监控点位结构约定的情况下，可以使用位号方式输入数据

**设备通知**

```json
{
    "jsonrpc": "2.0", "method": "input",  
    "params": {
        "tag":"房间1.温度", //最终输入到位号  科技大厦.1楼.房间1.温度
        "val":23.1
    },  
    "ioAddr": "192.168.1.100"  //绑定到位号 科技大厦.1楼
}
```

## 数据输出【output】

主机->设备

```
{
    "jsonrpc": "2.0", "method": "output",  
    "params": {
        "switch1": true,
        "temp": 25.0
    }, 
    "ioAddr": "xxxxxxxxx"  
}
```

支持同时输出多个通道

## 当前报警状态 【getAlarmStatus】

- 请求  主机->**设备**

```
{
    "jsonrpc": "2.0", "method": "getAlarmStatus",  
    "id": 1
}
```

**响应  设备****->****主机**

存在该报警状态则返回，正常状态不返回该项目

```
{
    "jsonrpc": "2.0", "method": "getAlarmStatus",  
    "result": [{
        "type": "voltageOverLimit",
        "time": "2021-10-23 11:12:14"
        },{
        "type": "currentOverLimit",
        "time": "2021-10-23 11:12:14"
        }
    ], 
    "id": 1,   //和服务器发送的保持一致
    "ioAddr": "xxxxxxxxx"  //本机的io地址，使用IMEI
}
```

# 三、参数配置与信息管理

### 设备上线注册 【devRegister】

**设备->主机**

**通知**

```
{
    "jsonrpc": "2.0", "method": "devRegister",
    "params": {
        "info":{
            "softVer":  "1.0.0",
            "hardVer":  "1.0.0",
            "mfrDate":  "2021-10-29",
            "IMEI":  "xxxxxxxxx",
            "IMSI":  "xxxxxxxxx"
        }
    },
    "ioAddr":"xxxxxxxxx"
     //通知不需要id字段
}
```

## 获取设备参数 【getDevConf】

**请求  主机****->****设备**

***表示获取所有配置项**

```
{
    "jsonrpc": "2.0", "method": "getDevConf",
    "params":"*",
    "id": 1
     "clientId": "XXXXXXXX"      //请求者的标识.响应包和请求包一致
}
```

**响应  设备****->****主机**

```
{
    "jsonrpc": "2.0", "method": "getDevConf",  
    "result": {
           "param1": 0.4,
           "param2":  1.8,
           "param3":  1.0
    } , 
    "id": 1,   //和服务器发送的保持一致
    "ioAddr": "xxxxxxxxx"  //本机的io地址，使用IMEI
}
```

**请求  主机****->****设备**

**获取指定配置项  暂时可以无需实现. 视未来扩展需要**

```
{
    "jsonrpc": "2.0", "method": "getDevConf",
    "params":["param1","param2"],
    "id": 1
    "clientId": "XXXXXXXX"      //请求者的标识.响应包和请求包一致
}
```

**响应  设备****->****主机**

```
{
    "jsonrpc": "2.0", "method": "getDevConf",  
    "result": {
        "param1":  2.0,
        "param2":  1.0
    },
    "id": 1
}
```

## 设置设备参数 【setDevConf】

**请求  主机****->设备

设置可以填入任意字段，设备端仅设置数据包里面请求的confItem

```
{
    "jsonrpc": "2.0", "method": "setDevConf",  
    "params": {
        "param1":  2.0,
        "param2":  1.0
    },
    "id": 1
    "clientId": "XXXXXXXX"      //请求者的标识.响应包和请求包一致
}

//设置设备通信参数举例
{
    "jsonrpc": "2.0", "method": "setDevConf",  
    "params": {
        "serverIP":  "192.168.0.100",
        "serverPort":  666
    },
    "id": 1
    "clientId": "XXXXXXXX"      //请求者的标识.响应包和请求包一致
}
```

**响应  设备****->****主机**

成功

```
{
    "jsonrpc": "2.0", "method": "setDevConf",  
    "result":"ok" , 
    "id": 1   //和服务器发送的保持一致
}
```

错误

```
{
    "jsonrpc": "2.0", "method": "setDevConf",  
    "error":"fail XXXXXXX" , //error中填入一串错误信息字符串。例如参数范围校验不通过等等。 
    "id": 1   //和服务器发送的保持一致
}
```

## 获取设备信息 【getDevInfo】

**请求  主机->设备**

```
{
    "jsonrpc": "2.0", "method": "getDevInfo",  
    "id": 1
     "clientId": "XXXXXXXX"      //请求者的标识.响应包和请求包一致
}
```

**响应  设备****->****主机**

```
{
    "jsonrpc": "2.0", "method": "getDevInfo",  
    "result": {
        "softVer":  "1.0.0",
        "hardVer":  "1.0.0",
        "mfrDate":  "2021-10-29",
        "IMEI":  "xxxxxxxxx",
        "IMSI":  "xxxxxxxxx"
        "phoneNum":  "xxxxxxxxx"
        "deviceId":  "xxxxxxxxx"
        "deviceType":  "xxxxxxxxx"
    }, 
    "id": 1,   //和服务器发送的保持一致
    "ioAddr": "xxxxxxxxx"  //本机的io地址，使用IMEI
}
```

# 四、辅助与测试命令

## 重启设备 【rebootDev】

**设备->主机**

**通知**

```
{
    "jsonrpc": "2.0", "method": "rebootDev",
    "params": {},
    "id": 1,   //命令序号，返回和请求一致
     "ioAddr": "xxxxxxxxx"  //本机的io地址，使用IMEI
     "clientId": "XXXXXXXX"      //请求者的标识.响应包和请求包一致
}
```

## 重启设备通信 【rebootComm】

**设备->主机**

**通知**

```
{
    "jsonrpc": "2.0", "method": "rebootComm",
    "params": {},
    "id": 1,   //命令序号，返回和请求一致
     "ioAddr": "xxxxxxxxx"  //本机的io地址，使用IMEI
     "clientId": "XXXXXXXX"      //请求者的标识.响应包和请求包一致
}
```

# 五、升级固件

升级流程：

* 平台先发送startUpgrade

* 设备做好升级准备，回复ok

* 平台依次发送各个数据包，最后1个包发送成功，平台认为升级结束

* 设备收到最后1个数据包，启动升级

* 平台查询设备最新版本，确认升级成功

## 开始固件升级 【startUpgrade】

请求 (平台 -> 设备)

```json
{    
    "jsonrpc": "2.0", 
    "method": "startUpgrade",    
    "params": {        
        "fileLen": 13000，//升级文件大小        
        "fileCrc": 50000，//文件crc        
        "pktNum": 20, //分包数量        
        "pktLen":  4000, //分包长度        
        "version":"1.0.1",
        "devType":"mqp"  
    },    
    "id": 1  
}
```

响应

```json
{    
    "jsonrpc": "2.0", 
    "method": "startDevUpgrade",    
    "result": "ok",    
    "id": 1,   //命令序号，返回和请求一致    
    "ioAddr": "xxxxxxxxx"  //本机的io地址，使用IMEI
}
```

## 向设备上传固件分包 【uploadFirmware】

分包从0开始编号

任意1次分包传输失败，最多重试3次，重试3次仍不成功。退出升级流程

设备收到最后一个分包，校验文件crc通过后，启动升级

请求 (平台->设备)

```json
{    
    "method": "uploadDevFirmware",    
    "params": {        
        "no": 1, //分包编号        
        "len":4000, //分包长度        
        "enc": "base64",        
        "data":"123LKJ23K2J3DJHJ.........",        
        "crc":45000  //unsigned short类型crc校验。base64编码前的crc    
    },    
    "id": 1
}
```

响应

```json
{    
    "method": "uploadDevFirmware",    
    "result": "ok",    
    "id": 1
}
```

响应

返回任何错误，平台终止升级流程

```json
{    
    "method": "uploadDevFirmware",    
    "error": "any error description", //任意错误描述信息    
    "id": 1
}
```

## 停止固件升级 【stopUpgrade】

请求 (平台 -> 设备)

```json
{    
    "jsonrpc": "2.0", 
    "method": "stopDevUpgrade",    
    "params": {},    
    "id": 1  
}
```

响应

```json
{    
    "jsonrpc": "2.0", 
    "method": "stopDevUpgrade",    
    "result": "ok",    
    "id": 1,   //命令序号，返回和请求一致    
    "ioAddr": "xxxxxxxxx"  //本机的io地址，使用IMEI
}
```

## 平台服务接口 - 升级单步调试

以下接口用于在接口测试环境下测试升级，

### 开始固件升级 【startDevUpgrade】

调用该接口将间接调用 设备通信协议中的 startUpgrade，自动加载升级文件，并填入升级文件信息。参数params即是返回的result中的升级信息

请求 (平台 -> 设备)

```json
{    
    "jsonrpc": "2.0", 
    "method": "startDevUpgrade",    
    "params": {        
        "ioAddr":"IMEI0000000001",  
        "firmware":"devType_v1.0.3_20220917.bin",
        "pktLen":4000
    },    
    "id": 1  
}
```

**pktLen** `int` 分包长度，缺省4000

响应

```json
{    
    "jsonrpc": "2.0", 
    "method": "startDevUpgrade",    
    "result": {
        "fileLen": 13000，//升级文件大小        
        "fileCrc": 50000，//文件crc        
        "pktNum": 20, //分包数量        
        "pktLen":  4000, //分包长度        
        "version":"1.0.1"  
    },    
    "id": 1   //命令序号，返回和请求一致    
}
```

### 向设备上传固件分包 【uploadDevFirmware】

分包编号从0开始。

上传指定文件的指定分包，方便单元测试，响应会返回本次上传的数据信息。

请求 (平台->设备)

```json
{    
    "method": "uploadDevFirmware",    
    "params": {  
        "ioAddr":"IMEI0000000001",  
        "firmware":"devType_v1.0.3_20220917.bin",          
        "no": 0,       
        "len":4000,         
        "enc": "base64"
    },    
    "id": 1
}
```

no: 分包编号  len 分包长度 crc分包crc（base64编码前）

响应

```json
{
   "jsonrpc": "2.0",
   "method": "uploadDevFirmware",
   "id": 1,
   "result": {
      "crc": 19579,
      "data": "lm9k2dNIAIgeKGDdACDSSQiAyUkIgAEg0EkIcAAkDeDP.......",
      "enc": "base64",
      "fileLen": 47144,
      "firmware": "mqp_v1.0.1_20220809.bin",
      "ioAddr": "861714055057453",
      "len": 4000,
      "no": 1,
      "pktNum": 12
   }
}
```

### 停止固件升级 【stopDevUpgrade】

请求 (平台 -> 设备)

```json
{    
    "jsonrpc": "2.0", 
    "method": "stopDevUpgrade",    
    "params": {
        "ioAddr":"IMEI0000000001"  //需要停止升级的设备的io地址
    },    
    "id": 1  
}
```

响应

```json
{    
    "jsonrpc": "2.0", 
    "method": "stopDevUpgrade",    
    "result": "ok",    
    "id": 1   //命令序号，返回和请求一致    
}
```

## 平台服务接口 - 自动升级流程控制

或者供前端页面调用

### 获得固件列表 【getDevFirmware】

请求 (平台 -> 设备)

```json
{    
    "jsonrpc": "2.0", 
    "method": "getDevFirmware",    
    "params": {},    
    "id": 1  
}
```

响应

```json
{    
    "jsonrpc": "2.0", 
    "method": "getDevFirmware",    
    "result": [
        "devTypeA_v1.0.3_20220917.bin",
        "devTypeB_v1.0.2_20220917.bin",
        "devTypeC_v2.0.1_20220917.bin"
    ],    
    "id": 1   //命令序号，返回和请求一致   
}
```

### 启动升级流程 【startDevUpgradeProcess】

调用该接口将间接调用 设备通信协议中的 startUpgrade，自动加载升级文件，并填入升级文件信息。参数params即是返回的result中的升级信息

请求 (平台 -> 设备)

```json
{    
    "jsonrpc": "2.0", 
    "method": "startDevUpgradeProcess",    
    "params": {        
        "ioAddr":"IMEI0000000001",  
        "firmware":"devType_v1.0.3_20220917.bin",
        "pktLen":4000
    },    
    "id": 1  
}
```

**pktLen** `int` 分包长度，缺省4000

响应

```json
{    
    "jsonrpc": "2.0", 
    "method": "startDevUpgradeProcess",    
    "result": {
        "fileLen": 13000，//升级文件大小        
        "fileCrc": 50000，//文件crc        
        "pktNum": 20, //分包数量        
        "pktLen":  4000, //分包长度        
        "version":"1.0.1"  
    },    
    "id": 1   //命令序号，返回和请求一致    
}
```

### 停止升级流程 【stopDevUpgradeProcess】

请求 (平台 -> 设备)

```json
{    
    "jsonrpc": "2.0", 
    "method": "stopDevUpgradeProcess",    
    "params": {
        "ioAddr":"IMEI0000000001"  //需要停止升级的设备的io地址
    },    
    "id": 1  
}
```

响应

```json
{    
    "jsonrpc": "2.0", 
    "method": "stopDevUpgradeProcess",    
    "result": "ok",    
    "id": 1   //命令序号，返回和请求一致    
}
```

### 获得升级信息 【getDev】

请求 (平台 -> 设备)

```json
{    
    "jsonrpc": "2.0", 
    "method": "getDev",    
    "params": {
        "getUpgradeInfo":true,
        "getChan":false,
        "getConf":false  
    },    
    "id": 1  
}
```

getChan 通道信息不要 getConf 配置信息不要 getUpgradeInfo 获取升级信息

响应

```json
{
   "jsonrpc": "2.0",
   "method": "getDev",
   "id": 1,
   "result": {
      "upgradeInfo": {
         "currentPktNo": 4,
         "devType": "mqp",
         "fileLen": 47144,
         "fileName": "mqp_v1.0.1_20220809.bin",
         "isUpgrading": true,
         "pktLen": 1000,
         "pktNum": 48,
         "progress": "上传升级文件",
         "status": "",
         "version": "v1.0.1"
      }
   }
}
```

## 六、TDSP设备请求路由

通过几个 会话参数，可以从TDS平台将数据包路由到设备

### ioAddr路由

```json
{
 "jsonrpc": "2.0", "method": "getDevConf",
 "params":"*",
 "id": 1
 "ioAddr": "XXXXXXXX" //将该数据包发送到指定ioAddr的Tdsp设备
}
```

如果ioAddr包含 adp/ 前缀，表示先将数据包转发到 adaptor

### tag路由

根据tag找到绑定该tag的设备并转发  

### childTds路由

路由到指定的子Tds服务

该字段指定childTds的位号

### adaptor路由

路由到指定adaptor下方的设备.适配器下方的设备的地址格式都带有前缀

 adp_192.168.31.101:8090 后面带设备的地址。如果是udp，则需要带端口
