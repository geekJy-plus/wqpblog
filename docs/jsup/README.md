---
title: js高级
---
 # js高级
## JS中的`this`
> this：全局上下文中的this是window；块级上下文中没有自己的this,它的this是继承所在上下文中的this的；在函数的私有上下文中，this的情况会多种多样，也是接下来我们重点研究的；
+ 1. 事件绑定：给元素的某个事件行为绑定方法，当事件行为触发，方法执行，方法中的THIS是当前元素本身（特殊：IE6~8中基于attachEvent方法实现的DOM2事件绑定，事件触发，方法中的THIS是WINDOW而不是元素本身）
+ 2. 普通方法执行（包含自执行函数执行、普通函数执行、对象成员访问调取方法执行等）：只需要看函数执行的时候，方法名前面是否有“点”，有“点”，“点”前面是谁THIS就是谁，没有“点”THIS就是WINDOW[非严格模式]/UNDEFINED[严格模式]
+ 3. 构造函数执行（NEW XXX）：构造函数体中的THIS是当前类的实例
+ 4. ES6中提供了ARROW FUNCTION（箭头函数）: 箭头函数没有自己的THIS，它的THIS是继承所在上下文中的THIS
+ 5. 可以基于CALL/APPLY/BIND等方式，强制手动改变函数中的THIS指向：这三种模式是和直接很暴力的（前三种情况在使用这三个方法的情况后，都以手动改变的为主）
+ 6.匿名函数（自执行函数/回调函数等）执行，一般方法中的THIS都是WINDOW|UNDEFINED
```js
	 (function () {
			console.log(this);
		})(); 

	 setTimeout(function () {
			// 回调函数：把函数作为值传递给另外一个函数，在另外一个函数的某个阶段把他执行
			console.log(this);
		}, 1000); 

	[10, 20, 30].forEach(function (item, index) {
			console.log(this); //=>forEach中第二个参数不传递this:window，传递[context]，则this:[context]
		},[context]); 
 ```
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
### jQuery中的数据类型检测方法类库
1. 生成数据类型映射表
```js
var class2type = {};
var toString = class2type.toString; //=>Object.prototype.toString 检测数据类型
let arr = "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "); //=>["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Object", "Error", "Symbol"]
arr.forEach(item => {
	class2type["[object " + item + "]"] = item.toLowerCase();
});
// console.log(class2type);
// {
// 	[object Boolean]: "boolean", 
// 	[object Number]: "number", 
// 	[object String]: "string"
// 	......
// }
```
2. jQuery中的检测数据类型的方法
```js
function toType(obj) {
	//传递给我的是null/undefined，直接返回 "null"/"undefined"
	if (obj == null) {
		return obj + "";
	}
	// typeof obj === "object" || typeof obj === "function" =>引用数据类型
	//   => 如果是基本数据类型值，检测数据类型使用typeof就很“香”
	//   => 如果是引用数据类型值，则基于toString这一套来搞定
	//         => toString.call(obj)  检测当前值的数据类型 "[object Xxx]"
	//         => class2type["[object Xxx]"] 当上一步生成的对象中，基于对应的属性名，找到属性值（所属的数据类型），如果没有则返回 "object"
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[toString.call(obj)] || "object" :
		typeof obj;
}
```
## 进程(process)和线程(thread)
+ 电脑端安装很多的应用软件，没当运行一个应用程序，就相当于开辟了一个进程，而对于浏览器来说，每新建一个页卡访问一个页面，都是新开辟一个进程
+ 每一个进程中可能会同时做很多事，如果同时做多件事情，则会开辟多个线程，所以一个进程中会包含零个或者多个线程
+ 浏览器是多线程的
 - GUI渲染线程(渲染和绘制页面)
 - JS引擎线程(运行和渲染JS代码)
 - 事件管控和触发线程
 - 定时器管控和触发线程
 - 异步http请求线程
