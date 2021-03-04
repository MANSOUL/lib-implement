const b64Table = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
  'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'
]

function toBinary(num) {
  let str = ''
  while (Math.floor(num / 2) >= 1) {
    let remain = num % 2
    num = Math.floor(num / 2)
    str = remain + str
  }
  str = num + str
  return str.padStart(8, '0')
}

function binaryToNum(b) {
  return b.split('').reverse().reduce((prev, current, index) => {
    return prev + (current * (2 ** index))
  }, 0)
}

function toBase64(str) {
  let binaryStr = ''
  for (let i = 0; i < str.length; i++) {
    binaryStr += toBinary(str.charCodeAt(i))
  }
  // split
  let base64Nums = []
  for (let i = 0; i < binaryStr.length; i += 6) {
    let str = binaryStr.substr(i, 6)
    base64Nums.push(binaryToNum(('00' + str).padEnd(8, '0')))
  }
  // to base64
  let base64Str = ''
  base64Nums.forEach(item => {
    base64Str += b64Table[item]
  })
  base64Str = base64Str.padEnd(4 * Math.ceil(base64Str.length / 4), '=')
  return base64Str
}