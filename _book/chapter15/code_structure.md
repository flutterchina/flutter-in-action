# Flutter APP代码结构

我们先来创建一个全新的Flutter工程，命名为"github_client_app"；创建新工程的步骤视读者使用的编辑器而定，都比较简单，在此不再赘述。创建完成后，工程结构如下：

```
github_client_app
├── android
├── ios
├── lib
└── test
```

由于我们需要使用外部图片和Icon资源，所以我们在项目根目录下分别创建”imgs“和”fonts“文件件，前者用于保存图片，后者用于保存Icon文件。关于图片和Icon，读者可以参考第三章中相应的内容。

由于在网络数据传输和持久化时，我们需要通过Json来传输、保存数据；但是在应用开发时我们又需要将Json转成Dart Model类，现在我们使用在第十一章中”Json转Model“小节中介绍的方案，所以，我们需要在根目录下再创建一个用于保存Json文件的”jsons“文件夹。

多语言支持我们使用第十三章”国际化“中介绍的方案，所以还需要在根目录下创建一个"i10n"文件夹，用于保存各国语言对应的arb文件。

现在工程目录变为：

```
github_client_app
├── android
├── fonts
├── i10n-arb
├── imgs
├── ios
├── jsons
├── lib
└── test
```

由于我们的Dart代码都在“lib”文件夹下，笔者根据技术选型和经验在lib文件下创建了如下目录：

```
lib
├── common
├── i10n
├── models
├── states
├── routes
└── widgets 
```

| 文件夹  | 作用                                                         |
| ------- | ------------------------------------------------------------ |
| common  | 一些工具类，如通用方法类、网络接口类、保存全局变量的静态类等 |
| i10n    | 国际化相关的类都在此目录下                                   |
| models  | Json文件对应的Dart Model类会在此目录下                       |
| states  | 保存APP中需要跨组件共享的状态类                              |
| routes  | 存放所有路由页面类                                           |
| widgets | APP内封装的一些Widget组件都在该目录下                        |

注意，使用不同的框架或技术选型会对代码有不同的组织方式，因此，本节介绍的代码组织结构并不是固定或者“最佳”的，在实战中，读者可以自己根据情况调整源码结构。但是无论采取何种源码组织结构，但清晰和解耦是一个通用原则，我们应该让自己的代码结构清晰，以便交流和维护。

# Model类

本节我们先梳理一下APP中将用到的数据，然后生成相应的Dart Model类。Json文件转Dart Model的方案采用前面介绍过的 json_model package方案

## Github账号信息

登录Github后，我们需要获取当前登录者的Github账号信息，Github API接口返回Json结构如下：

```json
{
  "login": "octocat", //用户登录名
  "avatar_url": "https://github.com/images/error/octocat_happy.gif", //用户头像地址
  "type": "User", //用户类型，可能是组织
  "name": "monalisa octocat", //用户名字
  "company": "GitHub", //公司
  "blog": "https://github.com/blog", //博客地址
  "location": "San Francisco", // 用户所处地理位置
  "email": "octocat@github.com", // 邮箱
  "hireable": false,
  "bio": "There once was...", // 用户简介
  "public_repos": 2, // 公开项目数
  "followers": 20, //关注该用户的人数
  "following": 0, // 该用户关注的人数
  "created_at": "2008-01-14T04:33:35Z", // 账号创建时间
  "updated_at": "2008-01-14T04:33:35Z", // 账号信息更新时间
  "total_private_repos": 100, //该用户总的私有项目数(包括参与的其它组织的私有项目)
  "owned_private_repos": 100 //该用户自己的私有项目数
  ... //省略其它字段
}
```

我们在“jsons”目录下创建一个“user.json”文件保存上述信息。

## API 缓存策略信息

由于Github服务器在国内访问速度较慢，我们对Github API应用一些简单的缓存策略。我们在“jsons”目录下创建一个“cacheConfig.json”文件缓存策略信息，定义如下：

```json
{
  "enable":true, // 是否启用缓存
  "maxAge":1000, // 缓存的最长时间，单位（秒）
  "maxCount":100 // 最大缓存数
}
```

## 用户信息

用户信息(Profile)应包括如下信息：

1. Github账号信息；由于我们的APP可以切换账号登录，且登录后再次打开则不需要登录，所以我们需要对用户账号信息和登录状态进行持久化。

2. 应用使用配置信息；没一个用户都应有自己的APP配置信息，如主题、语言、以及数据缓存策略等。

3. 用户注销登录后，为了便于用户在退出APP前再次登录，我们需要记住上次登录的用户名。

需要注意的是，目前Github有三种登录方式，分别是账号密码登录、oauth授权登录、二次认证登录；这三种登录方式的安全性依次加强，但是在本示例中，为了简单起见，我们使用账号密码登录，因此我们需要保存用户的密码。

> 注意：在这里需要提醒读者，在登录场景中，保护用户账号安全是一个非常重要且永恒的话题，在实际开发中应严格杜绝直接明文存储用户账密的行为。

我们在“jsons”目录下创建一个“profile.json”文件，结构如下：

```json
{
  "user":"$user", //Github账号信息，结构见"user.json"
  "token":"", // 登录用户的token(oauth)或密码
  "theme":5678, //主题色值
  "cache":"$cacheConfig", // 缓存策略信息，结构见"cacheConfig.json"
  "lastLogin":"", //最近一次的注销登录的用户名
  "locale":"" // APP语言信息
}
```

