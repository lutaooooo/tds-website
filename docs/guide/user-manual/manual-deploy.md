# 部署与运维

## 配置文件

TDS有两个核心配置文件

**appConf.ini** 应用程序配置

与tds在同一个目录下，里面保存与具体项目无关的配置和项目配置路径 confPath 

**projectConf.ini** 项目配置

在项目配置目录下，里面存放数据库目录，服务端口号等关键信息

## 标准单服务器部署

* 获取TDS发布压缩包

* 下载需要的微服务组件。例如：
  
  https://www.liangtusoft.com/fsRoot/微服务组件/mediaServer.zip

* 获取已有的项目配置，命名为conf文件夹 （新建项目会自动创建conf文件夹）

* 按照部署规范进行部署

* 启动tKeep，tKeep会启动tds与本项目中的所有微服务
  
  ![](/manual-deploy/deploy.svg)
  
  ### 自定义部署配置
  
  在 tds/appConf.ini中配置
  
  ```ini
  confpath=../conf
  ```
  
  如果E盘整个盘用来存储数据库数据，可以直接如下配置，可以方便的管理硬盘数据
  
  在conf/projectConf.ini中配置
  
  ```ini
  dbpath=E:/db
  ```

> 部署目录结构设计思想：
> 
> **1.方便升级与回退版本**
> 
> 当进行版本升级时，可以将新版本压缩包放在 tds 同级目录下，就可以打开当前的数据库和配置。如果配置和数据库放在 tds 文件夹里面，升级时，需要覆盖到tds文件夹内部或者将配置和数据库拷贝出来。操作不方便，也不方便回退。该设计目录结构，需要用哪个版本打开哪个文件夹下的tds就行。

### 自定义界面参数

在 conf/ui.ini 中配置本项目相关的ui定制参数

```ini
#这是一个UI界面的配置模板，请将该文件拷贝到项目的配置文件夹并进行相关配置
theme = darkblue        
titleShort=TDS物联网平台
footNote=TDS,
title=TDS物联网平台
#程序登陆后默认打开的应用
startupApp=mapgd/index.html
```

## 云端+边缘端联合部署  (服务级联)

如果TDS服务部署在本地局域网中，需要把本地服务连接到TDS云服务。可以使用服务级联的功能。服务级联将 局域网中的服务看做是一个设备，连接到云端的TDS服务。

进行服务级联，需要进行如下步骤:

* 本地服务左侧导航栏进入 **系统组态** ->**监控对象** 修改根节点的名称，该名称将作为本地服务在云服务当中的 设备ID

* 在tds.ini中配置云服务地址，参数为 masterDs= cloud.liangtusoft.com:665

* 重启本地服务

* 登录云服务，进入IO设备管理，找到上线的下级服务，点击绑定按钮，将下级服务绑定到云服务监控对象树的一个节点上。  例如绑定到:  浙江->杭州->杭州办公室  节点。

* 在云服务的**监控对象**配置中，右键点击 浙江->杭州->杭州办公室 ，选择从子服务读取配置，这样云服务上就有了子服务的监控对象结构配置。点击保存配置按钮

### 局域网视频上云

#### 云端中转方式

中转方式下，边缘端服务将推流到云端流媒体服务，浏览器访问云端流媒体服务。简化配置，不受本地宽带是否有动态Ip限制

边缘端无需配置，默认采用中转方式

登录TDS的云服务，在监控对象配置中选择对应的子服务器节点，配置参数**取流方式**为中转

在云端流媒体服务器mediaServer/config.ini中做如下配置：

```ini
[rtc]
externIP=cloud.liangtusoft.com
```

#### 直连方式

直连方式下浏览器直接连接边缘端服务，无需中转，节省云服务器带宽

直连方式需要给边缘端做DDNS和端口映射

需要配置 streamServer 的 externalIP 为 DDNS的公网地址

在 tds.ini中添加DDNS配置

登录TDS的云服务，在监控对象配置中选择对应的子服务器节点，配置参数**取流方式**为**直连**

## 分布式部署

### 流媒体服务

可以为流媒体服务配置独立的主机，使用域名或者IP地址

假设tds部署在主机 tds.liangtusoft.com上，流媒体服务部署在 stream.liangtusoft.com上

在 tds/tds.ini中配置

```ini
mediaSrvIP= stream.liangtusoft.com
```

在service/mediaServer/config.ini中配置

```ini
[hook]
enable=1
on_stream_not_found=http://tds.liangtusoft.com:667/zlmhook/on_stream_not_found
```

使用API的 getStreamUrl测试配置好的流媒体服务地址是否生效

请求

