Function.prototype.mBind = function(obj, ...args) {
  return (...innerArgs) => {
    this.call(obj, ...args, ...innerArgs)
  }
}