---
title: Vue.js-Day3
---
# Vue.js-Day3

## 定义Vue组件
  +  什么是模块化：模块化是从代码的角度出发，分析项目，把项目中一些功能类似的代码，单独的抽离为一个个的模块；那么为了保证大家以相同的方式去封装模块，于是我们就创造了模块化的规范（CommonJS规范）；
      -  模块化的好处：方便项目的开发；和后期的维护与扩展；今后如果需要某些固定功能的模块，则直接拿来引用就行，提高了项目开发效率！
 +   什么是组件化：从UI的角度出发考虑问题，把页面上有重用性的UI解构和样式，单独的抽离出来，封装为单独的组件；
       - 组件化的好处：随着项目规模的发展，我们手里的组件，会越来越多，这样，我们今后一个页面中的UI，几乎都可以从手中拿现成的组件拼接出来；方便项目的开发和维护；

### 全局组件定义的三种方式
#### 第一种方式：
1. 先调用 Vue.extend() 得到组件的构造函数：
```js
// 创建全局组件的第一种方式：   component
 const com1 = Vue.extend({
   template: '<h1>这是创建的第一个全局组件</h1>' // template 属性，表示这个组件的 UI 代码解构
 })
 ```
 2. 通过 Vue.component('组件的名称', 组件的构造函数) 来注册全局组件：
 ```js
  // 使用 Vue.component 向全局注册一个组件
 // Vue.component('组件的名称', 组件的构造函数)
 Vue.component('mycom1', com1)
 ```
 3. 把注册好的全局组件名称，以标签形式引入到页面中即可：
 ```html
 <!-- 如何引入一个全局的Vue组件呢？ 直接把 组件的名称，以标签的形式，放到页面上就好了！ -->
 <mycom1></mycom1>
 ```
 > Vue组件是特殊的Vue实例
 #### 第二种方式
 4. 直接使用 `Vue.component('组件名称', { 组件模板对象 })`

 ```js
 const com2Obj = {
   // 1. template 属性中，不能单独放一段文本，必须用标签包裹起来；
   // 2. 如果在 template 属性中，想要放多个元素了，那么，在这些元素外，必须有唯一的一个根元素进行包裹；
   template: '<div><h2>这是直接使用 Vue.component 创建出来的组件</h2><h3>红红火火</h3></div>'
 }

 // 定义全局的组件
 // Vue.component 的第二个参数，既接收 一个 组件的构造函数， 同时，也接受 一个对象
 Vue.component('mycom2', com2Obj)
 ```
  #### 第三种方式 
  1. 先使用 template 标签定义一个模板的代码解构：
  ```html
  <!-- 定义一个 template 标签元素  -->
<!-- 使用 Vue 提供的 template 标签，可以定义组件的UI模板解构 -->
<template id="tmpl">
 <div>
   <h3>哈哈，这是在外界定义的组件UI解构</h3>
   <h3>我是来捣乱的</h3>
 </div>
</template>
```
2. 使用 Vue.component 注册组件
```js
 // 这是定义的全局组件
 Vue.component('mycom3', {
   template: '#tmpl'
 })
 ```
 
> `template` 不可以放在组件实例之后，也不可以放在vue控制的区域
### 定义私有组件
```js
const app = new Vue({
        el: '#app',
        data: {
            message: 'hello world'
        },
        //定义私有组件
        components:{
            'mycom':{
                template:'<h1>这是定义的私有组件</h1>'
            }
        }
        })
```
### 在组件中定义私有data和methods
```js
Vue.component('mycom', {
      template: '<h3 @click="show">这是自定义的全局组件：{{ msg }}</h3>',
      data: function () { // 在 组件中，可以有自己的私有数据，但是，组件的 data 必须是一个 function，并且内部 return 一个 数据对象
        return {
          msg: '哈哈哈'
        }
      },
      methods: { // 尝试定义组件的私有方法
        show() {
          console.log('出发了组件的私有show方法！')
        }
      }
    })
```
> 【重点】为什么组件中的data属性必须定义为一个方法并返回一个对象,因为每当我们在页面上引用一次组件，必然会先调用data function(){},从而得到一个当前组件私有的数据对象，避免联动效果

## 使用`flag`标识符结合`v-if`和`v-else`切换组件
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="./lib/vue-2.5.9.js"></script>
</head>

