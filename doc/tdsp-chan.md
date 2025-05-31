| 通道名称           | 通道地址              | 值类型    |                    |
| -------------- | ----------------- | ------ | ------------------ |
| **只读通道**       |                   |        |                    |
| 电池电压           | battery.voltage   | float  |                    |
| 电池电量           | battery.capacity  | float  | <br>               |
| 北纬 南纬          | bds.south_north   | string | South / North      |
| 东经 西经          | bds.east_west     | string | East / West        |
| 北斗检测设备经度       | bds.longitude     | float  | <br>               |
| 北斗检测设备纬度       | bds.latitude      | float  | <br>               |
| 乙烯/煤气气压（气量百分比） | gasPressure       | float  | <br>               |
| 环境温度           | temp              | float  | <br>               |
| 环境湿度           | humidity          | int    | <br>               |
| 控制板温度          | boardTemp         | float  | <br>               |
| 风机实际频率         | fanFrequency      | float  | 默认20Hz0.01-50.00Hz |
| 炮响次数           | shootCount        | int    | <br>               |
| 运行总时长          | runTime           | float  | 单位小时，一位小数          |
| 当前音量           | volume            | int    | 0-20               |
| 运行总时长          | runTime           | float  | 单位小时，一位小数          |
| 气体重量           | gas.weight        | float  |                    |
| 当前播放时段         | currentTask       |        | 1-12               |
| 当前播放曲目         | currentTrack      |        | 当前任务中曲目序号1-10      |
| 当前音量（全向/定向声波）  | currentVolume     |        | 当前音量0 - 30         |
| 当前执行代码（蓝光灯）    | currentCode       |        | 1-7                |
|                |                   |        |                    |
| **读写通道**       |                   |        |                    |
| 风机电源           | fanPower          | bool   | <br>               |
| 系统电源           | totalPower        | bool   | <br>               |
| 水平角度           | pan               | float  | <br>               |
| 垂直角度           | tilt              | float  | <br>               |
| 乙烯炮工作启停        | running           | bool   | <br>               |
| 电机电源<br>       | motorPower        | bool   | <br>               |
| 电机水平工作启动       | motorHorizRunning | bool   |                    |
| 电机垂直工作启动       | motorVertiRunning | bool   |                    |
| 设备工作启动         | running           | bool   |                    |
| 电机电源           | motorPower        | bool   |                    |
