import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TDS - 时序数据服务",
  description: "最轻便的物联网组态软件。短、平、快的小微物联系统通用监控软件，赋能行业解决方案快速实现",
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }]
  ],
  lang: 'zh',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },
    nav: [
      // { text: '首页', link: '/' },
      { text: '使用指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '产品',
          items: [
            { text: '产品简介', link: '/guide/' },
            { text: '核心概念', link: '/guide/product/core-concepts' }
          ]
        },
        {
          text: '用户手册',
          items: [
            {
              text: '组态',
              items: [
                { text: 'MO监控对象管理', link: '/guide/user-manual/manual-mo' },
                { text: 'IO设备管理', link: '/guide/user-manual/manual-io' },
                { text: '脚本管理', link: '/guide/user-manual/manual-script' },
                { text: 'tSVG拓扑图', link: '/guide/user-manual/manual-topo' },
              ]
            },
            { text: '监控', link: '/guide/user-manual/manual-monitor' },
            { text: '配置文件参数说明', link: '/guide/user-manual/ini-params' },
            { text: '部署与运维', link: '/guide/user-manual/manual-deploy' },
            { text: '常见问题分析诊断', link: '/guide/user-manual/manual-diag' },
          ],
        },
        {
          text: '测试诊断体系',
          items: [
            { text: 'ioSimu硬件仿真工具', link: '/guide/test-tools/tools-iosimu' },
            { text: 'commTest测试终端', link: '/guide/test-tools/tools-commtest' },
            { text: 'tdsShell控制台', link: '/guide/test-tools/tools-shell' },
            { text: 'debugio设备通信诊断', link: '/guide/test-tools/tools-debugio' },
            { text: 'debugapi服务API诊断', link: '/guide/test-tools/tools-debugapi' },
            { text: '单元测试方案', link: '/guide/test-tools/tools-testscheme' },
          ]
        },
        {
          text: '测试报告',
          link: '/guide/report/tds-vs-mysql'
        },
      ],
      '/api/': [
        
        {
          text: '二次开发',
          items: [
            { text: 'TDS开发指南', link: '/api/' },
          ]
        },
        {
          text: '客户端(更多数据应用)',
          items: [
            { text: 'TDS服务API - 监控功能', link: '/api/api-monitor' },
            { text: 'TDS服务API - 组态功能', link: '/api/api-config' },
            { text: 'TDS服务API - 时序数据库', link: '/api/api-db' },
            { text: 'TDS服务API - 音视频', link: '/api/api-video' },
            { text: 'TDS服务API - 脚本管理', link: '/api/script' },
            { text: 'TDS服务API - 其他', link: '/api/api-others' },
            { text: 'API应用 - 能耗监测', link: '/api/api-app-energy' },
            { text: '使用tds.js开发前端', link: '/api/dev-tdsjs' },
            { text: '对象面板插件', link: '/api/dev-mopanel' },
          ]
        },
        {
          text: '设备端(更多数据接入)',
          items: [
            { text: 'TDSP设备通信协议', link: '/api/io-tdsp' },
            { text: 'Adaptor模式', link: '/api/io-adaptor' },
            // { text: 'ioDev模式', link: '/api/io-device' },
          ]
        },
        {
          text: '桌面应用',
          link: '/api/api-desktop'
        },
      ]
    },
    socialLinks: [
      // { icon: 'github', link: 'https://github.com/lutaooooo/tds-website' },
      { icon: 'gitee', link: 'https://gitee.com/liangtuSoft/tds' },
      {
        icon: {
          svg: '<svg t="1750820520055" class="icon" viewBox="0 0 1042 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6997" width="200" height="200"><path d="M513.956201 0C231.092396 0 1.956201 229.136194 1.956201 512S231.092396 1024 513.956201 1024c282.863806 0 512-229.136194 512-512S796.820007 0 513.956201 0zM841.021445 302.678244c-27.562391 12.701563-92.848425 53.219548-38.231704 144.41677C831.241242 494.471843 837.592023 713.573803 586.482125 713.573803c-20.068469 22.227735-161.055817 135.906723-399.591168 71.636815 71.76383-82.433143 149.243364-169.946911 222.27735-252.888117 114.060035-129.428926 228.247085-218.974944 112.154801-311.950385 79.892831-0.889109 231.676507-23.116844 266.224758 79.384768l53.473579 2.92136z m-75.574299 48.138923z" p-id="6998"></path></svg>'
        },
        link: 'https://tdserver.yuque.com/r/organizations/homepage'
      },
    ],
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '页面导航'
    }
  },
})