+ JS渲染或者页面渲染是单线程的
## 同步编程和异步编程
+ 同步编程：一次只能处理一件事情，当前这件事情处理完，才能继续处理下一件事情
+ 异步编程：同时可以进行好几件事情，一般是基于多线程并发完成，JS中的异步编程，有自己一些特殊的处理方式(队列queue和事件循环EventLoop)
## 浏览器渲染页面的步骤
> 输入url地址，向服务器发送http请求，服务器响应资源文件，浏览器获取的是文件流(进制编码的内容)
>> 浏览器首先会把16进制的字节信息编译为'代码字符串'，然后按w3c规则进行字符解析，生成对用的Tokens,最后转换为浏览器内核可以识别渲染的DOM节点，在按照节点最后解析为对应的DOM TREE/CSSOM TREE
1. 处理HTML标记，构建DOM树
2. 处理CSS标记，构建CSSOM树
3. 将DOM树和CSSOM树融合成渲染树RENDER-TREE
4. 根据生成的渲染树，计算他们在设备视口内的确切位置和大小，这个计算过程就是回流(布局或重排)
5. 根据渲染树以及 回流得到的几何信息，得到节点的绝对像素进行绘制(painting)或栅格化(rasterizing)
## DOM的重绘和回流
+ 重绘：元素样式的改变(但宽度大小位置不变)
+ 回流: 元素的大小或者位置发生的变化(当页面布局和几何信息发生变化时)，触发的重新布局，导致渲染树重新计算布局和渲染
> 回流一定吹触发重绘，而重绘不一定会回流
## 前端性能优化之避免DOM的回流
1. 放弃传统操作DOM的时代，基于vue、react开始数据影响视图模式
2. 分离读写操作(现代浏览器都有渲染队列机制)
  - offset系列、client系列、scroll系列等都可以刷新渲染队列
3. 样式集中改变
```js
div.style.classText='width:20px;height:20px;'
div.className='box'
```
4. 缓存布局信息
```js
div.style.left=div.offsetLeft+1+'px'
//改成
var curLeft=div.offsetLeft;
div.style.left=curLeft+1+'px'
```
- 因为 var curLeft=div.offsetLeft 是读取操作，如果放在curLeft位置会增加回流的次数
5. 元素批量修改
- 文档碎片：createDocumentFragment
```js
	//文档碎片：临时创建的一个存放文档的容器，我们可以把新创建的LI，存放到容器中，当所有的LI都存储完，我们统一把容器中的内容增加到页面中（只触发一次回流）
		let frag = document.createDocumentFragment();
		for (let i = 1; i <= 5; i++) {
			let liBox = document.createElement('li');
			liBox.innerText = `我是第${i}个LI`;
			frag.appendChild(liBox);
		}
        item.appendChild(frag);
    // 真实项目中，有一个文档碎片类似的方式，也是把要创建的LI事先存储好，最后统一放到页面中渲染（字符串拼接）
		let str = ``;
		for (let i = 1; i <= 5; i++) {
			str += `<li>我是第${i}个LI</li>`;
		}
        item.innerHTML = str; 
        // SCRIPT在DOM结构末尾导入，可以直接使用元素的ID代表这个元素对象
```       
- 模板字符串拼接
6. 动画效果应用到position属性为absolute或flexd的元素上(脱离文档流)
7. 避免table布局和css的js表达式
## GUI渲染线程
> link和@import都是导入外部样式(从服务器获取样式文件)
1. 遇link 浏览器会派发一个新的线程(http线程)去加载资源文件，同时GUI渲染线程会继续向下渲染代码，不论css是否请求回来，代码继续渲染
2. 遇到@import GUI渲染线程会暂时停止渲染，去服务器加载资源文件，资源文件没有返回之前，是不会继续渲染的，@import阻碍浏览器的渲染，项目中尽可能少用
3. 如果是style，GUI直接渲染
4. 正常情况下JS会阻碍GUI的渲染
 - JS一般放在页面的尾部，就是为了确保dom树生成完才会去加载js
 - 可以使用defer和async异步管控js的请求
 + 有async，不会停止dom树的构建，立即异步加载，加载后立即执行
 + 有defer，不会停止dom树的构建，立即异步加载，加载好后没如果dom树还没构建好，则先等dom树解析好再执行，当dom树已经准备好，则立即执行
 ## 栈、队列和优先级队列
 + 栈
 ```js
 function Stack() {
	this.container = [];
}
Stack.prototype = {
	constructor: Stack,
	// 进栈执行
	enter: function enter(element) {
		this.container.unshift(element);
	},
	// 出栈
	leave: function leave() {
		return this.container.shift();
	},
	// 获取栈中元素的数量 
	size: function size() {
		return this.container.length;
	},
	// 获取栈中的元素（深拷贝）
	value: function value() {
		return JSON.parse(JSON.stringify(this.container));
	}
};
 ```
