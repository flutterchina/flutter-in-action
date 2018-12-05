## 进度条

和大多数UI库一样，Flutter也提供了两种进度指示器。一种是水平方向线性的LinearProgressIndicator，另一种是圆形的CircularProgressIndicator。两种指示器都支持循环模式和精确精度:

- 循环模式：循环模式会有一个循环的动画，用于无法获得精确进度的场景，循环模式为默认模式。
- 精确模式：用于可以获得精确进度的场景，比如大多数文件下载场景。精确模式需要提供`value`属性值，它的取值范围是[0,1]，代表当前进度的百分比。

### 水平进度条

LinearProgressIndicator是水平方向线性的进度条，下面分别给出循环模式和精确模式的示例：

```dart
 Column(
  children: <Widget>[
    //循环模式  
    LinearProgressIndicator(),
    Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: LinearProgressIndicator(
        backgroundColor: Colors.grey[200],
        value: .2, //精确模式，进度20%
      ),
    ),
   ]
  )
```

运行效果如下：

![image-20180830205934166](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/image-20180830205934166.png)



### 圆形进度条

CircularProgressIndicator是圆形进度条，下面分别给出循环模式和精确模式的示例：

```dart
Column(
  children: <Widget>[
    //循环模式  
    CircularProgressIndicator(),
    Padding(
      padding: const EdgeInsets.only(top: 20.0),
      child: CircularProgressIndicator(
        value: .5, //精确模式，进度50%
      ),
    )
  ],
)
```



![image-20180903142548051](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/image-20180903142548051.png)

CircularProgressIndicator支持一个strokeWidth属性，表示圆形进度条画笔的宽度，默认为4像素（逻辑像素），我们看看strokeWidth值为2.0时的效果：

![image-20180903144940343](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/image-20180903144940343.png)

代码：

```dart
CircularProgressIndicator(
  strokeWidth: 2.0,
)
```

### 属性

由于LinearProgressIndicator和CircularProgressIndicator都继承自ProgressIndicator，所以它们都支持ProgressIndicator定义的一些属性，下面我们来看看常用属性：

```dart
ProgressIndicator({
  ...  
  double value,
  Color backgroundColor,
  Animation<Color> valueColor,
})
```

- value：进度条当前的精确进度，如果为`null`，则精度条为循环模式。

- backgroundColor：进度条背景色，目前只有在LinearProgressIndicator设置有效，CircularProgressIndicator暂不支持背景色。

- valueColor：LinearProgressIndicator和CircularProgressIndicator的进度指示色都是一个动画值，也就是说指示色是可以执行动画的，只不过默认是使用了固定色(主题色)而已。我们可以指定一个`Animation<Color>`来为指示色执行动画：

  ```dart
  CircularProgressIndicator(
    valueColor: ColorTween(begin: Colors.blue, end: Colors.green)
        .animate(_controller),
  )
  ```

  这个示例运行后，圆形精度条的颜色会在蓝色和绿色之间渐变。关于动画的详细内容，请参考后面“动画”一章内容。

### 自定义进度条样式

#### 定义进度条大小

进度条本身没有控制大小的属性，LinearProgressIndicator的默认高度是6像素，宽度自适应。CircularProgressIndicator默认的宽度和高度皆为36像素。我们可以通过指定父容器的宽高来自定义其大小，如：

```dart
...
SizedBox(
    height: 2.0, //高度指定为2像素
    child: LinearProgressIndicator()
),

SizedBox(
  height: 80.0, //高度和宽度均指定为80像素
  width: 80.0,
  child: CircularProgressIndicator(),
)
...
```

![image-20180903161057739](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/image-20180903161057739.png)



#### 自定义颜色

假如我们想指定进度条颜色为绿色，有两种方法可以自定义进度条颜色，：

- 通过主题来自定义：

  ```dart
  Theme(
    data: ThemeData(
      primarySwatch: Colors.green,
    ),
    child: LinearProgressIndicator(
      value: .2,
    ),
  )
  ```

  运行效果如下：

  ![image-20180903162117829](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/image-20180903162117829.png)

  通过主题定义widget样式的方法在flutter中非常常见，我们将在后面专门“主题”章节详细介绍。

- 通过valueColor属性：

  我们可以通过给valueColor指定一个`AlwaysStoppedAnimation<Color>`对象来使用固定的颜色（而非动画颜色）。

  ```dart
  CircularProgressIndicator(
    valueColor: new AlwaysStoppedAnimation<Color>(Colors.green),
    value: .9,
  )
  ```

  运行效果如下：

  ![image-20180903162208760](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/image-20180903162208760.png)

