# 人工智能API

## 图像识别

### imageReco 图像识别

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "imageReco", 
    "params": {
        "tag":"科技大厦.1楼.摄像头1",
        "time":"2022-08-11 08:26:10",
        "model":"/typeA",    //选择 typeA 目录下时间最新的模型
        "model":"/typeA/typeA_N1080_20250221"    //具体指定某个模型
    }, 
    "id": 1
}
```

**响应**

result字段和jjpg的json区域格式相同

```json
{
    "jsonrpc": "2.0",
    "method": "imageReco",
    "result": {
        "time":"2022-12-13 12:00:30",             
        "objBBox":[  //bounding box 检测结果
            {
                "type": "human",
                "confidence":0.98,
                "bbox":[x,y,w,h]   
            },{
                "type": "cat",
                "confidence":0.98,
                "bbox":[x,y,w,h]   
            }
        ],
        "objContour":[  //轮廓检测结果
            {
                "type": "rail_surface_crack",
                "confidence":0.98,
                "bbox":[x,y,w,h],
                "mask": "...."  //png的base64编码
            },
            {
                "type":"rail",
                ""
            }
        ]
    }
}
```

### getModelList 获得AI模型列表

**请求**

```json
{
    "jsonrpc": "2.0", 
    "method": "getModelList", 
    "params": [
        {
            "name":"damageCap"    
        }
    ], 
    "id": 1
}
```

**响应**

result字段和jjpg的json区域格式相同

```json
{
    "jsonrpc": "2.0",
    "method": "getModelList",
    "result": {
        "typeA":["type"]
    }
}
```