## 项目信息

由于APP主页要显示其所有项目信息，我们在“jsons”目录下创建一个“repo.json”文件保存项目信息。通过参考Github 获取项目信息的API文档，定义出最终的“repo.json”文件结构，如下：

```json
{
  "id": 1296269,
  "name": "Hello-World", //项目名称
  "full_name": "octocat/Hello-World", //项目完成名称
  "owner": "$user", // 项目拥有者，结构见"user.json"
  "parent":"$repo", // 如果是fork的项目，则此字段表示fork的父项目信息
  "private": false, // 是否私有项目
  "description": "This your first repo!", //项目描述
  "fork": false, // 该项目是否为fork的项目
  "language": "JavaScript",//该项目的主要编程语言
  "forks_count": 9, // fork了该项目的数量
  "stargazers_count": 80, //该项目的star数量
  "size": 108, // 项目占用的存储大小
  "default_branch": "master", //项目的默认分支
  "open_issues_count": 2, //该项目当前打开的issue数量
  "pushed_at": "2011-01-26T19:06:43Z",
  "created_at": "2011-01-26T19:01:12Z",
  "updated_at": "2011-01-26T19:14:43Z",
  "subscribers_count": 42, //订阅（关注）该项目的人数
  "license": { // 该项目的开源许可证
    "key": "mit",
    "name": "MIT License",
    "spdx_id": "MIT",
    "url": "https://api.github.com/licenses/mit",
    "node_id": "MDc6TGljZW5zZW1pdA=="
  }
  ...//省略其它字段
}
```

## 生成Dart Model类

现在，我们需要的Json数据已经定义完毕，现在只需要运行json_model package提供的命令来通过json文件生成相应的Dart类：

```shell
flutter packages pub run json_model
```

命令执行成功后，可以看到lib/models文件夹下会生成相应的Dart Model类：

```
├── models
│   ├── cacheConfig.dart
│   ├── cacheConfig.g.dart
│   ├── index.dart
│   ├── profile.dart
│   ├── profile.g.dart
│   ├── repo.dart
│   ├── repo.g.dart
│   ├── user.dart
│   └── user.g.dart

```

## 数据持久化

我们使用shared_preferences包来对登录用户的Profile信息进行持久化。shared_preferences是一个Flutter插件，它通过Android和iOS平台提供的机制来实现数据持久化。由于shared_preferences的使用非常简单，读者可以自行查看其文档，在此不再赘述。







# 全局变量及共享状态

我们将一些生命周期会贯穿APP始终的的变量及方法封装在一个类中来统一管理：

## Global类

在定义全局共享状态前，我们在“lib/common”目录下创建一个`Global`类，它主要保存APP全局都会使用到的一些数据，定义如下：

```dart
// 提供四套可选主题色
const _themes = <MaterialColor>[
  Colors.blue,
  Colors.cyan,
  Colors.teal,
  Colors.green,
  Colors.red,
];

class Global {
  static SharedPreferences _prefs;
  static Profile profile = Profile();
  // 网络缓存对象
  static NetCache netCache = NetCache();

  // 可选的主题列表
  static List<MaterialColor> get themes => _themes;

  // 是否为release版
  static bool get isRelease => bool.fromEnvironment("dart.vm.product");

  //初始化全局信息，会在APP启动时执行
  static Future init() async {
    _prefs = await SharedPreferences.getInstance();
    var _profile = _prefs.getString("profile");
    if (_profile != null) {
      try {
        profile = Profile.fromJson(jsonDecode(_profile));
      } catch (e) {
        print(e);
      }
    }

    // 如果没有缓存策略，设置默认缓存策略
    profile.cache = profile.cache ?? CacheConfig()
      ..enable = true
      ..maxAge = 3600
      ..maxCount = 100;

    //初始化网络请求相关配置
    Git.init();
  }

  // 持久化Profile信息
  static saveProfile() =>
      _prefs.setString("profile", jsonEncode(profile.toJson()));
}
```

Global类的各个字段的意义都有注释，在此不再赘述，需要注意的是`init()`需要在App启动时就要执行，所以应用的`main`方法如下：

```dart
void main() => Global.init().then((e) => runApp(MyApp()));
```

在此，一定要确保`Global.init()`方法不能抛出异常，否则 `runApp(MyApp())`根本执行不到。

## 共享状态

有了全局变量，我们还需要考虑如何跨组件共享状态。当然，如果我们将要共享的状态全部定义为全局变量也是可以的，但是这在Flutter开发中并不是一个好主意，因为组件的状态是和UI相关，而在状态改变时我们会期望依赖该状态的UI组件会自动更新，如果使用全局变量，那么我们必须得去手动处理状态变动通知、接收机制以及变量和组件依赖关系。因此，本实例中，我们使用前面介绍过的Provider包来实现跨组件状态共享，因此我们需要定义相关的Provider。在本实例中，需要共享的状态有登录用户信息、APP主题信息、APP语言信息。由于这些信息改变后都要立即通知其它依赖的该信息的Widget更新，所以我们应该使用ChangeNotifierProvider，另外，这些信息改变后都是需要更新Profile信息并进行持久化的。综上所述，我们可以定义一个`ProfileChangeNotifier`基类，然后让需要共享的Model继承自该类即可，`ProfileChangeNotifier`定义如下：

