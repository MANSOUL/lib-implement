class P {
  constructor(handler) {
    this._index = 0;
    const resolveCallback = this.resolveCallback = [];
    const rejectCallback = this.rejectCallback = [];
    const _loopResolve = (lRes) => {
      const cb = resolveCallback.shift();
      if (cb === undefined) {
        if (resolveCallback.length > 0) {
          return _loopResolve(lRes);
        } else {
          return;
        }
      }
      lRes = cb.cb(lRes);
      if (lRes instanceof P) {
        lRes.then(_loopResolve).catch(_loopReject);
      } else {
        if (resolveCallback.length > 0) {
          _loopResolve(lRes);
        }
      }
    }
    const _loopReject = (lRes) => {
      const cb = rejectCallback.shift();
      if (cb === undefined) {
        if (resolveCallback.length > 0) {
          return _loopReject(lRes);
        } else {
          return;
        }
      }
      lRes = cb.cb(lRes);
      for (let index = 0; index <= cb.index; index++) {
        resolveCallback[index] = undefined;
      }
      if (lRes instanceof P) {
        lRes.then(_loopResolve).catch(_loopReject);
      } else {
        if (rejectCallback.length > 0) {
          _loopReject(lRes);
        }
      }
    }
    const _resolve = (res) => setTimeout(() => _loopResolve(res), 0);
    const _reject = (err) => setTimeout(() => _loopReject(err), 0);
    handler(_resolve, _reject);
  }

  then(cb) {
    if (typeof cb !== 'function') {
      throw new TypeError('cb must be function');
    }
    this.resolveCallback.push({
      cb,
      index: this._index++
    });
    this.rejectCallback.push(undefined);
    return this;
  }

  catch (cb) {
    if (typeof cb !== 'function') {
      throw new TypeError('cb must be function');
    }
    this.rejectCallback.push({
      cb,
      index: this._index++
    });
    this.resolveCallback.push(undefined);
    return this;
  } 
  
  finally() {

  }
}