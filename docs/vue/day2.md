---
title: Vue.js-Day2
---
# Vue.js-Day2

## 自定义指令
```js
 // 自定义全局指令 v-focus，为绑定的元素自动获取焦点：
 Vue.directive('focus', {
   inserted: function (el) { // inserted 表示被绑定元素插入父节点时调用
     el.focus();
   }
 });

 // 自定义局部指令 v-color 和 v-font-weight，为绑定的元素设置指定的字体颜色 和 字体粗细：
   directives: {
     color: { // 为元素设置指定的字体颜色
       bind(el, binding) {
         el.style.color = binding.value;
       }
     },
     'font-weight': function (el, binding2) { // 自定义指令的简写形式，等同于定义了 bind 和 update 两个钩子函数
       el.style.fontWeight = binding2.value;
     }
   }
   ```
## 按键修饰符的使用
+ 1.通过Vue.config.keyCodes.名称 = 按键值来自定义案件修饰符的别名：
```js
Vue.config.keyCodes.f2 = 113;
```
+ 2.使用自定义的按键修饰符：
```html
<input type="text" v-model="name" @keyup.f2="add">
```
## Vue实例的生命周期
![Vue实例的生命周期](docs\.vuepress\public\assets\img\lifecycle.png)
+   什么是生命周期：从Vue实例创建、运行、到销毁期间，总是伴随着各种各样的事件，这些事件，统称为生命周期！
+  生命周期钩子：就是生命周期事件的别名而已；
+  生命周期钩子 = 生命周期函数 = 生命周期事件
+   主要的生命周期函数分类：
     -   创建期间的生命周期函数：
           * beforeCreate：实例刚在内存中被创建出来，此时，还没有初始化好 data 和 methods 属性
           * created：实例已经在内存中创建OK，此时 data 和 methods 已经创建OK，此时还没有开始 编译模板
           * beforeMount：此时已经完成了模板的编译，但是还没有挂载到页面中
           * mounted：此时，已经将编译好的模板，挂载到了页面指定的容器中显示
      -  运行期间的生命周期函数：
           * beforeUpdate：状态更新之前执行此函数， 此时 data 中的状态值是最新的，但是界面上显示的 数据还是旧的，因为此时还没有开始重新渲染DOM节点
           * updated：实例更新完毕之后调用此函数，此时 data 中的状态值 和 界面上显示的数据，都已经完成了更新，界面已经被重新渲染好了！
       - 销毁期间的生命周期函数：
          *  beforeDestroy：实例销毁之前调用。在这一步，实例仍然完全可用。
         *   destroyed：Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

## vue-resource 实现 get, post, jsonp请求
+ 1.JSONP的实现原理
- 由于浏览器的安全性限制，不允许AJAX访问 协议不同、域名不同、端口号不同的 数据接口，浏览器认为这种访问不安全；

- 可以通过动态创建script标签的形式，把script标签的src属性，指向数据接口的地址，因为script标签不存在跨域限制，这种数据获取方式，称作JSONP（注意：根据JSONP的实现原理，知晓，JSONP只支持Get请求）；

