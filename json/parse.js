const parse = (function iife() {
  const regObj = /^\s*{.*}\s*$/;
  const regArr = /^\s*\[.*\]\s*$/;
  
  function push(o, k, v) {
    if (Array.isArray(o)) {
      o.push(v);
    } else {
      o[k] = v;
    }
  }
  
  function handleV(v, tag) {
    switch (tag) {
      case 2:
        return v;
      case 3:
        return Number(v);
      case 4:
        return null;
      case 5:
        return v === 'true' ? true : false;
      default:
        break;
    }
  }
  
  function find(str, index, leftTag, rightTag) {
    let len = index;
    let c = 0;
    let flag = false;
    for (let i = index; i < str.length; i++) {
      const e = str[i];
      ++len;
      if (e === leftTag) {
        ++c;
        flag = true;
      } else if (e === rightTag) {
        --c;
      }
      if (flag && c === 0) {
        break;
      }
    }
    return len;
  }
  
  function parseObject(o, str) {
    let regSplitObject = /\s*"(.*?)"\s*:\s*((\[.*\])|({.*})|"(.*?)"|([\d\.]+)|(null)|(true|false))\s*/g;
    let m = null;
    while(m = regSplitObject.exec(str)) {
      if (regObj.test(m[4])) {
        const len = find(str, m.index, '{', '}');
        const subStr = str.substring(m.index, len);
        push(
          o, 
          [m[1]], 
          parse(subStr.substring(subStr.indexOf('{')))
        );
        regSplitObject.lastIndex = len + 1;
      } else if (regArr.test(m[3])) {
        const len = find(str, m.index, '[', ']');
        const subStr = str.substring(m.index, len);
        push(
          o, 
          [m[1]], 
          parse(subStr.substring(subStr.indexOf('[')))
        );
        regSplitObject.lastIndex = len + 1;
      } else {
        let v = null;
        if (m[5]) {
          v = handleV(m[5], 2);
        } else if (m[6]) {
          v = handleV(m[6], 3);
        } else if (m[7]) {
          v = handleV(m[7], 4);
        } else if (m[8]) {
          v = handleV(m[8], 5);
        }
        push(o, m[1], v);
      }
    }
  }
  
  function parseArray(o, str) {
    let regSplitArray = /\s*((\[.*\])|({.*})|(".*?")|([\d\.]+)|(null)|(true|false))\s*/g;
    let m = null;
    while (m = regSplitArray.exec(str)) {
      if (regObj.test(m[3])) {
        const len = find(str, m.index, '{', '}');
        const subStr = str.substring(m.index, len);
        push(
          o,
          [m[1]],
          parse(subStr.substring(subStr.indexOf('{')))
        );
        regSplitArray.lastIndex = len + 1;
      } else if(regArr.test(m[2])) {
        const len = find(str, m.index, '[', ']');
        const subStr = str.substring(m.index, len);
        push(
          o,
          [m[1]],
          parse(subStr.substring(subStr.indexOf('[')))
        );
        regSplitArray.lastIndex = len + 1;
      } else {
        let v = null;
        if (m[4]) {
          v = handleV(m[4], 2);
        } else if (m[5]) {
          v = handleV(m[5], 3);
        } else if (m[6]) {
          v = handleV(m[6], 4);
        } else if (m[7]) {
          v = handleV(m[7], 5);
        }
        push(o, null, v);
      }
    }
  }
  
  function parse(str) {
    let o = null;
    if (regObj.exec(str)) {
      o = {};
      str = str.replace(/^\s*{|}\s*$/g, '');
      parseObject(o, str);
    } else if (regArr.exec(str)) {
      o = [];
      str = str.replace(/^\s*\[|\]\s*$/g, '');
      parseArray(o, str);
    }
    return o;
  }

  return parse;
})();