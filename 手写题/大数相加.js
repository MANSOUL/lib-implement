function add(num1, num2) {
  num1 += ''
  num2 += ''
  let i
  let j = 0 // 进位标识
  let len1 = num1.length
  let len2 = num2.length
  let len11 = 0
  let len22 = 0
  if (num1.indexOf('.') > -1) {
    len1 = num1.split('.')[0].length
    len11 = num1.split('.')[1].length
  }
  if (num2.indexOf('.') > -1) {
    len2 = num2.split('.')[0].length
    len22 = num2.split('.')[1].length
  }
  let k = Math.abs(len1 - len2)
  let k2 = Math.abs(len11 - len22)
  let result = ''
  if (len1 < len2) {
    num1 = num1.padStart(num1.length + k, '0')
  } else {
    num2 = num2.padStart(num2.length + k, '0')
  }
  if (k2 > 0) {
    let maxLength = Math.max(len11, len22) + num1.split('.')[0].length + 1
    if (len11 === 0) {
      num1 = num1 + '.'
      num1 = num1.padEnd(maxLength, '0')
    } else if (len22 === 0) {
      num2 = num2 + '.'
      num2 = num2.padEnd(12, '0')
    } else {
      if (len11 < len22) {
        num1 = num1.padEnd(maxLength, '0')
      } else {
        num2 = num2.padEnd(maxLength, '0')
      }
    }
  }
  i = num1.length - 1
  console.log(num1, num2)
  while (i >= 0) {
    let n1 = num1[i]
    let n2 = num2[i]
    if (n1 === '.') {
      result = '.' + result
    } else {
      n1 = +n1
      n2 = +n2
      let r = n1 + n2 + j
      if (r > 9) {
        j = 1
      } else {
        j = 0
      }
      result = (r % 10) + result
    }
    i--
  }
  result = j + result
  return +result
}

console.log(add(123456789.11, 87654321.2222))