> 十进制转换为二进制
```js
function decimal2binary(decimal) {
	let stack = new Stack();
	while (decimal > 0) {
		let merchant = Math.floor(decimal / 2),
			remainder = decimal % 2;
		stack.enter(remainder);
		decimal = merchant;
	}
	return stack.value().join('');
}

let n = 1234567;
console.log(decimal2binary(n));
console.log(n.toString(2));
```

 + 队列
 ```js
 function Queue() {
	// 创建一个队列的容器
	this.container = [];
}
Queue.prototype = {
	constructor: Queue,
	// 进入队列  element进入队列的元素
	enter: function enter(element) {
		this.container.push(element);
	},
	// 移除队列
	leave: function leave() {
		if (this.container.length === 0) return;
		return this.container.shift();
	},
	// 查看队列的长度
	size: function size() {
		return this.container.length;
	},
	// 查看队列的内容
	value: function value() {
		// 深度克隆是为了保证后期外面接收到的结果不论如何的操作都不会影响内部容器中的内容
		// this.container.slice(0) 浅拷贝
		// JSON.parse(JSON.stringify(this.container)) 深拷贝
		return JSON.parse(JSON.stringify(this.container));
	}
};
```
+ 优先级队列
```js
function Queue() {
	this.container = [];
}
Queue.prototype = {
	constructor: Queue,
	// 进入队列  priority优先级，默认都是0，数值越大，优先级越高
	enter: function enter(element, priority = 0) {
		let obj = {
			value: element,
			priority: priority 
		};
		if (priority === 0) {
			// 不指定优先级（最小优先级）：存储到末尾即可
			this.container.push(obj);
			return;
		}
		// 指定优先级，我们需要从最后一项依次来比较
		let flag = false;
		for (let i = this.container.length - 1; i >= 0; i--) {
			let item = this.container[i];
			if (item.priority >= priority) {
				// 插入到比较项的后面
				this.container.splice(i + 1, 0, obj);
				flag = true;
				break;
			}
		};
		// 没有比我大的，我就是最大的，插入到容器最开始的位置即可
		!flag ? this.container.unshift(obj) : null;
	},
	// 移除队列
	leave: function leave() {
		if (this.container.length === 0) return;
		return this.container.shift();
	},
	// 查看队列的长度
	size: function size() {
		return this.container.length;
	},
	// 查看队列的内容
	value: function value() {
		return JSON.parse(JSON.stringify(this.container));
	}
};
```
## 事件循环机制
> 先执行主任务，把异步任务放入到循环队列当中，等待主任务执行完毕，在执行队列当中的异步任务。
>> 异步任务先执行微任务，再执行宏任务，一直这样循环下去，反复执行，就是事件循环机制
1. 宏任务：事件绑定、定时器、ajax异步请求
2. 微任务：promise、async、await
```js
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}
async function async2() {
    console.log('async2'); 
}
console.log('script start');
setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});
console.log('script end');
//主任务：创建async1函数，创建async2函数，然后输出'script start'，设置定时器，将定时器放到宏任务队列中
// 执行async1 输出'async1 start',执行await async2输出'async2'，但是await async2下面的代码是微任务，先存放到微任务队列中
//等到async2()返回成功状态再把await下面的代码执行，new Promise会立即执行[exector]函数,输出promise1，
// resolve()异步微任务，等待then把成功失败的方法放到池子里，才去通知方法执行，接着输出'script end'
//通过事件循环机制，先执行微任务队列输出'async1 end'，然后输出then中的方法promise，最后执行宏任务队列定时器输出'setTimeout'
```
## 数据类型转换

 - 把其他数据类型转换为Number类型
    1.特定需要转换为Number的
  	 + Number([val])
     + parseInt/parseFloat([val])
    2.隐式转换（浏览器内部默认要先转换为Number在进行计算的）
       【基本上都是基于Number([val])来完成的】
     + isNaN([val])
     + 数学运算（特殊情况：+在出现字符串的情况下不是数学运算，是字符串拼接）
     + 在==比较的时候，有些值需要转换为数字再进行比较
     + ...
     .......
> Number([val])规则
+ 把字符串转换为数字，要求字符串中所有字符都必须是有效数字才能转换
```js
console.log(Number("")); // 0
console.log(Number("10")); // 10
console.log(Number("10px")); // NaN
```
  + 把布尔转换为数字
