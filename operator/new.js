function mnew(ctor, ...props) {
  // 1. 创建一个新对象
  const o = new Object();
  // 2. 将this指向这个新对象
  const _this = o;
  // 3. 设置this的原型原型指向构造器的原型
  _this.__proto__ = ctor.prototype;
  // 4. 调用构造函数的call方法
  ctor.call(_this, ...props);
  // 5. 返回this
  return _this;
}