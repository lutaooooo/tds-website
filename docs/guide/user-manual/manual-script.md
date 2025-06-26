# 脚本管理

## 概述

TDS脚本可以用于:

* 对监控点数值进行二次计算和统计
* 根据条件判断进行输出控制       

脚本使用标准javascript编写，并且提供了一些内置函数，与TDS系统进行交互

### 脚本类型

| 类型    | 配置方式                                  | 执行方式   |
| ----- | ------------------------------------- | ------ |
| 表达式脚本 | 在监控对象管理的监控点配置中，<br/>配置用于计算该监控点实时值的表达式 | 自动周期执行 |
| 全局脚本  | 在脚本管理中配置                              |        |

### 环境位号

#### 全局脚本的环境位号

全局脚本可以配置一个环境位号，默认环境位号为根节点。

配置环境位号后，所有脚本当中的位号，都是相对于该环境位号的相对位号。

例如配置某脚本环境位号为  **A幢.1层.空调1#**

那么脚本不需要写成：

```javascript
output("A幢.1层.空调1#.开关",true)
```

写成，相对环境位号来指定位号

```javascript
output("开关",true)
```

#### 计划任务中的环境位号

计划任务所属的对象，就是计划任务脚本的环境位号

#### 计算表达式的环境位号

计算表达式一般配置在某个监控点上，该表达式脚本的环境位号是该监控点的父节点。

例如有位号：

```javascript
"A幢.1层.空调1#电量"      //可从设备中读取
"A幢.1层.空调2#电量"      //可从设备中读取
"A幢.1层.总电量"          //需要二次计算
```

可以给**A幢.1层.总电量**位号配置计算表达式，此时环境位号为 **A幢.1层**

```javascript
val("空调1#电量") + val("空调2#电量")
```

计算表达式中使用相对位号，可以计算表达式在不同对象使用同一个配置，并可以进行配置的批量应用。

例如假设有位号

```javascript
"A幢.2层.空调1#电量"      //可从设备中读取
"A幢.2层.空调2#电量"      //可从设备中读取
"A幢.2层.总电量"          //需要二次计算
```

此时 **A幢.2层.总电量** 使用和 **A幢.1层.总电量** 相同的计算脚本。

### 位号表达式

#### 相对位号

相对位号是相对于当前**环境位号**的位号,例如环境位号为 **A幢.1层.空调1#**

默认表达式都是相对于该位号的位号，例如：

| 位号表达式 | 对应的绝对位号       |
| ----- | ------------- |
| 开关    | A幢.1层.空调1#.开关 |
| 湿度    | A幢.1层.空调1#.湿度 |

#### 上级位号

tds使用 **^** 符号表示上一级对象树节点：

| 位号表达式      | 对应的绝对位号       |     |
| ---------- | ------------- | --- |
| ^          | A幢.1层         |     |
| ^.空调2#     | A幢.1层.空调2#    |     |
| ^.空调2#.开关  | A幢.1层.空调2#.开关 |     |
| ^^         | A幢            |     |
| ^^.2层.空调1# | A幢.2层.空调1#    |     |

#### 绝对位号

以 `::` 开头的位号，表示绝对位号，假设当前脚本的环境位号为**A幢.1层.空调1#**

那么使用 `::A幢.2层.空调1#.温度` 来引用环境位号范围外的位号

**局部全局统一查找**

可以使用`A幢.2层.空调1#.温度`来表示全局位号，忽略`::`符号，但是会优先匹配环境位号下的位号 `A幢.1层.空调1#.A幢.2层.空调1#.温度`,匹配不到，才会去匹配全局位号

### 无效计算表达式

表达式脚本中如果使用了val函数，该函数返回null时，将不会生成计算结果。

例如，需要计算今天的用电量 val("总电量") - val("总电量","today","first")，使用当前值减去今天的第一个值，

如果今天没有采集到过任何数据，后面那个val函数返回null

前面的val函数返回最新值，可能是昨天采集的

那么该二次计算表达式将不返回计算结果

## 基础功能函数

## 数据服务交互函数

### sum 求和函数

```javascript
sum(tag, invalidAsZero)
```

**tag** `string` 或 `json` 参考位号选择器

**invalidAsZero** = false `bool` 无效值做为0处理，否则遇到无效值，将无法计算最终结果，返回null

### avg 求平均函数

```javascript
avg(tag)
```

**tag** `string` 或 `json` 参考位号选择器，比如使用   *.温度   求整个项目中的温度的平均值

### val 取位号值函数

```javascript
val(tag, time, aggregate)
```

 **tag** `string` 精确指定的位号。 不支持位号选择器多位号选择

**time** `string` 精确指定的时间。参考时间选择器的精确指定模式。

**aggregate** `string` time参数指定一个范围，则必须指定aggregate参数，聚合成为1个返回值

* max 取最大值

* min 取最小值

* avg 取平均值

* sum 取和

* first 取最早值

* diff 求最大与最小值之差

* diff.last-first 分组最后一条记录 减去 第一条记录的值

* diff.first-last 分组第一条记录 减去 最后一条记录的值

* last 取最晚值

* count 统计数量

**取实时值**

如果该位号是一个监控点且为数字型或者布尔型，返回当前值。其他情况返回null

