---
title: js高级
---
 # js高级
## JS中`this`的五种情况
> this：全局上下文中的this是window；块级上下文中没有自己的this,它的this是继承所在上下文中的this的；在函数的私有上下文中，this的情况会多种多样，也是接下来我们重点研究的；
+ 1. 事件绑定：给元素的某个事件行为绑定方法，当事件行为触发，方法执行，方法中的THIS是当前元素本身（特殊：IE6~8中基于attachEvent方法实现的DOM2事件绑定，事件触发，方法中的THIS是WINDOW而不是元素本身）
+ 2. 普通方法执行（包含自执行函数执行、普通函数执行、对象成员访问调取方法执行等）：只需要看函数执行的时候，方法名前面是否有“点”，有“点”，“点”前面是谁THIS就是谁，没有“点”THIS就是WINDOW[非严格模式]/UNDEFINED[严格模式]
+ 3. 构造函数执行（NEW XXX）：构造函数体中的THIS是当前类的实例
+ 4. ES6中提供了ARROW FUNCTION（箭头函数）: 箭头函数没有自己的THIS，它的THIS是继承所在上下文中的THIS
+ 5. 可以基于CALL/APPLY/BIND等方式，强制手动改变函数中的THIS指向：这三种模式是和直接很暴力的（前三种情况在使用这三个方法的情况后，都以手动改变的为主）
 
 ### 如何区分执行主体主体
 1. 事件绑定：给元素的某个事件行为绑定方法，当事件行为触发，方法执行，方法中的this是当前元素本身（特殊：IE6~8中基于attachEvent方法实现的DOM2事件绑定，事件触发，方法中的this是window而不是元素本身）
 ```js
 // 事件绑定 DOM0  
let body = document.body;
body.onclick = function () {
	// 事件触发，方法执行，方法中的this是body
	console.log(this);
};
```
```js
//事件绑定 DOM2
body.addEventListener('click', function () {
	console.log(this); //=>body
});
```
```js
 // IE6~8中的DOM2事件绑定
box.attachEvent('onclick', function () {
	console.log(this); //=>WINDOW
}); 
```
 2. 普通方法执行（包含自执行函数执行、普通函数执行、对象成员访问调取方法执行等）：只需要看函数执行的时候，方法名前面是否有“点”，有“点”，“点”前面是谁THIS就是谁，没有“点”THIS就是window[非严格模式]/undefined[严格模式]
 ```js
 //自执行函数执行
 (function () {
	console.log(this); //=>window
})();
```
```js
let obj = {
	fn: (function () {
		console.log(this); //=>window
		return function () {}
	})() //把自执行函数执行的返回值赋值给obj.fn
};
```
```js
function func() {
	console.log(this);
}
let obj = {
	func: func
};
func(); //=>方法中的this:window
obj.func(); //=>方法中的this:obj
```
 3. 构造函数执行（NEW XXX）：构造函数体中的THIS是当前类的实例