```js
console.log(Number(true)); // 1
console.log(Number(false)); // 0
```
+ 把空转换为数字
```js
console.log(Number(null)); // 0
console.log(Number(undefined)); // NaN
```
+ 把Symbol/BigInt转换为数字
```js
console.log(Number(Symbol(''))); // 不允许转换
console.log(Number(BigInt(10))); // 10
```
 + 把对象或者函数转换为数字（先基于toString把对象转换为字符串，再把字符串转换为数字）
 ```js
console.log(Number({
	0: 10
})); // NaN  =>普通对象.toString()是检测数据类型"[object Object]"，再转换为数字NaN
console.log(Number([10])); // 10  =>数组.toString()是转换为字符串"10"
console.log(Number([10, 20])); // NaN  =>"10,20"
console.log(Number([])); // 0  =>""
```
> parseInt/parseFloat([val]) 规则：先把[val]值转换为字符串，再按照从字符串左边第一个字符开始查找，把所有找到的有效数字字符变为数字（直到遇到一个非有效的数字字符则停止查找），如果一个有效数字字符都没有找到，返回结果就是NaN（parseFloat只是比parseInt多识别一个小数点而已）
```js
console.log(parseInt("10px12")); // 10
console.log(parseInt("10.5px")); // 10
console.log(parseFloat("10.5px")); // 10.5
console.log(parseInt("width:10px")); // NaN 
```
- 把其它数据类型转换为字符串
    1. 能使用的办法
      + toString()
      + String()
    2. 隐式转换（一般都是调用其toString）
      + 在加号运算的时候，如果加号的某一边出现字符串，则不是数学运算，而是字符串拼接
      + 把对象转换为数字，需要先toString()转换为字符串，再去转换为数字
      + 基于alert/confirm/prompt/document.write...这些方式输出内容，都是把内容先转换为字符串，然后再输出的
      + 除了“普通对象.toString()”是检测数据类型（因为他们调用的是Object.prototype.toString，这个方法是检测数据类型的），其余的都是调用自己类原型上的toString，也就是用来转换字符串的 
 - 把其它数据类型转换为布尔
   1. 基于以下方式可以把其它数据类型转换为布尔
       + ! 转换为布尔值后取反
       + !! 转换为布尔类型
       + Boolean([val])
     2. 隐式转换
       + 在循环或者条件判断中，条件处理的结果就是布尔类型值
> 规则：只有 `0`、`NaN`、`null`、`undefined`、`空字符串` 五个值会变为布尔的FALSE，其余都是TRUE
```js
console.log(!0); // true
console.log(!!0); // false
console.log(!![]); // true
if(1){
	// 要把1先转换为布尔，验证真假
}

!!({})  TRUE  验证是否为空对象
function isEmptyObject(obj) {
	if (obj === null || typeof obj !== "object") return false;
	let flag = true;
	for (let key in obj) {
		if (!obj.hasOwnProperty(key)) break;
		flag = false;
		break;
	}
	return flag;
}
```
- 在JS中的比较操作有两种
  1.  ==：比较
  2.  ===：绝对比较（switch case基于===比较的） 
  
  > 如果左右两边数据类型不一致，==会默认把数据类型转换为一致的，再去进行比较；===则直接返回false，因为它要求数据类型和值都一样才相等（严谨）；
  
   + 在==比较的过程中，数据转换的规则：
  	*【类型一样的几个特殊点】
    1.  {}=={}：false  对象比较的是堆内存的地址
    2.  []==[]：false
    3.   NaN==NaN：false
    *【类型不一样的转换规则】
      1. null==undefined：true，但是换成===结果是false（因为类型不一致），剩下null/undefined和其它任何数据类型值都不相等
      2. 字符串==对象  要把对象转换为字符串
      3. 剩下如果==两边数据类型不一致，都是需要转换为数字再进行比较