```dart
class ProfileChangeNotifier extends ChangeNotifier {
  Profile get _profile => Global.profile;

  @override
  void notifyListeners() {
    Global.saveProfile(); //保存Profile变更
    super.notifyListeners(); //通知依赖的Widget更新
  }
}
```

## 用户信息

用户状态在登录状态发生变化时更新、通知其依赖项，我们定义如下：

```dart
class UserModel extends ProfileChangeNotifier {
  User get user => _profile.user;

  // APP是否登录(如果有用户信息，则证明登录过)
  bool get isLogin => user != null;

  //用户信息发生变化，更新用户信息并通知依赖它的子孙Widgets更新
  set user(User user) {
    if (user?.login != _profile.user?.login) {
      _profile.lastLogin = _profile.user?.login;
      _profile.user = user;
      notifyListeners();
    }
  }
}
```

## 主题信息

主题状态在用户更换APP主题时更新、通知其依赖项，定义如下：

```dart
class ThemeModel extends ProfileChangeNotifier {
  // 获取当前主题，如果为设置主题，则默认使用蓝色主题
  ColorSwatch get theme => Global.themes
      .firstWhere((e) => e.value == _profile.theme, orElse: () => Colors.blue);

  // 主题改变后，通知其依赖项，新主题会立即生效
  set theme(ColorSwatch color) {
    if (color != theme) {
      _profile.theme = color[500].value;
      notifyListeners();
    }
  }
}
```

## 语言信息

当APP语言选为跟随系统（Auto）时，在系通语言改变时，APP语言会更新；当用户在APP中选定了具体语言时（美国英语或中文简体），则APP便会一直使用用户选定的语言，不会再随系统语言而变。语言状态类定义如下：

```dart
class LocaleModel extends ProfileChangeNotifier {
  // 获取当前用户的APP语言配置Locale类，如果为null，则语言跟随系统语言
  Locale getLocale() {
    if (_profile.locale == null) return null;
    var t = _profile.locale.split("_");
    return Locale(t[0], t[1]);
  }

  // 获取当前Locale的字符串表示
  String get locale => _profile.locale;

  // 用户改变APP语言后，通知依赖项更新，新语言会立即生效
  set locale(String locale) {
    if (locale != _profile.locale) {
      _profile.locale = locale;
      notifyListeners();
    }
  }
}
```



# 网络请求

### 缓存

本实例的网络请求我们使用dio网络库，由于在国内访问Github服务器速度较慢，所以我们应用一些简单的缓存策略：将请求的url作为key，对请求的返回值在一个指定时间段类进行缓存，另外设置一个最大缓存数，当超过最大缓存数后移除最早的一条缓存。但是也得提供一种针对特定接口或请求决定是否启用缓存的机制，这种机制可以指定哪些接口或那次请求不应用缓存，这种机制是很有必要的，比如登录接口就不应该缓存，又比如用户在下拉刷新时就不应该再应用缓存。在实现缓存之前我们先定义保存缓存信息的`CacheObject`类：

```dart
class CacheObject {
  CacheObject(this.response)
      : timeStamp = DateTime.now().millisecondsSinceEpoch;
  Response response;
  int timeStamp; // 缓存创建时间

  @override
  bool operator ==(other) {
    return response.hashCode == other.hashCode;
  }

  //将请求uri作为缓存的key
  @override
  int get hashCode => response.realUri.hashCode;
}
```

接下来我们需要实现具体的缓存策略，由于我们使用的是dio package，所以我们可以直接通过拦截器来实现缓存策略：

```dart
import 'dart:collection';
import 'package:dio/dio.dart';
import '../index.dart';

class CacheObject {
  CacheObject(this.response)
      : timeStamp = DateTime.now().millisecondsSinceEpoch;
  Response response;
  int timeStamp;

  @override
  bool operator ==(other) {
    return response.hashCode == other.hashCode;
  }

  @override
  int get hashCode => response.realUri.hashCode;
}

class NetCache extends Interceptor {
  // 为确保迭代器顺序和对象插入时间一致顺序一致，我们使用LinkedHashMap
  var cache = LinkedHashMap<String, CacheObject>();

  @override
  onRequest(RequestOptions options) {
    if (!Global.profile.cache.enable) return options;
    // refresh标记是否是"下拉刷新"
    bool refresh = options.extra["refresh"] == true;
    //如果是下拉刷新，先删除相关缓存
    if (refresh) {
      if (options.extra["list"] == true) {
        //若是列表，则只要url中包含当前path的缓存全部删除（简单实现，并不精准）
        cache.removeWhere((key, v) => key.contains(options.path));
      } else {
        // 如果不是列表，则只删除uri相同的缓存
        delete(options.uri.toString());
      }
      return options;
    }
    if (options.extra["noCache"] != true &&
        options.method.toLowerCase() == 'get') {
      String key = options.extra["cacheKey"] ?? options.uri.toString();
      var ob = cache[key];
      if (ob != null) {
        //若缓存未过期，则返回缓存内容
        if ((DateTime.now().millisecondsSinceEpoch - ob.timeStamp) / 1000 <
            Global.profile.cache.maxAge) {
          return cache[key].response;
        } else {
          //若已过期则删除缓存，继续向服务器请求
          cache.remove(key);
        }
      }
    }
  }

  @override
  onError(DioError err) {
    // 错误状态不缓存
  }

  @override
  onResponse(Response response) {
    // 如果启用缓存，将返回结果保存到缓存
    if (Global.profile.cache.enable) {
      _saveCache(response);
    }
  }

  _saveCache(Response object) {
    RequestOptions options = object.request;
    if (options.extra["noCache"] != true &&
        options.method.toLowerCase() == "get") {
      // 如果缓存数量超过最大数量限制，则先移除最早的一条记录
      if (cache.length == Global.profile.cache.maxCount) {
        cache.remove(cache[cache.keys.first]);
      }
      String key = options.extra["cacheKey"] ?? options.uri.toString();
      cache[key] = CacheObject(object);
    }
  }

  void delete(String key) {
    cache.remove(key);
  }
}
```

