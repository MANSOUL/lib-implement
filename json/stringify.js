function type (v) {
  return Object.prototype.toString.call(v).toLowerCase().slice(8, -1);
}

function appendKey (s, k, v, isArray) {
  let kv = isArray ? handleV(v) : `"${k}": ${handleV(v)}`;
  let begin = s.slice(0, -1);
  let end = s.slice(-1);
  if (!(/(\[|{)\s*$/.test(begin))) {
    kv = ', ' + kv;
  }
  return begin + kv + end;
}

function loopAttribute (str, c) {
  for (let k in c) {
    if (c.hasOwnProperty(k)) {
      if (type(c[k]) === 'array' || type(c[k]) === 'object') {
        str = appendKey(str, k, stringify(c[k]), Array.isArray(c));
      } else {
        str = appendKey(str, k, c[k], Array.isArray(c));
      }
    }
  }
  return str;
}

function handleV (v) {
  const t = type(v);
  if (t === 'string') {
    if (/^[{\[].*[\]}]$/.test(v)) {
      return v;
    }
    return `"${v}"`;
  } else if (t === 'number') {
    return isNaN(v) ? null : v + '';
  } else if (t === 'boolean') {
    return v + '';
  }
  return null;
}

function stringify(o) {
  if (type(o) !== 'array' && type(o) !== 'object') {
    return handleV(o);
  }
  let str = Array.isArray(o) ? '[]' : '{}'; 
  str = loopAttribute(str, o);
  return str;
}

console.log(stringify({
  a: 1,
  b: 'hello',
  c: [
    1, 2, 3, [4, 5, 6]
  ],
  d: {
    e: false,
    f: NaN,
    g: null
  }
}));

// test
console.log(stringify([1, 2, 3]))