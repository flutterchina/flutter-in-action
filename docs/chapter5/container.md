## Container

Container是我们要介绍的最后一个容器类widget，它本身不对应具体的RenderObject，它是DecoratedBox、ConstrainedBox、Transform、Padding、Align等widget的一个组合widget。所以我们只需通过一个Container可以实现同时需要装饰、变换、限制的场景。下面是Container的定义：

```dart
Container({
  this.alignment,
  this.padding, //容器内补白，属于decoration的装饰范围
  Color color, // 背景色
  Decoration decoration, // 背景装饰
  Decoration foregroundDecoration, //前景装饰
  double width,//容器的宽度
  double height, //容器的高度
  BoxConstraints constraints, //容器大小的限制条件
  this.margin,//容器外补白，不属于decoration的装饰范围
  this.transform, //变换
  this.child,
})
```

大多数属性在介绍其它容器时都已经介绍过了，不再赘述，但有两点需要说明：

- 容器的大小可以通过`width`、`height`属性来指定，也可以通过`constraints`来指定，如果同时存在时，`width`、`height`优先。实际上Container内部会根据`width`、`height`来生成一个`constraints`。
- `color`和`decoration`是互斥的，实际上，当指定color时，Container内会自动创建一个decoration。

### 实例

我们通过Container来实现如下的卡片：

![image-20180910205356331](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/image-20180910205356331.png)



代码：

```dart
Container(
  margin: EdgeInsets.only(top: 50.0, left: 120.0), //容器外补白
  constraints: BoxConstraints.tightFor(width: 200.0, height: 150.0), //卡片大小
  decoration: BoxDecoration(//背景装饰
      gradient: RadialGradient( //背景径向渐变
          colors: [Colors.red, Colors.orange],
          center: Alignment.topLeft,
          radius: .98
      ),
      boxShadow: [ //卡片阴影
        BoxShadow(
            color: Colors.black54,
            offset: Offset(2.0, 2.0),
            blurRadius: 4.0
        )
      ]
  ),
  transform: Matrix4.rotationZ(.2), //卡片倾斜变换
  alignment: Alignment.center, //卡片内文字居中
  child: Text( //卡片文字
    "5.20", style: TextStyle(color: Colors.white, fontSize: 40.0),
  ),
);
```



可以看到Container通过组合多种widget来实现复杂强大的功能，在Flutter中，这也正是组合优先于继承的实例。

### Padding和Margin

接下来我们看看Container的`margin`和`padding`属性的区别:

```dart
...
Container(
  margin: EdgeInsets.all(20.0), //容器外补白
  color: Colors.orange,
  child: Text("Hello world!"),
),
Container(
  padding: EdgeInsets.all(20.0), //容器内补白
  color: Colors.orange,
  child: Text("Hello world!"),
),
...
```

![image-20180911094807143](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/image-20180911094807143.png)

可以发现，直观的感觉就是margin的补白是在容器外部，而padding的补白是在容器内部，读者需要记住这个差异。事实上，Container内`margin`和`padding`都是通过Padding  widget来实现的，上面的示例代码实际上等价于：

```dart
...
Padding(
  padding: EdgeInsets.all(20.0),
  child: DecoratedBox(
    decoration: BoxDecoration(color: Colors.orange),
    child: Text("Hello world!"),
  ),
),
DecoratedBox(
  decoration: BoxDecoration(color: Colors.orange),
  child: Padding(
    padding: const EdgeInsets.all(20.0),
    child: Text("Hello world!"),
  ),
),
...    
```
