# 2.4 资源管理

Flutter APP 安装包中会包含代码和  assets（资源）两部分。Assets 是会打包到程序安装包中的，可在运行时访问。常见类型的 assets 包括静态数据（例如 JSON 文件）、配置文件、图标和图片（JPEG，WebP，GIF，动画 WebP / GIF，PNG，BMP 和 WBMP）等。

## 指定 assets

和包管理一样，Flutter 也使用[`pubspec.yaml`](https://www.dartlang.org/tools/pub/pubspec)文件来管理应用程序所需的资源，举个例子:

```yaml
flutter:
  assets:
    - assets/my_icon.png
    - assets/background.png
```

`assets`指定应包含在应用程序中的文件， 每个 asset 都通过相对于`pubspec.yaml`文件所在的文件系统路径来标识自身的路径。asset 的声明顺序是无关紧要的，asset 的实际目录可以是任意文件夹（在本示例中是 assets 文件夹）。

在构建期间，Flutter 将 asset 放置到称为 _asset bundle_ 的特殊存档中，应用程序可以在运行时读取它们（但不能修改）。

## Asset 变体（variant）

构建过程支持“asset 变体”的概念：不同版本的 asset 可能会显示在不同的上下文中。 在`pubspec.yaml`的 assets 部分中指定 asset 路径时，构建过程中，会在相邻子目录中查找具有相同名称的任何文件。这些文件随后会与指定的 asset 一起被包含在 asset bundle 中。

例如，如果应用程序目录中有以下文件:

- …/pubspec.yaml
- …/graphics/my_icon.png
- …/graphics/background.png
- …/graphics/dark/background.png
- …etc.

然后`pubspec.yaml`文件中只需包含:

```
flutter:
  assets:
    - graphics/background.png
```

那么这两个`graphics/background.png`和`graphics/dark/background.png` 都将包含在您的 asset bundle 中。前者被认为是*main asset* （主资源），后者被认为是一种变体（variant）。

在选择匹配当前设备分辨率的图片时，Flutter 会使用到 asset 变体（见下文），将来，Flutter 可能会将这种机制扩展到本地化、阅读提示等方面。

## 加载 assets

您的应用可以通过[`AssetBundle`](https://docs.flutter.io/flutter/services/AssetBundle-class.html)对象访问其 asset 。有两种主要方法允许从 Asset bundle 中加载字符串或图片（二进制）文件。

### 加载文本 assets

- 通过[`rootBundle`](https://docs.flutter.io/flutter/services/rootBundle.html) 对象加载：每个 Flutter 应用程序都有一个[`rootBundle`](https://docs.flutter.io/flutter/services/rootBundle.html)对象， 通过它可以轻松访问主资源包，直接使用`package:flutter/services.dart`中全局静态的`rootBundle`对象来加载 asset 即可。
- 通过 [`DefaultAssetBundle`](https://docs.flutter.io/flutter/widgets/DefaultAssetBundle-class.html) 加载：建议使用 [`DefaultAssetBundle`](https://docs.flutter.io/flutter/widgets/DefaultAssetBundle-class.html) 来获取当前 BuildContext 的 AssetBundle。 这种方法不是使用应用程序构建的默认 asset bundle，而是使父级 widget 在运行时动态替换的不同的 AssetBundle，这对于本地化或测试场景很有用。

通常，可以使用`DefaultAssetBundle.of()`在应用运行时来间接加载 asset（例如 JSON 文件），而在 widget 上下文之外，或其它`AssetBundle`句柄不可用时，可以使用`rootBundle`直接加载这些 asset，例如：

```dart
import 'dart:async' show Future;
import 'package:flutter/services.dart' show rootBundle;

Future<String> loadAsset() async {
  return await rootBundle.loadString('assets/config.json');
}
```

### 加载图片

类似于原生开发，Flutter 也可以为当前设备加载适合其分辨率的图像。

#### 声明分辨率相关的图片 assets

[`AssetImage`](https://docs.flutter.io/flutter/painting/AssetImage-class.html) 可以将 asset 的请求逻辑映射到最接近当前设备像素比例（dpi）的 asset。为了使这种映射起作用，必须根据特定的目录结构来保存 asset：

- …/image.png
- …/**M**x/image.png
- …/**N**x/image.png
- …etc.

其中 M 和 N 是数字标识符，对应于其中包含的图像的分辨率，也就是说，它们指定不同设备像素比例的图片。

主资源默认对应于 1.0 倍的分辨率图片。看一个例子：

- …/my_icon.png
- …/2.0x/my_icon.png
- …/3.0x/my_icon.png

在设备像素比率为 1.8 的设备上，`.../2.0x/my_icon.png` 将被选择。对于 2.7 的设备像素比率，`.../3.0x/my_icon.png`将被选择。

如果未在`Image` widget 上指定渲染图像的宽度和高度，那么`Image` widget 将占用与主资源相同的屏幕空间大小。 也就是说，如果`.../my_icon.png`是 72px 乘 72px，那么`.../3.0x/my_icon.png`应该是 216px 乘 216px; 但如果未指定宽度和高度，它们都将渲染为 72 像素 ×72 像素（以逻辑像素为单位）。

`pubspec.yaml`中 asset 部分中的每一项都应与实际文件相对应，但主资源项除外。当主资源缺少某个资源时，会按分辨率从低到高的顺序去选择 ，也就是说 1x 中没有的话会在 2x 中找，2x 中还没有的话就在 3x 中找。

#### 加载图片

要加载图片，可以使用  [`AssetImage`](https://docs.flutter.io/flutter/painting/AssetImage-class.html)类。例如，我们可以从上面的 asset 声明中加载背景图片：

```dart
Widget build(BuildContext context) {
  return new DecoratedBox(
    decoration: new BoxDecoration(
      image: new DecorationImage(
        image: new AssetImage('graphics/background.png'),
      ),
    ),
  );
}
```

注意，`AssetImage` 并非是一个 widget， 它实际上是一个`ImageProvider`，有些时候你可能期望直接得到一个显示图片的 widget，那么你可以使用`Image.asset()`方法，如：

```dart
Widget build(BuildContext context) {
  return Image.asset('graphics/background.png');
}
```

使用默认的 asset bundle 加载资源时，内部会自动处理分辨率等，这些处理对开发者来说是无感知的。 (如果使用一些更低级别的类，如  [`ImageStream`](https://docs.flutter.io/flutter/painting/ImageStream-class.html)或  [`ImageCache`](https://docs.flutter.io/flutter/painting/ImageCache-class.html) 时你会注意到有与缩放相关的参数)

#### 依赖包中的资源图片

要加载依赖包中的图像，必须给`AssetImage`提供`package`参数。

例如，假设您的应用程序依赖于一个名为“my_icons”的包，它具有如下目录结构：

- …/pubspec.yaml
- …/icons/heart.png
- …/icons/1.5x/heart.png
- …/icons/2.0x/heart.png
- …etc.

然后加载图像，使用:

```dart
 new AssetImage('icons/heart.png', package: 'my_icons')
```

或

```dart
new Image.asset('icons/heart.png', package: 'my_icons')
```

**注意：包在使用本身的资源时也应该加上`package`参数来获取**。

##### 打包包中的 assets

如果在`pubspec.yaml`文件中声明了期望的资源，它将会打包到相应的 package 中。特别是，包本身使用的资源必须在`pubspec.yaml`中指定。

包也可以选择在其`lib/`文件夹中包含未在其`pubspec.yaml`文件中声明的资源。在这种情况下，对于要打包的图片，应用程序必须在`pubspec.yaml`中指定包含哪些图像。 例如，一个名为“fancy_backgrounds”的包，可能包含以下文件：

- …/lib/backgrounds/background1.png
- …/lib/backgrounds/background2.png
- …/lib/backgrounds/background3.png

要包含第一张图像，必须在`pubspec.yaml`的 assets 部分中声明它：

```
flutter:
  assets:
    - packages/fancy_backgrounds/backgrounds/background1.png
```

`lib/`是隐含的，所以它不应该包含在资产路径中。

### 特定平台 assets

上面的资源都是 flutter 应用中的，这些资源只有在 Flutter 框架运行之后才能使用，如果要给我们的应用设置 APP 图标或者添加启动图，那我们必须使用特定平台的 assets。

#### 设置 APP 图标

更新 Flutter 应用程序启动图标的方式与在本机 Android 或 iOS 应用程序中更新启动图标的方式相同。

- Android

  在 Flutter 项目的根目录中，导航到`.../android/app/src/main/res`目录，里面包含了各种资源文件夹（如`mipmap-hdpi`已包含占位符图像“ic_launcher.png”，见图 2-8）。 只需按照[Android 开发人员指南](https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher.html#size)中的说明， 将其替换为所需的资源，并遵守每种屏幕密度（dpi）的建议图标大小标准。

  ![图2-8](../imgs/2-8.png)

  > **注意:** 如果您重命名.png 文件，则还必须在您`AndroidManifest.xml`的`<application>`标签的`android:icon`属性中更新名称。

- iOS

  在 Flutter 项目的根目录中，导航到`.../ios/Runner`。该目录中`Assets.xcassets/AppIcon.appiconset`已经包含占位符图片（见图 2-9）， 只需将它们替换为适当大小的图片，保留原始文件名称。

  ![图2-9](../imgs/2-9.png)

#### 更新启动页

![图2-10](../imgs/2-10.png)

在 Flutter 框架加载时，Flutter 会使用本地平台机制绘制启动页。此启动页将持续到 Flutter 渲染应用程序的第一帧时。

> **注意:** 这意味着如果您不在应用程序的`main()`方法中调用[runApp](https://docs.flutter.io/flutter/widgets/runApp.html) 函数 （或者更具体地说，如果您不调用[`window.render`](https://docs.flutter.io/flutter/dart-ui/Window/render.html)去响应[`window.onDrawFrame`](https://docs.flutter.io/flutter/dart-ui/Window/onDrawFrame.html)）的话， 启动屏幕将永远持续显示。

##### Android

要将启动屏幕（splash screen）添加到您的 Flutter 应用程序， 请导航至`.../android/app/src/main`。在`res/drawable/launch_background.xml`，通过自定义 drawable 来实现自定义启动界面（你也可以直接换一张图片）。

##### iOS

要将图片添加到启动屏幕（splash screen）的中心，请导航至`.../ios/Runner`。在`Assets.xcassets/LaunchImage.imageset`， 拖入图片，并命名为`LaunchImage.png`、`LaunchImage@2x.png`、`LaunchImage@3x.png`。 如果你使用不同的文件名，那您还必须更新同一目录中的`Contents.json`文件，图片的具体尺寸可以查看苹果官方的标准。

您也可以通过打开 Xcode 完全自定义 storyboard。在 Project Navigator 中导航到`Runner/Runner`然后通过打开`Assets.xcassets`拖入图片，或者通过在 LaunchScreen.storyboard 中使用 Interface Builder 进行自定义，如图 2-11 所示。

![图2-11](../imgs/2-11.png)
