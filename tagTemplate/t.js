import parse from './lexical.js';
import generate from './syntax.js';
import { tValue } from './utils.js';

function t (statics, ...values) {
  let html = '';
  statics.map((s, i) => {
    html += s + tValue(values[i]);
  });
  return html;
}

function render () {
  let name = 'Fruit List';
  let fruits = ['Apple', 'Banana', 'Peach'];
  let template =  
  t`
    <div class="block">
      <ul class="list">
        ${
          fruits.map((f, index) => {
            return t`<li class="list__item" data-index=${index}>
                      ${
                        f.split('').map(c => t`<span>${c}</span>`)
                      }
                    </li> `
          })
        }
      </ul>  
      <p class="block__desc">${name} ${null}</p>
    </div>
  `;
  return template;
}

console.log(render())
console.log(parse(render()))
console.log(generate(parse(render())))