## 闭包作用域和浏览器回收机制
> 创建函数的时候，就已经声明了函数的作用域scope，值是创建函数是所处的上下文
>> 正常情况下，函数执行完，所形成的上下文要出栈释放，以此优化栈内存，但是如果当前上下文中的某个内容，被上下文以外的事物所占用了，则此时形成的私有上下文就不能被出栈释放
>>> 如果当前上下文不被释放，则存储的这些私有变量也不会释放，可以供其下级上下文中调取使用，相当于把一些值`保存`起来，同时也`保护`了自己的私有变量不受外界干扰，避免了全局变量污染,我们把函数执行多带来的保存和八保护作用，称之为"闭包"，[闭包不是任何的代码，而是函数运行的机制]，市面上多认为，只有上下文不被释放才是闭包。我们尽可能少使用闭包，因为他会消耗内存，使用不当造成内存泄漏问题。
### jQuery利用闭包
```js
		// 利用闭包的保护作用：自己编写的代码（类库或者插件）为了防止和外界的变量造成污染，需要放到闭包中
		(function (global, factory) {
			// 在浏览器中运行代码:global=window
			// 在NODE中运行代码:global=global/module
			// factory === anonymous
			"use strict"; //=>采用JS严格模式(默认是非严格模式)
			if (typeof module === "object" && typeof module.exports === "object") {
				// NODE环境下执行（CommonJS模块规范）
				// ...
				module.exports = factory(global, true);
			} else {
				// 浏览器环境  anonymous(window)
				factory(global);
			}
		})(typeof window !== "undefined" ? window : this, function anonymous(window, noGlobal) {
			//【浏览器环境】 window=window  noGlobal=undefined
			//【NODE环境下】 window=global  noGlobal=true

			var jQuery = function (selector, context) {
				// ...
			};

			if (typeof noGlobal === "undefined") {
				// 把闭包中私有的东西暴露到全局上使用
				window.jQuery = window.$ = jQuery;
			}

			return jQuery;
		});

        // $('#box') <=> jQuery('#box')  用的都是闭包中的jQuery方法
```
### 浏览器回收机制
1. 谷歌："查找引用"浏览器不定时去查找当前内存的引用，如果没有被占用，浏览器会回收它
2. IE："引用计数" 当前内存被占用一次就计数累加一次，移除占用就减一，减少到零的时候，浏览器就回收它
##  let / const / var 的区别
### JS中声明变量或者函数的方式
+ 【传统】
	- var n = 10;
	- function func(){}  -> var func=function(){};
+  【ES6】
    - let n = 10;
	- const m = 20;
	- let func = ()=>{};
    - import xxx from 'xxx';
```js
	//=>const设置的是常量，存储的值不能被改变 【不对】
	//=>const创建的变量，它的指针指向一旦确定，不能再被修改【正确】
	//=>let设置的是变量，存储的值可以改变 【正确】
	const n = 10;
	n = 20; //=>Uncaught TypeError: Assignment to constant variable.
    console.log(n); 
    

	const obj = {
	name: 'xxx'
	};
	obj.name = "珠峰培训";
	console.log(obj);  //=> {name:"珠峰培训"}
        
```
### let 和 var 的区别？
  - let不存在变量提升
  - let不允许重复声明
  - let会产生块级作用域
  - 暂时性死区的问题
 ```js
   //暂时性死区（浏览器的BUG）
    console.log(a); //Uncaught ReferenceError: a is not defined
	console.log(typeof a); //=>检测一个未被声明的变量，不会报错，结果是"undefined"
	typeof window !== "undefined"  //=>说明当前环境下存在window（浏览器环境） JQ源码中也是基于这样的方式处理的
	console.log(typeof a); //=>Uncaught ReferenceError: Cannot access 'a' before initialization
    let a;
```
## JS高阶编程技巧
### 单例设计模式
>把描述自己特征的属性方法，放在自己的命名空间下，这样可以防止全局变量的污染（每一个命名空间都是一个单独的实例）=> 基于闭包把其进一步加强：用闭包保存/保护当前模块下私有的属性方法，把需要供别人调用的在暴露出去，形成最早批的模块化思想 
```js
// searchModule命名空间
let searchModule = (function () {
	let n = 10;
	function func() {}
	function queryElement() {}
	return {
		func,
		queryElement
	};
})();

let mengModule = (function () {
	let n = 10;
	function sum() {}
	searchModule.queryElement();
	return {
		sum
	};
})(); 

let listRender = (function () {
	// ... 
	return {
		init() {
			// 控制板块方法的按顺序执行（入口）
		}
	};
})();
listRender.init(); 
```
### 惰性思想
>懒，能够执行一次搞定的，绝对不会重复干两次

