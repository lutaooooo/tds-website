---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "TDS"
  text: "最轻便的物联网组态软件"
  tagline: 短、平、快的小微物联系统通用监控软件，赋能行业解决方案快速实现<p>6mb程序包，6秒安装。面向本地独立部署、私有云模式部署设计</p>
  actions:
    - theme: brand
      text: 快速开始
      link: /guide
    - theme: alt
      text: 视频快速了解
      link: https://www.bilibili.com/video/BV1sV4y1W7PX/?vd_source=3b5c83dc2775dbd078466c5fe0eed7de
    - theme: alt
      text: 帮助中心
      link: https://tdserver.yuque.com/r/organizations/homepage
---

<script setup>
import CustomComponent from '../components/home.vue'
</script>

<CustomComponent />

<style>
.VPHome {
  height: 100vh;
  margin: 0 !important;
  background-image: url('../assets/banner.jpg');
  background-size: cover;
}
.VPHomeHero {
  height: 100vh;
  margin-left: 50%;
}
.VPHomeHero .text {
  font-size: 52px;
}
.VPHomeHero .name {
  font-size: 80px;
  display: inline-block;
  padding: 80px 0 50px;
}
.tagline p {
  margin-top: 20px;
}
</style>