---
title: js的class
author: lazySir
tags: [js]
description:  当你想要定义一个包含一些方法和属性的对象时，你可以使用 JavaScript 类。在 JavaScript 中，类是一种基于原型的对象，它可以帮助您组织和维护代码。
cover: 
date: 2023-04-05
---



# 一、定义类

类可以通过 class 关键字来定义。在类定义中，您可以声明类的属性和方法。以下是一个简单的类定义示例：

```js
 Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log(`Hello, my name is ${this.name} and I'm ${this.age} years old.`);
  }
}
```

在上述示例中，我们定义了一个名为 `Person` 的类，并在其中声明了 `name` 和 `age` 属性以及 `sayHello()` 方法。`constructor()` 方法是类的构造函数，它用于初始化类的属性和方法。在构造函数中，我们使用 `this` 关键字来引用类的实例，并将传递给类的参数分配给类的属性。

注意，方法的定义语法不同于函数定义。在类中，您不需要使用 `function` 关键字来定义方法。

# 二、创建类实例

要使用类，您需要创建一个类实例。类实例可以通过使用 `new` 操作符和类的构造函数来创建。以下是一个使用上述 `Person` 类创建实例的示例：

```js
 john = new Person('John', 30);
john.sayHello(); // 输出 'Hello, my name is John and I'm 30 years old.'
```

在上述示例中，我们使用 `new` 操作符和 `Person` 构造函数创建了一个名为 `john` 的 `Person` 实例。然后，我们调用 `john` 实例上的 `sayHello()` 方法。

# 三、继承类

类可以通过继承来扩展。要继承一个类，您可以使用 `extends` 关键字来创建一个子类。子类可以使用父类的属性和方法，并且还可以定义自己的属性和方法。

以下是一个使用继承创建子类的示例：

```js
 Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }

  study() {
    console.log(`${this.name} is studying in grade ${this.grade}.`);
  }
}
```

在上述示例中，我们定义了一个名为 `Student` 的子类，并使用 `extends` 关键字来继承 `Person` 父类。在子类的构造函数中，我们使用 `super()` 方法调用父类的构造函数，并将传递给子类的参数传递给父类。然后，我们定义了一个 `study()` 方法来描述学生的学习行为，并在其中使用子类的属性和父类的方法。

现在，我们可以使用 `Student` 子类来创建一个新的学生实例：

```js
const mary = new Student('Mary', 20, 12);
mary.sayHello(); // 输出 'Hello, my name is Mary and I'm 20 years old.'
mary.study(); // 输出 'Mary is studying in grade 12
```
# 四、静态方法

类还可以包含静态方法，这些方法可以通过类本身调用，而不是通过类的实例调用。静态方法通常用于执行与类本身相关的操作。

以下是一个使用静态方法的示例：

```js
class MathHelper {
  static add(a, b) {
    return a + b;
  }
  static subtract(a, b) {
    return a - b;
  }
}
```

在上述示例中，我们定义了一个名为 `MathHelper` 的类，并声明了两个静态方法：`add()` 和 `subtract()`。这些方法可以直接通过 `MathHelper` 类来调用，而不需要创建类的实例。

```js
console.log(MathHelper.add(1, 2)); // 输出 3
console.log(MathHelper.subtract(3, 2)); // 输出 1
```

# 五、getter 和 setter

类还可以包含 getter 和 setter 方法，用于在访问类的属性时执行额外的逻辑。getter 和 setter 方法使得您可以隐藏类的实现细节，并提供更好的封装。

以下是一个使用 getter 和 setter 方法的示例：

```js
class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    if (value <= 0) {
      throw new Error('Width must be positive');
    }
    this._width = value;
  }

  get height() {
    return this._height;
  }

  set height(value) {
    if (value <= 0) {
      throw new Error('Height must be positive');
    }
    this._height = value;
  }

  get area() {
    return this._width * this._height;
  }
}
```

在上述示例中，我们定义了一个名为 `Rectangle` 的类，并声明了 `width`、`height` 和 `area` 属性。我们还定义了 `get` 和 `set` 方法来访问 `width` 和 `height` 属性。在这些方法中，我们使用 `_width` 和 `_height` 私有变量来存储属性的实际值。在 `set` 方法中，我们添加了一些额外的逻辑来验证属性值，并在无效值时引发错误。在 `area` 方法中，我们使用 `width` 和 `height` 的 getter 方法来计算矩形的面积。

现在，我们可以创建一个新的矩形实例，并访问其属性：

```js
const rect = new Rectangle(10, 20);
console.log(rect.width); // 输出 10
console.log(rect.height); // 输出 20
console.log(rect.area); // 输出 200
rect.width = 30;
console.log(rect.width); // 输出 30
console.log(rect.area); // 输出 600
```

在上述示例中，我们创建了一个名为 `rect` 的 `Rectangle` 实例，并访问其属性和方法。

# 六、结论

在 JavaScript 中，类是一种基于原型的对象，它可以帮助您组织和维护代码。通过定义类的属性和方法，您可以创建一个包含行为和状态的对象。通过继承和静态方法，您可以扩展和定制类的行为。getter 和 setter 方法使得您可以隐藏类的实现细节，并提供更好的封装。

当您需要定义一个包含一些方法和属性的对象时，类是一个非常有用的特性。它可以帮助您组织和维护代码，使得代码更加可读和易于理解。