```js
//封装一个兼容的事件绑定函数
function handleEvent(element, type, func) {
	if ('addEventListener' in element) {
		handleEvent = function (element, type, func) {
			element.addEventListener(type, func);
		};
	} else if ('attachEvent' in element) {
		handleEvent = function (element, type, func) {
			element.attachEvent('on' + type, func);
		};
	} else {
		handleEvent = function (element, type, func) {
			element['on' + type] = func;
		};
	}
	// 第一次执行重写方法后，需要执行一次才能保证第一次事件也绑定了
	handleEvent(element, type, func);
}

handleEvent(document.body, 'click', function () {
	console.log('BODY点击');
});

handleEvent(document.documentElement, 'mouseenter', function () {
	console.log('HTML进入');
}); 
```
### 柯理化函数编程思想
> 柯理化函数编程思想：利用闭包的保存机制，事先把一些信息存储起来（存储到不释放的上下文中），这样可以供下级上下文中调用 => 我们把这种预先存储的思想叫做柯理化函数编程思想
```js
//柯理化函数思想bind原理
~function(proto){
    function bind(context=window,...outerArgs){
        let _this=this;
        return function(...innerArgs){
            let args=outerArgs.concat(innerArgs);
            _this.call(context,...args);
        }
    }
    proto.bind = bind;
}(Function.prototype);
```
```js
function fn(...outerArgs) {
	// outerArgs = [1,2]
	return function anonymous(...innerArgs) {
		// innerArgs = [3]
		let args = outerArgs.concat(innerArgs);
		return args.reduce((sum, item) => {
			return sum + item;
		}, 0);
	}
}
let res = fn(1, 2)(3);
console.log(res); //=>6  1+2+3
```
### compose函数
```js
/* 
    在函数式编程当中有一个很重要的概念就是函数组合， 实际上就是把处理数据的函数像管道一样连接起来， 然后让数据穿过管道得到最终的结果。 例如：
    const add1 = (x) => x + 1;
    const mul3 = (x) => x * 3;
    const div2 = (x) => x / 2;
    div2(mul3(add1(add1(0)))); //=>3
​
    而这样的写法可读性明显太差了，我们可以构建一个compose函数，它接受任意多个函数作为参数（这些函数都只接受一个参数），然后compose返回的也是一个函数，达到以下的效果：
    const operate = compose(div2, mul3, add1, add1)
    operate(0) //=>相当于div2(mul3(add1(add1(0)))) 
    operate(2) //=>相当于div2(mul3(add1(add1(2))))
​
    简而言之：compose可以把类似于f(g(h(x)))这种写法简化成compose(f, g, h)(x)，请你完成 compose函数的编写 
*/

function compose(...funcs){
    return function(...args){
        let result,
            len=funcs.length;
        if(len===0){
            result=args;
        }else if(len===1){
            result=funcs[0](...args);
        }else{
            result=funcs.reduce((x, y) => {
                return typeof x === 'function' ? y(x(...args)) : y(x);
            });
        }
        return result;
    }
}
```
## 构造函数

 + 构造函数执行 new Xxx() 
 + 构造函数执行就是创建自定义类和类所对应的实例的  
 + =>Func被称为类  f1被称为当前类的一个实例
 1. 像普通函数执行一样，把函数执行，并且私有上下文和形参赋值等都操作一遍
 2. 特殊的操作
   - 在形成私有上下文之后，首先默认会创建一个对象（实例对象）
   - 让当前上下文中的THIS指向创建的这个对象
   - 所以接下来代码执行过程中所有的 this.xxx=xxx 都是给实例对象设置私有的属性和方法
   - 代码执行完成后，看是否有返回值，没有返回值默认返回创建的实例对象，如果有返回值，看返回值的类型，如果返回的是基本类型值，那么最后返回的还是实例对象，果返回的是引用类型值，以自己返回的值为主
   - 因为构造函数执行既有普通函数执行的一面，也有自己特殊的一面，所以在所属私有上下文中，只有this.xxx=xxx才和实例对象有直接关系，而上下文中的私有变量等和实例对象没有必然的联系
 ```js
 function Func(name, age) {
	var n = 10;
	this.name = name;
    this.age = age;
 }
 var f1 = new Func('xxx', 20);
 console.log(f1);
 ```
  + 普通函数执行 
 1. 形成一个私有的上下文 EC(FUNC)，并且进栈执行（AO:name/age/n）
 2. 作用域链<EC(FUNC),EC(G)>/初始THIS:window/初始ARGUMENTS/形参赋值/变量提升
 3. 代码执行 window.name/age='xxx'/20
 4. 是否出栈释放
 ```js
 var f = Func('xxx', 20);
 console.log(f); //=>undefined
 ```
 ```js
 function Func() {
	this.name = 'xxx';
	this.age = 20;
	this.say = function say() {
		console.log(`my name is ${this.name}，i'm ${this.age} years old！`);
	};
}
var f1 = new Func;
var f2 = new Func;
// console.log(f1 === f2); //false
// console.log(f1.say === f2.say); //false
// console.log(f1.name === f2.name); //true
```
 ### 检测当前实例是否率属于这个类
 ```js
 console.log(f1 instanceof Func); //true
 ```

### 检测某个对象是否具备这个属性【in】，再以及是否为私有属性【hasOwnProperty】
```js
 console.log('say' in f1); //true
 console.log(f1.hasOwnProperty('say')); //true 
 ```
 ## 原型和原型链
 ### 面向对象底层运行机制的三句话：
1. 每一个函数(自定义类/内置类/普通函数)都具备一个属性:prototype[原型]，这个属性值是一个对象[浏览器内置开辟的堆]，在这个对象中存储的是，当前类供应给实例调用的公共属性方法
2. 在prototype这个对象中，内置一个constructor属性[类的构造函数]，属性值是当前类本身
3. 每一个对象(普通对象/数组对象.../实例也是对象/prototype也是一个对象...)都具备一个属性：__proto__[原型链]，属性值是当前对象(实例)所属类的prototype
## 重写内置new
```js
function Dog(name) {
	this.name = name;
}
Dog.prototype.bark = function () {
	console.log('wangwang');
};
Dog.prototype.sayName = function () {
	console.log('my name is ' + this.name);
};