关于代码的解释都在注释中了，在此需要说明的是dio包的`option.extra`是专门用于扩展请求参数的，我们通过定义了“refresh”和“noCache”两个参数实现了”针对特定接口或请求决定是否启用缓存的机制“，这两个参数含义如下：

| 参数名  | 类型 | 解释                                                         |
| ------- | ---- | ------------------------------------------------------------ |
| refresh | bool | 如果为true，则本次请求不使用缓存，但新的请求结果依然会被缓存 |
| noCache | bool | 本次请求禁用缓存，请求结果也不会被缓存。                     |

### 接口类

一个完整的APP，可能会涉及很多网络请求，为了便于管理、收敛请求入口，工程上最好的作法就是将所有网络请求放到同一个源码文件中。由于我们的接口都是请求的Github 开发平台提供的API，所以我们定义一个Git类，专门用于Github API接口调用。另外，在调试过程中，我们通常需要一些工具来查看网络请求、响应报文，使用网络代理工具来调试网络数据问题是主流方式。配置代理需要在应用中指定代理服务器的地址和端口，另外Github API是HTTPS协议，所以在配置完代理后还应该禁用证书校验，这些配置我们在Git类初始化时执行（`init()方法`）。下面是Git类的源码：

```dart
import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../index.dart';

class Git {
  // 在网络请求过程中可能会需要使用当前的context信息，比如在请求失败时
  // 打开一个新路由，而打开新路由需要context信息。
  Git([this.context]) {
    _options = Options(extra: {"context": context});
  }

  BuildContext context;
  Options _options;
  static Dio dio = new Dio(BaseOptions(
    baseUrl: 'https://api.github.com/',
    headers: {
      HttpHeaders.acceptHeader: "application/vnd.github.squirrel-girl-preview,"
          "application/vnd.github.symmetra-preview+json",
    },
  ));

  static void init() {
    // 添加缓存插件
    dio.interceptors.add(Global.netCache);
    // 设置用户token（可能为null，代表未登录）
    dio.options.headers[HttpHeaders.authorizationHeader] = Global.profile.token;

    // 在调试模式下需要抓包调试，所以我们使用代理，并禁用HTTPS证书校验
    if (!Global.isRelease) {
      (dio.httpClientAdapter as DefaultHttpClientAdapter).onHttpClientCreate =
          (client) {
        client.findProxy = (uri) {
          return "PROXY 10.1.10.250:8888";
        };
        //代理工具会提供一个抓包的自签名证书，会通不过证书校验，所以我们禁用证书校验
        client.badCertificateCallback =
            (X509Certificate cert, String host, int port) => true;
      };
    }
  }

  // 登录接口，登录成功后返回用户信息
  Future<User> login(String login, String pwd) async {
    String basic = 'Basic ' + base64.encode(utf8.encode('$login:$pwd'));
    var r = await dio.get(
      "/users/$login",
      options: _options.merge(headers: {
        HttpHeaders.authorizationHeader: basic
      }, extra: {
        "noCache": true, //本接口禁用缓存
      }),
    );
    //登录成功后更新公共头（authorization），此后的所有请求都会带上用户身份信息
    dio.options.headers[HttpHeaders.authorizationHeader] = basic;
    //清空所有缓存
    Global.netCache.cache.clear();
    //更新profile中的token信息
    Global.profile.token = basic;
    return User.fromJson(r.data);
  }

  //获取用户项目列表
  Future<List<Repo>> getRepos(
      {Map<String, dynamic> queryParameters, //query参数，用于接收分页信息
      refresh = false}) async {
    if (refresh) {
      // 列表下拉刷新，需要删除缓存（拦截器中会读取这些信息）
      _options.extra.addAll({"refresh": true, "list": true});
    }
    var r = await dio.get<List>(
      "user/repos",
      queryParameters: queryParameters,
      options: _options,
    );
    return r.data.map((e) => Repo.fromJson(e)).toList();
  }
}
```

可以看到我们在`init()`方法中，我们判断了是否是调试环境，然后做了一些针对调试环境的网络配置（设置代理和禁用证书校验）。而`Git.init()`方法是应用启动时被调用的（`Global.init()`方法中会调用`Git.init()`）。

