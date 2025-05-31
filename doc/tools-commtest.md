# Commtest使用手册

## 功能概要

Commtest软件用于ModbusRTU、TDS-RPC协议测试。对连接电脑的硬件设备，可以很方便的进行数据发送接受的测试。

## 使用方法

Commtest软件基于TDS主程序运行，先运行TDS程序（下载地址：http://www.liangtusoft.com/download/tds.zip ），使用web方式访问。打开Google浏览器，输入 http://127.0.0.1:667/commtest/ 进入页面。见下图。

![image-20220322092424206](tools-commtest\image-20220322092424206.png)

### 测试串口设备

进入页面后，选择连接类型为“串口”。

选择对应设备的串口号，波特率等参数按实际情况修改填写。

点击“打开串口”。

![image-20220322094204384](tools-commtest\image-20220322094204384.png)

选择测试命令进行测试

![image-20220322094646403](tools-commtest\image-20220322094646403.png)

选择命令后点击右下角发送。在上半部分显示发送及接收的数据

![image-20220322101729407](tools-commtest\image-20220322101729407.png)
