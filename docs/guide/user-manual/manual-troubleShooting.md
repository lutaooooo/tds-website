# 部署与运维

## 跨域问题

chrome 报错解决 The request client is not a secure context and the resource is in more-private address space `privat](https://www.cnblogs.com/whm-blog/p/16418314.html)

关于 chrome升级后出现问题（其他浏览器暂时不会出现）

chrome系浏览器报错跨域问题：  
has been blocked by CORS policy: The request client is not a secure context and the resource is in more-private address space `private`

查了下官网:https://wicg.github.io/private-network-access/

问题原因:

公网资源(访问者) 访问 私网资源(被访问者)

解决方案:

1:两种资源都改成https

2:做代理或改dns 两种资源都改成 内网或者外网ip

3:配置chrome选项为disable chrome://flags/#block-insecure-private-network-requests

或者访问者资源加响应头 Access-Control-Allow-Private-Network