另外需要注意，我们所有的网络请求是通过同一个`dio`实例（静态变量）发出的，在创建该`dio`实例时我们将Github API的基地址和API支持的Header进行了全局配置，这样所有通过该`dio`实例发出的请求都会默认使用者些配置。

在本实例中，我们只用到了登录接口和获取用户项目的接口，所以在`Git`类中只定义了`login(…)`和`getRepos(…)`方法，如果读者要在本实例的基础上扩充功能，读者可以将其它的接口请求方法添加到`Git`类中，这样便实现了网络请求接口在代码层面的集中管理和维护。



# APP入口main.dart

`main`函数为APP入口函数，实现如下：

```dart
void main() => Global.init().then((e) => runApp(MyApp()));
```

初始化完成后才会加载UI(`MyApp`)，`MyApp` 是应用的入口Widget，实现如下：

```dart
class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: <SingleChildCloneableWidget>[
        ChangeNotifierProvider.value(value: ThemeModel()),
        ChangeNotifierProvider.value(value: UserModel()),
        ChangeNotifierProvider.value(value: LocaleModel()),
      ],
      child: Consumer2<ThemeModel, LocaleModel>(
        builder: (BuildContext context, themeModel, localeModel, Widget child) {
          return MaterialApp(
            title: 'Flutter Demo',
            theme: ThemeData(
              primarySwatch: themeModel.theme,
            ),
            home: HomeRoute(), //应用主页
            locale: localeModel.getLocale(),
            //我们只支持美国英语和中文简体
            supportedLocales: [
              const Locale('en', 'US'), // 美国英语
              const Locale('zh', 'CN'), // 中文简体
              //其它Locales
            ],
            localizationsDelegates: [
              // 本地化的代理类
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GmLocalizationsDelegate()
            ],
            localeResolutionCallback:
                (Locale _locale, Iterable<Locale> supportedLocales) {
              if (localeModel.getLocale() != null) {
                //如果已经选定语言，则不跟随系统
                return localeModel.getLocale();
              } else {
         
                Locale locale;
                //APP语言跟随系统语言，如果系统语言不是中文简体或美国英语，
                //则默认使用美国英语
                if (supportedLocales.contains(_locale)) {
                  locale= _locale;
                } else {
                  locale= Locale('en', 'US');
                }
                return locale;
              }
            },
            // 注册命名路由表
            routes: <String, WidgetBuilder>{
              "login": (context) => LoginRoute(),
              "themes": (context) => ThemeChangeRoute(),
              "language": (context) => LanguageRoute(),
            },
          );
        },
      ),
    );
  }
}
```

在上面的代码中：

1. 我们的根Widget是`MultiProvider`，它将主题、用户、语言三种状态绑定到了应用的根上，如此一来，任何路由中都可以通过`Provider.of()`来获取这些状态，也就是说这三种状态是全局共享的！
2. `HomeRoute`是应用的主页。
3. 在构建`MaterialApp`时，我们配置了APP支持的语言列表，以及监听了系统语言改变事件；另外`MaterialApp`消费（依赖）了`ThemeModel`和`LocaleModel`，所以当APP主题或语言改变时`MaterialApp`会重新构建
4. 我们注册了命名路由表，以便在APP中可以直接通过路由名跳转。
5. 为了支持多语言（本APP中我们支持美国英语和中文简体两种语言）我们实现了一个`GmLocalizationsDelegate`，子Widget中都可以通过`GmLocalizations`来动态获取APP当前语言对应的文案。关于`GmLocalizationsDelegate`和`GmLocalizations`的实现方式读者可以参考”国际化“一章中的介绍，此处不再赘述。

## 主页

为了简单起见，当APP启动后，如果之前已登录了APP，则显示该用户项目列表；如果之前未登录，则显示一个登录按钮，点击后跳转到登录页。另外，我们实现一个抽屉菜单，里面包含当前用户头像及APP的菜单。



我们在”lib/routes“下创建一个”home_page.dart“文件，实现如下：

```dart
class HomeRoute extends StatefulWidget {
  @override
  _HomeRouteState createState() => _HomeRouteState();
}

class _HomeRouteState extends State<HomeRoute> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(GmLocalizations.of(context).home),
      ),
      body: _buildBody(), // 构建主页面
      drawer: MyDrawer(), //抽屉菜单
    );
  }
  ...// 省略
}
```

上面代码中，主页的标题（title）我们是通过`GmLocalizations.of(context).home`来获得，`GmLocalizations`是我们提供的一个`Localizations`类，用于支持多语言，因此当APP语言改变时，凡是使用`GmLocalizations`动态获取的文案都会是相应语言的文案，这在前面”国际化“一章中已经介绍过，读者可以前翻查阅。

我们通过 `_buildBody()`方法来构建主页内容，`_buildBody()`方法实现代码如下：

```dart
  Widget _buildBody() {
    UserModel userModel = Provider.of<UserModel>(context);
    if (!userModel.isLogin) {
      //用户未登录，显示登录按钮
      return Center(
        child: RaisedButton(
          child: Text(GmLocalizations.of(context).login),
          onPressed: () => Navigator.of(context).pushNamed("login"),
        ),
      );
    } else {
      //已登录，则展示项目列表
      return InfiniteListView<Repo>(
        onRetrieveData: (int page, List<Repo> items, bool refresh) async {
          var data = await Git(context).getRepos(
            refresh: refresh,
            queryParameters: {
              'page': page,
              'page_size': 20,
            },
          );
          //把请求到的新数据添加到items中
          items.addAll(data); 
          // 如果接口返回的数量等于'page_size'，则认为还有数据，反之则认为最后一页
          return data.length==20;
        },
        itemBuilder: (List list, int index, BuildContext ctx) {
          // 项目信息列表项
          return RepoItem(list[index]);
        },
      );
    }
  }
}
```