```json
{
  "jsonrpc": "2.0",
  "method": "getStreamUrl",
  "params": {
    "tag": "摄像头1"
  },
  "id": 1
}
```

响应

```json
{
   "jsonrpc": "2.0",
   "method": "getStreamUrl",
   "id": 1,
   "result": {
      "flv": "http://stream.liangtusoft.com:669/stream_良途软件实验室/摄像头1.live.flv",
      "hls": "http://stream.liangtusoft.com:669/stream_良途软件实验室/摄像头1/hls.m3u8",
      "isChildTds": false,
      "rtc": "http://stream.liangtusoft.com:669/index/api/webrtc?app=stream_良途软件实验室&stream=摄像头1&type=play",
      "rtsp": "rtsp://stream.liangtusoft.com/stream_良途软件实验室/摄像头1"
   }
}
```

### 流媒体鉴权

可设置流媒体鉴权来保护内容,确保服务安全

假设tds部署在主机 tds.liangtusoft.com上，流媒体服务部署在 stream.liangtusoft.com上

在service/mediaServer/config.ini中增加如下配置,即可开启鉴权.

```ini
[hook]
enable=1
on_play=http://tds.liangtusoft.com:667/zlmhook/on_play
```

<img title="" src="/manual-deploy/streamMediaAuthentication.svg" alt="" data-align="center" width="709">

## Https模式部署

https模式部署需要在 **配置目录** 下放置私钥和证书文件，文件以pem格式存储

可以按照如下方式命名，软件可以自动识别

配置目录一般在 tds.ini中配置为  ../conf

tds程序启动命令行，会提示证书加载信息，启动时检查命令行确认证书是否正确加载。

 方式1：

```
www.liangtusoft.com.key
www.liangtusoft.com.cert
```

方式2：

```
key.pem
cert.pem
```

在tds.ini中启用https端口，如下:

```ini
httpsPort = 666
```

## 设备连接

### 注册包

设备使用tcpClient模式，当tcp连接建立时， 可以向tds发送第一个数据包作为注册包。

使用注册包时，设备的地址模式配置为 **设备ID**

注册包有以下几种格式:

| 格式                    | 设备ID识别 | 使用场景           |
| --------------------- | ------ | -------------- |
| RS485_ 或者 rs485_ 作为前缀 | 前缀后字符串 | 一般用于485网关      |
| LORA_ 或者 lora_ 作为前缀   | 前缀后字符串 | 一般用于lora网关     |
| IMEI_ 或者 imei_ 作为前缀   | 前缀后字符串 | 一般用于4g设备或者4g网关 |
| 全部都是ASCII字符           | 整个字符串  | 任意场景           |

 例如:

RS485_00001 的注册包，该设备的ID被识别为 00001

ABCD 的注册包，该设备的ID被识别为 ABCD
## 程序及服务升级：
  升级包组成如图:
  ![](/manual-deploy/upgrade.svg)
  升级方法:

生成对应升级包后,在子服务管理上选择对应类型,开启升级即可.

注:为保证升级过程的安全,该升级功能需搭配最新版tKeep.exe使用,可移步资源菜单下载.

## 附录：

### 端口分配

确保以下端口在部署TDS的服务器上可用。

如果是云服务器，一般需要在安全组当中放行端口。

| 端口号     | 功能                                               | 注意事项 |
| ------- | ------------------------------------------------ | ---- |
| **设备端** |                                                  |      |
| 502     | modbusTcp                                        |      |
| 554     | RTSP端口                                           |      |
| 663     | IQ60智能控制器                                        |      |
| 664     | modbusRtu over TCP                               |      |
| 665     | TDSP协议<br/>Adaptor接入服务<br/>udp设备接入服务<br/> TDS子服务 |      |
| **用户端** |                                                  |      |
| 666     | 物联数据服务, https或wss                                |      |
| 667     | 物联数据服务, http或ws                                  |      |
| 668     | 流媒体服务 https                                      |      |
| 669     | 流媒体服务 http                                       |      |

**注意事项**

> 如果子服务部署在内网，并希望通过主服务跳转访问数据与码流
> 
> 对 666-669 端口做端口映射

### 端口映射注意事项

如果系统部署需要做端口映射，参考以下步骤:

* 确认运营商提供了动态公网ip

* 如果接了光猫，光猫改桥接模式 (打电话让运营商改就行，不过要办宽带的那个人打电话，应该要提供身份信息什么的)

* wifi路由器里面配置好拨号

* 找一下路由器里面的 "端口映射" 或者 “虚拟服务器功能”， 把路由器的端口映射到部署了TDS的这台电脑的端口

* 或者路由器中找到DMZ主机功能，直接把部署TDS这台电脑 配置为DMZ主机
