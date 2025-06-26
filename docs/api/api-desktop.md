# DeskApp API

## 概要

TDS封装了windows系统交互功能，使得可以使用前端技术来开发桌面程序

## 串口功能

#### com.open 打开串口

```json
{
    "jsonrpc": "2.0", "method": "com.open", 
    "params": {
       "port":"COM1",
       "baudRate" : 19200,
       "byteSize" : 8,
       "parity" : 0,
       "stopBits" : 0
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "output", 
    "result": "ok", 
    "id": 1
}
```

#### com.close 关闭串口

```json
{
    "jsonrpc": "2.0", "method": "com.close", 
    "params": {
       "port":"COM1"
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "com.close", 
    "result": "ok", 
    "id": 1
}
```

#### com.list 关闭串口

```json
{
    "jsonrpc": "2.0", 
    "method": "com.list", 
    "params": "", 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "com.close", 
    "result": "ok", 
    "id": 1
}
```

#### com.req 请求并等待响应

```json
{
    "jsonrpc": "2.0", "method": "com.req", 
    "params": {
       "port":"COM1",
       "type":"bin", //bin or text
       "data":"0102030405"
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "com.req", 
    "result": "ok", 
    "id": 1
}
```