```javascript
val("三楼.温度")
```

**取历史值**

取某个指定时间的历史值

```javascript
val("三楼.温度","2020-02-02 11:30:00")
```

使用时间和聚合参数配置取历史值

取本月的第一个数值

```javascript
val("三楼.温度","this-month","first")
```

### output 输出到设备

该函数一般用于设备控制输出

```javascript
//输出一个 模拟量
output("三楼.空调.设定温度",27.3);

//输出一个开关量
output("三楼.智能空开.开关",true);

//输出一个枚举值
//枚举值的具体含义在监控点属性当中配置
output("三楼.空调.运行模式","制热")
```

### input 数据输入

一般用于进行二次计算之后，将计算的结果输入到系统

```javascript
//取到原始值
var pUp = val("三楼.某设备.上压力");
var pDown = val("三楼.某设备.下压力");
//根据某种计算公式，计算出实际值
var k = (0.87*pUp + 3)/(0.45*pDown + 5);
//输入到某个位号
input("三楼.某设备.压力系数",k);
```

### log 打印日志

可以在脚本编辑下方的输出窗口看到打印信息，一般用于脚本调试

```javascript
var a = 1;
var b = 1;
var c = a + b;
log("c = " + c); 
console.log("c = " + c); //这行代码和上面是等效的，考虑到编码习惯，上下两种都支持
```

将日志打印到 tds 的日志和服务程序命令行窗口

```javascript
console.log("log to tds logfile",true); //第二个参数设置为true
```

一般用于进行二次计算之后，将计算的结果输入到系统

db是一个内置的全局变量，可以调用相关数据库操作

```javascript
db.insert("温控器.温度","2023-12-25 11:30:00",24.5); //插入浮点
db.insert("温控器.开关","2023-12-25 11:30:00",true); //插入布尔
db.insert("温控器.模式","2023-12-25 11:30:00",1);    //插入整形
```

### time()函数

返回当前时间对象TIME，支持increaseSeconds对时间进行加减

支持toStr(),fromStr 函数与字符串互转

```javascript
var t = time();
t.fromStr("2023-01-01 00:00:00");
t.increaseSeconds(10);
log(t.toStr());
t.increaseSeconds(10);
log(t.toStr());
```

以上输出:

2023-01-01 00:00:10

2023-01-01 00:00:20

### http.request 同步http请求

目前tds脚本当中所有的脚本执行都是同步的，不使用回调函数

以下演示通过脚本，调用http请求监控点数据

```javascript
//http的请求参数
var opt = {
  hostname: 'localhost',
  port: 667, 
  path: '/rpc', 
  method: 'POST'
};

//http是tds脚本环境的内置对象，使用http.request函数发起http请求
//http.request是一个同步函数，无需设置回调函数，阻塞代码运行
var resp = http.request(opt); 

if(resp!=null){
    console.log(resp.body);
}
else{
    console.log("请求失败");
}
```

### sleep 睡眠

用于延时控制等，单位毫秒
以下示例表示当温度小于20度，延时4秒打开空调开关

```javascript
if(val("三楼.温度") < 20){
    sleep(4000);
    output("三楼.空调.开关",true);
}
```

### setReturn设置返回值

某些脚本需要设置返回值，比如 控制输出脚本，需要设置

rpc的output函数的返回

### JSON.stringify 格式化json字符串

```javascript
var a = 1;
var s = "123";
a = JSON.stringify(a);
s = JSON.stringify(s);
```

### STR.toHexStr 转为16进制字符串

```javascript
var arr = [1,2,3,20];
var s = STR.toHexStr(arr);
s == "01 02 03 14"
```

## 设备IO脚本函数

IO脚本中，外部会传递环境变量到脚本，在脚本中可以直接调用。

环境变量都是用大驼峰模式

### 环境变量

#### Dev 当前设备

所有IO脚本都支持

**Dev.input(val,chanAddr)**   `function`

 **val** `any` 输入值

**time** `string` 通道地址

**resp Dev.doTransaction(req)**  `function`

 **req** `uint8 array`  请求二进制数据包，字节数组

`uint8 array` 请求二进制数据包，字节数组

```javascript
//同时支持以下两种参数格式
Dev.doTransaction([0x01,0x01])
Dev.doTransaction("01 01")
```

**resp** `uint8 array` 返回的响应二进制数据包，字节数组

**Dev.addr**  `variable`

 **Dev.addr.ip** `string` 设备IP地址

 **Dev.addr.port** `string` 设备端口

**Dev.addr.id** `string` 设备id

**Dev.children** `variable`

如果当前设备是网关设备，可以访问设备子设备，

#### RecvData 当前接收到的设备主动上送数据

数据接收脚本支持

`uint8 array`  收到的二进制数据包，字节数组

#### Output 当前数据输出命令

输出脚本支持

Output.val  输出值

Output.chan 输出通道

#### Req 当前TDSP请求

TDSP请求脚本支持

Req符合jsonRPC格式，格式用户自定义，并在脚本中实现rpc到自定义协议格式的转换

```json
{
    "method":"setTempLimit",
    "params":{
        "highLimit": 30,
        "lowLimit" : 20
    }
}
```
