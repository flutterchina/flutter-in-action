// .vuepress/config.js
module.exports = {
  title:'《Flutter实战》电子书',
  dest:'docs',
  markdown: {
   // lineNumbers: true
  },
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  sidebarDepth: 2,
  themeConfig: {
    logo:'/logo.png',
    nav: [
      { text: '和作者做同事', link: '/join_us' },
      { text: 'Flutter中国', link: 'https://github.com/flutterchina' },
      { text: 'Github', link: 'https://github.com/flutterchina/flutter-in-action' },
      { text: '实体书', link: 'https://item.jd.com/12816296.html' },
    ],
    sidebar: [
      {
        title:"首页",
        path:"/"
      },
      {
        title:"第一章：起步",
        path:"/chapter1/index",
        collapsable: false,
        children:[
          '/chapter1/mobile_development_intro',
          '/chapter1/flutter_intro',
          '/chapter1/install_flutter',
          '/chapter1/dart'
        ]
      },
      {
        title:"第二章：第一个Flutter应用",
        path:"/chapter2/index",
        collapsable: false,
        children:[
          '/chapter2/first_flutter_app',
          '/chapter2/flutter_router',
          '/chapter2/flutter_package_mgr',
          '/chapter2/flutter_assets_mgr',
          '/chapter2/flutter_app_debug',
          '/chapter2/thread_model_and_error_report'
        ]
      },
      {
        title:"第三章：基础组件",
        path:"/chapter3/index",
        collapsable: false,
        children:[
          '/chapter3/flutter_widget_intro',
          '/chapter3/state_manage',
          '/chapter3/text',
          '/chapter3/buttons',
          '/chapter3/img_and_icon',
          '/chapter3/radio_and_checkbox',
          '/chapter3/input_and_form',
          '/chapter3/progress',
        ]
      },
      {
        title:'第四章：布局类组件',
        path:"chapter4/index.md",
        collapsable: false,
        children:[
          '/chapter4/intro',
          '/chapter4/row_and_column',
          '/chapter4/flex',
          '/chapter4/wrap_and_flow',
          '/chapter4/stack',
          '/chapter4/alignment',
        ]
      },
      {
        title:"第五章：容器类组件",
        path:"/chapter5/index",
        collapsable: false,
        children:[
          '/chapter5/padding',
          '/chapter5/constrainedbox_and_sizebox',
          '/chapter5/decoratedbox',
          '/chapter5/transform',
          '/chapter5/container',
          '/chapter5/material_scaffold',
          '/chapter5/clip',
        ]
      },
      {
        title:"第六章：可滚动组件",
        path:"/chapter6/index",
        collapsable: false,
        children:[
          '/chapter6/intro',
          '/chapter6/single_child_scrollview',
          '/chapter6/listview',
          '/chapter6/gridview',
          '/chapter6/custom_scrollview',
          '/chapter6/scroll_controller',
        ]
      },
      {
        title:"第七章：功能型组件",
        path:"/chapter7/index",
        collapsable: false,
        children:[
          '/chapter7/willpopscope',
          '/chapter7/inherited_widget',
          '/chapter7/provider',
          '/chapter7/theme',
          '/chapter7/futurebuilder_and_streambuilder',
          '/chapter7/dailog',
        ]
      },
      {
        title:"第八章：事件处理与通知",
        path:"/chapter8/index",
        collapsable: false,
        children:[
          '/chapter8/listener',
          '/chapter8/gesture',
          '/chapter8/eventbus',
          '/chapter8/notification',
        ]
      },
      {
        title:"第九章：动画",
        path:"/chapter9/index",
        collapsable: false,
        children:[
          '/chapter9/intro',
          '/chapter9/animation_structure',
          '/chapter9/route_transition',
          '/chapter9/hero',
          '/chapter9/stagger_animation',
          '/chapter9/animated_switcher',
          '/chapter9/animated_widgets',
        ]
      },
      {
        title:"第十章：自定义组件",
        path:"/chapter10/index",
        collapsable: false,
        children:[
          '/chapter10/intro',
          '/chapter10/combine',
          '/chapter10/turn_box',
          '/chapter10/custom_paint',
          '/chapter10/gradient_circular_progress_demo',
        ]
      },
      {
        title:"第十一章：文件操作与网络请求",
        path:"/chapter11/index",
        collapsable: false,
        children:[
          '/chapter11/file_operation',
          '/chapter11/http',
          '/chapter11/dio',
          '/chapter11/download_with_chunks',
          '/chapter11/websocket',
          '/chapter11/socket',
          '/chapter11/json_model',
        ]
      },
      {
        title:"第十二章：包与插件",
        path:"/chapter12/index",
        collapsable: false,
        children:[
          '/chapter12/develop_package',
          '/chapter12/platform-channel',
          '/chapter12/develop_plugin',
          '/chapter12/android_implement',
          '/chapter12/ios_implement',
          '/chapter12/texture_platformview',
        ]
      },
      {
        title:"第十三章：国际化",
        path:"/chapter13/index",
        collapsable: false,
        children:[
          '/chapter13/multi_languages_support',
          '/chapter13/locallization_implement',
          '/chapter13/intl',
          '/chapter13/faq',
        ]
      },
      {
        title:"第十四章：Flutter核心原理",
        path:"/chapter14/index",
        collapsable: false,
        children:[
          '/chapter14/flutter_ui_system',
          '/chapter14/element_buildcontext',
          '/chapter14/render_object',
          '/chapter14/flutter_app_startup',
          '/chapter14/image_and_cache',
        ]
      },
      {
        title:"第十五章：一个完整的Flutter应用",
        collapsable: false,
        children:[
          '/chapter15/intro',
          '/chapter15/code_structure',
          '/chapter15/models',
          '/chapter15/globals',
          '/chapter15/network',
          '/chapter15/entry',
          '/chapter15/login_page',
          '/chapter15/language_and_theme_setting',
        ]
      },
    ]
  }
}
