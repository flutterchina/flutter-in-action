# Summary

* [缘起](README.md)


## 入门篇

* [第一章：起步](chapter1/index.md)
    * [1.1：移动开发技术简介](chapter1/mobile_development_intro.md)
    * [1.2：Flutter简介](chapter1/flutter_intro.md)  
    * [1.3：搭建Flutter开发环境](chapter1/install_flutter.md)      
    * [1.4：常见配置问题](chapter1/configuration.md)  
    * [1.5：Dart语言简介](chapter1/dart.md)    
    
* [第二章：第一个Flutter应用](chapter2/index.md)
    * [2.1：计数器示例](chapter2/first_flutter_app.md)
    * [2.2：路由管理](chapter2/flutter_router.md)  
    * [2.3：包管理](chapter2/flutter_package_mgr.md)        
    * [2.4：资源管理](chapter2/flutter_assets_mgr.md)    
    * [2.5：调试Flutter APP](chapter2/flutter_app_debug.md)
    * [2.6：Dart线程模型及异常捕获](chapter2/thread_model_and_error_report.md)
    
* [第三章：基础Widgets](chapter3/index.md)
    * [3.1：Widget简介](chapter3/flutter_widget_intro.md)
    * [3.2：状态管理](chapter3/state_manage.md)
    * [3.3：文本、字体样式](chapter3/text.md)
    * [3.4：按钮](chapter3/buttons.md)      
    * [3.5：图片和Icon](chapter3/img_and_icon.md)   
    * [3.6：单选框和复选框](chapter3/radio_and_checkbox.md)   
    * [3.7：输入框和表单](chapter3/input_and_form.md) 
    * [3.8：进度指示器](chapter3/progress.md)     
    
* [第四章：布局类Widgets](chapter4/index.md)
    * [4.1：布局类Widgets简介](chapter4/intro.md)
    * [4.2：线性布局Row、Column](chapter4/row_and_column.md)
    * [4.3：弹性布局Flex](chapter4/flex.md)
    * [4.4：流式布局Wrap、Flow](chapter4/wrap_and_flow.md)      
    * [4.5：层叠布局Stack、Positioned](chapter4/stack.md)
    * [4.6：对齐与相对定位](chapter4/alignment.md)    

* [第五章：容器类Widgets](chapter5/index.md)
    * [5.1：Padding](chapter5/padding.md)
    * [5.2：布局限制类容器ConstrainedBox、SizeBox](chapter5/constrainedbox_and_sizebox.md)
    * [5.3：装饰容器DecoratedBox](chapter5/decoratedbox.md)      
    * [5.4：变换Transform](chapter5/transform.md) 
    * [5.5：Container容器](chapter5/container.md) 
    * [5.6：Scaffold、TabBar、底部导航](chapter5/material_scaffold.md) 
    * [5.7：剪裁（Clip）](chapter5/clip.md) 
    
* [第六章：可滚动Widgets](chapter6/index.md)
    * [6.1：可滚动Widgets简介](chapter6/intro.md)
    * [6.2：SingleChildScrollView](chapter6/single_child_scrollview.md)
    * [6.3：ListView](chapter6/listview.md)
    * [6.4：GridView](chapter6/gridview.md)      
    * [6.5：CustomScrollView](chapter6/custom_scrollview.md) 
    * [6.6：滚动监听及控制ScrollController](chapter6/scroll_controller.md) 
    
* [第七章：功能型Widgets](chapter7/index.md)
    * [7.1：导航返回拦截(WillPopScope)](chapter7/willpopscope.md)
    * [7.2：数据共享(InheritedWidget)](chapter7/inherited_widget.md)
    * [7.3：主题(Theme)](chapter7/theme.md) 
    
## 进阶篇
* [第八章：事件处理与通知](chapter8/index.md)
    * [8.1：原始指针事件处理](chapter8/listener.md)
    * [8.2：手势识别](chapter8/gesture.md)
    * [8.3：全局事件总线](chapter8/eventbus.md) 
    * [8.4：通知(Notification)](chapter8/notification.md)     
    
* [第九章：动画](chapter9/index.md)
    * [9.1：Flutter动画简介](chapter9/intro.md)
    * [9.2：动画结构](chapter9/animation_structure.md)
    * [9.3：自定义路由过渡动画](chapter9/route_transition.md) 
    * [9.4：Hero动画](chapter9/hero.md) 
    * [9.5：交错动画](chapter9/stagger_animation.md) 
    * [9.6：通用"切换动画"组件(AnimatedSwitcher)](chapter9/animated_switcher.md) 
    
* [第十章：自定义Widget](chapter13/index.md)
    * [10.1：自定义Widget方法简介](chapter13/intro.md)
    * [10.2：通过组合现有Widget实现](chapter13/combine.md)
    * [10.3：实例：TurnBox](chapter13/turn_box.md)
    * [10.4：CustomPaint与Canvas](chapter13/custom_paint.md) 
    * [10.5：实例：圆形渐变进度条(自绘)](chapter13/gradient_circular_progress_demo.md) 
    
* [第十一章：文件操作与网络请求](chapter10/index.md)
    * [11.1：文件操作](chapter10/file_operation.md)
    * [11.2：Http请求-HttpClient](chapter10/http.md)
    * [11.3：Http请求-Dio package](chapter10/dio.md) 
    * [11.4：实例：Http分块下载](chapter10/download_with_chunks.md) 
    * [11.5：WebSocket](chapter10/websocket.md) 
    * [11.6：使用Socket API](chapter10/socket.md) 
    * [11.7：Json转Model](chapter10/json_model.md) 
    
* [第十二章：包与插件](chapter11/index.md)
    * [12.1：开发package](chapter11/develop_package.md)
    * [12.2：插件开发：平台通道简介](chapter11/platform-channel.md)
    * [12.3：插件开发：实现Android端API](chapter11/android_implement.md)
    * [12.4：插件开发：实现IOS端API](chapter11/ios_implement.md)
    * [12.5：系统能力调用](todo.md) 
    
* [第十三章：国际化](chapter12/index.md)
    * [13.1：让App支持多语言](chapter12/multi_languages_support.md)
    * [13.2：实现Localizations](chapter12/locallization_implement.md) 
    * [13.3：使用Intl包](chapter12/intl.md) 
    
* [第十四章：Flutter核心原理](chapter14/index.md)
    * [14.1：Flutter UI系统](chapter14/flutter_ui_system.md)
    * [14.2：Element和BuildContext](chapter14/element_buildcontext.md)
    * [14.3：RenderObject与RenderBox](chapter14/render_object.md)
    * [14.4：Flutter从启动到显示](chapter14/flutter_app_startup.md)
    * [14.5：Flutter图片加载与缓存](chapter14/flutter_app_startup.md)
 
## 实例篇
   
* [第十五章：Flutter核心原理]()

     
* [Flutter资源汇总](todo.md)


