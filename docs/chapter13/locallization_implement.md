# 13.2 实现 Localizations

前面讲了 Material 组件库如何支持国际化，本节我们将介绍一下我们自己的 UI 中如何支持多语言。根据上节所述，我们需要实现两个类：一个`Delegate`类一个`Localizations`类，下面我们通过一个实例说明。

### 实现 Localizations 类

我们已经知道`Localizations`类中主要实现提供了本地化值，如文本：

```dart
//Locale资源类
class DemoLocalizations {
  DemoLocalizations(this.isZh);
  //是否为中文
  bool isZh = false;
  //为了使用方便，我们定义一个静态方法
  static DemoLocalizations of(BuildContext context) {
    return Localizations.of<DemoLocalizations>(context, DemoLocalizations);
  }
  //Locale相关值，title为应用标题
  String get title {
    return isZh ? "Flutter应用" : "Flutter APP";
  }
  //... 其它的值
}
```

`DemoLocalizations`中会根据当前的语言来返回不同的文本，如`title`，我们可以将所有需要支持多语言的文本都在此类中定义。`DemoLocalizations`的实例将会在 Delegate 类的`load`方法中创建。

### 实现 Delegate 类

Delegate 类的职责是在 Locale 改变时加载新的 Locale 资源，所以它有一个`load`方法，Delegate 类需要继承自`LocalizationsDelegate`类，实现相应的接口，示例如下：

```dart
//Locale代理类
class DemoLocalizationsDelegate extends LocalizationsDelegate<DemoLocalizations> {
  const DemoLocalizationsDelegate();

  //是否支持某个Local
  @override
  bool isSupported(Locale locale) => ['en', 'zh'].contains(locale.languageCode);

  // Flutter会调用此类加载相应的Locale资源类
  @override
  Future<DemoLocalizations> load(Locale locale) {
    print("$locale");
    return SynchronousFuture<DemoLocalizations>(
        DemoLocalizations(locale.languageCode == "zh")
    );
  }

  @override
  bool shouldReload(DemoLocalizationsDelegate old) => false;
}
```

`shouldReload`的返回值决定当 Localizations 组件重新 build 时，是否调用`load`方法重新加载 Locale 资源。一般情况下，Locale 资源只应该在 Locale 切换时加载一次，不需要每次在`Localizations`重新 build 时都加载，所以返回`false`即可。可能有些人会担心返回`false`的话在 APP 启动后用户再改变系统语言时`load`方法将不会被调用，所以 Locale 资源将不会被加载。事实上，每当 Locale 改变时 Flutter 都会再调用`load`方法加载新的 Locale，无论`shouldReload`返回`true`还是`false`。

### 最后一步：添加多语言支持

和上一节中介绍的相同，我们现在需要先注册`DemoLocalizationsDelegate`类，然后再通过`DemoLocalizations.of(context)`来动态获取当前 Locale 文本。

只需要在 MaterialApp 或 WidgetsApp 的`localizationsDelegates`列表中添加我们的 Delegate 实例即可完成注册：

```dart
localizationsDelegates: [
 // 本地化的代理类
 GlobalMaterialLocalizations.delegate,
 GlobalWidgetsLocalizations.delegate,
 // 注册我们的Delegate
 DemoLocalizationsDelegate()
],
```

接下来我们可以在 Widget 中使用 Locale 值：

```dart
return Scaffold(
  appBar: AppBar(
    //使用Locale title
    title: Text(DemoLocalizations.of(context).title),
  ),
  ... //省略无关代码
 ）
```

这样，当在美国英语和中文简体之间切换系统语言时，APP 的标题将会分别为“Flutter APP”和“Flutter 应用”。

### 总结

本节我们通过一个简单的示例说明了 Flutter 应用国际化的基本过程及原理。但是上面的实例还有一个严重的不足就是我们需要在 DemoLocalizations 类中获取`title`时手动的判断当前语言 Locale，然后返回合适的文本。试想一下，当我们要支持的语言不是两种而是 8 种甚至 20 几种时，如果为每个文本属性都要分别去判断到底是哪种 Locale 从而获取相应语言的文本将会是一件非常复杂的事。还有，通常情况下翻译人员并不是开发人员，能不能像 i18n 或 l10n 标准那样可以将翻译单独保存为一个 arb 文件交由翻译人员去翻译，翻译好之后开发人员再通过工具将 arb 文件转为代码。答案是肯定的！我们将在下一节介绍如何通过 Dart intl 包来实现这些。
