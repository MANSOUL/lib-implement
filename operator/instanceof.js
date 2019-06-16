function minstanceof(obj, ctor) {
  const objProto = obj.__proto__;
  if (
    !objProto ||
    typeof ctor !== 'function' ||
    (typeof obj !== 'object' && typeof obj !== 'function') ||
    (ctor !== Object && objProto === Object.prototype)
  ) {
    return false;
  }
  if (objProto === ctor.prototype) {
    return true;
  }
  return mInstanceof(objProto, ctor);
}