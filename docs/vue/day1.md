---
title: Vue.js-Day1
---

# Vue.js-Day1

## 框架和库的区别
  +  框架：是一套完整的解决方案；对项目的侵入性较大，项目如果需要更换框架，则需要重新架构整个项目。
        node 中的 express；
   + 库（插件）：提供某一个小功能，对项目的侵入性较小，如果某个库无法完成某些需求，可以很容易切换到其它库实现需求。
       -    -1. 从jQuery 切换到 Zepto
       -    -2. 从 EJS 切换到 art-template
## 后端中的 MVC 与 前端中的 MVVM 之间的区别

+ MVC 是后端的分层开发概念；
    - M层只负责操作数据
    - C层负责处理路由和业务逻辑
    - V视图层
+  MVVM是前端视图层的概念，主要关注于 视图层分离，也就是说：MVVM把前端的视图层，分为了 三部分
    - Model 页面中要渲染的数据
    - View  页面中用来展示数据的DOM元素
    - VM ViewModel 是MVVM思想的核心，它是调度者，用来联系M层和V层，实现双向数据绑定
+ 通过VM层将M层的数据直接渲染到V层，当V层的数据改变，在通过VM层自动地将改变的数据同步到M层，MVVM相比于MVC，提供了双向数据绑定的机制   

## 体验vue并了解MVVM
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- 1.在页面中引入Vue的包 -->
    <script src="./lib/vue.js"></script>
</head>

<body>
    <!-- 2.创建一个容器，使用Vue就可以控制这个指定容器中的所有DOM元素 -->
    <div id="app">
        <p>{{msg}}</p>
    </div>
    <script>
        //这里new Vue 得到的vm实例就是MVVM中的核心VM，提供了双向数据绑定的能力
        const vm = new Vue({
            el: '#app', //指定当前要创建的这个vm实例，要控制页面上的哪个区域 此处el属性指定的元素就是MVVM中的V视图层
            data: { //data是一个对象，表示我们要渲染的一些数据 这里的data属性就是MVVM中的M视图数据层
                msg: '这是使用Vue要渲染的数据，我们并没有操作DOM元素'
            }
        })
    </script>
</body>

