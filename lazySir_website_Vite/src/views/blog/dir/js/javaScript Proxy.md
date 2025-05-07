---
title: js的proxy
author: lazySir
tags: [js]
description:  当你在开发 JavaScript 应用程序时，您通常需要处理数据。Proxy 是 ES6 引入的一个特殊对象，它允许您拦截并自定义 JavaScript 对象上的底层操作。使用 Proxy，您可以捕获和处理对象上的许多操作，包括属性读取、属性赋值、方法调用和构造函数调用。您可以使用 Proxy 来创建一个“代理”对象，该对象会在底层对象上拦截这些操作并执行特定的操作，例如验证、过滤、转换和缓存。
cover: https://cdn.jsdelivr.net/gh/lazySir/image-host@main/lazySir_website/blog/js/js.png
date: 2023-04-05
---



# 一、Proxy 的基本用法
Proxy 对象由一个目标对象（也称为被代理对象）和一个处理程序对象（也称为代理处理程序）组成。目标对象是您要代理的对象，处理程序对象是一个包含捕获处理程序的对象，用于处理拦截的操作。

以下是使用 Proxy 的基本用法：
```js
const myObj = { name: 'John', age: 30 };
const handler = {
  get(target, property) {
    console.log(`Reading property '${property}'`);
    return target[property];
  },
  set(target, property, value) {
    console.log(`Setting property '${property}' to '${value}'`);
    target[property] = value;
  },
};
const myProxy = new Proxy(myObj, handler);
```
在上面的示例中，我们创建了一个普通对象 myObj，并定义了一个处理程序对象 handler，其中包含 get() 和 set() 拦截器。然后，我们使用 new Proxy() 方法创建了一个代理对象 myProxy，并将目标对象 myObj 和处理程序对象 handler 传递给它。

现在，我们可以使用 myProxy 对象来访问 myObj 中的属性，并且每次访问都会触发拦截器函数。例如：

```js
console.log(myProxy.name); // Reading property 'name'，输出 'John'
myProxy.age = 40; // Setting property 'age' to '40'
console.log(myProxy.age); // Reading property 'age'，输出 '40'

```

在上述示例中，我们首先读取了·` myProxy `中的` name `属性，并输出了一条消息。然后，我们将` myProxy `中的 `age` 属性设置为 40，并输出了一条设置消息。最后，我们再次读取了` myProxy` 中的 `age `属性，并输出了一条读取消息。

# 二、Proxy 拦截器
Proxy 拦截器是指在处理程序对象中定义的函数，用于拦截和处理代理对象上的底层操作。以下是一些常用的 Proxy 拦截器：

## 1.get() 拦截器
`get() `拦截器用于拦截对代理对象中指定属性的读取操作。当您访问代理对象上的属性时，`get() `拦截器会被触发，并返回属性值。

以下是一个使用`get()` 拦截器的示例：

```js
const myObj = { name: 'John', age: 30 };
const handler = {
  get(target, property) {
    console.log(`Reading property '${property}'`);
    return target[property];
  },
};
const myProxy = new Proxy(myObj, handler);

console.log(myProxy.name); // Reading property 'name'，输出 'John'
console.log(myProxy.age); // Reading property 'age'，输出 '30'

```

在上述示例中，我们创建了一个普通对象 myObj 和一个处理程序对象 handler，其中包含 get() 拦截器。然后，我们使用 new Proxy() 方法创建了一个代理对象 myProxy，并将目标对象 myObj 和处理程序对象 handler 传递给它。当我们读取 myProxy 的属性时，拦截器会被触发，并输出一条消息，然后返回属性值。

## 2.set() 拦截器
`set()` 拦截器用于拦截对代理对象中指定属性的赋值操作。当您将值分配给代理对象的属性时，`set() `拦截器会被触发，并设置属性的新值。

以下是一个使用 `set()` 拦截器的示例：

```js
const myObj = { name: 'John', age: 30 };
const handler = {
  set(target, property, value) {
    console.log(`Setting property '${property}' to '${value}'`);
    target[property] = value;
  },
};
const myProxy = new Proxy(myObj, handler);

myProxy.age = 40; // Setting property 'age' to '40'
console.log(myProxy.age); // 输出 '40'

```
在上述示例中，我们创建了一个普通对象 `myObj `和一个处理程序对象 `handler`，其中包含 `set()` 拦截器。然后，我们使用` new Proxy() `方法创建了一个代理对象 `myProxy`，并将目标对象` myObj `和处理程序对象 `handler` 传递给它。当我们将新值分配给` myProxy` 的属性时，拦截器会被触发，并输出一条消息，然后设置属性的新值。