- 具体实现过程： 
*     先在客户端定义一个回调方法，预定义对数据的操作；
* 再把这个回调方法的名称，通过URL传参的形式，提交到服务器的数据接口；
* 服务器数据接口组织好要发送给客户端的数据，再拿着客户端传递过来的回调方法名称，拼接出一个调用这个方法的字符串，发送给客户端去解析执行；
* 客户端拿到服务器返回的字符串之后，当作Script脚本去解析执行，这样就能够拿到JSONP的数据了；
- 通过 Node.js ，来手动实现一个JSONP的请求例子；
```js
const http = require('http');
// 导入解析 URL 地址的核心模块
const urlModule = require('url');

const server = http.createServer();
// 监听 服务器的 request 请求事件，处理每个请求
server.on('request', (req, res) => {
 const url = req.url;

 // 解析客户端请求的URL地址
 var info = urlModule.parse(url, true);

 // 如果请求的 URL 地址是 /getjsonp ，则表示要获取JSONP类型的数据
 if (info.pathname === '/getjsonp') {
   // 获取客户端指定的回调函数的名称
   var cbName = info.query.callback;
   // 手动拼接要返回给客户端的数据对象
   var data = {
     name: 'zs',
     age: 22,
     gender: '男',
     hobby: ['吃饭', '睡觉', '运动']
   }
   // 拼接出一个方法的调用，在调用这个方法的时候，把要发送给客户端的数据，序列化为字符串，作为参数传递给这个调用的方法：
   var result = `${cbName}(${JSON.stringify(data)})`;
   // 将拼接好的方法的调用，返回给客户端去解析执行
   res.end(result);
 } else {
   res.end('404');
 }
});

server.listen(3000, () => {
 console.log('server running at http://127.0.0.1:3000');
});
```
+ 2.发送get请求：
```js
getInfo() { // get 方式获取数据
this.$http.get('要请求的url地址').then(res => {
 console.log(res.body);
})
}
```
+ 3.发送post请求：
```js
postInfo() {
var url = '要请求的url地址';
// post 方法接收三个参数：
// 参数1： 要请求的URL地址
// 参数2： 要发送的数据对象
// 参数3： 指定post提交的编码类型为 application/x-www-form-urlencoded
this.$http.post(url, { name: 'zs' }, { emulateJSON: true }).then(res => {
 console.log(res.body);
});
}
```
+ 4.发送JSONP请求获取数据：
```js
jsonpInfo() { // JSONP形式从服务器获取数据
var url = '要请求的url地址';
this.$http.jsonp(url).then(res => {
 console.log(res.body);
});
}
```
## Vue 中的动画
> [Vue动画](https://cn.vuejs.org/v2/guide/transitions.html)
>> 动画能够提高用户体验，帮助用户更好的理解页面中的功能

### 使用过渡类名
1. html结构
```html
<div id="app">
 <input type="button" value="动起来" @click="myAnimate">
 <!-- 使用 transition 将需要过渡的元素包裹起来 -->
 <transition name="fade">
   <div v-show="isshow">动画哦</div>
 </transition>
</div>
```
2. VM 实例：
```js
// 创建 Vue 实例，得到 ViewModel
var vm = new Vue({
el: '#app',
data: {
 isshow: false
},
methods: {
 myAnimate() {
   this.isshow = !this.isshow;
 }
}
});
```
3. 定义两组类样式
```css
/* 定义进入和离开时候的过渡状态 */
 .fade-enter-active,
 .fade-leave-active {
   transition: all 0.2s ease;
   position: absolute;
 }

 /* 定义进入过渡的开始状态 和 离开过渡的结束状态 */
 .fade-enter,
 .fade-leave-to {
   opacity: 0;
   transform: translateX(100px);
 }
 ```
 ### 使用第三方CSS动画库
> [使用第三方CSS动画库](https://cn.vuejs.org/v2/guide/transitions.html#自定义过渡类名)
1. 导入动画类库：
```html
<link rel="stylesheet" type="text/css" href="./lib/animate.css">
```
2. 定义 transition 及属性：
```html
<transition
 enter-active-class="fadeInRight"
 leave-active-class="fadeOutRight"
 :duration="{ enter: 500, leave: 800 }">
   <div class="animated" v-show="isshow">动画哦</div>
</transition>
```
### 使用动画钩子函数
1. 定义 transition 组件以及三个钩子函数：
```html
<div id="app">
 <input type="button" value="切换动画" @click="isshow = !isshow">
 <transition
 @before-enter="beforeEnter"
 @enter="enter"
 @after-enter="afterEnter">
   <div v-if="isshow" class="show">OK</div>
 </transition>
</div>
```
2. 定义三个 methods 钩子方法：
```js
methods: {
     beforeEnter(el) { // 动画进入之前的回调
       el.style.transform = 'translateX(500px)';
     },
     enter(el, done) { // 定义了动画的终止状态
       el.offsetWidth;
       el.style.transform = 'translateX(0px)';
       done();
     },
     afterEnter(el) { // 定义了动画完成之后的回调函数
       this.isshow = !this.isshow;
     }
   }
   ```
3. 定义动画过渡时长和样式：
```css
.show{
   transition: all 0.4s ease;
 }
 ```
 ### v-for 的列表过渡
 > [列表过渡](https://cn.vuejs.org/v2/guide/transitions.html#列表的进入和离开过渡)
 1. 定义过渡样式：
 ```css
 <style>
 .list-enter,
 .list-leave-to {
   opacity: 0;
   transform: translateY(10px);
 }

 .list-enter-active,
 .list-leave-active {
   transition: all 0.3s ease;
 }
</style>
```
2. 定义DOM结构，其中，需要使用 transition-group 组件把v-for循环的列表包裹起来：
```html
<div id="app">
 <input type="text" v-model="txt" @keyup.enter="add">

 <transition-group tag="ul" name="list">
   <li v-for="(item, i) in list" :key="i">{{item}}</li>
 </transition-group>
</div>
```
3. 定义 VM中的结构:
```js
 // 创建 Vue 实例，得到 ViewModel
 var vm = new Vue({
   el: '#app',
   data: {
     txt: '',
     list: [1, 2, 3, 4]
   },
   methods: {
     add() {
       this.list.push(this.txt);
       this.txt = '';
     }
   }
 });
 ```
 ### 列表的排序过渡
 + `<transition-group>` 组件还有一个特殊之处。不仅可以进入和离开动画，还可以改变定位。要使用这个新功能只需了解新增的 `v-move` 特性，它会在元素的改变定位的过程中应用。

 +   `v-move` 和 `v-leave-active` 结合使用，能够让列表的过渡更加平缓柔和：
 ```css
 .v-move{
transition: all 0.8s ease;
}
.v-leave-active{
position: absolute;
}
```