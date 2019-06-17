function call(fn, obj, ...params) {
  const name = Math.random();
  obj[name] = fn;
  const result = obj[name](...params);
  obj[name] = undefined;
  return result;
}