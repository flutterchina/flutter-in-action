# 包管理

一个完整的应用程序往往会依赖很多第三方包，正如在原生开发中，Android使用Gradle来管理依赖，iOS用Cocoapods或Carthage来管理依赖，而Flutter也有自己的依赖管理工具，本节我们主要介绍一下flutter如何使用配置文件`pubspec.yaml`（位于项目根目录）来管理第三方依赖包。

YAML是一种直观、可读性高并且容易被人类阅读的文件格式，它和xml或Json相比，它语法简单并非常容易解析，所以YAML常用于配置文件，Flutter也是用yaml文件作为其配置文件，Flutter项目默认的配置文件是`pubspec.yaml`，我们看一个简单的示例：

```yaml
name: flutter_in_action
description: First Flutter application.

version: 1.0.0+1

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^0.1.2

dev_dependencies:
  flutter_test:
    sdk: flutter
    
flutter:
  uses-material-design: true
```

下面，我们逐一解释一下各个字段的意义：

- name：应用或包名称。
- description: 应用或包的描述、简介。
- version：应用或包的版本号。
- dependencies：应用或包依赖的其它包或插件。
- dev_dependencies：开发环境依赖的工具包（而不是flutter应用本身依赖的包）。
- flutter：flutter相关的配置选项。

如果我们的Flutter应用本身依赖某个包，我们需要将所依赖的包添加到`dependencies` 下，接下来我们通过一个例子来演示一下如何依赖、下载并使用第三方包。

## Pub仓库

Pub（https://pub.dartlang.org/ ）是Google官方的Dart Packages仓库，类似于node中的npm仓库，android中的jcenter，我们可以在上面查找我们需要的包和插件，也可以向pub发布我们的包和插件。我们将在后面的章节中介绍如何向pub发布我们的包和插件。

## 示例

接下来，我们实现一个显示随机字符串的widget。有一个名为“english_words”的开源软件包，其中包含数千个常用的英文单词以及一些实用功能。我们首先在pub上找到english_words这个包，确定其最新的版本号和是否支持Flutter。

![english words](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/english_words.png)

我们看到“english_words”包最新的版本是3.1.3，并且支持flutter，接下来：

1. 将english_words（3.1.3版本）添加到依赖项列表，如下：

   ```yaml
   dependencies:
     flutter:
       sdk: flutter
   
     cupertino_icons: ^0.1.0
     # 新添加的依赖
     english_words: ^3.1.3
   ```

2. 下载包

   在Android Studio的编辑器视图中查看pubspec.yaml时，单击右上角的 **Packages get** 。

   ![package get](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/package_get.png)



   这会将依赖包安装到您的项目。您可以在控制台中看到以下内容：

   ```shell
   flutter packages get
   Running "flutter packages get" in flutter_in_action...
   Process finished with exit code 0
   ```

   你也可以在控制台，定位到当前工程目录，然后手动运行`flutter packages get` 命令来下载依赖包。

3. 引入`english_words`包。

   ```dart
   import 'package:english_words/english_words.dart';
   ```

   在输入时，Android Studio会自动提供有关库导入的建议选项。导入后该行代码将会显示为灰色，表示导入的库尚未使用。

4. 使用`english_words`包来生成随机字符串。

   ```dart
   class RandomWordsWidget extends StatelessWidget {
     @override
     Widget build(BuildContext context) {
      // 生成随机字符串
       final wordPair = new WordPair.random();
       return Padding(
         padding: const EdgeInsets.all(8.0),
         child: new Text(wordPair.toString()),
       );
     }
   }
   ```

   我们将`RandomWordsWidget` 添加到"计数器"示例的首页`MyHomePage` 的`Column`的子widget中。

5. 如果应用程序正在运行，请使用热重载按钮 (![lightning bolt icon](https://flutterchina.club/get-started/codelab/images/hot-reload-button.png)) 更新正在运行的应用程序。每次单击热重载或保存项目时，都会在正在运行的应用程序中随机选择不同的单词对。 这是因为单词对是在 `build` 方法内部生成的。每次热更新时，`build`方法都会被执行。

   ![image-20180822163100650](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0/docs/imgs/image-20180822163100650.png)


## 其它依赖方式

上文所述的依赖方式是依赖pub仓库的。但我们还可以依赖本地包和git仓库。

- 依赖本地包

  如果我们正在本地开发一个包，包名为pkg1，我们可以通过下面方式依赖：

  ```yaml
  dependencies:
  	pkg1:
          path: ../../code/pkg1
  ```

  路径可以是相对的，也可以是绝对的。

- 依赖Git：你也可以依赖存储在Git仓库中的包。如果软件包位于仓库的根目录中，请使用以下语法

  ```yaml
  dependencies:
    pkg1:
      git:
        url: git://github.com/xxx/pkg1.git
  ```

  上面假定包位于Git存储库的根目录中。如果不是这种情况，可以使用path参数指定相对位置，例如：

  ```yaml
  dependencies:
    package1:
      git:
        url: git://github.com/flutter/packages.git
        path: packages/package1        
  ```

## 总结

本节介绍了引用、下载、使用一个包的整体流程，并在后面介绍了多种不同的引入方式，这些是Flutter开发中常用的，但Dart的dependencies还有一些其它依赖方式，完整的内容读者可以自行查看：https://www.dartlang.org/tools/pub/dependencies 。