</html>
```
## 插值表达式和v-text的区别
 1. 使用插值表达式，当加载速度慢时，会存在内容闪烁的问题,但是 `v-text`没有闪烁的问题
 2. 在插值表达式中，可以使用`v-cloak`解决闪烁的问题,`v-cloak`当页面内容都被渲染完成后会被移除,我们通过属性选择器[v-cloak]{display:none}解决闪烁问题
 3. 插值表达式只会插入内容,并不会清除其余的内容; `v-text` 会把元素中之前的内容都清空!

## Vue指令之`v-text`和`v-html`
 1. v-text和{{}}表达式渲染数据，不解析标签。

 2. v-html不仅可以渲染数据，而且可以解析标签。

## Vue指令之`v-bind`的三种用法

   1. 直接使用指令v-bind,可以为元素的属性绑定绑定一些数据
   2. 使用简化指令:
   3. 在绑定的时候，拼接绑定内容：:title="btnTitle + ', 这是追加的内容'"

## Vue指令之v-on和跑马灯效果
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <input type="button" value="开始" @click="start">
        <input type="button" value="停止" @click="stop">

        <h3>{{msg}}</h3>
    </div>
    <script src="./lib/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                msg: '我拿BUFF,谢谢!',
                intervalId: null
            },
            methods: {

                start() {
                    // 如果定时器id不等于null，说明已经有定时器在执行了，此时直接return，这样就不会开启第二个定时器了
                    if (this.intervalId !== null) {
                        return
                    }
                    //跑马灯效果处理函数
                    // 思路:1.截取第一个字符，然后把字符放到末尾
                    // this,msg.substring(起始索引，结束索引[不包含结束的索引])
                    this.intervalId = setInterval(() => { //这里使用箭头函数，让this指向外部的this，也就是vm实例对象，用function的话this指向window，还得需要中间变量
                        const header = this.msg.substring(0, 1)
                        const body = this.msg.substring(1)
                        this.msg = body + header
                    }, 300);
                },
                stop() { //清除定时器
                    clearInterval(this.intervalId)
                        // 每当清除定时器之后，为了保证下次能够正常开启，将定时器id设置为null
                    this.intervalId = null
                }
            },
        })
    </script>
</body>

</html>   
```
## Vue指令之`v-model`
1. 在Vue中，只有`v-model`指令实现了数据的双向绑定，其他指令都是单向的，`v-bind`指令只能实现数据的单向绑定，从data自动同步到view上
2. `v-model` 只能应用在表单元素中 例：`input` `text` `redio` `checkbox` `textarea` `select`
## `v-model`指令实现简易计算器
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <input type="text" v-model="num1">
        <select v-model="opt">
       <option value="+">+</option>
       <option value="-">-</option>
       <option value="*">*</option>
       <option value="/">/</option>
   </select>
        <input type="text" v-model="num2">
        <input type="button" value="=" @click="calc">
        <input type="text" v-model="result">
    </div>
    <script src="./lib/vue.js"></script>
    <script>
        const app = new Vue({
            el: '#app',
            data: {
                num1: 0,
                opt: '+',
                num2: 0,
                result: 0
            },
            methods: {
                // 1.获取操作符
                // 2.获取num1和num2的值
                // 3.根据不同的操作符，计算两个值得结果，结果赋值给result
                calc() {
                    switch (this.opt) {
                        case '+':
                            this.result = parseFloat(this.num1) + parseFloat(this.num2)
                            break;
                        case '-':
                            this.result = parseFloat(this.num1) - parseFloat(this.num2)
                            break;
                        case '*':
                            this.result = parseFloat(this.num1) * parseFloat(this.num2)
                            break;
                        case '/':
                            this.result = parseFloat(this.num1) / parseFloat(this.num2)
                            break;
                    }
                }
            },
        })
    </script>
</body>

</html>
```
## 事件修饰符
   + .stop 阻止冒泡
   + .prevent 阻止默认事件
   + .capture 添加事件侦听器时使用事件捕获模式
   + .self 只当事件在该元素本身（比如不是子元素）触发时触发回调
   + .once 事件只触发一次

## 事件修饰符`.self` 和 `.stop`的区别
  +   .self只负责阻止自己的
  +   .stop阻止所有冒泡

## 在Vue中使用样式
### 使用class样式的四种方式
1. 数组
```html
<h1 :class="['red', 'thin']">这是一个邪恶的H1</h1>
```
2. 数组中使用三元表达式
```html
<h1 :class="['red', 'thin', isactive?'active':'']">这是一个邪恶的H1</h1>
// isactive 为 true 返回active这个类 ，false返回空字符串
```
3. 数组中嵌套对象
```html
<h1 :class="['red', 'thin', {'active': isactive}]">这是一个邪恶的H1</h1>
```
4. 直接使用对象
```html
<h1 :class="{red:true, italic:true, active:true, thin:true}">这是一个邪恶的H1</h1>
```
### 使用内联样式
1. 直接在元素上通过 `:style` 的形式，书写样式对象
```html
<h1 :style="{color: 'red', 'font-size': '40px'}">这是一个善良的H1</h1>
```
2. 将样式对象，定义到 data 中，并直接引用到 `:style `中
+ 在data上定义样式:
```javascript
data: {
   h1StyleObj: { color: 'red', 'font-size': '40px', 'font-weight': '200' }
}
```
## Vue指令之`v-for`和`key`属性
1. 迭代数组
```html
<ul>
  <li v-for="(item, i) in list">索引：{{i}} --- 姓名：{{item.name}} --- 年龄：{{item.age}}</li>
