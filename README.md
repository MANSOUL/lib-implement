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

## HTML模版解析

将HTML模版解析成抽象语法树，这是实现一个MVVM库的第一步，嘻嘻^_^

### 词法解析

```js
// tagTemplate/lexical.js
```

### 语法解析

```js
// tagTemplate/syntax.js
```

```js
import {t, ast} from './t.js';
function render () {
  let name = 'Fruit List';
  let fruits = ['Apple', 'Banana', 'Peach'];
  return ast(t`
    <div class="block">
      <ul class="list">
        ${
          fruits.map((f, index) => {
            return t`<li class="list__item" key=${index} data-index=${index}>
                      ${
                        f.split('').map(c => t`<span>${c}</span>`)
                      }
                    </li> `
          })
        }
      </ul>  
      <p class="block__desc">${name} ${null}</p>
    </div>
  `);
}

const DOM = {
  setProps ($el, props) {
    for(let k in props) {
      if (props.hasOwnProperty(k)) {
        $el.setAttribute(k, props[k]);
      }
    }
  },
  appendChildren($el, children) {
    let $fragment = document.createDocumentFragment();
    children.map(node => {
      $fragment.appendChild(this.createNode(node));
    });
    return $el.appendChild($fragment);
  },
  setTextContent($el, content) {
    $el.textContent = content;
  },
  createElment (type) {
    return document.createElement(type);
  },
  createNode (node) {
    let {type, props, children, value} = node;
    let $el = this.createElment(type);
    this.setProps($el, props);
    children.length > 0 && this.appendChildren($el, children);
    value && this.setTextContent($el, value);
    return $el;
  },
  render(id, ast) {
    let $root = this.createNode(ast)
    document.querySelector(id).appendChild($root);
    return $root;
  }
}
console.log(render());
console.log(DOM.render('#app', render()));
```