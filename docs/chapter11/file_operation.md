# 11.1 文件操作

Dart 的 IO 库包含了文件读写的相关类，它属于 Dart 语法标准的一部分，所以通过 Dart IO 库，无论是 Dart VM 下的脚本还是 Flutter，都是通过 Dart IO 库来操作文件的，不过和 Dart VM 相比，Flutter 有一个重要差异是文件系统路径不同，这是因为 Dart VM 是运行在 PC 或服务器操作系统下，而 Flutter 是运行在移动操作系统中，他们的文件系统会有一些差异。

#### APP 目录

Android 和 iOS 的应用存储目录不同，[`PathProvider`](https://pub.dartlang.org/packages/path_provider) 插件提供了一种平台透明的方式来访问设备文件系统上的常用位置。该类当前支持访问两个文件系统位置：

- **临时目录:** 可以使用 `getTemporaryDirectory()` 来获取临时目录； 系统可随时清除的临时目录（缓存）。在 iOS 上，这对应于[`NSTemporaryDirectory()`](https://developer.apple.com/reference/foundation/1409211-nstemporarydirectory) 返回的值。在 Android 上，这是[`getCacheDir()`](<https://developer.android.com/reference/android/content/Context.html#getCacheDir()>)返回的值。
- **文档目录:** 可以使用`getApplicationDocumentsDirectory()`来获取应用程序的文档目录，该目录用于存储只有自己可以访问的文件。只有当应用程序被卸载时，系统才会清除该目录。在 iOS 上，这对应于`NSDocumentDirectory`。在 Android 上，这是`AppData`目录。
- **外部存储目录**：可以使用`getExternalStorageDirectory()`来获取外部存储目录，如 SD 卡；由于 iOS 不支持外部目录，所以在 iOS 下调用该方法会抛出`UnsupportedError`异常，而在 Android 下结果是 android SDK 中`getExternalStorageDirectory`的返回值。

一旦你的 Flutter 应用程序有一个文件位置的引用，你可以使用[dart:io](https://api.dartlang.org/stable/dart-io/dart-io-library.html)API 来执行对文件系统的读/写操作。有关使用 Dart 处理文件和目录的详细内容可以参考 Dart 语言文档，下面我们看一个简单的例子。

#### 示例

我们还是以计数器为例，实现在应用退出重启后可以恢复点击次数。 这里，我们使用文件来保存数据：

1. 引入 PathProvider 插件；在`pubspec.yaml`文件中添加如下声明：

   ```yaml
   path_provider: ^0.4.1
   ```

   添加后，执行`flutter packages get` 获取一下, 版本号可能随着时间推移会发生变化，读者可以使用最新版。

2. 实现：

   ```dart
   import 'dart:io';
   import 'dart:async';
   import 'package:flutter/material.dart';
   import 'package:path_provider/path_provider.dart';

   class FileOperationRoute extends StatefulWidget {
     FileOperationRoute({Key key}) : super(key: key);

     @override
     _FileOperationRouteState createState() => new _FileOperationRouteState();
   }

   class _FileOperationRouteState extends State<FileOperationRoute> {
     int _counter;

     @override
     void initState() {
       super.initState();
       //从文件读取点击次数
       _readCounter().then((int value) {
         setState(() {
           _counter = value;
         });
       });
     }

     Future<File> _getLocalFile() async {
       // 获取应用目录
       String dir = (await getApplicationDocumentsDirectory()).path;
       return new File('$dir/counter.txt');
     }

     Future<int> _readCounter() async {
       try {
         File file = await _getLocalFile();
         // 读取点击次数（以字符串）
         String contents = await file.readAsString();
         return int.parse(contents);
       } on FileSystemException {
         return 0;
       }
     }

     Future<Null> _incrementCounter() async {
       setState(() {
         _counter++;
       });
       // 将点击次数以字符串类型写到文件中
       await (await _getLocalFile()).writeAsString('$_counter');
     }

     @override
     Widget build(BuildContext context) {
       return new Scaffold(
         appBar: new AppBar(title: new Text('文件操作')),
         body: new Center(
           child: new Text('点击了 $_counter 次'),
         ),
         floatingActionButton: new FloatingActionButton(
           onPressed: _incrementCounter,
           tooltip: 'Increment',
           child: new Icon(Icons.add),
         ),
       );
     }
   }
   ```

   上面代码比较简单，不再赘述，需要说明的是，本示例只是为了演示文件读写，而在实际开发中，如果要存储一些简单的数据，使用 shared_preferences 插件会比较简单。

   > 注意，Dart IO 库操作文件的 API 非常丰富，但本书不是介绍 Dart 语言的，故不详细说明，读者需要的话可以自行学习。