<body>
  <div id="app">

    <input type="button" value="显示登录" @click="flag=true">
    <input type="button" value="显示注册" @click="flag=false">

    <login v-if="flag"></login>
    <reg v-else="flag"></reg>

  </div>

  <script>
    Vue.component('login', {
      template: `<div>
        用户名：<input type="text" /><br/>
        密码：<input type="text" /><br/>
        <input type="button" value="登录" />
      </div>`
    })

    Vue.component('reg', {
      template: '<h3>注册组件</h3>'
    })

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        flag: false // 如果 flag 为true，表示显示登录组件，如果为 false，则显示注册组件
      },
      methods: {}
    });
  </script>
</body>

</html>
```
## 使用component标签的:is属性来切换组件,并添加动画
``` html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="./lib/vue-2.5.9.js"></script>
  <style>
    .v-enter {
      /* 即将进入时候的坐标 */
      opacity: 0;
      transform: translateX(100px);
    }

    .v-leave-to {
      /* 离开时候，最终到达的位置 */
      opacity: 0;
      transform: translateX(-100px);
    }

    .v-enter-active,
    .v-leave-active {
      transition: all 0.4s ease;

      position: absolute;
    }
  </style>
</head>

<body>
  <div id="app">
    <!-- transition     transition-group    template     component -->
    <!-- 通过 component  的  :is 属性，可以显示指定【名称】的组件 -->
    <a href="#" @click="comname='com1'">显示组件1</a>&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="#" @click="comname='com2'">显示组件2</a>&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="#" @click="comname='com3'">显示组件3</a>&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="#" @click="comname='com4'">显示组件4</a>&nbsp;&nbsp;&nbsp;&nbsp;


    <!-- <transition mode="out-in"> 先离开再进入 -->
    <transition>
      <component :is="comname"></component>
    </transition>
  </div>

  <script>

    Vue.component('com1', {
      template: '<h3>奔波霸</h3>'
    })

    Vue.component('com2', {
      template: '<h3>霸波奔</h3>'
    })

    Vue.component('com3', {
      template: '<h3>孙行者</h3>'
    })

    Vue.component('com4', {
      template: '<h3>者行孙</h3>'
    })

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        comname: 'com1' // 在 data 上定义 comname 来指定要渲染的组件名称
      },
      methods: {}
    });
  </script>
</body>

</html>
```
## 父组件向子组件传值
### 父组件向子组件传递普通数据
1. 把要传递给子组件的数据，作为 自定义属性，通过 v-bind: 绑定到子组件身上：
```html
<com1 :msg123="parentMsg"></com1>
```
2. 在子组件中，不能直接使用父组件传递过来的数据，需要先使用props 数组来接收一下：
```js
props: ['msg123']
```
3. 注意：在接收父组件传递过来的 props的时候，接收的名称，一定要和父组件传递过来的自定义属性，名称保持一致！
```html
<body>
  <div id="app">
    <!-- 父组件如果想要给子组件传递数据，则需要使用属性绑定的形式 -->
    <!-- 这样，子组件身上的 自定义数据，就是你要传递给子组件的数据 -->
    <com1 :msg123="parentMsg"></com1>
  </div>

  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        parentMsg: '哈哈，你是想笑死我，然后好继承我的蚂蚁花呗吗？'
      },
      methods: {},

      components: { // 定义私有组件
        'com1': { // 在Vue中，默认，子组件无法直接获取父组件中的数据
          template: `<div>
            <h3>这是子组件中的标题 {{ msg123 }}</h3>
          </div>`,
          props: ['msg123'] // 在Vue中，只有 props 是数组，其它带 s 后缀的属性都是 对象
        }
      }

    });
  </script>
</body>
```
### 父组件向子组件传递对象
```html
<body>
  <div id="app">
    <com1 :msgobj="msgObj"></com1>
  </div>

  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        msgObj: {
          address: '北京',
          location: '顺义····马坡南'
        }
      },
      methods: {},
      components: {
        'com1': {
          template: '<h3>哈哈 {{ JSON.stringify(msgobj) }}</h3>',
          props: ['msgobj']
        }
      }
    });
  </script>