## 3.has() 拦截器
`has() `拦截器用于拦截 in 操作符。当您使用 `in `操作符检查代理对象中是否存在指定的属性时，`has()` 拦截器会被触发，并返回` true` 或 `false`。

以下是一个使用` has() `拦截器的示例：
```js
const myObj = { name: 'John', age: 30 };
const handler = {
  has(target, property) {
    console.log(`Checking property '${property}' existence`);
    return property in target;
  },
};
const myProxy = new Proxy(myObj, handler);

console.log('name' in myProxy); // Checking property 'name' existence，输出 'true'
console.log('address' in myProxy); // Checking property 'address' existence，输出 'false'
```

在上述示例中，我们创建了一个普通对象 myObj 和一个处理程序对象 handler，其中包含 has()
拦截器。然后，我们使用 `new Proxy()` 方法创建了一个代理对象 `myProxy`，并将目标对象 `myObj` 和处理程序对象 `handler` 传递给它。当我们使用 `in` 操作符检查 `myProxy` 中是否存在属性时，拦截器会被触发，并输出一条消息，然后返回 `true` 或 `false`。

## 4.apply() 拦截器

`apply()` 拦截器用于拦截对代理对象中指定方法的调用。当您调用代理对象上的方法时，`apply()` 拦截器会被触发，并执行一些特定的操作。

以下是一个使用 `apply()` 拦截器的示例：

```js
javascriptCopy codeconst myObj = {
  add(a, b) {
    return a + b;
  },
};
const handler = {
  apply(target, thisArg, argumentsList) {
    console.log(`Calling method '${target.name}'`);
    return target.apply(thisArg, argumentsList);
  },
};
const myProxy = new Proxy(myObj.add, handler);

console.log(myProxy(2, 3)); // Calling method 'add'，输出 '5'
```

在上述示例中，我们创建了一个包含 `add()` 方法的普通对象 `myObj`，并定义了一个处理程序对象 `handler`，其中包含 `apply()` 拦截器。然后，我们使用 `new Proxy()` 方法创建了一个代理对象 `myProxy`，并将 `myObj.add` 和处理程序对象 `handler` 传递给它。当我们调用 `myProxy` 的方法时，拦截器会被触发，并输出一条消息，然后调用原始方法并返回其结果。

## 5.construct() 拦截器

`construct()` 拦截器用于拦截对代理对象中指定构造函数的调用。当您使用 `new` 操作符创建代理对象的实例时，`construct()` 拦截器会被触发，并执行一些特定的操作。

以下是一个使用 `construct()` 拦截器的示例：

```js
javascriptCopy codeclass Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
const handler = {
  construct(target, argumentsList, newTarget) {
    console.log(`Creating a new instance of '${target.name}'`);
    return new target(...argumentsList);
  },
};
const PersonProxy = new Proxy(Person, handler);

const john = new PersonProxy('John', 30); // Creating a new instance of 'Person'
console.log(john); // 输出 { name: 'John', age: 30 }
```

在上述示例中，我们定义了一个 `Person` 类，并定义了一个处理程序对象 `handler`，其中包含 `construct()` 拦截器。然后，我们使用 `new Proxy()` 方法创建了一个代理对象 `PersonProxy`，并将 `Person` 类和处理程序对象 `handler` 传递给它。当我们使用 `new` 操作符创建 `PersonProxy` 的实例时，拦截器会被触发，并输出一条消息，然后创建一个新的 `Person` 实
例并返回它。

# 三、Proxy 的高级用法

除了基本用法和常见拦截器之外，Proxy 还有一些高级用法，如 Proxy 的嵌套、元属性、反射 API 和代理类等。

## 1.嵌套 Proxy

您可以在一个代理对象中嵌套另一个代理对象。当您访问嵌套代理对象中的属性时，将触发内部代理对象上的拦截器。

以下是一个嵌套代理对象的示例：

```js
javascriptCopy codeconst myObj = { name: 'John', age: 30 };
const handler1 = {
  get(target, property) {
    console.log(`Reading property '${property}' from outer object`);
    return target[property];
  },
};
const handler2 = {
  get(target, property) {
    console.log(`Reading property '${property}' from inner object`);
    return target[property];
  },
};
const myProxy1 = new Proxy(myObj, handler1);
const myProxy2 = new Proxy(myProxy1, handler2);

console.log(myProxy2.name); // Reading property 'name' from inner object，输出 'John'
console.log(myProxy2.age); // Reading property 'age' from inner object，输出 '30'
```

