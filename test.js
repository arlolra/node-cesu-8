var cesu = require('./cesu-8.js')

// emoji 🍨 🍩 🍪
var arr = [
  101, 109, 111, 106, 105, 32, 240, 159, 141, 168,
  32, 240, 159, 141, 169, 32, 240, 159, 141, 170, 10
]

var string = cesu.toString(new Buffer(arr))
var buf = cesu.toBuffer(string)

process.stdout.write(buf)