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


var iconv16 = new Iconv('UTF-8', 'UTF-16')
  , iconv8 = new Iconv('UTF-16', 'UTF-8')

module.exports = {

  toString: function (buf) {

    // accepts a utf-8 encoded buffer
    if (!Buffer.isBuffer(buf)) return

    // do this w/o iconv
    var utf16buf = iconv16.convert(buf)

    var i = 0
      , len = utf16buf.length
      , last = ''
      , string = ''

    for (; i < len; i++) {
      last += utf16buf[i].toString(16)
      if (i % 2 != 0) {
        string += fixedFromCharCode(parseInt('0x' + last))
        last = ''
      }
    }

    return string
  },

  toBuffer: function (string) {

    var i = 0
      , len = string.length
      , utf16buf = new Buffer(len * 2)
      , hex, ii, arr, j

    for (; i < len; i++) {

      hex = string.charCodeAt(i).toString(16)

      hex = hex.split('')
      j = hex.length
      for (; j < 4; j++) {
        hex.unshift('0')
      }

      ii = i * 2
      utf16buf[ii] = parseInt('0x' + hex.slice(0, 2).join(''))
      utf16buf[ii + 1] = parseInt('0x' + hex.slice(2, 4).join(''))

    }

    return iconv8.convert(utf16buf)
  }

}