</body>
```
### 父组件向子组件传递方法
```html
<body>
  <div id="app">
    <!-- 1. 如果要向子组件传递 data 中的数据，则 使用 属性绑定的形式  v-bind: -->
    <!-- 2. 如果要向子组件传递 methods 中的 方法，则 使用 事件绑定的形式 v-on: -->
    <com1 @func1="show"></com1>
  </div>

  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {},
      methods: {
        show() {
          console.log('有人调用了父组件中的show方法')
        }
      },

      components: { // 定义子组件
        'com1': {
          template: `<div>
            <!-- 当点击子组件的  按钮时候， 调用一下 父组件传递过来的 func 方法 -->
            <input type="button" value="这是子组件的按钮" @click="btnClick" />
          </div>`,
          methods: {
            btnClick() {
              // console.log('ok')
              // 调用一下 父组件传递过来的 func 方法  emit 英文原意为 发射， 在 计算机中，引申为 触发
              this.$emit('func1')
            }
          }
        }
      }
    });
  </script>
</body>
```
## 子组件向父组件传值
```html
<body>
  <div id="app">
    <!-- 1. 如果要向子组件传递 data 中的数据，则 使用 属性绑定的形式  v-bind: -->
    <!-- 2. 如果要向子组件传递 methods 中的 方法，则 使用 事件绑定的形式 v-on: -->
    <com1 @func1="show"></com1>
  </div>

  <script>
    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        msgFormSon: ''
      },
      methods: {
        show(arg1) {
          // console.log('有人调用了父组件中的show方法-----' + arg1)
          // 把子组件传递过来的数据，保存到 父组件的  data 中
          this.msgFormSon = arg1
          console.log(this.msgFormSon)
        }
      },

      components: { // 定义子组件
        'com1': {
          template: `<div>
            <!-- 当点击子组件的  按钮时候， 调用一下 父组件传递过来的 func 方法 -->
            <input type="button" value="这是子组件的按钮" @click="btnClick" />
          </div>`,
          data() { // 子组件的数据
            return {
              sonMsg: '这是子组件中的数据'
            }
          },
          methods: {
            btnClick() {
              // console.log('ok')
              // 调用一下 父组件传递过来的 func 方法  emit 英文原意为 发射， 在 计算机中，引申为 触发

              // 子组件向父组件传值，本质上，还是调用了父组件传递过来的方法，只不过，子组件在调用的时候，把 数据 当作参数，传给这个方法了；
              this.$emit('func1', this.sonMsg)
            }
          }
        }
      }
    });
  </script>
</body>
```
## 评论列表案例(练习父子组件传值)
```html
<body>
  <div id="app">

    <!-- 评论框区域 -->
    <cmt-box @func="addNewCmt"></cmt-box>


    <ul>
      <cmt-item v-for="(item, i) in list" :item="item" :key="i"></cmt-item>
    </ul>

  </div>

  <script>

    Vue.component('cmt-item', {
      template: `<li>
        <h3>评论人：{{ item.name }}</h3>
        <h5>评论内容：{{ item.content }}</h5>
      </li>`,
      props: ['item']
    })


    Vue.component('cmt-box', {
      template: `<div>
      <label>评论人：</label>
      <br>
      <input type="text" v-model="name">
      <br>
      <label>评论内容：</label>
      <br>
      <textarea v-model="content"></textarea>
      <br>
      <input type="button" value="发表评论" @click="postComment">
    </div>`,
      data: function () {
        return {
          name: '',
          content: ''
        }
      },
      methods: {
        postComment() { // 发表评论
          // console.log('ok')
          const cmt = { name: this.name, content: this.content }
          // 子组件中，调用父组件传递过来的方法，然后可以把 子组件的数据，当作参数，传递给父组件的方法去使用
          this.$emit('func', cmt)
          this.name = this.content = ''
          // console.log(cmt)
        }
      }
    })

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        list: [
          { name: 'zs', content: '沙发' },
          { name: 'ls', content: '板凳' },
          { name: 'qqq', content: '凉席' },
          { name: 'eee', content: '砖头' }
        ]
      },
      methods: {
        addNewCmt(cmt) { // 添加新评论
          // console.log(cmt)
          this.list.push(cmt)
        }
      }
    });
  </script>
