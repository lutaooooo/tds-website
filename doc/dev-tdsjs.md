# 使用tds.js开发前端

## 概要
tds.js 封装了对 JsonRPC的调用功能，用户与本地配置功能，前端应用调用tds.js来访问tds服务。

```
<script type="text/javascript" src="tds.js"></script>
```

在html文件中引用 tds.js文件。

可以通过全局对象 tds 调用相关功能。

tds.js以http方式或者websocket方式与后端通信，websocket方式可以接收通知

## tds函数接口

###  tds.call

功能：

​		调用JsonRPC函数。具体的参数定义可以查看 tdsRPC 协议。

原型：

> tds.call([method],[params],[callback],[sessionParams])

参数：

 * *method* （*string*）  jsonRPC方法的名称
 * params （*object*）  jsonRPC的参数,每个方法有自己对应的参数格式
 * callback （*function*) rpc执行后的回调，成功rlt!=null,失败err!=null (err,rlt)=>{   .....your code    }
 * sessionParams (*object*) 本次 RPC调用会话的参数
    * ioAddr (*string*) 表示本次会话通过tds透传到某个io地址的硬件设备，该硬件设备也支持jsonRPC服务
    * id (*string*)  jsonRPC 的id字段采用什么格式，默认字符串格式，可选数字格式，如 id='number' 

###  tds.connect

功能：

​		建立长连接以接收通知。连接之前可以设置 tds.onConnected 变量，在该变量上设置回调函数，与服务器连接成功后会回调。

原型

> tds.connect([clientName])

参数

 * clientName<string> 当前客户端的名字，可以不设置。



###  tds.onNotify

功能：

​		设置用户自定义的通知处理函数，接收服务器的通知



## tds成员变量

### tds.user

功能：

​		通过该变量访问当前登录的用户信息

字段：

		* name （*string*）当前登录的用户名 如: 'admin'
		* org (*string*) 当前用户所属组织机构，当字段为空字符串时 ''，表示用户属于组织根节点
		* permission (object) 用户对监测对象树的读写权限
		* role (*string*) 当前用户的角色名称，如:"管理员"
		* token （*string*）tds的访问权限token，登陆后服务器分配，一定时间后失效。调用tds.call时，内部会自动加入该token



