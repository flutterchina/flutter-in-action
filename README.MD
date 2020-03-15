# 简介

本项目为Flutter中文网《Flutter实战》开源电子书项目，官网地址为：https://book.flutterchina.club 。

本书随书源码：https://github.com/wendux/flutter_in_action_source_code

## 实体书
<div style="text-align:center; padding-bottom:30px"><a href="https://item.jd.com/12816296.html" title='点击购买'><img height="250" style="box-shadow: #aaa 5px 5px 10px;" src="https://pcdn.flutterchina.club/imgs/book.png"/></a>  <br/> <a class="buy-btn" href="https://item.jd.com/12816296.html" title='点击购买'> 购买实体书 </a></div>



## 贡献须知

本书目前仍在创作中，如果您想参与到本书创作，欢迎提PR。本书目录结构如下：

| 目录及文件      | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| docs            | 文档目录，您应该在此目录下对应的章节文件夹下修改/创建Markdown文档 |
| _book           | 打包后的网站代码目录，您不应该手动修改此目录下的文档         |
| docs/SUMMARY.md | 本书目录，要修改目录请参考本文档中前面章节。                 |
| docs/imgs       | 本书所引的图片、截图目录                                     |

### 图片引入说明

为了后续图片能够容易上CDN，如果您需要在文档中引入新的图片，请按如下步骤操作：

1. 将您的图片大小进行调整，有一个要求是图片高度最大不能超过500像素，原则上单张图片最大不能超过300K.

2. 将图片拷贝到docs/imgs目录，注意不要重名

3. 在你的文章中用**相对路径**引用，如：

   ```
   ![](../imgs/xx.jpg)
   ```

当您提交内容被合入后，我们会来上传CDN，自动替换图片链接，然后回提到仓库中，在您下次提交之前，您需要先pull一下变更。

### 构建环境搭建

本书是采用gitbook编写，要想在本地运行网站，需要安装一下环境：

1. 安装node；如果已经安装过node，可以省略这一步。node安装方法自行百度。

2. 安装gitbook。

   ```shell
   npm i -g gitbook-cli
   ```

3. 本地进入到本项目根目录，运行：

   ```shell
   gitbook install #安装本书构建所要依赖的插件
   ```

4. 运行网站，可以编辑了~

   ```
   gitbook serve 
   ```

### 哪些章节还没有写？

本书目前未完成部分在官网目录中会置灰，他们会统一链接到一个todo页面，您应该首先来写这一部分主题。如果您有新的章节想补充，请先联系我！沟通后如果觉得有必要方可添加。

### 提交更新

为了保证书籍质量，提交后的内容都需要Review，所以您PR提交之后离正式合入可能会需要多次修改，为了节省时间，请在提交PR后的第一时间通知我Review。

## 勘误

如果您发现本书的错误，欢迎PR。

## 联系方式

微信号：Demons-du

## 免费？

知识是应该付费的，创作不易，开源不等于免费，如果您是本书读者并手头宽裕，可以微信扫描下面二维码打赏，也不用太多，够买一杯咖啡就行。当然，如果您囊中羞涩，您也可以阅读本书，但我对您有个小小的要求，希望您在阅读的过程中能积极参与到本书的纠错以及未完成内容的创作上来，也算是有所付出。

![](https://cdn.jsdelivr.net/gh/flutterchina/flutter-in-action@1.0.3/docs/imgs/pay.jpeg)