上面代码注释很清楚：如果用户未登录，显示登录按钮；如果用户已登录，则展示项目列表。这里项目列表使用了`InfiniteListView` Widget，它是flukit package中提供的。`InfiniteListView`同时支持了下拉刷新和上拉加载更多两种功能。`onRetrieveData` 为数据获取回调，该回调函数接收三个参数：

| 参数名  | 类型    | 解释                   |
| ------- | ------- | ---------------------- |
| page    | int     | 当前页号               |
| items   | List<T> | 保存当前列表数据的List |
| refresh | bool    | 是否是下拉刷新触发     |

返回值类型为`bool`，为`true`时表示还有数据，为`false`时则表示后续没有数据了。`onRetrieveData` 回调中我们调用`Git(context).getRepos(...)`来获取用户项目列表，同时指定每次请求获取20条。当获取成功时，首先要将新获取的项目数据添加到`items`中，然后根据本次请求的项目条数是否等于期望的20条来判断还有没有更多的数据。在此需要注意，`Git(context).getRepos(…)`方法中需要`refresh`参数来判断是否使用缓存。

`itemBuilder`为列表项的builder，我们需要在该回调中构建每一个列表项Widget。由于列表项构建逻辑较负责，我们单独封装一个`RepoItem` Widget 专门用于构建列表项UI。`RepoItem` 实现如下：

```dart
import '../index.dart';

class RepoItem extends StatefulWidget {
  // 将`repo.id`作为RepoItem的默认key
  RepoItem(this.repo) : super(key: ValueKey(repo.id));

  final Repo repo;

  @override
  _RepoItemState createState() => _RepoItemState();
}

class _RepoItemState extends State<RepoItem> {
  @override
  Widget build(BuildContext context) {
    var subtitle;
    return Padding(
      padding: const EdgeInsets.only(top: 8.0),
      child: Material(
        color: Colors.white,
        shape: BorderDirectional(
          bottom: BorderSide(
            color: Theme.of(context).dividerColor,
            width: .5,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.only(top: 0.0, bottom: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              ListTile(
                dense: true,
                leading: gmAvatar(
                  //项目owner头像
                  widget.repo.owner.avatar_url,
                  width: 24.0,
                  borderRadius: BorderRadius.circular(12),
                ),
                title: Text(
                  widget.repo.owner.login,
                  textScaleFactor: .9,
                ),
                subtitle: subtitle,
                trailing: Text(widget.repo.language ?? ""),
              ),
              // 构建项目标题和简介
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      widget.repo.fork
                          ? widget.repo.full_name
                          : widget.repo.name,
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        fontStyle: widget.repo.fork
                            ? FontStyle.italic
                            : FontStyle.normal,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 8, bottom: 12),
                      child: widget.repo.description == null
                          ? Text(
                              GmLocalizations.of(context).noDescription,
                              style: TextStyle(
                                  fontStyle: FontStyle.italic,
                                  color: Colors.grey[700]),
                            )
                          : Text(
                              widget.repo.description,
                              maxLines: 3,
                              style: TextStyle(
                                height: 1.15,
                                color: Colors.blueGrey[700],
                                fontSize: 13,
                              ),
                            ),
                    ),
                  ],
                ),
              ),
              // 构建卡片底部信息
              _buildBottom()
            ],
          ),
        ),
      ),
    );
  }

  // 构建卡片底部信息
  Widget _buildBottom() {
    const paddingWidth = 10;
    return IconTheme(
      data: IconThemeData(
        color: Colors.grey,
        size: 15,
      ),
      child: DefaultTextStyle(
        style: TextStyle(color: Colors.grey, fontSize: 12),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Builder(builder: (context) {
            var children = <Widget>[
              Icon(Icons.star),
              Text(" " +
                  widget.repo.stargazers_count
                      .toString()
                      .padRight(paddingWidth)),
              Icon(Icons.info_outline),
              Text(" " +
                  widget.repo.open_issues_count
                      .toString()
                      .padRight(paddingWidth)),

              Icon(MyIcons.fork), //我们的自定义图标
              Text(widget.repo.forks_count.toString().padRight(paddingWidth)),
            ];

            if (widget.repo.fork) {
              children.add(Text("Forked".padRight(paddingWidth)));
            }

            if (widget.repo.private == true) {
              children.addAll(<Widget>[
                Icon(Icons.lock),
                Text(" private".padRight(paddingWidth))
              ]);
            }
            return Row(children: children);
          }),
        ),
      ),
    );
  }
}
```

上面代码有两点需要注意：

