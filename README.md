### 一：创建虚拟dom

> 利用 `create-react-app`快速创建一个项目模板；

> 删掉src下的源文件，替换成 index.js

首先我们先要用一个对象定义一个虚拟DOM的数据结构：

```
Element {
    type: 'ul',
    props: {
        class: 'list'
    },
    children: [
        Element{
![](https://user-gold-cdn.xitu.io/2018/11/3/166d7c81f1341d71?w=2956&h=992&f=png&s=271739)
            type: 'li',
            props: {
                class: 'item'
            },
            children: ['a']
        }
    ]
}
```

开始码代码。

!['虚拟DOM结构'](https://user-gold-cdn.xitu.io/2018/11/3/166d7c8c5aa6083b?w=2956&h=992&f=png&s=271739)
浏览器上查看打印的日志信息，如下：

![](https://user-gold-cdn.xitu.io/2018/11/3/166d7ca53ba8fef7?w=1210&h=410&f=png&s=97781)

既然虚拟DOM方法已经写好，下一步就要将这个虚拟dom插入到页面中，那我们可以专门写一个渲染真实节点的方法`render`

先遍历最外层`ul`的`type`和`props`两个属性


![render](https://user-gold-cdn.xitu.io/2018/11/3/166d7e8001b419a3?w=2568&h=1244&f=png&s=359336)


![](https://user-gold-cdn.xitu.io/2018/11/3/166d7e9fddde1a34?w=1078&h=128&f=png&s=25171)

注意：`input`标签的`value`属性 还有所有标签的`style`属性

好了，接下来就是继续遍历`children`属性，此时`children`会有两种情况

1. 文本 直接插入；
2. 还有子元素，递归遍历直到最终的结果是文本；   

![](https://user-gold-cdn.xitu.io/2018/11/3/166d7f0b58ed9735?w=1036&h=484&f=png&s=95541)
![](https://user-gold-cdn.xitu.io/2018/11/3/166d7f0d50748a42?w=676&h=198&f=png&s=31439)

下一步我们将这个元素插入到页面中


![](https://user-gold-cdn.xitu.io/2018/11/3/166d8078bce16225?w=2988&h=774&f=png&s=270016)
![](https://user-gold-cdn.xitu.io/2018/11/3/166d805dec820f97?w=1120&h=862&f=png&s=112852)

大功告成～

---

### 二：实现dom-diff算法

`dom-diff`算法就是在两棵抽象语法树的同一位置处进行比较，采用深度优先算法，用补丁的形式记录需要更新的节点位置。

若`type`不一致直接替换当前节点以及当前节点下的子节点；
如果两个父节点一致，则从左往后遍历子节点，若子节点一致，遍历子节点下的子节点，依次递归。

补丁包的定义规则如下：

    1. 节点类型相同，比较属性，若属性不同（type: 'ATTRS', attrs: { class: 'lists'
    }）
    2. 新的节点被删除了 （type: 'REMOVE', index: xxxx）
    3. 节点类型不同 （type: 'REPLACE', newNode）
    4. 仅仅是文本变化（type: 'TEXT', text）
    

新建一个`dom-diff.js`，专门处理`diff`算法

手动调用`diff`方法
![](https://user-gold-cdn.xitu.io/2018/11/4/166dca2bb160a860?w=1642&h=1154&f=png&s=295840)

先处理`type`相同，属性不同的情况。

![](https://user-gold-cdn.xitu.io/2018/11/4/166dca2da79ddd4a?w=1240&h=1688&f=png&s=288100)

![](https://user-gold-cdn.xitu.io/2018/11/4/166dca49d1e2ece5?w=1158&h=420&f=png&s=70893)

发现控制台已经打印到属性变化的补丁包，最后我们把属性的小补丁包存放到最外层的大补丁包中

```
// 补丁包 存放两个虚拟dom的差异部分
let paths = {}
// 放到最外层的大补丁包中
if (currentPatchs.length > 0) {
  paths[index] = currentPatchs
}
```

好了 相同类型的父节点一样，在属性比较完成之后，就需要比较`children`的属性是否有变化
比较children下的属性是否变化，利用递归去遍历

```
let globalIndex = 0

function diffChildren (oldChildrens, newChildrens) {
  oldChildrens.forEach((child, idx) => {
    walk(child, newChildrens[idx], ++globalIndex)
  })
}
```

如果一开始`type`类型不相同不需要再去比较，直接用新节点替换老节点即可；

```
// type不一致
    currentPatchs.push({
      type: TYPES.REPLACE,
      newNode: newTree
    })
```

处理好各种情况，比如：新节点不存在的情况，新节点增加，新节点类型改变，新节点文本改变以及新节点的属性变化等情况；

最终拿到所有与旧节点有差异的对象放入patchs这样的一个补丁对象中。


![](https://user-gold-cdn.xitu.io/2018/11/4/166dde85f556609a?w=1432&h=1092&f=png&s=211043)

---

最后一步将补丁的差异对象与现有虚拟DOM节点遍历进行一一比较与替换。


![](https://user-gold-cdn.xitu.io/2018/11/4/166ddee92a1a76de?w=1098&h=426&f=png&s=61221)

![](https://user-gold-cdn.xitu.io/2018/11/4/166ddeed8a40ba8c?w=1096&h=1094&f=png&s=175704)

![](https://user-gold-cdn.xitu.io/2018/11/4/166ddf0cc87aaa5d?w=1248&h=1138&f=png&s=192351)

![](https://user-gold-cdn.xitu.io/2018/11/4/166ddf097e341aaf?w=1006&h=1032&f=png&s=120960)

大功告成！

---

这只是diff算法的一个简易实现，还存在一些复杂情况处理的情况以及还有很多算法上面优化的方案，不过已经让我们大概了解了`diff`算法的原理。

具体代码可以参考github链接查看：

