# 监控功能用户手册

## 在离线状态

只有被IO设备绑定的对象，才有在离线状态信息

被绑定的对象下的监控点，也有在离线信息

## 计划任务

在设置完脚本后，计划任务可配置定时自动执行脚本。

最终脚本执行位号 = 组织结构 + 对象位号（相对该组织结构）+ 脚本环境位号 + 脚本内位号

例如：在脚本管理界面中设置的脚本为：

```javascript
output("大厅灯",true)
```

且脚本编写时环境位号留空。此时，脚本无环境位号，脚本内位号为"大厅灯"。

在计划任务中，组织结构选择"科技大厦一号楼"，配置计划任务的对象名称为"一楼"。

因此最终脚本执行位号为"科技大厦一号楼.一楼.大厅灯"，配置计划可定时自动执行脚本将科技大厦一号楼一楼的大厅灯打开。

## 报警管理

## 监控列表