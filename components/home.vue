<template>
  <div class="home-custom-component">
    <div class="section">
      <p class="title clip">- 功能特性 -</p>
      <div class="flex">
        <img src="../assets/tdsOverview2.png" style="height: 50vh;" alt="">
        <div>
          <div class="feature-item">
            <p class="sub-title clip">轻便化</p>
            <p>仅一个6mb可执行文件，免安装，无依赖，解压即运行</p>
          </div>
          <div class="feature-item">
            <p class="sub-title clip">一体化</p>
            <p>Web服务器,时序数据库,设备通信驱动一体化集成</p>
          </div>
          <div class="feature-item">
            <p class="sub-title clip">工程易用性</p>
            <p>Web端进行组态与低代码开发，快速构建个性化物联网数据中台</p>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <p class="title clip">- 硬件协议接入 -</p>
      <div class="flex">
        <img src="../assets/device_protocol.svg" alt="">
        <div>
          <div class="feature-item">
            <p class="sub-title clip">混合接入</p>
            <p>支持传感类设备和视频设备协议统一接入</p>
          </div>
          <div class="feature-item">
            <p class="sub-title clip">模板化</p>
            <p>将设备接入配置保存为模板，在项目中快速应用</p>
          </div>
          <div class="feature-item">
            <p class="sub-title clip">脚本化扩展</p>
            <p>在设备接入框架中使用javaScript脚本扩展行业专用协议</p>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <p class="title clip">- 内置时序数据库 -</p>
      <div class="flex">
        <img src="../assets/tds_vs_mysql.png" style="height: 50vh;" alt="">
        <div>
          <div class="feature-item"> 
            <p class="sub-title clip">一体化应用</p>
            <p>使用同一套WebAPI接口，查询、统计实时与历史数据，返回json格式结果</p>
          </div>
          <div class="feature-item">
            <p class="sub-title clip">面向物联网</p>
            <p>为物联网时序数据针对性设计的数据库系统，在专用场景下，可以做到比mysql更高的性能</p>
          </div>
          <div class="feature-item">
            <p class="sub-title clip">简单够用</p>
            <p>以极简、方便、工程易用性为设计目标的基于JSON的文件型数据库</p>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <p class="title clip">- TDS-Edge边缘网关 -</p>
      <div class="flex">
        <img src="../assets/tds-edge.png" style="height: 50vh;" alt="">
        <div>
          <div class="feature-item">
            <p class="sub-title clip">边缘自治服务</p>
            <p>可以脱离云端运行，实现功能完善、完全自治的边缘端系统</p>
          </div>
          <div class="feature-item">
            <p class="sub-title clip">云端统一管理</p>
            <p>云端统一进行Edge设备管理，并实现数据汇聚</p>
          </div>
          <div class="feature-item">
            <p class="sub-title clip">本地控制</p>
            <p>全Web端设备接入组态，基于javaScript的自动控制脚本</p>
          </div>
        </div>
      </div>
    </div>
    <div class="custom-footer">Copyright © 2025 lutao All Rights Reserved</div>
  </div>
</template>

<script setup>
</script>

<style>
.clip {
  background: var(--vp-home-hero-name-background);
  background-image: -webkit-linear-gradient(120deg, rgb(0, 140, 255) 30%, rgb(4, 249, 200)) !important;
  background-position-x: initial;
  background-position-y: initial;
  background-size: initial;
  background-repeat: initial;
  background-attachment: initial;
  background-origin: initial;
  background-clip: initial;
  background-color: initial;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: var(--vp-home-hero-name-color);
}

</style>
<style scoped>
.home-custom-component .section {
  position: relative;
  padding: 100px 0 100px;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.home-custom-component .section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--vp-c-divider);
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 100px;
}

.home-custom-component .section img {
  height: 60vh;
}

.home-custom-component .title {
  margin-bottom: 40px;
  font-size: 48px;
  line-height: 48px;
  font-weight: bold;
  text-align: center;
}

.home-custom-component .sub-title {
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: bold;
}

.home-custom-component .feature-item {
  margin-bottom: 40px;
}

.custom-footer {
  text-align: center;
  font-size: 16px;
  line-height: 50px;
}
</style>