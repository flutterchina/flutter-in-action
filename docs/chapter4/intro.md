# 4.1 布局类组件简介

布局类组件都会包含一个或多个子组件，不同的布局类组件对子组件排版(layout)方式不同。我们在前面说过`Element`树才是最终的绘制树，`Element`树是通过 Widget 树来创建的（通过`Widget.createElement()`），Widget 其实就是 Element 的配置数据。在 Flutter 中，根据 Widget 是否需要包含子节点将 Widget 分为了三类，分别对应三种 Element，如下表：

| Widget                        | 对应的 Element                 | 用途                                                                                          |
| ----------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| LeafRenderObjectWidget        | LeafRenderObjectElement        | Widget 树的叶子节点，用于没有子节点的 widget，通常基础组件都属于这一类，如 Image。            |
| SingleChildRenderObjectWidget | SingleChildRenderObjectElement | 包含一个子 Widget，如：ConstrainedBox、DecoratedBox 等                                        |
| MultiChildRenderObjectWidget  | MultiChildRenderObjectElement  | 包含多个子 Widget，一般都有一个 children 参数，接受一个 Widget 数组。如 Row、Column、Stack 等 |

> 注意，Flutter 中的很多 Widget 是直接继承自 StatelessWidget 或 StatefulWidget，然后在`build()`方法中构建真正的 RenderObjectWidget，如 Text，它其实是继承自 StatelessWidget，然后在`build()`方法中通过 RichText 来构建其子树，而 RichText 才是继承自 MultiChildRenderObjectWidget。所以为了方便叙述，我们也可以直接说 Text 属于 MultiChildRenderObjectWidget（其它 widget 也可以这么描述），这才是本质。读到这里我们也会发现，其实**StatelessWidget 和 StatefulWidget 就是两个用于组合 Widget 的基类，它们本身并不关联最终的渲染对象（RenderObjectWidget）**。

布局类组件就是指直接或间接继承(包含)`MultiChildRenderObjectWidget`的 Widget，它们一般都会有一个`children`属性用于接收子 Widget。我们看一下继承关系 Widget > RenderObjectWidget > (Leaf/SingleChild/MultiChild)RenderObjectWidget 。

`RenderObjectWidget`类中定义了创建、更新`RenderObject`的方法，子类必须实现他们，关于`RenderObject`我们现在只需要知道它是最终布局、渲染 UI 界面的对象即可，也就是说，对于布局类组件来说，其布局算法都是通过对应的`RenderObject`对象来实现的，所以读者如果对接下来介绍的某个布局类组件的原理感兴趣，可以查看其对应的`RenderObject`的实现，比如`Stack`（层叠布局）对应的`RenderObject`对象就是`RenderStack`，而层叠布局的实现就在`RenderStack`中。

在本章中，为了让读者对布局类 Widget 有个快速的认识，所以我们并不会深入到`RenderObject`的细节中去。在学习本章时，读者的重点是掌握不同布局组件的布局特点，具体原理和细节等我们对 Flutter 整体入门后，感兴趣的话再去研究。
