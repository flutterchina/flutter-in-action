# 10.1 自定义组件方法简介

当Flutter提供的现有组件无法满足我们的需求，或者我们为了共享代码需要封装一些通用组件，这时我们就需要自定义组件。在Flutter中自定义组件有三种方式：通过组合其它组件、自绘和实现RenderObject。本节我们先分别介绍一下这三种方式的特点，后面章节中则详细介绍它们的细节。

### 组合其它Widget

这种方式是通过拼装其它组件来组合成一个新的组件。例如我们之前介绍的`Container`就是一个组合组件，它是由`DecoratedBox`、`ConstrainedBox`、`Transform`、`Padding`、`Align`等组件组成。

在Flutter中，组合的思想非常重要，Flutter提供了非常多的基础组件，而我们的界面开发其实就是按照需要组合这些组件来实现各种不同的布局而已。 

### 自绘

如果遇到无法通过现有的组件来实现需要的UI时，我们可以通过自绘组件的方式来实现，例如我们需要一个颜色渐变的圆形进度条，而Flutter提供的`CircularProgressIndicator`并不支持在显示精确进度时对进度条应用渐变色（其`valueColor` 属性只支持执行旋转动画时变化Indicator的颜色），这时最好的方法就是通过自定义组件来绘制出我们期望的外观。我们可以通过Flutter中提供的`CustomPaint`和`Canvas`来实现UI自绘。



### 实现RenderObject

Flutter提供的自身具有UI外观的组件，如文本`Text`、`Image`都是通过相应的`RenderObject`（我们将在“Flutter核心原理”一章中详细介绍`RenderObject`）渲染出来的，如Text是由`RenderParagraph`渲染；而`Image`是由`RenderImage`渲染。`RenderObject`是一个抽象类，它定义了一个抽象方法`paint(...)`：

```dart
void paint(PaintingContext context, Offset offset)
```

`PaintingContext`代表组件的绘制上下文，通过`PaintingContext.canvas`可以获得`Canvas`，而绘制逻辑主要是通过`Canvas` API来实现。子类需要重写此方法以实现自身的绘制逻辑，如`RenderParagraph`需要实现文本绘制逻辑，而`RenderImage`需要实现图片绘制逻辑。

可以发现，`RenderObject`中最终也是通过`Canvas` API来绘制的，那么通过实现`RenderObject`的方式和上面介绍的通过`CustomPaint`和`Canvas`自绘的方式有什么区别？其实答案很简单，`CustomPaint`只是为了方便开发者封装的一个代理类，它直接继承自`SingleChildRenderObjectWidget`，通过`RenderCustomPaint`的`paint`方法将`Canvas`和画笔`Painter`(需要开发者实现，后面章节介绍)连接起来实现了最终的绘制（绘制逻辑在`Painter`中）。

### 总结

“组合”是自定义组件最简单的方法，在任何需要自定义组件的场景下，我们都应该优先考虑是否能够通过组合来实现。而自绘和通过实现`RenderObject`的方法本质上是一样的，都需要开发者调用`Canvas` API手动去绘制UI，优点是强大灵活，理论上可以实现任何外观的UI，而缺点是必须了解`Canvas` API细节，并且得自己去实现绘制逻辑。

在本章接下来的小节中，我们将通过一些实例来详细介绍自定义UI的过程，由于后两种方法本质是相同的，并且Flutter中很多基础组件都是通过`RenderObject`的形式来实现的，所以后续我们只介绍`CustomPaint`和`Canvas`的方式，读者如果对自定义`RenderObject`的方法好奇，可以查看Flutter中相关基础组件对应的`RenderObject`的实现源码，如`RenderParagraph`或`RenderImage`。
