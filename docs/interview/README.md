---
title: 面试题
---
## call原理
```js
function fn1(){console.log(1);}
function fn2(){console.log(2);}
fn1.call(fn2);
fn1.call.call(fn2);
Function.prototype.call(fn1);
Function.prototype.call.call(fn1);
```
> 首先回顾call的核心源码
```js
Function.prototype.call=function call(context,...params){
    //call核心源码
    let key=Symbol('key');
    let result;
    context[key]=this;
    result=context[key](...params)
    delete context[key]
    return result
}
```
1. `fn1.call(fn2)` 函数fn1是Function的实例，可通过原型链查找到Fucntion原型上的call方法，将call方法执行，call中的`this是fn1`，`context=>fn2`,`fn2.xx=fn1`,`fn2.xx()`执行，执行的是fn1，让fn1中的this变为fn2 输出结果1
2. `fn1.call.call(fn2)` `fn1.call`是call函数，call函数执行call方法，call方法中this是call函数，context是fn2，`fn2.xx=call函数` ,`fn2.xx()`,让call函数执行，call函数中的this变为fn2，`this=fn2`，没有传参数context是window，`window.xx=fn2`，`window.xx()`,把fn2执行，让fn2中的this指向window，fn2执行输出2
3. `Function.prototype.call(fn1)` `this->Function.prototype(匿名空函数)`，`context->fn1`,`fn1.xx=匿名空函数`，`fn1.xx()`,把匿名空函数执行，让匿名空函数中的this为fn1，匿名空函数执行什么也不输出
4. `Function.prototype.call`是call函数，call方法中的this是call函数，context是fn1，`fn1.xx=call函数`，`fn1.xx()`执行就是call函数执行，并将call函数中的this变为fn1，`this->fn1`,`context->window`,`window.xx=fn1`,`window.xx()`就是fn1执行，fn1中this变为window
## 变量提升、this
```js
var num = 10;
var obj = {
    num: 20
};
obj.fn = (function (num) {
    this.num = num * 3;
    num++;
    return function (n) {
        this.num += n;
        num++;
        console.log(num);
    }
})(obj.num);
var fn = obj.fn;
fn(5);
obj.fn(10);
console.log(num, obj.num);
//22
//23
//65 30
```
1. 在全局执行上下文中`EC(G)`,在代码执行之前，首先对带`var`、`function`的进行变量提升，生成全局变量对象`VO(G)`,`num`,`obj`,`fun`,
2. 全局代码执行，变量提升过的不用重新创建，直接赋值，10赋给全局的num，对象`{num：20}`会开辟一个堆`(AAAFFF000)`，赋给obj
3. 自执行函数执行，先创建堆再执行,执行的返回结果赋值给`obj.fn`函数执行形成私有作用域`EC(AN)`,私有变量对象`AO(AN)`,代码执行之前初始化作用域链`<EC(AN),EC(G)>`,初始化`this：window`，形参赋值`num=obj.num=20`,这里没有变量提升
4. `EC(AN)`中代码执行，`this是window`，所以`VO(G)`中`num=20*3=60`，`AO(AN)`中`num=21`，返回结果是一个函数，所以开辟一个新的堆地址`(BBBFFF000)`，将地址赋给`obj.fn`，因为是在自执行函数中开辟的所以`(BBBFFF000)`作用域在`EC(AN)`
5. 代码继续执行`fn`也指向`(BBBFFF000)`,`fn(5)`执行，形成私有作用域`AO(FN1)`,同样初始化作用域链`<EC(FN1),EC(AN)>`,初始化`this：window`，形参赋值`n=5`，没有变量提升，，代码执行`VO(G)`中`num=65`，由于当前作用域中没有`num`向上查找`AO(AN)`中`num=22`，此时输出`22`
6. `obj.fn(10)`执行形成私有作用域`EC(FN2)`和私有变量对象`AO(FN2)`，同样初始化作用域链`<EC(FN2),EC(AN)>`,初始化`this：obj`形参赋值`n=10`，没有变量提升，代码执行`obj.num+=10,obj.num=30`,由于当前作用域中没有`num`向上查找`AO(AN)`中`num=23，输出23`
7. 最后输出`num=65，obj.num=30`
