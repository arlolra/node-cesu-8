#CESU-8 Encoding for Node.js

***

_Warning: As of Node.js v0.7.7 this is no longer necessary!_

***

###An Explanation

At the moment, Node is punting on non-BMP unicode characters. What to do?

An unsatisfactory workaround was to manually do the unwinding, as proposed here:
http://code.google.com/p/v8/issues/detail?id=761#c8

Which does in fact work, see:
https://gist.github.com/1696314

Though it seems rather brittle. What happens if `String.fromCharCode` returns a `{` and garbles the JSON? Clearly not the answer.

So what's the problem? Why doesn't it work to begin with? Well, v8 doesn't support strict UTF-8, meaning that handing it a UTF-8 encoded buffer is never going to work, unless Javascript itself changes. (N.B. There is a [strawman proposal](http://wiki.ecmascript.org/doku.php?id=strawman:support_full_unicode_in_strings))

But clearly something can be done 'cause the browser is working around the problem. From what I've surmised, using [CESU-2](http://en.wikipedia.org/wiki/CESU-8) encoding, in lieu of UTF-8, will work. At least, that's what the browser appears to be doing.

To do the encoding, I looked at:
http://www.unicode.org/reports/tr26/

This library shows that you can take a UTF-8 encoded buffer, convert it to UTF-16 with [node-iconv](https://github.com/bnoordhuis/node-iconv) and then build a string with the surrogate pairs. There are a few issues with this, `String.length` will be one longer per non-BMP character than expected, but that's the way it should work and does in the browser. But otherwise parsing JSON, the original use case, will be fine.

This can probably be done purely in Javascript, ie. no libiconv, or even pushed down to C++, as a new encoding, CESU-8.


###Install

With everyone's favourite package manager,

    npm install cesu-8


###Example Usage

    var cesu = require('cesu-8')

    // emoji 🍨 🍩 🍪
    var arr = [
      101, 109, 111, 106, 105, 32, 240, 159, 141, 168,
      32, 240, 159, 141, 169, 32, 240, 159, 141, 170
    ]  // these are the octets for the above string in utf8

    var utf8buffer = new Buffer(arr)

    var mystring = cesu.toString(utf8buffer)

    // do whatever you want with the string
    // have fun
    // seriously

    // convert it back to a buffer
    var backtobuf = cesu.toBuffer(mystring)
    process.stdout.write(backtobuf)


###Todo

- Find out what the first char is: `0xFFEF`
- Remove iconv dependency.