1. 在构建项目拥有者头像时调用了`gmAvatar(…)`方法，该方法是是一个全局工具函数，专门用于获取头像图片，实现如下：

   ```dart
   Widget gmAvatar(String url, {
     double width = 30,
     double height,
     BoxFit fit,
     BorderRadius borderRadius,
   }) {
     var placeholder = Image.asset(
         "imgs/avatar-default.png", //头像占位图，加载过程中显示
         width: width,
         height: height
     );
     return ClipRRect(
       borderRadius: borderRadius ?? BorderRadius.circular(2),
       child: CachedNetworkImage( 
         imageUrl: url,
         width: width,
         height: height,
         fit: fit,
         placeholder: (context, url) =>placeholder,
         errorWidget: (context, url, error) =>placeholder,
       ),
     );
   }
   ```

   代码中调用了`CachedNetworkImage` 是cached_network_image包中提供的一个Widget，它不仅可以在图片加载过程中指定一个占位图，而且还可以对网络请求的图片进行缓存，更多详情读者可以自行查阅其文档。

2. 由于Flutter 的Material 图标库中没有fork图标，所以我们在iconfont.cn上找了一个fork图标，然后根据”图片和Icon“一节中介绍的使用自定义字体图标的方法集成到了我们的项目中。

## 抽屉菜单

抽屉菜单分为两部分：顶部头像和底部功能菜单项，代码如下：

```dart
class MyDrawer extends StatelessWidget {
  const MyDrawer({
    Key key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      //移除顶部padding
      child: MediaQuery.removePadding(
        context: context,
        removeTop: true,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            _buildHeader(), //构建抽屉菜单头部
            Expanded(child: _buildMenus()), //构建功能菜单
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Consumer<UserModel>(
      builder: (BuildContext context, UserModel value, Widget child) {
        return GestureDetector(
          child: Container(
            color: Theme.of(context).primaryColor,
            padding: EdgeInsets.only(top: 40, bottom: 20),
            child: Row(
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: ClipOval(
                    // 如果已登录，则显示用户头像；若未登录，则显示默认头像
                    child: value.isLogin
                        ? gmAvatar(value.user.avatar_url, width: 80)
                        : Image.asset(
                            "imgs/avatar-default.png",
                            width: 80,
                          ),
                  ),
                ),
                Text(
                  value.isLogin
                      ? value.user.login
                      : GmLocalizations.of(context).login,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                )
              ],
            ),
          ),
          onTap: () {
            if (!value.isLogin) Navigator.of(context).pushNamed("login");
          },
        );
      },
    );
  }

  // 构建菜单项
  Widget _buildMenus() {
    return Consumer<UserModel>(
      builder: (BuildContext context, UserModel userModel, Widget child) {
        var gm = GmLocalizations.of(context);
        return ListView(
          children: <Widget>[
            ListTile(
              leading: const Icon(Icons.color_lens),
              title: Text(gm.theme),
              onTap: () => Navigator.pushNamed(context, "themes"),
            ),
            ListTile(
              leading: const Icon(Icons.language),
              title: Text(gm.language),
              onTap: () => Navigator.pushNamed(context, "language"),
            ),
            if(userModel.isLogin) ListTile(
              leading: const Icon(Icons.power_settings_new),
              title: Text(gm.logout),
              onTap: () {
                showDialog(
                  context: context,
                  builder: (ctx) {
                    //退出账号前先弹二次确认窗
                    return AlertDialog(
                      content: Text(gm.logoutTip),
                      actions: <Widget>[
                        FlatButton(
                          child: Text(gm.cancel),
                          onPressed: () => Navigator.pop(context),
                        ),
                        FlatButton(
                          child: Text(gm.yes),
                          onPressed: () {
                            //该赋值语句会触发MaterialApp rebuild
                            userModel.user = null;
                            Navigator.pop(context);
                          },
                        ),
                      ],
                    );
                  },
                );
              },
            ),
          ],
        );
      },
    );
  }
}
```

当用户未登录，则抽屉菜单顶部会显示一个默认的灰色占位图，若用户已登录，则会显示用户的头像。抽屉菜单底部有”换肤“和”语言“两个固定菜单，若用户已登录，则会多一个”注销“菜单。用户点击”换肤“和”语言“两个菜单项，会进入相应的设置页面；用户点击”注销“，`userModel.user` 会被置空，此时所有依赖`userModel`的Widget都会被`rebuild`，如主页会恢复成未登录的状态。

# 登录页

登录页实现通过用户名和密码登录，有四点需要注意：

1. 可以自动填充上次登录的用户名（如果有）
2. 为了防止密码输入错误，密码框应该有开关可以看明文
3. 用户名或密码字段在调用登录接口前有本地合法性校验（比如不能为空）
4. 登录成功后需更新用户信息

实现代码如下：

