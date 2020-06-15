# 11.6 使用 Socket API

我们之前介绍的 Http 协议和 WebSocket 协议都属于应用层协议，除了它们，应用层协议还有很多如：SMTP、FTP 等，这些应用层协议的实现都是通过 Socket API 来实现的。其实，操作系统中提供的原生网络请求 API 是标准的，在 C 语言的 Socket 库中，它主要提供了端到端建立链接和发送数据的基础 API，而高级编程语言中的 Socket 库其实都是对操作系统的 socket API 的一个封装。所以，如果我们需要自定义协议或者想直接来控制管理网络链接、又或者我们觉得自带的 HttpClient 不好用想重新实现一个，这时我们就需要使用 Socket。Flutter 的 Socket API 在 dart：io 包中，下面我们看一个使用 Socket 实现简单 http 请求的示例，以请求百度首页为例：

```dart
_request() async{
  //建立连接
  var socket=await Socket.connect("baidu.com", 80);
  //根据http协议，发送请求头
  socket.writeln("GET / HTTP/1.1");
  socket.writeln("Host:baidu.com");
  socket.writeln("Connection:close");
  socket.writeln();
  await socket.flush(); //发送
  //读取返回内容
  _response =await socket.transform(utf8.decoder).join();
  await socket.close();
}
```

可以看到，使用 Socket 需要我们自己实现 Http 协议（需要自己实现和服务器的通信过程），本例只是一个简单示例，没有处理重定向、cookie 等。本示例完整代码参考示例 demo，运行后效果如图 11-2 所示：

![图11-2](../imgs/11-2.png)

可以看到响应内容分两个部分，第一部分是响应头，第二部分是响应体，服务端可以根据请求信息动态来输出响应体。由于本示例请求头比较简单，所以响应体和浏览器中访问的会有差别，读者可以补充一些请求头(如 user-agent)来看看输出的变化。
