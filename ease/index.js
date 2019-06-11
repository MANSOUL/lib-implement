;
const easeMove = (function iife() {
  function linear(time, begin, change, duration) {
    return change * (time / duration) + begin;
  }

  function easeIn(time, begin, change, duration) {
    return change * Math.pow(time / duration, 2) + begin;
  }

  function easeOut(time, begin, change, duration) {
    return change * Math.sqrt(time / duration, 2) + begin;
  }

  function easeInOut(time, begin, change, duration) {
    if (time / duration < 0.5) {
      return easeIn(time, begin, change / 2, duration / 2);
    } else {
      let t = time - duration / 2;
      let b = begin + change / 2;
      return easeOut(t, b, change / 2, duration / 2);
    }
  }

  function move(duration, target, type, fn) {
    const begin = 0;
    const change = target - begin;
    const beginTime = Date.now();
    const m = function () {
      const now = Date.now();
      const time = now - beginTime <= duration ? now - beginTime : duration;
      let current = 0;
      switch (type) {
        case 'easeIn':
          current = easeIn(time, begin, change, duration);
          break;
        case 'easeOut':
          current = easeOut(time, begin, change, duration);
          break;
        case 'easeInOut':
          current = easeInOut(time, begin, change, duration);
          break;
        case 'linear':
          current = linear(time, begin, change, duration);
          break;
      }
      fn(current);
      if (current >= target) {
        return;
      }
      requestAnimationFrame(m);
    }
    m();
  }
  
  return move;
})();