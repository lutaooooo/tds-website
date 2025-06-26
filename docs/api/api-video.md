# TDS-VIDEO 开发接口

## 概要

TDS包含了流媒体服务器功能，支持HLS，FLV，fMp4等多种流协议。

支持Onvif,Visca云台控制协议设备接入，并通过TDS-RPC进行云台控制

## 码流地址

[TDS服务地址]\stream\\[位号].[格式]

例如:

http-flv码流

http://cloud.liangtusoft.com/stream/浙江.杭州.良途软件实验室.flv

webRTC码流

[http://cloud.liangtusoft.com/stream/浙江.杭州.良途软件实验室.rtc](http://cloud.liangtusoft.com/stream/%E6%B5%99%E6%B1%9F.%E6%9D%AD%E5%B7%9E.%E8%89%AF%E9%80%94%E8%BD%AF%E4%BB%B6%E5%AE%9E%E9%AA%8C%E5%AE%A4.flv)

HLS码流

[http://cloud.liangtusoft.com/stream/浙江.杭州.良途软件实验室.hls](http://cloud.liangtusoft.com/stream/%E6%B5%99%E6%B1%9F.%E6%9D%AD%E5%B7%9E.%E8%89%AF%E9%80%94%E8%BD%AF%E4%BB%B6%E5%AE%9E%E9%AA%8C%E5%AE%A4.flv)

fmp4码流

[http://cloud.liangtusoft.com/stream/浙江.杭州.良途软件实验室.mp4](http://cloud.liangtusoft.com/stream/%E6%B5%99%E6%B1%9F.%E6%9D%AD%E5%B7%9E.%E8%89%AF%E9%80%94%E8%BD%AF%E4%BB%B6%E5%AE%9E%E9%AA%8C%E5%AE%A4.flv) 

## 打开码流  【openStream】

打开媒体源的码流，如果打开成功或者已经处于打开状态，都返回成功

**请求**

```json
{
    "jsonrpc": "2.0", "method": "openStream", 
    "params": {
       "tag":"机房1.摄像头1"
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "openStream", 
    "result": {
        "hls": "",
        "h":1080
    }, 
    "id": 1
}
```

## 关闭码流 【closeStream】

**请求**

```json
{
    "jsonrpc": "2.0", "method": "openStream", 
    "params": {
       "tag":"机房1.摄像头1"
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "openStream", 
    "result": {
        "hls": "",
        "h":1080
    }, 
    "id": 1
}
```

## 开始云台移动 【startPanTilt】

**请求**

```json
{
    "jsonrpc": "2.0", "method": "startPanTilt", 
    "params": {
       "tag":"机房1.摄像头1",
       "dir":"left",
       "panSpeed":5,
       "tiltSpeed":5
    }, 
    "id": 1
}
```

**tag**    `string` 支持云台控制的设备的位号

**dir**    `string` 移动方向

* `up` 向上移动     `upLeft` 左上  `upRight` 右上

* `down` 向下移动  `downLeft` 左下 `downRight` 右下

* `left` 向左移动

* `right` 向右移动    

**panSpeed** `int` 水平移动速度

**tiltSpeed** `int` 垂直移动速度

**time** `int` 移动时间。单位ms。如果有该参数，移动会自动停止

**响应**

```json
{
    "jsonrpc": "2.0", "method": "startPanTilt", 
    "result": "ok", 
    "id": 1
}
```

## 停止云台移动 【stopPanTilt】

**请求**

```json
{
    "jsonrpc": "2.0", "method": "stopPanTilt", 
    "params": {}, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "stopPanTilt", 
    "result": "ok", 
    "id": 1
}
```

## 开始缩放 【startZoom】

**请求**

```json
{
    "jsonrpc": "2.0", "method": "startZoom", 
    "params": {
       "tag":"机房1.摄像头1",
       "dir":"in",
       "speed":5
    }, 
    "id": 1
}
```

**tag** `string` 相机位号

**dir** `string` 移动方向

- `in` 放大

- `out` 缩小

**speed** `int` 缩放速度。无该参数，使用摄像机内置的默认标准速度

**time** `int` 缩放时间。单位ms。如果有该参数，缩放会自动停止

**响应**

```json
{
    "jsonrpc": "2.0", "method": "startZoom", 
    "result": "ok", 
    "id": 1
}
```

## 停止缩放 【stopZoom】

**请求**

```json
{
    "jsonrpc": "2.0", "method": "stopZoom", 
    "params": {}, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "stopZoom", 
    "result": "ok", 
    "id": 1
}
```

## 开始聚焦 【startFocus】

**请求**

```json
{
    "jsonrpc": "2.0", "method": "startFocus", 
    "params": {
       "tag":"机房1.摄像头1",
       "dir":"far",
       "speed":5
    }, 
    "id": 1
}
```

**tag** `string` 相机位号

**dir** `string` 聚焦方向

- `far` 远处聚焦

- `near` 近处聚焦

**speed** `int` 聚焦速度。无该参数，使用摄像机内置的默认标准速度

**time** `int` 聚焦时间。单位ms。如果有该参数，缩放会自动停止

**响应**

```json
{
    "jsonrpc": "2.0", "method": "startFocus", 
    "result": "ok", 
    "id": 1
}
```

## 停止缩放 【stopFocus】

**请求**

```json
{
    "jsonrpc": "2.0", "method": "stopFocus", 
    "params": {}, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "stopFocus", 
    "result": "ok", 
    "id": 1
}
```

## 调用预置位 【gotoPreset】

**请求**

```json
{
    "jsonrpc": "2.0", "method": "gotoPreset", 
    "params": {
        "presetIndex": 1
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "gotoPreset", 
    "result": "ok", 
    "id": 1
}
```

## 添加预置位 【addPreset】

将当前云台参数添加为预置位

**请求**

```json
{
    "jsonrpc": "2.0", "method": "addPreset", 
    "params": {
        "presetIndex": 1
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "addPreset", 
    "result": {
        "presetIndex": 1
    }
    "id": 1
}
```

## 删除预置位 【deletePreset】

将当前云台参数添加为预置位

**请求**

```json
{
    "jsonrpc": "2.0", "method": "deletePreset", 
    "params": {
        "presetIndex": 1
    }, 
    "id": 1
}
```

**响应**

```json
{
    "jsonrpc": "2.0", "method": "deletePreset", 
    "result": {
        "presetIndex": 1
    }
    "id": 1
}
```

## 批量调用

使用JSON-RPC的Batch模式，依次执行多个命令

将 机房1.摄像头1 先左移1.5秒，再上移2秒，再右移动1秒，

注意3个命令全部执行完之后才会返回

**请求**

```json
[
    {
        "method": "startPanTilt", 
        "params": {
           "tag":"机房1.摄像头1",
           "dir":"left",
           "time":1500
        }, 
        "id": 1
    },{
        "method": "startPanTilt", 
        "params": {
           "tag":"机房1.摄像头1",
           "dir":"up",
           "time":2000
        }, 
        "id": 2
    },{
        "method": "startPanTilt", 
        "params": {
           "tag":"机房1.摄像头1",
           "dir":"right",
           "time":1000
        }, 
        "id": 3
    }
]
```

**响应**

```json
[
    {
        "method": "startPanTilt", 
        "result": "ok", 
        "id": 1
    },{
        "method": "startPanTilt", 
        "result": "ok", 
        "id": 2
    },{
        "method": "startPanTilt", 
        "result": "ok", 
        "id": 3
    }
]
```
