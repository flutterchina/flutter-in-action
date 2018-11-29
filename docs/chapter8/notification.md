### Notification

Notification是Flutter中一个重要的机制，在Widget树中，每一个节点都可以分发通知，通知会沿着当前节点（context）向上传递，所有父节点都可以通过NotificationListener来监听通知，Flutter中称这种通知由子向父的传递为“通知冒泡”（Notification Bubbling），这个和用户触摸事件冒泡是相似的，但有一点不同：通知冒泡可以中止，但用户触摸事件不行。

Flutter中很多地方使用了通知，如可滚动(Scrollable) Widget中滑动时就会分发ScrollNotification，而Scrollbar正是通过监听ScrollNotification来确定滚动条位置的。除了ScrollNotification，Flutter中还有SizeChangedLayoutNotification、KeepAliveNotification 、LayoutChangedNotification等。下面是一个监听Scrollable Widget滚动通知的例子：

```dart
NotificationListener(
  onNotification: (notification){
    //print(notification);
    switch (notification.runtimeType){
      case ScrollStartNotification: print("开始滚动"); break;
      case ScrollUpdateNotification: print("正在滚动"); break;
      case ScrollEndNotification: print("滚动停止"); break;
      case OverscrollNotification: print("滚动到边界"); break;
    }
  },
  child: ListView.builder(
      itemCount: 100,
      itemBuilder: (context, index) {
        return ListTile(title: Text("$index"),);
      }
  ),
);
```

上例中的滚动通知如ScrollStartNotification、ScrollUpdateNotification等都是继承自ScrollNotification类，不同类型的通知子类会包含不同的信息，比如ScrollUpdateNotification有一个`scrollDelta`属性，它记录了移动的位移，其它通知属性读者可以自己查看SDK文档。

#### 自定义通知

除了Flutter内部通知，我们也可以自定义通知，下面我们看看如何实现自定义通知：

1. 定义一个通知类，要继承自Notification类；

   ```dart
   class MyNotification extends Notification {
     MyNotification(this.msg);
     final String msg;
   }
   ```

2. 分发通知。

   Notification有一个`dispatch(context)`方法，它是用于分发通知的，我们说过context实际上就是操作Element的一个接口，它与Element树上的节点是对应的，通知会从context对应的Element节点向上冒泡。

下面我们看一个完整的例子：

```dart
class NotificationRoute extends StatefulWidget {
  @override
  NotificationRouteState createState() {
    return new NotificationRouteState();
  }
}

class NotificationRouteState extends State<NotificationRoute> {
  String _msg="";
  @override
  Widget build(BuildContext context) {
    //监听通知  
    return NotificationListener<MyNotification>(
      onNotification: (notification) {
        setState(() {
          _msg+=notification.msg+"  ";
        });
      },
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
//          RaisedButton(
//           onPressed: () => MyNotification("Hi").dispatch(context),
//           child: Text("Send Notification"),
//          ),  
            Builder(
              builder: (context) {
                return RaisedButton(
                  //按钮点击时分发通知  
                  onPressed: () => MyNotification("Hi").dispatch(context),
                  child: Text("Send Notification"),
                );
              },
            ),
            Text(_msg)
          ],
        ),
      ),
    );
  }
}

class MyNotification extends Notification {
  MyNotification(this.msg);
  final String msg;
}
```

上面代码中，我们每点一次按钮就会分发一个`MyNotification`类型的通知，我们在Widget根上监听通知，收到通知后我们将通知通过Text显示在屏幕上。

> 注意：代码中注释的部分是不能正常工作的，因为这个`context`是根Context，而NotificationListener是监听的子树，所以我们通过`Builder`来构建RaisedButton，来获得按钮位置的context。

运行效果如下：

![Screenshot_1539328127](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/Screenshot_1539328127.png)