</body>
```
## 使用 `this.$refs` 来获取元素和组件
```html
 <div id="app">
    <div>
      <input type="button" value="获取元素内容" @click="getElement" />
      <!-- 使用 ref 获取元素 -->
      <h1 ref="myh1">这是一个大大的H1</h1>

      <hr>
      <!-- 使用 ref 获取子组件 -->
      <my-com ref="mycom"></my-com>
    </div>
  </div>

  <script>
    Vue.component('my-com', {
      template: '<h5>这是一个子组件</h5>',
      data() {
        return {
          name: '子组件'
        }
      }
    });

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {},
      methods: {
        getElement() {
          // 通过 this.$refs 来获取元素
          console.log(this.$refs.myh1.innerText);
          // 通过 this.$refs 来获取组件
          console.log(this.$refs.mycom.name);
        }
      }
    });
  </script>
  ```
## 在Vue组件中data和props的区别

  ```html
  <body>
  <div id="app">
    <com1 :info="info"></com1>
  </div>

  <script>

    Vue.component('com1', {
      template: `<div>
        <input type="button" value="按钮" @click="btnClick" />
          <h3>{{ msg }} ---- {{ info2 }}</h3>
      </div>`,
      data() { // data 上的数据，都是组件自己私有的， data 上的数据，都是可读可写的
        return {
          msg: 'ok',
          info2: this.info
        }
      },
      props: ['info'], // 都是外界传递过来的数据， props 中的数据只能读取，不能重新写入
      methods: {
        btnClick() {
          this.msg = 'no'
          this.info2 = '456'
        }
      }
    })

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {
        info: '123'
      },
      methods: {}
    });


    // 在学习 React 时候，也会接触到 类似于  Vue 中的  data 和 props 两个东西；
    // 在 React 中，取而代之的是  data  ->   state       props ->    this.props
  </script>
</body>

```
## 在Vue组件中data和props的区别
1.    data 在组件中，要被定义成function并返回一个对象
2.   props 在组件中，要被定义成数组，其中，数组的值都是字符串名，表示父组件传递过来的数据；
3.    props 的数据，不要直接拿来修改，如果想要修改，必须在 data 上重新定义一个 属性，然后把属性的值 从 this.props 拿过来；
> data 上的数据，都是组件自己私有的， data 上的数据，都是可读可写的. 
>props 数据，都是外界传递过来的数据， props 中的数据只能读取，不能重新写入
## 什么是路由
1.    对于普通的网站，所有的超链接都是URL地址，所有的URL地址都对应服务器上对应的资源；

2.    对于单页面应用程序来说，主要通过URL中的hash(#号)来实现不同页面之间的切换，同时，hash有一个特点：HTTP请求中不会包含hash相关的内容；所以，单页面程序中的页面跳转主要用hash实现；

3.    在单页面应用程序中，这种通过hash改变来切换页面的方式，称作前端路由（区别于后端路由）；

4.   前端的路由：就是根据不同的Hash地址，在页面上展示不同的前端组件；
## 在 vue 中使用 vue-router
1. 导入vue-router组件类库：
```html
<script src="./lib/vue-router-2.7.0.js"></script>
```
2. 使用 router-link 组件来导航
```html
<!-- 2. 使用 router-link 组件来导航 -->
<router-link to="/login">登录</router-link>
<router-link to="/register">注册</router-link>
```
3. 使用 router-view 组件来显示匹配到的组件
```html
<router-view></router-view>
```
4. 创建使用Vue.extend创建组件
```js
 // 4.1 使用 Vue.extend 来创建登录组件
 var login = Vue.extend({
   template: '<h1>登录组件</h1>'
 });

 // 4.2 使用 Vue.extend 来创建注册组件
 var register = Vue.extend({
   template: '<h1>注册组件</h1>'
 });
 ```
 5. 创建一个路由 router 实例，通过 routers 属性来定义路由匹配规则
 ```js
 // 5. 创建一个路由 router 实例，通过 routers 属性来定义路由匹配规则
 var router = new VueRouter({
   routes: [
     { path: '/login', component: login },
     { path: '/register', component: register }
   ]
 });
 ```
 6. 使用 router 属性来使用路由规则
 ```js
 // 6. 创建 Vue 实例，得到 ViewModel
 var vm = new Vue({
   el: '#app',
   router: router // 使用 router 属性来使用路由规则
 });
 ```
 ## 设置路由切换、高亮和动画效果
 ```html
 <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="./lib/vue-2.5.9.js"></script>
  <!-- 1. 导入路由JS文件 -->
  <script src="./lib/vue-router-v3.0.1.js"></script>

  <style>
    .router-link-active {
      color: red;
      font-weight: bold;
      font-style: italic;
      font-size: 20px;
      text-decoration: underline;
    }

    .my-active {
      color: orange;
      font-size: 30px;
    }

    .v-enter,
    .v-leave-to {
      opacity: 0;
      transform: translateX(100px);
    }

    .v-enter-active,
    .v-leave-active {
      transition: all 0.3s ease;
      position: absolute;
    }
  </style>