```dart
import '../index.dart';

class LoginRoute extends StatefulWidget {
  @override
  _LoginRouteState createState() => _LoginRouteState();
}

class _LoginRouteState extends State<LoginRoute> {
  TextEditingController _unameController = new TextEditingController();
  TextEditingController _pwdController = new TextEditingController();
  bool pwdShow = false; //密码是否显示明文
  GlobalKey _formKey = new GlobalKey<FormState>();
  bool _nameAutoFocus = true;

  @override
  void initState() {
    // 自动填充上次登录的用户名，填充后将焦点定位到密码输入框
    _unameController.text = Global.profile.lastLogin;
    if (_unameController.text != null) {
      _nameAutoFocus = false;
    }
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var gm = GmLocalizations.of(context);
    return Scaffold(
      appBar: AppBar(title: Text(gm.login)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          autovalidate: true,
          child: Column(
            children: <Widget>[
              TextFormField(
                  autofocus: _nameAutoFocus,
                  controller: _unameController,
                  decoration: InputDecoration(
                    labelText: gm.userName,
                    hintText: gm.userNameOrEmail,
                    prefixIcon: Icon(Icons.person),
                  ),
                  // 校验用户名（不能为空）
                  validator: (v) {
                    return v.trim().isNotEmpty ? null : gm.userNameRequired;
                  }),
              TextFormField(
                controller: _pwdController,
                autofocus: !_nameAutoFocus,
                decoration: InputDecoration(
                    labelText: gm.password,
                    hintText: gm.password,
                    prefixIcon: Icon(Icons.lock),
                    suffixIcon: IconButton(
                      icon: Icon(
                          pwdShow ? Icons.visibility_off : Icons.visibility),
                      onPressed: () {
                        setState(() {
                          pwdShow = !pwdShow;
                        });
                      },
                    )),
                obscureText: !pwdShow,
                //校验密码（不能为空）
                validator: (v) {
                  return v.trim().isNotEmpty ? null : gm.passwordRequired;
                },
              ),
              Padding(
                padding: const EdgeInsets.only(top: 25),
                child: ConstrainedBox(
                  constraints: BoxConstraints.expand(height: 55.0),
                  child: RaisedButton(
                    color: Theme.of(context).primaryColor,
                    onPressed: _onLogin,
                    textColor: Colors.white,
                    child: Text(gm.login),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _onLogin() async {
    // 提交前，先验证各个表单字段是否合法
    if ((_formKey.currentState as FormState).validate()) {
      showLoading(context);
      User user;
      try {
        user = await Git(context).login(_unameController.text, _pwdController.text);
        // 因为登录页返回后，首页会build，所以我们传false，更新user后不触发更新
        Provider.of<UserModel>(context, listen: false).user = user;
      } catch (e) {
        //登录失败则提示
        if (e.response?.statusCode == 401) {
          showToast(GmLocalizations.of(context).userNameOrPasswordWrong);
        } else {
          showToast(e.toString());
        }
      } finally {
        // 隐藏loading框
        Navigator.of(context).pop();
      }
      if (user != null) {
        // 返回
        Navigator.of(context).pop();
      }
    }
  }
}
```



# 多语言和多主题

本实例APP中语言和主题都是可以设置的，而两者都是通过`ChangeNotifierProvider`来实现的：我们在`main`函数中使用了`Consumer2`，依赖了`ThemeModel`和`LocaleModel`，因此，当我们在语言和主题设置页更该当前的配置后，`Consumer2`的`builder`都会重新执行，构建一个新的`MaterialApp`，所以修改会立即生效。下面看一下语言和主题设置页的实现。

## APP语言选择页

APP语言选择页提供三个选项：中文简体、美国英语、跟随系统。我们将当前APP使用的语言高亮显示，并且在后面添加一个”对号“图标，实现如下：

```dart
class LanguageRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var color = Theme.of(context).primaryColor;
    var localeModel = Provider.of<LocaleModel>(context);
    var gm = GmLocalizations.of(context);
    //构建语言选择项
    Widget _buildLanguageItem(String lan, value) {
      return ListTile(
        title: Text(
          lan,
          // 对APP当前语言进行高亮显示
          style: TextStyle(color: localeModel.locale == value ? color : null),
        ),
        trailing:
            localeModel.locale == value ? Icon(Icons.done, color: color) : null,
        onTap: () {
          // 更新locale后MaterialApp会重新build
          localeModel.locale = value;
        },
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(gm.language),
      ),
      body: ListView(
        children: <Widget>[
          _buildLanguageItem("中文简体", "zh_CN"),
          _buildLanguageItem("English", "en_US"),
          _buildLanguageItem(gm.auto, null),
        ],
      ),
    );
  }
}
```

上面代码逻辑很简单，唯一需要注意的是我们在`build(…)`方法里面定义了`_buildLanguageItem(…)`方法，它和在`LanguageRoute`类中定义该方法的区别就在于：在`build(…)`内定义的方法可以共享`build(...)`方法上下文中的变量，本例中是共享了`localeModel`。当然，如果`_buildLanguageItem(…)`的实现复杂一些的话不建议这样做，此时最好是将其作为`LanguageRoute`类的方法。该页面运行效果如下：





## 主题选择页

一个完整的主题`Theme`包括很多选项，这些选项在`ThemeData`中定义。本实例为了简单起见，我们只配置主题颜色。我们提供几种默认预定义的主题色供用户选择，用户点击一种色块后则更新主题。主题选择页的实现代码如下：

```dart
class ThemeChangeRoute extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(GmLocalizations.of(context).theme),
      ),
      body: ListView( //显示主题色块
        children: Global.themes.map<Widget>((e) {
          return GestureDetector(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 16),
              child: Container(
                color: e,
                height: 40,
              ),
            ),
            onTap: () {
              //主题更新后，MaterialApp会重新build
              Provider.of<ThemeModel>(context).theme = e;
            },
          );
        }).toList(),
      ),
    );
  }
}
```

运行效果如下：

