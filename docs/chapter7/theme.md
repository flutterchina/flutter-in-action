

## 主题

Theme Widget可以为Material APP定义主题数据（ThemeData），Material组件库里很多Widget都使用了主题数据，如导航栏颜色、标题字体、Icon样式等。Theme内会使用InheritedWidget来为其子树Widget共享样式数据。

### ThemeData

ThemeData是Material Design Widget库的主题数据，Material库的Widget需要遵守相应的设计规范，而这些规范可自定义部分都定义在ThemeData，所以我们可以通过ThemeData来自定义应用主题。我们可以通过`Theme.of`方法来获取当前的ThemeData。

> 注意，Material Design 设计规范中有些是不能自定义的，如导航栏高度，ThemeData只包含了可自定义部分。

我们看看ThemeData部分数据：

```dart
ThemeData({
  Brightness brightness, //深色还是浅色
  MaterialColor primarySwatch, //主题颜色样本，见下面介绍
  Color primaryColor, //主色，决定导航栏颜色
  Color accentColor, //次级色，决定大多数Widget的颜色，如进度条、开关等。
  Color cardColor, //卡片颜色
  Color dividerColor, //分割线颜色
  ButtonThemeData buttonTheme, //按钮主题
  Color cursorColor, //输入框光标颜色
  Color dialogBackgroundColor,//对话框背景颜色
  String fontFamily, //文字字体
  TextTheme textTheme,// 字体主题，包括标题、body等文字样式
  IconThemeData iconTheme, // Icon的默认样式
  TargetPlatform platform, //指定平台，应用特定平台控件风格
  ...
})
```

上面只是ThemeData的一小部分属性，完整列表读者可以查看SDK定义。上面属性中需要说明的是`primarySwatch`，它是主题颜色的一个"样本"，通过这个样本可以在一些条件下生成一些其它的属性，例如，如果没有指定`primaryColor`，并且当前主题不是深色主题，那么`primaryColor`就会默认为`primarySwatch`指定的颜色，还有一些相似的属性如`accentColor` 、`indicatorColor`等也会受`primarySwatch`影响。

### 示例

我们实现一个路由换肤功能：

```dart

class ThemeTestRoute extends StatefulWidget {
  @override
  _ThemeTestRouteState createState() => new _ThemeTestRouteState();
}

class _ThemeTestRouteState extends State<ThemeTestRoute> {
  Color _themeColor = Colors.teal; //当前路由主题色

  @override
  Widget build(BuildContext context) {
    ThemeData themeData = Theme.of(context);
    return Theme(
      data: ThemeData(
          primarySwatch: _themeColor, //用于导航栏、FloatingActionButton的背景色等
          iconTheme: IconThemeData(color: _themeColor) //用于Icon颜色
      ),
      child: Scaffold(
        appBar: AppBar(title: Text("主题测试")),
        body: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            //第一行Icon使用主题中的iconTheme
            Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Icon(Icons.favorite),
                  Icon(Icons.airport_shuttle),
                  Text("  颜色跟随主题")
                ]
            ),
            //为第二行Icon自定义颜色（固定为黑色)
            Theme(
              data: themeData.copyWith(
                iconTheme: themeData.iconTheme.copyWith(
                    color: Colors.black
                ),
              ),
              child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Icon(Icons.favorite),
                    Icon(Icons.airport_shuttle),
                    Text("  颜色固定黑色")
                  ]
              ),
            ),
          ],
        ),
        floatingActionButton: FloatingActionButton(
            onPressed: () =>  //切换主题
                setState(() =>
                _themeColor =
                _themeColor == Colors.teal ? Colors.blue : Colors.teal
                ),
            child: Icon(Icons.palette)
        ),
      ),
    );
  }
}
```

运行后点击右下角悬浮按钮则可以切换主题：

![Screenshot_1536838018](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/Screenshot_1536838018.png)![Screenshot_1536838021](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/Screenshot_1536838021.png)



需要注意的有三点：

- 可以通过局部主题覆盖全局主题，正如代码中通过Theme为第二行图标指定固定颜色（黑色）一样，这是一种常用的技巧，Flutter中会经常使用这种方法来自定义子树主题。那么为什么局部主题可以覆盖全局主题？这主要是因为Widget中使用主题样式时是通过`Theme.of(BuildContext context)`来获取的，我们看看其简化后的代码：

- ```dart 
  static ThemeData of(BuildContext context, { bool shadowThemeOnly = false }) {
     // 简化代码，并非源码  
     return context.inheritFromWidgetOfExactType(_InheritedTheme)
  }
  ```

  `context.inheritFromWidgetOfExactType` 会在widget树中从当前位置向上查找第一个类型为`_InheritedTheme`的Widget。所以当局部使用Theme后，其子树中`Theme.of()`找到的第一个`_InheritedTheme`便是该Theme的。

- 本示例是对单个路由换肤，如果相对整个应用换肤，可以去修改MaterialApp的theme属性。
