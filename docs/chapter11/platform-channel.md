## 插件开发：平台通道简介

所谓“平台特定”或“特定平台”，平台指的就是指Flutter运行的平台，如Android或IOS，可以认为就是应用的原生部分。所以，平台通道正是Flutter和原生之间通信的桥梁，它也是Flutter插件的底层基础设施。

Flutter使用了一个灵活的系统，允许您调用特定平台的API，无论在Android上的Java或Kotlin代码中，还是iOS上的ObjectiveC或Swift代码中均可用。

Flutter与原生之间的通信依赖灵活的消息传递方式：

- 应用的Flutter部分通过平台通道（platform channel）将消息发送到其应用程序的所在的宿主（iOS或Android）应用（原生应用）。
- 宿主监听平台通道，并接收该消息。然后它会调用该平台的API，并将响应发送回客户端，即应用程序的Flutter部分。

### 平台通道

使用平台通道在Flutter(client)和原生(host)之间传递消息，如下图所示：

![platform-channels](../imgs/platform-channels.png)

当在Flutter中调用原生方法时，调用信息通过平台通道传递到原生，原生收到调用信息后方可执行指定的操作，如需返回数据，则原生会将数据再通过平台通道传递给Flutter。值得注意的是消息传递是异步的，这确保了用户界面在消息传递时不会被挂起。

在客户端，[MethodChannel  API](https://docs.flutter.io/flutter/services/MethodChannel-class.html) 可以发送与方法调用相对应的消息。 在宿主平台上，`MethodChannel` 在[Android API](https://docs.flutter.io/javadoc/io/flutter/plugin/common/MethodChannel.html) 和 [FlutterMethodChannel iOS API](https://docs.flutter.io/objcdoc/Classes/FlutterMethodChannel.html)可以接收方法调用并返回结果。这些类可以帮助我们用很少的代码就能开发平台插件。

> **注意**: 如果需要，方法调用(消息传递)可以是反向的，即宿主作为客户端调用Dart中实现的API。 [`quick_actions`](https://pub.dartlang.org/packages/quick_actions)插件就是一个具体的例子。

### 平台通道数据类型支持

平台通道使用标准消息编/解码器对消息进行编解码，它可以高效的对消息进行二进制序列化与反序列化。由于Dart与原生平台之间数据类型有所差异，下面我们列出数据类型之间的映射关系。

| Dart                       | Android              | iOS                                            |
| -------------------------- | -------------------- | ---------------------------------------------- |
| null                       | null                 | nil (NSNull when nested)                       |
| bool                       | java.lang.Boolean    | NSNumber numberWithBool:                       |
| int                        | java.lang.Integer    | NSNumber numberWithInt:                        |
| int, if 32 bits not enough | java.lang.Long       | NSNumber numberWithLong:                       |
| int, if 64 bits not enough | java.math.BigInteger | FlutterStandardBigInteger                      |
| double                     | java.lang.Double     | NSNumber numberWithDouble:                     |
| String                     | java.lang.String     | NSString                                       |
| Uint8List                  | byte[]               | FlutterStandardTypedData typedDataWithBytes:   |
| Int32List                  | int[]                | FlutterStandardTypedData typedDataWithInt32:   |
| Int64List                  | long[]               | FlutterStandardTypedData typedDataWithInt64:   |
| Float64List                | double[]             | FlutterStandardTypedData typedDataWithFloat64: |
| List                       | java.util.ArrayList  | NSArray                                        |
| Map                        | java.util.HashMap    | NSDictionary                                   |

 当在发送和接收值时，这些值在消息中的序列化和反序列化会自动进行。

## 开发Flutter插件

使用平台通道调用原生代码

下面我们通过一个获取电池电量的插件来介绍一下Flutter插件的开发流程。该插件中我们在Dart中通过`getBatteryLevel` 调用Android `BatteryManager` API和iOS `device.batteryLevel` API。 

### 创建一个新的应用程序项目

首先创建一个新的应用程序:

- 在终端中运行：`flutter create batterylevel`

默认情况下，模板支持使用Java编写Android代码，或使用Objective-C编写iOS代码。要使用Kotlin或Swift，请使用-i和/或-a标志:

- 在终端中运行: `flutter create -i swift -a kotlin batterylevel`

### 创建Flutter平台客户端

该应用的`State`类拥有当前的应用状态。我们需要延长这一点以保持当前的电量

首先，我们构建通道。我们使用`MethodChannel`调用一个方法来返回电池电量。

通道的客户端和宿主通过通道构造函数中传递的通道名称进行连接。单个应用中使用的所有通道名称必须是唯一的; 我们建议在通道名称前加一个唯一的“域名前缀”，例如`samples.flutter.io/battery`。

```dart
import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
...
class _MyHomePageState extends State<MyHomePage> {
  static const platform = const MethodChannel('samples.flutter.io/battery');

  // Get battery level.
}
```

接下来，我们调用通道上的方法，指定通过字符串标识符调用方法`getBatteryLevel`。 该调用可能失败(平台不支持平台API，例如在模拟器中运行时)，所以我们将invokeMethod调用包装在try-catch语句中。

我们使用返回的结果，在`setState`中来更新用户界面状态`batteryLevel`。

```dart
  // Get battery level.
  String _batteryLevel = 'Unknown battery level.';

  Future<Null> _getBatteryLevel() async {
    String batteryLevel;
    try {
      final int result = await platform.invokeMethod('getBatteryLevel');
      batteryLevel = 'Battery level at $result % .';
    } on PlatformException catch (e) {
      batteryLevel = "Failed to get battery level: '${e.message}'.";
    }

    setState(() {
      _batteryLevel = batteryLevel;
    });
  }
```

最后，我们在build创建包含一个小字体显示电池状态和一个用于刷新值的按钮的用户界面。

```dart
@override
Widget build(BuildContext context) {
  return new Material(
    child: new Center(
      child: new Column(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          new RaisedButton(
            child: new Text('Get Battery Level'),
            onPressed: _getBatteryLevel,
          ),
          new Text(_batteryLevel),
        ],
      ),
    ),
  );
}
```

在接下来的两节中，我们会分别介绍Android和iOS端API的实现。

## 自定义平台通道和编解码器

除了上面提到的`MethodChannel`，还可以使用[`BasicMessageChannel`](https://docs.flutter.io/flutter/services/BasicMessageChannel-class.html)，它支持使用自定义消息编解码器进行基本的异步消息传递。 此外，可以使用专门的[`BinaryCodec`](https://docs.flutter.io/flutter/services/BinaryCodec-class.html)、[`StringCodec`](https://docs.flutter.io/flutter/services/StringCodec-class.html)和 [`JSONMessageCodec`](https://docs.flutter.io/flutter/services/JSONMessageCodec-class.html)类，或创建自己的编解码器。