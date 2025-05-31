# debugapi服务API诊断

## 功能概要

访问 localhost:667/app/debugapi 可以进入debugapi界面，观察api接口通信



## debug接口

所有 POST 到 localhost:667/rpc 的http命令都在该页面进行日志记录

debugapi页面请求  POST 所有的rpc命令到  localhost:667/debug 地址，服务将认为该命令是调试命令，调试命令本身不会进行日志跟踪

以下两条命令可以获得接口诊断信息

getApiSessions

可以获得所有请求过tds的客户端信息，包含http请求和websocket请求



使用websocket连接到  localhost:667/apipkt 地址，该websocket将收到所有http的请求和响应数据包

http日志信息包格式：



```json
{
    "time":"2025-02-03 11:30:12",
    "remoteAddr":"192.168.2.100:12345",
    "len": 1343,
    "head": "......."   //http的整个头部字符串
    "body": "........"  //body的base64编码
    "type": "request"   //http 请求还是响应
}
```


