export function arrToMap(arr) {
  let o = {};
  for (let index = 0; index < arr.length; index += 2) {
    let key = arr[index];
    let value = arr[index + 1];
    o[key] = value;
  }
  return o;
}