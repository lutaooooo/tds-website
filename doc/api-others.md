# 数据服务接口 - 其他可参考使用的API

## 概要

该文档定义的接口不是TDS的通用标准接口，可以供定制化项目作为实现参考

部分命令为设备的API

协议格式基于JSON RPC标准，见：[JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

## 设备搜索

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "heartbeat", 
    "params":{
    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "heartbeat", 
    "params":{
        "name":"XX站",
        "svnVersion":{
            "server":"3389",
            "web":"133"
        }
    },
    "id": 1
}
```

## 设备搜索

**广播**

```json
{
    "jsonrpc": "2.0", 
    "method": "Who-Is", 
    "params":{
    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "I-Am", 
    "params":{
        "name":"XX站",
        "svnVersion":{
            "server":"3389",
            "web":"133"
        }
    },
    "id": 1
}
```

## 获取服务主机状态

**广播**

```json
{
    "jsonrpc": "2.0", 
    "method": "getServerStatus", 
    "params":{
    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "getServerStatus", 
    "params":{
        "cpu": 40,
        "memory": 223309,
        "handle": 39433
    },
    "id": 1
}
```

## 请求升级

直接发送到指定服务的udp端口

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "upgrade", 
    "params":{
        "service":"SAP-1234_exeOnly.zip",
        "web":"Web-1234_webOnly.zip"
    },
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", 
    "method": "upgrade", 
    "result":"ok",
    "id": 1
}
```

## 升级状态通知

由服务发往升级工具,升级过程中发送，可以在升级工具上显示

**通知**

```json
{
    "jsonrpc": "2.0", 
    "method": "upgradeStatus", 
    "params":{
        "progress":"正在下载文件..."
    },
    "id": 1
}
```

## 大屏可视化控制

该系列命令由大屏设备实现，这些命令直接发给大屏设备或者通过tds透传给大屏设备

### 上一页

 **请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "demoScreen.nextPage", 
    "params":{
    },
    "id": 1
}
```

### 下一页

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "demoScreen.previousPage", 
    "params":{
    },
    "id": 1
}
```

### 自动播放

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "demoScreen.play", 
    "params":{
    },
    "id": 1
}
```

### 停止自动播放

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "demoScreen.stop", 
    "params":{
    },
    "id": 1
}
```