>   [].slice(); //=>数组实例基于原型链机制，找到ARRAY原型上的SLICE方法（[].slice），然后再把SLICE方法执行，此时SLICE方法中的THIS是当前的空数组
>>  Array.prototype.slice(); //=>SLICE方法执行中的this：Array.prototype
>>> [].__proto__.slice(); //=>SLICE方法执行中的this：[].__proto__===Array.prototype 
```js 
function Func() {
	this.name = "F";
	console.log(this); //=>构造函数体中的this在“构造函数执行”的模式下，是当前类的一个实例，并且this.XXX=XXX是给当前实例设置的私有属性
}
Func.prototype.getNum = function getNum() {
	// 而原型上的方法中的this不一定都是实例，主要看执行的时候，“点”前面的内容
	console.log(this);
};
let f = new Func;
f.getNum();
f.__proto__.getNum();
Func.prototype.getNum(); 
```
 4. ES6中提供了ARROW FUNCTION（箭头函数）: 箭头函数没有自己的THIS，它的THIS是继承所在上下文中的THIS
 ```js
 let obj = {
	func: function () {
		console.log(this);
	},
	sum: () => {
		console.log(this);
	}
};
obj.func(); //=>this:obj
obj.sum(); //=>this是所在上下文(EC(G))中的this:window
obj.sum.call(obj); //=>箭头函数是没有THIS，所以哪怕强制改也没用  this:window
```
```js
//不建议乱用箭头函数（部分需求用箭头函数还是很方法便的）
let obj = {
	i: 0,
	// func:function(){}
	func() {
		// THIS:OBJ
		let _this = this;
		setTimeout(function () {
			// THIS:WINDOW 回调函数中的THIS一般都是WINDOW（但是有特殊情况）
			_this.i++;
			console.log(_this);
		}, 1000);
	}
};
obj.func();
//obj调用func方法时，想让一秒后obj中的i属性+1，此时方法中的this是obj，定时器回调函数中的this是window，我们可以通过定义中间变量的形式在回到函数中使用func函数中的this
```
5. 可以基于CALL/APPLY/BIND等方式，强制手动改变函数中的THIS指向：这三种模式是和直接很暴力的（前三种情况在使用这三个方法的情况后，都以手动改变的为主）
```js
let obj = {
	i: 0,
	func() {
		setTimeout(function () {
			// 基于bind把函数中的this预先处理为obj
			this.i++;
			console.log(this);
		}.bind(this), 1000);
	}
};
obj.func();

let obj = {
	i: 0,
	func() {
		setTimeout(() => {
			// 箭头函数中没有自己的THIS，用的this是上下文中的this，也就是OBJ
			this.i++;
			console.log(this);
		}, 1000);
	}
};
obj.func(); 
```
## call/apply/bind区别与应用
+ Function.prototype：
   -  call：[function].call([context],params1,params2,...) [function]作为Function内置类的一个实例，可以基于__proto__找到Function.prototype的call方法，并且把找到的call方法执行；在call方法执行的时候，会把[function]执行，并且把函数中的this指向为[context]，并且把params1,params2...等参数值分别传递给函数
   -  apply：[function].apply([context],[params1,params2,...]) 和call作用一样，只不过传递给函数的参数需要以数组的形式传递给apply
   -  bind：[function].bind([context],params1,params2,...) 语法上和call类似，但是作用和call/apply都不太一样；call/apply都是把当前函数立即执行，并且改变函数中的this指向的，而bind是一个预处理的思想，基于bind只是预先把函数中的this指向[context]，把params这些参数值预先存储起来，但是此时函数并没有被执行
   -  这三个方法都是用来改变函数中的this的 
 ### 1.call和apply的区别
 ```js
let obj = {
    name: "obj"
};

function func(x, y) {
    console.log(this, x, y);
}
func(10, 20); //=>this:window
// obj.func(); // 由于obj中没有func方法所以报错=>Uncaught TypeError: obj.func is not a function
//call和apply的唯一区别在于传递参数的形式不一样
func.call(obj, 10, 20);//=>this:obj
func.apply(obj, [10, 20]);//=>this:obj
//call方法的第一个参数，如果不传递或者传递的是null/undefiend，
//在非严格模式下都是让this指向window（严格模式下传递的是谁,this就是谁,不传递this是undefined）
func.call();//this=>window
func.call(null);//this=>window
func.call(undefined);//this=>window
func.call(11);//this=>Number{11}
func.call(Symbol('aa'))//this=>Symbol {Symbol(aa)}
func.call(BigInt('123'))//this=>BigInt {123n}
```
### 2.引申出bind的原理
>需求：把func函数绑定给body的click事件，要求当触发body的点击行为后，执行func，但是此时需要让func中的this变为obj，并且给func传递10,20
```js
let body = document.body;
let obj = {
	name: "obj"
};

function func(x, y) {
	console.log(this, x, y);
}
//首先了解以下函数绑定的区别
body.onclick = func; //=>把func函数本身绑定给body的click事件行为，此时func并没有执行，只有触发body的click事件，我们的方法才会执行
body.onclick = func(10, 20); //=>先把func执行，把方法执行的返回结果作为值绑定给body的click事件
```
> bind是一个预处理的思想，基于bind只是预先把函数中的this指向[context]，把params这些参数值预先存储起来，核心原理就是一个匿名函数包裹函数执行call方法，这样就可以当事件触发时调用匿名函数，此时将call执行完的结果返回即可，
```js
body.onclick = func.call(obj, 10, 20); //=>这样不行，因为还没点击func就已经执行了
body.onclick = func.bind(obj, 10, 20);
//在没有bind的情况下我们可以这样处理（bind不兼容IE6~8）
body.onclick = function anonymous() {
    func.call(obj, 10, 20);
};
```
### 3.手写bind方法
> 执行bind(bind中的this是要操作的函数),返回一个匿名函数给事件绑定或者其它的内容,当事件触发的时候,首先执行的是匿名函数(此时匿名函数中的this和bind中的this是没有关系的)
>> bind的内部机制就是利用闭包（柯理化函数编程思想）预先把需要执行的函数和改变的THIS以及后续需要给函数传递的参数信息等都保存到不释放的上下文中，后续使用的时候直接拿来用，这就是经典的预先存储的思想
```js
let body=document.body
let obj={
    name:"obj"
}
function func(x,y){
    console.log(this,x,y)
}
//函数调用Function原型上的bind方法
Function.prototype.bind=function bind(context=window,...params){
    // bind中的this是要操作的函数 this：func
    let _this=this
// 它的返回值是一个匿名函数
return function anonymous(...inners){//当有事件触发时，会接受事件对象这里我们需要参数接收
  _this.apply(context,params.concat(inners))//将接收的参数拼接
}
}
setTimeout(func.bind(obj, 1, 2), 1000);
//当有事件触发时,匿名函数会接收一个ev事件对象
body.onclick = func.bind(obj, 10, 20);
// body.onclick = function anonymous(ev) { //=>ev事件对象 
//     func.call(obj, 10, 20, ev);
// };
```
### 4.call方法应用
> 需求：需要把类数组转换为数组
>> 类数组：具备和数组类似的结构（索引和LENGTH以及具备INTERATOR可迭代性），但是并不是数组的实例（不能用数组原型上的方法），我们把这样的结构称为类数组结构
1. 方法一(Array.from)
```js
function func(){
     // 1.Array.from
    let args=Array.from(argument);
    console.log(args)
}
func(1,2,3,4)
```
2. 方法二(基于ES6的展开运算符)
```js
function func(){
    // 2.基于ES6的展开运算符
    let args=[...arguments];
    console.log(args)
}
func(1,2,3,4)

```
3. 方法三(手动循环)
```js
function func(){
    //3.手动循环
    let args=[];
    for (let i = 0; i < arguments.length; i++) {
    	args.push(arguments[i]);
    }
    console.log(args)

}
func(1,2,3,4)
```
+ 数组中的slice方法
> 当slice不传参数时，实现拷贝效果
```js
  Array.prototype.slice = function slice() {
    	// this->arr
    	let args = [];
    	for (let i = 0; i < this.length; i++) {
    		args.push(this[i]);
    	}
    	return args;
  }
  let arr = [10, 20, 30];
console.log(arr.slice());
```
4. 方法四(利用call借用数组原型上的方法)
> arguments具备和数组类似的结构，所以操作数组的一些代码（例如：循环）也同样适用于arguments；如果我们让Array原型上的内置方法执行，并且让方法中的this变为我们要操作的类数组，那么就相当于我们在“借用数组原型上的方法操作类数组”，让类数组也和数组一样可以调用这些方法实现具体的需求
```js
function func(){
    let args = Array.prototype.slice.call(arguments);
    // let args = [].slice.call(arguments);
    console.log(args)
}
func(1,2,3,4)
```
### 5.apply方法应用
> 需求：获取数组中的最大值
1. 方法一(sort方法)
```js
let arr = [12, 13, 2, 45, 26, 34];
let max = arr.sort((a, b) => b - a)[0];//sort降序排列第一个数就是最大值
console.log(max);
```
2. 方法二(forEach遍历数组)
```js
let arr = [12, 13, 2, 45, 26, 34];
let max =arr[0];
arr.forEach(item=>{
    if(item>max){
        max=item
    }
})
console.log(max)
```
3. 方法三(扩展运算符)
```js
let arr = [12, 13, 2, 45, 26, 34];
let max=Math.max(...arr) //将数组展开成12, 13, 2, 45, 26, 34
console.log(max);
```
4. 方法四(使用apply)
```js
let arr = [12, 13, 2, 45, 26, 34];
let max = Math.max.apply(Math, arr);//不改变this指向，第二个参数是数组，apply内部展开成一个个数字
console.log(max);
```
### 5.手写call方法
> 核心原理：首先函数中的this要改变成谁，谁就是context，给context设置一个属性(属性名要保持唯一,为了避免我们自己设置的属性修改默认对象中的结构,可以基于Symbol实现,也可以创建一个时间戳名字),属性值一定是我们要执行的函数(也就是this,call中的this就是我们要操作的这个函数)；接下来基于context.XXX()成员访问执行方法，就可以把函数执行，并且改变里面的this(还可以把params中的信息传递给这个函数即可);都处理完了，别忘记把给context设置的这个属性删除掉(人家之前没有你自己加，加完了我们需要把它删了)
```js
 //如果context是基本类型值，默认是不能设置属性的，此时我们需要把这个基本类型值修改为它对应的引用类型值（也就是构造函数的结果）
Function.prototype.call=function call(context,...params){
     //【非严格模式下】不传或者传递NULL/UNDEFINED都让THIS最后改变为WINDOW
     context == undefined ? context = window : null;
       // CONTEXT不能是基本数据类型值，如果传递是值类型，我们需要把其变为对应类的对象类型
    if (!/^(object|function)$/.test(typeof context)) {
        if (/^(symbol|bigint)$/.test(typeof context)) {
            context = Object(context);
        } else {
            context = new context.constructor(context);
        }
    }
    //call核心源码
    let key=Symbol('key');
    let result;
    context[key]=this;
    result=context[key](...params)
    delete context[key]
    return result
}


 let obj = {
    name: "obj"
};
 
function func(x, y) {
    console.log(this,x+y);
    return x + y;
}

console.log(func.call(obj, 10, 20)); 
```
## JS中的多种继承方式
>JS本身是基于面向对象开发的编程语言
+ 类：封装、继承、多态 
	- 封装：类也是一个函数，把实现一个功能的代码进行封装，以此实现“低耦合高内聚”
	- 多态：重载、重写
	* 重写：子类重写父类上的方法（伴随着继承运行的）
	* 重载：相同的方法，由于参数或者返回值不同，具备了不同的功能（JS中不具备严格意义上的重载，JS中的重载：同一个方法内，根据传参不同实现不同的功能）
	- 继承：子类继承父类中的方法