/*
 * Func：即将创建的类
 * ARGS：给当前这个类执行时候传递的实参 
 * --------------------
	1. 拥有普通函数执行的一面，让他作为普通函数执行
	2. 创建一个实例对象
		->空对象
		->对象.__proto__===类.prototype
	3.方法执行的时候，方法中的this是实例对象
	4.判断方法的返回结果，如果返回的不是引用类型值，默认把实例返回

	Object.create(xxx)：创建一个空对象，并且让把xxx作为创建对象的原型（空对象.__proto__=xxx），xxx必须是对象或者null，如果xxx是null，则创建一个没有任何原型指向的空对象
 */
// Object.create处理兼容
Object.create = function create(prototype) {
	function Fn() {}
	Fn.prototype = prototype;
	return new Fn;
};

function _new(Func, ...args) {
	let obj = Object.create(Func.prototype);
	let result = Func.call(obj, ...args);
	if (result == null || !/^(object|function)$/.test(typeof result)) return obj;
	return result;
}
let sanmao = _new(Dog, '三毛');
sanmao.bark(); //=>"wangwang"
sanmao.sayName(); //=>"my name is 三毛"
console.log(sanmao instanceof Dog); //=>true
```
## 基于内置类原型扩展方法

 ### 向内置类的原型上扩展方法，存在的细节知识：
1. 为了防止自己设定的方法覆盖内置的方法，我们设置的方法名加前缀 
2. 优势：使用起来方便，和内置方法类似，直接让实例调用即可
3. 方法中的THIS一般是当前要操作的实例（也就不需要基于形参传递实例进来了）
4. 优势：只要保证方法的返回结果还是当前类的实例，那么我们就可以基于“链式方法”调用当前类中提供的其它方法【返回结果是谁的实例，就可以继续调用谁的方法】
```js 
 
Array.prototype.myDistinct = function myDistinct() {
	// this -> arr
	// ES6中的Set结构（不重复的数组）：Set类的实例
	// let newArr = [...new Set(this)];
	let newArr = Array.from(new Set(this));
	return newArr;
};
let arr = [1, 2, 3, 2, 3, 2, 1, 2, 3, 4, 3, 2, 1];
arr = arr.myDistinct().reverse().map(item => item * 10);
console.log(arr); 
*/

/* FOR IN 遍历对象，所有可以被枚举的属性都可以遍历到（大部分私有属性和自己向内置类原型上扩展的属性）：所以处理FOR IN循环的时候，我们需要加hasOwnProperty判断 */
Object.prototype.myXx = function () {};
let obj = {
	name: 'xxx',
	age: 20
};
/* for (let key in obj) {
	if (!obj.hasOwnProperty(key)) break;
	console.log(key, obj[key]);
} */

// 这样也可以，Object.keys(obj)只会获取所有私有的属性
Object.keys(obj).forEach(key => {
	console.log(key, obj[key]);
});
```