</head>

<body>
  <div id="app">

    <!-- 路由链接 -->
    <router-link to="/login">登录</router-link>
    <router-link to="/reg">注册</router-link>

    <!-- 展示路由组件的容器 -->
    <transition>
      <router-view></router-view>
    </transition>

  </div>

  <script>

    // 2. 定义两个要切换的组件
    const login = {
      template: '<h3>登录组件</h3>'
    }
    const reg = {
      template: '<h3>注册组件</h3>'
    }

    // 3. 创建路由对象
    const router = new VueRouter({
      routes: [ // 路由规则的数组
        // { path: '/', component: login },
        { path: '/', redirect: '/login' },     // node 的 express 框架中，有 res.redirect('/login')   
        { path: '/login', component: login },
        { path: '/reg', component: reg }
      ],
      linkActiveClass: 'my-active' // 配置默认被 选中路由的高亮类名的 ， 默认类名为 router-link-active
    })

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {},
      methods: {},
      router // 4. 把路由对象，挂载到 VM 实例上
    });
  </script>
</body>

</html>
```
## 在路由规则中定义参数
1. 在规则中定义参数
```js
{ path: '/register/:id', component: register }
```
2. 通过 this.$route.params来获取路由中的参数：
```js
var register = Vue.extend({
   template: '<h1>注册组件 --- {{this.$route.params.id}}</h1>'
 });
 ```
 3. 在路由中，使用?传参，不需要修改对应的路由规则；
 ## 使用 children 属性实现路由嵌套
 ```vue
   <div id="app">
    <router-link to="/account">Account</router-link>

    <router-view></router-view>
  </div>

  <script>
    // 父路由中的组件
    const account = Vue.extend({
      template: `<div>
        这是account组件
        <router-link to="/account/login">login</router-link> | 
        <router-link to="/account/register">register</router-link>
        <router-view></router-view>
      </div>`
    });

    // 子路由中的 login 组件
    const login = Vue.extend({
      template: '<div>登录组件</div>'
    });

    // 子路由中的 register 组件
    const register = Vue.extend({
      template: '<div>注册组件</div>'
    });

    // 路由实例
    var router = new VueRouter({
      routes: [
        { path: '/', redirect: '/account/login' }, // 使用 redirect 实现路由重定向
        {
          path: '/account',
          component: account,
          children: [ // 通过 children 数组属性，来实现路由的嵌套
            { path: 'login', component: login }, // 注意，子路由的开头位置，不要加 / 路径符
            { path: 'register', component: register }
          ]
        }
      ]
    });

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {},
      methods: {},
      components: {
        account
      },
      router: router
    });
  </script>
```
## 命名视图实现经典布局
> 当一个路由页面需要展示多个组件的啥时候使用
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="./lib/vue-2.5.9.js"></script>
  <script src="./lib/vue-router-v3.0.1.js"></script>
  <style>
    html,
    body,
    h1 {
      margin: 0;
      padding: 0;
      font-size: 20px;
    }

    .header {
      height: 120px;
      background-color: darkcyan;
    }

    .container {
      height: 400px;
      display: flex;
    }

    .sidebar {
      background-color: orange;
      flex: 2;
    }

    .content {
      background-color: pink;
      flex: 10;
    }

    .footer {
      background-color: black;
      color: white;
      height: 100px;
    }
  </style>
</head>

<body>
  <div id="app">
    <!-- 路由的容器 -->
    <router-view name="top"></router-view>
    <div class="container">
      <router-view name="left"></router-view>
      <router-view name="right"></router-view>
    </div>
    <router-view name="bottom"></router-view>
  </div>

  <script>

    const header = {
      template: `<h1 class="header">头部区域</h1>`
    }
    const sidebar = {
      template: `<h1 class="sidebar">左侧侧边栏</h1>`
    }
    const content = {
      template: `<h1 class="content">主体内容区域</h1>`
    }
    const footer = {
      template: `<h1 class="footer">尾部</h1>`
    }

    const router = new VueRouter({
      routes: [
        // { path: '/', component: header }
        {
          path: '/', components: {
            //     组件名称 :  组件对象
            'top': header,
            'left': sidebar,
            'right': content,
            'bottom': footer
          }
        }
      ]
    })

    // 创建 Vue 实例，得到 ViewModel
    var vm = new Vue({
      el: '#app',
      data: {},
      methods: {},
      router
    });
  </script>
</body>

</html>
```
## watch属性的使用