>在JS语言中，它的继承和其它编程语言还是不太一样的 
>>继承的目的：让子类的实例同时也具备父类中私有的属性和公共的方法
### JS中第一种继承方案：原型继承（让子类的原型等于父类的实例即可）
1. 父类中私有和共有的属性方法最后都变为子类共有的
2. 和其他语言不同的时，原型继承并不会把父类的属性方法'拷贝'给子类，而是让子类实例基于__proto__原型链找到自己定义的属性和方法
3. ch.__proto__.xxx=xxx 修改子类原型(原有父类的一个实例)中的内容，内容被修改后，对子类的其他实例有影响，但是对父类的实例不会有影响
4. ch.__proto__.__proto__.xxx=xxx直接修改父类原型，这样不仅会影响其他父类的实例，也会影响子类的实例
```js
		function Parent() {
			this.x = 100;
		}
		Parent.prototype.getX = function getX() {
			return this.x;
		};

		function Child() {
			this.y = 200;
		}
		Child.prototype = new Parent; //=>原型继承
		Child.prototype.getY = function getY() {
			return this.y;
		};

		let c1 = new Child;
        console.log(c1); 
    
```
### JS中第二种继承方式：CALL继承（只能继承父类中私有的，不能继承父类中公共的）
```js
	 function Parent() {
			this.x = 100;
		}
		Parent.prototype.getX = function getX() {
			return this.x;
		};

		function Child() {
			// 在子类构造函数中，把父类当做普通方法执行（没有父类实例，父类原型上的那些东西也就和它没关系了）
            // this -> Child的实例c1
            //通过call将父函数中的this改变为子函数的实例
			Parent.call(this); // this.x=100 相当于强制给c1这个实例设置一个私有的属性x，属性值100，相当于让子类的实例继承了父类的私有的属性，并且也变为了子类私有的属性 “拷贝式”
			this.y = 200;
		}
		Child.prototype.getY = function getY() {
			return this.y;
		};

		let c1 = new Child;
        console.log(c1); 
```
### JS中第三种继承：寄生组合式继承（CALL继承 + 另类原型继承）
```js
 function Parent() {
			this.x = 100;
		}
		Parent.prototype.getX = function getX() {
			return this.x;
		};

		function Child() {
			Parent.call(this);
			this.y = 200;
        }
        // Child.prototype.__proto__=Parent.prototype
		Child.prototype = Object.create(Parent.prototype);
		Child.prototype.constructor = Child;
		Child.prototype.getY = function getY() {
			return this.y;
		};

		let c1 = new Child;
		console.log(c1); 
		//创建一个空对象，让其原型链指向obj
		/* let obj = {
			xxx: 'xxx'
		};
        console.log(Object.create(obj)); */
 ```
 ### ES6中的类和继承
 ```js
 class Parent {
			constructor() {
				this.x = 100;
			}
			// Parent.prototype.getX=function...
			getX() {
				return this.x;
			}
		}

		// 继承: extends Parent（类似于寄生组合继承）
		// 注意：继承后一定要在CONSTRUCTOR第一行加上SUPER
		class Child extends Parent {
			constructor() {
				super(); //=>类似于我们之前的CALL继承  super(100,200)：相当于把Parent中的constructor执行，传递了100和200
				this.y = 200;
			}
			getY() {
				return this.y;
			}
		}
		let c1 = new Child;
		console.log(c1);

        // Child(); //=>Uncaught TypeError: Class constructor Child cannot be invoked without 'new'  ES6中创建的就是类，不能当做普通函数执行，只能new执行
```
## 数据类型检测的四种方案
1. typeof 
+ typeof [value]  返回结果是一个字符串（字符串中包含了对应的数据类型）
  - =>使用起来简单，基本数据类型值基本上都可以有效检测，引用数据类型值也可以检测出来"number"/"string"/"boolean"/"undefined"/"symbol"/"bigint"/"object"/"function"
  - =>typeof null === "object"
  - =>对于数组、普通对象、正则等，返回结果都是"object"，所以无法基于typeof细分对象数据类型
	 typeof typeof [] === "string"