在上述示例中，我们创建了一个普通对象 `myObj`，并定义了两个处理程序对象 `handler1` 和 `handler2`，其中包含 `get()` 拦截器。然后，我们使用 `new Proxy()` 方法创建了两个代理对象 `myProxy1` 和 `myProxy2`，并将 `myObj` 和处理程序对象 `handler1` 和 `handler2` 传递给它们。当我们读取 `myProxy2` 的属性时，拦截器会被触发，并输出一条消息，然后返回属性值。

## 2.元属性

元属性是指在代理对象上附加的元数据属性。这些属性不会被目标对象和代理处理程序之间的代理行为所影响，但它们可以用于存储与代理对象相关的其他信息。

以下是一个使用元属性的示例：

```js
javascriptCopy codeconst myObj = { name: 'John', age: 30 };
const handler = {
  get(target, property, proxy) {
    if (property === '__proxy__') {
      return proxy;
    }
    console.log(`Reading property '${property}'`);
    return target[property];
  },
};
const myProxy = new Proxy(myObj, handler);
myProxy.__proxy__ = 'myProxy';

console.log(myProxy.__proxy__); // 输出 'myProxy'
console.log(myObj.__proxy__); // 输出 undefined
```

在上述示例中，我们创建了一个普通对象 `myObj`，并定义了一个处理程序对象 `handler`，其中包含 `get()` 拦截器。然后，我们使用 `new Proxy()` 方法创建了一个代理对象 `myProxy`，并将 `myObj` 和处理程序对象 `handler` 传递给它。然后，我们将一个名为 `__proxy__` 的元属性添加到 `myProxy` 中，并将其值设置为 `'myProxy'`。当我们读取 `myProxy` 的 `__proxy__`### Reflect API

Reflect API 是一组静态方法，用于在代理对象和目标对象之间进行反射操作。这些方法提供了一种更直接的方式来操作代理对象，而无需在处理程序中手动实现拦截器。

以下是一些使用 Reflect API 的示例：

```js
javascriptCopy codeconst myObj = { name: 'John', age: 30 };
const handler = {
  get(target, property) {
    console.log(`Reading property '${property}'`);
    return Reflect.get(target, property);
  },
};
const myProxy = new Proxy(myObj, handler);

console.log(myProxy.name); // Reading property 'name'，输出 'John'
console.log(Reflect.get(myProxy, 'age')); // 输出 '30'
```

在上述示例中，我们创建了一个普通对象 `myObj` 和一个处理程序对象 `handler`，其中包含 `get()` 拦截器。然后，我们使用 `new Proxy()` 方法创建了一个代理对象 `myProxy`，并将 `myObj` 和处理程序对象 `handler` 传递给它。当我们读取 `myProxy` 的属性时，拦截器会被触发，并输出一条消息，然后使用 `Reflect.get()` 方法获取属性的值。

## 3.代理类

代理类是一种特殊的代理对象，它可以通过继承 `Proxy` 类来创建。这种代理对象与普通代理对象的主要区别在于，它可以拦截所有未定义的操作，而不需要手动实现相应的拦截器。

以下是一个使用代理类的示例：

```js
javascriptCopy codeclass MyProxy extends Proxy {
  constructor(target, handler) {
    super(target, handler);
  }
  unknownPropertyHandler(property) {
    console.log(`Reading unknown property '${property}'`);
    return Reflect.get(this.target, property);
  }
}
const myObj = { name: 'John', age: 30 };
const myProxy = new MyProxy(myObj, {});

console.log(myProxy.name); // 输出 'John'
console.log(myProxy.address); // Reading unknown property 'address'，输出 undefined
```

在上述示例中，我们定义了一个名为 `MyProxy` 的代理类，它继承了 `Proxy` 类。然后，我们定义了一个未定义属性的处理方法 `unknownPropertyHandler()`，并在 `MyProxy` 的构造函数中调用了 `super()` 方法来创建代理对象。当我们读取 `myProxy` 的未定义属性时，处理方法会被触发，并输出一条消息，然后返回 `undefined`。

# 四、结论

Proxy 是 JavaScript 中一个非常强大和灵活的特性，可以用于拦截和控制对对象和方法的访问。通过定义不同的拦截器和元属性，您可以自定义代理对象的行为，并在其中执行特定的操作。无论您是开发 Web 应用程序、Node.js 应用程序还是桌面应用程序，Proxy 都是一个非常有用的