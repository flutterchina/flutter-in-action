# 6.1 可滚动组件简介

当组件内容超过当前显示视口(ViewPort)时，如果没有特殊处理，Flutter 则会提示 Overflow 错误。为此，Flutter 提供了多种可滚动组件（Scrollable Widget）用于显示列表和长布局。在本章中，我们先介绍一下常用的可滚动组件（如`ListView`、`GridView`等），然后介绍一下`ScrollController`。可滚动组件都直接或间接包含一个`Scrollable`组件，因此它们包括一些共同的属性，为了避免重复介绍，我们在此统一介绍一下：

```dart
Scrollable({
  ...
  this.axisDirection = AxisDirection.down,
  this.controller,
  this.physics,
  @required this.viewportBuilder, //后面介绍
})
```

- `axisDirection`滚动方向。
- `physics`：此属性接受一个`ScrollPhysics`类型的对象，它决定可滚动组件如何响应用户操作，比如用户滑动完抬起手指后，继续执行动画；或者滑动到边界时，如何显示。默认情况下，Flutter 会根据具体平台分别使用不同的`ScrollPhysics`对象，应用不同的显示效果，如当滑动到边界时，继续拖动的话，在 iOS 上会出现弹性效果，而在 Android 上会出现微光效果。如果你想在所有平台下使用同一种效果，可以显式指定一个固定的`ScrollPhysics`，Flutter SDK 中包含了两个`ScrollPhysics`的子类，他们可以直接使用：
  - `ClampingScrollPhysics`：Android 下微光效果。
  - `BouncingScrollPhysics`：iOS 下弹性效果。
- `controller`：此属性接受一个`ScrollController`对象。`ScrollController`的主要作用是控制滚动位置和监听滚动事件。默认情况下，Widget 树中会有一个默认的`PrimaryScrollController`，如果子树中的可滚动组件没有显式的指定`controller`，并且`primary`属性值为`true`时（默认就为`true`），可滚动组件会使用这个默认的`PrimaryScrollController`。这种机制带来的好处是父组件可以控制子树中可滚动组件的滚动行为，例如，`Scaffold`正是使用这种机制在 iOS 中实现了点击导航栏回到顶部的功能。我们将在本章后面“滚动控制”一节详细介绍`ScrollController`。

### Scrollbar

`Scrollbar`是一个 Material 风格的滚动指示器（滚动条），如果要给可滚动组件添加滚动条，只需将`Scrollbar`作为可滚动组件的任意一个父级组件即可，如：

```dart
Scrollbar(
  child: SingleChildScrollView(
    ...
  ),
);
```

`Scrollbar`和`CupertinoScrollbar`都是通过监听滚动通知来确定滚动条位置的。关于的滚动通知的详细内容我们将在本章最后一节中专门介绍。

#### CupertinoScrollbar

`CupertinoScrollbar`是 iOS 风格的滚动条，如果你使用的是`Scrollbar`，那么在 iOS 平台它会自动切换为`CupertinoScrollbar`。

### ViewPort 视口

在很多布局系统中都有 ViewPort 的概念，在 Flutter 中，术语 ViewPort（视口），如无特别说明，则是指一个 Widget 的实际显示区域。例如，一个`ListView`的显示区域高度是 800 像素，虽然其列表项总高度可能远远超过 800 像素，但是其 ViewPort 仍然是 800 像素。

### 基于 Sliver 的延迟构建

通常可滚动组件的子组件可能会非常多、占用的总高度也会非常大；如果要一次性将子组件全部构建出将会非常昂贵！为此，Flutter 中提出一个 Sliver（中文为“薄片”的意思）概念，如果一个可滚动组件支持 Sliver 模型，那么该滚动可以将子组件分成好多个“薄片”（Sliver），只有当 Sliver 出现在视口中时才会去构建它，这种模型也称为“基于 Sliver 的延迟构建模型”。可滚动组件中有很多都支持基于 Sliver 的延迟构建模型，如`ListView`、`GridView`，但是也有不支持该模型的，如`SingleChildScrollView`。

### 主轴和纵轴

在可滚动组件的坐标描述中，通常将滚动方向称为主轴，非滚动方向称为纵轴。由于可滚动组件的默认方向一般都是沿垂直方向，所以默认情况下主轴就是指垂直方向，水平方向同理。