2. instanceof
+ [实例] instanceof [类]：用来检测当前实例是否属于这个类
```js
 let arr = [10, 20];		
	console.log(typeof arr); //=>"object"
	console.log(arr instanceof Array); //=>true
	console.log(arr instanceof RegExp); //=>false
	console.log(arr instanceof Object); //=>true  不管是数组对象还是正则对象，都是Object的实例，检测结果都是TRUE，所以无法基于这个结果判断是否为普通对象 
```
+  instanceof检测机制：验证当前类的原型prototype是否会出现在实例的原型链__proto__上，只要在它的原型链上，则结果都为TRUE
```js
		function Fn() {}
		Fn.prototype = Object.create(Array.prototype);
		let f = new Fn;
        console.log(f instanceof Array); //=>true f其实不是数组，因为它连数组的基本结构都是不具备的 
```
+  instanceof检测的实例必须都是引用数据类型的，它对基本数据类型值操作无效
```js
		 console.log(10 instanceof Number); //=>false
		 console.log(new Number(10) instanceof Number); //=>true
```
3. constructor
 + constructor：利用类和实例的关系，实例.constructor 一般都等于 类.prototype.constructor 也就是当前类本身（前提是你的constructor并没有被破坏）
 + =>但是这种方式也是不保险的，因为JS中的constructor是不被保护的（用户可以自己随便改），这样基于constructor检测的值存在不确定性（但是真实项目中，没有人会改内置类的constructor）
```js
 		 let arr = [],
			obj = {},
			num = 10;
		console.log(arr.constructor === Array); //=>true
		console.log(arr.constructor === Object); //=>false
		console.log(obj.constructor === Object); //=>true
        console.log(num.constructor === Number); //=>true
```
4. Object.prototype.toString.call([value])
+ => 基于它可以有效的检测任何数据类型的值 
+ 找到Object.prototype上的toString方法，让toString方法执行，并且基于call让方法中的this指向检测的数据值，这样就可以实现数据类型检测了
    - =>Object.prototype.toString.call(10)
	- =>({}).toString.call(10)
	- =>({}).toString===Object.prototype.toString
+ 获取结果的结构 "[object 当前数据值所属的构造函数]"