</ul>
```
2. 迭代对象中的属性
```html
<div v-for="(val, key, i) in userInfo">{{val}} --- {{key}} --- {{i}}</div>
```
3. 迭代数字
```html
<p v-for="i in 10">这是第 {{i}} 个P标签</p>
```
> 2.2.0+ 的版本里，**当组建中使用** `v-for`时，`:key`现在是必须的
+ 为了给Vue一个提示, **以便它能跟踪每个节点的身份，从而重用和重新排序现有元素**，我们需要为每项提供一个唯一`:key`属性
+ 涉及到了 `v-for`这种循环，给循环的每一项添加`:key`属性
+ 其中`:key`属性，只接受number或者string类型的数据，不可以指定对象，`:key`指定的值，必须具有唯一性
## Vue指令之`v-if`和`v-show`
+ `v-if`是实时的创建或者移除元素,`v-show`是通过为元素添加或移除内联样式{display:none}来实现元素的显示和隐藏
+ 作用都是根据指定的标识符来切换元素的显示与隐藏
+ 一般来说，`v-if`有更高的切换消耗而`v-show`有更高的初始渲染消耗。因此，如果需要频繁切换显示与隐藏`v-show`较好，如果在运行时条件不大可能改变`v-if`较好
## 手动实现筛选案例
+  筛选框绑定到 VM 实例中的 `searchName` 属性：
```html
<hr> 输入筛选名称：
<input type="text" v-model="searchName">
```
+ 在使用 `v-for` 指令循环每一行数据的时候，不再直接 `item in list`，而是 `in` 一个 过滤的`methods` 方法，同时，把过滤条件`searchName`传递进去：
```html
<tbody>
    <tr v-for="item in search(searchName)">
      <td>{{item.id}}</td>
      <td>{{item.name}}</td>
      <td>{{item.ctime}}</td>
      <td>
        <a href="#" @click.prevent="del(item.id)">删除</a>
      </td>
    </tr>
  </tbody>
  ```
+ `search` 过滤方法中，使用 数组的 `filter` 方法进行过滤：
```js
search(name) {
return this.list.filter(x => {
  return x.name.indexOf(name) != -1;
});
}
```
## 过滤器
> 概念：Vue.js 允许你自定义过滤器，可被用作一些常见的文本格式化。过滤器可以用在两个地方：mustache 插值和 v-bind 表达式。过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”符指示；

### 全局过滤器
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="app">
        {{new Date()|dataFormat}}
        <p :title="new Date()|dataFormat">{{new Date()|dataFormat}}</p>
        {{new Date()|dataFormat('yyyy-mm-dd')}}
    </div>
    <script src="./lib/vue.js"></script>
    <script>
        Vue.filter('dataFormat', function(input, pattern = '') {
            var dt = new Date(input);
            // 获取年月日
            var y = dt.getFullYear();
            var m = (dt.getMonth() + 1).toString().padStart(2, '0');
            var d = dt.getDate().toString().padStart(2, '0');

            // 如果 传递进来的字符串类型，转为小写之后，等于 yyyy-mm-dd，那么就返回 年-月-日
            // 否则，就返回  年-月-日 时：分：秒
            if (pattern.toLowerCase() === 'yyyy-mm-dd') {
                return `${y}-${m}-${d}`;
            } else {
                // 获取时分秒
                var hh = dt.getHours().toString().padStart(2, '0');
                var mm = dt.getMinutes().toString().padStart(2, '0');
                var ss = dt.getSeconds().toString().padStart(2, '0');

                return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
            }
        });

        const app = new Vue({
            el: '#app',
            data: {
                message: 'hello world'
            }
        })
    </script>

</body>

</html>
```
> 过滤器的使用注意事项
> 1.Vue.filter('过滤器的名称'，'过滤器的处理函数')
> 2.过滤器处理函数中，第一个形参，功能已经被规定好了，永远都是管道符前面的值
> 3.调用过滤器   {{new Date()|dataFormat}} 
> 4.在调用过滤器的时候可以传递参数 {{new Date()|dataFormat('yyyy-mm-dd')}}
> 5.过滤器的处理函数中，必须返回一个值
> 6.可以连续使用管道符，调用多个过滤器，最终输出结果以最后一个过滤器为准
> 7.过滤器只能使用在插值表达式或者`v-bind`中，不能使用在其他地方，`v-text`不支持过滤器