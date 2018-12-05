
## FutureBuilder

由于网络请求是异步的，所以在实战中，我们通常会在请求的过程中弹出一个加载框，等到请求结束后再来渲染最终页面，如果发生错误提示错误信息。在Flutter中我们虽然完全可以手动去做这些事，如发现请求状态发生变化时再调用`setState()`去重建UI，但由于这是一个固定的模式，Flutter提供了`FutureBuilder` Widget专门来处理在异步任务的不同过程构建不同的UI元素。

### 示例

我们通过Github开放的API来请求flutterchina组织下的所有公开的开源项目，实现：

1. 在请求阶段弹出loading
2. 请求结束后，如果请求失败，则展示错误信息；如果成功，则将项目名称列表展示出来。

代码如下：

```dart
class _FutureBuilderRouteState extends State<FutureBuilderRoute> {
  Dio _dio = new Dio();

  @override
  Widget build(BuildContext context) {

    return new Container(
      alignment: Alignment.center,
      child: FutureBuilder(
          future: _dio.get("https://api.github.com/orgs/flutterchina/repos"),
          builder: (BuildContext context, AsyncSnapshot snapshot) {
            //请求完成
            if (snapshot.connectionState == ConnectionState.done) {
              Response response = snapshot.data;
              //发生错误
              if (snapshot.hasError) {
                return Text(snapshot.error.toString());
              }
              //请求成功，通过项目信息构建用于显示项目名称的ListView
              return ListView(
                children: response.data.map<Widget>((e) =>
                    ListTile(title: Text(e["full_name"]))
                ).toList(),
              );
            }
            //请求未完成时弹出loading
            return CircularProgressIndicator();
          }
      ),
    );
  }
}
```

代码中的AsyncSnapshot代表一个异步任务快照，它的`connectionState`属性代表当前异步任务的状态，开发者可以通过判断该状态得到异步任务的进度。值得注意的是，AsyncSnapshot会将最近一次请求的结果缓存，如果您需要通过FutureBuilder发起多次异步任务时，一定要注意，比如下面的代码在多次请求时就不能正常工作：

```dart
 FutureBuilder(
    future: _dio.get("https://api.github.com/orgs/flutterchina/repos"),
    builder: (BuildContext context, AsyncSnapshot snapshot) {
      //请求成功，返回项目列表
      if(snapshot.hasData){
        Response response = snapshot.data;
        return ListView(
          children: response.data.map<Widget>((e) =>
              ListTile(title: Text(e["full_name"]))
          ).toList(),
        );
      }else if(snapshot.hasError){ //发生错误
        return Text(snapshot.error.toString());
      }
      //请求未完成时弹出loading
      return CircularProgressIndicator();
)
```

上面代码在首次请求时没有问题，但在第二次请求时loading就弹不出来了，原因是snapshot会缓存上次请求结果，所以在第二次请求的过程中，依然会显示第一次的请求结果，直到第二次请求结束后才会更新。其实要避免这个问题很容易，我们记住“状态优先”原则就行，状态改变时我们应该首先判断请求状态，然后在判断是否成功，就像上面的第一个示例那样。
