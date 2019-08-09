# 容器类Widget

容器类Widget和布局类Widget都作用于其子Widget，不同的是：

- 布局类Widget一般都需要接收一个widget数组（children），他们直接或间接继承自（或包含）MultiChildRenderObjectWidget ；而容器类Widget一般只需要接收一个子Widget（child），他们直接或间接继承自（或包含）SingleChildRenderObjectWidget。
- 布局类Widget是按照一定的排列方式来对其子Widget进行排列；而容器类Widget一般只是包装其子Widget，对其添加一些修饰（补白或背景色等）、变换(旋转或剪裁等)、或限制(大小等)。

注意，Flutter官方并没有对Widget进行官方分类，我们对其分类主要是为了方便讨论和对Widget功能区分的记忆。

## 本章目录

* [5.1：填充（Padding）](padding.md)
* [5.2：尺寸限制类容器（ConstrainedBox等）](constrainedbox_and_sizebox.md)
* [5.3：装饰容器（DecoratedBox）](decoratedbox.md)      
* [5.4：变换（Transform）](transform.md) 
* [5.5：Container容器](container.md) 
* [5.6：Scaffold、TabBar、底部导航](material_scaffold.md) 
* [5.7：剪裁（Clip）](clip.md) 
