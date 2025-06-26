# Mopanel开发指南
## 需求概要
特定的行业往往会开发专用的监控硬件设备，例如：

* 养殖领域用1个专用的设备来监控鱼塘的溶解氧，自动投料等

* 共享茶楼领域用1个专用的设备来控制茶楼内的电器，门禁等

每个设备往往有固定的监控内容，配置参数，并且在一个系统内有大量的此类设备。

此类设备一般都有一个不同于其他设备的专用的操控面板，用于监控设备数据，设置设备参数，设置设备自动执行任务等。

tds中为这类设备开发一个专门的Html页面，并通过iframe的方式按微前端的思路集成到前端，通过tdsRPC和tds服务通信。

mopanel按照标签页的方式组织，一般包含以下几个**通用**标签页：

| 标签页名称 | 功能                                         |
| ---------- | -------------------------------------------- |
| 监控       | 当前设备的实时数据，实时报警，实时控制按钮等 |
| 任务       | 设备自动执行的任务参数配置                   |
| 配置       | 设备硬件的工作参数                           |
| 信息       | 设备基本信息，如IMEI，软件版本，硬件版本等   |

有些设备有一些特有的标签页，例如全向声波设备有 播放 标签页。

## 设计概要

moPanel从服务器获取部分服务器缓存的数据。也直接从硬件设备获取数据。

![overview](/dev-mopanel/overview.svg)



## 集成

### 前端

mopanel的页面文件一般放置在web跟目录下的mopanel文件夹中，每种设备有自己的文件夹名称，如煤气炮设备：      $WebRoot$/mopanel/mqp 

前端在调用该页面时，通过iframe集成，并传入如下url参数，例如：

localhost:667/mopanel/mqp?ioAddr=TDSP_TEST_001

ioAddr传入设备的io地址。表示该面板用于操控该台设备。

### 服务器通信tds.js

服务端通信调用tds.js进行。前端html页面引用 tds.js文件，内部会实例化tds对象
调用tds.call函数来调用平台的 jsonRPC 接口。

> tds.call([method],[params],[callback],[sessionParams])

*method参数*:  jsonRPC方法。
*params参数*：jsonRPC参数。
*callback*: 回调函数
*sessionParams*:本次调用的会话参数.ioAddr表示要发送到哪个io设备

```javascript
tds.call("getDevConf",{name:'tasks'},(err,rlt)=>{
    if(rlt)
    {
       console.log("this is task conf: \n" + rlt["tasks"]);
    }
},{ioAddr:'TDSP_TEST_001'})
```

例如以上代码：

[method] = getDevConf获取设备参数，

[params] = “*”，表示获取所有参数

回调函数返回 err,rlt参数，如果成功，err为null,如果失败 rlt为null

[sessionParams] = ioAddr参数表示 该命令是透传给设备的。执行设备的getDevConf方法。

*协议格式 - 获取服务器缓存数据*

http://www.liangtusoft.com/doc/#/dev-tdsRPC?id=设备数据缓存

*透传到设备*



## 代码设计

前端统一使用 vue + elementui开发，一个面板和一个Vue对象关联，以下描述中使用 this 表示

Vue对象的关键成员变量：

| 变量名称            | 功能                                               |
| ------------------- | -------------------------------------------------- |
| this.conf           | 设备配置参数。通过getDevConfBuff接口获取。有默认值 |
| this.conf.tasks     | 设备任务列表。有默认值。                           |
| this.conf.trackList | 曲目列表                                           |
| this.data           | 实时通道数据。通过getDevStatus获取                 |
| this.alarmStatus    | 实时报警数据。通过getDevStatus获取                 |
| this.info           | 设备基本信息。 通过getDevInfo获取                  |

面板打开的初始化流程：

1. 通过 getDevConfBuff从服务器获取配置。保存在 this.conf中。

   对于全向声波设备。this.conf.trackList中包含了所有的曲目列表

2. 通过getDevStatus从服务器获取一次实时数据。保存在 this.data和this.alarmStatus中

   3.根据 this.data.currentTask 序号从 this.conf.tasks 中获取到当前任务信息，在播放页面展示

   4.根据 this.data.currentTrack 序号 从 this.conf.trackList中获取到曲目名称，在播放页面展示



