class PromiseA {
  constructor(callback) {
    this.state = 'pending';
    this.queue = [];
    this.isPromiseA = true;

    const _resolve = ret => {
      if (this.state !== 'pending') return;
      this.state = 'fullfillled';
      while (this.queue.length) {
        const p = this.queue.shift();
        ret = p.onFullfilled && p.onFullfilled(ret);
        if (ret && ret.isPromiseA) {
          ret.queue = this.queue;
          return;
        }
      }
    }
    const _reject = ret => {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      while (this.queue.length) {
        const p = this.queue.shift();
        ret = p.onRejected && p.onRejected(ret);
        if (ret && ret.isPromiseA) {
          ret.queue = this.queue;
          return;
        }
      }
    }
    callback(
      args => setTimeout(() => _resolve(args), 0),
      args => setTimeout(() => _reject(args), 0)
    );
  }

  then(onFullfilled, onRejected) {
    const handler = {};
    if (typeof onFullfilled === 'function') {
      handler.onFullfilled = onFullfilled;
    }
    if (typeof onRejected === 'function') {
      handler.onRejected = onRejected;
    }
    this.queue.push(handler);
    return this;
  }

  catch (onRejected) {
    let lastHandler = this.queue[this.queue.length - 1];
    if (!lastHandler.onRejected) {
      lastHandler.onRejected = onRejected;
    } else {
      this.then(null, onRejected);
    }
    return this;
  } 
  
  finally(onFinally) {
    this.then(onFinally, onFinally);
    return this;
  }
}

PromiseA.resolve = res => {
  return new PromiseA(resolve => {
    resolve(res);
  });
}

PromiseA.reject = res => {
  return new PromiseA((resolve, reject) => {
    reject(res);
  });
}

PromiseA.all = ps => {
  return new PromiseA((resolve, reject) => {
    let result = [];
    ps.map(p => {
      p
        .then(res => {
          result.push(res);
          if (result.length === ps.length) {
            resolve(result);
          }
        })
        .catch(err => {
          reject(err);
        });
    })
  });
}

PromiseA.race = ps => {
  return new PromiseA((resolve, reject) => {
    ps.map(p => {
      p
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    })
  });
}

module.exports = PromiseA;