# 手动实现JS标准 API

## JSON

### JSON.parse

```js
// json/parse.js
```

### JSON.stringify

```js
// json/stringify.js
```

## Promise

### PromiseA

```js
// promise/promiseA.js
```

## Ease

缓动函数的实现。

```js
// ease/index.js
easeMove(1000, 500, 'linear', (c) => {
  $b1.style.transform = `translateX(${c}px)`;
});
easeMove(1000, 500, 'easeIn', (c) => {
  $b2.style.transform = `translateX(${c}px)`;
});
easeMove(1000, 500, 'easeOut', (c) => {
  $b3.style.transform = `translateX(${c}px)`;
});
easeMove(1000, 500, 'easeInOut', (c) => {
  $b4.style.transform = `translateX(${c}px)`;
});
```