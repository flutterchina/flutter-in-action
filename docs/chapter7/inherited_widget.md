

## InheritedWidget

InheritedWidget是Flutter中非常重要的一个功能型Widget，它可以高效的将数据在Widget树中向下传递、共享，这在一些需要在Widget树中共享数据的场景中非常方便，如Flutter中，正是通过InheritedWidget来共享应用主题(Theme)和Locale(当前语言环境)信息的。

> InheritedWidget和React中的context功能类似，和逐级传递数据相比，它们能实现组件跨级传递数据。InheritedWidget的在Widget树中数据传递方向是从上到下的，这和Notification的传递方向正好相反。

### didChangeDependencies

在介绍StatefulWidget时，我们提到State对象有一个回调`didChangeDependencies`，它会在“依赖”发生变化时被Flutter Framework调用。而这个“依赖”指的就是是否使用了父widget中InheritedWidget的数据，如果使用了，则代表有依赖，如果没有使用则代表没有依赖。这种机制可以使子组件在所依赖的主题、locale等发生变化时有机会来做一些事情。

我们看一下之前“计数器”示例应用程序的InheritedWidget版本，需要说明的是，本例主要是为了演示InheritedWidget的功能特性，并不是计数器的推荐实现方式。

首先，我们通过继承InheritedWidget，将当前计数器点击次数保存在ShareDataWidget的`data`属性中：

```dart
class ShareDataWidget extends InheritedWidget {
  ShareDataWidget({
    @required this.data,
    Widget child
  }) :super(child: child);
    
  int data; //需要在子树中共享的数据，保存点击次数
    
  //定义一个便捷方法，方便子树中的widget获取共享数据  
  static ShareDataWidget of(BuildContext context) {
    return context.inheritFromWidgetOfExactType(ShareDataWidget);
  }

  //该回调决定当data发生变化时，是否通知子树中依赖data的Widget  
  @override
  bool updateShouldNotify(ShareDataWidget old) {
    //如果返回false，则子树中依赖(build函数中有调用)本widget
    //的子widget的`state.didChangeDependencies`会被调用
    return old.data != data;
  }
}
```

然后我们实现一个子widget _TestWidget，在其build方法中引用ShareDataWidget中的数据；同时，在其`didChangeDependencies()` 回调中打印日志：

```dart
class _TestWidget extends StatefulWidget {
  @override
  __TestWidgetState createState() => new __TestWidgetState();
}

class __TestWidgetState extends State<_TestWidget> {
  @override
  Widget build(BuildContext context) {
    //使用InheritedWidget中的共享数据
    return Text(ShareDataWidget
        .of(context)
        .data
        .toString());
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    //父或祖先widget中的InheritedWidget改变(updateShouldNotify返回true)时会被调用。
    //如果build中没有依赖InheritedWidget，则此回调不会被调用。
    print("Dependencies change");
  }
}
```

最后，我们创建一个按钮，每点击一次，就将ShareDataWidget的值自增：

```dart
class InheritedWidgetTestRoute extends StatefulWidget {
  @override
  _InheritedWidgetTestRouteState createState() => new _InheritedWidgetTestRouteState();
}

class _InheritedWidgetTestRouteState extends State<InheritedWidgetTestRoute> {
  int count = 0;

  @override
  Widget build(BuildContext context) {
    return  Center(
      child: ShareDataWidget( //使用ShareDataWidget
        data: count,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Padding(
              padding: const EdgeInsets.only(bottom: 20.0),
              child: _TestWidget(),//子widget中依赖ShareDataWidget
            ),
            RaisedButton(
              child: Text("Increment"),
              //每点击一次，将count自增，然后重新build,ShareDataWidget的data将被更新  
              onPressed: () => setState(() => ++count),
            )
          ],
        ),
      ),
    );
  }
}
```

运行后界面如下：

![image-20180913183022733](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/image-20180913183022733.png)

每点击一次按钮，计数器就会自增，控制台就会打印一句日志：

```
I/flutter ( 8513): Dependencies change
```

可见依赖发生变化后，其`didChangeDependencies()`会被调用。但是读者要注意，如果_TestWidget的build方法中没有使用ShareDataWidget的数据，那么它的`didChangeDependencies()`将不会被调用，因为它并没有依赖ShareDataWidget。

> 思考题：Flutter framework是怎么知道子widget有没有依赖InheritedWidget的？

#### 应该在didChangeDependencies()中做什么？

一般来说，子widget很少会重写此方法，因为在依赖改变后framework也都会调用`build()`方法。但是，如果你需要在依赖改变后执行一些昂贵的操作，比如网络请求，这时最好的方式就是在此方法中执行，这样可以每次`build()`都执行一次。

