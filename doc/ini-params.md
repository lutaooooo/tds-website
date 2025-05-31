#数据服务
httpsPort=0            #https服务端口666,同时支持websocket secure
httpPort=667           #http服务端口667,同时支持websocket
httpsMediaPort=668     #https流媒体服务端口668
httpMediaPort=669      #http流媒体服务端口669
tcpPort=670            #tcp服务端口
mediaSrvIP=            #流媒体服务地址,留空为本机

#IO服务
ioSrvIP =                 #IO服务绑定的本地地址。在多网卡服务器上，需要指定与设备通信的那个IP地址。留空为默认0.0.0.0
tdspPort = 665            #IO服务端口 默认665  TDSP协议   
mbPort = 664              #IO服务端口 默认664  Modbus-RTU over TCP 使用串转网网关连接Modbus总线
iq60Port = 663            #IO服务端口 默认663  IQ60物云协议  
mbTcpPort = 502           #IO服务端口 默认502  modbusTcp协议 
leakDetectPort = 8085     #IO服务端口 默认8085 漏点监测设备
iotimeoutTdsp=7000
iotimeoutModbusRtu=5000
iotimeoutIQ60=5000
iotimeoutDLT645=8000
tdspOnlineReq=0           #tdsp设备上线请求getDevInfo
tdspSingleTransaction=0   #tdsp设备请求不允许并发

#安全性
enableAccessCtrl = 0      #开启用户认证
tokenExpireTime = 60      #token失效时间，单位分钟
testToken=                #测试用Token

#服务级联 (主服务端口在主服务的tdspPort配置，默认665)
masterTds=                #主服务地址，多个主服务使用逗号分隔 例如：cloud1.liangtusoft.com:665,cloud2.liangtusoft.com:665

#文件服务
fsRoot=                   #文件服务的根目录。留空不启动文件服务

#短信服务(飞鸽)
smsApiUrl =                  #短信平台api地址
smsApiUser =              #短信平台api账号
smsApiKey =               #短信平台api秘钥

#阿里云
aliKeyID=              #阿里云AccessKeyID
aliKeySecret=          #阿里云AccessKeySecret
ddnsInterval=600       #ddns更新周期
ddnsDomainName=        #ddns更新域名。多个域名使用逗号分隔

#功能模块启用
enableHMR = 0          #启用http服务器热更新功能
authDownload = 0       #开启文件下载用户认证

# 项目配置文件





# ini配置文件参数说明



# 项目配置文件
