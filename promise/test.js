const PromiseA = require('./promiseA');

const oP = new PromiseA((resolve, reject) => {
  setTimeout(() => resolve(1), 1000);
});

oP.then(step => ++step)
  .then(step => ++step)
  .then(step => {
    console.log(step);
    return step;
  })
  .finally(res => {
    console.log('finally1: ', res);
    return res;
  })
  .then(step => {
    console.log(step);
    return new PromiseA(
      (resolve, reject) => reject('fail when step equals to: ' + step)
    )
  })
  .then(res => console.log('before finally2:', res))
  .catch(error => {
    console.log('error: ', error);
    return error;
  })
  .finally(res => console.log('finally2: ', res));

new PromiseA((resolve, reject) => {
    setTimeout(reject, 10, 'haha')
  })
  .then(r => console.log(r)).catch(r => console.log('Oh Yeah:', r))

PromiseA.resolve(0).then(r => console.log('PromiseA.resolve:', r));

PromiseA.reject(1).then(r => console.log(r)).catch(r => console.log('PromiseA.reject:', r));

PromiseA.all([PromiseA.resolve(1), PromiseA.resolve(0)])
  .then(a => console.log('PromiseA.all:', a))
  .catch(a => console.log('PromiseA.all error: ', a));

let pa = PromiseA.all([PromiseA.resolve(1), PromiseA.reject(0)])
pa
  .then(a => console.log('PromiseA.all:', a))
  .catch(a => console.log('PromiseA.all error: ', a));

PromiseA.race([PromiseA.reject(1), PromiseA.resolve(0)])
  .then(a => console.log(a))
  .catch(a => console.log('race error: ', a));