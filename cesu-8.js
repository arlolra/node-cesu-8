// http://www.unicode.org/reports/tr26/

const Iconv = require('iconv').Iconv


// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/fromCharCode

function fixedFromCharCode(codePt) {
  if (codePt > 0xFFFF) {
    codePt -= 0x10000
    return String.fromCharCode(
      0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF)
    )
  } else {
    return String.fromCharCode(codePt)
  }
}


// emoji 🍨 🍩 🍪
var arr = [
  101, 109,111, 106, 105, 32, 240, 159, 141, 168, 32,
  240, 159, 141, 169, 32, 240, 159, 141, 170, 10
]

// do this w/o iconv
var iconv = new Iconv('UTF-8', 'UTF-16')
  , buf = iconv.convert(new Buffer(arr))


var i = 0
  , len = buf.length
  , last = ''
  , string = ''

for (; i < len; i++) {
  last += buf[i].toString(16)
  if (i % 2 != 0) {
    string += fixedFromCharCode(parseInt('0x' + last))
    last = ''
  }
}



// we now have a string that we can do whatever with
// and should be fine. no different than in the browser.
// when you're done with it, convert it back to utf-8



// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/charCodeAt

function fixedCharCodeAt(str, idx) {
  idx = idx || 0
  var code = str.charCodeAt(idx)
  var hi, low
  if (0xD800 <= code && code <= 0xDBFF) {
    hi = code
    low = str.charCodeAt(idx+1)
    if (isNaN(low)) {
      throw 'High surrogate not followed by low surrogate'
    }
    return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000
  }
  if (0xDC00 <= code && code <= 0xDFFF) {
    return false
  }
  return code
}


i = 0
len = string.length

for (; i < len; i++) {
  console.log(fixedCharCodeAt(string, i).toString(16))
}