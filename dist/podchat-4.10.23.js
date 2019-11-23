(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],3:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],4:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":2,"./encode":3}],5:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":1,"timers":5}],6:[function(require,module,exports){
window.PodChat = require('./src/chat.js');

},{"./src/chat.js":46}],7:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./enc-base64"), require("./md5"), require("./evpkdf"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var BlockCipher = C_lib.BlockCipher;
	    var C_algo = C.algo;

	    // Lookup tables
	    var SBOX = [];
	    var INV_SBOX = [];
	    var SUB_MIX_0 = [];
	    var SUB_MIX_1 = [];
	    var SUB_MIX_2 = [];
	    var SUB_MIX_3 = [];
	    var INV_SUB_MIX_0 = [];
	    var INV_SUB_MIX_1 = [];
	    var INV_SUB_MIX_2 = [];
	    var INV_SUB_MIX_3 = [];

	    // Compute lookup tables
	    (function () {
	        // Compute double table
	        var d = [];
	        for (var i = 0; i < 256; i++) {
	            if (i < 128) {
	                d[i] = i << 1;
	            } else {
	                d[i] = (i << 1) ^ 0x11b;
	            }
	        }

	        // Walk GF(2^8)
	        var x = 0;
	        var xi = 0;
	        for (var i = 0; i < 256; i++) {
	            // Compute sbox
	            var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
	            sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
	            SBOX[x] = sx;
	            INV_SBOX[sx] = x;

	            // Compute multiplication
	            var x2 = d[x];
	            var x4 = d[x2];
	            var x8 = d[x4];

	            // Compute sub bytes, mix columns tables
	            var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
	            SUB_MIX_0[x] = (t << 24) | (t >>> 8);
	            SUB_MIX_1[x] = (t << 16) | (t >>> 16);
	            SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
	            SUB_MIX_3[x] = t;

	            // Compute inv sub bytes, inv mix columns tables
	            var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
	            INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
	            INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
	            INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
	            INV_SUB_MIX_3[sx] = t;

	            // Compute next counter
	            if (!x) {
	                x = xi = 1;
	            } else {
	                x = x2 ^ d[d[d[x8 ^ x2]]];
	                xi ^= d[d[xi]];
	            }
	        }
	    }());

	    // Precomputed Rcon lookup
	    var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

	    /**
	     * AES block cipher algorithm.
	     */
	    var AES = C_algo.AES = BlockCipher.extend({
	        _doReset: function () {
	            // Skip reset of nRounds has been set before and key did not change
	            if (this._nRounds && this._keyPriorReset === this._key) {
	                return;
	            }

	            // Shortcuts
	            var key = this._keyPriorReset = this._key;
	            var keyWords = key.words;
	            var keySize = key.sigBytes / 4;

	            // Compute number of rounds
	            var nRounds = this._nRounds = keySize + 6;

	            // Compute number of key schedule rows
	            var ksRows = (nRounds + 1) * 4;

	            // Compute key schedule
	            var keySchedule = this._keySchedule = [];
	            for (var ksRow = 0; ksRow < ksRows; ksRow++) {
	                if (ksRow < keySize) {
	                    keySchedule[ksRow] = keyWords[ksRow];
	                } else {
	                    var t = keySchedule[ksRow - 1];

	                    if (!(ksRow % keySize)) {
	                        // Rot word
	                        t = (t << 8) | (t >>> 24);

	                        // Sub word
	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

	                        // Mix Rcon
	                        t ^= RCON[(ksRow / keySize) | 0] << 24;
	                    } else if (keySize > 6 && ksRow % keySize == 4) {
	                        // Sub word
	                        t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
	                    }

	                    keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
	                }
	            }

	            // Compute inv key schedule
	            var invKeySchedule = this._invKeySchedule = [];
	            for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
	                var ksRow = ksRows - invKsRow;

	                if (invKsRow % 4) {
	                    var t = keySchedule[ksRow];
	                } else {
	                    var t = keySchedule[ksRow - 4];
	                }

	                if (invKsRow < 4 || ksRow <= 4) {
	                    invKeySchedule[invKsRow] = t;
	                } else {
	                    invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
	                                               INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
	                }
	            }
	        },

	        encryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
	        },

	        decryptBlock: function (M, offset) {
	            // Swap 2nd and 4th rows
	            var t = M[offset + 1];
	            M[offset + 1] = M[offset + 3];
	            M[offset + 3] = t;

	            this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

	            // Inv swap 2nd and 4th rows
	            var t = M[offset + 1];
	            M[offset + 1] = M[offset + 3];
	            M[offset + 3] = t;
	        },

	        _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
	            // Shortcut
	            var nRounds = this._nRounds;

	            // Get input, add round key
	            var s0 = M[offset]     ^ keySchedule[0];
	            var s1 = M[offset + 1] ^ keySchedule[1];
	            var s2 = M[offset + 2] ^ keySchedule[2];
	            var s3 = M[offset + 3] ^ keySchedule[3];

	            // Key schedule row counter
	            var ksRow = 4;

	            // Rounds
	            for (var round = 1; round < nRounds; round++) {
	                // Shift rows, sub bytes, mix columns, add round key
	                var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
	                var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
	                var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
	                var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

	                // Update state
	                s0 = t0;
	                s1 = t1;
	                s2 = t2;
	                s3 = t3;
	            }

	            // Shift rows, sub bytes, add round key
	            var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
	            var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
	            var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
	            var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

	            // Set output
	            M[offset]     = t0;
	            M[offset + 1] = t1;
	            M[offset + 2] = t2;
	            M[offset + 3] = t3;
	        },

	        keySize: 256/32
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
	     */
	    C.AES = BlockCipher._createHelper(AES);
	}());


	return CryptoJS.AES;

}));
},{"./cipher-core":8,"./core":9,"./enc-base64":10,"./evpkdf":12,"./md5":17}],8:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./evpkdf"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./evpkdf"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Cipher core components.
	 */
	CryptoJS.lib.Cipher || (function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var Base64 = C_enc.Base64;
	    var C_algo = C.algo;
	    var EvpKDF = C_algo.EvpKDF;

	    /**
	     * Abstract base cipher template.
	     *
	     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
	     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
	     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
	     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
	     */
	    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {WordArray} iv The IV to use for this operation.
	         */
	        cfg: Base.extend(),

	        /**
	         * Creates this cipher in encryption mode.
	         *
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {Cipher} A cipher instance.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
	         */
	        createEncryptor: function (key, cfg) {
	            return this.create(this._ENC_XFORM_MODE, key, cfg);
	        },

	        /**
	         * Creates this cipher in decryption mode.
	         *
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {Cipher} A cipher instance.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
	         */
	        createDecryptor: function (key, cfg) {
	            return this.create(this._DEC_XFORM_MODE, key, cfg);
	        },

	        /**
	         * Initializes a newly created cipher.
	         *
	         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @example
	         *
	         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
	         */
	        init: function (xformMode, key, cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Store transform mode and key
	            this._xformMode = xformMode;
	            this._key = key;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this cipher to its initial state.
	         *
	         * @example
	         *
	         *     cipher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-cipher logic
	            this._doReset();
	        },

	        /**
	         * Adds data to be encrypted or decrypted.
	         *
	         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
	         *
	         * @return {WordArray} The data after processing.
	         *
	         * @example
	         *
	         *     var encrypted = cipher.process('data');
	         *     var encrypted = cipher.process(wordArray);
	         */
	        process: function (dataUpdate) {
	            // Append
	            this._append(dataUpdate);

	            // Process available blocks
	            return this._process();
	        },

	        /**
	         * Finalizes the encryption or decryption process.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
	         *
	         * @return {WordArray} The data after final processing.
	         *
	         * @example
	         *
	         *     var encrypted = cipher.finalize();
	         *     var encrypted = cipher.finalize('data');
	         *     var encrypted = cipher.finalize(wordArray);
	         */
	        finalize: function (dataUpdate) {
	            // Final data update
	            if (dataUpdate) {
	                this._append(dataUpdate);
	            }

	            // Perform concrete-cipher logic
	            var finalProcessedData = this._doFinalize();

	            return finalProcessedData;
	        },

	        keySize: 128/32,

	        ivSize: 128/32,

	        _ENC_XFORM_MODE: 1,

	        _DEC_XFORM_MODE: 2,

	        /**
	         * Creates shortcut functions to a cipher's object interface.
	         *
	         * @param {Cipher} cipher The cipher to create a helper for.
	         *
	         * @return {Object} An object with encrypt and decrypt shortcut functions.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
	         */
	        _createHelper: (function () {
	            function selectCipherStrategy(key) {
	                if (typeof key == 'string') {
	                    return PasswordBasedCipher;
	                } else {
	                    return SerializableCipher;
	                }
	            }

	            return function (cipher) {
	                return {
	                    encrypt: function (message, key, cfg) {
	                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
	                    },

	                    decrypt: function (ciphertext, key, cfg) {
	                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
	                    }
	                };
	            };
	        }())
	    });

	    /**
	     * Abstract base stream cipher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
	     */
	    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
	        _doFinalize: function () {
	            // Process partial blocks
	            var finalProcessedBlocks = this._process(!!'flush');

	            return finalProcessedBlocks;
	        },

	        blockSize: 1
	    });

	    /**
	     * Mode namespace.
	     */
	    var C_mode = C.mode = {};

	    /**
	     * Abstract base block cipher mode template.
	     */
	    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
	        /**
	         * Creates this mode for encryption.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
	         */
	        createEncryptor: function (cipher, iv) {
	            return this.Encryptor.create(cipher, iv);
	        },

	        /**
	         * Creates this mode for decryption.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
	         */
	        createDecryptor: function (cipher, iv) {
	            return this.Decryptor.create(cipher, iv);
	        },

	        /**
	         * Initializes a newly created mode.
	         *
	         * @param {Cipher} cipher A block cipher instance.
	         * @param {Array} iv The IV words.
	         *
	         * @example
	         *
	         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
	         */
	        init: function (cipher, iv) {
	            this._cipher = cipher;
	            this._iv = iv;
	        }
	    });

	    /**
	     * Cipher Block Chaining mode.
	     */
	    var CBC = C_mode.CBC = (function () {
	        /**
	         * Abstract base CBC mode.
	         */
	        var CBC = BlockCipherMode.extend();

	        /**
	         * CBC encryptor.
	         */
	        CBC.Encryptor = CBC.extend({
	            /**
	             * Processes the data block at offset.
	             *
	             * @param {Array} words The data words to operate on.
	             * @param {number} offset The offset where the block starts.
	             *
	             * @example
	             *
	             *     mode.processBlock(data.words, offset);
	             */
	            processBlock: function (words, offset) {
	                // Shortcuts
	                var cipher = this._cipher;
	                var blockSize = cipher.blockSize;

	                // XOR and encrypt
	                xorBlock.call(this, words, offset, blockSize);
	                cipher.encryptBlock(words, offset);

	                // Remember this block to use with next block
	                this._prevBlock = words.slice(offset, offset + blockSize);
	            }
	        });

	        /**
	         * CBC decryptor.
	         */
	        CBC.Decryptor = CBC.extend({
	            /**
	             * Processes the data block at offset.
	             *
	             * @param {Array} words The data words to operate on.
	             * @param {number} offset The offset where the block starts.
	             *
	             * @example
	             *
	             *     mode.processBlock(data.words, offset);
	             */
	            processBlock: function (words, offset) {
	                // Shortcuts
	                var cipher = this._cipher;
	                var blockSize = cipher.blockSize;

	                // Remember this block to use with next block
	                var thisBlock = words.slice(offset, offset + blockSize);

	                // Decrypt and XOR
	                cipher.decryptBlock(words, offset);
	                xorBlock.call(this, words, offset, blockSize);

	                // This block becomes the previous block
	                this._prevBlock = thisBlock;
	            }
	        });

	        function xorBlock(words, offset, blockSize) {
	            // Shortcut
	            var iv = this._iv;

	            // Choose mixing block
	            if (iv) {
	                var block = iv;

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            } else {
	                var block = this._prevBlock;
	            }

	            // XOR blocks
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= block[i];
	            }
	        }

	        return CBC;
	    }());

	    /**
	     * Padding namespace.
	     */
	    var C_pad = C.pad = {};

	    /**
	     * PKCS #5/7 padding strategy.
	     */
	    var Pkcs7 = C_pad.Pkcs7 = {
	        /**
	         * Pads data using the algorithm defined in PKCS #5/7.
	         *
	         * @param {WordArray} data The data to pad.
	         * @param {number} blockSize The multiple that the data should be padded to.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
	         */
	        pad: function (data, blockSize) {
	            // Shortcut
	            var blockSizeBytes = blockSize * 4;

	            // Count padding bytes
	            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

	            // Create padding word
	            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

	            // Create padding
	            var paddingWords = [];
	            for (var i = 0; i < nPaddingBytes; i += 4) {
	                paddingWords.push(paddingWord);
	            }
	            var padding = WordArray.create(paddingWords, nPaddingBytes);

	            // Add padding
	            data.concat(padding);
	        },

	        /**
	         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
	         *
	         * @param {WordArray} data The data to unpad.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
	         */
	        unpad: function (data) {
	            // Get number of padding bytes from last byte
	            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	            // Remove padding
	            data.sigBytes -= nPaddingBytes;
	        }
	    };

	    /**
	     * Abstract base block cipher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
	     */
	    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {Mode} mode The block mode to use. Default: CBC
	         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
	         */
	        cfg: Cipher.cfg.extend({
	            mode: CBC,
	            padding: Pkcs7
	        }),

	        reset: function () {
	            // Reset cipher
	            Cipher.reset.call(this);

	            // Shortcuts
	            var cfg = this.cfg;
	            var iv = cfg.iv;
	            var mode = cfg.mode;

	            // Reset block mode
	            if (this._xformMode == this._ENC_XFORM_MODE) {
	                var modeCreator = mode.createEncryptor;
	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
	                var modeCreator = mode.createDecryptor;
	                // Keep at least one block in the buffer for unpadding
	                this._minBufferSize = 1;
	            }

	            if (this._mode && this._mode.__creator == modeCreator) {
	                this._mode.init(this, iv && iv.words);
	            } else {
	                this._mode = modeCreator.call(mode, this, iv && iv.words);
	                this._mode.__creator = modeCreator;
	            }
	        },

	        _doProcessBlock: function (words, offset) {
	            this._mode.processBlock(words, offset);
	        },

	        _doFinalize: function () {
	            // Shortcut
	            var padding = this.cfg.padding;

	            // Finalize
	            if (this._xformMode == this._ENC_XFORM_MODE) {
	                // Pad data
	                padding.pad(this._data, this.blockSize);

	                // Process final blocks
	                var finalProcessedBlocks = this._process(!!'flush');
	            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
	                // Process final blocks
	                var finalProcessedBlocks = this._process(!!'flush');

	                // Unpad data
	                padding.unpad(finalProcessedBlocks);
	            }

	            return finalProcessedBlocks;
	        },

	        blockSize: 128/32
	    });

	    /**
	     * A collection of cipher parameters.
	     *
	     * @property {WordArray} ciphertext The raw ciphertext.
	     * @property {WordArray} key The key to this ciphertext.
	     * @property {WordArray} iv The IV used in the ciphering operation.
	     * @property {WordArray} salt The salt used with a key derivation function.
	     * @property {Cipher} algorithm The cipher algorithm.
	     * @property {Mode} mode The block mode used in the ciphering operation.
	     * @property {Padding} padding The padding scheme used in the ciphering operation.
	     * @property {number} blockSize The block size of the cipher.
	     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
	     */
	    var CipherParams = C_lib.CipherParams = Base.extend({
	        /**
	         * Initializes a newly created cipher params object.
	         *
	         * @param {Object} cipherParams An object with any of the possible cipher parameters.
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.lib.CipherParams.create({
	         *         ciphertext: ciphertextWordArray,
	         *         key: keyWordArray,
	         *         iv: ivWordArray,
	         *         salt: saltWordArray,
	         *         algorithm: CryptoJS.algo.AES,
	         *         mode: CryptoJS.mode.CBC,
	         *         padding: CryptoJS.pad.PKCS7,
	         *         blockSize: 4,
	         *         formatter: CryptoJS.format.OpenSSL
	         *     });
	         */
	        init: function (cipherParams) {
	            this.mixIn(cipherParams);
	        },

	        /**
	         * Converts this cipher params object to a string.
	         *
	         * @param {Format} formatter (Optional) The formatting strategy to use.
	         *
	         * @return {string} The stringified cipher params.
	         *
	         * @throws Error If neither the formatter nor the default formatter is set.
	         *
	         * @example
	         *
	         *     var string = cipherParams + '';
	         *     var string = cipherParams.toString();
	         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
	         */
	        toString: function (formatter) {
	            return (formatter || this.formatter).stringify(this);
	        }
	    });

	    /**
	     * Format namespace.
	     */
	    var C_format = C.format = {};

	    /**
	     * OpenSSL formatting strategy.
	     */
	    var OpenSSLFormatter = C_format.OpenSSL = {
	        /**
	         * Converts a cipher params object to an OpenSSL-compatible string.
	         *
	         * @param {CipherParams} cipherParams The cipher params object.
	         *
	         * @return {string} The OpenSSL-compatible string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
	         */
	        stringify: function (cipherParams) {
	            // Shortcuts
	            var ciphertext = cipherParams.ciphertext;
	            var salt = cipherParams.salt;

	            // Format
	            if (salt) {
	                var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
	            } else {
	                var wordArray = ciphertext;
	            }

	            return wordArray.toString(Base64);
	        },

	        /**
	         * Converts an OpenSSL-compatible string to a cipher params object.
	         *
	         * @param {string} openSSLStr The OpenSSL-compatible string.
	         *
	         * @return {CipherParams} The cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
	         */
	        parse: function (openSSLStr) {
	            // Parse base64
	            var ciphertext = Base64.parse(openSSLStr);

	            // Shortcut
	            var ciphertextWords = ciphertext.words;

	            // Test for salt
	            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
	                // Extract salt
	                var salt = WordArray.create(ciphertextWords.slice(2, 4));

	                // Remove salt from ciphertext
	                ciphertextWords.splice(0, 4);
	                ciphertext.sigBytes -= 16;
	            }

	            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
	        }
	    };

	    /**
	     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
	     */
	    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
	         */
	        cfg: Base.extend({
	            format: OpenSSLFormatter
	        }),

	        /**
	         * Encrypts a message.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {WordArray|string} message The message to encrypt.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {CipherParams} A cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         */
	        encrypt: function (cipher, message, key, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Encrypt
	            var encryptor = cipher.createEncryptor(key, cfg);
	            var ciphertext = encryptor.finalize(message);

	            // Shortcut
	            var cipherCfg = encryptor.cfg;

	            // Create and return serializable cipher params
	            return CipherParams.create({
	                ciphertext: ciphertext,
	                key: key,
	                iv: cipherCfg.iv,
	                algorithm: cipher,
	                mode: cipherCfg.mode,
	                padding: cipherCfg.padding,
	                blockSize: cipher.blockSize,
	                formatter: cfg.format
	            });
	        },

	        /**
	         * Decrypts serialized ciphertext.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	         * @param {WordArray} key The key.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {WordArray} The plaintext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
	         */
	        decrypt: function (cipher, ciphertext, key, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Convert string to CipherParams
	            ciphertext = this._parse(ciphertext, cfg.format);

	            // Decrypt
	            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

	            return plaintext;
	        },

	        /**
	         * Converts serialized ciphertext to CipherParams,
	         * else assumed CipherParams already and returns ciphertext unchanged.
	         *
	         * @param {CipherParams|string} ciphertext The ciphertext.
	         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
	         *
	         * @return {CipherParams} The unserialized ciphertext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
	         */
	        _parse: function (ciphertext, format) {
	            if (typeof ciphertext == 'string') {
	                return format.parse(ciphertext, this);
	            } else {
	                return ciphertext;
	            }
	        }
	    });

	    /**
	     * Key derivation function namespace.
	     */
	    var C_kdf = C.kdf = {};

	    /**
	     * OpenSSL key derivation function.
	     */
	    var OpenSSLKdf = C_kdf.OpenSSL = {
	        /**
	         * Derives a key and IV from a password.
	         *
	         * @param {string} password The password to derive from.
	         * @param {number} keySize The size in words of the key to generate.
	         * @param {number} ivSize The size in words of the IV to generate.
	         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
	         *
	         * @return {CipherParams} A cipher params object with the key, IV, and salt.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
	         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
	         */
	        execute: function (password, keySize, ivSize, salt) {
	            // Generate random salt
	            if (!salt) {
	                salt = WordArray.random(64/8);
	            }

	            // Derive key and IV
	            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

	            // Separate key and IV
	            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
	            key.sigBytes = keySize * 4;

	            // Return params
	            return CipherParams.create({ key: key, iv: iv, salt: salt });
	        }
	    };

	    /**
	     * A serializable cipher wrapper that derives the key from a password,
	     * and returns ciphertext as a serializable cipher params object.
	     */
	    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
	         */
	        cfg: SerializableCipher.cfg.extend({
	            kdf: OpenSSLKdf
	        }),

	        /**
	         * Encrypts a message using a password.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {WordArray|string} message The message to encrypt.
	         * @param {string} password The password.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {CipherParams} A cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
	         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
	         */
	        encrypt: function (cipher, message, password, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Derive key and other params
	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

	            // Add IV to config
	            cfg.iv = derivedParams.iv;

	            // Encrypt
	            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

	            // Mix in derived params
	            ciphertext.mixIn(derivedParams);

	            return ciphertext;
	        },

	        /**
	         * Decrypts serialized ciphertext using a password.
	         *
	         * @param {Cipher} cipher The cipher algorithm to use.
	         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
	         * @param {string} password The password.
	         * @param {Object} cfg (Optional) The configuration options to use for this operation.
	         *
	         * @return {WordArray} The plaintext.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
	         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
	         */
	        decrypt: function (cipher, ciphertext, password, cfg) {
	            // Apply config defaults
	            cfg = this.cfg.extend(cfg);

	            // Convert string to CipherParams
	            ciphertext = this._parse(ciphertext, cfg.format);

	            // Derive key and other params
	            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

	            // Add IV to config
	            cfg.iv = derivedParams.iv;

	            // Decrypt
	            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

	            return plaintext;
	        }
	    });
	}());


}));
},{"./core":9,"./evpkdf":12}],9:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory();
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define([], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory();
	}
}(this, function () {

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {
	    /*
	     * Local polyfil of Object.create
	     */
	    var create = Object.create || (function () {
	        function F() {};

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }())

	    /**
	     * CryptoJS namespace.
	     */
	    var C = {};

	    /**
	     * Library namespace.
	     */
	    var C_lib = C.lib = {};

	    /**
	     * Base object for prototypal inheritance.
	     */
	    var Base = C_lib.Base = (function () {


	        return {
	            /**
	             * Creates a new object that inherits from this object.
	             *
	             * @param {Object} overrides Properties to copy into the new object.
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         field: 'value',
	             *
	             *         method: function () {
	             *         }
	             *     });
	             */
	            extend: function (overrides) {
	                // Spawn
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
	                    subtype.init = function () {
	                        subtype.$super.init.apply(this, arguments);
	                    };
	                }

	                // Initializer's prototype is the subtype object
	                subtype.init.prototype = subtype;

	                // Reference supertype
	                subtype.$super = this;

	                return subtype;
	            },

	            /**
	             * Extends this object and runs the init method.
	             * Arguments to create() will be passed to init().
	             *
	             * @return {Object} The new object.
	             *
	             * @static
	             *
	             * @example
	             *
	             *     var instance = MyType.create();
	             */
	            create: function () {
	                var instance = this.extend();
	                instance.init.apply(instance, arguments);

	                return instance;
	            },

	            /**
	             * Initializes a newly created object.
	             * Override this method to add some logic when your objects are created.
	             *
	             * @example
	             *
	             *     var MyType = CryptoJS.lib.Base.extend({
	             *         init: function () {
	             *             // ...
	             *         }
	             *     });
	             */
	            init: function () {
	            },

	            /**
	             * Copies properties into this object.
	             *
	             * @param {Object} properties The properties to mix in.
	             *
	             * @example
	             *
	             *     MyType.mixIn({
	             *         field: 'value'
	             *     });
	             */
	            mixIn: function (properties) {
	                for (var propertyName in properties) {
	                    if (properties.hasOwnProperty(propertyName)) {
	                        this[propertyName] = properties[propertyName];
	                    }
	                }

	                // IE won't copy toString using the loop above
	                if (properties.hasOwnProperty('toString')) {
	                    this.toString = properties.toString;
	                }
	            },

	            /**
	             * Creates a copy of this object.
	             *
	             * @return {Object} The clone.
	             *
	             * @example
	             *
	             *     var clone = instance.clone();
	             */
	            clone: function () {
	                return this.init.prototype.extend(this);
	            }
	        };
	    }());

	    /**
	     * An array of 32-bit words.
	     *
	     * @property {Array} words The array of 32-bit words.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var WordArray = C_lib.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of 32-bit words.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.create();
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
	         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 4;
	            }
	        },

	        /**
	         * Converts this word array to a string.
	         *
	         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
	         *
	         * @return {string} The stringified word array.
	         *
	         * @example
	         *
	         *     var string = wordArray + '';
	         *     var string = wordArray.toString();
	         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
	         */
	        toString: function (encoder) {
	            return (encoder || Hex).stringify(this);
	        },

	        /**
	         * Concatenates a word array to this word array.
	         *
	         * @param {WordArray} wordArray The word array to append.
	         *
	         * @return {WordArray} This word array.
	         *
	         * @example
	         *
	         *     wordArray1.concat(wordArray2);
	         */
	        concat: function (wordArray) {
	            // Shortcuts
	            var thisWords = this.words;
	            var thatWords = wordArray.words;
	            var thisSigBytes = this.sigBytes;
	            var thatSigBytes = wordArray.sigBytes;

	            // Clamp excess bits
	            this.clamp();

	            // Concat
	            if (thisSigBytes % 4) {
	                // Copy one byte at a time
	                for (var i = 0; i < thatSigBytes; i++) {
	                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
	                }
	            } else {
	                // Copy one word at a time
	                for (var i = 0; i < thatSigBytes; i += 4) {
	                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
	                }
	            }
	            this.sigBytes += thatSigBytes;

	            // Chainable
	            return this;
	        },

	        /**
	         * Removes insignificant bits.
	         *
	         * @example
	         *
	         *     wordArray.clamp();
	         */
	        clamp: function () {
	            // Shortcuts
	            var words = this.words;
	            var sigBytes = this.sigBytes;

	            // Clamp
	            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
	            words.length = Math.ceil(sigBytes / 4);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = wordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone.words = this.words.slice(0);

	            return clone;
	        },

	        /**
	         * Creates a word array filled with random bytes.
	         *
	         * @param {number} nBytes The number of random bytes to generate.
	         *
	         * @return {WordArray} The random word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.lib.WordArray.random(16);
	         */
	        random: function (nBytes) {
	            var words = [];

	            var r = (function (m_w) {
	                var m_w = m_w;
	                var m_z = 0x3ade68b1;
	                var mask = 0xffffffff;

	                return function () {
	                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
	                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
	                    var result = ((m_z << 0x10) + m_w) & mask;
	                    result /= 0x100000000;
	                    result += 0.5;
	                    return result * (Math.random() > .5 ? 1 : -1);
	                }
	            });

	            for (var i = 0, rcache; i < nBytes; i += 4) {
	                var _r = r((rcache || Math.random()) * 0x100000000);

	                rcache = _r() * 0x3ade67b7;
	                words.push((_r() * 0x100000000) | 0);
	            }

	            return new WordArray.init(words, nBytes);
	        }
	    });

	    /**
	     * Encoder namespace.
	     */
	    var C_enc = C.enc = {};

	    /**
	     * Hex encoding strategy.
	     */
	    var Hex = C_enc.Hex = {
	        /**
	         * Converts a word array to a hex string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The hex string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var hexChars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                hexChars.push((bite >>> 4).toString(16));
	                hexChars.push((bite & 0x0f).toString(16));
	            }

	            return hexChars.join('');
	        },

	        /**
	         * Converts a hex string to a word array.
	         *
	         * @param {string} hexStr The hex string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
	         */
	        parse: function (hexStr) {
	            // Shortcut
	            var hexStrLength = hexStr.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < hexStrLength; i += 2) {
	                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
	            }

	            return new WordArray.init(words, hexStrLength / 2);
	        }
	    };

	    /**
	     * Latin1 encoding strategy.
	     */
	    var Latin1 = C_enc.Latin1 = {
	        /**
	         * Converts a word array to a Latin1 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Latin1 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var latin1Chars = [];
	            for (var i = 0; i < sigBytes; i++) {
	                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
	                latin1Chars.push(String.fromCharCode(bite));
	            }

	            return latin1Chars.join('');
	        },

	        /**
	         * Converts a Latin1 string to a word array.
	         *
	         * @param {string} latin1Str The Latin1 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
	         */
	        parse: function (latin1Str) {
	            // Shortcut
	            var latin1StrLength = latin1Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < latin1StrLength; i++) {
	                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
	            }

	            return new WordArray.init(words, latin1StrLength);
	        }
	    };

	    /**
	     * UTF-8 encoding strategy.
	     */
	    var Utf8 = C_enc.Utf8 = {
	        /**
	         * Converts a word array to a UTF-8 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-8 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            try {
	                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
	            } catch (e) {
	                throw new Error('Malformed UTF-8 data');
	            }
	        },

	        /**
	         * Converts a UTF-8 string to a word array.
	         *
	         * @param {string} utf8Str The UTF-8 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
	         */
	        parse: function (utf8Str) {
	            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
	        }
	    };

	    /**
	     * Abstract buffered block algorithm template.
	     *
	     * The property blockSize must be implemented in a concrete subtype.
	     *
	     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
	     */
	    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
	        /**
	         * Resets this block algorithm's data buffer to its initial state.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm.reset();
	         */
	        reset: function () {
	            // Initial values
	            this._data = new WordArray.init();
	            this._nDataBytes = 0;
	        },

	        /**
	         * Adds new data to this block algorithm's buffer.
	         *
	         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
	         *
	         * @example
	         *
	         *     bufferedBlockAlgorithm._append('data');
	         *     bufferedBlockAlgorithm._append(wordArray);
	         */
	        _append: function (data) {
	            // Convert string to WordArray, else assume WordArray already
	            if (typeof data == 'string') {
	                data = Utf8.parse(data);
	            }

	            // Append
	            this._data.concat(data);
	            this._nDataBytes += data.sigBytes;
	        },

	        /**
	         * Processes available data blocks.
	         *
	         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
	         *
	         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
	         *
	         * @return {WordArray} The processed data.
	         *
	         * @example
	         *
	         *     var processedData = bufferedBlockAlgorithm._process();
	         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
	         */
	        _process: function (doFlush) {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var dataSigBytes = data.sigBytes;
	            var blockSize = this.blockSize;
	            var blockSizeBytes = blockSize * 4;

	            // Count blocks ready
	            var nBlocksReady = dataSigBytes / blockSizeBytes;
	            if (doFlush) {
	                // Round up to include partial blocks
	                nBlocksReady = Math.ceil(nBlocksReady);
	            } else {
	                // Round down to include only full blocks,
	                // less the number of blocks that must remain in the buffer
	                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
	            }

	            // Count words ready
	            var nWordsReady = nBlocksReady * blockSize;

	            // Count bytes ready
	            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

	            // Process blocks
	            if (nWordsReady) {
	                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
	                    // Perform concrete-algorithm logic
	                    this._doProcessBlock(dataWords, offset);
	                }

	                // Remove processed words
	                var processedWords = dataWords.splice(0, nWordsReady);
	                data.sigBytes -= nBytesReady;
	            }

	            // Return processed words
	            return new WordArray.init(processedWords, nBytesReady);
	        },

	        /**
	         * Creates a copy of this object.
	         *
	         * @return {Object} The clone.
	         *
	         * @example
	         *
	         *     var clone = bufferedBlockAlgorithm.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);
	            clone._data = this._data.clone();

	            return clone;
	        },

	        _minBufferSize: 0
	    });

	    /**
	     * Abstract hasher template.
	     *
	     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
	     */
	    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
	        /**
	         * Configuration options.
	         */
	        cfg: Base.extend(),

	        /**
	         * Initializes a newly created hasher.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
	         *
	         * @example
	         *
	         *     var hasher = CryptoJS.algo.SHA256.create();
	         */
	        init: function (cfg) {
	            // Apply config defaults
	            this.cfg = this.cfg.extend(cfg);

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this hasher to its initial state.
	         *
	         * @example
	         *
	         *     hasher.reset();
	         */
	        reset: function () {
	            // Reset data buffer
	            BufferedBlockAlgorithm.reset.call(this);

	            // Perform concrete-hasher logic
	            this._doReset();
	        },

	        /**
	         * Updates this hasher with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {Hasher} This hasher.
	         *
	         * @example
	         *
	         *     hasher.update('message');
	         *     hasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            // Append
	            this._append(messageUpdate);

	            // Update the hash
	            this._process();

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the hash computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The hash.
	         *
	         * @example
	         *
	         *     var hash = hasher.finalize();
	         *     var hash = hasher.finalize('message');
	         *     var hash = hasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Final message update
	            if (messageUpdate) {
	                this._append(messageUpdate);
	            }

	            // Perform concrete-hasher logic
	            var hash = this._doFinalize();

	            return hash;
	        },

	        blockSize: 512/32,

	        /**
	         * Creates a shortcut function to a hasher's object interface.
	         *
	         * @param {Hasher} hasher The hasher to create a helper for.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
	         */
	        _createHelper: function (hasher) {
	            return function (message, cfg) {
	                return new hasher.init(cfg).finalize(message);
	            };
	        },

	        /**
	         * Creates a shortcut function to the HMAC's object interface.
	         *
	         * @param {Hasher} hasher The hasher to use in this HMAC helper.
	         *
	         * @return {Function} The shortcut function.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
	         */
	        _createHmacHelper: function (hasher) {
	            return function (message, key) {
	                return new C_algo.HMAC.init(hasher, key).finalize(message);
	            };
	        }
	    });

	    /**
	     * Algorithm namespace.
	     */
	    var C_algo = C.algo = {};

	    return C;
	}(Math));


	return CryptoJS;

}));
},{}],10:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * Base64 encoding strategy.
	     */
	    var Base64 = C_enc.Base64 = {
	        /**
	         * Converts a word array to a Base64 string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The Base64 string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;
	            var map = this._map;

	            // Clamp excess bits
	            wordArray.clamp();

	            // Convert
	            var base64Chars = [];
	            for (var i = 0; i < sigBytes; i += 3) {
	                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
	                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
	                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

	                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

	                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
	                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
	                }
	            }

	            // Add padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                while (base64Chars.length % 4) {
	                    base64Chars.push(paddingChar);
	                }
	            }

	            return base64Chars.join('');
	        },

	        /**
	         * Converts a Base64 string to a word array.
	         *
	         * @param {string} base64Str The Base64 string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
	         */
	        parse: function (base64Str) {
	            // Shortcuts
	            var base64StrLength = base64Str.length;
	            var map = this._map;
	            var reverseMap = this._reverseMap;

	            if (!reverseMap) {
	                    reverseMap = this._reverseMap = [];
	                    for (var j = 0; j < map.length; j++) {
	                        reverseMap[map.charCodeAt(j)] = j;
	                    }
	            }

	            // Ignore padding
	            var paddingChar = map.charAt(64);
	            if (paddingChar) {
	                var paddingIndex = base64Str.indexOf(paddingChar);
	                if (paddingIndex !== -1) {
	                    base64StrLength = paddingIndex;
	                }
	            }

	            // Convert
	            return parseLoop(base64Str, base64StrLength, reverseMap);

	        },

	        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	    };

	    function parseLoop(base64Str, base64StrLength, reverseMap) {
	      var words = [];
	      var nBytes = 0;
	      for (var i = 0; i < base64StrLength; i++) {
	          if (i % 4) {
	              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
	              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
	              words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
	              nBytes++;
	          }
	      }
	      return WordArray.create(words, nBytes);
	    }
	}());


	return CryptoJS.enc.Base64;

}));
},{"./core":9}],11:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_enc = C.enc;

	    /**
	     * UTF-16 BE encoding strategy.
	     */
	    var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
	        /**
	         * Converts a word array to a UTF-16 BE string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-16 BE string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var utf16Chars = [];
	            for (var i = 0; i < sigBytes; i += 2) {
	                var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
	                utf16Chars.push(String.fromCharCode(codePoint));
	            }

	            return utf16Chars.join('');
	        },

	        /**
	         * Converts a UTF-16 BE string to a word array.
	         *
	         * @param {string} utf16Str The UTF-16 BE string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
	         */
	        parse: function (utf16Str) {
	            // Shortcut
	            var utf16StrLength = utf16Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < utf16StrLength; i++) {
	                words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
	            }

	            return WordArray.create(words, utf16StrLength * 2);
	        }
	    };

	    /**
	     * UTF-16 LE encoding strategy.
	     */
	    C_enc.Utf16LE = {
	        /**
	         * Converts a word array to a UTF-16 LE string.
	         *
	         * @param {WordArray} wordArray The word array.
	         *
	         * @return {string} The UTF-16 LE string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
	         */
	        stringify: function (wordArray) {
	            // Shortcuts
	            var words = wordArray.words;
	            var sigBytes = wordArray.sigBytes;

	            // Convert
	            var utf16Chars = [];
	            for (var i = 0; i < sigBytes; i += 2) {
	                var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
	                utf16Chars.push(String.fromCharCode(codePoint));
	            }

	            return utf16Chars.join('');
	        },

	        /**
	         * Converts a UTF-16 LE string to a word array.
	         *
	         * @param {string} utf16Str The UTF-16 LE string.
	         *
	         * @return {WordArray} The word array.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
	         */
	        parse: function (utf16Str) {
	            // Shortcut
	            var utf16StrLength = utf16Str.length;

	            // Convert
	            var words = [];
	            for (var i = 0; i < utf16StrLength; i++) {
	                words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
	            }

	            return WordArray.create(words, utf16StrLength * 2);
	        }
	    };

	    function swapEndian(word) {
	        return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
	    }
	}());


	return CryptoJS.enc.Utf16;

}));
},{"./core":9}],12:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./sha1"), require("./hmac"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./sha1", "./hmac"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var MD5 = C_algo.MD5;

	    /**
	     * This key derivation function is meant to conform with EVP_BytesToKey.
	     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
	     */
	    var EvpKDF = C_algo.EvpKDF = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
	         * @property {Hasher} hasher The hash algorithm to use. Default: MD5
	         * @property {number} iterations The number of iterations to perform. Default: 1
	         */
	        cfg: Base.extend({
	            keySize: 128/32,
	            hasher: MD5,
	            iterations: 1
	        }),

	        /**
	         * Initializes a newly created key derivation function.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
	         *
	         * @example
	         *
	         *     var kdf = CryptoJS.algo.EvpKDF.create();
	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
	         *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
	         */
	        init: function (cfg) {
	            this.cfg = this.cfg.extend(cfg);
	        },

	        /**
	         * Derives a key from a password.
	         *
	         * @param {WordArray|string} password The password.
	         * @param {WordArray|string} salt A salt.
	         *
	         * @return {WordArray} The derived key.
	         *
	         * @example
	         *
	         *     var key = kdf.compute(password, salt);
	         */
	        compute: function (password, salt) {
	            // Shortcut
	            var cfg = this.cfg;

	            // Init hasher
	            var hasher = cfg.hasher.create();

	            // Initial values
	            var derivedKey = WordArray.create();

	            // Shortcuts
	            var derivedKeyWords = derivedKey.words;
	            var keySize = cfg.keySize;
	            var iterations = cfg.iterations;

	            // Generate key
	            while (derivedKeyWords.length < keySize) {
	                if (block) {
	                    hasher.update(block);
	                }
	                var block = hasher.update(password).finalize(salt);
	                hasher.reset();

	                // Iterations
	                for (var i = 1; i < iterations; i++) {
	                    block = hasher.finalize(block);
	                    hasher.reset();
	                }

	                derivedKey.concat(block);
	            }
	            derivedKey.sigBytes = keySize * 4;

	            return derivedKey;
	        }
	    });

	    /**
	     * Derives a key from a password.
	     *
	     * @param {WordArray|string} password The password.
	     * @param {WordArray|string} salt A salt.
	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
	     *
	     * @return {WordArray} The derived key.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var key = CryptoJS.EvpKDF(password, salt);
	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
	     *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
	     */
	    C.EvpKDF = function (password, salt, cfg) {
	        return EvpKDF.create(cfg).compute(password, salt);
	    };
	}());


	return CryptoJS.EvpKDF;

}));
},{"./core":9,"./hmac":14,"./sha1":33}],13:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var CipherParams = C_lib.CipherParams;
	    var C_enc = C.enc;
	    var Hex = C_enc.Hex;
	    var C_format = C.format;

	    var HexFormatter = C_format.Hex = {
	        /**
	         * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
	         *
	         * @param {CipherParams} cipherParams The cipher params object.
	         *
	         * @return {string} The hexadecimally encoded string.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
	         */
	        stringify: function (cipherParams) {
	            return cipherParams.ciphertext.toString(Hex);
	        },

	        /**
	         * Converts a hexadecimally encoded ciphertext string to a cipher params object.
	         *
	         * @param {string} input The hexadecimally encoded string.
	         *
	         * @return {CipherParams} The cipher params object.
	         *
	         * @static
	         *
	         * @example
	         *
	         *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
	         */
	        parse: function (input) {
	            var ciphertext = Hex.parse(input);
	            return CipherParams.create({ ciphertext: ciphertext });
	        }
	    };
	}());


	return CryptoJS.format.Hex;

}));
},{"./cipher-core":8,"./core":9}],14:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var C_enc = C.enc;
	    var Utf8 = C_enc.Utf8;
	    var C_algo = C.algo;

	    /**
	     * HMAC algorithm.
	     */
	    var HMAC = C_algo.HMAC = Base.extend({
	        /**
	         * Initializes a newly created HMAC.
	         *
	         * @param {Hasher} hasher The hash algorithm to use.
	         * @param {WordArray|string} key The secret key.
	         *
	         * @example
	         *
	         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
	         */
	        init: function (hasher, key) {
	            // Init hasher
	            hasher = this._hasher = new hasher.init();

	            // Convert string to WordArray, else assume WordArray already
	            if (typeof key == 'string') {
	                key = Utf8.parse(key);
	            }

	            // Shortcuts
	            var hasherBlockSize = hasher.blockSize;
	            var hasherBlockSizeBytes = hasherBlockSize * 4;

	            // Allow arbitrary length keys
	            if (key.sigBytes > hasherBlockSizeBytes) {
	                key = hasher.finalize(key);
	            }

	            // Clamp excess bits
	            key.clamp();

	            // Clone key for inner and outer pads
	            var oKey = this._oKey = key.clone();
	            var iKey = this._iKey = key.clone();

	            // Shortcuts
	            var oKeyWords = oKey.words;
	            var iKeyWords = iKey.words;

	            // XOR keys with pad constants
	            for (var i = 0; i < hasherBlockSize; i++) {
	                oKeyWords[i] ^= 0x5c5c5c5c;
	                iKeyWords[i] ^= 0x36363636;
	            }
	            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

	            // Set initial values
	            this.reset();
	        },

	        /**
	         * Resets this HMAC to its initial state.
	         *
	         * @example
	         *
	         *     hmacHasher.reset();
	         */
	        reset: function () {
	            // Shortcut
	            var hasher = this._hasher;

	            // Reset
	            hasher.reset();
	            hasher.update(this._iKey);
	        },

	        /**
	         * Updates this HMAC with a message.
	         *
	         * @param {WordArray|string} messageUpdate The message to append.
	         *
	         * @return {HMAC} This HMAC instance.
	         *
	         * @example
	         *
	         *     hmacHasher.update('message');
	         *     hmacHasher.update(wordArray);
	         */
	        update: function (messageUpdate) {
	            this._hasher.update(messageUpdate);

	            // Chainable
	            return this;
	        },

	        /**
	         * Finalizes the HMAC computation.
	         * Note that the finalize operation is effectively a destructive, read-once operation.
	         *
	         * @param {WordArray|string} messageUpdate (Optional) A final message update.
	         *
	         * @return {WordArray} The HMAC.
	         *
	         * @example
	         *
	         *     var hmac = hmacHasher.finalize();
	         *     var hmac = hmacHasher.finalize('message');
	         *     var hmac = hmacHasher.finalize(wordArray);
	         */
	        finalize: function (messageUpdate) {
	            // Shortcut
	            var hasher = this._hasher;

	            // Compute HMAC
	            var innerHash = hasher.finalize(messageUpdate);
	            hasher.reset();
	            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

	            return hmac;
	        }
	    });
	}());


}));
},{"./core":9}],15:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./x64-core"), require("./lib-typedarrays"), require("./enc-utf16"), require("./enc-base64"), require("./md5"), require("./sha1"), require("./sha256"), require("./sha224"), require("./sha512"), require("./sha384"), require("./sha3"), require("./ripemd160"), require("./hmac"), require("./pbkdf2"), require("./evpkdf"), require("./cipher-core"), require("./mode-cfb"), require("./mode-ctr"), require("./mode-ctr-gladman"), require("./mode-ofb"), require("./mode-ecb"), require("./pad-ansix923"), require("./pad-iso10126"), require("./pad-iso97971"), require("./pad-zeropadding"), require("./pad-nopadding"), require("./format-hex"), require("./aes"), require("./tripledes"), require("./rc4"), require("./rabbit"), require("./rabbit-legacy"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core", "./lib-typedarrays", "./enc-utf16", "./enc-base64", "./md5", "./sha1", "./sha256", "./sha224", "./sha512", "./sha384", "./sha3", "./ripemd160", "./hmac", "./pbkdf2", "./evpkdf", "./cipher-core", "./mode-cfb", "./mode-ctr", "./mode-ctr-gladman", "./mode-ofb", "./mode-ecb", "./pad-ansix923", "./pad-iso10126", "./pad-iso97971", "./pad-zeropadding", "./pad-nopadding", "./format-hex", "./aes", "./tripledes", "./rc4", "./rabbit", "./rabbit-legacy"], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	return CryptoJS;

}));
},{"./aes":7,"./cipher-core":8,"./core":9,"./enc-base64":10,"./enc-utf16":11,"./evpkdf":12,"./format-hex":13,"./hmac":14,"./lib-typedarrays":16,"./md5":17,"./mode-cfb":18,"./mode-ctr":20,"./mode-ctr-gladman":19,"./mode-ecb":21,"./mode-ofb":22,"./pad-ansix923":23,"./pad-iso10126":24,"./pad-iso97971":25,"./pad-nopadding":26,"./pad-zeropadding":27,"./pbkdf2":28,"./rabbit":30,"./rabbit-legacy":29,"./rc4":31,"./ripemd160":32,"./sha1":33,"./sha224":34,"./sha256":35,"./sha3":36,"./sha384":37,"./sha512":38,"./tripledes":39,"./x64-core":40}],16:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Check if typed arrays are supported
	    if (typeof ArrayBuffer != 'function') {
	        return;
	    }

	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;

	    // Reference original init
	    var superInit = WordArray.init;

	    // Augment WordArray.init to handle typed arrays
	    var subInit = WordArray.init = function (typedArray) {
	        // Convert buffers to uint8
	        if (typedArray instanceof ArrayBuffer) {
	            typedArray = new Uint8Array(typedArray);
	        }

	        // Convert other array views to uint8
	        if (
	            typedArray instanceof Int8Array ||
	            (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
	            typedArray instanceof Int16Array ||
	            typedArray instanceof Uint16Array ||
	            typedArray instanceof Int32Array ||
	            typedArray instanceof Uint32Array ||
	            typedArray instanceof Float32Array ||
	            typedArray instanceof Float64Array
	        ) {
	            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
	        }

	        // Handle Uint8Array
	        if (typedArray instanceof Uint8Array) {
	            // Shortcut
	            var typedArrayByteLength = typedArray.byteLength;

	            // Extract bytes
	            var words = [];
	            for (var i = 0; i < typedArrayByteLength; i++) {
	                words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
	            }

	            // Initialize this word array
	            superInit.call(this, words, typedArrayByteLength);
	        } else {
	            // Else call normal init
	            superInit.apply(this, arguments);
	        }
	    };

	    subInit.prototype = WordArray;
	}());


	return CryptoJS.lib.WordArray;

}));
},{"./core":9}],17:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Constants table
	    var T = [];

	    // Compute constants
	    (function () {
	        for (var i = 0; i < 64; i++) {
	            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
	        }
	    }());

	    /**
	     * MD5 hash algorithm.
	     */
	    var MD5 = C_algo.MD5 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Swap endian
	            for (var i = 0; i < 16; i++) {
	                // Shortcuts
	                var offset_i = offset + i;
	                var M_offset_i = M[offset_i];

	                M[offset_i] = (
	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	                );
	            }

	            // Shortcuts
	            var H = this._hash.words;

	            var M_offset_0  = M[offset + 0];
	            var M_offset_1  = M[offset + 1];
	            var M_offset_2  = M[offset + 2];
	            var M_offset_3  = M[offset + 3];
	            var M_offset_4  = M[offset + 4];
	            var M_offset_5  = M[offset + 5];
	            var M_offset_6  = M[offset + 6];
	            var M_offset_7  = M[offset + 7];
	            var M_offset_8  = M[offset + 8];
	            var M_offset_9  = M[offset + 9];
	            var M_offset_10 = M[offset + 10];
	            var M_offset_11 = M[offset + 11];
	            var M_offset_12 = M[offset + 12];
	            var M_offset_13 = M[offset + 13];
	            var M_offset_14 = M[offset + 14];
	            var M_offset_15 = M[offset + 15];

	            // Working varialbes
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];

	            // Computation
	            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
	            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
	            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
	            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
	            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
	            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
	            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
	            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
	            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
	            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
	            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
	            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
	            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
	            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
	            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
	            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

	            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
	            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
	            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
	            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
	            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
	            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
	            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
	            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
	            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
	            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
	            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
	            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
	            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
	            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
	            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
	            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

	            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
	            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
	            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
	            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
	            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
	            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
	            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
	            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
	            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
	            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
	            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
	            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
	            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
	            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
	            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
	            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

	            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
	            d = II(d, a, b, c, M_offset_7,  10, T[49]);
	            c = II(c, d, a, b, M_offset_14, 15, T[50]);
	            b = II(b, c, d, a, M_offset_5,  21, T[51]);
	            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
	            d = II(d, a, b, c, M_offset_3,  10, T[53]);
	            c = II(c, d, a, b, M_offset_10, 15, T[54]);
	            b = II(b, c, d, a, M_offset_1,  21, T[55]);
	            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
	            d = II(d, a, b, c, M_offset_15, 10, T[57]);
	            c = II(c, d, a, b, M_offset_6,  15, T[58]);
	            b = II(b, c, d, a, M_offset_13, 21, T[59]);
	            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
	            d = II(d, a, b, c, M_offset_11, 10, T[61]);
	            c = II(c, d, a, b, M_offset_2,  15, T[62]);
	            b = II(b, c, d, a, M_offset_9,  21, T[63]);

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

	            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
	            var nBitsTotalL = nBitsTotal;
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
	                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
	            );
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
	            );

	            data.sigBytes = (dataWords.length + 1) * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var hash = this._hash;
	            var H = hash.words;

	            // Swap endian
	            for (var i = 0; i < 4; i++) {
	                // Shortcut
	                var H_i = H[i];

	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	            }

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    function FF(a, b, c, d, x, s, t) {
	        var n = a + ((b & c) | (~b & d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function GG(a, b, c, d, x, s, t) {
	        var n = a + ((b & d) | (c & ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function HH(a, b, c, d, x, s, t) {
	        var n = a + (b ^ c ^ d) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    function II(a, b, c, d, x, s, t) {
	        var n = a + (c ^ (b | ~d)) + x + t;
	        return ((n << s) | (n >>> (32 - s))) + b;
	    }

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.MD5('message');
	     *     var hash = CryptoJS.MD5(wordArray);
	     */
	    C.MD5 = Hasher._createHelper(MD5);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacMD5(message, key);
	     */
	    C.HmacMD5 = Hasher._createHmacHelper(MD5);
	}(Math));


	return CryptoJS.MD5;

}));
},{"./core":9}],18:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Cipher Feedback block mode.
	 */
	CryptoJS.mode.CFB = (function () {
	    var CFB = CryptoJS.lib.BlockCipherMode.extend();

	    CFB.Encryptor = CFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher;
	            var blockSize = cipher.blockSize;

	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

	            // Remember this block to use with next block
	            this._prevBlock = words.slice(offset, offset + blockSize);
	        }
	    });

	    CFB.Decryptor = CFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher;
	            var blockSize = cipher.blockSize;

	            // Remember this block to use with next block
	            var thisBlock = words.slice(offset, offset + blockSize);

	            generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

	            // This block becomes the previous block
	            this._prevBlock = thisBlock;
	        }
	    });

	    function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
	        // Shortcut
	        var iv = this._iv;

	        // Generate keystream
	        if (iv) {
	            var keystream = iv.slice(0);

	            // Remove IV for subsequent blocks
	            this._iv = undefined;
	        } else {
	            var keystream = this._prevBlock;
	        }
	        cipher.encryptBlock(keystream, 0);

	        // Encrypt
	        for (var i = 0; i < blockSize; i++) {
	            words[offset + i] ^= keystream[i];
	        }
	    }

	    return CFB;
	}());


	return CryptoJS.mode.CFB;

}));
},{"./cipher-core":8,"./core":9}],19:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/** @preserve
	 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
	 * derived from CryptoJS.mode.CTR
	 * Jan Hruby jhruby.web@gmail.com
	 */
	CryptoJS.mode.CTRGladman = (function () {
	    var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

		function incWord(word)
		{
			if (((word >> 24) & 0xff) === 0xff) { //overflow
			var b1 = (word >> 16)&0xff;
			var b2 = (word >> 8)&0xff;
			var b3 = word & 0xff;

			if (b1 === 0xff) // overflow b1
			{
			b1 = 0;
			if (b2 === 0xff)
			{
				b2 = 0;
				if (b3 === 0xff)
				{
					b3 = 0;
				}
				else
				{
					++b3;
				}
			}
			else
			{
				++b2;
			}
			}
			else
			{
			++b1;
			}

			word = 0;
			word += (b1 << 16);
			word += (b2 << 8);
			word += b3;
			}
			else
			{
			word += (0x01 << 24);
			}
			return word;
		}

		function incCounter(counter)
		{
			if ((counter[0] = incWord(counter[0])) === 0)
			{
				// encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
				counter[1] = incWord(counter[1]);
			}
			return counter;
		}

	    var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var counter = this._counter;

	            // Generate keystream
	            if (iv) {
	                counter = this._counter = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }

				incCounter(counter);

				var keystream = counter.slice(0);
	            cipher.encryptBlock(keystream, 0);

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    CTRGladman.Decryptor = Encryptor;

	    return CTRGladman;
	}());




	return CryptoJS.mode.CTRGladman;

}));
},{"./cipher-core":8,"./core":9}],20:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Counter block mode.
	 */
	CryptoJS.mode.CTR = (function () {
	    var CTR = CryptoJS.lib.BlockCipherMode.extend();

	    var Encryptor = CTR.Encryptor = CTR.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var counter = this._counter;

	            // Generate keystream
	            if (iv) {
	                counter = this._counter = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }
	            var keystream = counter.slice(0);
	            cipher.encryptBlock(keystream, 0);

	            // Increment counter
	            counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    CTR.Decryptor = Encryptor;

	    return CTR;
	}());


	return CryptoJS.mode.CTR;

}));
},{"./cipher-core":8,"./core":9}],21:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Electronic Codebook block mode.
	 */
	CryptoJS.mode.ECB = (function () {
	    var ECB = CryptoJS.lib.BlockCipherMode.extend();

	    ECB.Encryptor = ECB.extend({
	        processBlock: function (words, offset) {
	            this._cipher.encryptBlock(words, offset);
	        }
	    });

	    ECB.Decryptor = ECB.extend({
	        processBlock: function (words, offset) {
	            this._cipher.decryptBlock(words, offset);
	        }
	    });

	    return ECB;
	}());


	return CryptoJS.mode.ECB;

}));
},{"./cipher-core":8,"./core":9}],22:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Output Feedback block mode.
	 */
	CryptoJS.mode.OFB = (function () {
	    var OFB = CryptoJS.lib.BlockCipherMode.extend();

	    var Encryptor = OFB.Encryptor = OFB.extend({
	        processBlock: function (words, offset) {
	            // Shortcuts
	            var cipher = this._cipher
	            var blockSize = cipher.blockSize;
	            var iv = this._iv;
	            var keystream = this._keystream;

	            // Generate keystream
	            if (iv) {
	                keystream = this._keystream = iv.slice(0);

	                // Remove IV for subsequent blocks
	                this._iv = undefined;
	            }
	            cipher.encryptBlock(keystream, 0);

	            // Encrypt
	            for (var i = 0; i < blockSize; i++) {
	                words[offset + i] ^= keystream[i];
	            }
	        }
	    });

	    OFB.Decryptor = Encryptor;

	    return OFB;
	}());


	return CryptoJS.mode.OFB;

}));
},{"./cipher-core":8,"./core":9}],23:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * ANSI X.923 padding strategy.
	 */
	CryptoJS.pad.AnsiX923 = {
	    pad: function (data, blockSize) {
	        // Shortcuts
	        var dataSigBytes = data.sigBytes;
	        var blockSizeBytes = blockSize * 4;

	        // Count padding bytes
	        var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

	        // Compute last byte position
	        var lastBytePos = dataSigBytes + nPaddingBytes - 1;

	        // Pad
	        data.clamp();
	        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
	        data.sigBytes += nPaddingBytes;
	    },

	    unpad: function (data) {
	        // Get number of padding bytes from last byte
	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	        // Remove padding
	        data.sigBytes -= nPaddingBytes;
	    }
	};


	return CryptoJS.pad.Ansix923;

}));
},{"./cipher-core":8,"./core":9}],24:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * ISO 10126 padding strategy.
	 */
	CryptoJS.pad.Iso10126 = {
	    pad: function (data, blockSize) {
	        // Shortcut
	        var blockSizeBytes = blockSize * 4;

	        // Count padding bytes
	        var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

	        // Pad
	        data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).
	             concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
	    },

	    unpad: function (data) {
	        // Get number of padding bytes from last byte
	        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

	        // Remove padding
	        data.sigBytes -= nPaddingBytes;
	    }
	};


	return CryptoJS.pad.Iso10126;

}));
},{"./cipher-core":8,"./core":9}],25:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * ISO/IEC 9797-1 Padding Method 2.
	 */
	CryptoJS.pad.Iso97971 = {
	    pad: function (data, blockSize) {
	        // Add 0x80 byte
	        data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

	        // Zero pad the rest
	        CryptoJS.pad.ZeroPadding.pad(data, blockSize);
	    },

	    unpad: function (data) {
	        // Remove zero padding
	        CryptoJS.pad.ZeroPadding.unpad(data);

	        // Remove one more byte -- the 0x80 byte
	        data.sigBytes--;
	    }
	};


	return CryptoJS.pad.Iso97971;

}));
},{"./cipher-core":8,"./core":9}],26:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * A noop padding strategy.
	 */
	CryptoJS.pad.NoPadding = {
	    pad: function () {
	    },

	    unpad: function () {
	    }
	};


	return CryptoJS.pad.NoPadding;

}));
},{"./cipher-core":8,"./core":9}],27:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/**
	 * Zero padding strategy.
	 */
	CryptoJS.pad.ZeroPadding = {
	    pad: function (data, blockSize) {
	        // Shortcut
	        var blockSizeBytes = blockSize * 4;

	        // Pad
	        data.clamp();
	        data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
	    },

	    unpad: function (data) {
	        // Shortcut
	        var dataWords = data.words;

	        // Unpad
	        var i = data.sigBytes - 1;
	        while (!((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
	            i--;
	        }
	        data.sigBytes = i + 1;
	    }
	};


	return CryptoJS.pad.ZeroPadding;

}));
},{"./cipher-core":8,"./core":9}],28:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./sha1"), require("./hmac"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./sha1", "./hmac"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var SHA1 = C_algo.SHA1;
	    var HMAC = C_algo.HMAC;

	    /**
	     * Password-Based Key Derivation Function 2 algorithm.
	     */
	    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
	         * @property {Hasher} hasher The hasher to use. Default: SHA1
	         * @property {number} iterations The number of iterations to perform. Default: 1
	         */
	        cfg: Base.extend({
	            keySize: 128/32,
	            hasher: SHA1,
	            iterations: 1
	        }),

	        /**
	         * Initializes a newly created key derivation function.
	         *
	         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
	         *
	         * @example
	         *
	         *     var kdf = CryptoJS.algo.PBKDF2.create();
	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
	         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
	         */
	        init: function (cfg) {
	            this.cfg = this.cfg.extend(cfg);
	        },

	        /**
	         * Computes the Password-Based Key Derivation Function 2.
	         *
	         * @param {WordArray|string} password The password.
	         * @param {WordArray|string} salt A salt.
	         *
	         * @return {WordArray} The derived key.
	         *
	         * @example
	         *
	         *     var key = kdf.compute(password, salt);
	         */
	        compute: function (password, salt) {
	            // Shortcut
	            var cfg = this.cfg;

	            // Init HMAC
	            var hmac = HMAC.create(cfg.hasher, password);

	            // Initial values
	            var derivedKey = WordArray.create();
	            var blockIndex = WordArray.create([0x00000001]);

	            // Shortcuts
	            var derivedKeyWords = derivedKey.words;
	            var blockIndexWords = blockIndex.words;
	            var keySize = cfg.keySize;
	            var iterations = cfg.iterations;

	            // Generate key
	            while (derivedKeyWords.length < keySize) {
	                var block = hmac.update(salt).finalize(blockIndex);
	                hmac.reset();

	                // Shortcuts
	                var blockWords = block.words;
	                var blockWordsLength = blockWords.length;

	                // Iterations
	                var intermediate = block;
	                for (var i = 1; i < iterations; i++) {
	                    intermediate = hmac.finalize(intermediate);
	                    hmac.reset();

	                    // Shortcut
	                    var intermediateWords = intermediate.words;

	                    // XOR intermediate with block
	                    for (var j = 0; j < blockWordsLength; j++) {
	                        blockWords[j] ^= intermediateWords[j];
	                    }
	                }

	                derivedKey.concat(block);
	                blockIndexWords[0]++;
	            }
	            derivedKey.sigBytes = keySize * 4;

	            return derivedKey;
	        }
	    });

	    /**
	     * Computes the Password-Based Key Derivation Function 2.
	     *
	     * @param {WordArray|string} password The password.
	     * @param {WordArray|string} salt A salt.
	     * @param {Object} cfg (Optional) The configuration options to use for this computation.
	     *
	     * @return {WordArray} The derived key.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var key = CryptoJS.PBKDF2(password, salt);
	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
	     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
	     */
	    C.PBKDF2 = function (password, salt, cfg) {
	        return PBKDF2.create(cfg).compute(password, salt);
	    };
	}());


	return CryptoJS.PBKDF2;

}));
},{"./core":9,"./hmac":14,"./sha1":33}],29:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./enc-base64"), require("./md5"), require("./evpkdf"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    // Reusable objects
	    var S  = [];
	    var C_ = [];
	    var G  = [];

	    /**
	     * Rabbit stream cipher algorithm.
	     *
	     * This is a legacy version that neglected to convert the key to little-endian.
	     * This error doesn't affect the cipher's security,
	     * but it does affect its compatibility with other implementations.
	     */
	    var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var K = this._key.words;
	            var iv = this.cfg.iv;

	            // Generate initial state values
	            var X = this._X = [
	                K[0], (K[3] << 16) | (K[2] >>> 16),
	                K[1], (K[0] << 16) | (K[3] >>> 16),
	                K[2], (K[1] << 16) | (K[0] >>> 16),
	                K[3], (K[2] << 16) | (K[1] >>> 16)
	            ];

	            // Generate initial counter values
	            var C = this._C = [
	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
	            ];

	            // Carry bit
	            this._b = 0;

	            // Iterate the system four times
	            for (var i = 0; i < 4; i++) {
	                nextState.call(this);
	            }

	            // Modify the counters
	            for (var i = 0; i < 8; i++) {
	                C[i] ^= X[(i + 4) & 7];
	            }

	            // IV setup
	            if (iv) {
	                // Shortcuts
	                var IV = iv.words;
	                var IV_0 = IV[0];
	                var IV_1 = IV[1];

	                // Generate four subvectors
	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

	                // Modify counter values
	                C[0] ^= i0;
	                C[1] ^= i1;
	                C[2] ^= i2;
	                C[3] ^= i3;
	                C[4] ^= i0;
	                C[5] ^= i1;
	                C[6] ^= i2;
	                C[7] ^= i3;

	                // Iterate the system four times
	                for (var i = 0; i < 4; i++) {
	                    nextState.call(this);
	                }
	            }
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var X = this._X;

	            // Iterate the system
	            nextState.call(this);

	            // Generate four keystream words
	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

	            for (var i = 0; i < 4; i++) {
	                // Swap endian
	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

	                // Encrypt
	                M[offset + i] ^= S[i];
	            }
	        },

	        blockSize: 128/32,

	        ivSize: 64/32
	    });

	    function nextState() {
	        // Shortcuts
	        var X = this._X;
	        var C = this._C;

	        // Save old counter values
	        for (var i = 0; i < 8; i++) {
	            C_[i] = C[i];
	        }

	        // Calculate new counter values
	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

	        // Calculate the g-values
	        for (var i = 0; i < 8; i++) {
	            var gx = X[i] + C[i];

	            // Construct high and low argument for squaring
	            var ga = gx & 0xffff;
	            var gb = gx >>> 16;

	            // Calculate high and low result of squaring
	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

	            // High XOR low
	            G[i] = gh ^ gl;
	        }

	        // Calculate new state values
	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
	     */
	    C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
	}());


	return CryptoJS.RabbitLegacy;

}));
},{"./cipher-core":8,"./core":9,"./enc-base64":10,"./evpkdf":12,"./md5":17}],30:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./enc-base64"), require("./md5"), require("./evpkdf"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    // Reusable objects
	    var S  = [];
	    var C_ = [];
	    var G  = [];

	    /**
	     * Rabbit stream cipher algorithm
	     */
	    var Rabbit = C_algo.Rabbit = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var K = this._key.words;
	            var iv = this.cfg.iv;

	            // Swap endian
	            for (var i = 0; i < 4; i++) {
	                K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
	                       (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
	            }

	            // Generate initial state values
	            var X = this._X = [
	                K[0], (K[3] << 16) | (K[2] >>> 16),
	                K[1], (K[0] << 16) | (K[3] >>> 16),
	                K[2], (K[1] << 16) | (K[0] >>> 16),
	                K[3], (K[2] << 16) | (K[1] >>> 16)
	            ];

	            // Generate initial counter values
	            var C = this._C = [
	                (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
	                (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
	                (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
	                (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
	            ];

	            // Carry bit
	            this._b = 0;

	            // Iterate the system four times
	            for (var i = 0; i < 4; i++) {
	                nextState.call(this);
	            }

	            // Modify the counters
	            for (var i = 0; i < 8; i++) {
	                C[i] ^= X[(i + 4) & 7];
	            }

	            // IV setup
	            if (iv) {
	                // Shortcuts
	                var IV = iv.words;
	                var IV_0 = IV[0];
	                var IV_1 = IV[1];

	                // Generate four subvectors
	                var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
	                var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
	                var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
	                var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

	                // Modify counter values
	                C[0] ^= i0;
	                C[1] ^= i1;
	                C[2] ^= i2;
	                C[3] ^= i3;
	                C[4] ^= i0;
	                C[5] ^= i1;
	                C[6] ^= i2;
	                C[7] ^= i3;

	                // Iterate the system four times
	                for (var i = 0; i < 4; i++) {
	                    nextState.call(this);
	                }
	            }
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var X = this._X;

	            // Iterate the system
	            nextState.call(this);

	            // Generate four keystream words
	            S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
	            S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
	            S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
	            S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

	            for (var i = 0; i < 4; i++) {
	                // Swap endian
	                S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
	                       (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

	                // Encrypt
	                M[offset + i] ^= S[i];
	            }
	        },

	        blockSize: 128/32,

	        ivSize: 64/32
	    });

	    function nextState() {
	        // Shortcuts
	        var X = this._X;
	        var C = this._C;

	        // Save old counter values
	        for (var i = 0; i < 8; i++) {
	            C_[i] = C[i];
	        }

	        // Calculate new counter values
	        C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
	        C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
	        C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
	        C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
	        C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
	        C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
	        C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
	        C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
	        this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

	        // Calculate the g-values
	        for (var i = 0; i < 8; i++) {
	            var gx = X[i] + C[i];

	            // Construct high and low argument for squaring
	            var ga = gx & 0xffff;
	            var gb = gx >>> 16;

	            // Calculate high and low result of squaring
	            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
	            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

	            // High XOR low
	            G[i] = gh ^ gl;
	        }

	        // Calculate new state values
	        X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
	        X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
	        X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
	        X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
	        X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
	        X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
	        X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
	        X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
	     */
	    C.Rabbit = StreamCipher._createHelper(Rabbit);
	}());


	return CryptoJS.Rabbit;

}));
},{"./cipher-core":8,"./core":9,"./enc-base64":10,"./evpkdf":12,"./md5":17}],31:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./enc-base64"), require("./md5"), require("./evpkdf"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var StreamCipher = C_lib.StreamCipher;
	    var C_algo = C.algo;

	    /**
	     * RC4 stream cipher algorithm.
	     */
	    var RC4 = C_algo.RC4 = StreamCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;
	            var keySigBytes = key.sigBytes;

	            // Init sbox
	            var S = this._S = [];
	            for (var i = 0; i < 256; i++) {
	                S[i] = i;
	            }

	            // Key setup
	            for (var i = 0, j = 0; i < 256; i++) {
	                var keyByteIndex = i % keySigBytes;
	                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

	                j = (j + S[i] + keyByte) % 256;

	                // Swap
	                var t = S[i];
	                S[i] = S[j];
	                S[j] = t;
	            }

	            // Counters
	            this._i = this._j = 0;
	        },

	        _doProcessBlock: function (M, offset) {
	            M[offset] ^= generateKeystreamWord.call(this);
	        },

	        keySize: 256/32,

	        ivSize: 0
	    });

	    function generateKeystreamWord() {
	        // Shortcuts
	        var S = this._S;
	        var i = this._i;
	        var j = this._j;

	        // Generate keystream word
	        var keystreamWord = 0;
	        for (var n = 0; n < 4; n++) {
	            i = (i + 1) % 256;
	            j = (j + S[i]) % 256;

	            // Swap
	            var t = S[i];
	            S[i] = S[j];
	            S[j] = t;

	            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
	        }

	        // Update counters
	        this._i = i;
	        this._j = j;

	        return keystreamWord;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
	     */
	    C.RC4 = StreamCipher._createHelper(RC4);

	    /**
	     * Modified RC4 stream cipher algorithm.
	     */
	    var RC4Drop = C_algo.RC4Drop = RC4.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} drop The number of keystream words to drop. Default 192
	         */
	        cfg: RC4.cfg.extend({
	            drop: 192
	        }),

	        _doReset: function () {
	            RC4._doReset.call(this);

	            // Drop
	            for (var i = this.cfg.drop; i > 0; i--) {
	                generateKeystreamWord.call(this);
	            }
	        }
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
	     */
	    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
	}());


	return CryptoJS.RC4;

}));
},{"./cipher-core":8,"./core":9,"./enc-base64":10,"./evpkdf":12,"./md5":17}],32:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	/** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Constants table
	    var _zl = WordArray.create([
	        0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
	        7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
	        3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
	        1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
	        4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13]);
	    var _zr = WordArray.create([
	        5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
	        6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
	        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
	        8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
	        12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11]);
	    var _sl = WordArray.create([
	         11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
	        7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
	        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
	          11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
	        9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ]);
	    var _sr = WordArray.create([
	        8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
	        9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
	        9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
	        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
	        8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ]);

	    var _hl =  WordArray.create([ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
	    var _hr =  WordArray.create([ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

	    /**
	     * RIPEMD160 hash algorithm.
	     */
	    var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
	        _doReset: function () {
	            this._hash  = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
	        },

	        _doProcessBlock: function (M, offset) {

	            // Swap endian
	            for (var i = 0; i < 16; i++) {
	                // Shortcuts
	                var offset_i = offset + i;
	                var M_offset_i = M[offset_i];

	                // Swap
	                M[offset_i] = (
	                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
	                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
	                );
	            }
	            // Shortcut
	            var H  = this._hash.words;
	            var hl = _hl.words;
	            var hr = _hr.words;
	            var zl = _zl.words;
	            var zr = _zr.words;
	            var sl = _sl.words;
	            var sr = _sr.words;

	            // Working variables
	            var al, bl, cl, dl, el;
	            var ar, br, cr, dr, er;

	            ar = al = H[0];
	            br = bl = H[1];
	            cr = cl = H[2];
	            dr = dl = H[3];
	            er = el = H[4];
	            // Computation
	            var t;
	            for (var i = 0; i < 80; i += 1) {
	                t = (al +  M[offset+zl[i]])|0;
	                if (i<16){
		            t +=  f1(bl,cl,dl) + hl[0];
	                } else if (i<32) {
		            t +=  f2(bl,cl,dl) + hl[1];
	                } else if (i<48) {
		            t +=  f3(bl,cl,dl) + hl[2];
	                } else if (i<64) {
		            t +=  f4(bl,cl,dl) + hl[3];
	                } else {// if (i<80) {
		            t +=  f5(bl,cl,dl) + hl[4];
	                }
	                t = t|0;
	                t =  rotl(t,sl[i]);
	                t = (t+el)|0;
	                al = el;
	                el = dl;
	                dl = rotl(cl, 10);
	                cl = bl;
	                bl = t;

	                t = (ar + M[offset+zr[i]])|0;
	                if (i<16){
		            t +=  f5(br,cr,dr) + hr[0];
	                } else if (i<32) {
		            t +=  f4(br,cr,dr) + hr[1];
	                } else if (i<48) {
		            t +=  f3(br,cr,dr) + hr[2];
	                } else if (i<64) {
		            t +=  f2(br,cr,dr) + hr[3];
	                } else {// if (i<80) {
		            t +=  f1(br,cr,dr) + hr[4];
	                }
	                t = t|0;
	                t =  rotl(t,sr[i]) ;
	                t = (t+er)|0;
	                ar = er;
	                er = dr;
	                dr = rotl(cr, 10);
	                cr = br;
	                br = t;
	            }
	            // Intermediate hash value
	            t    = (H[1] + cl + dr)|0;
	            H[1] = (H[2] + dl + er)|0;
	            H[2] = (H[3] + el + ar)|0;
	            H[3] = (H[4] + al + br)|0;
	            H[4] = (H[0] + bl + cr)|0;
	            H[0] =  t;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
	                (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
	                (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
	            );
	            data.sigBytes = (dataWords.length + 1) * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var hash = this._hash;
	            var H = hash.words;

	            // Swap endian
	            for (var i = 0; i < 5; i++) {
	                // Shortcut
	                var H_i = H[i];

	                // Swap
	                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
	                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
	            }

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });


	    function f1(x, y, z) {
	        return ((x) ^ (y) ^ (z));

	    }

	    function f2(x, y, z) {
	        return (((x)&(y)) | ((~x)&(z)));
	    }

	    function f3(x, y, z) {
	        return (((x) | (~(y))) ^ (z));
	    }

	    function f4(x, y, z) {
	        return (((x) & (z)) | ((y)&(~(z))));
	    }

	    function f5(x, y, z) {
	        return ((x) ^ ((y) |(~(z))));

	    }

	    function rotl(x,n) {
	        return (x<<n) | (x>>>(32-n));
	    }


	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.RIPEMD160('message');
	     *     var hash = CryptoJS.RIPEMD160(wordArray);
	     */
	    C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
	     */
	    C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
	}(Math));


	return CryptoJS.RIPEMD160;

}));
},{"./core":9}],33:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-1 hash algorithm.
	     */
	    var SHA1 = C_algo.SHA1 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0x67452301, 0xefcdab89,
	                0x98badcfe, 0x10325476,
	                0xc3d2e1f0
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];

	            // Computation
	            for (var i = 0; i < 80; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
	                    W[i] = (n << 1) | (n >>> 31);
	                }

	                var t = ((a << 5) | (a >>> 27)) + e + W[i];
	                if (i < 20) {
	                    t += ((b & c) | (~b & d)) + 0x5a827999;
	                } else if (i < 40) {
	                    t += (b ^ c ^ d) + 0x6ed9eba1;
	                } else if (i < 60) {
	                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
	                } else /* if (i < 80) */ {
	                    t += (b ^ c ^ d) - 0x359d3e2a;
	                }

	                e = d;
	                d = c;
	                c = (b << 30) | (b >>> 2);
	                b = a;
	                a = t;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA1('message');
	     *     var hash = CryptoJS.SHA1(wordArray);
	     */
	    C.SHA1 = Hasher._createHelper(SHA1);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA1(message, key);
	     */
	    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
	}());


	return CryptoJS.SHA1;

}));
},{"./core":9}],34:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./sha256"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./sha256"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var C_algo = C.algo;
	    var SHA256 = C_algo.SHA256;

	    /**
	     * SHA-224 hash algorithm.
	     */
	    var SHA224 = C_algo.SHA224 = SHA256.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init([
	                0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
	                0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
	            ]);
	        },

	        _doFinalize: function () {
	            var hash = SHA256._doFinalize.call(this);

	            hash.sigBytes -= 4;

	            return hash;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA224('message');
	     *     var hash = CryptoJS.SHA224(wordArray);
	     */
	    C.SHA224 = SHA256._createHelper(SHA224);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA224(message, key);
	     */
	    C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
	}());


	return CryptoJS.SHA224;

}));
},{"./core":9,"./sha256":35}],35:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_algo = C.algo;

	    // Initialization and round constants tables
	    var H = [];
	    var K = [];

	    // Compute constants
	    (function () {
	        function isPrime(n) {
	            var sqrtN = Math.sqrt(n);
	            for (var factor = 2; factor <= sqrtN; factor++) {
	                if (!(n % factor)) {
	                    return false;
	                }
	            }

	            return true;
	        }

	        function getFractionalBits(n) {
	            return ((n - (n | 0)) * 0x100000000) | 0;
	        }

	        var n = 2;
	        var nPrime = 0;
	        while (nPrime < 64) {
	            if (isPrime(n)) {
	                if (nPrime < 8) {
	                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
	                }
	                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

	                nPrime++;
	            }

	            n++;
	        }
	    }());

	    // Reusable object
	    var W = [];

	    /**
	     * SHA-256 hash algorithm.
	     */
	    var SHA256 = C_algo.SHA256 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new WordArray.init(H.slice(0));
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcut
	            var H = this._hash.words;

	            // Working variables
	            var a = H[0];
	            var b = H[1];
	            var c = H[2];
	            var d = H[3];
	            var e = H[4];
	            var f = H[5];
	            var g = H[6];
	            var h = H[7];

	            // Computation
	            for (var i = 0; i < 64; i++) {
	                if (i < 16) {
	                    W[i] = M[offset + i] | 0;
	                } else {
	                    var gamma0x = W[i - 15];
	                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
	                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
	                                   (gamma0x >>> 3);

	                    var gamma1x = W[i - 2];
	                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
	                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
	                                   (gamma1x >>> 10);

	                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
	                }

	                var ch  = (e & f) ^ (~e & g);
	                var maj = (a & b) ^ (a & c) ^ (b & c);

	                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
	                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

	                var t1 = h + sigma1 + ch + K[i] + W[i];
	                var t2 = sigma0 + maj;

	                h = g;
	                g = f;
	                f = e;
	                e = (d + t1) | 0;
	                d = c;
	                c = b;
	                b = a;
	                a = (t1 + t2) | 0;
	            }

	            // Intermediate hash value
	            H[0] = (H[0] + a) | 0;
	            H[1] = (H[1] + b) | 0;
	            H[2] = (H[2] + c) | 0;
	            H[3] = (H[3] + d) | 0;
	            H[4] = (H[4] + e) | 0;
	            H[5] = (H[5] + f) | 0;
	            H[6] = (H[6] + g) | 0;
	            H[7] = (H[7] + h) | 0;
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Return final computed hash
	            return this._hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA256('message');
	     *     var hash = CryptoJS.SHA256(wordArray);
	     */
	    C.SHA256 = Hasher._createHelper(SHA256);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA256(message, key);
	     */
	    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
	}(Math));


	return CryptoJS.SHA256;

}));
},{"./core":9}],36:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./x64-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (Math) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var Hasher = C_lib.Hasher;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var C_algo = C.algo;

	    // Constants tables
	    var RHO_OFFSETS = [];
	    var PI_INDEXES  = [];
	    var ROUND_CONSTANTS = [];

	    // Compute Constants
	    (function () {
	        // Compute rho offset constants
	        var x = 1, y = 0;
	        for (var t = 0; t < 24; t++) {
	            RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

	            var newX = y % 5;
	            var newY = (2 * x + 3 * y) % 5;
	            x = newX;
	            y = newY;
	        }

	        // Compute pi index constants
	        for (var x = 0; x < 5; x++) {
	            for (var y = 0; y < 5; y++) {
	                PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
	            }
	        }

	        // Compute round constants
	        var LFSR = 0x01;
	        for (var i = 0; i < 24; i++) {
	            var roundConstantMsw = 0;
	            var roundConstantLsw = 0;

	            for (var j = 0; j < 7; j++) {
	                if (LFSR & 0x01) {
	                    var bitPosition = (1 << j) - 1;
	                    if (bitPosition < 32) {
	                        roundConstantLsw ^= 1 << bitPosition;
	                    } else /* if (bitPosition >= 32) */ {
	                        roundConstantMsw ^= 1 << (bitPosition - 32);
	                    }
	                }

	                // Compute next LFSR
	                if (LFSR & 0x80) {
	                    // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
	                    LFSR = (LFSR << 1) ^ 0x71;
	                } else {
	                    LFSR <<= 1;
	                }
	            }

	            ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
	        }
	    }());

	    // Reusable objects for temporary values
	    var T = [];
	    (function () {
	        for (var i = 0; i < 25; i++) {
	            T[i] = X64Word.create();
	        }
	    }());

	    /**
	     * SHA-3 hash algorithm.
	     */
	    var SHA3 = C_algo.SHA3 = Hasher.extend({
	        /**
	         * Configuration options.
	         *
	         * @property {number} outputLength
	         *   The desired number of bits in the output hash.
	         *   Only values permitted are: 224, 256, 384, 512.
	         *   Default: 512
	         */
	        cfg: Hasher.cfg.extend({
	            outputLength: 512
	        }),

	        _doReset: function () {
	            var state = this._state = []
	            for (var i = 0; i < 25; i++) {
	                state[i] = new X64Word.init();
	            }

	            this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcuts
	            var state = this._state;
	            var nBlockSizeLanes = this.blockSize / 2;

	            // Absorb
	            for (var i = 0; i < nBlockSizeLanes; i++) {
	                // Shortcuts
	                var M2i  = M[offset + 2 * i];
	                var M2i1 = M[offset + 2 * i + 1];

	                // Swap endian
	                M2i = (
	                    (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
	                    (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
	                );
	                M2i1 = (
	                    (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
	                    (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
	                );

	                // Absorb message into state
	                var lane = state[i];
	                lane.high ^= M2i1;
	                lane.low  ^= M2i;
	            }

	            // Rounds
	            for (var round = 0; round < 24; round++) {
	                // Theta
	                for (var x = 0; x < 5; x++) {
	                    // Mix column lanes
	                    var tMsw = 0, tLsw = 0;
	                    for (var y = 0; y < 5; y++) {
	                        var lane = state[x + 5 * y];
	                        tMsw ^= lane.high;
	                        tLsw ^= lane.low;
	                    }

	                    // Temporary values
	                    var Tx = T[x];
	                    Tx.high = tMsw;
	                    Tx.low  = tLsw;
	                }
	                for (var x = 0; x < 5; x++) {
	                    // Shortcuts
	                    var Tx4 = T[(x + 4) % 5];
	                    var Tx1 = T[(x + 1) % 5];
	                    var Tx1Msw = Tx1.high;
	                    var Tx1Lsw = Tx1.low;

	                    // Mix surrounding columns
	                    var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
	                    var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
	                    for (var y = 0; y < 5; y++) {
	                        var lane = state[x + 5 * y];
	                        lane.high ^= tMsw;
	                        lane.low  ^= tLsw;
	                    }
	                }

	                // Rho Pi
	                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
	                    // Shortcuts
	                    var lane = state[laneIndex];
	                    var laneMsw = lane.high;
	                    var laneLsw = lane.low;
	                    var rhoOffset = RHO_OFFSETS[laneIndex];

	                    // Rotate lanes
	                    if (rhoOffset < 32) {
	                        var tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
	                        var tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
	                    } else /* if (rhoOffset >= 32) */ {
	                        var tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
	                        var tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
	                    }

	                    // Transpose lanes
	                    var TPiLane = T[PI_INDEXES[laneIndex]];
	                    TPiLane.high = tMsw;
	                    TPiLane.low  = tLsw;
	                }

	                // Rho pi at x = y = 0
	                var T0 = T[0];
	                var state0 = state[0];
	                T0.high = state0.high;
	                T0.low  = state0.low;

	                // Chi
	                for (var x = 0; x < 5; x++) {
	                    for (var y = 0; y < 5; y++) {
	                        // Shortcuts
	                        var laneIndex = x + 5 * y;
	                        var lane = state[laneIndex];
	                        var TLane = T[laneIndex];
	                        var Tx1Lane = T[((x + 1) % 5) + 5 * y];
	                        var Tx2Lane = T[((x + 2) % 5) + 5 * y];

	                        // Mix rows
	                        lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
	                        lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
	                    }
	                }

	                // Iota
	                var lane = state[0];
	                var roundConstant = ROUND_CONSTANTS[round];
	                lane.high ^= roundConstant.high;
	                lane.low  ^= roundConstant.low;;
	            }
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;
	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;
	            var blockSizeBits = this.blockSize * 32;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
	            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Shortcuts
	            var state = this._state;
	            var outputLengthBytes = this.cfg.outputLength / 8;
	            var outputLengthLanes = outputLengthBytes / 8;

	            // Squeeze
	            var hashWords = [];
	            for (var i = 0; i < outputLengthLanes; i++) {
	                // Shortcuts
	                var lane = state[i];
	                var laneMsw = lane.high;
	                var laneLsw = lane.low;

	                // Swap endian
	                laneMsw = (
	                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
	                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
	                );
	                laneLsw = (
	                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
	                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
	                );

	                // Squeeze state to retrieve hash
	                hashWords.push(laneLsw);
	                hashWords.push(laneMsw);
	            }

	            // Return final computed hash
	            return new WordArray.init(hashWords, outputLengthBytes);
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);

	            var state = clone._state = this._state.slice(0);
	            for (var i = 0; i < 25; i++) {
	                state[i] = state[i].clone();
	            }

	            return clone;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA3('message');
	     *     var hash = CryptoJS.SHA3(wordArray);
	     */
	    C.SHA3 = Hasher._createHelper(SHA3);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA3(message, key);
	     */
	    C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
	}(Math));


	return CryptoJS.SHA3;

}));
},{"./core":9,"./x64-core":40}],37:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./x64-core"), require("./sha512"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core", "./sha512"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var X64WordArray = C_x64.WordArray;
	    var C_algo = C.algo;
	    var SHA512 = C_algo.SHA512;

	    /**
	     * SHA-384 hash algorithm.
	     */
	    var SHA384 = C_algo.SHA384 = SHA512.extend({
	        _doReset: function () {
	            this._hash = new X64WordArray.init([
	                new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
	                new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
	                new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
	                new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
	            ]);
	        },

	        _doFinalize: function () {
	            var hash = SHA512._doFinalize.call(this);

	            hash.sigBytes -= 16;

	            return hash;
	        }
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA384('message');
	     *     var hash = CryptoJS.SHA384(wordArray);
	     */
	    C.SHA384 = SHA512._createHelper(SHA384);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA384(message, key);
	     */
	    C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
	}());


	return CryptoJS.SHA384;

}));
},{"./core":9,"./sha512":38,"./x64-core":40}],38:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./x64-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./x64-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Hasher = C_lib.Hasher;
	    var C_x64 = C.x64;
	    var X64Word = C_x64.Word;
	    var X64WordArray = C_x64.WordArray;
	    var C_algo = C.algo;

	    function X64Word_create() {
	        return X64Word.create.apply(X64Word, arguments);
	    }

	    // Constants
	    var K = [
	        X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
	        X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
	        X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
	        X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
	        X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
	        X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
	        X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
	        X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
	        X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
	        X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
	        X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
	        X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
	        X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
	        X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
	        X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
	        X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
	        X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
	        X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
	        X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
	        X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
	        X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
	        X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
	        X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
	        X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
	        X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
	        X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
	        X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
	        X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
	        X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
	        X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
	        X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
	        X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
	        X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
	        X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
	        X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
	        X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
	        X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
	        X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
	        X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
	        X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
	    ];

	    // Reusable objects
	    var W = [];
	    (function () {
	        for (var i = 0; i < 80; i++) {
	            W[i] = X64Word_create();
	        }
	    }());

	    /**
	     * SHA-512 hash algorithm.
	     */
	    var SHA512 = C_algo.SHA512 = Hasher.extend({
	        _doReset: function () {
	            this._hash = new X64WordArray.init([
	                new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
	                new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
	                new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
	                new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
	            ]);
	        },

	        _doProcessBlock: function (M, offset) {
	            // Shortcuts
	            var H = this._hash.words;

	            var H0 = H[0];
	            var H1 = H[1];
	            var H2 = H[2];
	            var H3 = H[3];
	            var H4 = H[4];
	            var H5 = H[5];
	            var H6 = H[6];
	            var H7 = H[7];

	            var H0h = H0.high;
	            var H0l = H0.low;
	            var H1h = H1.high;
	            var H1l = H1.low;
	            var H2h = H2.high;
	            var H2l = H2.low;
	            var H3h = H3.high;
	            var H3l = H3.low;
	            var H4h = H4.high;
	            var H4l = H4.low;
	            var H5h = H5.high;
	            var H5l = H5.low;
	            var H6h = H6.high;
	            var H6l = H6.low;
	            var H7h = H7.high;
	            var H7l = H7.low;

	            // Working variables
	            var ah = H0h;
	            var al = H0l;
	            var bh = H1h;
	            var bl = H1l;
	            var ch = H2h;
	            var cl = H2l;
	            var dh = H3h;
	            var dl = H3l;
	            var eh = H4h;
	            var el = H4l;
	            var fh = H5h;
	            var fl = H5l;
	            var gh = H6h;
	            var gl = H6l;
	            var hh = H7h;
	            var hl = H7l;

	            // Rounds
	            for (var i = 0; i < 80; i++) {
	                // Shortcut
	                var Wi = W[i];

	                // Extend message
	                if (i < 16) {
	                    var Wih = Wi.high = M[offset + i * 2]     | 0;
	                    var Wil = Wi.low  = M[offset + i * 2 + 1] | 0;
	                } else {
	                    // Gamma0
	                    var gamma0x  = W[i - 15];
	                    var gamma0xh = gamma0x.high;
	                    var gamma0xl = gamma0x.low;
	                    var gamma0h  = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
	                    var gamma0l  = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

	                    // Gamma1
	                    var gamma1x  = W[i - 2];
	                    var gamma1xh = gamma1x.high;
	                    var gamma1xl = gamma1x.low;
	                    var gamma1h  = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
	                    var gamma1l  = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

	                    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	                    var Wi7  = W[i - 7];
	                    var Wi7h = Wi7.high;
	                    var Wi7l = Wi7.low;

	                    var Wi16  = W[i - 16];
	                    var Wi16h = Wi16.high;
	                    var Wi16l = Wi16.low;

	                    var Wil = gamma0l + Wi7l;
	                    var Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
	                    var Wil = Wil + gamma1l;
	                    var Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
	                    var Wil = Wil + Wi16l;
	                    var Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

	                    Wi.high = Wih;
	                    Wi.low  = Wil;
	                }

	                var chh  = (eh & fh) ^ (~eh & gh);
	                var chl  = (el & fl) ^ (~el & gl);
	                var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
	                var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

	                var sigma0h = ((ah >>> 28) | (al << 4))  ^ ((ah << 30)  | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
	                var sigma0l = ((al >>> 28) | (ah << 4))  ^ ((al << 30)  | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
	                var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
	                var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

	                // t1 = h + sigma1 + ch + K[i] + W[i]
	                var Ki  = K[i];
	                var Kih = Ki.high;
	                var Kil = Ki.low;

	                var t1l = hl + sigma1l;
	                var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
	                var t1l = t1l + chl;
	                var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
	                var t1l = t1l + Kil;
	                var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
	                var t1l = t1l + Wil;
	                var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

	                // t2 = sigma0 + maj
	                var t2l = sigma0l + majl;
	                var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

	                // Update working variables
	                hh = gh;
	                hl = gl;
	                gh = fh;
	                gl = fl;
	                fh = eh;
	                fl = el;
	                el = (dl + t1l) | 0;
	                eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
	                dh = ch;
	                dl = cl;
	                ch = bh;
	                cl = bl;
	                bh = ah;
	                bl = al;
	                al = (t1l + t2l) | 0;
	                ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
	            }

	            // Intermediate hash value
	            H0l = H0.low  = (H0l + al);
	            H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
	            H1l = H1.low  = (H1l + bl);
	            H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
	            H2l = H2.low  = (H2l + cl);
	            H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
	            H3l = H3.low  = (H3l + dl);
	            H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
	            H4l = H4.low  = (H4l + el);
	            H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
	            H5l = H5.low  = (H5l + fl);
	            H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
	            H6l = H6.low  = (H6l + gl);
	            H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
	            H7l = H7.low  = (H7l + hl);
	            H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
	        },

	        _doFinalize: function () {
	            // Shortcuts
	            var data = this._data;
	            var dataWords = data.words;

	            var nBitsTotal = this._nDataBytes * 8;
	            var nBitsLeft = data.sigBytes * 8;

	            // Add padding
	            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
	            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
	            data.sigBytes = dataWords.length * 4;

	            // Hash final blocks
	            this._process();

	            // Convert hash to 32-bit word array before returning
	            var hash = this._hash.toX32();

	            // Return final computed hash
	            return hash;
	        },

	        clone: function () {
	            var clone = Hasher.clone.call(this);
	            clone._hash = this._hash.clone();

	            return clone;
	        },

	        blockSize: 1024/32
	    });

	    /**
	     * Shortcut function to the hasher's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     *
	     * @return {WordArray} The hash.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hash = CryptoJS.SHA512('message');
	     *     var hash = CryptoJS.SHA512(wordArray);
	     */
	    C.SHA512 = Hasher._createHelper(SHA512);

	    /**
	     * Shortcut function to the HMAC's object interface.
	     *
	     * @param {WordArray|string} message The message to hash.
	     * @param {WordArray|string} key The secret key.
	     *
	     * @return {WordArray} The HMAC.
	     *
	     * @static
	     *
	     * @example
	     *
	     *     var hmac = CryptoJS.HmacSHA512(message, key);
	     */
	    C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
	}());


	return CryptoJS.SHA512;

}));
},{"./core":9,"./x64-core":40}],39:[function(require,module,exports){
;(function (root, factory, undef) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"), require("./enc-base64"), require("./md5"), require("./evpkdf"), require("./cipher-core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function () {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var WordArray = C_lib.WordArray;
	    var BlockCipher = C_lib.BlockCipher;
	    var C_algo = C.algo;

	    // Permuted Choice 1 constants
	    var PC1 = [
	        57, 49, 41, 33, 25, 17, 9,  1,
	        58, 50, 42, 34, 26, 18, 10, 2,
	        59, 51, 43, 35, 27, 19, 11, 3,
	        60, 52, 44, 36, 63, 55, 47, 39,
	        31, 23, 15, 7,  62, 54, 46, 38,
	        30, 22, 14, 6,  61, 53, 45, 37,
	        29, 21, 13, 5,  28, 20, 12, 4
	    ];

	    // Permuted Choice 2 constants
	    var PC2 = [
	        14, 17, 11, 24, 1,  5,
	        3,  28, 15, 6,  21, 10,
	        23, 19, 12, 4,  26, 8,
	        16, 7,  27, 20, 13, 2,
	        41, 52, 31, 37, 47, 55,
	        30, 40, 51, 45, 33, 48,
	        44, 49, 39, 56, 34, 53,
	        46, 42, 50, 36, 29, 32
	    ];

	    // Cumulative bit shift constants
	    var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

	    // SBOXes and round permutation constants
	    var SBOX_P = [
	        {
	            0x0: 0x808200,
	            0x10000000: 0x8000,
	            0x20000000: 0x808002,
	            0x30000000: 0x2,
	            0x40000000: 0x200,
	            0x50000000: 0x808202,
	            0x60000000: 0x800202,
	            0x70000000: 0x800000,
	            0x80000000: 0x202,
	            0x90000000: 0x800200,
	            0xa0000000: 0x8200,
	            0xb0000000: 0x808000,
	            0xc0000000: 0x8002,
	            0xd0000000: 0x800002,
	            0xe0000000: 0x0,
	            0xf0000000: 0x8202,
	            0x8000000: 0x0,
	            0x18000000: 0x808202,
	            0x28000000: 0x8202,
	            0x38000000: 0x8000,
	            0x48000000: 0x808200,
	            0x58000000: 0x200,
	            0x68000000: 0x808002,
	            0x78000000: 0x2,
	            0x88000000: 0x800200,
	            0x98000000: 0x8200,
	            0xa8000000: 0x808000,
	            0xb8000000: 0x800202,
	            0xc8000000: 0x800002,
	            0xd8000000: 0x8002,
	            0xe8000000: 0x202,
	            0xf8000000: 0x800000,
	            0x1: 0x8000,
	            0x10000001: 0x2,
	            0x20000001: 0x808200,
	            0x30000001: 0x800000,
	            0x40000001: 0x808002,
	            0x50000001: 0x8200,
	            0x60000001: 0x200,
	            0x70000001: 0x800202,
	            0x80000001: 0x808202,
	            0x90000001: 0x808000,
	            0xa0000001: 0x800002,
	            0xb0000001: 0x8202,
	            0xc0000001: 0x202,
	            0xd0000001: 0x800200,
	            0xe0000001: 0x8002,
	            0xf0000001: 0x0,
	            0x8000001: 0x808202,
	            0x18000001: 0x808000,
	            0x28000001: 0x800000,
	            0x38000001: 0x200,
	            0x48000001: 0x8000,
	            0x58000001: 0x800002,
	            0x68000001: 0x2,
	            0x78000001: 0x8202,
	            0x88000001: 0x8002,
	            0x98000001: 0x800202,
	            0xa8000001: 0x202,
	            0xb8000001: 0x808200,
	            0xc8000001: 0x800200,
	            0xd8000001: 0x0,
	            0xe8000001: 0x8200,
	            0xf8000001: 0x808002
	        },
	        {
	            0x0: 0x40084010,
	            0x1000000: 0x4000,
	            0x2000000: 0x80000,
	            0x3000000: 0x40080010,
	            0x4000000: 0x40000010,
	            0x5000000: 0x40084000,
	            0x6000000: 0x40004000,
	            0x7000000: 0x10,
	            0x8000000: 0x84000,
	            0x9000000: 0x40004010,
	            0xa000000: 0x40000000,
	            0xb000000: 0x84010,
	            0xc000000: 0x80010,
	            0xd000000: 0x0,
	            0xe000000: 0x4010,
	            0xf000000: 0x40080000,
	            0x800000: 0x40004000,
	            0x1800000: 0x84010,
	            0x2800000: 0x10,
	            0x3800000: 0x40004010,
	            0x4800000: 0x40084010,
	            0x5800000: 0x40000000,
	            0x6800000: 0x80000,
	            0x7800000: 0x40080010,
	            0x8800000: 0x80010,
	            0x9800000: 0x0,
	            0xa800000: 0x4000,
	            0xb800000: 0x40080000,
	            0xc800000: 0x40000010,
	            0xd800000: 0x84000,
	            0xe800000: 0x40084000,
	            0xf800000: 0x4010,
	            0x10000000: 0x0,
	            0x11000000: 0x40080010,
	            0x12000000: 0x40004010,
	            0x13000000: 0x40084000,
	            0x14000000: 0x40080000,
	            0x15000000: 0x10,
	            0x16000000: 0x84010,
	            0x17000000: 0x4000,
	            0x18000000: 0x4010,
	            0x19000000: 0x80000,
	            0x1a000000: 0x80010,
	            0x1b000000: 0x40000010,
	            0x1c000000: 0x84000,
	            0x1d000000: 0x40004000,
	            0x1e000000: 0x40000000,
	            0x1f000000: 0x40084010,
	            0x10800000: 0x84010,
	            0x11800000: 0x80000,
	            0x12800000: 0x40080000,
	            0x13800000: 0x4000,
	            0x14800000: 0x40004000,
	            0x15800000: 0x40084010,
	            0x16800000: 0x10,
	            0x17800000: 0x40000000,
	            0x18800000: 0x40084000,
	            0x19800000: 0x40000010,
	            0x1a800000: 0x40004010,
	            0x1b800000: 0x80010,
	            0x1c800000: 0x0,
	            0x1d800000: 0x4010,
	            0x1e800000: 0x40080010,
	            0x1f800000: 0x84000
	        },
	        {
	            0x0: 0x104,
	            0x100000: 0x0,
	            0x200000: 0x4000100,
	            0x300000: 0x10104,
	            0x400000: 0x10004,
	            0x500000: 0x4000004,
	            0x600000: 0x4010104,
	            0x700000: 0x4010000,
	            0x800000: 0x4000000,
	            0x900000: 0x4010100,
	            0xa00000: 0x10100,
	            0xb00000: 0x4010004,
	            0xc00000: 0x4000104,
	            0xd00000: 0x10000,
	            0xe00000: 0x4,
	            0xf00000: 0x100,
	            0x80000: 0x4010100,
	            0x180000: 0x4010004,
	            0x280000: 0x0,
	            0x380000: 0x4000100,
	            0x480000: 0x4000004,
	            0x580000: 0x10000,
	            0x680000: 0x10004,
	            0x780000: 0x104,
	            0x880000: 0x4,
	            0x980000: 0x100,
	            0xa80000: 0x4010000,
	            0xb80000: 0x10104,
	            0xc80000: 0x10100,
	            0xd80000: 0x4000104,
	            0xe80000: 0x4010104,
	            0xf80000: 0x4000000,
	            0x1000000: 0x4010100,
	            0x1100000: 0x10004,
	            0x1200000: 0x10000,
	            0x1300000: 0x4000100,
	            0x1400000: 0x100,
	            0x1500000: 0x4010104,
	            0x1600000: 0x4000004,
	            0x1700000: 0x0,
	            0x1800000: 0x4000104,
	            0x1900000: 0x4000000,
	            0x1a00000: 0x4,
	            0x1b00000: 0x10100,
	            0x1c00000: 0x4010000,
	            0x1d00000: 0x104,
	            0x1e00000: 0x10104,
	            0x1f00000: 0x4010004,
	            0x1080000: 0x4000000,
	            0x1180000: 0x104,
	            0x1280000: 0x4010100,
	            0x1380000: 0x0,
	            0x1480000: 0x10004,
	            0x1580000: 0x4000100,
	            0x1680000: 0x100,
	            0x1780000: 0x4010004,
	            0x1880000: 0x10000,
	            0x1980000: 0x4010104,
	            0x1a80000: 0x10104,
	            0x1b80000: 0x4000004,
	            0x1c80000: 0x4000104,
	            0x1d80000: 0x4010000,
	            0x1e80000: 0x4,
	            0x1f80000: 0x10100
	        },
	        {
	            0x0: 0x80401000,
	            0x10000: 0x80001040,
	            0x20000: 0x401040,
	            0x30000: 0x80400000,
	            0x40000: 0x0,
	            0x50000: 0x401000,
	            0x60000: 0x80000040,
	            0x70000: 0x400040,
	            0x80000: 0x80000000,
	            0x90000: 0x400000,
	            0xa0000: 0x40,
	            0xb0000: 0x80001000,
	            0xc0000: 0x80400040,
	            0xd0000: 0x1040,
	            0xe0000: 0x1000,
	            0xf0000: 0x80401040,
	            0x8000: 0x80001040,
	            0x18000: 0x40,
	            0x28000: 0x80400040,
	            0x38000: 0x80001000,
	            0x48000: 0x401000,
	            0x58000: 0x80401040,
	            0x68000: 0x0,
	            0x78000: 0x80400000,
	            0x88000: 0x1000,
	            0x98000: 0x80401000,
	            0xa8000: 0x400000,
	            0xb8000: 0x1040,
	            0xc8000: 0x80000000,
	            0xd8000: 0x400040,
	            0xe8000: 0x401040,
	            0xf8000: 0x80000040,
	            0x100000: 0x400040,
	            0x110000: 0x401000,
	            0x120000: 0x80000040,
	            0x130000: 0x0,
	            0x140000: 0x1040,
	            0x150000: 0x80400040,
	            0x160000: 0x80401000,
	            0x170000: 0x80001040,
	            0x180000: 0x80401040,
	            0x190000: 0x80000000,
	            0x1a0000: 0x80400000,
	            0x1b0000: 0x401040,
	            0x1c0000: 0x80001000,
	            0x1d0000: 0x400000,
	            0x1e0000: 0x40,
	            0x1f0000: 0x1000,
	            0x108000: 0x80400000,
	            0x118000: 0x80401040,
	            0x128000: 0x0,
	            0x138000: 0x401000,
	            0x148000: 0x400040,
	            0x158000: 0x80000000,
	            0x168000: 0x80001040,
	            0x178000: 0x40,
	            0x188000: 0x80000040,
	            0x198000: 0x1000,
	            0x1a8000: 0x80001000,
	            0x1b8000: 0x80400040,
	            0x1c8000: 0x1040,
	            0x1d8000: 0x80401000,
	            0x1e8000: 0x400000,
	            0x1f8000: 0x401040
	        },
	        {
	            0x0: 0x80,
	            0x1000: 0x1040000,
	            0x2000: 0x40000,
	            0x3000: 0x20000000,
	            0x4000: 0x20040080,
	            0x5000: 0x1000080,
	            0x6000: 0x21000080,
	            0x7000: 0x40080,
	            0x8000: 0x1000000,
	            0x9000: 0x20040000,
	            0xa000: 0x20000080,
	            0xb000: 0x21040080,
	            0xc000: 0x21040000,
	            0xd000: 0x0,
	            0xe000: 0x1040080,
	            0xf000: 0x21000000,
	            0x800: 0x1040080,
	            0x1800: 0x21000080,
	            0x2800: 0x80,
	            0x3800: 0x1040000,
	            0x4800: 0x40000,
	            0x5800: 0x20040080,
	            0x6800: 0x21040000,
	            0x7800: 0x20000000,
	            0x8800: 0x20040000,
	            0x9800: 0x0,
	            0xa800: 0x21040080,
	            0xb800: 0x1000080,
	            0xc800: 0x20000080,
	            0xd800: 0x21000000,
	            0xe800: 0x1000000,
	            0xf800: 0x40080,
	            0x10000: 0x40000,
	            0x11000: 0x80,
	            0x12000: 0x20000000,
	            0x13000: 0x21000080,
	            0x14000: 0x1000080,
	            0x15000: 0x21040000,
	            0x16000: 0x20040080,
	            0x17000: 0x1000000,
	            0x18000: 0x21040080,
	            0x19000: 0x21000000,
	            0x1a000: 0x1040000,
	            0x1b000: 0x20040000,
	            0x1c000: 0x40080,
	            0x1d000: 0x20000080,
	            0x1e000: 0x0,
	            0x1f000: 0x1040080,
	            0x10800: 0x21000080,
	            0x11800: 0x1000000,
	            0x12800: 0x1040000,
	            0x13800: 0x20040080,
	            0x14800: 0x20000000,
	            0x15800: 0x1040080,
	            0x16800: 0x80,
	            0x17800: 0x21040000,
	            0x18800: 0x40080,
	            0x19800: 0x21040080,
	            0x1a800: 0x0,
	            0x1b800: 0x21000000,
	            0x1c800: 0x1000080,
	            0x1d800: 0x40000,
	            0x1e800: 0x20040000,
	            0x1f800: 0x20000080
	        },
	        {
	            0x0: 0x10000008,
	            0x100: 0x2000,
	            0x200: 0x10200000,
	            0x300: 0x10202008,
	            0x400: 0x10002000,
	            0x500: 0x200000,
	            0x600: 0x200008,
	            0x700: 0x10000000,
	            0x800: 0x0,
	            0x900: 0x10002008,
	            0xa00: 0x202000,
	            0xb00: 0x8,
	            0xc00: 0x10200008,
	            0xd00: 0x202008,
	            0xe00: 0x2008,
	            0xf00: 0x10202000,
	            0x80: 0x10200000,
	            0x180: 0x10202008,
	            0x280: 0x8,
	            0x380: 0x200000,
	            0x480: 0x202008,
	            0x580: 0x10000008,
	            0x680: 0x10002000,
	            0x780: 0x2008,
	            0x880: 0x200008,
	            0x980: 0x2000,
	            0xa80: 0x10002008,
	            0xb80: 0x10200008,
	            0xc80: 0x0,
	            0xd80: 0x10202000,
	            0xe80: 0x202000,
	            0xf80: 0x10000000,
	            0x1000: 0x10002000,
	            0x1100: 0x10200008,
	            0x1200: 0x10202008,
	            0x1300: 0x2008,
	            0x1400: 0x200000,
	            0x1500: 0x10000000,
	            0x1600: 0x10000008,
	            0x1700: 0x202000,
	            0x1800: 0x202008,
	            0x1900: 0x0,
	            0x1a00: 0x8,
	            0x1b00: 0x10200000,
	            0x1c00: 0x2000,
	            0x1d00: 0x10002008,
	            0x1e00: 0x10202000,
	            0x1f00: 0x200008,
	            0x1080: 0x8,
	            0x1180: 0x202000,
	            0x1280: 0x200000,
	            0x1380: 0x10000008,
	            0x1480: 0x10002000,
	            0x1580: 0x2008,
	            0x1680: 0x10202008,
	            0x1780: 0x10200000,
	            0x1880: 0x10202000,
	            0x1980: 0x10200008,
	            0x1a80: 0x2000,
	            0x1b80: 0x202008,
	            0x1c80: 0x200008,
	            0x1d80: 0x0,
	            0x1e80: 0x10000000,
	            0x1f80: 0x10002008
	        },
	        {
	            0x0: 0x100000,
	            0x10: 0x2000401,
	            0x20: 0x400,
	            0x30: 0x100401,
	            0x40: 0x2100401,
	            0x50: 0x0,
	            0x60: 0x1,
	            0x70: 0x2100001,
	            0x80: 0x2000400,
	            0x90: 0x100001,
	            0xa0: 0x2000001,
	            0xb0: 0x2100400,
	            0xc0: 0x2100000,
	            0xd0: 0x401,
	            0xe0: 0x100400,
	            0xf0: 0x2000000,
	            0x8: 0x2100001,
	            0x18: 0x0,
	            0x28: 0x2000401,
	            0x38: 0x2100400,
	            0x48: 0x100000,
	            0x58: 0x2000001,
	            0x68: 0x2000000,
	            0x78: 0x401,
	            0x88: 0x100401,
	            0x98: 0x2000400,
	            0xa8: 0x2100000,
	            0xb8: 0x100001,
	            0xc8: 0x400,
	            0xd8: 0x2100401,
	            0xe8: 0x1,
	            0xf8: 0x100400,
	            0x100: 0x2000000,
	            0x110: 0x100000,
	            0x120: 0x2000401,
	            0x130: 0x2100001,
	            0x140: 0x100001,
	            0x150: 0x2000400,
	            0x160: 0x2100400,
	            0x170: 0x100401,
	            0x180: 0x401,
	            0x190: 0x2100401,
	            0x1a0: 0x100400,
	            0x1b0: 0x1,
	            0x1c0: 0x0,
	            0x1d0: 0x2100000,
	            0x1e0: 0x2000001,
	            0x1f0: 0x400,
	            0x108: 0x100400,
	            0x118: 0x2000401,
	            0x128: 0x2100001,
	            0x138: 0x1,
	            0x148: 0x2000000,
	            0x158: 0x100000,
	            0x168: 0x401,
	            0x178: 0x2100400,
	            0x188: 0x2000001,
	            0x198: 0x2100000,
	            0x1a8: 0x0,
	            0x1b8: 0x2100401,
	            0x1c8: 0x100401,
	            0x1d8: 0x400,
	            0x1e8: 0x2000400,
	            0x1f8: 0x100001
	        },
	        {
	            0x0: 0x8000820,
	            0x1: 0x20000,
	            0x2: 0x8000000,
	            0x3: 0x20,
	            0x4: 0x20020,
	            0x5: 0x8020820,
	            0x6: 0x8020800,
	            0x7: 0x800,
	            0x8: 0x8020000,
	            0x9: 0x8000800,
	            0xa: 0x20800,
	            0xb: 0x8020020,
	            0xc: 0x820,
	            0xd: 0x0,
	            0xe: 0x8000020,
	            0xf: 0x20820,
	            0x80000000: 0x800,
	            0x80000001: 0x8020820,
	            0x80000002: 0x8000820,
	            0x80000003: 0x8000000,
	            0x80000004: 0x8020000,
	            0x80000005: 0x20800,
	            0x80000006: 0x20820,
	            0x80000007: 0x20,
	            0x80000008: 0x8000020,
	            0x80000009: 0x820,
	            0x8000000a: 0x20020,
	            0x8000000b: 0x8020800,
	            0x8000000c: 0x0,
	            0x8000000d: 0x8020020,
	            0x8000000e: 0x8000800,
	            0x8000000f: 0x20000,
	            0x10: 0x20820,
	            0x11: 0x8020800,
	            0x12: 0x20,
	            0x13: 0x800,
	            0x14: 0x8000800,
	            0x15: 0x8000020,
	            0x16: 0x8020020,
	            0x17: 0x20000,
	            0x18: 0x0,
	            0x19: 0x20020,
	            0x1a: 0x8020000,
	            0x1b: 0x8000820,
	            0x1c: 0x8020820,
	            0x1d: 0x20800,
	            0x1e: 0x820,
	            0x1f: 0x8000000,
	            0x80000010: 0x20000,
	            0x80000011: 0x800,
	            0x80000012: 0x8020020,
	            0x80000013: 0x20820,
	            0x80000014: 0x20,
	            0x80000015: 0x8020000,
	            0x80000016: 0x8000000,
	            0x80000017: 0x8000820,
	            0x80000018: 0x8020820,
	            0x80000019: 0x8000020,
	            0x8000001a: 0x8000800,
	            0x8000001b: 0x0,
	            0x8000001c: 0x20800,
	            0x8000001d: 0x820,
	            0x8000001e: 0x20020,
	            0x8000001f: 0x8020800
	        }
	    ];

	    // Masks that select the SBOX input
	    var SBOX_MASK = [
	        0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
	        0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
	    ];

	    /**
	     * DES block cipher algorithm.
	     */
	    var DES = C_algo.DES = BlockCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;

	            // Select 56 bits according to PC1
	            var keyBits = [];
	            for (var i = 0; i < 56; i++) {
	                var keyBitPos = PC1[i] - 1;
	                keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
	            }

	            // Assemble 16 subkeys
	            var subKeys = this._subKeys = [];
	            for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
	                // Create subkey
	                var subKey = subKeys[nSubKey] = [];

	                // Shortcut
	                var bitShift = BIT_SHIFTS[nSubKey];

	                // Select 48 bits according to PC2
	                for (var i = 0; i < 24; i++) {
	                    // Select from the left 28 key bits
	                    subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

	                    // Select from the right 28 key bits
	                    subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
	                }

	                // Since each subkey is applied to an expanded 32-bit input,
	                // the subkey can be broken into 8 values scaled to 32-bits,
	                // which allows the key to be used without expansion
	                subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
	                for (var i = 1; i < 7; i++) {
	                    subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
	                }
	                subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
	            }

	            // Compute inverse subkeys
	            var invSubKeys = this._invSubKeys = [];
	            for (var i = 0; i < 16; i++) {
	                invSubKeys[i] = subKeys[15 - i];
	            }
	        },

	        encryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._subKeys);
	        },

	        decryptBlock: function (M, offset) {
	            this._doCryptBlock(M, offset, this._invSubKeys);
	        },

	        _doCryptBlock: function (M, offset, subKeys) {
	            // Get input
	            this._lBlock = M[offset];
	            this._rBlock = M[offset + 1];

	            // Initial permutation
	            exchangeLR.call(this, 4,  0x0f0f0f0f);
	            exchangeLR.call(this, 16, 0x0000ffff);
	            exchangeRL.call(this, 2,  0x33333333);
	            exchangeRL.call(this, 8,  0x00ff00ff);
	            exchangeLR.call(this, 1,  0x55555555);

	            // Rounds
	            for (var round = 0; round < 16; round++) {
	                // Shortcuts
	                var subKey = subKeys[round];
	                var lBlock = this._lBlock;
	                var rBlock = this._rBlock;

	                // Feistel function
	                var f = 0;
	                for (var i = 0; i < 8; i++) {
	                    f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
	                }
	                this._lBlock = rBlock;
	                this._rBlock = lBlock ^ f;
	            }

	            // Undo swap from last round
	            var t = this._lBlock;
	            this._lBlock = this._rBlock;
	            this._rBlock = t;

	            // Final permutation
	            exchangeLR.call(this, 1,  0x55555555);
	            exchangeRL.call(this, 8,  0x00ff00ff);
	            exchangeRL.call(this, 2,  0x33333333);
	            exchangeLR.call(this, 16, 0x0000ffff);
	            exchangeLR.call(this, 4,  0x0f0f0f0f);

	            // Set output
	            M[offset] = this._lBlock;
	            M[offset + 1] = this._rBlock;
	        },

	        keySize: 64/32,

	        ivSize: 64/32,

	        blockSize: 64/32
	    });

	    // Swap bits across the left and right words
	    function exchangeLR(offset, mask) {
	        var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
	        this._rBlock ^= t;
	        this._lBlock ^= t << offset;
	    }

	    function exchangeRL(offset, mask) {
	        var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
	        this._lBlock ^= t;
	        this._rBlock ^= t << offset;
	    }

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
	     */
	    C.DES = BlockCipher._createHelper(DES);

	    /**
	     * Triple-DES block cipher algorithm.
	     */
	    var TripleDES = C_algo.TripleDES = BlockCipher.extend({
	        _doReset: function () {
	            // Shortcuts
	            var key = this._key;
	            var keyWords = key.words;

	            // Create DES instances
	            this._des1 = DES.createEncryptor(WordArray.create(keyWords.slice(0, 2)));
	            this._des2 = DES.createEncryptor(WordArray.create(keyWords.slice(2, 4)));
	            this._des3 = DES.createEncryptor(WordArray.create(keyWords.slice(4, 6)));
	        },

	        encryptBlock: function (M, offset) {
	            this._des1.encryptBlock(M, offset);
	            this._des2.decryptBlock(M, offset);
	            this._des3.encryptBlock(M, offset);
	        },

	        decryptBlock: function (M, offset) {
	            this._des3.decryptBlock(M, offset);
	            this._des2.encryptBlock(M, offset);
	            this._des1.decryptBlock(M, offset);
	        },

	        keySize: 192/32,

	        ivSize: 64/32,

	        blockSize: 64/32
	    });

	    /**
	     * Shortcut functions to the cipher's object interface.
	     *
	     * @example
	     *
	     *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
	     *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
	     */
	    C.TripleDES = BlockCipher._createHelper(TripleDES);
	}());


	return CryptoJS.TripleDES;

}));
},{"./cipher-core":8,"./core":9,"./enc-base64":10,"./evpkdf":12,"./md5":17}],40:[function(require,module,exports){
;(function (root, factory) {
	if (typeof exports === "object") {
		// CommonJS
		module.exports = exports = factory(require("./core"));
	}
	else if (typeof define === "function" && define.amd) {
		// AMD
		define(["./core"], factory);
	}
	else {
		// Global (browser)
		factory(root.CryptoJS);
	}
}(this, function (CryptoJS) {

	(function (undefined) {
	    // Shortcuts
	    var C = CryptoJS;
	    var C_lib = C.lib;
	    var Base = C_lib.Base;
	    var X32WordArray = C_lib.WordArray;

	    /**
	     * x64 namespace.
	     */
	    var C_x64 = C.x64 = {};

	    /**
	     * A 64-bit word.
	     */
	    var X64Word = C_x64.Word = Base.extend({
	        /**
	         * Initializes a newly created 64-bit word.
	         *
	         * @param {number} high The high 32 bits.
	         * @param {number} low The low 32 bits.
	         *
	         * @example
	         *
	         *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
	         */
	        init: function (high, low) {
	            this.high = high;
	            this.low = low;
	        }

	        /**
	         * Bitwise NOTs this word.
	         *
	         * @return {X64Word} A new x64-Word object after negating.
	         *
	         * @example
	         *
	         *     var negated = x64Word.not();
	         */
	        // not: function () {
	            // var high = ~this.high;
	            // var low = ~this.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise ANDs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to AND with this word.
	         *
	         * @return {X64Word} A new x64-Word object after ANDing.
	         *
	         * @example
	         *
	         *     var anded = x64Word.and(anotherX64Word);
	         */
	        // and: function (word) {
	            // var high = this.high & word.high;
	            // var low = this.low & word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise ORs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to OR with this word.
	         *
	         * @return {X64Word} A new x64-Word object after ORing.
	         *
	         * @example
	         *
	         *     var ored = x64Word.or(anotherX64Word);
	         */
	        // or: function (word) {
	            // var high = this.high | word.high;
	            // var low = this.low | word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Bitwise XORs this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to XOR with this word.
	         *
	         * @return {X64Word} A new x64-Word object after XORing.
	         *
	         * @example
	         *
	         *     var xored = x64Word.xor(anotherX64Word);
	         */
	        // xor: function (word) {
	            // var high = this.high ^ word.high;
	            // var low = this.low ^ word.low;

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Shifts this word n bits to the left.
	         *
	         * @param {number} n The number of bits to shift.
	         *
	         * @return {X64Word} A new x64-Word object after shifting.
	         *
	         * @example
	         *
	         *     var shifted = x64Word.shiftL(25);
	         */
	        // shiftL: function (n) {
	            // if (n < 32) {
	                // var high = (this.high << n) | (this.low >>> (32 - n));
	                // var low = this.low << n;
	            // } else {
	                // var high = this.low << (n - 32);
	                // var low = 0;
	            // }

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Shifts this word n bits to the right.
	         *
	         * @param {number} n The number of bits to shift.
	         *
	         * @return {X64Word} A new x64-Word object after shifting.
	         *
	         * @example
	         *
	         *     var shifted = x64Word.shiftR(7);
	         */
	        // shiftR: function (n) {
	            // if (n < 32) {
	                // var low = (this.low >>> n) | (this.high << (32 - n));
	                // var high = this.high >>> n;
	            // } else {
	                // var low = this.high >>> (n - 32);
	                // var high = 0;
	            // }

	            // return X64Word.create(high, low);
	        // },

	        /**
	         * Rotates this word n bits to the left.
	         *
	         * @param {number} n The number of bits to rotate.
	         *
	         * @return {X64Word} A new x64-Word object after rotating.
	         *
	         * @example
	         *
	         *     var rotated = x64Word.rotL(25);
	         */
	        // rotL: function (n) {
	            // return this.shiftL(n).or(this.shiftR(64 - n));
	        // },

	        /**
	         * Rotates this word n bits to the right.
	         *
	         * @param {number} n The number of bits to rotate.
	         *
	         * @return {X64Word} A new x64-Word object after rotating.
	         *
	         * @example
	         *
	         *     var rotated = x64Word.rotR(7);
	         */
	        // rotR: function (n) {
	            // return this.shiftR(n).or(this.shiftL(64 - n));
	        // },

	        /**
	         * Adds this word with the passed word.
	         *
	         * @param {X64Word} word The x64-Word to add with this word.
	         *
	         * @return {X64Word} A new x64-Word object after adding.
	         *
	         * @example
	         *
	         *     var added = x64Word.add(anotherX64Word);
	         */
	        // add: function (word) {
	            // var low = (this.low + word.low) | 0;
	            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
	            // var high = (this.high + word.high + carry) | 0;

	            // return X64Word.create(high, low);
	        // }
	    });

	    /**
	     * An array of 64-bit words.
	     *
	     * @property {Array} words The array of CryptoJS.x64.Word objects.
	     * @property {number} sigBytes The number of significant bytes in this word array.
	     */
	    var X64WordArray = C_x64.WordArray = Base.extend({
	        /**
	         * Initializes a newly created word array.
	         *
	         * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
	         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
	         *
	         * @example
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create();
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create([
	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
	         *     ]);
	         *
	         *     var wordArray = CryptoJS.x64.WordArray.create([
	         *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
	         *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
	         *     ], 10);
	         */
	        init: function (words, sigBytes) {
	            words = this.words = words || [];

	            if (sigBytes != undefined) {
	                this.sigBytes = sigBytes;
	            } else {
	                this.sigBytes = words.length * 8;
	            }
	        },

	        /**
	         * Converts this 64-bit word array to a 32-bit word array.
	         *
	         * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
	         *
	         * @example
	         *
	         *     var x32WordArray = x64WordArray.toX32();
	         */
	        toX32: function () {
	            // Shortcuts
	            var x64Words = this.words;
	            var x64WordsLength = x64Words.length;

	            // Convert
	            var x32Words = [];
	            for (var i = 0; i < x64WordsLength; i++) {
	                var x64Word = x64Words[i];
	                x32Words.push(x64Word.high);
	                x32Words.push(x64Word.low);
	            }

	            return X32WordArray.create(x32Words, this.sigBytes);
	        },

	        /**
	         * Creates a copy of this word array.
	         *
	         * @return {X64WordArray} The clone.
	         *
	         * @example
	         *
	         *     var clone = x64WordArray.clone();
	         */
	        clone: function () {
	            var clone = Base.clone.call(this);

	            // Clone "words" array
	            var words = clone.words = this.words.slice(0);

	            // Clone each X64Word object
	            var wordsLength = words.length;
	            for (var i = 0; i < wordsLength; i++) {
	                words[i] = words[i].clone();
	            }

	            return clone;
	        }
	    });
	}());


	return CryptoJS;

}));
},{"./core":9}],41:[function(require,module,exports){
(function (global,setImmediate){
/*
 * Dexie.js - a minimalistic wrapper for IndexedDB
 * ===============================================
 *
 * By David Fahlander, david.fahlander@gmail.com
 *
 * Version 2.0.4, Fri May 25 2018
 *
 * http://dexie.org
 *
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
 */
 
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Dexie = factory());
}(this, (function () { 'use strict';

var keys = Object.keys;
var isArray = Array.isArray;
var _global = typeof self !== 'undefined' ? self :
    typeof window !== 'undefined' ? window :
        global;
function extend(obj, extension) {
    if (typeof extension !== 'object')
        return obj;
    keys(extension).forEach(function (key) {
        obj[key] = extension[key];
    });
    return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
    return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
    if (typeof extension === 'function')
        extension = extension(getProto(proto));
    keys(extension).forEach(function (key) {
        setProp(proto, key, extension[key]);
    });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
    defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === 'function' ?
        { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } :
        { value: functionOrGetSet, configurable: true, writable: true }, options));
}
function derive(Child) {
    return {
        from: function (Parent) {
            Child.prototype = Object.create(Parent.prototype);
            setProp(Child.prototype, "constructor", Child);
            return {
                extend: props.bind(null, Child.prototype)
            };
        }
    };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
    var pd = getOwnPropertyDescriptor(obj, prop), proto;
    return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
    return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
    return overridedFactory(origFunc);
}
function assert(b) {
    if (!b)
        throw new Error("Assertion Failed");
}
function asap(fn) {
    if (_global.setImmediate)
        setImmediate(fn);
    else
        setTimeout(fn, 0);
}

/** Generate an object (hash map) based on given array.
 * @param extractor Function taking an array item and its index and returning an array of 2 items ([key, value]) to
 *        instert on the resulting object for each item in the array. If this function returns a falsy value, the
 *        current item wont affect the resulting object.
 */
function arrayToObject(array, extractor) {
    return array.reduce(function (result, item, i) {
        var nameAndValue = extractor(item, i);
        if (nameAndValue)
            result[nameAndValue[0]] = nameAndValue[1];
        return result;
    }, {});
}
function trycatcher(fn, reject) {
    return function () {
        try {
            fn.apply(this, arguments);
        }
        catch (e) {
            reject(e);
        }
    };
}
function tryCatch(fn, onerror, args) {
    try {
        fn.apply(null, args);
    }
    catch (ex) {
        onerror && onerror(ex);
    }
}
function getByKeyPath(obj, keyPath) {
    // http://www.w3.org/TR/IndexedDB/#steps-for-extracting-a-key-from-a-value-using-a-key-path
    if (hasOwn(obj, keyPath))
        return obj[keyPath]; // This line is moved from last to first for optimization purpose.
    if (!keyPath)
        return obj;
    if (typeof keyPath !== 'string') {
        var rv = [];
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            var val = getByKeyPath(obj, keyPath[i]);
            rv.push(val);
        }
        return rv;
    }
    var period = keyPath.indexOf('.');
    if (period !== -1) {
        var innerObj = obj[keyPath.substr(0, period)];
        return innerObj === undefined ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
    }
    return undefined;
}
function setByKeyPath(obj, keyPath, value) {
    if (!obj || keyPath === undefined)
        return;
    if ('isFrozen' in Object && Object.isFrozen(obj))
        return;
    if (typeof keyPath !== 'string' && 'length' in keyPath) {
        assert(typeof value !== 'string' && 'length' in value);
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            setByKeyPath(obj, keyPath[i], value[i]);
        }
    }
    else {
        var period = keyPath.indexOf('.');
        if (period !== -1) {
            var currentKeyPath = keyPath.substr(0, period);
            var remainingKeyPath = keyPath.substr(period + 1);
            if (remainingKeyPath === "")
                if (value === undefined)
                    delete obj[currentKeyPath];
                else
                    obj[currentKeyPath] = value;
            else {
                var innerObj = obj[currentKeyPath];
                if (!innerObj)
                    innerObj = (obj[currentKeyPath] = {});
                setByKeyPath(innerObj, remainingKeyPath, value);
            }
        }
        else {
            if (value === undefined)
                delete obj[keyPath];
            else
                obj[keyPath] = value;
        }
    }
}
function delByKeyPath(obj, keyPath) {
    if (typeof keyPath === 'string')
        setByKeyPath(obj, keyPath, undefined);
    else if ('length' in keyPath)
        [].map.call(keyPath, function (kp) {
            setByKeyPath(obj, kp, undefined);
        });
}
function shallowClone(obj) {
    var rv = {};
    for (var m in obj) {
        if (hasOwn(obj, m))
            rv[m] = obj[m];
    }
    return rv;
}
var concat = [].concat;
function flatten(a) {
    return concat.apply([], a);
}
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
var intrinsicTypes = "Boolean,String,Date,RegExp,Blob,File,FileList,ArrayBuffer,DataView,Uint8ClampedArray,ImageData,Map,Set"
    .split(',').concat(flatten([8, 16, 32, 64].map(function (num) { return ["Int", "Uint", "Float"].map(function (t) { return t + num + "Array"; }); }))).filter(function (t) { return _global[t]; }).map(function (t) { return _global[t]; });
function deepClone(any) {
    if (!any || typeof any !== 'object')
        return any;
    var rv;
    if (isArray(any)) {
        rv = [];
        for (var i = 0, l = any.length; i < l; ++i) {
            rv.push(deepClone(any[i]));
        }
    }
    else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
        rv = any;
    }
    else {
        rv = any.constructor ? Object.create(any.constructor.prototype) : {};
        for (var prop in any) {
            if (hasOwn(any, prop)) {
                rv[prop] = deepClone(any[prop]);
            }
        }
    }
    return rv;
}
function getObjectDiff(a, b, rv, prfx) {
    // Compares objects a and b and produces a diff object.
    rv = rv || {};
    prfx = prfx || '';
    keys(a).forEach(function (prop) {
        if (!hasOwn(b, prop))
            rv[prfx + prop] = undefined; // Property removed
        else {
            var ap = a[prop], bp = b[prop];
            if (typeof ap === 'object' && typeof bp === 'object' &&
                ap && bp &&
                // Now compare constructors are same (not equal because wont work in Safari)
                ('' + ap.constructor) === ('' + bp.constructor))
                // Same type of object but its properties may have changed
                getObjectDiff(ap, bp, rv, prfx + prop + ".");
            else if (ap !== bp)
                rv[prfx + prop] = b[prop]; // Primitive value changed
        }
    });
    keys(b).forEach(function (prop) {
        if (!hasOwn(a, prop)) {
            rv[prfx + prop] = b[prop]; // Property added
        }
    });
    return rv;
}
// If first argument is iterable or array-like, return it as an array
var iteratorSymbol = typeof Symbol !== 'undefined' && Symbol.iterator;
var getIteratorOf = iteratorSymbol ? function (x) {
    var i;
    return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function () { return null; };
var NO_CHAR_ARRAY = {};
// Takes one or several arguments and returns an array based on the following criteras:
// * If several arguments provided, return arguments converted to an array in a way that
//   still allows javascript engine to optimize the code.
// * If single argument is an array, return a clone of it.
// * If this-pointer equals NO_CHAR_ARRAY, don't accept strings as valid iterables as a special
//   case to the two bullets below.
// * If single argument is an iterable, convert it to an array and return the resulting array.
// * If single argument is array-like (has length of type number), convert it to an array.
function getArrayOf(arrayLike) {
    var i, a, x, it;
    if (arguments.length === 1) {
        if (isArray(arrayLike))
            return arrayLike.slice();
        if (this === NO_CHAR_ARRAY && typeof arrayLike === 'string')
            return [arrayLike];
        if ((it = getIteratorOf(arrayLike))) {
            a = [];
            while ((x = it.next()), !x.done)
                a.push(x.value);
            return a;
        }
        if (arrayLike == null)
            return [arrayLike];
        i = arrayLike.length;
        if (typeof i === 'number') {
            a = new Array(i);
            while (i--)
                a[i] = arrayLike[i];
            return a;
        }
        return [arrayLike];
    }
    i = arguments.length;
    a = new Array(i);
    while (i--)
        a[i] = arguments[i];
    return a;
}

// By default, debug will be true only if platform is a web platform and its page is served from localhost.
// When debug = true, error's stacks will contain asyncronic long stacks.
var debug = typeof location !== 'undefined' &&
    // By default, use debug mode if served from localhost.
    /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
    debug = value;
    libraryFilter = filter;
}
var libraryFilter = function () { return true; };
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
    "use strict";
    if (NEEDS_THROW_FOR_STACK)
        try {
            // Doing something naughty in strict mode here to trigger a specific error
            // that can be explicitely ignored in debugger's exception settings.
            // If we'd just throw new Error() here, IE's debugger's exception settings
            // will just consider it as "exception thrown by javascript code" which is
            // something you wouldn't want it to ignore.
            getErrorWithStack.arguments;
            throw new Error(); // Fallback if above line don't throw.
        }
        catch (e) {
            return e;
        }
    return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
    var stack = exception.stack;
    if (!stack)
        return "";
    numIgnoredFrames = (numIgnoredFrames || 0);
    if (stack.indexOf(exception.name) === 0)
        numIgnoredFrames += (exception.name + exception.message).split('\n').length;
    return stack.split('\n')
        .slice(numIgnoredFrames)
        .filter(libraryFilter)
        .map(function (frame) { return "\n" + frame; })
        .join('');
}
function deprecated(what, fn) {
    return function () {
        console.warn(what + " is deprecated. See https://github.com/dfahlander/Dexie.js/wiki/Deprecations. " + prettyStack(getErrorWithStack(), 1));
        return fn.apply(this, arguments);
    };
}

var dexieErrorNames = [
    'Modify',
    'Bulk',
    'OpenFailed',
    'VersionChange',
    'Schema',
    'Upgrade',
    'InvalidTable',
    'MissingAPI',
    'NoSuchDatabase',
    'InvalidArgument',
    'SubTransaction',
    'Unsupported',
    'Internal',
    'DatabaseClosed',
    'PrematureCommit',
    'ForeignAwait'
];
var idbDomErrorNames = [
    'Unknown',
    'Constraint',
    'Data',
    'TransactionInactive',
    'ReadOnly',
    'Version',
    'NotFound',
    'InvalidState',
    'InvalidAccess',
    'Abort',
    'Timeout',
    'QuotaExceeded',
    'Syntax',
    'DataClone'
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
    VersionChanged: "Database version changed by other database connection",
    DatabaseClosed: "Database has been closed",
    Abort: "Transaction aborted",
    TransactionInactive: "Transaction has already completed or failed"
};
//
// DexieError - base class of all out exceptions.
//
function DexieError(name, msg) {
    // Reason we don't use ES6 classes is because:
    // 1. It bloats transpiled code and increases size of minified code.
    // 2. It doesn't give us much in this case.
    // 3. It would require sub classes to call super(), which
    //    is not needed when deriving from Error.
    this._e = getErrorWithStack();
    this.name = name;
    this.message = msg;
}
derive(DexieError).from(Error).extend({
    stack: {
        get: function () {
            return this._stack ||
                (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
        }
    },
    toString: function () { return this.name + ": " + this.message; }
});
function getMultiErrorMessage(msg, failures) {
    return msg + ". Errors: " + failures
        .map(function (f) { return f.toString(); })
        .filter(function (v, i, s) { return s.indexOf(v) === i; }) // Only unique error strings
        .join('\n');
}
//
// ModifyError - thrown in Collection.modify()
// Specific constructor because it contains members failures and failedKeys.
//
function ModifyError(msg, failures, successCount, failedKeys) {
    this._e = getErrorWithStack();
    this.failures = failures;
    this.failedKeys = failedKeys;
    this.successCount = successCount;
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
    this._e = getErrorWithStack();
    this.name = "BulkError";
    this.failures = failures;
    this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
//
//
// Dynamically generate error names and exception classes based
// on the names in errorList.
//
//
// Map of {ErrorName -> ErrorName + "Error"}
var errnames = errorList.reduce(function (obj, name) { return (obj[name] = name + "Error", obj); }, {});
// Need an alias for DexieError because we're gonna create subclasses with the same name.
var BaseException = DexieError;
// Map of {ErrorName -> exception constructor}
var exceptions = errorList.reduce(function (obj, name) {
    // Let the name be "DexieError" because this name may
    // be shown in call stack and when debugging. DexieError is
    // the most true name because it derives from DexieError,
    // and we cannot change Function.name programatically without
    // dynamically create a Function object, which would be considered
    // 'eval-evil'.
    var fullName = name + "Error";
    function DexieError(msgOrInner, inner) {
        this._e = getErrorWithStack();
        this.name = fullName;
        if (!msgOrInner) {
            this.message = defaultTexts[name] || fullName;
            this.inner = null;
        }
        else if (typeof msgOrInner === 'string') {
            this.message = msgOrInner;
            this.inner = inner || null;
        }
        else if (typeof msgOrInner === 'object') {
            this.message = msgOrInner.name + " " + msgOrInner.message;
            this.inner = msgOrInner;
        }
    }
    derive(DexieError).from(BaseException);
    obj[name] = DexieError;
    return obj;
}, {});
// Use ECMASCRIPT standard exceptions where applicable:
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce(function (obj, name) {
    obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
function mapError(domError, message) {
    if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
        return domError;
    var rv = new exceptionMap[domError.name](message || domError.message, domError);
    if ("stack" in domError) {
        // Derive stack from inner exception if it has a stack
        setProp(rv, "stack", { get: function () {
                return this.inner.stack;
            } });
    }
    return rv;
}
var fullNameExceptions = errorList.reduce(function (obj, name) {
    if (["Syntax", "Type", "Range"].indexOf(name) === -1)
        obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;

function nop() { }
function mirror(val) { return val; }
function pureFunctionChain(f1, f2) {
    // Enables chained events that takes ONE argument and returns it to the next function in chain.
    // This pattern is used in the hook("reading") event.
    if (f1 == null || f1 === mirror)
        return f2;
    return function (val) {
        return f2(f1(val));
    };
}
function callBoth(on1, on2) {
    return function () {
        on1.apply(this, arguments);
        on2.apply(this, arguments);
    };
}
function hookCreatingChain(f1, f2) {
    // Enables chained events that takes several arguments and may modify first argument by making a modification and then returning the same instance.
    // This pattern is used in the hook("creating") event.
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res !== undefined)
            arguments[0] = res;
        var onsuccess = this.onsuccess, // In case event listener has set this.onsuccess
        onerror = this.onerror; // In case event listener has set this.onerror
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res2 !== undefined ? res2 : res;
    };
}
function hookDeletingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        f1.apply(this, arguments);
        var onsuccess = this.onsuccess, // In case event listener has set this.onsuccess
        onerror = this.onerror; // In case event listener has set this.onerror
        this.onsuccess = this.onerror = null;
        f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    };
}
function hookUpdatingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function (modifications) {
        var res = f1.apply(this, arguments);
        extend(modifications, res); // If f1 returns new modifications, extend caller's modifications with the result before calling next in chain.
        var onsuccess = this.onsuccess, // In case event listener has set this.onsuccess
        onerror = this.onerror; // In case event listener has set this.onerror
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res === undefined ?
            (res2 === undefined ? undefined : res2) :
            (extend(res, res2));
    };
}
function reverseStoppableEventChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        if (f2.apply(this, arguments) === false)
            return false;
        return f1.apply(this, arguments);
    };
}

function promisableChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res && typeof res.then === 'function') {
            var thiz = this, i = arguments.length, args = new Array(i);
            while (i--)
                args[i] = arguments[i];
            return res.then(function () {
                return f2.apply(thiz, args);
            });
        }
        return f2.apply(this, arguments);
    };
}

/*
 * Copyright (c) 2014-2017 David Fahlander
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/LICENSE-2.0
 */
//
// Promise and Zone (PSD) for Dexie library
//
// I started out writing this Promise class by copying promise-light (https://github.com/taylorhakes/promise-light) by
// https://github.com/taylorhakes - an A+ and ECMASCRIPT 6 compliant Promise implementation.
//
// In previous versions this was fixed by not calling setTimeout when knowing that the resolve() or reject() came from another
// tick. In Dexie v1.4.0, I've rewritten the Promise class entirely. Just some fragments of promise-light is left. I use
// another strategy now that simplifies everything a lot: to always execute callbacks in a new micro-task, but have an own micro-task
// engine that is indexedDB compliant across all browsers.
// Promise class has also been optimized a lot with inspiration from bluebird - to avoid closures as much as possible.
// Also with inspiration from bluebird, asyncronic stacks in debug mode.
//
// Specific non-standard features of this Promise class:
// * Custom zone support (a.k.a. PSD) with ability to keep zones also when using native promises as well as
//   native async / await.
// * Promise.follow() method built upon the custom zone engine, that allows user to track all promises created from current stack frame
//   and below + all promises that those promises creates or awaits.
// * Detect any unhandled promise in a PSD-scope (PSD.onunhandled). 
//
// David Fahlander, https://github.com/dfahlander
//
// Just a pointer that only this module knows about.
// Used in Promise constructor to emulate a private constructor.
var INTERNAL = {};
// Async stacks (long stacks) must not grow infinitely.
var LONG_STACKS_CLIP_LIMIT = 100;
var MAX_LONG_STACKS = 20;
var ZONE_ECHO_LIMIT = 7;
var nativePromiseInstanceAndProto = (function () {
    try {
        // Be able to patch native async functions
        return new Function("let F=async ()=>{},p=F();return [p,Object.getPrototypeOf(p),Promise.resolve(),F.constructor];")();
    }
    catch (e) {
        var P = _global.Promise;
        return P ?
            [P.resolve(), P.prototype, P.resolve()] :
            [];
    }
})();
var resolvedNativePromise = nativePromiseInstanceAndProto[0];
var nativePromiseProto = nativePromiseInstanceAndProto[1];
var resolvedGlobalPromise = nativePromiseInstanceAndProto[2];
var nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var AsyncFunction = nativePromiseInstanceAndProto[3];
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
/* The default function used only for the very first promise in a promise chain.
   As soon as then promise is resolved or rejected, all next tasks will be executed in micro ticks
   emulated in this module. For indexedDB compatibility, this means that every method needs to
   execute at least one promise before doing an indexedDB operation. Dexie will always call
   db.ready().then() for every operation to make sure the indexedDB event is started in an
   indexedDB-compatible emulated micro task loop.
*/
var schedulePhysicalTick = resolvedGlobalPromise ?
    function () { resolvedGlobalPromise.then(physicalTick); }
    :
        _global.setImmediate ?
            // setImmediate supported. Those modern platforms also supports Function.bind().
            setImmediate.bind(null, physicalTick) :
            _global.MutationObserver ?
                // MutationObserver supported
                function () {
                    var hiddenDiv = document.createElement("div");
                    (new MutationObserver(function () {
                        physicalTick();
                        hiddenDiv = null;
                    })).observe(hiddenDiv, { attributes: true });
                    hiddenDiv.setAttribute('i', '1');
                } :
                // No support for setImmediate or MutationObserver. No worry, setTimeout is only called
                // once time. Every tick that follows will be our emulated micro tick.
                // Could have uses setTimeout.bind(null, 0, physicalTick) if it wasnt for that FF13 and below has a bug 
                function () { setTimeout(physicalTick, 0); };
// Configurable through Promise.scheduler.
// Don't export because it would be unsafe to let unknown
// code call it unless they do try..catch within their callback.
// This function can be retrieved through getter of Promise.scheduler though,
// but users must not do Promise.scheduler = myFuncThatThrowsException
var asap$1 = function (callback, args) {
    microtickQueue.push([callback, args]);
    if (needsNewPhysicalTick) {
        schedulePhysicalTick();
        needsNewPhysicalTick = false;
    }
};
var isOutsideMicroTick = true;
var needsNewPhysicalTick = true;
var unhandledErrors = [];
var rejectingErrors = [];
var currentFulfiller = null;
var rejectionMapper = mirror; // Remove in next major when removing error mapping of DOMErrors and DOMExceptions
var globalPSD = {
    id: 'global',
    global: true,
    ref: 0,
    unhandleds: [],
    onunhandled: globalError,
    pgp: false,
    env: {},
    finalize: function () {
        this.unhandleds.forEach(function (uh) {
            try {
                globalError(uh[0], uh[1]);
            }
            catch (e) { }
        });
    }
};
var PSD = globalPSD;
var microtickQueue = []; // Callbacks to call in this or next physical tick.
var numScheduledCalls = 0; // Number of listener-calls left to do in this physical tick.
var tickFinalizers = []; // Finalizers to call when there are no more async calls scheduled within current physical tick.
function Promise(fn) {
    if (typeof this !== 'object')
        throw new TypeError('Promises must be constructed via new');
    this._listeners = [];
    this.onuncatched = nop; // Deprecate in next major. Not needed. Better to use global error handler.
    // A library may set `promise._lib = true;` after promise is created to make resolve() or reject()
    // execute the microtask engine implicitely within the call to resolve() or reject().
    // To remain A+ compliant, a library must only set `_lib=true` if it can guarantee that the stack
    // only contains library code when calling resolve() or reject().
    // RULE OF THUMB: ONLY set _lib = true for promises explicitely resolving/rejecting directly from
    // global scope (event handler, timer etc)!
    this._lib = false;
    // Current async scope
    var psd = (this._PSD = PSD);
    if (debug) {
        this._stackHolder = getErrorWithStack();
        this._prev = null;
        this._numPrev = 0; // Number of previous promises (for long stacks)
    }
    if (typeof fn !== 'function') {
        if (fn !== INTERNAL)
            throw new TypeError('Not a function');
        // Private constructor (INTERNAL, state, value).
        // Used internally by Promise.resolve() and Promise.reject().
        this._state = arguments[1];
        this._value = arguments[2];
        if (this._state === false)
            handleRejection(this, this._value); // Map error, set stack and addPossiblyUnhandledError().
        return;
    }
    this._state = null; // null (=pending), false (=rejected) or true (=resolved)
    this._value = null; // error or result
    ++psd.ref; // Refcounting current scope
    executePromiseTask(this, fn);
}
// Prepare a property descriptor to put onto Promise.prototype.then
var thenProp = {
    get: function () {
        var psd = PSD, microTaskId = totalEchoes;
        function then(onFulfilled, onRejected) {
            var _this = this;
            var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
            if (possibleAwait)
                decrementExpectedAwaits();
            var rv = new Promise(function (resolve, reject) {
                propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait), resolve, reject, psd));
            });
            debug && linkToPreviousPromise(rv, this);
            return rv;
        }
        then.prototype = INTERNAL; // For idempotense, see setter below.
        return then;
    },
    // Be idempotent and allow another framework (such as zone.js or another instance of a Dexie.Promise module) to replace Promise.prototype.then
    // and when that framework wants to restore the original property, we must identify that and restore the original property descriptor.
    set: function (value) {
        setProp(this, 'then', value && value.prototype === INTERNAL ?
            thenProp : // Restore to original property descriptor.
            {
                get: function () {
                    return value; // Getter returning provided value (behaves like value is just changed)
                },
                set: thenProp.set // Keep a setter that is prepared to restore original.
            });
    }
};
props(Promise.prototype, {
    then: thenProp,
    _then: function (onFulfilled, onRejected) {
        // A little tinier version of then() that don't have to create a resulting promise.
        propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
    },
    catch: function (onRejected) {
        if (arguments.length === 1)
            return this.then(null, onRejected);
        // First argument is the Error type to catch
        var type = arguments[0], handler = arguments[1];
        return typeof type === 'function' ? this.then(null, function (err) {
            // Catching errors by its constructor type (similar to java / c++ / c#)
            // Sample: promise.catch(TypeError, function (e) { ... });
            return err instanceof type ? handler(err) : PromiseReject(err);
        })
            : this.then(null, function (err) {
                // Catching errors by the error.name property. Makes sense for indexedDB where error type
                // is always DOMError but where e.name tells the actual error type.
                // Sample: promise.catch('ConstraintError', function (e) { ... });
                return err && err.name === type ? handler(err) : PromiseReject(err);
            });
    },
    finally: function (onFinally) {
        return this.then(function (value) {
            onFinally();
            return value;
        }, function (err) {
            onFinally();
            return PromiseReject(err);
        });
    },
    stack: {
        get: function () {
            if (this._stack)
                return this._stack;
            try {
                stack_being_generated = true;
                var stacks = getStack(this, [], MAX_LONG_STACKS);
                var stack = stacks.join("\nFrom previous: ");
                if (this._state !== null)
                    this._stack = stack; // Stack may be updated on reject.
                return stack;
            }
            finally {
                stack_being_generated = false;
            }
        }
    },
    timeout: function (ms, msg) {
        var _this = this;
        return ms < Infinity ?
            new Promise(function (resolve, reject) {
                var handle = setTimeout(function () { return reject(new exceptions.Timeout(msg)); }, ms);
                _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
            }) : this;
    }
});
if (typeof Symbol !== 'undefined' && Symbol.toStringTag)
    setProp(Promise.prototype, Symbol.toStringTag, 'Promise');
// Now that Promise.prototype is defined, we have all it takes to set globalPSD.env.
// Environment globals snapshotted on leaving global zone
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.resolve = resolve;
    this.reject = reject;
    this.psd = zone;
}
// Promise Static Properties
props(Promise, {
    all: function () {
        var values = getArrayOf.apply(null, arguments) // Supports iterables, implicit arguments and array-like.
            .map(onPossibleParallellAsync); // Handle parallell async/awaits 
        return new Promise(function (resolve, reject) {
            if (values.length === 0)
                resolve([]);
            var remaining = values.length;
            values.forEach(function (a, i) { return Promise.resolve(a).then(function (x) {
                values[i] = x;
                if (!--remaining)
                    resolve(values);
            }, reject); });
        });
    },
    resolve: function (value) {
        if (value instanceof Promise)
            return value;
        if (value && typeof value.then === 'function')
            return new Promise(function (resolve, reject) {
                value.then(resolve, reject);
            });
        var rv = new Promise(INTERNAL, true, value);
        linkToPreviousPromise(rv, currentFulfiller);
        return rv;
    },
    reject: PromiseReject,
    race: function () {
        var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new Promise(function (resolve, reject) {
            values.map(function (value) { return Promise.resolve(value).then(resolve, reject); });
        });
    },
    PSD: {
        get: function () { return PSD; },
        set: function (value) { return PSD = value; }
    },
    //totalEchoes: {get: ()=>totalEchoes},
    //task: {get: ()=>task},
    newPSD: newScope,
    usePSD: usePSD,
    scheduler: {
        get: function () { return asap$1; },
        set: function (value) { asap$1 = value; }
    },
    rejectionMapper: {
        get: function () { return rejectionMapper; },
        set: function (value) { rejectionMapper = value; } // Map reject failures
    },
    follow: function (fn, zoneProps) {
        return new Promise(function (resolve, reject) {
            return newScope(function (resolve, reject) {
                var psd = PSD;
                psd.unhandleds = []; // For unhandled standard- or 3rd party Promises. Checked at psd.finalize()
                psd.onunhandled = reject; // Triggered directly on unhandled promises of this library.
                psd.finalize = callBoth(function () {
                    var _this = this;
                    // Unhandled standard or 3rd part promises are put in PSD.unhandleds and
                    // examined upon scope completion while unhandled rejections in this Promise
                    // will trigger directly through psd.onunhandled
                    run_at_end_of_this_or_next_physical_tick(function () {
                        _this.unhandleds.length === 0 ? resolve() : reject(_this.unhandleds[0]);
                    });
                }, psd.finalize);
                fn();
            }, zoneProps, resolve, reject);
        });
    }
});
/**
* Take a potentially misbehaving resolver function and make sure
* onFulfilled and onRejected are only called once.
*
* Makes no guarantees about asynchrony.
*/
function executePromiseTask(promise, fn) {
    // Promise Resolution Procedure:
    // https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    try {
        fn(function (value) {
            if (promise._state !== null)
                return; // Already settled
            if (value === promise)
                throw new TypeError('A promise cannot be resolved with itself.');
            var shouldExecuteTick = promise._lib && beginMicroTickScope();
            if (value && typeof value.then === 'function') {
                executePromiseTask(promise, function (resolve, reject) {
                    value instanceof Promise ?
                        value._then(resolve, reject) :
                        value.then(resolve, reject);
                });
            }
            else {
                promise._state = true;
                promise._value = value;
                propagateAllListeners(promise);
            }
            if (shouldExecuteTick)
                endMicroTickScope();
        }, handleRejection.bind(null, promise)); // If Function.bind is not supported. Exception is handled in catch below
    }
    catch (ex) {
        handleRejection(promise, ex);
    }
}
function handleRejection(promise, reason) {
    rejectingErrors.push(reason);
    if (promise._state !== null)
        return;
    var shouldExecuteTick = promise._lib && beginMicroTickScope();
    reason = rejectionMapper(reason);
    promise._state = false;
    promise._value = reason;
    debug && reason !== null && typeof reason === 'object' && !reason._promise && tryCatch(function () {
        var origProp = getPropertyDescriptor(reason, "stack");
        reason._promise = promise;
        setProp(reason, "stack", {
            get: function () {
                return stack_being_generated ?
                    origProp && (origProp.get ?
                        origProp.get.apply(reason) :
                        origProp.value) :
                    promise.stack;
            }
        });
    });
    // Add the failure to a list of possibly uncaught errors
    addPossiblyUnhandledError(promise);
    propagateAllListeners(promise);
    if (shouldExecuteTick)
        endMicroTickScope();
}
function propagateAllListeners(promise) {
    //debug && linkToPreviousPromise(promise);
    var listeners = promise._listeners;
    promise._listeners = [];
    for (var i = 0, len = listeners.length; i < len; ++i) {
        propagateToListener(promise, listeners[i]);
    }
    var psd = promise._PSD;
    --psd.ref || psd.finalize(); // if psd.ref reaches zero, call psd.finalize();
    if (numScheduledCalls === 0) {
        // If numScheduledCalls is 0, it means that our stack is not in a callback of a scheduled call,
        // and that no deferreds where listening to this rejection or success.
        // Since there is a risk that our stack can contain application code that may
        // do stuff after this code is finished that may generate new calls, we cannot
        // call finalizers here.
        ++numScheduledCalls;
        asap$1(function () {
            if (--numScheduledCalls === 0)
                finalizePhysicalTick(); // Will detect unhandled errors
        }, []);
    }
}
function propagateToListener(promise, listener) {
    if (promise._state === null) {
        promise._listeners.push(listener);
        return;
    }
    var cb = promise._state ? listener.onFulfilled : listener.onRejected;
    if (cb === null) {
        // This Listener doesnt have a listener for the event being triggered (onFulfilled or onReject) so lets forward the event to any eventual listeners on the Promise instance returned by then() or catch()
        return (promise._state ? listener.resolve : listener.reject)(promise._value);
    }
    ++listener.psd.ref;
    ++numScheduledCalls;
    asap$1(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
    try {
        // Set static variable currentFulfiller to the promise that is being fullfilled,
        // so that we connect the chain of promises (for long stacks support)
        currentFulfiller = promise;
        // Call callback and resolve our listener with it's return value.
        var ret, value = promise._value;
        if (promise._state) {
            // cb is onResolved
            ret = cb(value);
        }
        else {
            // cb is onRejected
            if (rejectingErrors.length)
                rejectingErrors = [];
            ret = cb(value);
            if (rejectingErrors.indexOf(value) === -1)
                markErrorAsHandled(promise); // Callback didnt do Promise.reject(err) nor reject(err) onto another promise.
        }
        listener.resolve(ret);
    }
    catch (e) {
        // Exception thrown in callback. Reject our listener.
        listener.reject(e);
    }
    finally {
        // Restore env and currentFulfiller.
        currentFulfiller = null;
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
        --listener.psd.ref || listener.psd.finalize();
    }
}
function getStack(promise, stacks, limit) {
    if (stacks.length === limit)
        return stacks;
    var stack = "";
    if (promise._state === false) {
        var failure = promise._value, errorName, message;
        if (failure != null) {
            errorName = failure.name || "Error";
            message = failure.message || failure;
            stack = prettyStack(failure, 0);
        }
        else {
            errorName = failure; // If error is undefined or null, show that.
            message = "";
        }
        stacks.push(errorName + (message ? ": " + message : "") + stack);
    }
    if (debug) {
        stack = prettyStack(promise._stackHolder, 2);
        if (stack && stacks.indexOf(stack) === -1)
            stacks.push(stack);
        if (promise._prev)
            getStack(promise._prev, stacks, limit);
    }
    return stacks;
}
function linkToPreviousPromise(promise, prev) {
    // Support long stacks by linking to previous completed promise.
    var numPrev = prev ? prev._numPrev + 1 : 0;
    if (numPrev < LONG_STACKS_CLIP_LIMIT) {
        promise._prev = prev;
        promise._numPrev = numPrev;
    }
}
/* The callback to schedule with setImmediate() or setTimeout().
   It runs a virtual microtick and executes any callback registered in microtickQueue.
 */
function physicalTick() {
    beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
    var wasRootExec = isOutsideMicroTick;
    isOutsideMicroTick = false;
    needsNewPhysicalTick = false;
    return wasRootExec;
}
/* Executes micro-ticks without doing try..catch.
   This can be possible because we only use this internally and
   the registered functions are exception-safe (they do try..catch
   internally before calling any external method). If registering
   functions in the microtickQueue that are not exception-safe, this
   would destroy the framework and make it instable. So we don't export
   our asap method.
*/
function endMicroTickScope() {
    var callbacks, i, l;
    do {
        while (microtickQueue.length > 0) {
            callbacks = microtickQueue;
            microtickQueue = [];
            l = callbacks.length;
            for (i = 0; i < l; ++i) {
                var item = callbacks[i];
                item[0].apply(null, item[1]);
            }
        }
    } while (microtickQueue.length > 0);
    isOutsideMicroTick = true;
    needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
    var unhandledErrs = unhandledErrors;
    unhandledErrors = [];
    unhandledErrs.forEach(function (p) {
        p._PSD.onunhandled.call(null, p._value, p);
    });
    var finalizers = tickFinalizers.slice(0); // Clone first because finalizer may remove itself from list.
    var i = finalizers.length;
    while (i)
        finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
    function finalizer() {
        fn();
        tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
    }
    tickFinalizers.push(finalizer);
    ++numScheduledCalls;
    asap$1(function () {
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
    }, []);
}
function addPossiblyUnhandledError(promise) {
    // Only add to unhandledErrors if not already there. The first one to add to this list
    // will be upon the first rejection so that the root cause (first promise in the
    // rejection chain) is the one listed.
    if (!unhandledErrors.some(function (p) { return p._value === promise._value; }))
        unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
    // Called when a reject handled is actually being called.
    // Search in unhandledErrors for any promise whos _value is this promise_value (list
    // contains only rejected promises, and only one item per error)
    var i = unhandledErrors.length;
    while (i)
        if (unhandledErrors[--i]._value === promise._value) {
            // Found a promise that failed with this same error object pointer,
            // Remove that since there is a listener that actually takes care of it.
            unhandledErrors.splice(i, 1);
            return;
        }
}
function PromiseReject(reason) {
    return new Promise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
    var psd = PSD;
    return function () {
        var wasRootExec = beginMicroTickScope(), outerScope = PSD;
        try {
            switchToZone(psd, true);
            return fn.apply(this, arguments);
        }
        catch (e) {
            errorCatcher && errorCatcher(e);
        }
        finally {
            switchToZone(outerScope, false);
            if (wasRootExec)
                endMicroTickScope();
        }
    };
}
//
// variables used for native await support
//
var task = { awaits: 0, echoes: 0, id: 0 }; // The ongoing macro-task when using zone-echoing.
var taskCounter = 0; // ID counter for macro tasks.
var zoneStack = []; // Stack of left zones to restore asynchronically.
var zoneEchoes = 0; // zoneEchoes is a must in order to persist zones between native await expressions.
var totalEchoes = 0; // ID counter for micro-tasks. Used to detect possible native await in our Promise.prototype.then.
var zone_id_counter = 0;
function newScope(fn, props$$1, a1, a2) {
    var parent = PSD, psd = Object.create(parent);
    psd.parent = parent;
    psd.ref = 0;
    psd.global = false;
    psd.id = ++zone_id_counter;
    // Prepare for promise patching (done in usePSD):
    var globalEnv = globalPSD.env;
    psd.env = patchGlobalPromise ? {
        Promise: Promise,
        PromiseProp: { value: Promise, configurable: true, writable: true },
        all: Promise.all,
        race: Promise.race,
        resolve: Promise.resolve,
        reject: Promise.reject,
        nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
        gthen: getPatchedPromiseThen(globalEnv.gthen, psd) // global then
    } : {};
    if (props$$1)
        extend(psd, props$$1);
    // unhandleds and onunhandled should not be specifically set here.
    // Leave them on parent prototype.
    // unhandleds.push(err) will push to parent's prototype
    // onunhandled() will call parents onunhandled (with this scope's this-pointer though!)
    ++parent.ref;
    psd.finalize = function () {
        --this.parent.ref || this.parent.finalize();
    };
    var rv = usePSD(psd, fn, a1, a2);
    if (psd.ref === 0)
        psd.finalize();
    return rv;
}
// Function to call if scopeFunc returns NativePromise
// Also for each NativePromise in the arguments to Promise.all()
function incrementExpectedAwaits() {
    if (!task.id)
        task.id = ++taskCounter;
    ++task.awaits;
    task.echoes += ZONE_ECHO_LIMIT;
    return task.id;
}
// Function to call when 'then' calls back on a native promise where onAwaitExpected() had been called.
// Also call this when a native await calls then method on a promise. In that case, don't supply
// sourceTaskId because we already know it refers to current task.
function decrementExpectedAwaits(sourceTaskId) {
    if (!task.awaits || (sourceTaskId && sourceTaskId !== task.id))
        return;
    if (--task.awaits === 0)
        task.id = 0;
    task.echoes = task.awaits * ZONE_ECHO_LIMIT; // Will reset echoes to 0 if awaits is 0.
}
// Call from Promise.all() and Promise.race()
function onPossibleParallellAsync(possiblePromise) {
    if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
        incrementExpectedAwaits();
        return possiblePromise.then(function (x) {
            decrementExpectedAwaits();
            return x;
        }, function (e) {
            decrementExpectedAwaits();
            return rejection(e);
        });
    }
    return possiblePromise;
}
function zoneEnterEcho(targetZone) {
    ++totalEchoes;
    if (!task.echoes || --task.echoes === 0) {
        task.echoes = task.id = 0; // Cancel zone echoing.
    }
    zoneStack.push(PSD);
    switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
    var zone = zoneStack[zoneStack.length - 1];
    zoneStack.pop();
    switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
    var currentZone = PSD;
    if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
        // Enter or leave zone asynchronically as well, so that tasks initiated during current tick
        // will be surrounded by the zone when they are invoked.
        enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
    }
    if (targetZone === PSD)
        return;
    PSD = targetZone; // The actual zone switch occurs at this line.
    // Snapshot on every leave from global zone.
    if (currentZone === globalPSD)
        globalPSD.env = snapShot();
    if (patchGlobalPromise) {
        // Let's patch the global and native Promises (may be same or may be different)
        var GlobalPromise = globalPSD.env.Promise;
        // Swich environments (may be PSD-zone or the global zone. Both apply.)
        var targetEnv = targetZone.env;
        // Change Promise.prototype.then for native and global Promise (they MAY differ on polyfilled environments, but both can be accessed)
        // Must be done on each zone change because the patched method contains targetZone in its closure.
        nativePromiseProto.then = targetEnv.nthen;
        GlobalPromise.prototype.then = targetEnv.gthen;
        if (currentZone.global || targetZone.global) {
            // Leaving or entering global zone. It's time to patch / restore global Promise.
            // Set this Promise to window.Promise so that transiled async functions will work on Firefox, Safari and IE, as well as with Zonejs and angular.
            Object.defineProperty(_global, 'Promise', targetEnv.PromiseProp);
            // Support Promise.all() etc to work indexedDB-safe also when people are including es6-promise as a module (they might
            // not be accessing global.Promise but a local reference to it)
            GlobalPromise.all = targetEnv.all;
            GlobalPromise.race = targetEnv.race;
            GlobalPromise.resolve = targetEnv.resolve;
            GlobalPromise.reject = targetEnv.reject;
        }
    }
}
function snapShot() {
    var GlobalPromise = _global.Promise;
    return patchGlobalPromise ? {
        Promise: GlobalPromise,
        PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
        all: GlobalPromise.all,
        race: GlobalPromise.race,
        resolve: GlobalPromise.resolve,
        reject: GlobalPromise.reject,
        nthen: nativePromiseProto.then,
        gthen: GlobalPromise.prototype.then
    } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
    var outerScope = PSD;
    try {
        switchToZone(psd, true);
        return fn(a1, a2, a3);
    }
    finally {
        switchToZone(outerScope, false);
    }
}
function enqueueNativeMicroTask(job) {
    //
    // Precondition: nativePromiseThen !== undefined
    //
    nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait) {
    return typeof fn !== 'function' ? fn : function () {
        var outerZone = PSD;
        if (possibleAwait)
            incrementExpectedAwaits();
        switchToZone(zone, true);
        try {
            return fn.apply(this, arguments);
        }
        finally {
            switchToZone(outerZone, false);
        }
    };
}
function getPatchedPromiseThen(origThen, zone) {
    return function (onResolved, onRejected) {
        return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone, false), nativeAwaitCompatibleWrap(onRejected, zone, false));
    };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
    var rv;
    try {
        rv = promise.onuncatched(err);
    }
    catch (e) { }
    if (rv !== false)
        try {
            var event, eventData = { promise: promise, reason: err };
            if (_global.document && document.createEvent) {
                event = document.createEvent('Event');
                event.initEvent(UNHANDLEDREJECTION, true, true);
                extend(event, eventData);
            }
            else if (_global.CustomEvent) {
                event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
                extend(event, eventData);
            }
            if (event && _global.dispatchEvent) {
                dispatchEvent(event);
                if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
                    // No native support for PromiseRejectionEvent but user has set window.onunhandledrejection. Manually call it.
                    try {
                        _global.onunhandledrejection(event);
                    }
                    catch (_) { }
            }
            if (!event.defaultPrevented) {
                console.warn("Unhandled rejection: " + (err.stack || err));
            }
        }
        catch (e) { }
}
var rejection = Promise.reject;

function Events(ctx) {
    var evs = {};
    var rv = function (eventName, subscriber) {
        if (subscriber) {
            // Subscribe. If additional arguments than just the subscriber was provided, forward them as well.
            var i = arguments.length, args = new Array(i - 1);
            while (--i)
                args[i - 1] = arguments[i];
            evs[eventName].subscribe.apply(null, args);
            return ctx;
        }
        else if (typeof (eventName) === 'string') {
            // Return interface allowing to fire or unsubscribe from event
            return evs[eventName];
        }
    };
    rv.addEventType = add;
    for (var i = 1, l = arguments.length; i < l; ++i) {
        add(arguments[i]);
    }
    return rv;
    function add(eventName, chainFunction, defaultFunction) {
        if (typeof eventName === 'object')
            return addConfiguredEvents(eventName);
        if (!chainFunction)
            chainFunction = reverseStoppableEventChain;
        if (!defaultFunction)
            defaultFunction = nop;
        var context = {
            subscribers: [],
            fire: defaultFunction,
            subscribe: function (cb) {
                if (context.subscribers.indexOf(cb) === -1) {
                    context.subscribers.push(cb);
                    context.fire = chainFunction(context.fire, cb);
                }
            },
            unsubscribe: function (cb) {
                context.subscribers = context.subscribers.filter(function (fn) { return fn !== cb; });
                context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
            }
        };
        evs[eventName] = rv[eventName] = context;
        return context;
    }
    function addConfiguredEvents(cfg) {
        // events(this, {reading: [functionChain, nop]});
        keys(cfg).forEach(function (eventName) {
            var args = cfg[eventName];
            if (isArray(args)) {
                add(eventName, cfg[eventName][0], cfg[eventName][1]);
            }
            else if (args === 'asap') {
                // Rather than approaching event subscription using a functional approach, we here do it in a for-loop where subscriber is executed in its own stack
                // enabling that any exception that occur wont disturb the initiator and also not nescessary be catched and forgotten.
                var context = add(eventName, mirror, function fire() {
                    // Optimazation-safe cloning of arguments into args.
                    var i = arguments.length, args = new Array(i);
                    while (i--)
                        args[i] = arguments[i];
                    // All each subscriber:
                    context.subscribers.forEach(function (fn) {
                        asap(function fireEvent() {
                            fn.apply(null, args);
                        });
                    });
                });
            }
            else
                throw new exceptions.InvalidArgument("Invalid event config");
        });
    }
}

/*
 * Dexie.js - a minimalistic wrapper for IndexedDB
 * ===============================================
 *
 * Copyright (c) 2014-2017 David Fahlander
 *
 * Version 2.0.4, Fri May 25 2018
 *
 * http://dexie.org
 *
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/LICENSE-2.0
 *
 */
var DEXIE_VERSION = '2.0.4';
var maxString = String.fromCharCode(65535);
var maxKey = (function () { try {
    IDBKeyRange.only([[]]);
    return [[]];
}
catch (e) {
    return maxString;
} })();
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== 'undefined' && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = function (frame) { return !/(dexie\.js|dexie\.min\.js)/.test(frame); };
var dbNamesDB; // Global database for backing Dexie.getDatabaseNames() on browser without indexedDB.webkitGetDatabaseNames() 
// Init debug
setDebug(debug, dexieStackFrameFilter);
function Dexie(dbName, options) {
    /// <param name="options" type="Object" optional="true">Specify only if you wich to control which addons that should run on this instance</param>
    var deps = Dexie.dependencies;
    var opts = extend({
        // Default Options
        addons: Dexie.addons,
        autoOpen: true,
        indexedDB: deps.indexedDB,
        IDBKeyRange: deps.IDBKeyRange // Backend IDBKeyRange api. Default to browser env.
    }, options);
    var addons = opts.addons, autoOpen = opts.autoOpen, indexedDB = opts.indexedDB, IDBKeyRange = opts.IDBKeyRange;
    var globalSchema = this._dbSchema = {};
    var versions = [];
    var dbStoreNames = [];
    var allTables = {};
    ///<var type="IDBDatabase" />
    var idbdb = null; // Instance of IDBDatabase
    var dbOpenError = null;
    var isBeingOpened = false;
    var onReadyBeingFired = null;
    var openComplete = false;
    var READONLY = "readonly", READWRITE = "readwrite";
    var db = this;
    var dbReadyResolve, dbReadyPromise = new Promise(function (resolve) {
        dbReadyResolve = resolve;
    }), cancelOpen, openCanceller = new Promise(function (_, reject) {
        cancelOpen = reject;
    });
    var autoSchema = true;
    var hasNativeGetDatabaseNames = !!getNativeGetDatabaseNamesFn(indexedDB), hasGetAll;
    function init() {
        // Default subscribers to "versionchange" and "blocked".
        // Can be overridden by custom handlers. If custom handlers return false, these default
        // behaviours will be prevented.
        db.on("versionchange", function (ev) {
            // Default behavior for versionchange event is to close database connection.
            // Caller can override this behavior by doing db.on("versionchange", function(){ return false; });
            // Let's not block the other window from making it's delete() or open() call.
            // NOTE! This event is never fired in IE,Edge or Safari.
            if (ev.newVersion > 0)
                console.warn("Another connection wants to upgrade database '" + db.name + "'. Closing db now to resume the upgrade.");
            else
                console.warn("Another connection wants to delete database '" + db.name + "'. Closing db now to resume the delete request.");
            db.close();
            // In many web applications, it would be recommended to force window.reload()
            // when this event occurs. To do that, subscribe to the versionchange event
            // and call window.location.reload(true) if ev.newVersion > 0 (not a deletion)
            // The reason for this is that your current web app obviously has old schema code that needs
            // to be updated. Another window got a newer version of the app and needs to upgrade DB but
            // your window is blocking it unless we close it here.
        });
        db.on("blocked", function (ev) {
            if (!ev.newVersion || ev.newVersion < ev.oldVersion)
                console.warn("Dexie.delete('" + db.name + "') was blocked");
            else
                console.warn("Upgrade '" + db.name + "' blocked by other connection holding version " + ev.oldVersion / 10);
        });
    }
    //
    //
    //
    // ------------------------- Versioning Framework---------------------------
    //
    //
    //
    this.version = function (versionNumber) {
        /// <param name="versionNumber" type="Number"></param>
        /// <returns type="Version"></returns>
        if (idbdb || isBeingOpened)
            throw new exceptions.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, versionNumber);
        var versionInstance = versions.filter(function (v) { return v._cfg.version === versionNumber; })[0];
        if (versionInstance)
            return versionInstance;
        versionInstance = new Version(versionNumber);
        versions.push(versionInstance);
        versions.sort(lowerVersionFirst);
        // Disable autoschema mode, as at least one version is specified.
        autoSchema = false;
        return versionInstance;
    };
    function Version(versionNumber) {
        this._cfg = {
            version: versionNumber,
            storesSource: null,
            dbschema: {},
            tables: {},
            contentUpgrade: null
        };
        this.stores({}); // Derive earlier schemas by default.
    }
    extend(Version.prototype, {
        stores: function (stores) {
            /// <summary>
            ///   Defines the schema for a particular version
            /// </summary>
            /// <param name="stores" type="Object">
            /// Example: <br/>
            ///   {users: "id++,first,last,&amp;username,*email", <br/>
            ///   passwords: "id++,&amp;username"}<br/>
            /// <br/>
            /// Syntax: {Table: "[primaryKey][++],[&amp;][*]index1,[&amp;][*]index2,..."}<br/><br/>
            /// Special characters:<br/>
            ///  "&amp;"  means unique key, <br/>
            ///  "*"  means value is multiEntry, <br/>
            ///  "++" means auto-increment and only applicable for primary key <br/>
            /// </param>
            this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
            // Derive stores from earlier versions if they are not explicitely specified as null or a new syntax.
            var storesSpec = {};
            versions.forEach(function (version) {
                extend(storesSpec, version._cfg.storesSource);
            });
            var dbschema = (this._cfg.dbschema = {});
            this._parseStoresSpec(storesSpec, dbschema);
            // Update the latest schema to this version
            // Update API
            globalSchema = db._dbSchema = dbschema;
            removeTablesApi([allTables, db, Transaction.prototype]); // Keep Transaction.prototype even though it should be depr.
            setApiOnPlace([allTables, db, Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
            dbStoreNames = keys(dbschema);
            return this;
        },
        upgrade: function (upgradeFunction) {
            this._cfg.contentUpgrade = upgradeFunction;
            return this;
        },
        _parseStoresSpec: function (stores, outSchema) {
            keys(stores).forEach(function (tableName) {
                if (stores[tableName] !== null) {
                    var instanceTemplate = {};
                    var indexes = parseIndexSyntax(stores[tableName]);
                    var primKey = indexes.shift();
                    if (primKey.multi)
                        throw new exceptions.Schema("Primary key cannot be multi-valued");
                    if (primKey.keyPath)
                        setByKeyPath(instanceTemplate, primKey.keyPath, primKey.auto ? 0 : primKey.keyPath);
                    indexes.forEach(function (idx) {
                        if (idx.auto)
                            throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                        if (!idx.keyPath)
                            throw new exceptions.Schema("Index must have a name and cannot be an empty string");
                        setByKeyPath(instanceTemplate, idx.keyPath, idx.compound ? idx.keyPath.map(function () { return ""; }) : "");
                    });
                    outSchema[tableName] = new TableSchema(tableName, primKey, indexes, instanceTemplate);
                }
            });
        }
    });
    function runUpgraders(oldVersion, idbtrans, reject) {
        var trans = db._createTransaction(READWRITE, dbStoreNames, globalSchema);
        trans.create(idbtrans);
        trans._completion.catch(reject);
        var rejectTransaction = trans._reject.bind(trans);
        newScope(function () {
            PSD.trans = trans;
            if (oldVersion === 0) {
                // Create tables:
                keys(globalSchema).forEach(function (tableName) {
                    createTable(idbtrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
                });
                Promise.follow(function () { return db.on.populate.fire(trans); }).catch(rejectTransaction);
            }
            else
                updateTablesAndIndexes(oldVersion, trans, idbtrans).catch(rejectTransaction);
        });
    }
    function updateTablesAndIndexes(oldVersion, trans, idbtrans) {
        // Upgrade version to version, step-by-step from oldest to newest version.
        // Each transaction object will contain the table set that was current in that version (but also not-yet-deleted tables from its previous version)
        var queue = [];
        var oldVersionStruct = versions.filter(function (version) { return version._cfg.version === oldVersion; })[0];
        if (!oldVersionStruct)
            throw new exceptions.Upgrade("Dexie specification of currently installed DB version is missing");
        globalSchema = db._dbSchema = oldVersionStruct._cfg.dbschema;
        var anyContentUpgraderHasRun = false;
        var versToRun = versions.filter(function (v) { return v._cfg.version > oldVersion; });
        versToRun.forEach(function (version) {
            /// <param name="version" type="Version"></param>
            queue.push(function () {
                var oldSchema = globalSchema;
                var newSchema = version._cfg.dbschema;
                adjustToExistingIndexNames(oldSchema, idbtrans);
                adjustToExistingIndexNames(newSchema, idbtrans);
                globalSchema = db._dbSchema = newSchema;
                var diff = getSchemaDiff(oldSchema, newSchema);
                // Add tables           
                diff.add.forEach(function (tuple) {
                    createTable(idbtrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
                });
                // Change tables
                diff.change.forEach(function (change) {
                    if (change.recreate) {
                        throw new exceptions.Upgrade("Not yet support for changing primary key");
                    }
                    else {
                        var store = idbtrans.objectStore(change.name);
                        // Add indexes
                        change.add.forEach(function (idx) {
                            addIndex(store, idx);
                        });
                        // Update indexes
                        change.change.forEach(function (idx) {
                            store.deleteIndex(idx.name);
                            addIndex(store, idx);
                        });
                        // Delete indexes
                        change.del.forEach(function (idxName) {
                            store.deleteIndex(idxName);
                        });
                    }
                });
                if (version._cfg.contentUpgrade) {
                    anyContentUpgraderHasRun = true;
                    return Promise.follow(function () {
                        version._cfg.contentUpgrade(trans);
                    });
                }
            });
            queue.push(function (idbtrans) {
                if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
                    var newSchema = version._cfg.dbschema;
                    // Delete old tables
                    deleteRemovedTables(newSchema, idbtrans);
                }
            });
        });
        // Now, create a queue execution engine
        function runQueue() {
            return queue.length ? Promise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) :
                Promise.resolve();
        }
        return runQueue().then(function () {
            createMissingTables(globalSchema, idbtrans); // At last, make sure to create any missing tables. (Needed by addons that add stores to DB without specifying version)
        });
    }
    function getSchemaDiff(oldSchema, newSchema) {
        var diff = {
            del: [],
            add: [],
            change: [] // Array of {name: tableName, recreate: newDefinition, del: delIndexNames, add: newIndexDefs, change: changedIndexDefs}
        };
        for (var table in oldSchema) {
            if (!newSchema[table])
                diff.del.push(table);
        }
        for (table in newSchema) {
            var oldDef = oldSchema[table], newDef = newSchema[table];
            if (!oldDef) {
                diff.add.push([table, newDef]);
            }
            else {
                var change = {
                    name: table,
                    def: newDef,
                    recreate: false,
                    del: [],
                    add: [],
                    change: []
                };
                if (oldDef.primKey.src !== newDef.primKey.src) {
                    // Primary key has changed. Remove and re-add table.
                    change.recreate = true;
                    diff.change.push(change);
                }
                else {
                    // Same primary key. Just find out what differs:
                    var oldIndexes = oldDef.idxByName;
                    var newIndexes = newDef.idxByName;
                    for (var idxName in oldIndexes) {
                        if (!newIndexes[idxName])
                            change.del.push(idxName);
                    }
                    for (idxName in newIndexes) {
                        var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                        if (!oldIdx)
                            change.add.push(newIdx);
                        else if (oldIdx.src !== newIdx.src)
                            change.change.push(newIdx);
                    }
                    if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                        diff.change.push(change);
                    }
                }
            }
        }
        return diff;
    }
    function createTable(idbtrans, tableName, primKey, indexes) {
        /// <param name="idbtrans" type="IDBTransaction"></param>
        var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
        indexes.forEach(function (idx) { addIndex(store, idx); });
        return store;
    }
    function createMissingTables(newSchema, idbtrans) {
        keys(newSchema).forEach(function (tableName) {
            if (!idbtrans.db.objectStoreNames.contains(tableName)) {
                createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
            }
        });
    }
    function deleteRemovedTables(newSchema, idbtrans) {
        for (var i = 0; i < idbtrans.db.objectStoreNames.length; ++i) {
            var storeName = idbtrans.db.objectStoreNames[i];
            if (newSchema[storeName] == null) {
                idbtrans.db.deleteObjectStore(storeName);
            }
        }
    }
    function addIndex(store, idx) {
        store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
    }
    //
    //
    //      Dexie Protected API
    //
    //
    this._allTables = allTables;
    this._createTransaction = function (mode, storeNames, dbschema, parentTransaction) {
        return new Transaction(mode, storeNames, dbschema, parentTransaction);
    };
    /* Generate a temporary transaction when db operations are done outside a transaction scope.
    */
    function tempTransaction(mode, storeNames, fn) {
        if (!openComplete && (!PSD.letThrough)) {
            if (!isBeingOpened) {
                if (!autoOpen)
                    return rejection(new exceptions.DatabaseClosed());
                db.open().catch(nop); // Open in background. If if fails, it will be catched by the final promise anyway.
            }
            return dbReadyPromise.then(function () { return tempTransaction(mode, storeNames, fn); });
        }
        else {
            var trans = db._createTransaction(mode, storeNames, globalSchema);
            try {
                trans.create();
            }
            catch (ex) {
                return rejection(ex);
            }
            return trans._promise(mode, function (resolve, reject) {
                return newScope(function () {
                    PSD.trans = trans;
                    return fn(resolve, reject, trans);
                });
            }).then(function (result) {
                // Instead of resolving value directly, wait with resolving it until transaction has completed.
                // Otherwise the data would not be in the DB if requesting it in the then() operation.
                // Specifically, to ensure that the following expression will work:
                //
                //   db.friends.put({name: "Arne"}).then(function () {
                //       db.friends.where("name").equals("Arne").count(function(count) {
                //           assert (count === 1);
                //       });
                //   });
                //
                return trans._completion.then(function () { return result; });
            }); /*.catch(err => { // Don't do this as of now. If would affect bulk- and modify methods in a way that could be more intuitive. But wait! Maybe change in next major.
                trans._reject(err);
                return rejection(err);
            });*/
        }
    }
    this._whenReady = function (fn) {
        return openComplete || PSD.letThrough ? fn() : new Promise(function (resolve, reject) {
            if (!isBeingOpened) {
                if (!autoOpen) {
                    reject(new exceptions.DatabaseClosed());
                    return;
                }
                db.open().catch(nop); // Open in background. If if fails, it will be catched by the final promise anyway.
            }
            dbReadyPromise.then(resolve, reject);
        }).then(fn);
    };
    //
    //
    //
    //
    //      Dexie API
    //
    //
    //
    this.verno = 0;
    this.open = function () {
        if (isBeingOpened || idbdb)
            return dbReadyPromise.then(function () { return dbOpenError ? rejection(dbOpenError) : db; });
        debug && (openCanceller._stackHolder = getErrorWithStack()); // Let stacks point to when open() was called rather than where new Dexie() was called.
        isBeingOpened = true;
        dbOpenError = null;
        openComplete = false;
        // Function pointers to call when the core opening process completes.
        var resolveDbReady = dbReadyResolve, 
        // upgradeTransaction to abort on failure.
        upgradeTransaction = null;
        return Promise.race([openCanceller, new Promise(function (resolve, reject) {
                // Multiply db.verno with 10 will be needed to workaround upgrading bug in IE:
                // IE fails when deleting objectStore after reading from it.
                // A future version of Dexie.js will stopover an intermediate version to workaround this.
                // At that point, we want to be backward compatible. Could have been multiplied with 2, but by using 10, it is easier to map the number to the real version number.
                // If no API, throw!
                if (!indexedDB)
                    throw new exceptions.MissingAPI("indexedDB API not found. If using IE10+, make sure to run your code on a server URL " +
                        "(not locally). If using old Safari versions, make sure to include indexedDB polyfill.");
                var req = autoSchema ? indexedDB.open(dbName) : indexedDB.open(dbName, Math.round(db.verno * 10));
                if (!req)
                    throw new exceptions.MissingAPI("IndexedDB API not available"); // May happen in Safari private mode, see https://github.com/dfahlander/Dexie.js/issues/134
                req.onerror = eventRejectHandler(reject);
                req.onblocked = wrap(fireOnBlocked);
                req.onupgradeneeded = wrap(function (e) {
                    upgradeTransaction = req.transaction;
                    if (autoSchema && !db._allowEmptyDB) {
                        // Caller did not specify a version or schema. Doing that is only acceptable for opening alread existing databases.
                        // If onupgradeneeded is called it means database did not exist. Reject the open() promise and make sure that we
                        // do not create a new database by accident here.
                        req.onerror = preventDefault; // Prohibit onabort error from firing before we're done!
                        upgradeTransaction.abort(); // Abort transaction (would hope that this would make DB disappear but it doesnt.)
                        // Close database and delete it.
                        req.result.close();
                        var delreq = indexedDB.deleteDatabase(dbName); // The upgrade transaction is atomic, and javascript is single threaded - meaning that there is no risk that we delete someone elses database here!
                        delreq.onsuccess = delreq.onerror = wrap(function () {
                            reject(new exceptions.NoSuchDatabase("Database " + dbName + " doesnt exist"));
                        });
                    }
                    else {
                        upgradeTransaction.onerror = eventRejectHandler(reject);
                        var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion; // Safari 8 fix.
                        runUpgraders(oldVer / 10, upgradeTransaction, reject, req);
                    }
                }, reject);
                req.onsuccess = wrap(function () {
                    // Core opening procedure complete. Now let's just record some stuff.
                    upgradeTransaction = null;
                    idbdb = req.result;
                    connections.push(db); // Used for emulating versionchange event on IE/Edge/Safari.
                    if (autoSchema)
                        readGlobalSchema();
                    else if (idbdb.objectStoreNames.length > 0) {
                        try {
                            adjustToExistingIndexNames(globalSchema, idbdb.transaction(safariMultiStoreFix(idbdb.objectStoreNames), READONLY));
                        }
                        catch (e) {
                            // Safari may bail out if > 1 store names. However, this shouldnt be a showstopper. Issue #120.
                        }
                    }
                    idbdb.onversionchange = wrap(function (ev) {
                        db._vcFired = true; // detect implementations that not support versionchange (IE/Edge/Safari)
                        db.on("versionchange").fire(ev);
                    });
                    if (!hasNativeGetDatabaseNames && dbName !== '__dbnames') {
                        dbNamesDB.dbnames.put({ name: dbName }).catch(nop);
                    }
                    resolve();
                }, reject);
            })]).then(function () {
            // Before finally resolving the dbReadyPromise and this promise,
            // call and await all on('ready') subscribers:
            // Dexie.vip() makes subscribers able to use the database while being opened.
            // This is a must since these subscribers take part of the opening procedure.
            onReadyBeingFired = [];
            return Promise.resolve(Dexie.vip(db.on.ready.fire)).then(function fireRemainders() {
                if (onReadyBeingFired.length > 0) {
                    // In case additional subscribers to db.on('ready') were added during the time db.on.ready.fire was executed.
                    var remainders = onReadyBeingFired.reduce(promisableChain, nop);
                    onReadyBeingFired = [];
                    return Promise.resolve(Dexie.vip(remainders)).then(fireRemainders);
                }
            });
        }).finally(function () {
            onReadyBeingFired = null;
        }).then(function () {
            // Resolve the db.open() with the db instance.
            isBeingOpened = false;
            return db;
        }).catch(function (err) {
            try {
                // Did we fail within onupgradeneeded? Make sure to abort the upgrade transaction so it doesnt commit.
                upgradeTransaction && upgradeTransaction.abort();
            }
            catch (e) { }
            isBeingOpened = false; // Set before calling db.close() so that it doesnt reject openCanceller again (leads to unhandled rejection event).
            db.close(); // Closes and resets idbdb, removes connections, resets dbReadyPromise and openCanceller so that a later db.open() is fresh.
            // A call to db.close() may have made on-ready subscribers fail. Use dbOpenError if set, since err could be a follow-up error on that.
            dbOpenError = err; // Record the error. It will be used to reject further promises of db operations.
            return rejection(dbOpenError);
        }).finally(function () {
            openComplete = true;
            resolveDbReady(); // dbReadyPromise is resolved no matter if open() rejects or resolved. It's just to wake up waiters.
        });
    };
    this.close = function () {
        var idx = connections.indexOf(db);
        if (idx >= 0)
            connections.splice(idx, 1);
        if (idbdb) {
            try {
                idbdb.close();
            }
            catch (e) { }
            idbdb = null;
        }
        autoOpen = false;
        dbOpenError = new exceptions.DatabaseClosed();
        if (isBeingOpened)
            cancelOpen(dbOpenError);
        // Reset dbReadyPromise promise:
        dbReadyPromise = new Promise(function (resolve) {
            dbReadyResolve = resolve;
        });
        openCanceller = new Promise(function (_, reject) {
            cancelOpen = reject;
        });
    };
    this.delete = function () {
        var hasArguments = arguments.length > 0;
        return new Promise(function (resolve, reject) {
            if (hasArguments)
                throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
            if (isBeingOpened) {
                dbReadyPromise.then(doDelete);
            }
            else {
                doDelete();
            }
            function doDelete() {
                db.close();
                var req = indexedDB.deleteDatabase(dbName);
                req.onsuccess = wrap(function () {
                    if (!hasNativeGetDatabaseNames) {
                        dbNamesDB.dbnames.delete(dbName).catch(nop);
                    }
                    resolve();
                });
                req.onerror = eventRejectHandler(reject);
                req.onblocked = fireOnBlocked;
            }
        });
    };
    this.backendDB = function () {
        return idbdb;
    };
    this.isOpen = function () {
        return idbdb !== null;
    };
    this.hasBeenClosed = function () {
        return dbOpenError && (dbOpenError instanceof exceptions.DatabaseClosed);
    };
    this.hasFailed = function () {
        return dbOpenError !== null;
    };
    this.dynamicallyOpened = function () {
        return autoSchema;
    };
    //
    // Properties
    //
    this.name = dbName;
    // db.tables - an array of all Table instances.
    props(this, {
        tables: {
            get: function () {
                /// <returns type="Array" elementType="Table" />
                return keys(allTables).map(function (name) { return allTables[name]; });
            }
        }
    });
    //
    // Events
    //
    this.on = Events(this, "populate", "blocked", "versionchange", { ready: [promisableChain, nop] });
    this.on.ready.subscribe = override(this.on.ready.subscribe, function (subscribe) {
        return function (subscriber, bSticky) {
            Dexie.vip(function () {
                if (openComplete) {
                    // Database already open. Call subscriber asap.
                    if (!dbOpenError)
                        Promise.resolve().then(subscriber);
                    // bSticky: Also subscribe to future open sucesses (after close / reopen) 
                    if (bSticky)
                        subscribe(subscriber);
                }
                else if (onReadyBeingFired) {
                    // db.on('ready') subscribers are currently being executed and have not yet resolved or rejected
                    onReadyBeingFired.push(subscriber);
                    if (bSticky)
                        subscribe(subscriber);
                }
                else {
                    // Database not yet open. Subscribe to it.
                    subscribe(subscriber);
                    // If bSticky is falsy, make sure to unsubscribe subscriber when fired once.
                    if (!bSticky)
                        subscribe(function unsubscribe() {
                            db.on.ready.unsubscribe(subscriber);
                            db.on.ready.unsubscribe(unsubscribe);
                        });
                }
            });
        };
    });
    this.transaction = function () {
        /// <summary>
        ///
        /// </summary>
        /// <param name="mode" type="String">"r" for readonly, or "rw" for readwrite</param>
        /// <param name="tableInstances">Table instance, Array of Table instances, String or String Array of object stores to include in the transaction</param>
        /// <param name="scopeFunc" type="Function">Function to execute with transaction</param>
        var args = extractTransactionArgs.apply(this, arguments);
        return this._transaction.apply(this, args);
    };
    function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
        // Let table arguments be all arguments between mode and last argument.
        var i = arguments.length;
        if (i < 2)
            throw new exceptions.InvalidArgument("Too few arguments");
        // Prevent optimzation killer (https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments)
        // and clone arguments except the first one into local var 'args'.
        var args = new Array(i - 1);
        while (--i)
            args[i - 1] = arguments[i];
        // Let scopeFunc be the last argument and pop it so that args now only contain the table arguments.
        scopeFunc = args.pop();
        var tables = flatten(args); // Support using array as middle argument, or a mix of arrays and non-arrays.
        return [mode, tables, scopeFunc];
    }
    this._transaction = function (mode, tables, scopeFunc) {
        var parentTransaction = PSD.trans;
        // Check if parent transactions is bound to this db instance, and if caller wants to reuse it
        if (!parentTransaction || parentTransaction.db !== db || mode.indexOf('!') !== -1)
            parentTransaction = null;
        var onlyIfCompatible = mode.indexOf('?') !== -1;
        mode = mode.replace('!', '').replace('?', ''); // Ok. Will change arguments[0] as well but we wont touch arguments henceforth.
        try {
            //
            // Get storeNames from arguments. Either through given table instances, or through given table names.
            //
            var storeNames = tables.map(function (table) {
                var storeName = table instanceof Table ? table.name : table;
                if (typeof storeName !== 'string')
                    throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                return storeName;
            });
            //
            // Resolve mode. Allow shortcuts "r" and "rw".
            //
            if (mode == "r" || mode == READONLY)
                mode = READONLY;
            else if (mode == "rw" || mode == READWRITE)
                mode = READWRITE;
            else
                throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
            if (parentTransaction) {
                // Basic checks
                if (parentTransaction.mode === READONLY && mode === READWRITE) {
                    if (onlyIfCompatible) {
                        // Spawn new transaction instead.
                        parentTransaction = null;
                    }
                    else
                        throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                }
                if (parentTransaction) {
                    storeNames.forEach(function (storeName) {
                        if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                            if (onlyIfCompatible) {
                                // Spawn new transaction instead.
                                parentTransaction = null;
                            }
                            else
                                throw new exceptions.SubTransaction("Table " + storeName +
                                    " not included in parent transaction.");
                        }
                    });
                }
                if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                    // '?' mode should not keep using an inactive transaction.
                    parentTransaction = null;
                }
            }
        }
        catch (e) {
            return parentTransaction ?
                parentTransaction._promise(null, function (_, reject) { reject(e); }) :
                rejection(e);
        }
        // If this is a sub-transaction, lock the parent and then launch the sub-transaction.
        return (parentTransaction ?
            parentTransaction._promise(mode, enterTransactionScope, "lock") :
            PSD.trans ?
                // no parent transaction despite PSD.trans exists. Make sure also
                // that the zone we create is not a sub-zone of current, because
                // Promise.follow() should not wait for it if so.
                usePSD(PSD.transless, function () { return db._whenReady(enterTransactionScope); }) :
                db._whenReady(enterTransactionScope));
        function enterTransactionScope() {
            return Promise.resolve().then(function () {
                // Keep a pointer to last non-transactional PSD to use if someone calls Dexie.ignoreTransaction().
                var transless = PSD.transless || PSD;
                // Our transaction.
                //return new Promise((resolve, reject) => {
                var trans = db._createTransaction(mode, storeNames, globalSchema, parentTransaction);
                // Let the transaction instance be part of a Promise-specific data (PSD) value.
                var zoneProps = {
                    trans: trans,
                    transless: transless
                };
                if (parentTransaction) {
                    // Emulate transaction commit awareness for inner transaction (must 'commit' when the inner transaction has no more operations ongoing)
                    trans.idbtrans = parentTransaction.idbtrans;
                }
                else {
                    trans.create(); // Create the backend transaction so that complete() or error() will trigger even if no operation is made upon it.
                }
                // Support for native async await.
                if (scopeFunc.constructor === AsyncFunction) {
                    incrementExpectedAwaits();
                }
                var returnValue;
                var promiseFollowed = Promise.follow(function () {
                    // Finally, call the scope function with our table and transaction arguments.
                    returnValue = scopeFunc.call(trans, trans);
                    if (returnValue) {
                        if (returnValue.constructor === NativePromise) {
                            var decrementor = decrementExpectedAwaits.bind(null, null);
                            returnValue.then(decrementor, decrementor);
                        }
                        else if (typeof returnValue.next === 'function' && typeof returnValue.throw === 'function') {
                            // scopeFunc returned an iterator with throw-support. Handle yield as await.
                            returnValue = awaitIterator(returnValue);
                        }
                    }
                }, zoneProps);
                return (returnValue && typeof returnValue.then === 'function' ?
                    // Promise returned. User uses promise-style transactions.
                    Promise.resolve(returnValue).then(function (x) { return trans.active ?
                        x // Transaction still active. Continue.
                        : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")); })
                    // No promise returned. Wait for all outstanding promises before continuing. 
                    : promiseFollowed.then(function () { return returnValue; })).then(function (x) {
                    // sub transactions don't react to idbtrans.oncomplete. We must trigger a completion:
                    if (parentTransaction)
                        trans._resolve();
                    // wait for trans._completion
                    // (if root transaction, this means 'complete' event. If sub-transaction, we've just fired it ourselves)
                    return trans._completion.then(function () { return x; });
                }).catch(function (e) {
                    trans._reject(e); // Yes, above then-handler were maybe not called because of an unhandled rejection in scopeFunc!
                    return rejection(e);
                });
            });
        }
    };
    this.table = function (tableName) {
        /// <returns type="Table"></returns>
        if (!hasOwn(allTables, tableName)) {
            throw new exceptions.InvalidTable("Table " + tableName + " does not exist");
        }
        return allTables[tableName];
    };
    //
    //
    //
    // Table Class
    //
    //
    //
    function Table(name, tableSchema, optionalTrans) {
        /// <param name="name" type="String"></param>
        this.name = name;
        this.schema = tableSchema;
        this._tx = optionalTrans;
        this.hook = allTables[name] ? allTables[name].hook : Events(null, {
            "creating": [hookCreatingChain, nop],
            "reading": [pureFunctionChain, mirror],
            "updating": [hookUpdatingChain, nop],
            "deleting": [hookDeletingChain, nop]
        });
    }
    function BulkErrorHandlerCatchAll(errorList, done, supportHooks) {
        return (supportHooks ? hookedEventRejectHandler : eventRejectHandler)(function (e) {
            errorList.push(e);
            done && done();
        });
    }
    function bulkDelete(idbstore, trans, keysOrTuples, hasDeleteHook, deletingHook) {
        // If hasDeleteHook, keysOrTuples must be an array of tuples: [[key1, value2],[key2,value2],...],
        // else keysOrTuples must be just an array of keys: [key1, key2, ...].
        return new Promise(function (resolve, reject) {
            var len = keysOrTuples.length, lastItem = len - 1;
            if (len === 0)
                return resolve();
            if (!hasDeleteHook) {
                for (var i = 0; i < len; ++i) {
                    var req = idbstore.delete(keysOrTuples[i]);
                    req.onerror = eventRejectHandler(reject);
                    if (i === lastItem)
                        req.onsuccess = wrap(function () { return resolve(); });
                }
            }
            else {
                var hookCtx, errorHandler = hookedEventRejectHandler(reject), successHandler = hookedEventSuccessHandler(null);
                tryCatch(function () {
                    for (var i = 0; i < len; ++i) {
                        hookCtx = { onsuccess: null, onerror: null };
                        var tuple = keysOrTuples[i];
                        deletingHook.call(hookCtx, tuple[0], tuple[1], trans);
                        var req = idbstore.delete(tuple[0]);
                        req._hookCtx = hookCtx;
                        req.onerror = errorHandler;
                        if (i === lastItem)
                            req.onsuccess = hookedEventSuccessHandler(resolve);
                        else
                            req.onsuccess = successHandler;
                    }
                }, function (err) {
                    hookCtx.onerror && hookCtx.onerror(err);
                    throw err;
                });
            }
        });
    }
    props(Table.prototype, {
        //
        // Table Protected Methods
        //
        _trans: function getTransaction(mode, fn, writeLocked) {
            var trans = this._tx || PSD.trans;
            return trans && trans.db === db ?
                trans === PSD.trans ?
                    trans._promise(mode, fn, writeLocked) :
                    newScope(function () { return trans._promise(mode, fn, writeLocked); }, { trans: trans, transless: PSD.transless || PSD }) :
                tempTransaction(mode, [this.name], fn);
        },
        _idbstore: function getIDBObjectStore(mode, fn, writeLocked) {
            var tableName = this.name;
            function supplyIdbStore(resolve, reject, trans) {
                if (trans.storeNames.indexOf(tableName) === -1)
                    throw new exceptions.NotFound("Table" + tableName + " not part of transaction");
                return fn(resolve, reject, trans.idbtrans.objectStore(tableName), trans);
            }
            return this._trans(mode, supplyIdbStore, writeLocked);
        },
        //
        // Table Public Methods
        //
        get: function (keyOrCrit, cb) {
            if (keyOrCrit && keyOrCrit.constructor === Object)
                return this.where(keyOrCrit).first(cb);
            var self = this;
            return this._idbstore(READONLY, function (resolve, reject, idbstore) {
                var req = idbstore.get(keyOrCrit);
                req.onerror = eventRejectHandler(reject);
                req.onsuccess = wrap(function () {
                    resolve(self.hook.reading.fire(req.result));
                }, reject);
            }).then(cb);
        },
        where: function (indexOrCrit) {
            if (typeof indexOrCrit === 'string')
                return new WhereClause(this, indexOrCrit);
            if (isArray(indexOrCrit))
                return new WhereClause(this, "[" + indexOrCrit.join('+') + "]");
            // indexOrCrit is an object map of {[keyPath]:value} 
            var keyPaths = keys(indexOrCrit);
            if (keyPaths.length === 1)
                // Only one critera. This was the easy case:
                return this
                    .where(keyPaths[0])
                    .equals(indexOrCrit[keyPaths[0]]);
            // Multiple criterias.
            // Let's try finding a compound index that matches all keyPaths in
            // arbritary order:
            var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function (ix) {
                return ix.compound &&
                    keyPaths.every(function (keyPath) { return ix.keyPath.indexOf(keyPath) >= 0; }) &&
                    ix.keyPath.every(function (keyPath) { return keyPaths.indexOf(keyPath) >= 0; });
            })[0];
            if (compoundIndex && maxKey !== maxString)
                // Cool! We found such compound index
                // and this browser supports compound indexes (maxKey !== maxString)!
                return this
                    .where(compoundIndex.name)
                    .equals(compoundIndex.keyPath.map(function (kp) { return indexOrCrit[kp]; }));
            if (!compoundIndex)
                console.warn("The query " + JSON.stringify(indexOrCrit) + " on " + this.name + " would benefit of a " +
                    ("compound index [" + keyPaths.join('+') + "]"));
            // Ok, now let's fallback to finding at least one matching index
            // and filter the rest.
            var idxByName = this.schema.idxByName;
            var simpleIndex = keyPaths.reduce(function (r, keyPath) { return [
                r[0] || idxByName[keyPath],
                r[0] || !idxByName[keyPath] ?
                    combine(r[1], function (x) { return '' + getByKeyPath(x, keyPath) ==
                        '' + indexOrCrit[keyPath]; })
                    : r[1]
            ]; }, [null, null]);
            var idx = simpleIndex[0];
            return idx ?
                this.where(idx.name).equals(indexOrCrit[idx.keyPath])
                    .filter(simpleIndex[1]) :
                compoundIndex ?
                    this.filter(simpleIndex[1]) : // Has compound but browser bad. Allow filter.
                    this.where(keyPaths).equals(''); // No index at all. Fail lazily.
        },
        count: function (cb) {
            return this.toCollection().count(cb);
        },
        offset: function (offset) {
            return this.toCollection().offset(offset);
        },
        limit: function (numRows) {
            return this.toCollection().limit(numRows);
        },
        reverse: function () {
            return this.toCollection().reverse();
        },
        filter: function (filterFunction) {
            return this.toCollection().and(filterFunction);
        },
        each: function (fn) {
            return this.toCollection().each(fn);
        },
        toArray: function (cb) {
            return this.toCollection().toArray(cb);
        },
        orderBy: function (index) {
            return new Collection(new WhereClause(this, isArray(index) ?
                "[" + index.join('+') + "]" :
                index));
        },
        toCollection: function () {
            return new Collection(new WhereClause(this));
        },
        mapToClass: function (constructor, structure) {
            /// <summary>
            ///     Map table to a javascript constructor function. Objects returned from the database will be instances of this class, making
            ///     it possible to the instanceOf operator as well as extending the class using constructor.prototype.method = function(){...}.
            /// </summary>
            /// <param name="constructor">Constructor function representing the class.</param>
            /// <param name="structure" optional="true">Helps IDE code completion by knowing the members that objects contain and not just the indexes. Also
            /// know what type each member has. Example: {name: String, emailAddresses: [String], password}</param>
            this.schema.mappedClass = constructor;
            var instanceTemplate = Object.create(constructor.prototype);
            if (structure) {
                // structure and instanceTemplate is for IDE code competion only while constructor.prototype is for actual inheritance.
                applyStructure(instanceTemplate, structure);
            }
            this.schema.instanceTemplate = instanceTemplate;
            // Now, subscribe to the when("reading") event to make all objects that come out from this table inherit from given class
            // no matter which method to use for reading (Table.get() or Table.where(...)... )
            var readHook = function (obj) {
                if (!obj)
                    return obj; // No valid object. (Value is null). Return as is.
                // Create a new object that derives from constructor:
                var res = Object.create(constructor.prototype);
                // Clone members:
                for (var m in obj)
                    if (hasOwn(obj, m))
                        try {
                            res[m] = obj[m];
                        }
                        catch (_) { }
                return res;
            };
            if (this.schema.readHook) {
                this.hook.reading.unsubscribe(this.schema.readHook);
            }
            this.schema.readHook = readHook;
            this.hook("reading", readHook);
            return constructor;
        },
        defineClass: function (structure) {
            /// <summary>
            ///     Define all members of the class that represents the table. This will help code completion of when objects are read from the database
            ///     as well as making it possible to extend the prototype of the returned constructor function.
            /// </summary>
            /// <param name="structure">Helps IDE code completion by knowing the members that objects contain and not just the indexes. Also
            /// know what type each member has. Example: {name: String, emailAddresses: [String], properties: {shoeSize: Number}}</param>
            return this.mapToClass(Dexie.defineClass(structure), structure);
        },
        bulkDelete: function (keys$$1) {
            if (this.hook.deleting.fire === nop) {
                return this._idbstore(READWRITE, function (resolve, reject, idbstore, trans) {
                    resolve(bulkDelete(idbstore, trans, keys$$1, false, nop));
                });
            }
            else {
                return this
                    .where(':id')
                    .anyOf(keys$$1)
                    .delete()
                    .then(function () { }); // Resolve with undefined.
            }
        },
        bulkPut: function (objects, keys$$1) {
            var _this = this;
            return this._idbstore(READWRITE, function (resolve, reject, idbstore) {
                if (!idbstore.keyPath && !_this.schema.primKey.auto && !keys$$1)
                    throw new exceptions.InvalidArgument("bulkPut() with non-inbound keys requires keys array in second argument");
                if (idbstore.keyPath && keys$$1)
                    throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
                if (keys$$1 && keys$$1.length !== objects.length)
                    throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
                if (objects.length === 0)
                    return resolve(); // Caller provided empty list.
                var done = function (result) {
                    if (errorList.length === 0)
                        resolve(result);
                    else
                        reject(new BulkError(_this.name + ".bulkPut(): " + errorList.length + " of " + numObjs + " operations failed", errorList));
                };
                var req, errorList = [], errorHandler, numObjs = objects.length, table = _this;
                if (_this.hook.creating.fire === nop && _this.hook.updating.fire === nop) {
                    //
                    // Standard Bulk (no 'creating' or 'updating' hooks to care about)
                    //
                    errorHandler = BulkErrorHandlerCatchAll(errorList);
                    for (var i = 0, l = objects.length; i < l; ++i) {
                        req = keys$$1 ? idbstore.put(objects[i], keys$$1[i]) : idbstore.put(objects[i]);
                        req.onerror = errorHandler;
                    }
                    // Only need to catch success or error on the last operation
                    // according to the IDB spec.
                    req.onerror = BulkErrorHandlerCatchAll(errorList, done);
                    req.onsuccess = eventSuccessHandler(done);
                }
                else {
                    var effectiveKeys = keys$$1 || idbstore.keyPath && objects.map(function (o) { return getByKeyPath(o, idbstore.keyPath); });
                    // Generate map of {[key]: object}
                    var objectLookup = effectiveKeys && arrayToObject(effectiveKeys, function (key, i) { return key != null && [key, objects[i]]; });
                    var promise = !effectiveKeys ?
                        // Auto-incremented key-less objects only without any keys argument.
                        table.bulkAdd(objects) :
                        // Keys provided. Either as inbound in provided objects, or as a keys argument.
                        // Begin with updating those that exists in DB:
                        table.where(':id').anyOf(effectiveKeys.filter(function (key) { return key != null; })).modify(function () {
                            this.value = objectLookup[this.primKey];
                            objectLookup[this.primKey] = null; // Mark as "don't add this"
                        }).catch(ModifyError, function (e) {
                            errorList = e.failures; // No need to concat here. These are the first errors added.
                        }).then(function () {
                            // Now, let's examine which items didnt exist so we can add them:
                            var objsToAdd = [], keysToAdd = keys$$1 && [];
                            // Iterate backwards. Why? Because if same key was used twice, just add the last one.
                            for (var i = effectiveKeys.length - 1; i >= 0; --i) {
                                var key = effectiveKeys[i];
                                if (key == null || objectLookup[key]) {
                                    objsToAdd.push(objects[i]);
                                    keys$$1 && keysToAdd.push(key);
                                    if (key != null)
                                        objectLookup[key] = null; // Mark as "dont add again"
                                }
                            }
                            // The items are in reverse order so reverse them before adding.
                            // Could be important in order to get auto-incremented keys the way the caller
                            // would expect. Could have used unshift instead of push()/reverse(),
                            // but: http://jsperf.com/unshift-vs-reverse
                            objsToAdd.reverse();
                            keys$$1 && keysToAdd.reverse();
                            return table.bulkAdd(objsToAdd, keysToAdd);
                        }).then(function (lastAddedKey) {
                            // Resolve with key of the last object in given arguments to bulkPut():
                            var lastEffectiveKey = effectiveKeys[effectiveKeys.length - 1]; // Key was provided.
                            return lastEffectiveKey != null ? lastEffectiveKey : lastAddedKey;
                        });
                    promise.then(done).catch(BulkError, function (e) {
                        // Concat failure from ModifyError and reject using our 'done' method.
                        errorList = errorList.concat(e.failures);
                        done();
                    }).catch(reject);
                }
            }, "locked"); // If called from transaction scope, lock transaction til all steps are done.
        },
        bulkAdd: function (objects, keys$$1) {
            var self = this, creatingHook = this.hook.creating.fire;
            return this._idbstore(READWRITE, function (resolve, reject, idbstore, trans) {
                if (!idbstore.keyPath && !self.schema.primKey.auto && !keys$$1)
                    throw new exceptions.InvalidArgument("bulkAdd() with non-inbound keys requires keys array in second argument");
                if (idbstore.keyPath && keys$$1)
                    throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
                if (keys$$1 && keys$$1.length !== objects.length)
                    throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
                if (objects.length === 0)
                    return resolve(); // Caller provided empty list.
                function done(result) {
                    if (errorList.length === 0)
                        resolve(result);
                    else
                        reject(new BulkError(self.name + ".bulkAdd(): " + errorList.length + " of " + numObjs + " operations failed", errorList));
                }
                var req, errorList = [], errorHandler, successHandler, numObjs = objects.length;
                if (creatingHook !== nop) {
                    //
                    // There are subscribers to hook('creating')
                    // Must behave as documented.
                    //
                    var keyPath = idbstore.keyPath, hookCtx;
                    errorHandler = BulkErrorHandlerCatchAll(errorList, null, true);
                    successHandler = hookedEventSuccessHandler(null);
                    tryCatch(function () {
                        for (var i = 0, l = objects.length; i < l; ++i) {
                            hookCtx = { onerror: null, onsuccess: null };
                            var key = keys$$1 && keys$$1[i];
                            var obj = objects[i], effectiveKey = keys$$1 ? key : keyPath ? getByKeyPath(obj, keyPath) : undefined, keyToUse = creatingHook.call(hookCtx, effectiveKey, obj, trans);
                            if (effectiveKey == null && keyToUse != null) {
                                if (keyPath) {
                                    obj = deepClone(obj);
                                    setByKeyPath(obj, keyPath, keyToUse);
                                }
                                else {
                                    key = keyToUse;
                                }
                            }
                            req = key != null ? idbstore.add(obj, key) : idbstore.add(obj);
                            req._hookCtx = hookCtx;
                            if (i < l - 1) {
                                req.onerror = errorHandler;
                                if (hookCtx.onsuccess)
                                    req.onsuccess = successHandler;
                            }
                        }
                    }, function (err) {
                        hookCtx.onerror && hookCtx.onerror(err);
                        throw err;
                    });
                    req.onerror = BulkErrorHandlerCatchAll(errorList, done, true);
                    req.onsuccess = hookedEventSuccessHandler(done);
                }
                else {
                    //
                    // Standard Bulk (no 'creating' hook to care about)
                    //
                    errorHandler = BulkErrorHandlerCatchAll(errorList);
                    for (var i = 0, l = objects.length; i < l; ++i) {
                        req = keys$$1 ? idbstore.add(objects[i], keys$$1[i]) : idbstore.add(objects[i]);
                        req.onerror = errorHandler;
                    }
                    // Only need to catch success or error on the last operation
                    // according to the IDB spec.
                    req.onerror = BulkErrorHandlerCatchAll(errorList, done);
                    req.onsuccess = eventSuccessHandler(done);
                }
            });
        },
        add: function (obj, key) {
            /// <summary>
            ///   Add an object to the database. In case an object with same primary key already exists, the object will not be added.
            /// </summary>
            /// <param name="obj" type="Object">A javascript object to insert</param>
            /// <param name="key" optional="true">Primary key</param>
            var creatingHook = this.hook.creating.fire;
            return this._idbstore(READWRITE, function (resolve, reject, idbstore, trans) {
                var hookCtx = { onsuccess: null, onerror: null };
                if (creatingHook !== nop) {
                    var effectiveKey = (key != null) ? key : (idbstore.keyPath ? getByKeyPath(obj, idbstore.keyPath) : undefined);
                    var keyToUse = creatingHook.call(hookCtx, effectiveKey, obj, trans); // Allow subscribers to when("creating") to generate the key.
                    if (effectiveKey == null && keyToUse != null) {
                        if (idbstore.keyPath)
                            setByKeyPath(obj, idbstore.keyPath, keyToUse);
                        else
                            key = keyToUse;
                    }
                }
                try {
                    var req = key != null ? idbstore.add(obj, key) : idbstore.add(obj);
                    req._hookCtx = hookCtx;
                    req.onerror = hookedEventRejectHandler(reject);
                    req.onsuccess = hookedEventSuccessHandler(function (result) {
                        // TODO: Remove these two lines in next major release (2.0?)
                        // It's no good practice to have side effects on provided parameters
                        var keyPath = idbstore.keyPath;
                        if (keyPath)
                            setByKeyPath(obj, keyPath, result);
                        resolve(result);
                    });
                }
                catch (e) {
                    if (hookCtx.onerror)
                        hookCtx.onerror(e);
                    throw e;
                }
            });
        },
        put: function (obj, key) {
            var _this = this;
            /// <summary>
            ///   Add an object to the database but in case an object with same primary key alread exists, the existing one will get updated.
            /// </summary>
            /// <param name="obj" type="Object">A javascript object to insert or update</param>
            /// <param name="key" optional="true">Primary key</param>
            var creatingHook = this.hook.creating.fire, updatingHook = this.hook.updating.fire;
            if (creatingHook !== nop || updatingHook !== nop) {
                //
                // People listens to when("creating") or when("updating") events!
                // We must know whether the put operation results in an CREATE or UPDATE.
                //
                var keyPath = this.schema.primKey.keyPath;
                var effectiveKey = (key !== undefined) ? key : (keyPath && getByKeyPath(obj, keyPath));
                if (effectiveKey == null)
                    return this.add(obj);
                // Since key is optional, make sure we get it from obj if not provided
                // Primary key exist. Lock transaction and try modifying existing. If nothing modified, call add().
                // clone obj before this async call. If caller modifies obj the line after put(), the IDB spec requires that it should not affect operation.
                obj = deepClone(obj);
                return this._trans(READWRITE, function () {
                    return _this.where(":id").equals(effectiveKey).modify(function () {
                        // Replace extisting value with our object
                        // CRUD event firing handled in Collection.modify()
                        this.value = obj;
                    }).then(function (count) { return count === 0 ? _this.add(obj, key) : effectiveKey; });
                }, "locked"); // Lock needed because operation is splitted into modify() and add().
            }
            else {
                // Use the standard IDB put() method.
                return this._idbstore(READWRITE, function (resolve, reject, idbstore) {
                    var req = key !== undefined ? idbstore.put(obj, key) : idbstore.put(obj);
                    req.onerror = eventRejectHandler(reject);
                    req.onsuccess = wrap(function (ev) {
                        var keyPath = idbstore.keyPath;
                        if (keyPath)
                            setByKeyPath(obj, keyPath, ev.target.result);
                        resolve(req.result);
                    });
                });
            }
        },
        'delete': function (key) {
            /// <param name="key">Primary key of the object to delete</param>
            if (this.hook.deleting.subscribers.length) {
                // People listens to when("deleting") event. Must implement delete using Collection.delete() that will
                // call the CRUD event. Only Collection.delete() will know whether an object was actually deleted.
                return this.where(":id").equals(key).delete();
            }
            else {
                // No one listens. Use standard IDB delete() method.
                return this._idbstore(READWRITE, function (resolve, reject, idbstore) {
                    var req = idbstore.delete(key);
                    req.onerror = eventRejectHandler(reject);
                    req.onsuccess = wrap(function () {
                        resolve(req.result);
                    });
                });
            }
        },
        clear: function () {
            if (this.hook.deleting.subscribers.length) {
                // People listens to when("deleting") event. Must implement delete using Collection.delete() that will
                // call the CRUD event. Only Collection.delete() will knows which objects that are actually deleted.
                return this.toCollection().delete();
            }
            else {
                return this._idbstore(READWRITE, function (resolve, reject, idbstore) {
                    var req = idbstore.clear();
                    req.onerror = eventRejectHandler(reject);
                    req.onsuccess = wrap(function () {
                        resolve(req.result);
                    });
                });
            }
        },
        update: function (keyOrObject, modifications) {
            if (typeof modifications !== 'object' || isArray(modifications))
                throw new exceptions.InvalidArgument("Modifications must be an object.");
            if (typeof keyOrObject === 'object' && !isArray(keyOrObject)) {
                // object to modify. Also modify given object with the modifications:
                keys(modifications).forEach(function (keyPath) {
                    setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
                });
                var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
                if (key === undefined)
                    return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
                return this.where(":id").equals(key).modify(modifications);
            }
            else {
                // key to modify
                return this.where(":id").equals(keyOrObject).modify(modifications);
            }
        }
    });
    //
    //
    //
    // Transaction Class
    //
    //
    //
    function Transaction(mode, storeNames, dbschema, parent) {
        var _this = this;
        /// <summary>
        ///    Transaction class. Represents a database transaction. All operations on db goes through a Transaction.
        /// </summary>
        /// <param name="mode" type="String">Any of "readwrite" or "readonly"</param>
        /// <param name="storeNames" type="Array">Array of table names to operate on</param>
        this.db = db;
        this.mode = mode;
        this.storeNames = storeNames;
        this.idbtrans = null;
        this.on = Events(this, "complete", "error", "abort");
        this.parent = parent || null;
        this.active = true;
        this._reculock = 0;
        this._blockedFuncs = [];
        this._resolve = null;
        this._reject = null;
        this._waitingFor = null;
        this._waitingQueue = null;
        this._spinCount = 0; // Just for debugging waitFor()
        this._completion = new Promise(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
        this._completion.then(function () {
            _this.active = false;
            _this.on.complete.fire();
        }, function (e) {
            var wasActive = _this.active;
            _this.active = false;
            _this.on.error.fire(e);
            _this.parent ?
                _this.parent._reject(e) :
                wasActive && _this.idbtrans && _this.idbtrans.abort();
            return rejection(e); // Indicate we actually DO NOT catch this error.
        });
    }
    props(Transaction.prototype, {
        //
        // Transaction Protected Methods (not required by API users, but needed internally and eventually by dexie extensions)
        //
        _lock: function () {
            assert(!PSD.global); // Locking and unlocking reuires to be within a PSD scope.
            // Temporary set all requests into a pending queue if they are called before database is ready.
            ++this._reculock; // Recursive read/write lock pattern using PSD (Promise Specific Data) instead of TLS (Thread Local Storage)
            if (this._reculock === 1 && !PSD.global)
                PSD.lockOwnerFor = this;
            return this;
        },
        _unlock: function () {
            assert(!PSD.global); // Locking and unlocking reuires to be within a PSD scope.
            if (--this._reculock === 0) {
                if (!PSD.global)
                    PSD.lockOwnerFor = null;
                while (this._blockedFuncs.length > 0 && !this._locked()) {
                    var fnAndPSD = this._blockedFuncs.shift();
                    try {
                        usePSD(fnAndPSD[1], fnAndPSD[0]);
                    }
                    catch (e) { }
                }
            }
            return this;
        },
        _locked: function () {
            // Checks if any write-lock is applied on this transaction.
            // To simplify the Dexie API for extension implementations, we support recursive locks.
            // This is accomplished by using "Promise Specific Data" (PSD).
            // PSD data is bound to a Promise and any child Promise emitted through then() or resolve( new Promise() ).
            // PSD is local to code executing on top of the call stacks of any of any code executed by Promise():
            //         * callback given to the Promise() constructor  (function (resolve, reject){...})
            //         * callbacks given to then()/catch()/finally() methods (function (value){...})
            // If creating a new independant Promise instance from within a Promise call stack, the new Promise will derive the PSD from the call stack of the parent Promise.
            // Derivation is done so that the inner PSD __proto__ points to the outer PSD.
            // PSD.lockOwnerFor will point to current transaction object if the currently executing PSD scope owns the lock.
            return this._reculock && PSD.lockOwnerFor !== this;
        },
        create: function (idbtrans) {
            var _this = this;
            if (!this.mode)
                return this;
            assert(!this.idbtrans);
            if (!idbtrans && !idbdb) {
                switch (dbOpenError && dbOpenError.name) {
                    case "DatabaseClosedError":
                        // Errors where it is no difference whether it was caused by the user operation or an earlier call to db.open()
                        throw new exceptions.DatabaseClosed(dbOpenError);
                    case "MissingAPIError":
                        // Errors where it is no difference whether it was caused by the user operation or an earlier call to db.open()
                        throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
                    default:
                        // Make it clear that the user operation was not what caused the error - the error had occurred earlier on db.open()!
                        throw new exceptions.OpenFailed(dbOpenError);
                }
            }
            if (!this.active)
                throw new exceptions.TransactionInactive();
            assert(this._completion._state === null);
            idbtrans = this.idbtrans = idbtrans || idbdb.transaction(safariMultiStoreFix(this.storeNames), this.mode);
            idbtrans.onerror = wrap(function (ev) {
                preventDefault(ev); // Prohibit default bubbling to window.error
                _this._reject(idbtrans.error);
            });
            idbtrans.onabort = wrap(function (ev) {
                preventDefault(ev);
                _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
                _this.active = false;
                _this.on("abort").fire(ev);
            });
            idbtrans.oncomplete = wrap(function () {
                _this.active = false;
                _this._resolve();
            });
            return this;
        },
        _promise: function (mode, fn, bWriteLock) {
            var _this = this;
            if (mode === READWRITE && this.mode !== READWRITE)
                return rejection(new exceptions.ReadOnly("Transaction is readonly"));
            if (!this.active)
                return rejection(new exceptions.TransactionInactive());
            if (this._locked()) {
                return new Promise(function (resolve, reject) {
                    _this._blockedFuncs.push([function () {
                            _this._promise(mode, fn, bWriteLock).then(resolve, reject);
                        }, PSD]);
                });
            }
            else if (bWriteLock) {
                return newScope(function () {
                    var p = new Promise(function (resolve, reject) {
                        _this._lock();
                        var rv = fn(resolve, reject, _this);
                        if (rv && rv.then)
                            rv.then(resolve, reject);
                    });
                    p.finally(function () { return _this._unlock(); });
                    p._lib = true;
                    return p;
                });
            }
            else {
                var p = new Promise(function (resolve, reject) {
                    var rv = fn(resolve, reject, _this);
                    if (rv && rv.then)
                        rv.then(resolve, reject);
                });
                p._lib = true;
                return p;
            }
        },
        _root: function () {
            return this.parent ? this.parent._root() : this;
        },
        waitFor: function (promise) {
            // Always operate on the root transaction (in case this is a sub stransaction)
            var root = this._root();
            // For stability reasons, convert parameter to promise no matter what type is passed to waitFor().
            // (We must be able to call .then() on it.)
            promise = Promise.resolve(promise);
            if (root._waitingFor) {
                // Already called waitFor(). Wait for both to complete.
                root._waitingFor = root._waitingFor.then(function () { return promise; });
            }
            else {
                // We're not in waiting state. Start waiting state.
                root._waitingFor = promise;
                root._waitingQueue = [];
                // Start interacting with indexedDB until promise completes:
                var store = root.idbtrans.objectStore(root.storeNames[0]);
                (function spin() {
                    ++root._spinCount; // For debugging only
                    while (root._waitingQueue.length)
                        (root._waitingQueue.shift())();
                    if (root._waitingFor)
                        store.get(-Infinity).onsuccess = spin;
                }());
            }
            var currentWaitPromise = root._waitingFor;
            return new Promise(function (resolve, reject) {
                promise.then(function (res) { return root._waitingQueue.push(wrap(resolve.bind(null, res))); }, function (err) { return root._waitingQueue.push(wrap(reject.bind(null, err))); }).finally(function () {
                    if (root._waitingFor === currentWaitPromise) {
                        // No one added a wait after us. Safe to stop the spinning.
                        root._waitingFor = null;
                    }
                });
            });
        },
        //
        // Transaction Public Properties and Methods
        //
        abort: function () {
            this.active && this._reject(new exceptions.Abort());
            this.active = false;
        },
        tables: {
            get: deprecated("Transaction.tables", function () { return allTables; })
        },
        table: function (name) {
            var table = db.table(name); // Don't check that table is part of transaction. It must fail lazily!
            return new Table(name, table.schema, this);
        }
    });
    //
    //
    //
    // WhereClause
    //
    //
    //
    function WhereClause(table, index, orCollection) {
        /// <param name="table" type="Table"></param>
        /// <param name="index" type="String" optional="true"></param>
        /// <param name="orCollection" type="Collection" optional="true"></param>
        this._ctx = {
            table: table,
            index: index === ":id" ? null : index,
            or: orCollection
        };
    }
    props(WhereClause.prototype, function () {
        // WhereClause private methods
        function fail(collectionOrWhereClause, err, T) {
            var collection = collectionOrWhereClause instanceof WhereClause ?
                new Collection(collectionOrWhereClause) :
                collectionOrWhereClause;
            collection._ctx.error = T ? new T(err) : new TypeError(err);
            return collection;
        }
        function emptyCollection(whereClause) {
            return new Collection(whereClause, function () { return IDBKeyRange.only(""); }).limit(0);
        }
        function upperFactory(dir) {
            return dir === "next" ? function (s) { return s.toUpperCase(); } : function (s) { return s.toLowerCase(); };
        }
        function lowerFactory(dir) {
            return dir === "next" ? function (s) { return s.toLowerCase(); } : function (s) { return s.toUpperCase(); };
        }
        function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp, dir) {
            var length = Math.min(key.length, lowerNeedle.length);
            var llp = -1;
            for (var i = 0; i < length; ++i) {
                var lwrKeyChar = lowerKey[i];
                if (lwrKeyChar !== lowerNeedle[i]) {
                    if (cmp(key[i], upperNeedle[i]) < 0)
                        return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
                    if (cmp(key[i], lowerNeedle[i]) < 0)
                        return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
                    if (llp >= 0)
                        return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
                    return null;
                }
                if (cmp(key[i], lwrKeyChar) < 0)
                    llp = i;
            }
            if (length < lowerNeedle.length && dir === "next")
                return key + upperNeedle.substr(key.length);
            if (length < key.length && dir === "prev")
                return key.substr(0, upperNeedle.length);
            return (llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1));
        }
        function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
            /// <param name="needles" type="Array" elementType="String"></param>
            var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
            if (!needles.every(function (s) { return typeof s === 'string'; })) {
                return fail(whereClause, STRING_EXPECTED);
            }
            function initDirection(dir) {
                upper = upperFactory(dir);
                lower = lowerFactory(dir);
                compare = (dir === "next" ? simpleCompare : simpleCompareReverse);
                var needleBounds = needles.map(function (needle) {
                    return { lower: lower(needle), upper: upper(needle) };
                }).sort(function (a, b) {
                    return compare(a.lower, b.lower);
                });
                upperNeedles = needleBounds.map(function (nb) { return nb.upper; });
                lowerNeedles = needleBounds.map(function (nb) { return nb.lower; });
                direction = dir;
                nextKeySuffix = (dir === "next" ? "" : suffix);
            }
            initDirection("next");
            var c = new Collection(whereClause, function () {
                return IDBKeyRange.bound(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix);
            });
            c._ondirectionchange = function (direction) {
                // This event onlys occur before filter is called the first time.
                initDirection(direction);
            };
            var firstPossibleNeedle = 0;
            c._addAlgorithm(function (cursor, advance, resolve) {
                /// <param name="cursor" type="IDBCursor"></param>
                /// <param name="advance" type="Function"></param>
                /// <param name="resolve" type="Function"></param>
                var key = cursor.key;
                if (typeof key !== 'string')
                    return false;
                var lowerKey = lower(key);
                if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
                    return true;
                }
                else {
                    var lowestPossibleCasing = null;
                    for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
                        var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
                        if (casing === null && lowestPossibleCasing === null)
                            firstPossibleNeedle = i + 1;
                        else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
                            lowestPossibleCasing = casing;
                        }
                    }
                    if (lowestPossibleCasing !== null) {
                        advance(function () { cursor.continue(lowestPossibleCasing + nextKeySuffix); });
                    }
                    else {
                        advance(resolve);
                    }
                    return false;
                }
            });
            return c;
        }
        //
        // WhereClause public methods
        //
        return {
            between: function (lower, upper, includeLower, includeUpper) {
                /// <summary>
                ///     Filter out records whose where-field lays between given lower and upper values. Applies to Strings, Numbers and Dates.
                /// </summary>
                /// <param name="lower"></param>
                /// <param name="upper"></param>
                /// <param name="includeLower" optional="true">Whether items that equals lower should be included. Default true.</param>
                /// <param name="includeUpper" optional="true">Whether items that equals upper should be included. Default false.</param>
                /// <returns type="Collection"></returns>
                includeLower = includeLower !== false; // Default to true
                includeUpper = includeUpper === true; // Default to false
                try {
                    if ((cmp(lower, upper) > 0) ||
                        (cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper)))
                        return emptyCollection(this); // Workaround for idiotic W3C Specification that DataError must be thrown if lower > upper. The natural result would be to return an empty collection.
                    return new Collection(this, function () { return IDBKeyRange.bound(lower, upper, !includeLower, !includeUpper); });
                }
                catch (e) {
                    return fail(this, INVALID_KEY_ARGUMENT);
                }
            },
            equals: function (value) {
                return new Collection(this, function () { return IDBKeyRange.only(value); });
            },
            above: function (value) {
                return new Collection(this, function () { return IDBKeyRange.lowerBound(value, true); });
            },
            aboveOrEqual: function (value) {
                return new Collection(this, function () { return IDBKeyRange.lowerBound(value); });
            },
            below: function (value) {
                return new Collection(this, function () { return IDBKeyRange.upperBound(value, true); });
            },
            belowOrEqual: function (value) {
                return new Collection(this, function () { return IDBKeyRange.upperBound(value); });
            },
            startsWith: function (str) {
                /// <param name="str" type="String"></param>
                if (typeof str !== 'string')
                    return fail(this, STRING_EXPECTED);
                return this.between(str, str + maxString, true, true);
            },
            startsWithIgnoreCase: function (str) {
                /// <param name="str" type="String"></param>
                if (str === "")
                    return this.startsWith(str);
                return addIgnoreCaseAlgorithm(this, function (x, a) { return x.indexOf(a[0]) === 0; }, [str], maxString);
            },
            equalsIgnoreCase: function (str) {
                /// <param name="str" type="String"></param>
                return addIgnoreCaseAlgorithm(this, function (x, a) { return x === a[0]; }, [str], "");
            },
            anyOfIgnoreCase: function () {
                var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
                if (set.length === 0)
                    return emptyCollection(this);
                return addIgnoreCaseAlgorithm(this, function (x, a) { return a.indexOf(x) !== -1; }, set, "");
            },
            startsWithAnyOfIgnoreCase: function () {
                var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
                if (set.length === 0)
                    return emptyCollection(this);
                return addIgnoreCaseAlgorithm(this, function (x, a) {
                    return a.some(function (n) {
                        return x.indexOf(n) === 0;
                    });
                }, set, maxString);
            },
            anyOf: function () {
                var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
                var compare = ascending;
                try {
                    set.sort(compare);
                }
                catch (e) {
                    return fail(this, INVALID_KEY_ARGUMENT);
                }
                if (set.length === 0)
                    return emptyCollection(this);
                var c = new Collection(this, function () { return IDBKeyRange.bound(set[0], set[set.length - 1]); });
                c._ondirectionchange = function (direction) {
                    compare = (direction === "next" ? ascending : descending);
                    set.sort(compare);
                };
                var i = 0;
                c._addAlgorithm(function (cursor, advance, resolve) {
                    var key = cursor.key;
                    while (compare(key, set[i]) > 0) {
                        // The cursor has passed beyond this key. Check next.
                        ++i;
                        if (i === set.length) {
                            // There is no next. Stop searching.
                            advance(resolve);
                            return false;
                        }
                    }
                    if (compare(key, set[i]) === 0) {
                        // The current cursor value should be included and we should continue a single step in case next item has the same key or possibly our next key in set.
                        return true;
                    }
                    else {
                        // cursor.key not yet at set[i]. Forward cursor to the next key to hunt for.
                        advance(function () { cursor.continue(set[i]); });
                        return false;
                    }
                });
                return c;
            },
            notEqual: function (value) {
                return this.inAnyRange([[minKey, value], [value, maxKey]], { includeLowers: false, includeUppers: false });
            },
            noneOf: function () {
                var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
                if (set.length === 0)
                    return new Collection(this); // Return entire collection.
                try {
                    set.sort(ascending);
                }
                catch (e) {
                    return fail(this, INVALID_KEY_ARGUMENT);
                }
                // Transform ["a","b","c"] to a set of ranges for between/above/below: [[minKey,"a"], ["a","b"], ["b","c"], ["c",maxKey]]
                var ranges = set.reduce(function (res, val) { return res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]]; }, null);
                ranges.push([set[set.length - 1], maxKey]);
                return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
            },
            /** Filter out values withing given set of ranges.
            * Example, give children and elders a rebate of 50%:
            *
            *   db.friends.where('age').inAnyRange([[0,18],[65,Infinity]]).modify({Rebate: 1/2});
            *
            * @param {(string|number|Date|Array)[][]} ranges
            * @param {{includeLowers: boolean, includeUppers: boolean}} options
            */
            inAnyRange: function (ranges, options) {
                if (ranges.length === 0)
                    return emptyCollection(this);
                if (!ranges.every(function (range) { return range[0] !== undefined && range[1] !== undefined && ascending(range[0], range[1]) <= 0; })) {
                    return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
                }
                var includeLowers = !options || options.includeLowers !== false; // Default to true
                var includeUppers = options && options.includeUppers === true; // Default to false
                function addRange(ranges, newRange) {
                    for (var i = 0, l = ranges.length; i < l; ++i) {
                        var range = ranges[i];
                        if (cmp(newRange[0], range[1]) < 0 && cmp(newRange[1], range[0]) > 0) {
                            range[0] = min(range[0], newRange[0]);
                            range[1] = max(range[1], newRange[1]);
                            break;
                        }
                    }
                    if (i === l)
                        ranges.push(newRange);
                    return ranges;
                }
                var sortDirection = ascending;
                function rangeSorter(a, b) { return sortDirection(a[0], b[0]); }
                // Join overlapping ranges
                var set;
                try {
                    set = ranges.reduce(addRange, []);
                    set.sort(rangeSorter);
                }
                catch (ex) {
                    return fail(this, INVALID_KEY_ARGUMENT);
                }
                var i = 0;
                var keyIsBeyondCurrentEntry = includeUppers ?
                    function (key) { return ascending(key, set[i][1]) > 0; } :
                    function (key) { return ascending(key, set[i][1]) >= 0; };
                var keyIsBeforeCurrentEntry = includeLowers ?
                    function (key) { return descending(key, set[i][0]) > 0; } :
                    function (key) { return descending(key, set[i][0]) >= 0; };
                function keyWithinCurrentRange(key) {
                    return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
                }
                var checkKey = keyIsBeyondCurrentEntry;
                var c = new Collection(this, function () {
                    return IDBKeyRange.bound(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers);
                });
                c._ondirectionchange = function (direction) {
                    if (direction === "next") {
                        checkKey = keyIsBeyondCurrentEntry;
                        sortDirection = ascending;
                    }
                    else {
                        checkKey = keyIsBeforeCurrentEntry;
                        sortDirection = descending;
                    }
                    set.sort(rangeSorter);
                };
                c._addAlgorithm(function (cursor, advance, resolve) {
                    var key = cursor.key;
                    while (checkKey(key)) {
                        // The cursor has passed beyond this key. Check next.
                        ++i;
                        if (i === set.length) {
                            // There is no next. Stop searching.
                            advance(resolve);
                            return false;
                        }
                    }
                    if (keyWithinCurrentRange(key)) {
                        // The current cursor value should be included and we should continue a single step in case next item has the same key or possibly our next key in set.
                        return true;
                    }
                    else if (cmp(key, set[i][1]) === 0 || cmp(key, set[i][0]) === 0) {
                        // includeUpper or includeLower is false so keyWithinCurrentRange() returns false even though we are at range border.
                        // Continue to next key but don't include this one.
                        return false;
                    }
                    else {
                        // cursor.key not yet at set[i]. Forward cursor to the next key to hunt for.
                        advance(function () {
                            if (sortDirection === ascending)
                                cursor.continue(set[i][0]);
                            else
                                cursor.continue(set[i][1]);
                        });
                        return false;
                    }
                });
                return c;
            },
            startsWithAnyOf: function () {
                var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
                if (!set.every(function (s) { return typeof s === 'string'; })) {
                    return fail(this, "startsWithAnyOf() only works with strings");
                }
                if (set.length === 0)
                    return emptyCollection(this);
                return this.inAnyRange(set.map(function (str) {
                    return [str, str + maxString];
                }));
            }
        };
    });
    //
    //
    //
    // Collection Class
    //
    //
    //
    function Collection(whereClause, keyRangeGenerator) {
        /// <summary>
        ///
        /// </summary>
        /// <param name="whereClause" type="WhereClause">Where clause instance</param>
        /// <param name="keyRangeGenerator" value="function(){ return IDBKeyRange.bound(0,1);}" optional="true"></param>
        var keyRange = null, error = null;
        if (keyRangeGenerator)
            try {
                keyRange = keyRangeGenerator();
            }
            catch (ex) {
                error = ex;
            }
        var whereCtx = whereClause._ctx, table = whereCtx.table;
        this._ctx = {
            table: table,
            index: whereCtx.index,
            isPrimKey: (!whereCtx.index || (table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name)),
            range: keyRange,
            keysOnly: false,
            dir: "next",
            unique: "",
            algorithm: null,
            filter: null,
            replayFilter: null,
            justLimit: true,
            isMatch: null,
            offset: 0,
            limit: Infinity,
            error: error,
            or: whereCtx.or,
            valueMapper: table.hook.reading.fire
        };
    }
    function isPlainKeyRange(ctx, ignoreLimitFilter) {
        return !(ctx.filter || ctx.algorithm || ctx.or) &&
            (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
    }
    props(Collection.prototype, function () {
        //
        // Collection Private Functions
        //
        function addFilter(ctx, fn) {
            ctx.filter = combine(ctx.filter, fn);
        }
        function addReplayFilter(ctx, factory, isLimitFilter) {
            var curr = ctx.replayFilter;
            ctx.replayFilter = curr ? function () { return combine(curr(), factory()); } : factory;
            ctx.justLimit = isLimitFilter && !curr;
        }
        function addMatchFilter(ctx, fn) {
            ctx.isMatch = combine(ctx.isMatch, fn);
        }
        /** @param ctx {
         *      isPrimKey: boolean,
         *      table: Table,
         *      index: string
         * }
         * @param store IDBObjectStore
         **/
        function getIndexOrStore(ctx, store) {
            if (ctx.isPrimKey)
                return store;
            var indexSpec = ctx.table.schema.idxByName[ctx.index];
            if (!indexSpec)
                throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + store.name + " is not indexed");
            return store.index(indexSpec.name);
        }
        /** @param ctx {
         *      isPrimKey: boolean,
         *      table: Table,
         *      index: string,
         *      keysOnly: boolean,
         *      range?: IDBKeyRange,
         *      dir: "next" | "prev"
         * }
         */
        function openCursor(ctx, store) {
            var idxOrStore = getIndexOrStore(ctx, store);
            return ctx.keysOnly && 'openKeyCursor' in idxOrStore ?
                idxOrStore.openKeyCursor(ctx.range || null, ctx.dir + ctx.unique) :
                idxOrStore.openCursor(ctx.range || null, ctx.dir + ctx.unique);
        }
        function iter(ctx, fn, resolve, reject, idbstore) {
            var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
            if (!ctx.or) {
                iterate(openCursor(ctx, idbstore), combine(ctx.algorithm, filter), fn, resolve, reject, !ctx.keysOnly && ctx.valueMapper);
            }
            else
                (function () {
                    var set = {};
                    var resolved = 0;
                    function resolveboth() {
                        if (++resolved === 2)
                            resolve(); // Seems like we just support or btwn max 2 expressions, but there are no limit because we do recursion.
                    }
                    function union(item, cursor, advance) {
                        if (!filter || filter(cursor, advance, resolveboth, reject)) {
                            var primaryKey = cursor.primaryKey;
                            var key = '' + primaryKey;
                            if (key === '[object ArrayBuffer]')
                                key = '' + new Uint8Array(primaryKey);
                            if (!hasOwn(set, key)) {
                                set[key] = true;
                                fn(item, cursor, advance);
                            }
                        }
                    }
                    ctx.or._iterate(union, resolveboth, reject, idbstore);
                    iterate(openCursor(ctx, idbstore), ctx.algorithm, union, resolveboth, reject, !ctx.keysOnly && ctx.valueMapper);
                })();
        }
        return {
            //
            // Collection Protected Functions
            //
            _read: function (fn, cb) {
                var ctx = this._ctx;
                return ctx.error ?
                    ctx.table._trans(null, rejection.bind(null, ctx.error)) :
                    ctx.table._idbstore(READONLY, fn).then(cb);
            },
            _write: function (fn) {
                var ctx = this._ctx;
                return ctx.error ?
                    ctx.table._trans(null, rejection.bind(null, ctx.error)) :
                    ctx.table._idbstore(READWRITE, fn, "locked"); // When doing write operations on collections, always lock the operation so that upcoming operations gets queued.
            },
            _addAlgorithm: function (fn) {
                var ctx = this._ctx;
                ctx.algorithm = combine(ctx.algorithm, fn);
            },
            _iterate: function (fn, resolve, reject, idbstore) {
                return iter(this._ctx, fn, resolve, reject, idbstore);
            },
            clone: function (props$$1) {
                var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
                if (props$$1)
                    extend(ctx, props$$1);
                rv._ctx = ctx;
                return rv;
            },
            raw: function () {
                this._ctx.valueMapper = null;
                return this;
            },
            //
            // Collection Public methods
            //
            each: function (fn) {
                var ctx = this._ctx;
                return this._read(function (resolve, reject, idbstore) {
                    iter(ctx, fn, resolve, reject, idbstore);
                });
            },
            count: function (cb) {
                var ctx = this._ctx;
                if (isPlainKeyRange(ctx, true)) {
                    // This is a plain key range. We can use the count() method if the index.
                    return this._read(function (resolve, reject, idbstore) {
                        var idx = getIndexOrStore(ctx, idbstore);
                        var req = (ctx.range ? idx.count(ctx.range) : idx.count());
                        req.onerror = eventRejectHandler(reject);
                        req.onsuccess = function (e) {
                            resolve(Math.min(e.target.result, ctx.limit));
                        };
                    }, cb);
                }
                else {
                    // Algorithms, filters or expressions are applied. Need to count manually.
                    var count = 0;
                    return this._read(function (resolve, reject, idbstore) {
                        iter(ctx, function () { ++count; return false; }, function () { resolve(count); }, reject, idbstore);
                    }, cb);
                }
            },
            sortBy: function (keyPath, cb) {
                /// <param name="keyPath" type="String"></param>
                var parts = keyPath.split('.').reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
                function getval(obj, i) {
                    if (i)
                        return getval(obj[parts[i]], i - 1);
                    return obj[lastPart];
                }
                var order = this._ctx.dir === "next" ? 1 : -1;
                function sorter(a, b) {
                    var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
                    return aVal < bVal ? -order : aVal > bVal ? order : 0;
                }
                return this.toArray(function (a) {
                    return a.sort(sorter);
                }).then(cb);
            },
            toArray: function (cb) {
                var ctx = this._ctx;
                return this._read(function (resolve, reject, idbstore) {
                    if (hasGetAll && ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                        // Special optimation if we could use IDBObjectStore.getAll() or
                        // IDBKeyRange.getAll():
                        var readingHook = ctx.table.hook.reading.fire;
                        var idxOrStore = getIndexOrStore(ctx, idbstore);
                        var req = ctx.limit < Infinity ?
                            idxOrStore.getAll(ctx.range, ctx.limit) :
                            idxOrStore.getAll(ctx.range);
                        req.onerror = eventRejectHandler(reject);
                        req.onsuccess = readingHook === mirror ?
                            eventSuccessHandler(resolve) :
                            eventSuccessHandler(function (res) {
                                try {
                                    resolve(res.map(readingHook));
                                }
                                catch (e) {
                                    reject(e);
                                }
                            });
                    }
                    else {
                        // Getting array through a cursor.
                        var a = [];
                        iter(ctx, function (item) { a.push(item); }, function arrayComplete() {
                            resolve(a);
                        }, reject, idbstore);
                    }
                }, cb);
            },
            offset: function (offset) {
                var ctx = this._ctx;
                if (offset <= 0)
                    return this;
                ctx.offset += offset; // For count()
                if (isPlainKeyRange(ctx)) {
                    addReplayFilter(ctx, function () {
                        var offsetLeft = offset;
                        return function (cursor, advance) {
                            if (offsetLeft === 0)
                                return true;
                            if (offsetLeft === 1) {
                                --offsetLeft;
                                return false;
                            }
                            advance(function () {
                                cursor.advance(offsetLeft);
                                offsetLeft = 0;
                            });
                            return false;
                        };
                    });
                }
                else {
                    addReplayFilter(ctx, function () {
                        var offsetLeft = offset;
                        return function () { return (--offsetLeft < 0); };
                    });
                }
                return this;
            },
            limit: function (numRows) {
                this._ctx.limit = Math.min(this._ctx.limit, numRows); // For count()
                addReplayFilter(this._ctx, function () {
                    var rowsLeft = numRows;
                    return function (cursor, advance, resolve) {
                        if (--rowsLeft <= 0)
                            advance(resolve); // Stop after this item has been included
                        return rowsLeft >= 0; // If numRows is already below 0, return false because then 0 was passed to numRows initially. Otherwise we wouldnt come here.
                    };
                }, true);
                return this;
            },
            until: function (filterFunction, bIncludeStopEntry) {
                addFilter(this._ctx, function (cursor, advance, resolve) {
                    if (filterFunction(cursor.value)) {
                        advance(resolve);
                        return bIncludeStopEntry;
                    }
                    else {
                        return true;
                    }
                });
                return this;
            },
            first: function (cb) {
                return this.limit(1).toArray(function (a) { return a[0]; }).then(cb);
            },
            last: function (cb) {
                return this.reverse().first(cb);
            },
            filter: function (filterFunction) {
                /// <param name="jsFunctionFilter" type="Function">function(val){return true/false}</param>
                addFilter(this._ctx, function (cursor) {
                    return filterFunction(cursor.value);
                });
                // match filters not used in Dexie.js but can be used by 3rd part libraries to test a
                // collection for a match without querying DB. Used by Dexie.Observable.
                addMatchFilter(this._ctx, filterFunction);
                return this;
            },
            and: function (filterFunction) {
                return this.filter(filterFunction);
            },
            or: function (indexName) {
                return new WhereClause(this._ctx.table, indexName, this);
            },
            reverse: function () {
                this._ctx.dir = (this._ctx.dir === "prev" ? "next" : "prev");
                if (this._ondirectionchange)
                    this._ondirectionchange(this._ctx.dir);
                return this;
            },
            desc: function () {
                return this.reverse();
            },
            eachKey: function (cb) {
                var ctx = this._ctx;
                ctx.keysOnly = !ctx.isMatch;
                return this.each(function (val, cursor) { cb(cursor.key, cursor); });
            },
            eachUniqueKey: function (cb) {
                this._ctx.unique = "unique";
                return this.eachKey(cb);
            },
            eachPrimaryKey: function (cb) {
                var ctx = this._ctx;
                ctx.keysOnly = !ctx.isMatch;
                return this.each(function (val, cursor) { cb(cursor.primaryKey, cursor); });
            },
            keys: function (cb) {
                var ctx = this._ctx;
                ctx.keysOnly = !ctx.isMatch;
                var a = [];
                return this.each(function (item, cursor) {
                    a.push(cursor.key);
                }).then(function () {
                    return a;
                }).then(cb);
            },
            primaryKeys: function (cb) {
                var ctx = this._ctx;
                if (hasGetAll && ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                    // Special optimation if we could use IDBObjectStore.getAllKeys() or
                    // IDBKeyRange.getAllKeys():
                    return this._read(function (resolve, reject, idbstore) {
                        var idxOrStore = getIndexOrStore(ctx, idbstore);
                        var req = ctx.limit < Infinity ?
                            idxOrStore.getAllKeys(ctx.range, ctx.limit) :
                            idxOrStore.getAllKeys(ctx.range);
                        req.onerror = eventRejectHandler(reject);
                        req.onsuccess = eventSuccessHandler(resolve);
                    }).then(cb);
                }
                ctx.keysOnly = !ctx.isMatch;
                var a = [];
                return this.each(function (item, cursor) {
                    a.push(cursor.primaryKey);
                }).then(function () {
                    return a;
                }).then(cb);
            },
            uniqueKeys: function (cb) {
                this._ctx.unique = "unique";
                return this.keys(cb);
            },
            firstKey: function (cb) {
                return this.limit(1).keys(function (a) { return a[0]; }).then(cb);
            },
            lastKey: function (cb) {
                return this.reverse().firstKey(cb);
            },
            distinct: function () {
                var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
                if (!idx || !idx.multi)
                    return this; // distinct() only makes differencies on multiEntry indexes.
                var set = {};
                addFilter(this._ctx, function (cursor) {
                    var strKey = cursor.primaryKey.toString(); // Converts any Date to String, String to String, Number to String and Array to comma-separated string
                    var found = hasOwn(set, strKey);
                    set[strKey] = true;
                    return !found;
                });
                return this;
            },
            //
            // Methods that mutate storage
            //
            modify: function (changes) {
                var self = this, ctx = this._ctx, hook = ctx.table.hook, updatingHook = hook.updating.fire, deletingHook = hook.deleting.fire;
                return this._write(function (resolve, reject, idbstore, trans) {
                    var modifyer;
                    if (typeof changes === 'function') {
                        // Changes is a function that may update, add or delete propterties or even require a deletion the object itself (delete this.item)
                        if (updatingHook === nop && deletingHook === nop) {
                            // Noone cares about what is being changed. Just let the modifier function be the given argument as is.
                            modifyer = changes;
                        }
                        else {
                            // People want to know exactly what is being modified or deleted.
                            // Let modifyer be a proxy function that finds out what changes the caller is actually doing
                            // and call the hooks accordingly!
                            modifyer = function (item) {
                                var origItem = deepClone(item); // Clone the item first so we can compare laters.
                                if (changes.call(this, item, this) === false)
                                    return false; // Call the real modifyer function (If it returns false explicitely, it means it dont want to modify anyting on this object)
                                if (!hasOwn(this, "value")) {
                                    // The real modifyer function requests a deletion of the object. Inform the deletingHook that a deletion is taking place.
                                    deletingHook.call(this, this.primKey, item, trans);
                                }
                                else {
                                    // No deletion. Check what was changed
                                    var objectDiff = getObjectDiff(origItem, this.value);
                                    var additionalChanges = updatingHook.call(this, objectDiff, this.primKey, origItem, trans);
                                    if (additionalChanges) {
                                        // Hook want to apply additional modifications. Make sure to fullfill the will of the hook.
                                        item = this.value;
                                        keys(additionalChanges).forEach(function (keyPath) {
                                            setByKeyPath(item, keyPath, additionalChanges[keyPath]); // Adding {keyPath: undefined} means that the keyPath should be deleted. Handled by setByKeyPath
                                        });
                                    }
                                }
                            };
                        }
                    }
                    else if (updatingHook === nop) {
                        // changes is a set of {keyPath: value} and no one is listening to the updating hook.
                        var keyPaths = keys(changes);
                        var numKeys = keyPaths.length;
                        modifyer = function (item) {
                            var anythingModified = false;
                            for (var i = 0; i < numKeys; ++i) {
                                var keyPath = keyPaths[i], val = changes[keyPath];
                                if (getByKeyPath(item, keyPath) !== val) {
                                    setByKeyPath(item, keyPath, val); // Adding {keyPath: undefined} means that the keyPath should be deleted. Handled by setByKeyPath
                                    anythingModified = true;
                                }
                            }
                            return anythingModified;
                        };
                    }
                    else {
                        // changes is a set of {keyPath: value} and people are listening to the updating hook so we need to call it and
                        // allow it to add additional modifications to make.
                        var origChanges = changes;
                        changes = shallowClone(origChanges); // Let's work with a clone of the changes keyPath/value set so that we can restore it in case a hook extends it.
                        modifyer = function (item) {
                            var anythingModified = false;
                            var additionalChanges = updatingHook.call(this, changes, this.primKey, deepClone(item), trans);
                            if (additionalChanges)
                                extend(changes, additionalChanges);
                            keys(changes).forEach(function (keyPath) {
                                var val = changes[keyPath];
                                if (getByKeyPath(item, keyPath) !== val) {
                                    setByKeyPath(item, keyPath, val);
                                    anythingModified = true;
                                }
                            });
                            if (additionalChanges)
                                changes = shallowClone(origChanges); // Restore original changes for next iteration
                            return anythingModified;
                        };
                    }
                    var count = 0;
                    var successCount = 0;
                    var iterationComplete = false;
                    var failures = [];
                    var failKeys = [];
                    var currentKey = null;
                    function modifyItem(item, cursor) {
                        currentKey = cursor.primaryKey;
                        var thisContext = {
                            primKey: cursor.primaryKey,
                            value: item,
                            onsuccess: null,
                            onerror: null
                        };
                        function onerror(e) {
                            failures.push(e);
                            failKeys.push(thisContext.primKey);
                            checkFinished();
                            return true; // Catch these errors and let a final rejection decide whether or not to abort entire transaction
                        }
                        if (modifyer.call(thisContext, item, thisContext) !== false) {
                            var bDelete = !hasOwn(thisContext, "value");
                            ++count;
                            tryCatch(function () {
                                var req = (bDelete ? cursor.delete() : cursor.update(thisContext.value));
                                req._hookCtx = thisContext;
                                req.onerror = hookedEventRejectHandler(onerror);
                                req.onsuccess = hookedEventSuccessHandler(function () {
                                    ++successCount;
                                    checkFinished();
                                });
                            }, onerror);
                        }
                        else if (thisContext.onsuccess) {
                            // Hook will expect either onerror or onsuccess to always be called!
                            thisContext.onsuccess(thisContext.value);
                        }
                    }
                    function doReject(e) {
                        if (e) {
                            failures.push(e);
                            failKeys.push(currentKey);
                        }
                        return reject(new ModifyError("Error modifying one or more objects", failures, successCount, failKeys));
                    }
                    function checkFinished() {
                        if (iterationComplete && successCount + failures.length === count) {
                            if (failures.length > 0)
                                doReject();
                            else
                                resolve(successCount);
                        }
                    }
                    self.clone().raw()._iterate(modifyItem, function () {
                        iterationComplete = true;
                        checkFinished();
                    }, doReject, idbstore);
                });
            },
            'delete': function () {
                var _this = this;
                var ctx = this._ctx, range = ctx.range, deletingHook = ctx.table.hook.deleting.fire, hasDeleteHook = deletingHook !== nop;
                if (!hasDeleteHook &&
                    isPlainKeyRange(ctx) &&
                    ((ctx.isPrimKey && !hangsOnDeleteLargeKeyRange) || !range)) {
                    // May use IDBObjectStore.delete(IDBKeyRange) in this case (Issue #208)
                    // For chromium, this is the way most optimized version.
                    // For IE/Edge, this could hang the indexedDB engine and make operating system instable
                    // (https://gist.github.com/dfahlander/5a39328f029de18222cf2125d56c38f7)
                    return this._write(function (resolve, reject, idbstore) {
                        // Our API contract is to return a count of deleted items, so we have to count() before delete().
                        var onerror = eventRejectHandler(reject), countReq = (range ? idbstore.count(range) : idbstore.count());
                        countReq.onerror = onerror;
                        countReq.onsuccess = function () {
                            var count = countReq.result;
                            tryCatch(function () {
                                var delReq = (range ? idbstore.delete(range) : idbstore.clear());
                                delReq.onerror = onerror;
                                delReq.onsuccess = function () { return resolve(count); };
                            }, function (err) { return reject(err); });
                        };
                    });
                }
                // Default version to use when collection is not a vanilla IDBKeyRange on the primary key.
                // Divide into chunks to not starve RAM.
                // If has delete hook, we will have to collect not just keys but also objects, so it will use
                // more memory and need lower chunk size.
                var CHUNKSIZE = hasDeleteHook ? 2000 : 10000;
                return this._write(function (resolve, reject, idbstore, trans) {
                    var totalCount = 0;
                    // Clone collection and change its table and set a limit of CHUNKSIZE on the cloned Collection instance.
                    var collection = _this
                        .clone({
                        keysOnly: !ctx.isMatch && !hasDeleteHook
                    }) // load just keys (unless filter() or and() or deleteHook has subscribers)
                        .distinct() // In case multiEntry is used, never delete same key twice because resulting count
                        .limit(CHUNKSIZE)
                        .raw(); // Don't filter through reading-hooks (like mapped classes etc)
                    var keysOrTuples = [];
                    // We're gonna do things on as many chunks that are needed.
                    // Use recursion of nextChunk function:
                    var nextChunk = function () { return collection.each(hasDeleteHook ? function (val, cursor) {
                        // Somebody subscribes to hook('deleting'). Collect all primary keys and their values,
                        // so that the hook can be called with its values in bulkDelete().
                        keysOrTuples.push([cursor.primaryKey, cursor.value]);
                    } : function (val, cursor) {
                        // No one subscribes to hook('deleting'). Collect only primary keys:
                        keysOrTuples.push(cursor.primaryKey);
                    }).then(function () {
                        // Chromium deletes faster when doing it in sort order.
                        hasDeleteHook ?
                            keysOrTuples.sort(function (a, b) { return ascending(a[0], b[0]); }) :
                            keysOrTuples.sort(ascending);
                        return bulkDelete(idbstore, trans, keysOrTuples, hasDeleteHook, deletingHook);
                    }).then(function () {
                        var count = keysOrTuples.length;
                        totalCount += count;
                        keysOrTuples = [];
                        return count < CHUNKSIZE ? totalCount : nextChunk();
                    }); };
                    resolve(nextChunk());
                });
            }
        };
    });
    //
    //
    //
    // ------------------------- Help functions ---------------------------
    //
    //
    //
    function lowerVersionFirst(a, b) {
        return a._cfg.version - b._cfg.version;
    }
    function setApiOnPlace(objs, tableNames, dbschema) {
        tableNames.forEach(function (tableName) {
            var schema = dbschema[tableName];
            objs.forEach(function (obj) {
                if (!(tableName in obj)) {
                    if (obj === Transaction.prototype || obj instanceof Transaction) {
                        // obj is a Transaction prototype (or prototype of a subclass to Transaction)
                        // Make the API a getter that returns this.table(tableName)
                        setProp(obj, tableName, { get: function () { return this.table(tableName); } });
                    }
                    else {
                        // Table will not be bound to a transaction (will use Dexie.currentTransaction)
                        obj[tableName] = new Table(tableName, schema);
                    }
                }
            });
        });
    }
    function removeTablesApi(objs) {
        objs.forEach(function (obj) {
            for (var key in obj) {
                if (obj[key] instanceof Table)
                    delete obj[key];
            }
        });
    }
    function iterate(req, filter, fn, resolve, reject, valueMapper) {
        // Apply valueMapper (hook('reading') or mappped class)
        var mappedFn = valueMapper ? function (x, c, a) { return fn(valueMapper(x), c, a); } : fn;
        // Wrap fn with PSD and microtick stuff from Promise.
        var wrappedFn = wrap(mappedFn, reject);
        if (!req.onerror)
            req.onerror = eventRejectHandler(reject);
        if (filter) {
            req.onsuccess = trycatcher(function filter_record() {
                var cursor = req.result;
                if (cursor) {
                    var c = function () { cursor.continue(); };
                    if (filter(cursor, function (advancer) { c = advancer; }, resolve, reject))
                        wrappedFn(cursor.value, cursor, function (advancer) { c = advancer; });
                    c();
                }
                else {
                    resolve();
                }
            }, reject);
        }
        else {
            req.onsuccess = trycatcher(function filter_record() {
                var cursor = req.result;
                if (cursor) {
                    var c = function () { cursor.continue(); };
                    wrappedFn(cursor.value, cursor, function (advancer) { c = advancer; });
                    c();
                }
                else {
                    resolve();
                }
            }, reject);
        }
    }
    function parseIndexSyntax(indexes) {
        /// <param name="indexes" type="String"></param>
        /// <returns type="Array" elementType="IndexSpec"></returns>
        var rv = [];
        indexes.split(',').forEach(function (index) {
            index = index.trim();
            var name = index.replace(/([&*]|\+\+)/g, ""); // Remove "&", "++" and "*"
            // Let keyPath of "[a+b]" be ["a","b"]:
            var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split('+') : name;
            rv.push(new IndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), /\./.test(index)));
        });
        return rv;
    }
    function cmp(key1, key2) {
        return indexedDB.cmp(key1, key2);
    }
    function min(a, b) {
        return cmp(a, b) < 0 ? a : b;
    }
    function max(a, b) {
        return cmp(a, b) > 0 ? a : b;
    }
    function ascending(a, b) {
        return indexedDB.cmp(a, b);
    }
    function descending(a, b) {
        return indexedDB.cmp(b, a);
    }
    function simpleCompare(a, b) {
        return a < b ? -1 : a === b ? 0 : 1;
    }
    function simpleCompareReverse(a, b) {
        return a > b ? -1 : a === b ? 0 : 1;
    }
    function combine(filter1, filter2) {
        return filter1 ?
            filter2 ?
                function () { return filter1.apply(this, arguments) && filter2.apply(this, arguments); } :
                filter1 :
            filter2;
    }
    function readGlobalSchema() {
        db.verno = idbdb.version / 10;
        db._dbSchema = globalSchema = {};
        dbStoreNames = slice(idbdb.objectStoreNames, 0);
        if (dbStoreNames.length === 0)
            return; // Database contains no stores.
        var trans = idbdb.transaction(safariMultiStoreFix(dbStoreNames), 'readonly');
        dbStoreNames.forEach(function (storeName) {
            var store = trans.objectStore(storeName), keyPath = store.keyPath, dotted = keyPath && typeof keyPath === 'string' && keyPath.indexOf('.') !== -1;
            var primKey = new IndexSpec(keyPath, keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== 'string', dotted);
            var indexes = [];
            for (var j = 0; j < store.indexNames.length; ++j) {
                var idbindex = store.index(store.indexNames[j]);
                keyPath = idbindex.keyPath;
                dotted = keyPath && typeof keyPath === 'string' && keyPath.indexOf('.') !== -1;
                var index = new IndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== 'string', dotted);
                indexes.push(index);
            }
            globalSchema[storeName] = new TableSchema(storeName, primKey, indexes, {});
        });
        setApiOnPlace([allTables], keys(globalSchema), globalSchema);
    }
    function adjustToExistingIndexNames(schema, idbtrans) {
        /// <summary>
        /// Issue #30 Problem with existing db - adjust to existing index names when migrating from non-dexie db
        /// </summary>
        /// <param name="schema" type="Object">Map between name and TableSchema</param>
        /// <param name="idbtrans" type="IDBTransaction"></param>
        var storeNames = idbtrans.db.objectStoreNames;
        for (var i = 0; i < storeNames.length; ++i) {
            var storeName = storeNames[i];
            var store = idbtrans.objectStore(storeName);
            hasGetAll = 'getAll' in store;
            for (var j = 0; j < store.indexNames.length; ++j) {
                var indexName = store.indexNames[j];
                var keyPath = store.index(indexName).keyPath;
                var dexieName = typeof keyPath === 'string' ? keyPath : "[" + slice(keyPath).join('+') + "]";
                if (schema[storeName]) {
                    var indexSpec = schema[storeName].idxByName[dexieName];
                    if (indexSpec)
                        indexSpec.name = indexName;
                }
            }
        }
        // Bug with getAll() on Safari ver<604 on Workers only, see discussion following PR #579
        if (/Safari/.test(navigator.userAgent) &&
            !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
            _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope &&
            [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
            hasGetAll = false;
        }
    }
    function fireOnBlocked(ev) {
        db.on("blocked").fire(ev);
        // Workaround (not fully*) for missing "versionchange" event in IE,Edge and Safari:
        connections
            .filter(function (c) { return c.name === db.name && c !== db && !c._vcFired; })
            .map(function (c) { return c.on("versionchange").fire(ev); });
    }
    extend(this, {
        Collection: Collection,
        Table: Table,
        Transaction: Transaction,
        Version: Version,
        WhereClause: WhereClause
    });
    init();
    addons.forEach(function (fn) {
        fn(db);
    });
}
function parseType(type) {
    if (typeof type === 'function') {
        return new type();
    }
    else if (isArray(type)) {
        return [parseType(type[0])];
    }
    else if (type && typeof type === 'object') {
        var rv = {};
        applyStructure(rv, type);
        return rv;
    }
    else {
        return type;
    }
}
function applyStructure(obj, structure) {
    keys(structure).forEach(function (member) {
        var value = parseType(structure[member]);
        obj[member] = value;
    });
    return obj;
}
function hookedEventSuccessHandler(resolve) {
    // wrap() is needed when calling hooks because the rare scenario of:
    //  * hook does a db operation that fails immediately (IDB throws exception)
    //    For calling db operations on correct transaction, wrap makes sure to set PSD correctly.
    //    wrap() will also execute in a virtual tick.
    //  * If not wrapped in a virtual tick, direct exception will launch a new physical tick.
    //  * If this was the last event in the bulk, the promise will resolve after a physical tick
    //    and the transaction will have committed already.
    // If no hook, the virtual tick will be executed in the reject()/resolve of the final promise,
    // because it is always marked with _lib = true when created using Transaction._promise().
    return wrap(function (event) {
        var req = event.target, ctx = req._hookCtx, // Contains the hook error handler. Put here instead of closure to boost performance.
        result = ctx.value || req.result, // Pass the object value on updates. The result from IDB is the primary key.
        hookSuccessHandler = ctx && ctx.onsuccess;
        hookSuccessHandler && hookSuccessHandler(result);
        resolve && resolve(result);
    }, resolve);
}
function eventRejectHandler(reject) {
    return wrap(function (event) {
        preventDefault(event);
        reject(event.target.error);
        return false;
    });
}
function eventSuccessHandler(resolve) {
    return wrap(function (event) {
        resolve(event.target.result);
    });
}
function hookedEventRejectHandler(reject) {
    return wrap(function (event) {
        // See comment on hookedEventSuccessHandler() why wrap() is needed only when supporting hooks.
        var req = event.target, err = req.error, ctx = req._hookCtx, // Contains the hook error handler. Put here instead of closure to boost performance.
        hookErrorHandler = ctx && ctx.onerror;
        hookErrorHandler && hookErrorHandler(err);
        preventDefault(event);
        reject(err);
        return false;
    });
}
function preventDefault(event) {
    if (event.stopPropagation)
        event.stopPropagation();
    if (event.preventDefault)
        event.preventDefault();
}
function awaitIterator(iterator) {
    var callNext = function (result) { return iterator.next(result); }, doThrow = function (error) { return iterator.throw(error); }, onSuccess = step(callNext), onError = step(doThrow);
    function step(getNext) {
        return function (val) {
            var next = getNext(val), value = next.value;
            return next.done ? value :
                (!value || typeof value.then !== 'function' ?
                    isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) :
                    value.then(onSuccess, onError));
        };
    }
    return step(callNext)();
}
//
// IndexSpec struct
//
function IndexSpec(name, keyPath, unique, multi, auto, compound, dotted) {
    /// <param name="name" type="String"></param>
    /// <param name="keyPath" type="String"></param>
    /// <param name="unique" type="Boolean"></param>
    /// <param name="multi" type="Boolean"></param>
    /// <param name="auto" type="Boolean"></param>
    /// <param name="compound" type="Boolean"></param>
    /// <param name="dotted" type="Boolean"></param>
    this.name = name;
    this.keyPath = keyPath;
    this.unique = unique;
    this.multi = multi;
    this.auto = auto;
    this.compound = compound;
    this.dotted = dotted;
    var keyPathSrc = typeof keyPath === 'string' ? keyPath : keyPath && ('[' + [].join.call(keyPath, '+') + ']');
    this.src = (unique ? '&' : '') + (multi ? '*' : '') + (auto ? "++" : "") + keyPathSrc;
}
//
// TableSchema struct
//
function TableSchema(name, primKey, indexes, instanceTemplate) {
    /// <param name="name" type="String"></param>
    /// <param name="primKey" type="IndexSpec"></param>
    /// <param name="indexes" type="Array" elementType="IndexSpec"></param>
    /// <param name="instanceTemplate" type="Object"></param>
    this.name = name;
    this.primKey = primKey || new IndexSpec();
    this.indexes = indexes || [new IndexSpec()];
    this.instanceTemplate = instanceTemplate;
    this.mappedClass = null;
    this.idxByName = arrayToObject(indexes, function (index) { return [index.name, index]; });
}
function safariMultiStoreFix(storeNames) {
    return storeNames.length === 1 ? storeNames[0] : storeNames;
}
function getNativeGetDatabaseNamesFn(indexedDB) {
    var fn = indexedDB && (indexedDB.getDatabaseNames || indexedDB.webkitGetDatabaseNames);
    return fn && fn.bind(indexedDB);
}
// Export Error classes
props(Dexie, fullNameExceptions); // Dexie.XXXError = class XXXError {...};
//
// Static methods and properties
// 
props(Dexie, {
    //
    // Static delete() method.
    //
    delete: function (databaseName) {
        var db = new Dexie(databaseName), promise = db.delete();
        promise.onblocked = function (fn) {
            db.on("blocked", fn);
            return this;
        };
        return promise;
    },
    //
    // Static exists() method.
    //
    exists: function (name) {
        return new Dexie(name).open().then(function (db) {
            db.close();
            return true;
        }).catch(Dexie.NoSuchDatabaseError, function () { return false; });
    },
    //
    // Static method for retrieving a list of all existing databases at current host.
    //
    getDatabaseNames: function (cb) {
        var getDatabaseNames = getNativeGetDatabaseNamesFn(Dexie.dependencies.indexedDB);
        return getDatabaseNames ? new Promise(function (resolve, reject) {
            var req = getDatabaseNames();
            req.onsuccess = function (event) {
                resolve(slice(event.target.result, 0)); // Converst DOMStringList to Array<String>
            };
            req.onerror = eventRejectHandler(reject);
        }).then(cb) : dbNamesDB.dbnames.toCollection().primaryKeys(cb);
    },
    defineClass: function () {
        // Default constructor able to copy given properties into this object.
        function Class(properties) {
            /// <param name="properties" type="Object" optional="true">Properties to initialize object with.
            /// </param>
            if (properties)
                extend(this, properties);
        }
        return Class;
    },
    applyStructure: applyStructure,
    ignoreTransaction: function (scopeFunc) {
        // In case caller is within a transaction but needs to create a separate transaction.
        // Example of usage:
        //
        // Let's say we have a logger function in our app. Other application-logic should be unaware of the
        // logger function and not need to include the 'logentries' table in all transaction it performs.
        // The logging should always be done in a separate transaction and not be dependant on the current
        // running transaction context. Then you could use Dexie.ignoreTransaction() to run code that starts a new transaction.
        //
        //     Dexie.ignoreTransaction(function() {
        //         db.logentries.add(newLogEntry);
        //     });
        //
        // Unless using Dexie.ignoreTransaction(), the above example would try to reuse the current transaction
        // in current Promise-scope.
        //
        // An alternative to Dexie.ignoreTransaction() would be setImmediate() or setTimeout(). The reason we still provide an
        // API for this because
        //  1) The intention of writing the statement could be unclear if using setImmediate() or setTimeout().
        //  2) setTimeout() would wait unnescessary until firing. This is however not the case with setImmediate().
        //  3) setImmediate() is not supported in the ES standard.
        //  4) You might want to keep other PSD state that was set in a parent PSD, such as PSD.letThrough.
        return PSD.trans ?
            usePSD(PSD.transless, scopeFunc) : // Use the closest parent that was non-transactional.
            scopeFunc(); // No need to change scope because there is no ongoing transaction.
    },
    vip: function (fn) {
        // To be used by subscribers to the on('ready') event.
        // This will let caller through to access DB even when it is blocked while the db.ready() subscribers are firing.
        // This would have worked automatically if we were certain that the Provider was using Dexie.Promise for all asyncronic operations. The promise PSD
        // from the provider.connect() call would then be derived all the way to when provider would call localDatabase.applyChanges(). But since
        // the provider more likely is using non-promise async APIs or other thenable implementations, we cannot assume that.
        // Note that this method is only useful for on('ready') subscribers that is returning a Promise from the event. If not using vip()
        // the database could deadlock since it wont open until the returned Promise is resolved, and any non-VIPed operation started by
        // the caller will not resolve until database is opened.
        return newScope(function () {
            PSD.letThrough = true; // Make sure we are let through if still blocking db due to onready is firing.
            return fn();
        });
    },
    async: function (generatorFn) {
        return function () {
            try {
                var rv = awaitIterator(generatorFn.apply(this, arguments));
                if (!rv || typeof rv.then !== 'function')
                    return Promise.resolve(rv);
                return rv;
            }
            catch (e) {
                return rejection(e);
            }
        };
    },
    spawn: function (generatorFn, args, thiz) {
        try {
            var rv = awaitIterator(generatorFn.apply(thiz, args || []));
            if (!rv || typeof rv.then !== 'function')
                return Promise.resolve(rv);
            return rv;
        }
        catch (e) {
            return rejection(e);
        }
    },
    // Dexie.currentTransaction property
    currentTransaction: {
        get: function () { return PSD.trans || null; }
    },
    waitFor: function (promiseOrFunction, optionalTimeout) {
        // If a function is provided, invoke it and pass the returning value to Transaction.waitFor()
        var promise = Promise.resolve(typeof promiseOrFunction === 'function' ? Dexie.ignoreTransaction(promiseOrFunction) : promiseOrFunction)
            .timeout(optionalTimeout || 60000); // Default the timeout to one minute. Caller may specify Infinity if required.       
        // Run given promise on current transaction. If no current transaction, just return a Dexie promise based
        // on given value.
        return PSD.trans ? PSD.trans.waitFor(promise) : promise;
    },
    // Export our Promise implementation since it can be handy as a standalone Promise implementation
    Promise: Promise,
    // Dexie.debug proptery:
    // Dexie.debug = false
    // Dexie.debug = true
    // Dexie.debug = "dexie" - don't hide dexie's stack frames.
    debug: {
        get: function () { return debug; },
        set: function (value) {
            setDebug(value, value === 'dexie' ? function () { return true; } : dexieStackFrameFilter);
        }
    },
    // Export our derive/extend/override methodology
    derive: derive,
    extend: extend,
    props: props,
    override: override,
    // Export our Events() function - can be handy as a toolkit
    Events: Events,
    // Utilities
    getByKeyPath: getByKeyPath,
    setByKeyPath: setByKeyPath,
    delByKeyPath: delByKeyPath,
    shallowClone: shallowClone,
    deepClone: deepClone,
    getObjectDiff: getObjectDiff,
    asap: asap,
    maxKey: maxKey,
    minKey: minKey,
    // Addon registry
    addons: [],
    // Global DB connection list
    connections: connections,
    MultiModifyError: exceptions.Modify,
    errnames: errnames,
    // Export other static classes
    IndexSpec: IndexSpec,
    TableSchema: TableSchema,
    //
    // Dependencies
    //
    // These will automatically work in browsers with indexedDB support, or where an indexedDB polyfill has been included.
    //
    // In node.js, however, these properties must be set "manually" before instansiating a new Dexie().
    // For node.js, you need to require indexeddb-js or similar and then set these deps.
    //
    dependencies: (function () {
        try {
            return {
                // Required:
                indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
                IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
            };
        }
        catch (e) {
            return {
                indexedDB: null,
                IDBKeyRange: null
            };
        }
    })(),
    // API Version Number: Type Number, make sure to always set a version number that can be comparable correctly. Example: 0.9, 0.91, 0.92, 1.0, 1.01, 1.1, 1.2, 1.21, etc.
    semVer: DEXIE_VERSION,
    version: DEXIE_VERSION.split('.')
        .map(function (n) { return parseInt(n); })
        .reduce(function (p, c, i) { return p + (c / Math.pow(10, i * 2)); }),
    // https://github.com/dfahlander/Dexie.js/issues/186
    // typescript compiler tsc in mode ts-->es5 & commonJS, will expect require() to return
    // x.default. Workaround: Set Dexie.default = Dexie.
    default: Dexie,
    // Make it possible to import {Dexie} (non-default import)
    // Reason 1: May switch to that in future.
    // Reason 2: We declare it both default and named exported in d.ts to make it possible
    // to let addons extend the Dexie interface with Typescript 2.1 (works only when explicitely
    // exporting the symbol, not just default exporting)
    Dexie: Dexie
});
// Map DOMErrors and DOMExceptions to corresponding Dexie errors. May change in Dexie v2.0.
Promise.rejectionMapper = mapError;
// Initialize dbNamesDB (won't ever be opened on chromium browsers')
dbNamesDB = new Dexie('__dbnames');
dbNamesDB.version(1).stores({ dbnames: 'name' });
(function () {
    // Migrate from Dexie 1.x database names stored in localStorage:
    var DBNAMES = 'Dexie.DatabaseNames';
    try {
        if (typeof localStorage !== undefined && _global.document !== undefined) {
            // Have localStorage and is not executing in a worker. Lets migrate from Dexie 1.x.
            JSON.parse(localStorage.getItem(DBNAMES) || "[]")
                .forEach(function (name) { return dbNamesDB.dbnames.put({ name: name }).catch(nop); });
            localStorage.removeItem(DBNAMES);
        }
    }
    catch (_e) { }
})();

return Dexie;

})));


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"timers":5}],42:[function(require,module,exports){
(function (global){
// https://github.com/maxogden/websocket-stream/blob/48dc3ddf943e5ada668c31ccd94e9186f02fafbd/ws-fallback.js

var ws = null

if (typeof WebSocket !== 'undefined') {
  ws = WebSocket
} else if (typeof MozWebSocket !== 'undefined') {
  ws = MozWebSocket
} else if (typeof global !== 'undefined') {
  ws = global.WebSocket || global.MozWebSocket
} else if (typeof window !== 'undefined') {
  ws = window.WebSocket || window.MozWebSocket
} else if (typeof self !== 'undefined') {
  ws = self.WebSocket || self.MozWebSocket
}

module.exports = ws

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],43:[function(require,module,exports){
(function () {
    /*
     * Async module to handle async messaging
     * @module Async
     *
     * @param {Object} params
     */

    function Async(params) {

        /*******************************************************
         *          P R I V A T E   V A R I A B L E S          *
         *******************************************************/

        var PodSocketClass,
            PodUtility;

        if (typeof(require) !== 'undefined' && typeof(exports) !== 'undefined') {
            PodSocketClass = require('./socket.js');
            PodUtility = require('../utility/utility.js');
        }
        else {
            PodSocketClass = POD.Socket;
            PodUtility = POD.AsyncUtility;
        }

        var Utility = new PodUtility();

        var protocol = params.protocol || 'websocket',
            appId = params.appId || 'PodChat',
            deviceId = params.deviceId,
            eventCallbacks = {
                connect: {},
                disconnect: {},
                reconnect: {},
                message: {},
                asyncReady: {},
                stateChange: {},
                error: {}
            },
            ackCallback = {},
            socket,
            asyncMessageType = {
                PING: 0,
                SERVER_REGISTER: 1,
                DEVICE_REGISTER: 2,
                MESSAGE: 3,
                MESSAGE_ACK_NEEDED: 4,
                MESSAGE_SENDER_ACK_NEEDED: 5,
                ACK: 6,
                GET_REGISTERED_PEERS: 7,
                PEER_REMOVED: -3,
                REGISTER_QUEUE: -2,
                NOT_REGISTERED: -1,
                ERROR_MESSAGE: -99
            },
            socketStateType = {
                CONNECTING: 0, // The connection is not yet open.
                OPEN: 1, // The connection is open and ready to communicate.
                CLOSING: 2, // The connection is in the process of closing.
                CLOSED: 3 // The connection is closed or couldn't be opened.
            },
            isNode = Utility.isNode(),
            isSocketOpen = false,
            isDeviceRegister = false,
            isServerRegister = false,
            socketState = socketStateType.CONNECTING,
            asyncState = '',
            registerServerTimeoutId,
            registerDeviceTimeoutId,
            checkIfSocketHasOpennedTimeoutId,
            asyncReadyTimeoutId,
            pushSendDataQueue = [],
            oldPeerId,
            peerId = params.peerId,
            lastMessageId = 0,
            messageTtl = params.messageTtl || 86400,
            serverName = params.serverName || 'oauth-wire',
            serverRegisteration = (typeof params.serverRegisteration === 'boolean') ? params.serverRegisteration : true,
            connectionRetryInterval = params.connectionRetryInterval || 5000,
            socketReconnectRetryInterval,
            socketReconnectCheck,
            retryStep = 4,
            reconnectOnClose = (typeof params.reconnectOnClose === 'boolean') ? params.reconnectOnClose : true,
            asyncLogging = (params.asyncLogging && typeof params.asyncLogging.onFunction === 'boolean') ? params.asyncLogging.onFunction : false,
            onReceiveLogging = (params.asyncLogging && typeof params.asyncLogging.onMessageReceive === 'boolean')
                ? params.asyncLogging.onMessageReceive
                : false,
            onSendLogging = (params.asyncLogging && typeof params.asyncLogging.onMessageSend === 'boolean') ? params.asyncLogging.onMessageSend : false,
            workerId = (params.asyncLogging && typeof parseInt(params.asyncLogging.workerId) === 'number') ? params.asyncLogging.workerId : 0;

        /*******************************************************
         *            P R I V A T E   M E T H O D S            *
         *******************************************************/

        var init = function () {
                switch (protocol) {
                    case 'websocket':
                        initSocket();
                        break;
                }
            },

            asyncLogger = function (type, msg) {
                Utility.asyncLogger({
                    protocol: protocol,
                    workerId: workerId,
                    type: type,
                    msg: msg,
                    peerId: peerId,
                    deviceId: deviceId,
                    isSocketOpen: isSocketOpen,
                    isDeviceRegister: isDeviceRegister,
                    isServerRegister: isServerRegister,
                    socketState: socketState,
                    pushSendDataQueue: pushSendDataQueue
                });
            },

            initSocket = function () {
                socket = new PodSocketClass({
                    socketAddress: params.socketAddress,
                    wsConnectionWaitTime: params.wsConnectionWaitTime,
                    connectionCheckTimeout: params.connectionCheckTimeout,
                    connectionCheckTimeoutThreshold: params.connectionCheckTimeoutThreshold
                });

                checkIfSocketHasOpennedTimeoutId = setTimeout(function () {
                    if (!isSocketOpen) {
                        fireEvent('error', {
                            errorCode: 4001,
                            errorMessage: 'Can not open Socket!'
                        });
                    }
                }, 65000);

                socket.on('open', function () {
                    checkIfSocketHasOpennedTimeoutId && clearTimeout(checkIfSocketHasOpennedTimeoutId);
                    socketReconnectRetryInterval && clearTimeout(socketReconnectRetryInterval);
                    socketReconnectCheck && clearTimeout(socketReconnectCheck);

                    isSocketOpen = true;
                    retryStep = 4;

                    socketState = socketStateType.OPEN;
                    fireEvent('stateChange', {
                        socketState: socketState,
                        timeUntilReconnect: 0,
                        deviceRegister: isDeviceRegister,
                        serverRegister: isServerRegister,
                        peerId: peerId
                    });
                });

                socket.on('message', function (msg) {
                    handleSocketMessage(msg);
                    if (onReceiveLogging) {
                        asyncLogger('Receive', msg);
                    }
                });

                socket.on('close', function (event) {
                    isSocketOpen = false;
                    isDeviceRegister = false;
                    oldPeerId = peerId;

                    socketState = socketStateType.CLOSED;

                    fireEvent('stateChange', {
                        socketState: socketState,
                        timeUntilReconnect: 0,
                        deviceRegister: isDeviceRegister,
                        serverRegister: isServerRegister,
                        peerId: peerId
                    });

                    fireEvent('disconnect', event);

                    if (reconnectOnClose) {
                        if (asyncLogging) {
                            if (workerId > 0) {
                                Utility.asyncStepLogger(workerId + '\t Reconnecting after ' + retryStep + 's');
                            }
                            else {
                                Utility.asyncStepLogger('Reconnecting after ' + retryStep + 's');
                            }
                        }

                        socketState = socketStateType.CLOSED;
                        fireEvent('stateChange', {
                            socketState: socketState,
                            timeUntilReconnect: 1000 * retryStep,
                            deviceRegister: isDeviceRegister,
                            serverRegister: isServerRegister,
                            peerId: peerId
                        });

                        socketReconnectRetryInterval && clearTimeout(socketReconnectRetryInterval);

                        socketReconnectRetryInterval = setTimeout(function () {
                            socket.connect();
                        }, 1000 * retryStep);

                        if (retryStep < 64) {
                            retryStep *= 2;
                        }

                        // socketReconnectCheck && clearTimeout(socketReconnectCheck);
                        //
                        // socketReconnectCheck = setTimeout(function() {
                        //   if (!isSocketOpen) {
                        //     fireEvent("error", {
                        //       errorCode: 4001,
                        //       errorMessage: "Can not open Socket!"
                        //     });
                        //
                        //     socketState = socketStateType.CLOSED;
                        //     fireEvent("stateChange", {
                        //       socketState: socketState,
                        //       deviceRegister: isDeviceRegister,
                        //       serverRegister: isServerRegister,
                        //       peerId: peerId
                        //     });
                        //   }
                        // }, 65000);

                    }
                    else {
                        socketReconnectRetryInterval && clearTimeout(socketReconnectRetryInterval);
                        socketReconnectCheck && clearTimeout(socketReconnectCheck);
                        fireEvent('error', {
                            errorCode: 4005,
                            errorMessage: 'Socket Closed!'
                        });

                        socketState = socketStateType.CLOSED;
                        fireEvent('stateChange', {
                            socketState: socketState,
                            timeUntilReconnect: 0,
                            deviceRegister: isDeviceRegister,
                            serverRegister: isServerRegister,
                            peerId: peerId
                        });
                    }

                });

                socket.on('customError', function (error) {
                    fireEvent('error', {
                        errorCode: error.errorCode,
                        errorMessage: error.errorMessage,
                        errorEvent: error.errorEvent
                    });
                });

                socket.on('error', function (error) {
                    fireEvent('error', {
                        errorCode: '',
                        errorMessage: '',
                        errorEvent: error
                    });
                });
            },

            handleSocketMessage = function (msg) {
                var ack;

                if (msg.type === asyncMessageType.MESSAGE_ACK_NEEDED || msg.type === asyncMessageType.MESSAGE_SENDER_ACK_NEEDED) {
                    ack = function () {
                        pushSendData({
                            type: asyncMessageType.ACK,
                            content: {
                                messageId: msg.id
                            }
                        });
                    };
                }

                switch (msg.type) {
                    case asyncMessageType.PING:
                        handlePingMessage(msg);
                        break;

                    case asyncMessageType.SERVER_REGISTER:
                        handleServerRegisterMessage(msg);
                        break;

                    case asyncMessageType.DEVICE_REGISTER:
                        handleDeviceRegisterMessage(msg.content);
                        break;

                    case asyncMessageType.MESSAGE:
                        fireEvent('message', msg);
                        break;

                    case asyncMessageType.MESSAGE_ACK_NEEDED:
                    case asyncMessageType.MESSAGE_SENDER_ACK_NEEDED:
                        ack();
                        fireEvent('message', msg);
                        break;

                    case asyncMessageType.ACK:
                        fireEvent('message', msg);
                        if (ackCallback[msg.senderMessageId] == 'function') {
                            ackCallback[msg.senderMessageId]();
                            delete ackCallback[msg.senderMessageId];
                        }
                        break;

                    case asyncMessageType.ERROR_MESSAGE:
                        fireEvent('error', {
                            errorCode: 4002,
                            errorMessage: 'Async Error!',
                            errorEvent: msg
                        });
                        break;
                }
            },

            handlePingMessage = function (msg) {
                if (msg.content) {
                    if (deviceId === undefined) {
                        deviceId = msg.content;
                        registerDevice();
                    }
                    else {
                        registerDevice();
                    }
                }
                else {
                    if (onReceiveLogging) {
                        if (workerId > 0) {
                            Utility.asyncStepLogger(workerId + '\t Ping Response at (' + new Date() + ')');
                        }
                        else {
                            Utility.asyncStepLogger('Ping Response at (' + new Date() + ')');
                        }
                    }
                }
            },

            registerDevice = function (isRetry) {
                if (asyncLogging) {
                    if (workerId > 0) {
                        Utility.asyncStepLogger(workerId + '\t Registering Device');
                    }
                    else {
                        Utility.asyncStepLogger('Registering Device');
                    }
                }

                var content = {
                    appId: appId,
                    deviceId: deviceId
                };

                if (peerId !== undefined) {
                    content.refresh = true;
                }
                else {
                    content.renew = true;
                }

                pushSendData({
                    type: asyncMessageType.DEVICE_REGISTER,
                    content: content
                });
            },

            handleDeviceRegisterMessage = function (recievedPeerId) {
                if (!isDeviceRegister) {
                    if (registerDeviceTimeoutId) {
                        clearTimeout(registerDeviceTimeoutId);
                    }

                    isDeviceRegister = true;
                    peerId = recievedPeerId;
                }

                /**
                 * If serverRegisteration == true we have to register
                 * on server then make async status ready
                 */
                if (serverRegisteration) {
                    if (isServerRegister && peerId === oldPeerId) {
                        fireEvent('asyncReady');
                        isServerRegister = true;
                        pushSendDataQueueHandler();

                        socketState = socketStateType.OPEN;
                        fireEvent('stateChange', {
                            socketState: socketState,
                            timeUntilReconnect: 0,
                            deviceRegister: isDeviceRegister,
                            serverRegister: isServerRegister,
                            peerId: peerId
                        });
                    }
                    else {
                        socketState = socketStateType.OPEN;
                        fireEvent('stateChange', {
                            socketState: socketState,
                            timeUntilReconnect: 0,
                            deviceRegister: isDeviceRegister,
                            serverRegister: isServerRegister,
                            peerId: peerId
                        });

                        registerServer();
                    }
                }
                else {
                    fireEvent('asyncReady');
                    isServerRegister = 'Not Needed';
                    pushSendDataQueueHandler();

                    if (asyncLogging) {
                        if (workerId > 0) {
                            Utility.asyncStepLogger(workerId + '\t Async is Ready');
                        }
                        else {
                            Utility.asyncStepLogger('Async is Ready');
                        }
                    }

                    socketState = socketStateType.OPEN;
                    fireEvent('stateChange', {
                        socketState: socketState,
                        timeUntilReconnect: 0,
                        deviceRegister: isDeviceRegister,
                        serverRegister: isServerRegister,
                        peerId: peerId
                    });
                }
            },

            registerServer = function () {

                if (asyncLogging) {
                    if (workerId > 0) {
                        Utility.asyncStepLogger(workerId + '\t Registering Server');
                    }
                    else {
                        Utility.asyncStepLogger('Registering Server');
                    }
                }

                var content = {
                    name: serverName
                };

                pushSendData({
                    type: asyncMessageType.SERVER_REGISTER,
                    content: content
                });

                registerServerTimeoutId = setTimeout(function () {
                    if (!isServerRegister) {
                        registerServer();
                    }
                }, connectionRetryInterval);
            },

            handleServerRegisterMessage = function (msg) {
                if (msg.senderName && msg.senderName === serverName) {
                    isServerRegister = true;

                    if (registerServerTimeoutId) {
                        clearTimeout(registerServerTimeoutId);
                    }

                    socketState = socketStateType.OPEN;
                    fireEvent('stateChange', {
                        socketState: socketState,
                        timeUntilReconnect: 0,
                        deviceRegister: isDeviceRegister,
                        serverRegister: isServerRegister,
                        peerId: peerId
                    });
                    fireEvent('asyncReady');

                    pushSendDataQueueHandler();

                    if (asyncLogging) {
                        if (workerId > 0) {
                            Utility.asyncStepLogger(workerId + '\t Async is Ready');
                        }
                        else {
                            Utility.asyncStepLogger('Async is Ready');
                        }
                    }
                }
                else {
                    isServerRegister = false;
                }
            },

            pushSendData = function (msg) {
                if (onSendLogging) {
                    asyncLogger('Send', msg);
                }

                switch (protocol) {
                    case 'websocket':
                        if (socketState === socketStateType.OPEN) {
                            socket.emit(msg);
                        }
                        else {
                            pushSendDataQueue.push(msg);
                        }
                        break;
                }
            },

            clearTimeouts = function () {
                registerDeviceTimeoutId && clearTimeout(registerDeviceTimeoutId);
                registerServerTimeoutId && clearTimeout(registerServerTimeoutId);
                checkIfSocketHasOpennedTimeoutId && clearTimeout(checkIfSocketHasOpennedTimeoutId);
                socketReconnectCheck && clearTimeout(socketReconnectCheck);
            },

            pushSendDataQueueHandler = function () {
                while (pushSendDataQueue.length > 0 && socketState === socketStateType.OPEN) {
                    var msg = pushSendDataQueue.splice(0, 1)[0];
                    pushSendData(msg);
                }
            },

            fireEvent = function (eventName, param, ack) {
                try {
                    if (ack) {
                        for (var id in eventCallbacks[eventName]) {
                            eventCallbacks[eventName][id](param, ack);
                        }
                    }
                    else {
                        for (var id in eventCallbacks[eventName]) {
                            eventCallbacks[eventName][id](param);
                        }
                    }
                }
                catch (e) {
                    fireEvent('error', {
                        errorCode: 999,
                        errorMessage: 'Unknown ERROR!',
                        errorEvent: e
                    });
                }
            };

        /*******************************************************
         *             P U B L I C   M E T H O D S             *
         *******************************************************/

        this.on = function (eventName, callback) {
            if (eventCallbacks[eventName]) {
                var id = Utility.generateUUID();
                eventCallbacks[eventName][id] = callback;
                return id;
            }
            if (eventName === 'connect' && socketState === socketStateType.OPEN) {
                callback(peerId);
            }
        };

        this.send = function (params, callback) {
            var messageType = (typeof params.type === 'number')
                ? params.type
                : (callback)
                    ? asyncMessageType.MESSAGE_SENDER_ACK_NEEDED
                    : asyncMessageType.MESSAGE;

            var socketData = {
                type: messageType,
                content: params.content
            };

            if (params.trackerId) {
                socketData.trackerId = params.trackerId;
            }

            lastMessageId += 1;
            var messageId = lastMessageId;

            if (messageType === asyncMessageType.MESSAGE_SENDER_ACK_NEEDED || messageType === asyncMessageType.MESSAGE_ACK_NEEDED) {
                ackCallback[messageId] = function () {
                    callback && callback();
                };
            }

            socketData.content.messageId = messageId;
            socketData.content.ttl = messageTtl;

            pushSendData(socketData);
        };

        this.getAsyncState = function () {
            return socketState;
        };

        this.getSendQueue = function () {
            return pushSendDataQueue;
        };

        this.getPeerId = function () {
            return peerId;
        };

        this.getServerName = function () {
            return serverName;
        };

        this.setServerName = function (newServerName) {
            serverName = newServerName;
        };

        this.setDeviceId = function (newDeviceId) {
            deviceId = newDeviceId;
        };

        this.close = function () {
            oldPeerId = peerId;
            isDeviceRegister = false;
            isSocketOpen = false;
            clearTimeouts();

            switch (protocol) {
                case 'websocket':
                    socketState = socketStateType.CLOSED;
                    fireEvent('stateChange', {
                        socketState: socketState,
                        timeUntilReconnect: 0,
                        deviceRegister: isDeviceRegister,
                        serverRegister: isServerRegister,
                        peerId: peerId
                    });

                    socketReconnectRetryInterval && clearTimeout(socketReconnectRetryInterval);
                    socket.close();
                    break;
            }
        };

        this.logout = function () {
            oldPeerId = peerId;
            peerId = undefined;
            isServerRegister = false;
            isDeviceRegister = false;
            isSocketOpen = false;
            deviceId = undefined;
            pushSendDataQueue = [];
            ackCallback = {};
            clearTimeouts();

            switch (protocol) {
                case 'websocket':
                    socketState = socketStateType.CLOSED;
                    fireEvent('stateChange', {
                        socketState: socketState,
                        timeUntilReconnect: 0,
                        deviceRegister: isDeviceRegister,
                        serverRegister: isServerRegister,
                        peerId: peerId
                    });

                    reconnectOnClose = false;

                    socket.close();
                    break;
            }
        };

        this.reconnectSocket = function () {
            oldPeerId = peerId;
            isDeviceRegister = false;
            isSocketOpen = false;
            clearTimeouts();

            socketState = socketStateType.CLOSED;
            fireEvent('stateChange', {
                socketState: socketState,
                timeUntilReconnect: 0,
                deviceRegister: isDeviceRegister,
                serverRegister: isServerRegister,
                peerId: peerId
            });

            socketReconnectRetryInterval && clearTimeout(socketReconnectRetryInterval);
            socket.close();

            socketReconnectRetryInterval = setTimeout(function () {
                retryStep = 4;
                socket.connect();
            }, 2000);
        };

        this.generateUUID = Utility.generateUUID;

        init();
    }

    if (typeof module !== 'undefined' && typeof module.exports != 'undefined') {
        module.exports = Async;
    }
    else {
        if (!window.POD) {
            window.POD = {};
        }
        window.POD.Async = Async;
    }
})();

},{"../utility/utility.js":45,"./socket.js":44}],44:[function(require,module,exports){
(function() {
  /*
   * Socket Module to connect and handle Socket functionalities
   * @module Socket
   *
   * @param {Object} params
   */

  function Socket(params) {

    if (typeof(WebSocket) === "undefined" && typeof(require) !== "undefined" && typeof(exports) !== "undefined") {
      WebSocket = require('isomorphic-ws');
    }

    /*******************************************************
     *          P R I V A T E   V A R I A B L E S          *
     *******************************************************/

    var address = params.socketAddress,
      wsConnectionWaitTime = params.wsConnectionWaitTime || 500,
      connectionCheckTimeout = params.connectionCheckTimeout || 10000,
      eventCallback = {},
      socket,
      waitForSocketToConnectTimeoutId,
      forceCloseSocket = false,
      forceCloseSocketTimeout,
      socketRealTimeStatusInterval,
      sendPingTimeout,
      socketCloseTimeout,
      forceCloseTimeout;

    /*******************************************************
     *            P R I V A T E   M E T H O D S            *
     *******************************************************/

    var init = function() {
        connect();
      },

      connect = function() {
        try {
          if (socket && socket.readyState == 1) {
            return;
          }

          socket = new WebSocket(address, []);

          socketRealTimeStatusInterval && clearInterval(socketRealTimeStatusInterval);
          socketRealTimeStatusInterval = setInterval(function() {
            switch (socket.readyState) {
              case 2:
                onCloseHandler(null);
                break;
              case 3:
                socketRealTimeStatusInterval && clearInterval(socketRealTimeStatusInterval);
                break;
            }
          }, 5000);

          socket.onopen = function(event) {
            waitForSocketToConnect(function() {
              eventCallback["open"]();
            });
          }

          socket.onmessage = function(event) {
            var messageData = JSON.parse(event.data);
            eventCallback["message"](messageData);

            /**
             * To avoid manually closing socket's connection
             */
            forceCloseSocket = false;

            socketCloseTimeout && clearTimeout(socketCloseTimeout);
            forceCloseTimeout && clearTimeout(forceCloseTimeout);

            socketCloseTimeout = setTimeout(function() {
              /**
               * If message's type is not 5, socket won't get any acknowledge packet,therefore
               * you may think that connection has been closed and you would force socket
               * to close, but before that you should make sure that connection is actually closed!
               * for that, you must send a ping message and if that message don't get any
               * responses too, you are allowed to manually kill socket connection.
               */
              ping();

              /**
               * We set forceCloseSocket as true so that if your ping's response don't make it
               * you close your socket
               */
              forceCloseSocket = true;

              /**
               * If type of messages are not 5, you won't get ant ACK packets
               * for that being said, we send a ping message to be sure of
               * socket connection's state. The ping message should have an
               * ACK, if not, you're allowed to close your socket after
               * 4 * [connectionCheckTimeout] seconds
               */
              forceCloseTimeout = setTimeout(function() {
                if (forceCloseSocket) {
                  socket.close();
                }
              }, connectionCheckTimeout);

            }, connectionCheckTimeout * 1.5);
          }

          socket.onclose = function(event) {
            onCloseHandler(event);
          }

          socket.onerror = function(event) {
            eventCallback["error"](event);
          }
        } catch (error) {
          eventCallback["customError"]({
            errorCode: 4000,
            errorMessage: "ERROR in WEBSOCKET!",
            errorEvent: error
          });
        }
      },

      onCloseHandler = function(event) {
        sendPingTimeout && clearTimeout(sendPingTimeout);
        socketCloseTimeout && clearTimeout(socketCloseTimeout);
        forceCloseTimeout && clearTimeout(forceCloseTimeout);
        eventCallback["close"](event);
      },

      ping = function() {
        sendData({
          type: 0
        });
      },

      waitForSocketToConnect = function(callback) {
        waitForSocketToConnectTimeoutId && clearTimeout(waitForSocketToConnectTimeoutId);

        if (socket.readyState === 1) {
          callback();
        } else {
          waitForSocketToConnectTimeoutId = setTimeout(function() {
            if (socket.readyState === 1) {
              callback();
            } else {
              waitForSocketToConnect(callback);
            }
          }, wsConnectionWaitTime);
        }
      },

      sendData = function(params) {
        var data = {
          type: params.type
        };

        if (params.trackerId) {
          data.trackerId = params.trackerId;
        }

        sendPingTimeout && clearTimeout(sendPingTimeout);
        sendPingTimeout = setTimeout(function() {
          ping();
        }, connectionCheckTimeout);

        try {
          if (params.content) {
            data.content = JSON.stringify(params.content);
          }

          if (socket.readyState === 1) {
            socket.send(JSON.stringify(data));
          }
        } catch (error) {
          eventCallback["customError"]({
            errorCode: 4004,
            errorMessage: "Error in Socket sendData!",
            errorEvent: error
          });
        }
      };

    /*******************************************************
     *             P U B L I C   M E T H O D S             *
     *******************************************************/

    this.on = function(messageName, callback) {
      eventCallback[messageName] = callback;
    }

    this.emit = sendData;

    this.connect = function() {
      connect();
    }

    this.close = function() {
      sendPingTimeout && clearTimeout(sendPingTimeout);
      socketCloseTimeout && clearTimeout(socketCloseTimeout);
      forceCloseTimeout && clearTimeout(forceCloseTimeout);
      socket.close();
    }

    init();
  }

  if (typeof module !== 'undefined' && typeof module.exports != "undefined") {
    module.exports = Socket;
  } else {
    if (!window.POD) {
      window.POD = {};
    }
    window.POD.Socket = Socket;
  }

})();

},{"isomorphic-ws":42}],45:[function(require,module,exports){
(function (global){
(function() {
  /**
   * General Utilities
   */
  function Utility() {
    /**
     * Checks if Client is using NodeJS or not
     * @return {boolean}
     */
    this.isNode = function() {
      // return (typeof module !== 'undefined' && typeof module.exports != "undefined");
      return (typeof global !== "undefined" && ({}).toString.call(global) === '[object global]');
    }

    /**
     * Generates Random String
     * @param   {int}     sectionCount
     * @return  {string}
     */
    this.generateUUID = function(sectionCount) {
      var d = new Date().getTime();
      var textData = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

      if (sectionCount == 1) {
        textData = 'xxxxxxxx';
      }

      if (sectionCount == 2) {
        textData = 'xxxxxxxx-xxxx';
      }

      if (sectionCount == 3) {
        textData = 'xxxxxxxx-xxxx-4xxx';
      }

      if (sectionCount == 4) {
        textData = 'xxxxxxxx-xxxx-4xxx-yxxx';
      }

      var uuid = textData.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);

        return (
          c == 'x' ?
          r :
          (r & 0x7 | 0x8)).toString(16);
      });
      return uuid;
    };

    /**
     * Prints Socket Status on Both Browser and Linux Terminal
     * @param {object} params Socket status + current msg + send queue
     * @return
     */
    this.asyncLogger = function(params) {
      var type = params.type,
        msg = params.msg,
        peerId = params.peerId,
        deviceId = params.deviceId,
        isSocketOpen = params.isSocketOpen,
        isDeviceRegister = params.isDeviceRegister,
        isServerRegister = params.isServerRegister,
        socketState = params.socketState,
        pushSendDataQueue = params.pushSendDataQueue,
        workerId = params.workerId,
        protocol = params.protocol || "websocket",
        BgColor;

      switch (type) {
        case "Send":
          BgColor = 44;
          FgColor = 34;
          ColorCSS = "#4c8aff";
          break;

        case "Receive":
          BgColor = 45;
          FgColor = 35;
          ColorCSS = "#aa386d";
          break;

        case "Error":
          BgColor = 41;
          FgColor = 31;
          ColorCSS = "#ff0043";
          break;

        default:
          BgColor = 45;
          ColorCSS = "#212121";
          break;
      }

      switch (protocol) {
        case "websocket":
          if (typeof global !== "undefined" && ({}).toString.call(global) === '[object global]') {
            console.log("\n");
            console.log("\x1b[" + BgColor + "m\x1b[8m%s\x1b[0m", "################################################################");
            console.log("\x1b[" + BgColor + "m\x1b[8m##################\x1b[0m\x1b[37m\x1b[" + BgColor + "m S O C K E T    S T A T U S \x1b[0m\x1b[" + BgColor + "m\x1b[8m##################\x1b[0m");
            console.log("\x1b[" + BgColor + "m\x1b[8m%s\x1b[0m", "################################################################");
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t\t\t\t\t\t\t      \x1b[" + BgColor + "m\x1b[8m##\x1b[0m");
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[1m%s\x1b[0m", " PEER ID\t\t", peerId);
            if (workerId > 0) {
              console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[1m%s\x1b[0m", " WORKER ID\t\t", workerId);
            }
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[1m%s\x1b[0m", " DEVICE ID\t\t", deviceId);
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[1m%s\x1b[0m", " IS SOCKET OPEN\t", isSocketOpen);
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[1m%s\x1b[0m", " DEVICE REGISTER\t", isDeviceRegister);
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[1m%s\x1b[0m", " SERVER REGISTER\t", isServerRegister);
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[1m%s\x1b[0m", " SOCKET STATE\t", socketState);
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[" + FgColor + "m%s\x1b[0m ", " CURRENT MESSAGE\t", type);
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m");

            Object.keys(msg).forEach(function(key) {
              if (typeof msg[key] === 'object') {
                console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t \x1b[1m-\x1b[0m \x1b[35m%s\x1b[0m", key);
                Object.keys(msg[key]).forEach(function(k) {
                  console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t   \x1b[1m•\x1b[0m \x1b[35m%s\x1b[0m : \x1b[33m%s\x1b[0m", k, msg[key][k]);
                });
              } else {
                console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t \x1b[1m•\x1b[0m \x1b[35m%s\x1b[0m : \x1b[33m%s\x1b[0m", key, msg[key]);
              }
            });

            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m");

            if (pushSendDataQueue.length > 0) {
              console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m", " SEND QUEUE");
              console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m");
              Object.keys(pushSendDataQueue).forEach(function(key) {
                if (typeof pushSendDataQueue[key] === 'object') {
                  console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t \x1b[1m-\x1b[0m \x1b[35m%s\x1b[0m", key);
                  Object.keys(pushSendDataQueue[key]).forEach(function(k) {
                    console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t   \x1b[1m•\x1b[0m \x1b[35m%s\x1b[0m : \x1b[36m%s\x1b[0m", k, JSON.stringify(pushSendDataQueue[key][k]));
                  });
                } else {
                  console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t \x1b[1m•\x1b[0m \x1b[35m%s\x1b[0m : \x1b[33m%s\x1b[0m", key, pushSendDataQueue[key]);
                }
              });

            } else {
              console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[1m%s\x1b[0m ", " SEND QUEUE\t\t", "Empty");
            }

            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t\t\t\t\t\t\t      \x1b[" + BgColor + "m\x1b[8m##\x1b[0m");
            console.log("\x1b[" + BgColor + "m\x1b[8m%s\x1b[0m", "################################################################");
            console.log("\n");
          } else {
            console.log("\n");
            console.log("%cS O C K E T    S T A T U S", 'background: ' + ColorCSS + '; padding: 10px 142px; font-weight: bold; font-size: 18px; color: #fff;');
            console.log("\n");
            console.log("%c   PEER ID\t\t %c" + peerId, 'color: #444', 'color: #ffac28; font-weight: bold');
            console.log("%c   DEVICE ID\t\t %c" + deviceId, 'color: #444', 'color: #ffac28; font-weight: bold');
            console.log("%c   IS SOCKET OPEN\t %c" + isSocketOpen, 'color: #444', 'color: #ffac28; font-weight: bold');
            console.log("%c   DEVICE REGISTER\t %c" + isDeviceRegister, 'color: #444', 'color: #ffac28; font-weight: bold');
            console.log("%c   SERVER REGISTER\t %c" + isServerRegister, 'color: #444', 'color: #ffac28; font-weight: bold');
            console.log("%c   SOCKET STATE\t\t %c" + socketState, 'color: #444', 'color: #ffac28; font-weight: bold');
            console.log("%c   CURRENT MESSAGE\t %c" + type, 'color: #444', 'color: #aa386d; font-weight: bold');
            console.log("\n");

            Object.keys(msg).forEach(function(key) {
              if (typeof msg[key] === 'object') {
                console.log("%c \t-" + key, 'color: #777');
                Object.keys(msg[key]).forEach(function(k) {
                  console.log("%c \t  •" + k + " : %c" + msg[key][k], 'color: #777', 'color: #f23; font-weight: bold');
                });
              } else {
                console.log("%c \t•" + key + " : %c" + msg[key], 'color: #777', 'color: #f23; font-weight: bold');
              }
            });

            console.log("\n");

            if (pushSendDataQueue.length > 0) {
              console.log("%c   SEND QUEUE", 'color: #444');
              console.log("\n");
              Object.keys(pushSendDataQueue).forEach(function(key) {
                if (typeof pushSendDataQueue[key] === 'object') {
                  console.log("%c \t-" + key, 'color: #777');
                  Object.keys(pushSendDataQueue[key]).forEach(function(k) {
                    console.log("%c \t  •" + k + " : %c" + JSON.stringify(pushSendDataQueue[key][k]), 'color: #777', 'color: #999; font-weight: bold');
                  });
                } else {
                  console.log("%c \t•" + key + " : %c" + pushSendDataQueue[key], 'color: #777', 'color: #999; font-weight: bold');
                }
              });

            } else {
              console.log("%c   SEND QUEUE\t\t %cEmpty", 'color: #444', 'color: #000; font-weight: bold');
            }

            console.log("\n");
            console.log("%c ", 'font-weight: bold; font-size: 3px; border-left: solid 540px ' + ColorCSS + ';');
            console.log("\n");
          }
          break;

        case "queue":
          if (typeof global !== "undefined" && ({}).toString.call(global) === '[object global]') {
            console.log("\n");
            console.log("\x1b[" + BgColor + "m\x1b[8m%s\x1b[0m", "################################################################");
            console.log("\x1b[" + BgColor + "m\x1b[8m##################\x1b[0m\x1b[37m\x1b[" + BgColor + "m Q U E U E      S T A T U S \x1b[0m\x1b[" + BgColor + "m\x1b[8m##################\x1b[0m");
            console.log("\x1b[" + BgColor + "m\x1b[8m%s\x1b[0m", "################################################################");
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t\t\t\t\t\t\t      \x1b[" + BgColor + "m\x1b[8m##\x1b[0m");

            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[1m%s\x1b[0m", " QUEUE STATE\t\t", socketState);
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[" + FgColor + "m%s\x1b[0m ", " CURRENT MESSAGE\t", type);
            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m");

            Object.keys(msg).forEach(function(key) {
              if (typeof msg[key] === 'object') {
                console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t \x1b[1m-\x1b[0m \x1b[35m%s\x1b[0m", key);
                Object.keys(msg[key]).forEach(function(k) {
                  console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t   \x1b[1m•\x1b[0m \x1b[35m%s\x1b[0m : \x1b[33m%s\x1b[0m", k, msg[key][k]);
                });
              } else {
                console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t \x1b[1m•\x1b[0m \x1b[35m%s\x1b[0m : \x1b[33m%s\x1b[0m", key, msg[key]);
              }
            });

            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m");

            if (pushSendDataQueue.length > 0) {
              console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m", " SEND QUEUE");
              console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m");
              Object.keys(pushSendDataQueue).forEach(function(key) {
                if (typeof pushSendDataQueue[key] === 'object') {
                  console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t \x1b[1m-\x1b[0m \x1b[35m%s\x1b[0m", key);
                  Object.keys(pushSendDataQueue[key]).forEach(function(k) {
                    console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t   \x1b[1m•\x1b[0m \x1b[35m%s\x1b[0m : \x1b[36m%s\x1b[0m", k, JSON.stringify(pushSendDataQueue[key][k]));
                  });
                } else {
                  console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t \x1b[1m•\x1b[0m \x1b[35m%s\x1b[0m : \x1b[33m%s\x1b[0m", key, pushSendDataQueue[key]);
                }
              });

            } else {
              console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \x1b[2m%s\x1b[0m \x1b[1m%s\x1b[0m ", " SEND QUEUE\t\t", "Empty");
            }

            console.log("\x1b[" + BgColor + "m\x1b[8m##\x1b[0m \t\t\t\t\t\t\t      \x1b[" + BgColor + "m\x1b[8m##\x1b[0m");
            console.log("\x1b[" + BgColor + "m\x1b[8m%s\x1b[0m", "################################################################");
            console.log("\n");
          } else {
            console.log("\n");
            console.log("%cQ U E U E      S T A T U S", 'background: ' + ColorCSS + '; padding: 10px 142px; font-weight: bold; font-size: 18px; color: #fff;');
            console.log("\n");
            console.log("%c   QUEUE STATE\t\t %c" + socketState, 'color: #444', 'color: #ffac28; font-weight: bold');
            console.log("%c   CURRENT MESSAGE\t %c" + type, 'color: #444', 'color: #aa386d; font-weight: bold');
            console.log("\n");

            Object.keys(msg).forEach(function(key) {
              if (typeof msg[key] === 'object') {
                console.log("%c \t-" + key, 'color: #777');
                Object.keys(msg[key]).forEach(function(k) {
                  console.log("%c \t  •" + k + " : %c" + msg[key][k], 'color: #777', 'color: #f23; font-weight: bold');
                });
              } else {
                console.log("%c \t•" + key + " : %c" + msg[key], 'color: #777', 'color: #f23; font-weight: bold');
              }
            });

            console.log("\n");

            if (pushSendDataQueue.length > 0) {
              console.log("%c   SEND QUEUE", 'color: #444');
              console.log("\n");
              Object.keys(pushSendDataQueue).forEach(function(key) {
                if (typeof pushSendDataQueue[key] === 'object') {
                  console.log("%c \t-" + key, 'color: #777');
                  Object.keys(pushSendDataQueue[key]).forEach(function(k) {
                    console.log("%c \t  •" + k + " : %c" + JSON.stringify(pushSendDataQueue[key][k]), 'color: #777', 'color: #999; font-weight: bold');
                  });
                } else {
                  console.log("%c \t•" + key + " : %c" + pushSendDataQueue[key], 'color: #777', 'color: #999; font-weight: bold');
                }
              });

            } else {
              console.log("%c   SEND QUEUE\t\t %cEmpty", 'color: #444', 'color: #000; font-weight: bold');
            }

            console.log("\n");
            console.log("%c ", 'font-weight: bold; font-size: 3px; border-left: solid 540px ' + ColorCSS + ';');
            console.log("\n");
          }
          break;
      }
    }

    /**
     * Prints Custom Message in console
     * @param {string} message Message to be logged in terminal
     * @return
     */
    this.asyncStepLogger = function(message) {
      if (typeof navigator == "undefined") {
        console.log("\x1b[90m    ☰ \x1b[0m\x1b[90m%s\x1b[0m", message);
      } else {
        console.log("%c   " + message, 'border-left: solid #666 10px; color: #666;');
      }
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports != "undefined") {
    module.exports = Utility;
  } else {
    if (!window.POD) {
      window.POD = {};
    }
    window.POD.AsyncUtility = Utility;
  }
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],46:[function(require,module,exports){
(function () {
    /*
     * Pod Chat Module
     * @module chat
     *
     * @param {Object} params
     */
    var Async,
        ChatUtility,
        Dexie;

    function Chat(params) {
        if (typeof(require) !== 'undefined' && typeof(exports) !== 'undefined') {
            Async = require('podasync-ws-only'),
                ChatUtility = require('./utility/utility.js'),
                Dexie = require('dexie').default || require('dexie');

            var QueryString = require('querystring');
        }
        else {
            Async = window.POD.Async,
                ChatUtility = window.POD.ChatUtility,
                Dexie = window.Dexie;
        }

        /*******************************************************
         *          P R I V A T E   V A R I A B L E S          *
         *******************************************************/

        var Utility = new ChatUtility();

        var asyncClient,
            peerId,
            oldPeerId,
            userInfo,
            token = params.token,
            generalTypeCode = params.typeCode || 'default',
            mapApiKey = params.mapApiKey || '8b77db18704aa646ee5aaea13e7370f4f88b9e8c',
            deviceId,
            productEnv = (typeof navigator != 'undefined') ? navigator.product : 'undefined',
            db,
            queueDb,
            hasCache = productEnv != 'ReactNative' && typeof Dexie != 'undefined',
            enableCache = (params.enableCache && typeof params.enableCache === 'boolean') ? params.enableCache : false,
            canUseCache = hasCache && enableCache,
            isCacheReady = false,
            cacheDeletingInProgress = false,
            cacheExpireTime = params.cacheExpireTime || 2 * 24 * 60 * 60 * 1000,
            cacheSecret = '',
            cacheSyncWorker,
            grantDeviceIdFromSSO = (params.grantDeviceIdFromSSO && typeof params.grantDeviceIdFromSSO === 'boolean')
                ? params.grantDeviceIdFromSSO
                : false,
            eventCallbacks = {
                connect: {},
                disconnect: {},
                reconnect: {},
                messageEvents: {},
                threadEvents: {},
                contactEvents: {},
                botEvents: {},
                fileUploadEvents: {},
                systemEvents: {},
                chatReady: {},
                error: {},
                chatState: {}
            },
            messagesCallbacks = {},
            sendMessageCallbacks = {},
            threadCallbacks = {},
            chatMessageVOTypes = {
                CREATE_THREAD: 1,
                MESSAGE: 2,
                SENT: 3,
                DELIVERY: 4,
                SEEN: 5,
                PING: 6,
                BLOCK: 7,
                UNBLOCK: 8,
                LEAVE_THREAD: 9,
                ADD_PARTICIPANT: 11,
                GET_STATUS: 12,
                GET_CONTACTS: 13,
                GET_THREADS: 14,
                GET_HISTORY: 15,
                CHANGE_TYPE: 16,
                REMOVED_FROM_THREAD: 17,
                REMOVE_PARTICIPANT: 18,
                MUTE_THREAD: 19,
                UNMUTE_THREAD: 20,
                UPDATE_THREAD_INFO: 21,
                FORWARD_MESSAGE: 22,
                USER_INFO: 23,
                USER_STATUS: 24,
                GET_BLOCKED: 25,
                RELATION_INFO: 26,
                THREAD_PARTICIPANTS: 27,
                EDIT_MESSAGE: 28,
                DELETE_MESSAGE: 29,
                THREAD_INFO_UPDATED: 30,
                LAST_SEEN_UPDATED: 31,
                GET_MESSAGE_DELEVERY_PARTICIPANTS: 32,
                GET_MESSAGE_SEEN_PARTICIPANTS: 33,
                BOT_MESSAGE: 40,
                SPAM_PV_THREAD: 41,
                SET_ROLE_TO_USER: 42,
                CLEAR_HISTORY: 44,
                SYSTEM_MESSAGE: 46,
                GET_NOT_SEEN_DURATION: 47,
                LOGOUT: 100,
                ERROR: 999
            },
            inviteeVOidTypes = {
                TO_BE_USER_SSO_ID: 1,
                TO_BE_USER_CONTACT_ID: 2,
                TO_BE_USER_CELLPHONE_NUMBER: 3,
                TO_BE_USER_USERNAME: 4,
                TO_BE_USER_ID: 5
            },
            createThreadTypes = {
                NORMAL: 0,
                OWNER_GROUP: 1,
                PUBLIC_GROUP: 2,
                CHANNEL_GROUP: 4,
                CHANNEL: 8,
                NOTIFICATION_CHANNEL: 16
            },
            systemMessageTypes = {
                IS_TYPING: '1',
                RECORD_VOICE: '2',
                UPLOAD_PICTURE: '3',
                UPLOAD_VIDEO: '4',
                UPLOAD_SOUND: '5',
                UPLOAD_FILE: '6'
            },
            systemMessageIntervalPitch = params.systemMessageIntervalPitch || 1000,
            isTypingInterval,
            recordingVoiceInterval,
            upoadingInterval,
            protocol = params.protocol || 'websocket',
            queueHost = params.queueHost,
            queuePort = params.queuePort,
            queueUsername = params.queueUsername,
            queuePassword = params.queuePassword,
            queueReceive = params.queueReceive,
            queueSend = params.queueSend,
            queueConnectionTimeout = params.queueConnectionTimeout,
            socketAddress = params.socketAddress,
            serverName = params.serverName || '',
            wsConnectionWaitTime = params.wsConnectionWaitTime,
            connectionRetryInterval = params.connectionRetryInterval,
            msgPriority = params.msgPriority || 1,
            messageTtl = params.messageTtl || 10000,
            reconnectOnClose = params.reconnectOnClose,
            asyncLogging = params.asyncLogging,
            chatPingMessageInterval = 20000,
            sendPingTimeout,
            getUserInfoTimeout,
            config = {
                getHistoryCount: 50
            },
            SERVICE_ADDRESSES = {
                SSO_ADDRESS: params.ssoHost || 'http://172.16.110.76',
                PLATFORM_ADDRESS: params.platformHost || 'http://172.16.106.26:8080/hamsam',
                FILESERVER_ADDRESS: params.fileServer || 'http://172.16.106.26:8080/hamsam',
                POD_DRIVE_ADDRESS: params.podDrive || 'http://172.16.106.26:8080/hamsam',
                MAP_ADDRESS: params.mapServer || 'https://api.neshan.org/v1'
            },
            SERVICES_PATH = {
                // Grant Devices
                SSO_DEVICES: '/oauth2/grants/devices',
                SSO_GENERATE_KEY: '/handshake/users/',
                SSO_GET_KEY: '/handshake/keys/',
                // Contacts
                ADD_CONTACTS: '/nzh/addContacts',
                UPDATE_CONTACTS: '/nzh/updateContacts',
                REMOVE_CONTACTS: '/nzh/removeContacts',
                SEARCH_CONTACTS: '/nzh/listContacts',
                // File/Image Upload and Download
                UPLOAD_IMAGE: '/nzh/uploadImage',
                GET_IMAGE: '/nzh/image/',
                UPLOAD_FILE: '/nzh/uploadFile',
                GET_FILE: '/nzh/file/',
                // POD Drive Services
                DRIVE_UPLOAD_FILE: '/nzh/drive/uploadFile',
                DRIVE_UPLOAD_FILE_FROM_URL: '/nzh/drive/uploadFileFromUrl',
                DRIVE_UPLOAD_IMAGE: '/nzh/drive/uploadImage',
                DRIVE_DOWNLOAD_FILE: '/nzh/drive/downloadFile',
                DRIVE_DOWNLOAD_IMAGE: '/nzh/drive/downloadImage',
                // Neshan Map
                REVERSE: '/reverse',
                SEARCH: '/search',
                ROUTING: '/routing',
                STATIC_IMAGE: '/static'
            },
            imageMimeTypes = [
                'image/bmp',
                'image/png',
                'image/tiff',
                // 'image/gif',
                'image/x-icon',
                'image/jpeg',
                'image/webp'
                // 'image/svg+xml'
            ],
            imageExtentions = [
                'bmp',
                'png',
                'tiff',
                'tiff2',
                // 'gif',
                'ico',
                'jpg',
                'jpeg',
                'webp'
            ],
            CHAT_ERRORS = {
                // Socket Errors
                6000: 'No Active Device found for this Token!',
                6001: 'Invalid Token!',
                6002: 'User not found!',
                // Get User Info Errors
                6100: 'Cant get UserInfo!',
                6101: 'Getting User Info Retry Count exceeded 5 times; Connection Can Not Been Estabilished!',
                // Http Request Errors
                6200: 'Network Error',
                6201: 'URL is not clarified!',
                // File Uploads Errors
                6300: 'Error in uploading File!',
                6301: 'Not an image!',
                6302: 'No file has been selected!',
                6303: 'File upload has been canceled!',
                // Cache Database Errors
                6600: 'Your Environment doesn\'t have Databse compatibility',
                6601: 'Database is not defined! (missing db)',
                6602: 'Database Error',
                // Map Errors
                6700: 'You should Enter a Center Location like {lat: " ", lng: " "}'
            },
            getUserInfoRetry = 5,
            getUserInfoRetryCount = 0,
            asyncStateTypes = {
                0: 'CONNECTING',
                1: 'CONNECTED',
                2: 'CLOSING',
                3: 'CLOSED'
            },
            chatState = false,
            chatFullStateObject = {},
            httpRequestObject = {},
            connectionCheckTimeout = params.connectionCheckTimeout,
            connectionCheckTimeoutThreshold = params.connectionCheckTimeoutThreshold,
            httpRequestTimeout = (params.httpRequestTimeout >= 0) ? params.httpRequestTimeout : 30000,
            httpUploadRequestTimeout = (params.httpUploadRequestTimeout >= 0) ? params.httpUploadRequestTimeout : 0,
            actualTimingLog = (params.asyncLogging.actualTiming && typeof params.asyncLogging.actualTiming === 'boolean')
                ? params.asyncLogging.actualTiming
                : false,
            minIntegerValue = Number.MAX_SAFE_INTEGER * -1,
            maxIntegerValue = Number.MAX_SAFE_INTEGER * 1,
            chatSendQueue = [],
            chatWaitQueue = [],
            chatUploadQueue = [],
            chatSendQueueHandlerTimeout,
            fullResponseObject = params.fullResponseObject || false;

        /*******************************************************
         *            P R I V A T E   M E T H O D S            *
         *******************************************************/

        var init = function () {
                /**
                 * Initialize Cache Databases
                 */
                startCacheDatabases(function () {
                    if (grantDeviceIdFromSSO) {
                        var getDeviceIdWithTokenTime = new Date().getTime();
                        getDeviceIdWithToken(function (retrievedDeviceId) {
                            if (actualTimingLog) {
                                Utility.chatStepLogger('Get Device ID ', new Date().getTime() - getDeviceIdWithTokenTime);
                            }

                            deviceId = retrievedDeviceId;

                            initAsync();
                        });
                    }
                    else {
                        initAsync();
                    }
                });
            },

            /**
             * Initialize Async
             *
             * Initializes Async module and sets proper callbacks
             *
             * @access private
             *
             * @return {undefined}
             * @return {undefined}
             */
            initAsync = function () {
                var asyncGetReadyTime = new Date().getTime();

                asyncClient = new Async({
                    protocol: protocol,
                    queueHost: queueHost,
                    queuePort: queuePort,
                    queueUsername: queueUsername,
                    queuePassword: queuePassword,
                    queueReceive: queueReceive,
                    queueSend: queueSend,
                    queueConnectionTimeout: queueConnectionTimeout,
                    socketAddress: socketAddress,
                    serverName: serverName,
                    deviceId: deviceId,
                    wsConnectionWaitTime: wsConnectionWaitTime,
                    connectionRetryInterval: connectionRetryInterval,
                    connectionCheckTimeout: connectionCheckTimeout,
                    connectionCheckTimeoutThreshold: connectionCheckTimeoutThreshold,
                    messageTtl: messageTtl,
                    reconnectOnClose: reconnectOnClose,
                    asyncLogging: asyncLogging
                });

                asyncClient.on('asyncReady', function () {
                    if (actualTimingLog) {
                        Utility.chatStepLogger('Async Connection ', new Date().getTime() - asyncGetReadyTime);
                    }

                    peerId = asyncClient.getPeerId();

                    if (!userInfo) {
                        var getUserInfoTime = new Date().getTime();

                        getUserInfo(function (userInfoResult) {
                            if (actualTimingLog) {
                                Utility.chatStepLogger('Get User Info ', new Date().getTime() - getUserInfoTime);
                            }
                            if (!userInfoResult.hasError) {
                                userInfo = userInfoResult.result.user;

                                getAllThreadList({
                                    summary: true,
                                    cache: false
                                });

                                /**
                                 * Check if user has KeyId stored in their cache or not?
                                 */
                                if (canUseCache) {
                                    if (db) {
                                        db.users
                                            .where('id')
                                            .equals(parseInt(userInfo.id))
                                            .toArray()
                                            .then(function (users) {
                                                if (users.length > 0 && typeof users[0].keyId != 'undefined') {
                                                    var user = users[0];

                                                    getEncryptionKey({
                                                        keyId: user.keyId
                                                    }, function (result) {
                                                        if (!result.hasError) {
                                                            cacheSecret = result.secretKey;

                                                            chatState = true;
                                                            fireEvent('chatReady');
                                                            chatSendQueueHandler();
                                                        }
                                                        else {
                                                            if (result.message != '') {
                                                                try {
                                                                    var response = JSON.parse(result.message);
                                                                    if (response.error == 'invalid_param') {
                                                                        generateEncryptionKey({
                                                                            keyAlgorithm: 'AES',
                                                                            keySize: 256
                                                                        });
                                                                    }
                                                                }
                                                                catch (e) {
                                                                    console.log(e);
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                                else {
                                                    generateEncryptionKey({
                                                        keyAlgorithm: 'AES',
                                                        keySize: 256
                                                    }, function () {
                                                        chatState = true;
                                                        fireEvent('chatReady');
                                                        chatSendQueueHandler();
                                                    });
                                                }
                                            })
                                            .catch(function (error) {
                                                fireEvent('error', {
                                                    code: error.errorCode,
                                                    message: error.errorMessage,
                                                    error: error
                                                });
                                            });
                                    }
                                    else {
                                        fireEvent('error', {
                                            code: 6601,
                                            message: CHAT_ERRORS[6601],
                                            error: null
                                        });
                                    }
                                }
                                else {
                                    chatState = true;
                                    fireEvent('chatReady');
                                    chatSendQueueHandler();
                                }
                            }
                        });
                    }
                    else if (userInfo.id > 0) {
                        chatState = true;
                        fireEvent('chatReady');
                        chatSendQueueHandler();
                    }
                });

                asyncClient.on('stateChange', function (state) {
                    fireEvent('chatState', state);
                    chatFullStateObject = state;

                    switch (state.socketState) {
                        case 1: // CONNECTED
                            if (state.deviceRegister && state.serverRegister) {
                                chatState = true;
                                ping();
                            }
                            break;
                        case 0: // CONNECTING
                        case 2: // CLOSING
                        case 3: // CLOSED
                            chatState = false;
                            break;
                    }
                });

                asyncClient.on('connect', function (newPeerId) {
                    asyncGetReadyTime = new Date().getTime();
                    peerId = newPeerId;
                    fireEvent('connect');
                    ping();
                });

                asyncClient.on('disconnect', function (event) {
                    oldPeerId = peerId;
                    peerId = undefined;
                    fireEvent('disconnect', event);
                });

                asyncClient.on('reconnect', function (newPeerId) {
                    peerId = newPeerId;
                    fireEvent('reconnect');
                });

                asyncClient.on('message', function (params, ack) {
                    receivedAsyncMessageHandler(params);
                    ack && ack();
                });

                asyncClient.on('error', function (error) {
                    fireEvent('error', {
                        code: error.errorCode,
                        message: error.errorMessage,
                        error: error.errorEvent
                    });
                });
            },

            /**
             * Get Device Id With Token
             *
             * If ssoGrantDevicesAddress set as TRUE, chat agent gets Device ID
             * from SSO server and passes it to Async Module
             *
             * @access private
             *
             * @param {function}  callback    The callback function to run after getting Device Id
             *
             * @return {undefined}
             */
            getDeviceIdWithToken = function (callback) {
                var deviceId;

                var params = {
                    url: SERVICE_ADDRESSES.SSO_ADDRESS + SERVICES_PATH.SSO_DEVICES,
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                };

                httpRequest(params, function (result) {
                    if (!result.hasError) {
                        var devices = JSON.parse(result.result.responseText).devices;
                        if (devices && devices.length > 0) {
                            for (var i = 0; i < devices.length; i++) {
                                if (devices[i].current) {
                                    deviceId = devices[i].uid;
                                    break;
                                }
                            }

                            if (!deviceId) {
                                fireEvent('error', {
                                    code: 6000,
                                    message: CHAT_ERRORS[6000],
                                    error: null
                                });
                            }
                            else {
                                callback(deviceId);
                            }
                        }
                        else {
                            fireEvent('error', {
                                code: 6001,
                                message: CHAT_ERRORS[6001],
                                error: null
                            });
                        }
                    }
                    else {
                        fireEvent('error', {
                            code: result.errorCode,
                            message: result.errorMessage,
                            error: result
                        });
                    }
                });
            },

            /**
             * Handshake with SSO to get user's keys
             *
             * In order to Encrypt and Decrypt cache we need a key.
             * We can retrieve encryption keys from SSO, all we
             * need to do is to do a handshake with SSO and
             * get the keys.
             *
             * @access private
             *
             * @param {function}  callback    The callback function to run after Generating Keys
             *
             * @return {undefined}
             */
            generateEncryptionKey = function (params, callback) {
                var data = {
                    validity: 10 * 365 * 24 * 60 * 60, // 10 Years
                    renew: false,
                    keyAlgorithm: 'aes',
                    keySize: 256
                };

                if (params) {
                    if (params.keyAlgorithm != 'undefined') {
                        data.keyAlgorithm = params.keyAlgorithm;
                    }

                    if (parseInt(params.keySize) > 0) {
                        data.keySize = params.keySize;
                    }
                }

                var httpRequestParams = {
                    url: SERVICE_ADDRESSES.SSO_ADDRESS + SERVICES_PATH.SSO_GENERATE_KEY,
                    method: 'POST',
                    data: data,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                };

                httpRequest(httpRequestParams, function (result) {
                    if (!result.hasError) {
                        try {
                            var response = JSON.parse(result.result.responseText);
                        }
                        catch (e) {
                            console.log(e);
                        }

                        /**
                         * Save new Key Id in cache and update cacheSecret
                         */
                        if (canUseCache) {
                            if (db) {
                                db.users
                                    .update(userInfo.id, {keyId: response.keyId})
                                    .then(function () {
                                        getEncryptionKey({
                                            keyId: response.keyId
                                        }, function (result) {
                                            if (!result.hasError) {
                                                cacheSecret = result.secretKey;
                                                callback && callback();
                                            }
                                        });
                                    })
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }
                    }
                    else {
                        fireEvent('error', {
                            code: result.error,
                            message: result.error_description,
                            error: result
                        });
                    }
                });
            },

            /**
             * Get Encryption Keys by KeyId
             *
             * In order to Encrypt and Decrypt cache we need a key.
             * We can retrieve encryption keys from SSO by sending
             * KeyId to SSO and get related keys
             *
             * @access private
             *
             * @param {function}  callback    The callback function to run after getting Keys
             *
             * @return {undefined}
             */
            getEncryptionKey = function (params, callback) {
                var keyId;

                if (params) {
                    if (params.keyId != 'undefined') {
                        keyId = params.keyId;

                        var httpRequestParams = {
                            url: SERVICE_ADDRESSES.SSO_ADDRESS + SERVICES_PATH.SSO_GET_KEY + keyId,
                            method: 'GET',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            }
                        };

                        httpRequest(httpRequestParams, function (result) {
                            if (!result.hasError) {
                                try {
                                    var response = JSON.parse(result.result.responseText);
                                }
                                catch (e) {
                                    console.log(e);
                                }

                                callback && callback({
                                    hasError: false,
                                    secretKey: response.secretKey
                                });
                            }
                            else {
                                callback && callback({
                                    hasError: true,
                                    code: result.errorCode,
                                    message: result.errorMessage
                                });

                                fireEvent('error', {
                                    code: result.errorCode,
                                    message: result.errorMessage,
                                    error: result
                                });
                            }
                        });
                    }
                }
            },

            /**
             * HTTP Request class
             *
             * Manages all HTTP Requests
             *
             * @access private
             *
             * @param {object}    params      Given parameters including (Headers, ...)
             * @param {function}  callback    The callback function to run after
             *
             * @return {undefined}
             */
            httpRequest = function (params, callback) {
                var url = params.url,
                    fileSize,
                    originalFileName,
                    threadId,
                    fileUniqueId,
                    fileObject,
                    data = params.data,
                    method = (typeof params.method == 'string')
                        ? params.method
                        : 'GET',
                    fileUploadUniqueId = (typeof params.uniqueId == 'string')
                        ? params.uniqueId
                        : 'uniqueId',
                    hasError = false;

                if (!url) {
                    callback({
                        hasError: true,
                        errorCode: 6201,
                        errorMessage: CHAT_ERRORS[6201]
                    });
                    return;
                }

                var hasFile = false;

                httpRequestObject[eval('fileUploadUniqueId')] = new XMLHttpRequest(),
                    settings = params.settings;

                if(data && typeof data === 'object' && (data.hasOwnProperty('image') || data.hasOwnProperty('file'))) {
                    httpRequestObject[eval('fileUploadUniqueId')].timeout = (settings && typeof parseInt(settings.timeout) > 0 && settings.timeout > 0)
                        ? settings.timeout
                        : httpUploadRequestTimeout;
                } else {
                    httpRequestObject[eval('fileUploadUniqueId')].timeout = (settings && typeof parseInt(settings.uploadTimeout) > 0 && settings.uploadTimeout > 0)
                        ? settings.uploadTimeout
                        : httpRequestTimeout;
                }

                httpRequestObject[eval('fileUploadUniqueId')]
                    .addEventListener('error', function (event) {
                        if (callback) {
                            if (hasFile) {
                                hasError = true;
                                fireEvent('fileUploadEvents', {
                                    threadId: threadId,
                                    uniqueId: fileUniqueId,
                                    state: 'UPLOAD_ERROR',
                                    progress: 0,
                                    fileInfo: {
                                        fileName: originalFileName,
                                        fileSize: fileSize
                                    },
                                    fileObject: fileObject,
                                    errorCode: 6200,
                                    errorMessage: CHAT_ERRORS[6200] + ' (XMLHttpRequest Error Event Listener)'
                                });
                            }
                            callback({
                                hasError: true,
                                errorCode: 6200,
                                errorMessage: CHAT_ERRORS[6200] + ' (XMLHttpRequest Error Event Listener)'
                            });
                        }
                    }, false);

                httpRequestObject[eval('fileUploadUniqueId')].addEventListener('abort',
                    function (event) {
                        if (callback) {
                            if (hasFile) {
                                hasError = true;
                                fireEvent('fileUploadEvents', {
                                    threadId: threadId,
                                    uniqueId: fileUniqueId,
                                    state: 'UPLOAD_CANCELED',
                                    progress: 0,
                                    fileInfo: {
                                        fileName: originalFileName,
                                        fileSize: fileSize
                                    },
                                    fileObject: fileObject,
                                    errorCode: 6303,
                                    errorMessage: CHAT_ERRORS[6303]
                                });
                            }
                            callback({
                                hasError: true,
                                errorCode: 6303,
                                errorMessage: CHAT_ERRORS[6303]
                            });
                        }
                    }, false);

                try {
                    if (method == 'GET') {
                        if (typeof data === 'object' && data !== null) {
                            var keys = Object.keys(data);

                            if (keys.length > 0) {
                                url += '?';

                                for (var i = 0; i < keys.length; i++) {
                                    var key = keys[i];
                                    url += key + '=' + data[key];
                                    if (i < keys.length - 1) {
                                        url += '&';
                                    }
                                }
                            }
                        }
                        else if (typeof data === 'string' && data !== null) {
                            url += '?' + data;
                        }

                        httpRequestObject[eval('fileUploadUniqueId')].open(method, url, true);

                        if (typeof params.headers === 'object') {
                            for (var key in params.headers) {
                                httpRequestObject[eval('fileUploadUniqueId')].setRequestHeader(key, params.headers[key]);
                            }
                        }

                        httpRequestObject[eval('fileUploadUniqueId')].send();
                    }

                    if (method === 'POST' && data) {

                        httpRequestObject[eval('fileUploadUniqueId')].open(method, url, true);

                        if (typeof params.headers === 'object') {
                            for (var key in params.headers) {
                                httpRequestObject[eval('fileUploadUniqueId')].setRequestHeader(key, params.headers[key]);
                            }
                        }

                        if (typeof data == 'object') {
                            if (data.hasOwnProperty('image') || data.hasOwnProperty('file')) {
                                hasFile = true;
                                var formData = new FormData();
                                for (var key in data) {
                                    formData.append(key, data[key]);
                                }

                                fileSize = data.fileSize;
                                originalFileName = data.originalFileName;
                                threadId = data.threadId;
                                fileUniqueId = data.uniqueId;
                                fileObject = (data['image'])
                                    ? data['image']
                                    : data['file'];

                                httpRequestObject[eval('fileUploadUniqueId')].upload.onprogress = function (event) {
                                    if (event.lengthComputable && !hasError) {
                                        fireEvent('fileUploadEvents', {
                                            threadId: threadId,
                                            uniqueId: fileUniqueId,
                                            state: 'UPLOADING',
                                            progress: Math.round((event.loaded / event.total) * 100),
                                            fileInfo: {
                                                fileName: originalFileName,
                                                fileSize: fileSize
                                            },
                                            fileObject: fileObject
                                        });
                                    }
                                };

                                httpRequestObject[eval('fileUploadUniqueId')].send(formData);
                            }
                            else {
                                httpRequestObject[eval('fileUploadUniqueId')].setRequestHeader(
                                    'Content-Type',
                                    'application/x-www-form-urlencoded');

                                var keys = Object.keys(data);

                                if (keys.length > 0) {
                                    sendData = '';

                                    for (var i = 0; i < keys.length; i++) {
                                        var key = keys[i];
                                        sendData += key + '=' + data[key];
                                        if (i < keys.length - 1) {
                                            sendData += '&';
                                        }
                                    }
                                }

                                httpRequestObject[eval('fileUploadUniqueId')].send(sendData);
                            }
                        }
                        else {
                            httpRequestObject[eval('fileUploadUniqueId')].send(data);
                        }
                    }
                }
                catch (e) {
                    callback && callback({
                        hasError: true,
                        cache: false,
                        errorCode: 6200,
                        errorMessage: CHAT_ERRORS[6200] + ' (Request Catch Error)' + e
                    });
                }

                httpRequestObject[eval('fileUploadUniqueId')].onreadystatechange = function () {
                        if (httpRequestObject[eval('fileUploadUniqueId')].readyState == 4) {
                            if (httpRequestObject[eval('fileUploadUniqueId')].status == 200) {
                                if (hasFile) {
                                    hasError = false;
                                    fireEvent('fileUploadEvents', {
                                        threadId: threadId,
                                        uniqueId: fileUniqueId,
                                        state: 'UPLOADED',
                                        progress: 100,
                                        fileInfo: {
                                            fileName: originalFileName,
                                            fileSize: fileSize
                                        },
                                        fileObject: fileObject
                                    });
                                }

                                callback && callback({
                                    hasError: false,
                                    cache: false,
                                    result: {
                                        responseText: httpRequestObject[eval('fileUploadUniqueId')].responseText,
                                        responseHeaders: httpRequestObject[eval('fileUploadUniqueId')].getAllResponseHeaders()
                                    }
                                });
                            }
                            else {
                                if (hasFile) {
                                    hasError = true;
                                    fireEvent('fileUploadEvents', {
                                        threadId: threadId,
                                        uniqueId: fileUniqueId,
                                        state: 'UPLOAD_ERROR',
                                        progress: 0,
                                        fileInfo: {
                                            fileName: originalFileName,
                                            fileSize: fileSize
                                        },
                                        fileObject: fileObject,
                                        errorCode: 6200,
                                        errorMessage: CHAT_ERRORS[6200] + ' (Request Status != 200)',
                                        statusCode: httpRequestObject[eval('fileUploadUniqueId')].status
                                    });
                                }
                                callback && callback({
                                    hasError: true,
                                    errorMessage: httpRequestObject[eval('fileUploadUniqueId')].responseText,
                                    errorCode: httpRequestObject[eval('fileUploadUniqueId')].status
                                });
                            }
                        }
                    };
            },

            /**
             * Get User Info
             *
             * This functions gets user info from chat serverName.
             * If info is not retrived the function will attemp
             * 5 more times to get info from erver
             *
             * @recursive
             * @access private
             *
             * @param {function}    callback    The callback function to call after
             *
             * @return {object} Instant function return
             */
            getUserInfo = function getUserInfoRecursive(callback) {
                getUserInfoRetryCount++;

                if (getUserInfoRetryCount > getUserInfoRetry) {
                    getUserInfoTimeout && clearTimeout(getUserInfoTimeout);

                    getUserInfoRetryCount = 0;

                    fireEvent('error', {
                        code: 6101,
                        message: CHAT_ERRORS[6101],
                        error: null
                    });
                }
                else {
                    getUserInfoTimeout && clearTimeout(getUserInfoTimeout);

                    getUserInfoTimeout = setTimeout(function () {
                        getUserInfoRecursive(callback);
                    }, getUserInfoRetryCount * 10000);

                    return sendMessage({
                        chatMessageVOType: chatMessageVOTypes.USER_INFO,
                        typeCode: params.typeCode
                    }, {
                        onResult: function (result) {
                            var returnData = {
                                hasError: result.hasError,
                                cache: false,
                                errorMessage: result.errorMessage,
                                errorCode: result.errorCode
                            };

                            if (!returnData.hasError) {
                                getUserInfoTimeout && clearTimeout(getUserInfoTimeout);

                                var messageContent = result.result;
                                var currentUser = formatDataToMakeUser(messageContent);

                                /**
                                 * Add current user into cache database #cache
                                 */
                                if (canUseCache) {
                                    if (db) {
                                        db.users
                                            .where('id')
                                            .equals(parseInt(currentUser.id))
                                            .toArray()
                                            .then(function (users) {
                                                if (users.length > 0 && users[0].id > 0) {
                                                    db.users
                                                        .update(currentUser.id, {
                                                            cellphoneNumber: currentUser.cellphoneNumber,
                                                            email: currentUser.email,
                                                            image: currentUser.image,
                                                            name: currentUser.name
                                                        })
                                                        .catch(function (error) {
                                                            fireEvent('error', {
                                                                code: error.code,
                                                                message: error.message,
                                                                error: error
                                                            });
                                                        });
                                                }
                                                else {
                                                    db.users.put(currentUser)
                                                        .catch(function (error) {
                                                            fireEvent('error', {
                                                                code: error.code,
                                                                message: error.message,
                                                                error: error
                                                            });
                                                        });
                                                }
                                            });
                                    }
                                    else {
                                        fireEvent('error', {
                                            code: 6601,
                                            message: CHAT_ERRORS[6601],
                                            error: null
                                        });
                                    }
                                }

                                resultData = {
                                    user: currentUser
                                };

                                returnData.result = resultData;
                                getUserInfoRetryCount = 0;

                                callback && callback(returnData);

                                /**
                                 * Delete callback so if server pushes response
                                 * before cache, cache won't send data again
                                 */
                                callback = undefined;
                            }
                        }
                    });
                }
            },

            /**
             * Send Message
             *
             * All socket messages go through this function
             *
             * @access private
             *
             * @param {string}    token           SSO Token of current user
             * @param {string}    tokenIssuer     Issuer of token (default : 1)
             * @param {int}       type            Type of message (object : chatMessageVOTypes)
             * @param {string}    typeCode        Type of contact who is going to receive the message
             * @param {int}       messageType     Type of Message, in order to filter messages
             * @param {long}      subjectId       Id of chat thread
             * @param {string}    uniqueId        Tracker id for client
             * @param {string}    content         Content of message
             * @param {long}      time            Time of message, filled by chat server
             * @param {string}    medadata        Metadata for message (Will use when needed)
             * @param {string}    systemMedadata  Metadata for message (To be Set by client)
             * @param {long}      repliedTo       Id of message to reply to (Should be filled by client)
             * @param {function}  callback        The callback function to run after
             *
             * @return {object} Instant Function Return
             */
            sendMessage = function (params, callbacks, recursiveCallback) {
                /**
                 * + ChatMessage        {object}
                 *    - token           {string}
                 *    - tokenIssuer     {string}
                 *    - type            {int}
                 *    - typeCode        {string}
                 *    - messageType     {int}
                 *    - subjectId       {long}
                 *    - uniqueId        {string}
                 *    - content         {string}
                 *    - time            {long}
                 *    - medadata        {string}
                 *    - systemMedadata  {string}
                 *    - repliedTo       {long}
                 */
                var threadId = null;

                var asyncPriority = (params.asyncPriority > 0)
                    ? params.asyncPriority
                    : msgPriority;

                var messageVO = {
                    type: params.chatMessageVOType,
                    token: token,
                    tokenIssuer: 1
                };

                if (params.typeCode) {
                    messageVO.typeCode = params.typeCode;
                }
                else if (generalTypeCode) {
                    messageVO.typeCode = generalTypeCode;
                }

                if (params.messageType) {
                    messageVO.messageType = params.messageType;
                }

                if (params.subjectId) {
                    threadId = params.subjectId;
                    messageVO.subjectId = params.subjectId;
                }

                if (params.content) {
                    if (typeof params.content == 'object') {
                        messageVO.content = JSON.stringify(params.content);
                    }
                    else {
                        messageVO.content = params.content;
                    }
                }

                if (params.metadata) {
                    messageVO.metadata = params.metadata;
                }

                if (params.systemMetadata) {
                    messageVO.systemMetadata = params.systemMetadata;
                }

                if (params.repliedTo) {
                    messageVO.repliedTo = params.repliedTo;
                }

                var uniqueId;

                if (typeof params.uniqueId != 'undefined') {
                    uniqueId = params.uniqueId;
                }
                else if (params.chatMessageVOType !== chatMessageVOTypes.PING) {
                    uniqueId = Utility.generateUUID();
                }

                if (Array.isArray(uniqueId)) {
                    messageVO.uniqueId = JSON.stringify(uniqueId);
                }
                else {
                    messageVO.uniqueId = uniqueId;
                }

                if (typeof callbacks == 'object') {
                    if (callbacks.onSeen || callbacks.onDeliver || callbacks.onSent) {
                        if (!threadCallbacks[threadId]) {
                            threadCallbacks[threadId] = {};
                        }

                        threadCallbacks[threadId][uniqueId] = {};

                        sendMessageCallbacks[uniqueId] = {};

                        if (callbacks.onSent) {
                            sendMessageCallbacks[uniqueId].onSent = callbacks.onSent;
                            threadCallbacks[threadId][uniqueId].onSent = false;
                            threadCallbacks[threadId][uniqueId].uniqueId = uniqueId;
                        }

                        if (callbacks.onSeen) {
                            sendMessageCallbacks[uniqueId].onSeen = callbacks.onSeen;
                            threadCallbacks[threadId][uniqueId].onSeen = false;
                        }

                        if (callbacks.onDeliver) {
                            sendMessageCallbacks[uniqueId].onDeliver = callbacks.onDeliver;
                            threadCallbacks[threadId][uniqueId].onDeliver = false;
                        }

                    }
                    else if (callbacks.onResult) {
                        messagesCallbacks[uniqueId] = callbacks.onResult;
                    }
                }
                else if (typeof callbacks == 'function') {
                    messagesCallbacks[uniqueId] = callbacks;
                }

                /**
                 * Message to send through async SDK
                 *
                 * + MessageWrapperVO  {object}
                 *    - type           {int}       Type of ASYNC message based on content
                 *    + content        {string}
                 *       -peerName     {string}    Name of receiver Peer
                 *       -receivers[]  {long}      Array of receiver peer ids (if you use this, peerName will be ignored)
                 *       -priority     {int}       Priority of message 1-10, lower has more priority
                 *       -messageId    {long}      Id of message on your side, not required
                 *       -ttl          {long}      Time to live for message in milliseconds
                 *       -content      {string}    Chat Message goes here after stringifying
                 *    - trackId        {long}      Tracker id of message that you receive from DIRANA previously (if you are replying a sync message)
                 */

                var data = {
                    type: (parseInt(params.pushMsgType) > 0)
                        ? params.pushMsgType
                        : 3,
                    content: {
                        peerName: serverName,
                        priority: asyncPriority,
                        content: JSON.stringify(messageVO),
                        ttl: (params.messageTtl > 0)
                            ? params.messageTtl
                            : messageTtl
                    }
                };

                asyncClient.send(data, function (res) {
                    if (res.hasError && callbacks) {
                        if (typeof callbacks == 'function') {
                            callbacks(res);
                        }
                        else if (typeof callbacks == 'object' && typeof callbacks.onResult == 'function') {
                            callbacks.onResult(res);
                        }

                        if (messagesCallbacks[uniqueId]) {
                            delete messagesCallbacks[uniqueId];
                        }
                    }
                });

                sendPingTimeout && clearTimeout(sendPingTimeout);
                sendPingTimeout = setTimeout(function () {
                    ping();
                }, chatPingMessageInterval);

                recursiveCallback && recursiveCallback();

                return {
                    uniqueId: uniqueId,
                    threadId: threadId,
                    participant: userInfo,
                    content: params.content
                };
            },

            sendSystemMessage = function (params) {
                return sendMessage({
                    chatMessageVOType: chatMessageVOTypes.SYSTEM_MESSAGE,
                    subjectId: params.subjectId,
                    content: params.content,
                    uniqueId: params.uniqueId,
                    pushMsgType: 4
                });
            },

            /**
             * Chat Send Message Queue Handler
             *
             * Whenever something pushes into cahtSendQueue
             * this function invokes and does the message
             * sending progress throught async
             *
             * @access private
             *
             * @return {undefined}
             */
            chatSendQueueHandler = function () {
                chatSendQueueHandlerTimeout && clearTimeout(chatSendQueueHandlerTimeout);
                if (chatSendQueue.length) {
                    var messageToBeSend = chatSendQueue[0];

                    /**
                     * Getting chatSendQueue from either cache or
                     * memory and scrolling through the send queue
                     * to send all the messages which are waiting
                     * for chatState to become TRUE
                     *
                     * There is a small possibility that a Message
                     * wouldn't make it through network, so it Will
                     * not reach chat server. To avoid losing those
                     * messages, we put a clone of every message
                     * in waitQ, and when ack of the message comes,
                     * we delete that message from waitQ. otherwise
                     * we assume that these messages have been failed to
                     * send and keep them to be either canceled or resent
                     * by user later. When user calls getHistory(), they
                     * will have failed messages alongside with typical
                     * messages history.
                     */
                    if (chatState) {
                        getChatSendQueue(0, function (chatSendQueue) {
                            deleteFromChatSentQueue(messageToBeSend,
                                function () {
                                    sendMessage(messageToBeSend.message, messageToBeSend.callbacks, function () {
                                        if (chatSendQueue.length) {
                                            chatSendQueueHandler();
                                        }
                                    });
                                });
                        });
                    }
                }
            },

            /**
             * Ping
             *
             * This Function sends ping message to keep user connected to
             * chat server and updates its status
             *
             * @access private
             *
             * @return {undefined}
             */
            ping = function () {
                if (chatState && userInfo !== undefined) {
                    /**
                     * Ping messages should be sent ASAP, because
                     * we don't want to wait for send queue, we send them
                     * right through async from here
                     */
                    sendMessage({
                        chatMessageVOType: chatMessageVOTypes.PING,
                        pushMsgType: 5
                    });
                }
                else {
                    sendPingTimeout && clearTimeout(sendPingTimeout);
                }
            },

            /**
             * Clear Cache
             *
             * Clears Async queue so that all the remained messages will be
             * ignored
             *
             * @access private
             *
             * @return {undefined}
             */
            clearChatServerCaches = function () {
                sendMessage({
                    chatMessageVOType: chatMessageVOTypes.LOGOUT,
                    pushMsgType: 4
                });
            },

            /**
             * Received Async Message Handler
             *
             * This functions parses received message from async
             *
             * @access private
             *
             * @param {object}    asyncMessage    Received Message from Async
             *
             * @return {undefined}
             */
            receivedAsyncMessageHandler = function (asyncMessage) {
                /**
                 * + Message Received From Async      {object}
                 *    - id                            {long}
                 *    - senderMessageId               {long}
                 *    - senderName                    {string}
                 *    - senderId                      {long}
                 *    - type                          {int}
                 *    - content                       {string}
                 */

                var content = JSON.parse(asyncMessage.content);
                chatMessageHandler(content);
            },

            /**
             * Chat Message Handler
             *
             * Manages received chat messages and do the job
             *
             * @access private
             *
             * @param {object}    chatMessage     Content of Async Message which is considered as Chat Message
             *
             * @return {undefined}
             */
            chatMessageHandler = function (chatMessage) {
                var threadId = chatMessage.subjectId,
                    type = chatMessage.type,
                    messageContent = (typeof chatMessage.content === 'string')
                        ? JSON.parse(chatMessage.content)
                        : {},
                    contentCount = chatMessage.contentCount,
                    uniqueId = chatMessage.uniqueId;

                switch (type) {
                    /**
                     * Type 1    Get Threads
                     */
                    case chatMessageVOTypes.CREATE_THREAD:
                        messageContent.uniqueId = uniqueId;

                        if (messagesCallbacks[uniqueId]) {
                            createThread(messageContent, true, true);
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        } else {
                            createThread(messageContent, true, false);
                        }

                        break;

                    /**
                     * Type 2    Message
                     */
                    case chatMessageVOTypes.MESSAGE:
                        newMessageHandler(threadId, messageContent);
                        break;

                    /**
                     * Type 3    Message Sent
                     */
                    case chatMessageVOTypes.SENT:
                        if (sendMessageCallbacks[uniqueId] && sendMessageCallbacks[uniqueId].onSent) {
                            sendMessageCallbacks[uniqueId].onSent({
                                uniqueId: uniqueId
                            });
                            delete(sendMessageCallbacks[uniqueId].onSent);
                            threadCallbacks[threadId][uniqueId].onSent = true;
                        }
                        break;

                    /**
                     * Type 4    Message Delivery
                     */
                    case chatMessageVOTypes.DELIVERY:
                        if (fullResponseObject) {
                            getHistory({
                                offset: 0,
                                threadId: threadId,
                                id: messageContent.messageId,
                                cache: false
                            }, function(result) {
                                if (!result.hasError) {
                                    fireEvent('messageEvents', {
                                        type: 'MESSAGE_DELIVERY',
                                        result: {
                                            message: result.result.history[0],
                                            threadId: threadId,
                                            senderId: messageContent.participantId
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            fireEvent('messageEvents', {
                                type: 'MESSAGE_DELIVERY',
                                result: {
                                    message: messageContent.messageId,
                                    threadId: threadId,
                                    senderId: messageContent.participantId
                                }
                            });
                        }

                        sendMessageCallbacksHandler(chatMessageVOTypes.DELIVERY, threadId, uniqueId);
                        break;

                    /**
                     * Type 5    Message Seen
                     */
                    case chatMessageVOTypes.SEEN:
                        if (fullResponseObject) {
                            getHistory({
                                offset: 0,
                                threadId: threadId,
                                id: messageContent.messageId,
                                cache: false
                            }, function(result) {
                                if (!result.hasError) {
                                    fireEvent('messageEvents', {
                                        type: 'MESSAGE_SEEN',
                                        result: {
                                            message: result.result.history[0],
                                            threadId: threadId,
                                            senderId: messageContent.participantId
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            fireEvent('messageEvents', {
                                type: 'MESSAGE_SEEN',
                                result: {
                                    message: messageContent.messageId,
                                    threadId: threadId,
                                    senderId: messageContent.participantId
                                }
                            });
                        }

                        sendMessageCallbacksHandler(chatMessageVOTypes.SEEN, threadId, uniqueId);
                        break;

                    /**
                     * Type 6    Chat Ping
                     */
                    case chatMessageVOTypes.PING:
                        break;

                    /**
                     * Type 7    Block Contact
                     */
                    case chatMessageVOTypes.BLOCK:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent));
                        }
                        break;

                    /**
                     * Type 8    Unblock Blocked User
                     */
                    case chatMessageVOTypes.UNBLOCK:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent));
                        }
                        break;

                    /**
                     * Type 9   Leave Thread
                     */
                    case chatMessageVOTypes.LEAVE_THREAD:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }

                        /**
                         * Remove the participant from cache
                         */
                        if (canUseCache) {
                            if (db) {
                                /**
                                 * Remove the participant from participants
                                 * table
                                 */
                                db.participants.where('threadId')
                                    .equals(parseInt(threadId))
                                    .and(function (participant) {
                                        return (participant.id == messageContent.id || participant.owner == userInfo.id);
                                    })
                                    .delete()
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });

                                /**
                                 * If this is the user who is leaving the thread
                                 * we should delete the thread and messages of
                                 * thread from this users cache database
                                 */

                                if (messageContent.id == userInfo.id) {

                                    /**
                                     * Remove Thread from this users cache
                                     */
                                    db.threads.where('[owner+id]')
                                        .equals([userInfo.id, threadId])
                                        .delete()
                                        .catch(function (error) {
                                            fireEvent('error', {
                                                code: error.code,
                                                message: error.message,
                                                error: error
                                            });
                                        });

                                    /**
                                     * Remove all messages of the thread which
                                     * this user left
                                     */
                                    db.messages.where('threadId')
                                        .equals(parseInt(threadId))
                                        .and(function (message) {
                                            return message.owner == userInfo.id;
                                        })
                                        .delete()
                                        .catch(function (error) {
                                            fireEvent('error', {
                                                code: error.code,
                                                message: error.message,
                                                error: error
                                            });
                                        });
                                }
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }

                        if (fullResponseObject) {
                            getThreads({
                                threadIds: [threadId]
                            }, function (threadsResult) {
                                if (!threadsResult.cache) {
                                    var threads = threadsResult.result.threads;
                                    if (threads.length > 0) {
                                        fireEvent('threadEvents', {
                                            type: 'THREAD_LEAVE_PARTICIPANT',
                                            result: {
                                                thread: threads[0],
                                                participant: formatDataToMakeParticipant(messageContent, threadId)
                                            }
                                        });

                                        fireEvent('threadEvents', {
                                            type: 'THREAD_LAST_ACTIVITY_TIME',
                                            result: {
                                                thread: threads[0]
                                            }
                                        });
                                    }
                                    else {
                                        fireEvent('threadEvents', {
                                            type: 'THREAD_LEAVE_PARTICIPANT',
                                            result: {
                                                threadId: threadId,
                                                participant: formatDataToMakeParticipant(messageContent, threadId)
                                            }
                                        });
                                    }
                                }
                            });
                        }
                        else {
                            fireEvent('threadEvents', {
                                type: 'THREAD_LEAVE_PARTICIPANT',
                                result: {
                                    thread: threadId,
                                    participant: formatDataToMakeParticipant(messageContent, threadId)
                                }
                            });

                            fireEvent('threadEvents', {
                                type: 'THREAD_LAST_ACTIVITY_TIME',
                                result: {
                                    thread: threadId
                                }
                            });
                        }
                        break;

                    /**
                     * Type 11    Add Participant to Thread
                     */
                    case chatMessageVOTypes.ADD_PARTICIPANT:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }

                        /**
                         * Add participants into cache
                         */
                        if (canUseCache && cacheSecret.length > 0) {
                            if (db) {
                                var cacheData = [];

                                for (var i = 0; i < messageContent.participants.length; i++) {
                                    try {
                                        var tempData = {},
                                            salt = Utility.generateUUID();

                                        tempData.id = messageContent.participants[i].id;
                                        tempData.owner = userInfo.id;
                                        tempData.threadId = messageContent.id;
                                        tempData.notSeenDuration = messageContent.participants[i].notSeenDuration;
                                        tempData.admin = messageContent.participants[i].admin;
                                        tempData.name = Utility.crypt(messageContent.participants[i].name, cacheSecret, salt);
                                        tempData.contactName = Utility.crypt(messageContent.participants[i].contactName, cacheSecret, salt);
                                        tempData.email = Utility.crypt(messageContent.participants[i].email, cacheSecret, salt);
                                        tempData.expireTime = new Date().getTime() + cacheExpireTime;
                                        tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(messageContent.participants[i])), cacheSecret, salt);
                                        tempData.salt = salt;

                                        cacheData.push(tempData);
                                    }
                                    catch (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    }
                                }

                                db.participants.bulkPut(cacheData)
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }

                        if (fullResponseObject) {
                            getThreads({
                                threadIds: [messageContent.id]
                            }, function (threadsResult) {
                                var threads = threadsResult.result.threads;

                                if (!threadsResult.cache) {
                                    fireEvent('threadEvents', {
                                        type: 'THREAD_ADD_PARTICIPANTS',
                                        result: {
                                            thread: threads[0]
                                        }
                                    });

                                    fireEvent('threadEvents', {
                                        type: 'THREAD_LAST_ACTIVITY_TIME',
                                        result: {
                                            thread: threads[0]
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            fireEvent('threadEvents', {
                                type: 'THREAD_ADD_PARTICIPANTS',
                                result: {
                                    thread: messageContent.id
                                }
                            });

                            fireEvent('threadEvents', {
                                type: 'THREAD_LAST_ACTIVITY_TIME',
                                result: {
                                    thread: messageContent.id
                                }
                            });
                        }
                        break;

                    /**
                     * Type 13    Get Contacts List
                     */
                    case chatMessageVOTypes.GET_CONTACTS:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }
                        break;

                    /**
                     * Type 14    Get Threads List
                     */
                    case chatMessageVOTypes.GET_THREADS:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }
                        break;

                    /**
                     * Type 15    Get Message History of an Thread
                     */
                    case chatMessageVOTypes.GET_HISTORY:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }
                        break;

                    /**
                     * Type 17    Remove sb from thread
                     */
                    case chatMessageVOTypes.REMOVED_FROM_THREAD:

                        fireEvent('threadEvents', {
                            type: 'THREAD_REMOVED_FROM',
                            result: {
                                thread: threadId
                            }
                        });

                        /**
                         * This user has been removed from a thread
                         * So we should delete thread, its participants
                         * and it's messages from this users cache
                         */
                        if (canUseCache) {
                            if (db) {
                                /**
                                 * Remove Thread from this users cache
                                 */
                                db.threads.where('[owner+id]')
                                    .equals([userInfo.id, threadId])
                                    .delete()
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });

                                /**
                                 * Remove all messages of the thread which this
                                 * user left
                                 */
                                db.messages.where('threadId')
                                    .equals(parseInt(threadId))
                                    .and(function (message) {
                                        return message.owner == userInfo.id;
                                    })
                                    .delete()
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });

                                /**
                                 * Remove all participants of the thread which
                                 * this user left
                                 */
                                db.participants.where('threadId')
                                    .equals(parseInt(threadId))
                                    .and(function (participant) {
                                        return participant.owner == userInfo.id;
                                    })
                                    .delete()
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });

                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }

                        break;

                    /**
                     * Type 18    Remove a participant from Thread
                     */
                    case chatMessageVOTypes.REMOVE_PARTICIPANT:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }

                        /**
                         * Remove the participant from cache
                         */
                        if (canUseCache) {
                            if (db) {
                                for (var i = 0; i < messageContent.length; i++) {
                                    db.participants.where('id')
                                        .equals(parseInt(messageContent[i].id))
                                        .and(function (participants) {
                                            return participants.threadId == threadId;
                                        })
                                        .delete()
                                        .catch(function (error) {
                                            fireEvent('error', {
                                                code: error.code,
                                                message: error.message,
                                                error: error
                                            });
                                        });
                                }
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }

                        if (fullResponseObject) {
                            getThreads({
                                threadIds: [threadId]
                            }, function (threadsResult) {
                                var threads = threadsResult.result.threads;

                                if (!threadsResult.cache) {
                                    fireEvent('threadEvents', {
                                        type: 'THREAD_REMOVE_PARTICIPANTS',
                                        result: {
                                            thread: threads[0]
                                        }
                                    });

                                    fireEvent('threadEvents', {
                                        type: 'THREAD_LAST_ACTIVITY_TIME',
                                        result: {
                                            thread: threads[0]
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            fireEvent('threadEvents', {
                                type: 'THREAD_REMOVE_PARTICIPANTS',
                                result: {
                                    thread: threadId
                                }
                            });

                            fireEvent('threadEvents', {
                                type: 'THREAD_LAST_ACTIVITY_TIME',
                                result: {
                                    thread: threadId
                                }
                            });
                        }
                        break;

                    /**
                     * Type 19    Mute Thread
                     */
                    case chatMessageVOTypes.MUTE_THREAD:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent));
                        }

                        if (fullResponseObject) {
                            getThreads({
                                threadIds: [threadId]
                            }, function (threadsResult) {
                                var thread = threadsResult.result.threads[0];
                                thread.mute = true;

                                fireEvent('threadEvents', {
                                    type: 'THREAD_MUTE',
                                    result: {
                                        thread: thread
                                    }
                                });
                            });
                        }
                        else {
                            fireEvent('threadEvents', {
                                type: 'THREAD_MUTE',
                                result: {
                                    thread: threadId
                                }
                            });
                        }

                        break;

                    /**
                     * Type 20    Unmute muted Thread
                     */
                    case chatMessageVOTypes.UNMUTE_THREAD:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent));
                        }

                        if (fullResponseObject) {
                            getThreads({
                                threadIds: [threadId]
                            }, function (threadsResult) {
                                var thread = threadsResult.result.threads[0];
                                thread.mute = false;

                                fireEvent('threadEvents', {
                                    type: 'THREAD_UNMUTE',
                                    result: {
                                        thread: thread
                                    }
                                });
                            });
                        }
                        else {
                            fireEvent('threadEvents', {
                                type: 'THREAD_UNMUTE',
                                result: {
                                    thread: threadId
                                }
                            });
                        }
                        break;

                    /**
                     * Type 21    Update Thread Info
                     */
                    case chatMessageVOTypes.UPDATE_THREAD_INFO:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent));
                        }

                        if (fullResponseObject) {
                            getThreads({
                                threadIds: [messageContent.id],
                                cache: false
                            }, function (threadsResult) {
                                var thread = formatDataToMakeConversation(threadsResult.result.threads[0]);

                                /**
                                 * Add Updated Thread into cache database #cache
                                 */
                                if (canUseCache && cacheSecret.length > 0) {
                                    if (db) {
                                        var tempData = {};

                                        try {
                                            var salt = Utility.generateUUID();

                                            tempData.id = thread.id;
                                            tempData.owner = userInfo.id;
                                            tempData.title = Utility.crypt(thread.title, cacheSecret, salt);
                                            tempData.time = thread.time;
                                            tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(thread)), cacheSecret, salt);
                                            tempData.salt = salt;
                                        }
                                        catch (error) {
                                            fireEvent('error', {
                                                code: error.code,
                                                message: error.message,
                                                error: error
                                            });
                                        }

                                        db.threads.put(tempData)
                                            .catch(function (error) {
                                                fireEvent('error', {
                                                    code: error.code,
                                                    message: error.message,
                                                    error: error
                                                });
                                            });
                                    }
                                    else {
                                        fireEvent('error', {
                                            code: 6601,
                                            message: CHAT_ERRORS[6601],
                                            error: null
                                        });
                                    }
                                }

                                fireEvent('threadEvents', {
                                    type: 'THREAD_INFO_UPDATED',
                                    result: {
                                        thread: thread
                                    }
                                });
                            });
                        }
                        else {
                            fireEvent('threadEvents', {
                                type: 'THREAD_INFO_UPDATED',
                                result: {
                                    thread: messageContent.id
                                }
                            });
                        }
                        break;

                    /**
                     * Type 22    Forward Multiple Messages
                     */
                    case chatMessageVOTypes.FORWARD_MESSAGE:
                        newMessageHandler(threadId, messageContent);
                        break;

                    /**
                     * Type 23    User Info
                     */
                    case chatMessageVOTypes.USER_INFO:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent));
                        }
                        break;

                    /**
                     * Type 25    Get Blocked List
                     */
                    case chatMessageVOTypes.GET_BLOCKED:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }
                        break;

                    /**
                     * Type 27    Thread Participants List
                     */
                    case chatMessageVOTypes.THREAD_PARTICIPANTS:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }
                        break;

                    /**
                     * Type 28    Edit Message
                     */
                    case chatMessageVOTypes.EDIT_MESSAGE:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }
                        chatEditMessageHandler(threadId, messageContent);
                        break;

                    /**
                     * Type 29    Delete Message
                     */
                    case chatMessageVOTypes.DELETE_MESSAGE:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }

                        /**
                         * Remove Message from cache
                         */
                        if (canUseCache && cacheSecret.length > 0) {
                            if (db) {
                                db.messages.where('id')
                                    .equals(messageContent)
                                    .and(function (message) {
                                        return message.owner == userInfo.id;
                                    })
                                    .delete()
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: 6602,
                                            message: CHAT_ERRORS[6602],
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }

                        fireEvent('messageEvents', {
                            type: 'MESSAGE_DELETE',
                            result: {
                                message: {
                                    id: messageContent,
                                    threadId: threadId
                                }
                            }
                        });
                        break;

                    /**
                     * Type 30    Thread Info Updated
                     */
                    case chatMessageVOTypes.THREAD_INFO_UPDATED:
                        var thread = formatDataToMakeConversation(messageContent);
                        /**
                         * Add Updated Thread into cache database #cache
                         */
                        if (canUseCache && cacheSecret.length > 0) {
                            if (db) {
                                var tempData = {};

                                try {
                                    var salt = Utility.generateUUID();

                                    tempData.id = thread.id;
                                    tempData.owner = userInfo.id;
                                    tempData.title = Utility.crypt(thread.title, cacheSecret, salt);
                                    tempData.time = thread.time;
                                    tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(thread)), cacheSecret, salt);
                                    tempData.salt = salt;
                                }
                                catch (error) {
                                    fireEvent('error', {
                                        code: error.code,
                                        message: error.message,
                                        error: error
                                    });
                                }

                                db.threads.put(tempData)
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }

                        fireEvent('threadEvents', {
                            type: 'THREAD_INFO_UPDATED',
                            result: {
                                thread: thread
                            }
                        });
                        break;

                    /**
                     * Type 31    Thread Last Seen Updated
                     */
                    case chatMessageVOTypes.LAST_SEEN_UPDATED:
                        if (fullResponseObject) {
                            getThreads({
                                threadIds: [messageContent.conversationId]
                            }, function (threadsResult) {
                                var threads = threadsResult.result.threads;

                                if (!threadsResult.cache) {
                                    fireEvent('threadEvents', {
                                        type: 'THREAD_UNREAD_COUNT_UPDATED',
                                        result: {
                                            thread: threads[0],
                                            messageId: messageContent.messageId,
                                            senderId: messageContent.participantId
                                        }
                                    });

                                    fireEvent('threadEvents', {
                                        type: 'THREAD_LAST_ACTIVITY_TIME',
                                        result: {
                                            thread: threads[0]
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            fireEvent('threadEvents', {
                                type: 'THREAD_UNREAD_COUNT_UPDATED',
                                result: {
                                    thread: threadId,
                                    messageId: messageContent.messageId,
                                    senderId: messageContent.participantId
                                }
                            });

                            fireEvent('threadEvents', {
                                type: 'THREAD_LAST_ACTIVITY_TIME',
                                result: {
                                    thread: threadId
                                }
                            });
                        }

                        break;

                    /**
                     * Type 32    Get Message Delivered List
                     */
                    case chatMessageVOTypes.GET_MESSAGE_DELEVERY_PARTICIPANTS:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }
                        break;

                    /**
                     * Type 33    Get Message Seen List
                     */
                    case chatMessageVOTypes.GET_MESSAGE_SEEN_PARTICIPANTS:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent, contentCount));
                        }
                        break;

                    /**
                     * Type 40    Bot Messages
                     */
                    case chatMessageVOTypes.BOT_MESSAGE:
                        fireEvent('botEvents', {
                            type: 'BOT_MESSAGE',
                            result: {
                                bot: messageContent
                            }
                        });
                        break;

                    /**
                     * Type 41    Spam P2P Thread
                     */
                    case chatMessageVOTypes.SPAM_PV_THREAD:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent));
                        }
                        break;

                    /**
                     * Type 42    Set Admin
                     */
                    case chatMessageVOTypes.SET_ROLE_TO_USER:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent));
                        }
                        break;

                    /**
                     * Type 44    Clear History
                     */
                    case chatMessageVOTypes.CLEAR_HISTORY:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent));
                        }
                        break;

                    /**
                     * Type 46    System Messages
                     */
                    case chatMessageVOTypes.SYSTEM_MESSAGE:
                        fireEvent('systemEvents', {
                            type: 'IS_TYPING',
                            result: {
                                thread: threadId,
                                user: messageContent
                            }
                        });
                        break;

                    /**
                     * Type 47    Get Not Seen Duration
                     */
                    case chatMessageVOTypes.GET_NOT_SEEN_DURATION:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(false, '', 0, messageContent));
                        }
                        break;

                    /**
                     * Type 999   All unknown errors
                     */
                    case chatMessageVOTypes.ERROR:
                        if (messagesCallbacks[uniqueId]) {
                            messagesCallbacks[uniqueId](Utility.createReturnData(true, messageContent.message, messageContent.code, messageContent, 0));
                        }

                        /**
                         * If error code is 21 therefore Token is invalid &
                         * user should be logged put
                         */
                        if (messageContent.code == 21) {
                            // TODO: Temporarily removed due to unknown activity
                            // chatState = false;
                            // asyncClient.logout();
                            // clearChatServerCaches();
                        }

                        fireEvent('error', {
                            code: messageContent.code,
                            message: messageContent.message,
                            error: messageContent
                        });
                        break;
                }
            },

            /**
             * Send Message Callbacks Handler
             *
             * When you send Delivery or Seen Acknowledgements of a message
             * You should send Delivery and Seen for all the Messages before
             * that message so that you wont have un delivered/unseen messages
             * after seeing the last message of a thread
             *
             * @access private
             *
             * @param {int}     actionType      Switch between Delivery or Seen
             * @param {long}    threadId        Id of thread
             * @param {string}  uniqueId        uniqueId of message
             *
             * @return {undefined}
             */
            sendMessageCallbacksHandler = function (actionType, threadId, uniqueId) {
                switch (actionType) {

                    case chatMessageVOTypes.DELIVERY:
                        if (threadCallbacks[threadId]) {
                            var lastThreadCallbackIndex = Object.keys(threadCallbacks[threadId])
                                .indexOf(uniqueId);
                            if (lastThreadCallbackIndex !== undefined) {
                                while (lastThreadCallbackIndex > -1) {
                                    var tempUniqueId = Object.entries(threadCallbacks[threadId])[lastThreadCallbackIndex][0];
                                    if (sendMessageCallbacks[tempUniqueId] && sendMessageCallbacks[tempUniqueId].onDeliver) {
                                        if (threadCallbacks[threadId][tempUniqueId] && threadCallbacks[threadId][tempUniqueId].onSent) {
                                            sendMessageCallbacks[tempUniqueId].onDeliver(
                                                {
                                                    uniqueId: tempUniqueId
                                                });
                                            delete(sendMessageCallbacks[tempUniqueId].onDeliver);
                                            threadCallbacks[threadId][tempUniqueId].onDeliver = true;
                                        }
                                    }

                                    lastThreadCallbackIndex -= 1;
                                }
                            }
                        }
                        break;

                    case chatMessageVOTypes.SEEN:
                        if (threadCallbacks[threadId]) {
                            var lastThreadCallbackIndex = Object.keys(threadCallbacks[threadId])
                                .indexOf(uniqueId);
                            if (lastThreadCallbackIndex !== undefined) {
                                while (lastThreadCallbackIndex > -1) {
                                    var tempUniqueId = Object.entries(threadCallbacks[threadId])[lastThreadCallbackIndex][0];

                                    if (sendMessageCallbacks[tempUniqueId] && sendMessageCallbacks[tempUniqueId].onSeen) {
                                        if (threadCallbacks[threadId][tempUniqueId] && threadCallbacks[threadId][tempUniqueId].onSent) {
                                            if (!threadCallbacks[threadId][tempUniqueId].onDeliver) {
                                                sendMessageCallbacks[tempUniqueId].onDeliver(
                                                    {
                                                        uniqueId: tempUniqueId
                                                    });
                                                delete(sendMessageCallbacks[tempUniqueId].onDeliver);
                                                threadCallbacks[threadId][tempUniqueId].onDeliver = true;
                                            }

                                            sendMessageCallbacks[tempUniqueId].onSeen(
                                                {
                                                    uniqueId: tempUniqueId
                                                });

                                            delete(sendMessageCallbacks[tempUniqueId].onSeen);
                                            threadCallbacks[threadId][tempUniqueId].onSeen = true;

                                            if (threadCallbacks[threadId][tempUniqueId].onSent &&
                                                threadCallbacks[threadId][tempUniqueId].onDeliver &&
                                                threadCallbacks[threadId][tempUniqueId].onSeen) {
                                                delete threadCallbacks[threadId][tempUniqueId];
                                                delete sendMessageCallbacks[tempUniqueId];
                                            }
                                        }
                                    }

                                    lastThreadCallbackIndex -= 1;
                                }
                            }
                        }
                        break;

                    default:
                        break;
                }
            },

            /**
             * New Message Handler
             *
             * Handles Event Emitter of a newly received Chat Message
             *
             * @access private
             *
             * @param {long}    threadId         ID of image
             * @param {object}  messageContent   Json Content of the message
             *
             * @return {undefined}
             */
            newMessageHandler = function (threadId, messageContent) {

                var message = formatDataToMakeMessage(threadId, messageContent);
                deliver({
                    messageId: message.id,
                    ownerId: message.participant.id
                });

                /**
                 * Add New Messages into cache database
                 */
                if (canUseCache && cacheSecret.length > 0) {
                    if (db) {
                        /**
                         * Insert new messages into cache database
                         * after deleting old messages from cache
                         */
                        var tempData = {};

                        try {
                            var salt = Utility.generateUUID();
                            tempData.id = parseInt(message.id);
                            tempData.owner = parseInt(userInfo.id);
                            tempData.threadId = parseInt(message.threadId);
                            tempData.time = message.time;
                            tempData.message = Utility.crypt(message.message, cacheSecret, salt);
                            tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(message)), cacheSecret, salt);
                            tempData.salt = salt;
                            tempData.sendStatus = 'sent';

                        }
                        catch (error) {
                            fireEvent('error', {
                                code: error.code,
                                message: error.message,
                                error: error
                            });
                        }

                        db.messages.put(tempData)
                            .catch(function (error) {
                                fireEvent('error', {
                                    code: error.code,
                                    message: error.message,
                                    error: error
                                });
                            });
                    }
                    else {
                        fireEvent('error', {
                            code: 6601,
                            message: CHAT_ERRORS[6601],
                            error: null
                        });
                    }
                }

                fireEvent('messageEvents', {
                    type: 'MESSAGE_NEW',
                    cache: false,
                    result: {
                        message: message
                    }
                });

                if (fullResponseObject) {
                    getThreads({
                        threadIds: [threadId]
                    }, function (threadsResult) {
                        var threads = threadsResult.result.threads;
                        // if (messageContent.participant.id !== userInfo.id && !threadsResult.cache) {
                        fireEvent('threadEvents', {
                            type: 'THREAD_UNREAD_COUNT_UPDATED',
                            result: {
                                thread: threads[0],
                                messageId: messageContent.id,
                                senderId: messageContent.participant.id
                            }
                        });
                        // }

                        // if (!threadsResult.cache) {
                        fireEvent('threadEvents', {
                            type: 'THREAD_LAST_ACTIVITY_TIME',
                            result: {
                                thread: threads[0]
                            }
                        });
                        // }
                    });
                }
                else {
                    fireEvent('threadEvents', {
                        type: 'THREAD_LAST_ACTIVITY_TIME',
                        result: {
                            thread: threadId
                        }
                    });

                    fireEvent('threadEvents', {
                        type: 'THREAD_UNREAD_COUNT_UPDATED',
                        result: {
                            thread: threadId
                        }
                    });
                }

                /**
                 * Update waitQ and remove sent messages from it
                 */
                if (hasCache && typeof queueDb == 'object') {
                    queueDb.waitQ.where('uniqueId')
                        .equals(message.uniqueId)
                        .and(function (item) {
                            return item.owner == parseInt(userInfo.id);
                        })
                        .delete()
                        .catch(function (error) {
                            fireEvent('error', {
                                code: error.code,
                                message: error.message,
                                error: error
                            });
                        });
                }
                else {
                    for (var i = 0; i < chatSendQueue.length; i++) {
                        if (chatSendQueue[i].uniqueId == message.uniqueId) {
                            chatSendQueue.splice(i, 1);
                        }
                    }
                }
            },

            /**
             * Chat Edit Message Handler
             *
             * Handles Event Emitter of an edited Chat Message
             *
             * @access private
             *
             * @param {long}    threadId         ID of image
             * @param {object}  messageContent   Json Content of the message
             *
             * @return {undefined}
             */
            chatEditMessageHandler = function (threadId, messageContent) {
                var message = formatDataToMakeMessage(threadId, messageContent);

                /**
                 * Update Message on cache
                 */
                if (canUseCache && cacheSecret.length > 0) {
                    if (db) {
                        try {
                            var tempData = {},
                                salt = Utility.generateUUID();
                            tempData.id = parseInt(message.id);
                            tempData.owner = parseInt(userInfo.id);
                            tempData.threadId = parseInt(message.threadId);
                            tempData.time = message.time;
                            tempData.message = Utility.crypt(message.message, cacheSecret, salt);
                            tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(message)), cacheSecret, salt);
                            tempData.salt = salt;

                            /**
                             * Insert Message into cache database
                             */
                            db.messages.put(tempData)
                                .catch(function (error) {
                                    fireEvent('error', {
                                        code: error.code,
                                        message: error.message,
                                        error: error
                                    });
                                });
                        }
                        catch (error) {
                            fireEvent('error', {
                                code: error.code,
                                message: error.message,
                                error: error
                            });
                        }
                    }
                    else {
                        fireEvent('error', {
                            code: 6601,
                            message: CHAT_ERRORS[6601],
                            error: null
                        });
                    }
                }

                fireEvent('messageEvents', {
                    type: 'MESSAGE_EDIT',
                    result: {
                        message: message
                    }
                });
            },

            /**
             * Create Thread
             *
             * Makes formatted Thread Object out of given contentCount,
             * If Thread has been newly created, a THREAD_NEW event
             * will be emitted
             *
             * @access private
             *
             * @param {object}    messageContent    Json object of thread taken from chat server
             * @param {boolean}   addFromService    if this is a newly created Thread, addFromService should be True
             *
             * @return {object} Formatted Thread Object
             */
            createThread = function (messageContent, addFromService, showThread) {
                var threadData = formatDataToMakeConversation(messageContent);
                var redirectToThread = (showThread === true) ? showThread : false;

                if (addFromService) {
                    fireEvent('threadEvents', {
                        type: 'THREAD_NEW',
                        redirectToThread: redirectToThread,
                        result: {
                            thread: threadData
                        }
                    });

                    /**
                     * Add New Thread into cache database #cache
                     */
                    if (canUseCache && cacheSecret.length > 0) {
                        if (db) {
                            var tempData = {};

                            try {
                                var salt = Utility.generateUUID();

                                tempData.id = threadData.id;
                                tempData.owner = userInfo.id;
                                tempData.title = Utility.crypt(threadData.title, cacheSecret, salt);
                                tempData.time = threadData.time;
                                tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(threadData)), cacheSecret, salt);
                                tempData.salt = salt;
                            }
                            catch (error) {
                                fireEvent('error', {
                                    code: error.code,
                                    message: error.message,
                                    error: error
                                });
                            }

                            db.threads.put(tempData)
                                .catch(function (error) {
                                    fireEvent('error', {
                                        code: error.code,
                                        message: error.message,
                                        error: error
                                    });
                                });
                        }
                        else {
                            fireEvent('error', {
                                code: 6601,
                                message: CHAT_ERRORS[6601],
                                error: null
                            });
                        }
                    }
                }
                return threadData;
            },

            /**
             * Format Data To Make Linked User
             *
             * This functions re-formats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @return {object} linkedUser Object
             */
            formatDataToMakeLinkedUser = function (messageContent) {
                /**
                 * + RelatedUserVO                 {object}
                 *   - coreUserId                  {long}
                 *   - username                    {string}
                 *   - nickname                    {string}
                 *   - name                        {string}
                 *   - image                       {string}
                 */

                var linkedUser = {
                    coreUserId: messageContent.coreUserId,
                    username: messageContent.username,
                    nickname: messageContent.nickname,
                    name: messageContent.name,
                    image: messageContent.image
                };

                return linkedUser;
            },

            /**
             * Format Data To Make Contact
             *
             * This functions reformats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @return {object} contact Object
             */
            formatDataToMakeContact = function (messageContent) {
                /**
                 * + ContactVO                        {object}
                 *    - id                            {long}
                 *    - blocked                       {boolean}
                 *    - userId                        {long}
                 *    - firstName                     {string}
                 *    - lastName                      {string}
                 *    - image                         {string}
                 *    - email                         {string}
                 *    - cellphoneNumber               {string}
                 *    - uniqueId                      {string}
                 *    - notSeenDuration               {long}
                 *    - hasUser                       {boolean}
                 *    - linkedUser                    {object : RelatedUserVO}
                 */

                var contact = {
                    id: messageContent.id,
                    blocked: (messageContent.blocked !== undefined)
                        ? messageContent.blocked
                        : false,
                    userId: messageContent.userId,
                    firstName: messageContent.firstName,
                    lastName: messageContent.lastName,
                    image: messageContent.profileImage,
                    email: messageContent.email,
                    cellphoneNumber: messageContent.cellphoneNumber,
                    uniqueId: messageContent.uniqueId,
                    notSeenDuration: messageContent.notSeenDuration,
                    hasUser: messageContent.hasUser,
                    linkedUser: undefined
                };

                if (messageContent.linkedUser !== undefined) {
                    contact.linkedUser = formatDataToMakeLinkedUser(messageContent.linkedUser);
                }

                return contact;
            },

            /**
             * Format Data To Make User
             *
             * This functions reformats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @return {object} user Object
             */
            formatDataToMakeUser = function (messageContent) {
                /**
                 * + User                     {object}
                 *    - id                    {long}
                 *    - name                  {string}
                 *    - email                 {string}
                 *    - cellphoneNumber       {string}
                 *    - image                 {string}
                 *    - lastSeen              {long}
                 *    - sendEnable            {boolean}
                 *    - receiveEnable         {boolean}
                 */

                var user = {
                    id: messageContent.id,
                    name: messageContent.name,
                    email: messageContent.email,
                    cellphoneNumber: messageContent.cellphoneNumber,
                    image: messageContent.image,
                    lastSeen: messageContent.lastSeen,
                    sendEnable: messageContent.sendEnable,
                    receiveEnable: messageContent.receiveEnable
                };

                if (messageContent.contactId) {
                    user.contactId = messageContent.contactId;
                }

                if (messageContent.contactName) {
                    user.contactName = messageContent.contactName;
                }

                if (messageContent.contactFirstName) {
                    user.contactFirstName = messageContent.contactFirstName;
                }

                if (messageContent.contactLastName) {
                    user.contactLastName = messageContent.contactLastName;
                }

                if (messageContent.blocked) {
                    user.blocked = messageContent.blocked;
                }

                return user;
            },

            /**
             * Format Data To Make Blocked User
             *
             * This functions reformats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @return {object} blockedUser Object
             */
            formatDataToMakeBlockedUser = function (messageContent) {
                /**
                 * + BlockedUser              {object}
                 *    - id                    {long}
                 *    - firstName             {string}
                 *    - lastName              {string}
                 *    - nickName              {string}
                 *    - profileImage          {string}
                 */

                var blockedUser = {
                    blockId: messageContent.id,
                    firstName: messageContent.firstName,
                    lastName: messageContent.lastName,
                    nickName: messageContent.nickName,
                    profileImage: messageContent.profileImage
                };

                return blockedUser;
            },

            /**
             * Format Data To Make Invitee
             *
             * This functions reformats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @return {object} inviteeData Object
             */
            formatDataToMakeInvitee = function (messageContent) {
                /**
                 * + InviteeVO       {object}
                 *    - id           {string}
                 *    - idType       {int}
                 */

                var inviteeData = {
                    id: messageContent.id,
                    idType: inviteeVOidTypes[messageContent.idType]
                };

                return inviteeData;
            },

            /**
             * Format Data To Make Participant
             *
             * This functions reformats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @return {object} participant Object
             */
            formatDataToMakeParticipant = function (messageContent, threadId) {
                /**
                 * + ParticipantVO                   {object}
                 *    - id                           {long}
                 *    - coreUserId                   {long}
                 *    - threadId                     {long}
                 *    - sendEnable                   {boolean}
                 *    - receiveEnable                {boolean}
                 *    - firstName                    {string}
                 *    - lastName                     {string}
                 *    - name                         {string}
                 *    - cellphoneNumber              {string}
                 *    - email                        {string}
                 *    - image                        {string}
                 *    - myFriend                     {boolean}
                 *    - online                       {boolean}
                 *    - notSeenDuration              {long}
                 *    - contactId                    {long}
                 *    - contactName                  {string}
                 *    - contactFirstName             {string}
                 *    - contactLastName              {string}
                 *    - blocked                      {boolean}
                 *    - admin                        {boolean}
                 *    - keyId                        {string}
                 *    - roles                        {string}
                 */

                var participant = {
                    id: messageContent.id,
                    coreUserId: messageContent.coreUserId,
                    threadId: threadId,
                    sendEnable: messageContent.sendEnable,
                    receiveEnable: messageContent.receiveEnable,
                    firstName: messageContent.firstName,
                    lastName: messageContent.lastName,
                    name: messageContent.name,
                    cellphoneNumber: messageContent.cellphoneNumber,
                    email: messageContent.email,
                    image: messageContent.image,
                    myFriend: messageContent.myFriend,
                    online: messageContent.online,
                    notSeenDuration: messageContent.notSeenDuration,
                    contactId: messageContent.contactId,
                    contactName: messageContent.contactName,
                    contactFirstName: messageContent.contactFirstName,
                    contactLastName: messageContent.contactLastName,
                    blocked: messageContent.blocked,
                    admin: messageContent.admin,
                    keyId: messageContent.keyId,
                    roles: messageContent.roles
                };

                return participant;
            },

            /**
             * Format Data To Make Conversation
             *
             * This functions reformats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @return {object} Conversation Object
             */
            formatDataToMakeConversation = function (messageContent) {

                /**
                 * + Conversation                           {object}
                 *    - id                                  {long}
                 *    - joinDate                            {long}
                 *    - title                               {string}
                 *    - inviter                             {object : ParticipantVO}
                 *    - participants                        {list : ParticipantVO}
                 *    - time                                {long}
                 *    - lastMessage                         {string}
                 *    - lastParticipantName                 {string}
                 *    - group                               {boolean}
                 *    - partner                             {long}
                 *    - lastParticipantImage                {string}
                 *    - image                               {string}
                 *    - description                         {string}
                 *    - unreadCount                         {long}
                 *    - lastSeenMessageId                   {long}
                 *    - lastSeenMessageTime                 {long}
                 *    - lastSeenMessageNanos                {integer}
                 *    - lastMessageVO                       {object : ChatMessageVO}
                 *    - partnerLastSeenMessageId            {long}
                 *    - partnerLastSeenMessageTime          {long}
                 *    - partnerLastSeenMessageNanos         {integer}
                 *    - partnerLastDeliveredMessageId       {long}
                 *    - partnerLastDeliveredMessageTime     {long}
                 *    - partnerLastDeliveredMessageNanos    {integer}
                 *    - type                                {int}
                 *    - metadata                            {string}
                 *    - mute                                {boolean}
                 *    - participantCount                    {long}
                 *    - canEditInfo                         {boolean}
                 *    - canSpam                             {boolean}
                 *    - admin                               {boolean}
                 */

                var conversation = {
                    id: messageContent.id,
                    joinDate: messageContent.joinDate,
                    title: messageContent.title,
                    inviter: undefined,
                    participants: undefined,
                    time: messageContent.time,
                    lastMessage: messageContent.lastMessage,
                    lastParticipantName: messageContent.lastParticipantName,
                    group: messageContent.group,
                    partner: messageContent.partner,
                    lastParticipantImage: messageContent.lastParticipantImage,
                    image: messageContent.image,
                    description: messageContent.description,
                    unreadCount: messageContent.unreadCount,
                    lastSeenMessageId: messageContent.lastSeenMessageId,
                    lastSeenMessageTime: (messageContent.lastSeenMessageNanos)
                        ? (parseInt(parseInt(messageContent.lastSeenMessageTime) / 1000) * 1000000000) + parseInt(messageContent.lastSeenMessageNanos)
                        : (parseInt(messageContent.lastSeenMessageTime)),
                    lastMessageVO: undefined,
                    partnerLastSeenMessageId: messageContent.partnerLastSeenMessageId,
                    partnerLastSeenMessageTime: (messageContent.partnerLastSeenMessageNanos)
                        ? (parseInt(parseInt(messageContent.partnerLastSeenMessageTime) / 1000) * 1000000000) +
                        parseInt(messageContent.partnerLastSeenMessageNanos)
                        : (parseInt(messageContent.partnerLastSeenMessageTime)),
                    partnerLastDeliveredMessageId: messageContent.partnerLastDeliveredMessageId,
                    partnerLastDeliveredMessageTime: (messageContent.partnerLastDeliveredMessageNanos)
                        ? (parseInt(parseInt(messageContent.partnerLastDeliveredMessageTime) / 1000) * 1000000000) +
                        parseInt(messageContent.partnerLastDeliveredMessageNanos)
                        : (parseInt(messageContent.partnerLastDeliveredMessageTime)),
                    type: messageContent.type,
                    metadata: messageContent.metadata,
                    mute: messageContent.mute,
                    participantCount: messageContent.participantCount,
                    canEditInfo: messageContent.canEditInfo,
                    canSpam: messageContent.canSpam,
                    admin: messageContent.admin
                };

                // Add inviter if exist
                if (messageContent.inviter) {
                    conversation.inviter = formatDataToMakeParticipant(messageContent.inviter, messageContent.id);
                }

                // Add participants list if exist
                if (messageContent.participants && Array.isArray(messageContent.participants)) {
                    conversation.participants = [];

                    for (var i = 0; i < messageContent.participants.length; i++) {
                        var participantData = formatDataToMakeParticipant(messageContent.participants[i], messageContent.id);
                        if (participantData) {
                            conversation.participants.push(participantData);
                        }
                    }
                }

                // Add lastMessageVO if exist
                if (messageContent.lastMessageVO) {
                    conversation.lastMessageVO = formatDataToMakeMessage(messageContent.id, messageContent.lastMessageVO);
                }

                return conversation;
            },

            /**
             * Format Data To Make Reply Info
             *
             * This functions reformats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @return {object} replyInfo Object
             */
            formatDataToMakeReplyInfo = function (messageContent, threadId) {
                /**
                 * + replyInfoVO                  {object : replyInfoVO}
                 *   - participant                {object : ParticipantVO}
                 *   - repliedToMessageId         {long}
                 *   - repliedToMessageTime       {long}
                 *   - repliedToMessageNanos      {int}
                 *   - message                    {string}
                 *   - deleted                    {boolean}
                 *   - messageType                {int}
                 *   - metadata                   {string}
                 *   - systemMetadata             {string}
                 */

                var replyInfo = {
                    deleted: messageContent.deleted,
                    participant: undefined,
                    repliedToMessageId: messageContent.repliedToMessageId,
                    repliedToMessageTime: (messageContent.repliedToMessageNanos)
                        ? (parseInt(parseInt(messageContent.repliedToMessageTime) / 1000) * 1000000000) + parseInt(messageContent.repliedToMessageNanos)
                        : (parseInt(messageContent.repliedToMessageTime)),
                    repliedToMessageTimeMiliSeconds: parseInt(messageContent.repliedToMessageTime),
                    repliedToMessageTimeNanos: parseInt(messageContent.repliedToMessageNanos),
                    message: messageContent.message,
                    deleted: messageContent.deleted,
                    messageType: messageContent.messageType,
                    metadata: messageContent.metadata,
                    systemMetadata: messageContent.systemMetadata
                };

                if (messageContent.participant) {
                    replyInfo.participant = formatDataToMakeParticipant(messageContent.participant, threadId);
                }

                return replyInfo;
            },

            /**
             * Format Data To Make Forward Info
             *
             * This functions reformats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @return {object} forwardInfo Object
             */
            formatDataToMakeForwardInfo = function (messageContent, threadId) {
                /**
                 * + forwardInfo                  {object : forwardInfoVO}
                 *   - participant                {object : ParticipantVO}
                 *   - conversation               {object : ConversationSummary}
                 */

                var forwardInfo = {
                    participant: undefined,
                    conversation: undefined
                };

                if (messageContent.conversation) {
                    forwardInfo.conversation = formatDataToMakeConversation(messageContent.conversation);
                }

                if (messageContent.participant) {
                    forwardInfo.participant = formatDataToMakeParticipant(messageContent.participant, threadId);
                }

                return forwardInfo;
            },

            /**
             * Format Data To Make Message
             *
             * This functions reformats given JSON to proper Object
             *
             * @access private
             *
             * @param {object}  messageContent    Json object of thread taken from chat server
             *
             * @return {object} message Object
             */
            formatDataToMakeMessage = function (threadId, pushMessageVO, fromCache) {
                /**
                 * + MessageVO                       {object}
                 *    - id                           {long}
                 *    - threadId                     {long}
                 *    - ownerId                      {long}
                 *    - uniqueId                     {string}
                 *    - previousId                   {long}
                 *    - message                      {string}
                 *    - messageType                  {int}
                 *    - edited                       {boolean}
                 *    - editable                     {boolean}
                 *    - deletable                    {boolean}
                 *    - delivered                    {boolean}
                 *    - seen                         {boolean}
                 *    - participant                  {object : ParticipantVO}
                 *    - conversation                 {object : ConversationVO}
                 *    - replyInfo                    {object : replyInfoVO}
                 *    - forwardInfo                  {object : forwardInfoVO}
                 *    - metadata                     {string}
                 *    - systemMetadata               {string}
                 *    - time                         {long}
                 *    - timeNanos                    {long}
                 */

                if (fromCache || pushMessageVO.time.toString().length > 14) {
                    var time = pushMessageVO.time,
                        timeMiliSeconds = parseInt(pushMessageVO.time / 1000000);
                }
                else {
                    var time = (pushMessageVO.timeNanos)
                        ? (parseInt(parseInt(pushMessageVO.time) / 1000) * 1000000000) + parseInt(pushMessageVO.timeNanos)
                        : (parseInt(pushMessageVO.time)),
                        timeMiliSeconds = parseInt(pushMessageVO.time);
                }

                var message = {
                    id: pushMessageVO.id,
                    threadId: threadId,
                    ownerId: (pushMessageVO.ownerId)
                        ? pushMessageVO.ownerId
                        : undefined,
                    uniqueId: pushMessageVO.uniqueId,
                    previousId: pushMessageVO.previousId,
                    message: pushMessageVO.message,
                    messageType: pushMessageVO.messageType,
                    edited: pushMessageVO.edited,
                    editable: pushMessageVO.editable,
                    deletable: pushMessageVO.deletable,
                    delivered: pushMessageVO.delivered,
                    seen: pushMessageVO.seen,
                    participant: undefined,
                    conversation: undefined,
                    replyInfo: undefined,
                    forwardInfo: undefined,
                    metadata: pushMessageVO.metadata,
                    systemMetadata: pushMessageVO.systemMetadata,
                    time: time,
                    timeMiliSeconds: timeMiliSeconds,
                    timeNanos: parseInt(pushMessageVO.timeNanos)
                };

                if (pushMessageVO.participant) {
                    message.ownerId = pushMessageVO.participant.id;
                }

                if (pushMessageVO.conversation) {
                    message.conversation = formatDataToMakeConversation(pushMessageVO.conversation);
                    message.threadId = pushMessageVO.conversation.id;
                }

                if (pushMessageVO.replyInfoVO || pushMessageVO.replyInfo) {
                    message.replyInfo = (pushMessageVO.replyInfoVO)
                        ? formatDataToMakeReplyInfo(pushMessageVO.replyInfoVO, threadId)
                        : formatDataToMakeReplyInfo(pushMessageVO.replyInfo, threadId);
                }

                if (pushMessageVO.forwardInfo) {
                    message.forwardInfo = formatDataToMakeForwardInfo(pushMessageVO.forwardInfo, threadId);
                }

                if (pushMessageVO.participant) {
                    message.participant = formatDataToMakeParticipant(pushMessageVO.participant, threadId);
                }

                return message;
            },

            /**
             * Reformat Thread History
             *
             * This functions reformats given Array of thread Messages
             * into proper chat message object
             *
             * @access private
             *
             * @param {long}    threadId         Id of Thread
             * @param {object}  historyContent   Array of Thread History Messages
             *
             * @return {object} Formatted Thread History
             */
            reformatThreadHistory = function (threadId, historyContent) {
                var returnData = [];

                for (var i = 0; i < historyContent.length; i++) {
                    returnData.push(formatDataToMakeMessage(threadId, historyContent[i]));
                }

                return returnData;
            },

            /**
             * Reformat Thread Participants
             *
             * This functions reformats given Array of thread Participants
             * into proper thread participant
             *
             * @access private
             *
             * @param {object}  participantsContent   Array of Thread Participant Objects
             * @param {long}    threadId              Id of Thread
             *
             * @return {object} Formatted Thread Participant Array
             */
            reformatThreadParticipants = function (participantsContent, threadId) {
                var returnData = [];

                for (var i = 0; i < participantsContent.length; i++) {
                    returnData.push(formatDataToMakeParticipant(participantsContent[i], threadId));
                }

                return returnData;
            },

            /**
             * Unset Not Seen Duration
             *
             * This functions unsets notSeenDuration property of cached objects
             *
             * @access private
             *
             * @param {object}  content   Object or Array to be modified
             *
             * @return {object}
             */
            unsetNotSeenDuration = function (content) {
                /**
                 * Make a copy from original object to modify it's
                 * attributes, because we don't want to change
                 * the original object
                 */
                var temp = cloneObject(content);

                if (temp.hasOwnProperty('notSeenDuration')) {
                    temp.notSeenDuration = undefined;
                }

                if (temp.hasOwnProperty('inviter')) {
                    temp.inviter.notSeenDuration = undefined;
                }

                if (temp.hasOwnProperty('participant')) {
                    temp.participant.notSeenDuration = undefined;
                }

                return temp;
            },

            /**
             * Clone Object/Array
             *
             * This functions makes a deep clone of given object or array
             *
             * @access private
             *
             * @param {object}  original   Object or Array to be cloned
             *
             * @return {object} Cloned object
             */
            cloneObject = function (original) {
                var out, value, key;
                out = Array.isArray(original) ? [] : {};

                for (key in original) {
                    value = original[key];
                    out[key] = (typeof value === 'object' && value !== null)
                        ? cloneObject(value)
                        : value;
                }

                return out;
            },

            /**
             * Get Treads.
             *
             * This functions gets threads list
             *
             * @access private
             *
             * @param {int}       count                 count of threads to be received
             * @param {int}       offset                offset of select query
             * @param {array}     threadIds             An array of thread ids to be received
             * @param {string}    name                  Search term to look up in thread Titles
             * @param {long}      creatorCoreUserId     SSO User Id of thread creator
             * @param {long}      partnerCoreUserId     SSO User Id of thread partner
             * @param {long}      partnerCoreContactId  Contact Id of thread partner
             * @param {function}  callback              The callback function to call after
             *
             * @return {object} Instant sendMessage result
             */
            getThreads = function (params, callback) {
                var count = 50,
                    offset = 0,
                    content = {},
                    whereClause = {},
                    returnCache = false;

                if (params) {
                    if (parseInt(params.count) > 0) {
                        count = params.count;
                    }

                    if (parseInt(params.offset) > 0) {
                        offset = params.offset;
                    }

                    if (typeof params.name === 'string') {
                        content.name = whereClause.name = params.name;
                    }

                    if (Array.isArray(params.threadIds)) {
                        content.threadIds = whereClause.threadIds = params.threadIds;
                    }

                    if (typeof params.new === 'boolean') {
                        content.new = params.new;
                    }

                    if (parseInt(params.creatorCoreUserId) > 0) {
                        content.creatorCoreUserId = whereClause.creatorCoreUserId = params.creatorCoreUserId;
                    }

                    if (parseInt(params.partnerCoreUserId) > 0) {
                        content.partnerCoreUserId = whereClause.partnerCoreUserId = params.partnerCoreUserId;
                    }

                    if (parseInt(params.partnerCoreContactId) > 0) {
                        content.partnerCoreContactId = whereClause.partnerCoreContactId = params.partnerCoreContactId;
                    }

                    var functionLevelCache = (typeof params.cache == 'boolean') ? params.cache : true;
                }

                content.count = count;
                content.offset = offset;

                var sendMessageParams = {
                    chatMessageVOType: chatMessageVOTypes.GET_THREADS,
                    typeCode: params.typeCode,
                    content: content
                };

                /**
                 * Retrieve threads from cache
                 */
                if (functionLevelCache && canUseCache && cacheSecret.length > 0) {
                    if (db) {
                        var thenAble;

                        if (Object.keys(whereClause).length === 0) {
                            thenAble = db.threads.where('[owner+time]')
                                .between([userInfo.id, minIntegerValue], [userInfo.id, maxIntegerValue * 1000])
                                .reverse();
                        }
                        else {
                            if (whereClause.hasOwnProperty('threadIds')) {
                                thenAble = db.threads.where('id')
                                    .anyOf(whereClause.threadIds)
                                    .and(function (thread) {
                                        return thread.owner == userInfo.id;
                                    });
                            }

                            if (whereClause.hasOwnProperty('name')) {
                                thenAble = db.threads.where('owner')
                                    .equals(parseInt(userInfo.id))
                                    .filter(function (thread) {
                                        var reg = new RegExp(whereClause.name);
                                        return reg.test(chatDecrypt(thread.title, cacheSecret, thread.salt));
                                    });
                            }

                            if (whereClause.hasOwnProperty('creatorCoreUserId')) {
                                thenAble = db.threads.where('owner')
                                    .equals(parseInt(userInfo.id))
                                    .filter(function (thread) {
                                        return parseInt(thread.inviter.id) == parseInt(whereClause.creatorCoreUserId);
                                    });
                            }
                        }

                        thenAble.offset(offset)
                            .limit(count)
                            .toArray()
                            .then(function (threads) {
                                db.threads.where('owner')
                                    .equals(parseInt(userInfo.id))
                                    .count()
                                    .then(function (threadsCount) {
                                        var cacheData = [];

                                        for (var i = 0; i < threads.length; i++) {
                                            try {
                                                var tempData = {},
                                                    salt = threads[i].salt;

                                                cacheData.push(createThread(JSON.parse(chatDecrypt(threads[i].data, cacheSecret, threads[i].salt)), false));
                                            }
                                            catch (error) {
                                                fireEvent('error', {
                                                    code: error.code,
                                                    message: error.message,
                                                    error: error
                                                });
                                            }
                                        }

                                        var returnData = {
                                            hasError: false,
                                            cache: true,
                                            errorCode: 0,
                                            errorMessage: '',
                                            result: {
                                                threads: cacheData,
                                                contentCount: threadsCount,
                                                hasNext: !(threads.length < count),//(offset + count < threadsCount && threads.length > 0),
                                                nextOffset: offset + threads.length
                                            }
                                        };

                                        if (cacheData.length > 0) {
                                            callback && callback(returnData);
                                            callback = undefined;
                                            returnCache = true;
                                        }
                                    });
                            })
                            .catch(function (error) {
                                fireEvent('error', {
                                    code: error.code,
                                    message: error.message,
                                    error: error
                                });
                            });
                    }
                    else {
                        fireEvent('error', {
                            code: 6601,
                            message: CHAT_ERRORS[6601],
                            error: null
                        });
                    }
                }

                /**
                 * Retrive get threads response from server
                 */
                return sendMessage(sendMessageParams, {
                    onResult: function (result) {
                        var returnData = {
                            hasError: result.hasError,
                            cache: false,
                            errorMessage: result.errorMessage,
                            errorCode: result.errorCode
                        };

                        if (!returnData.hasError) {

                            var messageContent = result.result,
                                messageLength = messageContent.length,
                                resultData = {
                                    threads: [],
                                    contentCount: result.contentCount,
                                    hasNext: (offset + count < result.contentCount && messageLength > 0),
                                    nextOffset: offset + messageLength
                                },
                                threadData;

                            for (var i = 0; i < messageLength; i++) {
                                threadData = createThread(messageContent[i], false);
                                if (threadData) {
                                    resultData.threads.push(threadData);
                                }
                            }

                            returnData.result = resultData;

                            /**
                             * Updating cache on separated worker to find and
                             * delete all messages that have been deleted from
                             * thread's last section
                             */

                            if (typeof Worker !== 'undefined' && productEnv != 'ReactNative' && canUseCache && cacheSecret.length > 0) {
                                if (typeof(cacheSyncWorker) == 'undefined') {
                                    var plainWorker = function () {
                                        self.importScripts('https://npmcdn.com/dexie@2.0.4/dist/dexie.min.js');
                                        db = new Dexie('podChat');

                                        db.version(1)
                                            .stores({
                                                users: '&id, name, cellphoneNumber, keyId',
                                                contacts: '[owner+id], id, owner, uniqueId, userId, cellphoneNumber, email, firstName, lastName, expireTime',
                                                threads: '[owner+id] ,id, owner, title, time, [owner+time]',
                                                participants: '[owner+id], id, owner, threadId, notSeenDuration, admin, name, contactName, email, expireTime',
                                                messages: '[owner+id], id, owner, threadId, time, [threadId+id], [threadId+owner+time]',
                                                messageGaps: '[owner+id], [owner+waitsFor], id, waitsFor, owner, threadId, time, [threadId+owner+time]',
                                                contentCount: 'threadId, contentCount'
                                            });

                                        addEventListener('message', function (event) {
                                            var data = JSON.parse(event.data);

                                            switch (data.type) {
                                                case 'getThreads':
                                                    var content = JSON.parse(data.data),
                                                        userId = parseInt(data.userId);
                                                    for (var i = 0; i < content.length; i++) {
                                                        var lastMessageTime = (content[i].lastMessageVO) ? content[i].lastMessageVO.time : 0,
                                                            threadId = parseInt(content[i].id);
                                                        if (lastMessageTime > 0) {
                                                            db.messages
                                                                .where('[threadId+owner+time]')
                                                                .between([threadId, userId, lastMessageTime], [
                                                                    threadId,
                                                                    userId,
                                                                    Number.MAX_SAFE_INTEGER * 1000], false, true)
                                                                .delete();
                                                        }
                                                    }
                                                    break;
                                            }
                                        }, false);
                                    };
                                    var code = plainWorker.toString();
                                    code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
                                    var blob = new Blob([code], {type: 'application/javascript'});
                                    cacheSyncWorker = new Worker(URL.createObjectURL(blob));
                                }

                                var workerCommand = {
                                    type: 'getThreads',
                                    userId: userInfo.id,
                                    data: JSON.stringify(resultData.threads)
                                };

                                cacheSyncWorker.postMessage(JSON.stringify(workerCommand));

                                cacheSyncWorker.onmessage = function (event) {
                                    if (event.data == 'terminate') {
                                        cacheSyncWorker.terminate();
                                        cacheSyncWorker = undefined;
                                    }
                                };

                                cacheSyncWorker.onerror = function (event) {
                                    console.log(event);
                                };
                            }

                            /**
                             * Add Threads into cache database #cache
                             */
                            if (canUseCache && cacheSecret.length > 0) {
                                if (db) {
                                    var cacheData = [];

                                    for (var i = 0; i < resultData.threads.length; i++) {
                                        try {
                                            var tempData = {},
                                                salt = Utility.generateUUID();

                                            tempData.id = resultData.threads[i].id;
                                            tempData.owner = userInfo.id;
                                            tempData.title = Utility.crypt(resultData.threads[i].title, cacheSecret, salt);
                                            tempData.time = resultData.threads[i].time;
                                            tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(resultData.threads[i])), cacheSecret, salt);
                                            tempData.salt = salt;

                                            cacheData.push(tempData);
                                        }
                                        catch (error) {
                                            fireEvent('error', {
                                                code: error.code,
                                                message: error.message,
                                                error: error
                                            });
                                        }
                                    }

                                    db.threads.bulkPut(cacheData)
                                        .catch(function (error) {
                                            fireEvent('error', {
                                                code: error.code,
                                                message: error.message,
                                                error: error
                                            });
                                        });
                                }
                                else {
                                    fireEvent('error', {
                                        code: 6601,
                                        message: CHAT_ERRORS[6601],
                                        error: null
                                    });
                                }
                            }
                        }

                        callback && callback(returnData);
                        /**
                         * Delete callback so if server pushes response before
                         * cache, cache won't send data again
                         */
                        callback = undefined;

                        if (!returnData.hasError && returnCache) {
                            fireEvent('threadEvents', {
                                type: 'THREADS_LIST_CHANGE',
                                result: returnData.result
                            });
                        }
                    }
                });
            },

            getAllThreadList = function (params, callback) {
                var sendMessageParams = {
                    chatMessageVOType: chatMessageVOTypes.GET_THREADS,
                    typeCode: params.typeCode,
                    content: {}
                };

                if (params) {
                    if (typeof params.summary == 'boolean') {
                        sendMessageParams.content.summary = params.summary;
                    }
                }

                return sendMessage(sendMessageParams, {
                    onResult: function (result) {

                        if (!result.hasError) {
                            if (canUseCache) {
                                if (db) {
                                    var allThreads = [];
                                    for (var m = 0; m < result.result.length; m++) {
                                        allThreads.push(result.result[m].id);
                                    }
                                    db.threads
                                        .where('owner')
                                        .equals(parseInt(userInfo.id))
                                        .and(function (thread) {
                                            return allThreads.indexOf(thread.id) < 0;
                                        })
                                        .delete()
                                        .catch(function (error) {
                                            fireEvent('error', {
                                                code: error.code,
                                                message: error.message,
                                                error: error
                                            });
                                        });
                                }
                                else {
                                    fireEvent('error', {
                                        code: 6601,
                                        message: CHAT_ERRORS[6601],
                                        error: null
                                    });
                                }
                            }
                        }

                        callback && callback(result);
                    }
                });
            },

            /**
             * Get History.
             *
             * This functions gets history of a thread
             *
             * @access private
             *
             * @param {int}       count             Count of threads to be received
             * @param {int}       offset            Offset of select query
             * @param {long}      threadId          Id of thread to get its history
             * @param {long}      id                Id of single message to get
             * @param {long}      userId            Messages of this SSO User
             * @param {int}       messageType       Type of messages to get (types should be set by client)
             * @param {long}      fromTime          Get messages which have bigger time than given fromTime
             * @param {int}       fromTimeNanos     Get messages which have bigger time than given fromTimeNanos
             * @param {long}      toTime            Get messages which have smaller time than given toTime
             * @param {int}       toTimeNanos       Get messages which have smaller time than given toTimeNanos
             * @param {long}      senderId          Messages of this sender only
             * @param {string}    uniqueIds         Array of unique ids to retrieve
             * @param {string}    order             Order of select query (default: DESC)
             * @param {string}    query             Search term to be looked up in messages content
             * @param {object}    metadataCriteria  This JSON will be used to search in message metadata with GraphQL
             * @param {function}  callback          The callback function to call after
             *
             * @return {object} Instant result of sendMessage
             */
            getHistory = function (params, callback) {
                var startTime = Date.now();

                if (parseInt(params.threadId) > 0) {
                    var sendMessageParams = {
                            chatMessageVOType: chatMessageVOTypes.GET_HISTORY,
                            typeCode: params.typeCode,
                            content: {},
                            subjectId: params.threadId
                        },
                        whereClause = {},
                        offset = (parseInt(params.offset) > 0) ? parseInt(params.offset) : 0,
                        count = (parseInt(params.count) > 0) ? parseInt(params.count) : config.getHistoryCount,
                        order = (typeof params.order != 'undefined') ? (params.order).toLowerCase() : 'desc',
                        functionLevelCache = (typeof params.cache == 'boolean') ? params.cache : true,
                        cacheResult = {},
                        serverResult = {},
                        cacheFirstMessage,
                        cacheLastMessage,
                        messages,
                        returnCache,
                        dynamicHistoryCount = (params.dynamicHistoryCount && typeof params.dynamicHistoryCount === 'boolean')
                            ? params.dynamicHistoryCount
                            : false,
                        sendingQueue = (params.queues && typeof params.queues.sending === 'boolean')
                            ? params.queues.sending
                            : true,
                        failedQueue = (params.queues && typeof params.queues.failed === 'boolean')
                            ? params.queues.failed
                            : true,
                        uploadingQueue = (params.queues && typeof params.queues.uploading === 'boolean')
                            ? params.queues.uploading
                            : true,
                        sendingQueueMessages = [],
                        failedQueueMessages = [],
                        uploadingQueueMessages = [];

                    if (sendingQueue) {
                        getChatSendQueue(parseInt(params.threadId), function (sendQueueMessages) {
                            for (var i = 0; i < sendQueueMessages.length; i++) {
                                var time = new Date().getTime();

                                sendingQueueMessages.push(formatDataToMakeMessage(sendQueueMessages[i].threadId, {
                                    uniqueId: sendQueueMessages[i].uniqueId,
                                    ownerId: userInfo.id,
                                    message: sendQueueMessages[i].content,
                                    metadata: sendQueueMessages[i].metadata,
                                    systemMetadata: sendQueueMessages[i].systemMetadata,
                                    replyInfo: sendQueueMessages[i].replyInfo,
                                    forwardInfo: sendQueueMessages[i].forwardInfo,
                                    time: time,
                                    timeNanos: (time % 1000) * 1000000
                                }));
                            }
                        });
                    }


                    if (uploadingQueue) {
                        getChatUploadQueue(parseInt(params.threadId), function (uploadQueueMessages) {
                            for (var i = 0; i < uploadQueueMessages.length; i++) {
                                uploadQueueMessages[i].message.participant = userInfo;
                                var time = new Date().getTime();
                                uploadQueueMessages[i].message.time = time;
                                uploadQueueMessages[i].message.timeNanos = (time % 1000) * 1000000;
                                uploadingQueueMessages.push(formatDataToMakeMessage(params.threadId, uploadQueueMessages[i].message, false));
                            }
                        });
                    }


                    getChatWaitQueue(parseInt(params.threadId), failedQueue, function (waitQueueMessages) {
                        if (cacheSecret.length > 0) {
                            for (var i = 0; i < waitQueueMessages.length; i++) {
                                var decryptedEnqueuedMessage = Utility.jsonParser(chatDecrypt(waitQueueMessages[i].message, cacheSecret));
                                var time = new Date().getTime();
                                waitQueueMessages[i] = formatDataToMakeMessage(waitQueueMessages[i].threadId,
                                    {
                                        uniqueId: decryptedEnqueuedMessage.uniqueId,
                                        ownerId: userInfo.id,
                                        message: decryptedEnqueuedMessage.content,
                                        metadata: decryptedEnqueuedMessage.metadata,
                                        systemMetadata: decryptedEnqueuedMessage.systemMetadata,
                                        replyInfo: decryptedEnqueuedMessage.replyInfo,
                                        forwardInfo: decryptedEnqueuedMessage.forwardInfo,
                                        participant: userInfo,
                                        time: time,
                                        timeNanos: (time % 1000) * 1000000
                                    });
                            }

                            failedQueueMessages = waitQueueMessages;
                        }
                        else {
                            failedQueueMessages = [];
                        }


                        if (dynamicHistoryCount) {
                            var tempCount = count - (sendingQueueMessages.length + failedQueueMessages.length + uploadingQueueMessages.length);
                            sendMessageParams.content.count = (tempCount > 0) ? tempCount : 0;
                        }
                        else {
                            sendMessageParams.content.count = count;
                        }

                        sendMessageParams.content.offset = offset;
                        sendMessageParams.content.order = order;

                        if (parseInt(params.id) > 0) {
                            sendMessageParams.content.id = whereClause.id = params.id;
                        }

                        if (Array.isArray(params.uniqueIds)) {
                            sendMessageParams.content.uniqueIds = params.uniqueIds;
                        }

                        if (parseInt(params.fromTimeFull) > 0 && params.fromTimeFull.toString().length == 19) {
                            sendMessageParams.content.fromTime = whereClause.fromTime = parseInt(params.fromTimeFull.toString()
                                .substring(0, 13));
                            sendMessageParams.content.fromTimeNanos = whereClause.fromTimeNanos = parseInt(params.fromTimeFull.toString()
                                .substring(10, 19));
                        }
                        else {
                            if (parseInt(params.fromTime) > 0 && parseInt(params.fromTime) < 9999999999999) {
                                sendMessageParams.content.fromTime = whereClause.fromTime = parseInt(params.fromTime);
                            }

                            if (parseInt(params.fromTimeNanos) > 0 && parseInt(params.fromTimeNanos) < 999999999) {
                                sendMessageParams.content.fromTimeNanos = whereClause.fromTimeNanos = parseInt(params.fromTimeNanos);
                            }
                        }

                        if (parseInt(params.toTimeFull) > 0 && params.toTimeFull.toString().length == 19) {
                            sendMessageParams.content.toTime = whereClause.toTime = parseInt(params.toTimeFull.toString()
                                .substring(0, 13));
                            sendMessageParams.content.toTimeNanos = whereClause.toTimeNanos = parseInt(params.toTimeFull.toString()
                                .substring(10, 19));
                        }
                        else {
                            if (parseInt(params.toTime) > 0 && parseInt(params.toTime) < 9999999999999) {
                                sendMessageParams.content.toTime = whereClause.toTime = parseInt(params.toTime);
                            }

                            if (parseInt(params.toTimeNanos) > 0 && parseInt(params.toTimeNanos) < 999999999) {
                                sendMessageParams.content.toTimeNanos = whereClause.toTimeNanos = parseInt(params.toTimeNanos);
                            }
                        }

                        if (typeof params.query != 'undefined') {
                            sendMessageParams.content.query = whereClause.query = params.query;
                        }

                        if (typeof params.metadataCriteria == 'object' && params.metadataCriteria.hasOwnProperty('field')) {
                            sendMessageParams.content.metadataCriteria = whereClause.metadataCriteria = params.metadataCriteria;
                        }

                        /**
                         * Get Thread Messages from cache
                         *
                         * Because we are not applying metadataCriteria search
                         * on cached data, if this attribute has been set, we
                         * should not return any results from cache
                         */

                        // TODO ASC order?!
                        if (functionLevelCache
                            && canUseCache
                            && cacheSecret.length > 0
                            && !whereClause.hasOwnProperty('metadataCriteria')
                            && order.toLowerCase() != "asc") {
                            if (db) {
                                var table = db.messages,
                                    collection;
                                returnCache = true;

                                if (whereClause.hasOwnProperty('id') && whereClause.id > 0) {
                                    collection = table.where('id')
                                        .equals(parseInt(params.id))
                                        .and(function (message) {
                                            return message.owner == userInfo.id;
                                        })
                                        .reverse();
                                }
                                else {
                                    collection = table.where('[threadId+owner+time]')
                                        .between([parseInt(params.threadId), parseInt(userInfo.id), minIntegerValue],
                                            [parseInt(params.threadId), parseInt(userInfo.id), maxIntegerValue * 1000])
                                        .reverse();
                                }

                                collection.toArray()
                                    .then(function (resultMessages) {
                                        messages = resultMessages.sort(Utility.dynamicSort('time', !(order === 'asc')));

                                        if (whereClause.hasOwnProperty('fromTime')) {
                                            var fromTime = (whereClause.hasOwnProperty('fromTimeNanos'))
                                                ? (Math.floor(whereClause.fromTime / 1000) * 1000000000) + whereClause.fromTimeNanos
                                                : whereClause.fromTime * 1000000;
                                            messages = messages.filter(function (message) {
                                                return message.time >= fromTime;
                                            });
                                        }

                                        if (whereClause.hasOwnProperty('toTime')) {
                                            var toTime = (whereClause.hasOwnProperty('toTimeNanos'))
                                                ? ((Math.floor(whereClause.toTime / 1000)) * 1000000000) + whereClause.toTimeNanos
                                                : (whereClause.toTime) * 1000000;
                                            messages = messages.filter(function (message) {
                                                return message.time <= toTime;
                                            });
                                        }

                                        if (whereClause.hasOwnProperty('query') && typeof whereClause.query == 'string') {
                                            messages = messages.filter(function (message) {
                                                var reg = new RegExp(whereClause.query);
                                                return reg.test(chatDecrypt(message.message, cacheSecret, message.salt));
                                            });
                                        }

                                        /**
                                         * We should check to see if message[offset-1] has
                                         * GAP on cache or not? if yes, we should not return
                                         * any value from cache, because there is a gap between
                                         */
                                        if (offset > 0) {
                                            if (typeof messages[offset - 1] == 'object' && messages[offset - 1].hasGap) {
                                                returnCache = false;
                                            }
                                        }

                                        if (returnCache) {
                                            messages = messages.slice(offset, offset + count);

                                            if (messages.length == 0) {
                                                returnCache = false;
                                            }

                                            cacheFirstMessage = messages[0];
                                            cacheLastMessage = messages[messages.length - 1];

                                            /**
                                             * There should not be any GAPs before
                                             * firstMessage of requested messages in cache
                                             * if there is a gap or more, the cache is not
                                             * valid, therefore we wont return any values
                                             * from cache and wait for server's response
                                             *
                                             * To find out if there is a gap or not, all we
                                             * have to do is to check messageGaps table and
                                             * query it for gaps with time bigger than
                                             * firstMessage's time
                                             */
                                            if (cacheFirstMessage && cacheFirstMessage.time > 0) {
                                                db.messageGaps
                                                    .where('time')
                                                    .above(cacheFirstMessage.time)
                                                    .toArray()
                                                    .then(function (gaps) {
                                                        // TODO fill these gaps in a worker
                                                        if (gaps.length > 0) {
                                                            returnCache = false;
                                                        }
                                                    })
                                                    .catch(function (error) {
                                                        fireEvent('error', {
                                                            code: error.code,
                                                            message: error.message,
                                                            error: error
                                                        });
                                                    });
                                            }

                                            if (returnCache) {
                                                collection.count()
                                                    .then(function (collectionContentCount) {
                                                        var contentCount = 0;
                                                        var cacheData = [];

                                                        for (var i = 0; i < messages.length; i++) {
                                                            /**
                                                             * If any of messages between first and last message of cache response
                                                             * has a GAP before them, we shouldn't return cache's result and
                                                             * wait for server's response to hit in
                                                             */
                                                            if (i != 0 && i != messages.length - 1 && messages[i].hasGap) {
                                                                returnCache = false;
                                                                break;
                                                            }

                                                            try {
                                                                var tempData = {},
                                                                    salt = messages[i].salt;

                                                                var tempMessage = formatDataToMakeMessage(messages[i].threadId, JSON.parse(chatDecrypt(messages[i].data, cacheSecret, messages[i].salt)), true);
                                                                cacheData.push(tempMessage);

                                                                cacheResult[tempMessage.id] = {
                                                                    index: i,
                                                                    messageId: tempMessage.id,
                                                                    threadId: tempMessage.threadId,
                                                                    data: Utility.MD5(JSON.stringify([
                                                                        tempMessage.id,
                                                                        tempMessage.message,
                                                                        // tempMessage.edited,
                                                                        // tempMessage.delivered,
                                                                        // tempMessage.seen,
                                                                        tempMessage.metadata,
                                                                        tempMessage.systemMetadata]))
                                                                };
                                                            }
                                                            catch (error) {
                                                                fireEvent('error', {
                                                                    code: error.code,
                                                                    message: error.message,
                                                                    error: error
                                                                });
                                                            }
                                                        }

                                                        /**
                                                         * If there is a GAP between messages of cache result
                                                         * WE should not return data from cache, cause it is not valid!
                                                         * Therefore we wait for server's response and edit cache afterwards
                                                         */
                                                        if (returnCache) {

                                                            /**
                                                             * Get contentCount of this thread from cache
                                                             */
                                                            db.contentCount
                                                                .where('threadId')
                                                                .equals(parseInt(params.threadId))
                                                                .toArray()
                                                                .then(function (res) {
                                                                    var hasNext = true;
                                                                    if (res.length > 0 && res[0].threadId == parseInt(params.threadId)) {
                                                                        contentCount = res[0].contentCount;
                                                                        hasNext = offset + count < res[0].contentCount && messages.length > 0
                                                                    } else {
                                                                        contentCount = collectionContentCount;
                                                                    }

                                                                    var returnData = {
                                                                        hasError: false,
                                                                        cache: true,
                                                                        errorCode: 0,
                                                                        errorMessage: '',
                                                                        result: {
                                                                            history: cacheData,
                                                                            contentCount: contentCount,
                                                                            hasNext: hasNext,
                                                                            nextOffset: offset + messages.length
                                                                        }
                                                                    };

                                                                    if (sendingQueue) {
                                                                        returnData.result.sending = sendingQueueMessages;
                                                                    }
                                                                    if (uploadingQueue) {
                                                                        returnData.result.uploading = uploadingQueueMessages;
                                                                    }
                                                                    if (failedQueue) {
                                                                        returnData.result.failed = failedQueueMessages;
                                                                    }

                                                                    callback && callback(returnData);
                                                                    callback = undefined;
                                                                })
                                                                .catch(function (error) {
                                                                    fireEvent('error', {
                                                                        code: error.code,
                                                                        message: error.message,
                                                                        error: error
                                                                    });
                                                                });
                                                        }
                                                    })
                                                    .catch(function (error) {
                                                        fireEvent('error', {
                                                            code: error.code,
                                                            message: error.message,
                                                            error: error
                                                        });
                                                    });
                                            }
                                        }
                                    })
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }

                        /**
                         * Get Thread Messages From Server
                         */
                        return sendMessage(sendMessageParams, {
                            onResult: function (result) {

                                var returnData = {
                                        hasError: result.hasError,
                                        cache: false,
                                        errorMessage: result.errorMessage,
                                        errorCode: result.errorCode
                                    },
                                    resultMessagesId = [];

                                if (!returnData.hasError) {
                                    var messageContent = result.result,
                                        messageLength = messageContent.length;

                                    var history = reformatThreadHistory(params.threadId, messageContent);

                                    if (messageLength > 0) {
                                        /**
                                         * Calculating First and Last Messages of result
                                         */
                                        var lastMessage = history[messageContent.length - 1],
                                            firstMessage = history[0];

                                        /**
                                         * Sending Delivery for Last Message of Thread
                                         */
                                        if (lastMessage.id > 0 && !lastMessage.delivered) {
                                            deliver({
                                                messageId: lastMessage.id,
                                                ownerId: lastMessage.participant.id
                                            });
                                        }
                                    }

                                    /**
                                     * Add Thread Messages into cache database
                                     * and remove deleted messages from cache database
                                     */
                                    if (canUseCache && cacheSecret.length > 0) {
                                        if (db) {

                                            /**
                                             * Cache Synchronization
                                             *
                                             * If there are some results in cache
                                             * Database, we have to check if they need
                                             * to be deleted or not?
                                             *
                                             * To do so, first of all we should make
                                             * sure that metadataCriteria has not been
                                             * set, cuz we are not applying it on the
                                             * cache results, besides the results from
                                             * cache should not be empty, otherwise
                                             * there is no need to sync cache
                                             */
                                            if (Object.keys(cacheResult).length > 0 && !whereClause.hasOwnProperty('metadataCriteria')) {

                                                /**
                                                 * Check if a condition has been
                                                 * applied on query or not, if there is
                                                 * none, the only limitations on
                                                 * results are count and offset
                                                 *
                                                 * whereClause == []
                                                 */
                                                if (!whereClause || Object.keys(whereClause).length == 0) {

                                                    /**
                                                     * There is no condition applied on
                                                     * query and result is [], so there
                                                     * are no messages in this thread
                                                     * after this offset, and we should
                                                     * delete those messages from cache
                                                     * too
                                                     *
                                                     * result   []
                                                     */
                                                    if (messageLength == 0) {

                                                        /**
                                                         * Order is ASC, so if the server result is empty we
                                                         * should delete everything from cache which has bigger
                                                         * time than first item of cache results for this query
                                                         */
                                                        if (order == 'asc') {
                                                            var finalMessageTime = cacheFirstMessage.time;

                                                            db.messages.where('[threadId+owner+time]')
                                                                .between([parseInt(params.threadId), parseInt(userInfo.id), finalMessageTime],
                                                                    [parseInt(params.threadId), parseInt(userInfo.id), maxIntegerValue * 1000], true, false)
                                                                .delete()
                                                                .catch(function (error) {
                                                                    fireEvent('error', {
                                                                        code: error.code,
                                                                        message: error.message,
                                                                        error: error
                                                                    });
                                                                });
                                                        }

                                                        /**
                                                         * Order is DESC, so if the
                                                         * server result is empty we
                                                         * should delete everything
                                                         * from cache which has smaller
                                                         * time than first item of
                                                         * cache results for this query
                                                         */
                                                        else {
                                                            var finalMessageTime = cacheFirstMessage.time;

                                                            db.messages.where('[threadId+owner+time]')
                                                                .between([parseInt(params.threadId), parseInt(userInfo.id), 0],
                                                                    [parseInt(params.threadId), parseInt(userInfo.id), finalMessageTime], true, true)
                                                                .delete()
                                                                .catch(function (error) {
                                                                    fireEvent('error', {
                                                                        code: error.code,
                                                                        message: error.message,
                                                                        error: error
                                                                    });
                                                                });
                                                        }
                                                    }

                                                    /**
                                                     * Result is not Empty or doesn't
                                                     * have just one single record, so
                                                     * we should remove everything
                                                     * which are between firstMessage
                                                     * and lastMessage of this result
                                                     * from cache database and insert
                                                     * the new result into cache, so
                                                     * the deleted ones would be
                                                     * deleted
                                                     *
                                                     * result   [..., n-1, n, n+1, ...]
                                                     */
                                                    else {

                                                        /**
                                                         * We should check for last message's previouseId if it
                                                         * is undefined, so it is the first message of thread and
                                                         * we should delete everything before it from cache
                                                         */
                                                        if (firstMessage.previousId == undefined || lastMessage.previousId == undefined) {
                                                            var finalMessageTime = (lastMessage.previousId == undefined)
                                                                ? lastMessage.time
                                                                : firstMessage.time;

                                                            db.messages.where('[threadId+owner+time]')
                                                                .between([parseInt(params.threadId), parseInt(userInfo.id), 0],
                                                                    [parseInt(params.threadId), parseInt(userInfo.id), finalMessageTime], true, false)
                                                                .delete()
                                                                .catch(function (error) {
                                                                    fireEvent('error', {
                                                                        code: error.code,
                                                                        message: error.message,
                                                                        error: error
                                                                    });
                                                                });
                                                        }

                                                        /**
                                                         * Offset has been set as 0 so this result is either the
                                                         * very beginning part of thread or the very last
                                                         * Depending on the sort order
                                                         *
                                                         * offset == 0
                                                         */
                                                        if (offset == 0) {

                                                            /**
                                                             * Results are sorted ASC, and the offset is 0 so
                                                             * the first Message of this result is first
                                                             * Message of thread, everything in cache
                                                             * database which has smaller time than this
                                                             * one should be removed
                                                             *
                                                             * order    ASC
                                                             * result   [0, 1, 2, ...]
                                                             */
                                                            if (order === 'asc') {
                                                                var finalMessageTime = firstMessage.time;

                                                                db.messages.where('[threadId+owner+time]')
                                                                    .between([parseInt(params.threadId), parseInt(userInfo.id), 0],
                                                                        [parseInt(params.threadId), parseInt(userInfo.id), finalMessageTime], true, false)
                                                                    .delete()
                                                                    .catch(function (error) {
                                                                        fireEvent('error', {
                                                                            code: error.code,
                                                                            message: error.message,
                                                                            error: error
                                                                        });
                                                                    });
                                                            }

                                                            /**
                                                             * Results are sorted DESC and the offset is 0 so
                                                             * the last Message of this result is the last
                                                             * Message of the thread, everything in cache
                                                             * database which has bigger time than this
                                                             * one should be removed from cache
                                                             *
                                                             * order    DESC
                                                             * result   [..., n-2, n-1, n]
                                                             */
                                                            else {
                                                                var finalMessageTime = firstMessage.time;

                                                                db.messages.where('[threadId+owner+time]')
                                                                    .between([parseInt(params.threadId), parseInt(userInfo.id), finalMessageTime],
                                                                        [parseInt(params.threadId), parseInt(userInfo.id), maxIntegerValue * 1000], false, true)
                                                                    .delete()
                                                                    .catch(function (error) {
                                                                        fireEvent('error', {
                                                                            code: error.code,
                                                                            message: error.message,
                                                                            error: error
                                                                        });
                                                                    });
                                                            }
                                                        }

                                                        /**
                                                         * Server result is not Empty, so we should remove
                                                         * everything which are between firstMessage and lastMessage
                                                         * of this result from cache database and insert the new
                                                         * result into cache, so the deleted ones would be deleted
                                                         *
                                                         * result   [..., n-1, n, n+1, ...]
                                                         */
                                                        var boundryStartMessageTime = (firstMessage.time < lastMessage.time)
                                                            ? firstMessage.time
                                                            : lastMessage.time,
                                                            boundryEndMessageTime = (firstMessage.time > lastMessage.time)
                                                                ? firstMessage.time
                                                                : lastMessage.time;

                                                        db.messages.where('[threadId+owner+time]')
                                                            .between([parseInt(params.threadId), parseInt(userInfo.id), boundryStartMessageTime],
                                                                [parseInt(params.threadId), parseInt(userInfo.id), boundryEndMessageTime], true, true)
                                                            .delete()
                                                            .catch(function (error) {
                                                                fireEvent('error', {
                                                                    code: error.code,
                                                                    message: error.message,
                                                                    error: error
                                                                });
                                                            });
                                                    }
                                                }

                                                /**
                                                 * whereClasue is not empty and we
                                                 * should check for every single one of
                                                 * the conditions to update the cache
                                                 * properly
                                                 *
                                                 * whereClause != []
                                                 */
                                                else {

                                                    /**
                                                     * When user ordered a message with
                                                     * exact ID and server returns []
                                                     * but there is something in cache
                                                     * database, we should delete that
                                                     * row from cache, because it has
                                                     * been deleted
                                                     */
                                                    if (whereClause.hasOwnProperty('id') && whereClause.id > 0) {
                                                        db.messages.where('id')
                                                            .equals(parseInt(whereClause.id))
                                                            .and(function (message) {
                                                                return message.owner == userInfo.id;
                                                            })
                                                            .delete()
                                                            .catch(function (error) {
                                                                fireEvent('error', {
                                                                    code: error.code,
                                                                    message: error.message,
                                                                    error: error
                                                                });
                                                            });
                                                    }

                                                    /**
                                                     * When user sets a query to search
                                                     * on messages we should delete all
                                                     * the results came from cache and
                                                     * insert new results instead,
                                                     * because those messages would be
                                                     * either removed or updated
                                                     */
                                                    if (whereClause.hasOwnProperty('query') && typeof whereClause.query == 'string') {
                                                        db.messages.where('[threadId+owner+time]')
                                                            .between([parseInt(params.threadId), parseInt(userInfo.id), minIntegerValue],
                                                                [parseInt(params.threadId), parseInt(userInfo.id), maxIntegerValue * 1000])
                                                            .and(function (message) {
                                                                var reg = new RegExp(whereClause.query);
                                                                return reg.test(chatDecrypt(message.message, cacheSecret, message.salt));
                                                            })
                                                            .delete()
                                                            .catch(function (error) {
                                                                fireEvent('error', {
                                                                    code: error.code,
                                                                    message: error.message,
                                                                    error: error
                                                                });
                                                            });
                                                    }

                                                    /**
                                                     * Users sets fromTime or toTime or
                                                     * both of them
                                                     */
                                                    if (whereClause.hasOwnProperty('fromTime') || whereClause.hasOwnProperty('toTime')) {

                                                        /**
                                                         * Server response is Empty []
                                                         */
                                                        if (messageLength == 0) {

                                                            /**
                                                             * User set both fromTime and toTime, so we have a
                                                             * boundary restriction in this case. if server
                                                             * result is empty, we should delete all messages from cache
                                                             * which are between fromTime and toTime. if
                                                             * there are any messages on server in this
                                                             * boundary, we should delete all messages
                                                             * which are between time of first and last
                                                             * message of the server result, from cache and
                                                             * insert new result into cache.
                                                             */
                                                            if (whereClause.hasOwnProperty('fromTime') && whereClause.hasOwnProperty('toTime')) {

                                                                /**
                                                                 * Server response is Empty []
                                                                 */
                                                                var fromTime = (whereClause.hasOwnProperty('fromTimeNanos'))
                                                                    ? ((whereClause.fromTime / 1000) * 1000000000) + whereClause.fromTimeNanos
                                                                    : whereClause.fromTime * 1000000,
                                                                    toTime = (whereClause.hasOwnProperty('toTimeNanos'))
                                                                        ? (((whereClause.toTime / 1000) + 1) * 1000000000) + whereClause.toTimeNanos
                                                                        : (whereClause.toTime + 1) * 1000000;

                                                                db.messages.where('[threadId+owner+time]')
                                                                    .between([parseInt(params.threadId), parseInt(userInfo.id), fromTime],
                                                                        [parseInt(params.threadId), parseInt(userInfo.id), toTime], true, true)
                                                                    .delete()
                                                                    .catch(function (error) {
                                                                        fireEvent('error', {
                                                                            code: error.code,
                                                                            message: error.message,
                                                                            error: error
                                                                        });
                                                                    });
                                                            }

                                                            /**
                                                             * User only set fromTime
                                                             */
                                                            else if (whereClause.hasOwnProperty('fromTime')) {

                                                                /**
                                                                 * Server response is Empty []
                                                                 */
                                                                var fromTime = (whereClause.hasOwnProperty('fromTimeNanos'))
                                                                    ? ((whereClause.fromTime / 1000) * 1000000000) + whereClause.fromTimeNanos
                                                                    : whereClause.fromTime * 1000000;

                                                                db.messages.where('[threadId+owner+time]')
                                                                    .between([parseInt(params.threadId), parseInt(userInfo.id), fromTime],
                                                                        [parseInt(params.threadId), parseInt(userInfo.id), maxIntegerValue * 1000], true, false)
                                                                    .delete()
                                                                    .catch(function (error) {
                                                                        fireEvent('error', {
                                                                            code: error.code,
                                                                            message: error.message,
                                                                            error: error
                                                                        });
                                                                    });
                                                            }

                                                            /**
                                                             * User only set toTime
                                                             */
                                                            else {
                                                                /**
                                                                 * Server response is Empty []
                                                                 */
                                                                var toTime = (whereClause.hasOwnProperty('toTimeNanos'))
                                                                    ? (((whereClause.toTime / 1000) + 1) * 1000000000) + whereClause.toTimeNanos
                                                                    : (whereClause.toTime + 1) * 1000000;

                                                                db.messages.where('[threadId+owner+time]')
                                                                    .between([parseInt(params.threadId), parseInt(userInfo.id), minIntegerValue],
                                                                        [parseInt(params.threadId), parseInt(userInfo.id), toTime], true, true)
                                                                    .delete()
                                                                    .catch(function (error) {
                                                                        fireEvent('error', {
                                                                            code: error.code,
                                                                            message: error.message,
                                                                            error: error
                                                                        });
                                                                    });
                                                            }
                                                        }

                                                        /**
                                                         * Server response is not Empty
                                                         * [..., n-1, n, n+1, ...]
                                                         */
                                                        else {

                                                            /**
                                                             * Server response is not Empty
                                                             * [..., n-1, n, n+1, ...]
                                                             */
                                                            var boundryStartMessageTime = (firstMessage.time < lastMessage.time)
                                                                ? firstMessage.time
                                                                : lastMessage.time,
                                                                boundryEndMessageTime = (firstMessage.time > lastMessage.time)
                                                                    ? firstMessage.time
                                                                    : lastMessage.time;

                                                            db.messages.where('[threadId+owner+time]')
                                                                .between([parseInt(params.threadId), parseInt(userInfo.id), boundryStartMessageTime],
                                                                    [parseInt(params.threadId), parseInt(userInfo.id), boundryEndMessageTime], true, true)
                                                                .delete()
                                                                .catch(function (error) {
                                                                    fireEvent('error', {
                                                                        code: error.code,
                                                                        message: error.message,
                                                                        error: error
                                                                    });
                                                                });
                                                        }
                                                    }
                                                }
                                            }

                                            /**
                                             * Insert new messages into cache database
                                             * after deleting old messages from cache
                                             */
                                            var cacheData = [];

                                            for (var i = 0; i < history.length; i++) {
                                                serverResult[history[i].id] = {
                                                    index: i,
                                                    data: Utility.MD5(JSON.stringify([
                                                        history[i].id,
                                                        history[i].message,
                                                        // history[i].edited,
                                                        // history[i].delivered,
                                                        // history[i].seen,
                                                        history[i].metadata,
                                                        history[i].systemMetadata]))
                                                };
                                                try {
                                                    var tempData = {},
                                                        salt = Utility.generateUUID();
                                                    tempData.id = parseInt(history[i].id);
                                                    tempData.owner = parseInt(userInfo.id);
                                                    tempData.threadId = parseInt(history[i].threadId);
                                                    tempData.time = history[i].time;
                                                    tempData.message = Utility.crypt(history[i].message, cacheSecret, salt);
                                                    tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(history[i])), cacheSecret, salt);
                                                    tempData.salt = salt;
                                                    tempData.sendStatus = 'sent';
                                                    tempData.hasGap = false;

                                                    cacheData.push(tempData);
                                                    resultMessagesId.push(history[i].id);
                                                }
                                                catch (error) {
                                                    fireEvent('error', {
                                                        code: error.code,
                                                        message: error.message,
                                                        error: error
                                                    });
                                                }
                                            }

                                            db.messages.bulkPut(cacheData)
                                                .then(function () {
                                                    if (typeof lastMessage == 'object' &&
                                                        lastMessage != null &&
                                                        lastMessage.id > 0 &&
                                                        lastMessage.previousId > 0) {
                                                        /**
                                                         * Check to see if there is a Gap in cache before
                                                         * lastMessage or not?
                                                         * To do this, we should check existence of message
                                                         * with the ID of lastMessage's previousId field
                                                         */
                                                        db.messages
                                                            .where('[owner+id]')
                                                            .between([userInfo.id, lastMessage.previousId], [userInfo.id, lastMessage.previousId], true, true)
                                                            .toArray()
                                                            .then(function (messages) {
                                                                if (messages.length == 0) {
                                                                    /**
                                                                     * Previous Message of last message is not in cache database
                                                                     * so there is a GAP in cache database for this thread before
                                                                     * the last message.
                                                                     * We should insert this GAP in messageGaps database
                                                                     */
                                                                    db.messageGaps
                                                                        .put({
                                                                            id: parseInt(lastMessage.id),
                                                                            owner: parseInt(userInfo.id),
                                                                            waitsFor: parseInt(lastMessage.previousId),
                                                                            threadId: parseInt(lastMessage.threadId),
                                                                            time: lastMessage.time
                                                                        })
                                                                        .then(function () {
                                                                            db.messages
                                                                                .update([userInfo.id, lastMessage.id], {hasGap: true})
                                                                                .catch(function (error) {
                                                                                    fireEvent('error', {
                                                                                        code: error.code,
                                                                                        message: error.message,
                                                                                        error: error
                                                                                    });
                                                                                });
                                                                        })
                                                                        .catch(function (error) {
                                                                            fireEvent('error', {
                                                                                code: error.code,
                                                                                message: error.message,
                                                                                error: error
                                                                            });
                                                                        });
                                                                }
                                                            })
                                                            .catch(function (error) {
                                                                fireEvent('error', {
                                                                    code: error.code,
                                                                    message: error.message,
                                                                    error: error
                                                                });
                                                            });
                                                    }

                                                    /**
                                                     * Some new messages have been added into cache,
                                                     * We should check to see if any GAPs have been
                                                     * filled with these messages or not?
                                                     */

                                                    db.messageGaps
                                                        .where('waitsFor')
                                                        .anyOf(resultMessagesId)
                                                        .and(function (messages) {
                                                            return messages.owner == userInfo.id;
                                                        })
                                                        .toArray()
                                                        .then(function (needsToBeDeleted) {
                                                            /**
                                                             * These messages have to be deleted from messageGaps table
                                                             */
                                                            var messagesToBeDeleted = needsToBeDeleted.map(function (msg) {
                                                                /**
                                                                 * We have to update messages table and
                                                                 * set hasGap for those messages as false
                                                                 */
                                                                db.messages
                                                                    .update([userInfo.id, msg.id], {hasGap: false})
                                                                    .catch(function (error) {
                                                                        fireEvent('error', {
                                                                            code: error.code,
                                                                            message: error.message,
                                                                            error: error
                                                                        });
                                                                    });

                                                                return [userInfo.id, msg.id];
                                                            });

                                                            db.messageGaps.bulkDelete(messagesToBeDeleted);
                                                        })
                                                        .catch(function (error) {
                                                            fireEvent('error', {
                                                                code: error.code,
                                                                message: error.message,
                                                                error: error
                                                            });
                                                        });
                                                })
                                                .catch(function (error) {
                                                    fireEvent('error', {
                                                        code: error.code,
                                                        message: error.message,
                                                        error: error
                                                    });
                                                });

                                            /**
                                             * Update contentCount of this thread in cache
                                             * contentCount of thread would be count of all
                                             * thread messages if and only if there are no
                                             * other conditions applied on getHistory that
                                             * count and offset
                                             */
                                            if((Object.keys(whereClause).length === 0)) {
                                                db.contentCount
                                                    .put({
                                                        threadId: parseInt(params.threadId),
                                                        contentCount: result.contentCount
                                                    })
                                                    .catch(function(error) {
                                                        fireEvent('error', {
                                                            code: error.code,
                                                            message: error.message,
                                                            error: error
                                                        });
                                                    });
                                            }
                                        }
                                        else {
                                            fireEvent('error', {
                                                code: 6601,
                                                message: CHAT_ERRORS[6601],
                                                error: null
                                            });
                                        }
                                    }

                                    var resultData = {
                                        history: history,
                                        contentCount: result.contentCount,
                                        hasNext: (sendMessageParams.content.offset + sendMessageParams.content.count < result.contentCount &&
                                            messageLength > 0),
                                        nextOffset: sendMessageParams.content.offset + messageLength
                                    };

                                    returnData.result = resultData;

                                    if (sendingQueue) {
                                        returnData.result.sending = sendingQueueMessages;
                                    }
                                    if (uploadingQueue) {
                                        returnData.result.uploading = uploadingQueueMessages;
                                    }
                                    if (failedQueue) {
                                        returnData.result.failed = failedQueueMessages;
                                    }


                                    /**
                                     * Check Differences between Cache and Server response
                                     */
                                    if (returnCache) {
                                        /**
                                         * If there are some messages in cache but they
                                         * are not in server's response, we can assume
                                         * that they have been removed from server, so
                                         * we should call MESSAGE_DELETE event for them
                                         */
                                        for (var key in cacheResult) {
                                            if (!serverResult.hasOwnProperty(key)) {
                                                fireEvent('messageEvents', {
                                                    type: 'MESSAGE_DELETE',
                                                    result: {
                                                        message: {
                                                            id: cacheResult[key].messageId,
                                                            threadId: cacheResult[key].threadId
                                                        }
                                                    }
                                                });
                                            }
                                        }

                                        for (var key in serverResult) {
                                            if (cacheResult.hasOwnProperty(key)) {
                                                /**
                                                 * Check digest of cache and server response, if
                                                 * they are not the same, we should emit
                                                 */
                                                if (cacheResult[key].data != serverResult[key].data) {
                                                    /**
                                                     * This message is already on cache, but it's
                                                     * content has been changed, so we emit a
                                                     * message edit event to inform client
                                                     */
                                                    fireEvent('messageEvents', {
                                                        type: 'MESSAGE_EDIT',
                                                        result: {
                                                            message: history[serverResult[key].index]
                                                        }
                                                    });
                                                }
                                            }
                                            else {
                                                /**
                                                 * This Message has not found on cache but it has
                                                 * came from server, so we emit it as a new message
                                                 */
                                                fireEvent('messageEvents', {
                                                    type: 'MESSAGE_NEW',
                                                    cache: true,
                                                    result: {
                                                        message: history[serverResult[key].index]
                                                    }
                                                });
                                            }
                                        }

                                    }
                                    else {
                                        callback && callback(returnData);
                                        callback = undefined;
                                    }
                                }
                            }
                        });
                    });
                }

                return;
            },

            /**
             * Update Thread Info
             *
             * This functions updates metadata of thread
             *
             * @access private
             *
             * @param {int}       threadId      Id of thread
             * @param {string}    image         URL og thread image to be set
             * @param {string}    description   Description for thread
             * @param {string}    title         New Title for thread
             * @param {object}    metadata      New Metadata to be set on thread
             * @param {function}  callback      The callback function to call after
             *
             * @return {object} Instant sendMessage result
             */
            updateThreadInfo = function (params, callback) {
                var updateThreadInfoData = {
                    chatMessageVOType: chatMessageVOTypes.UPDATE_THREAD_INFO,
                    typeCode: params.typeCode,
                    subjectId: params.threadId,
                    content: {},
                    pushMsgType: 4,
                    token: token
                };

                if (params) {
                    if (parseInt(params.threadId) > 0) {
                        updateThreadInfoData.subjectId = params.threadId;
                    }
                    else {
                        fireEvent('error', {
                            code: 999,
                            message: 'Thread ID is required for Updating thread info!'
                        });
                    }

                    if (typeof params.image == 'string') {
                        updateThreadInfoData.content.image = params.image;
                    }

                    if (typeof params.description == 'string') {
                        updateThreadInfoData.content.description = params.description;
                    }

                    if (typeof params.title == 'string') {
                        updateThreadInfoData.content.name = params.title;
                    }

                    if (typeof params.metadata == 'object') {
                        updateThreadInfoData.content.metadata = JSON.stringify(params.metadata);
                    }
                    else if (typeof params.metadata == 'string') {
                        updateThreadInfoData.content.metadata = params.metadata;
                    }
                }

                return sendMessage(updateThreadInfoData, {
                    onResult: function (result) {
                        callback && callback(result);
                    }
                });
            },

            /**
             * Get Thread Participants
             *
             * Gets participants list of given thread
             *
             * @access pubic
             *
             * @param {int}     threadId        Id of thread which you want to get participants of
             * @param {int}     count           Count of objects to get
             * @param {int}     offset          Offset of select Query
             * @param {string}  name            Search in Participants list (LIKE in name, contactName, email)
             *
             * @return {object} Instant Response
             */
            getThreadParticipants = function (params, callback) {
                var sendMessageParams = {
                        chatMessageVOType: chatMessageVOTypes.THREAD_PARTICIPANTS,
                        typeCode: params.typeCode,
                        content: {},
                        subjectId: params.threadId
                    },
                    whereClause = {},
                    returnCache = false;

                var offset = (parseInt(params.offset) > 0)
                    ? parseInt(params.offset)
                    : 0,
                    count = (parseInt(params.count) > 0)
                        ? parseInt(params.count)
                        : config.getHistoryCount;

                sendMessageParams.content.count = count;
                sendMessageParams.content.offset = offset;

                if (typeof params.name === 'string') {
                    sendMessageParams.content.name = whereClause.name = params.name;
                }

                if (typeof params.admin === 'boolean') {
                    sendMessageParams.content.admin = params.admin;
                }

                var functionLevelCache = (typeof params.cache == 'boolean') ? params.cache : true;

                /**
                 * Retrieve thread participants from cache
                 */
                if (functionLevelCache && canUseCache && cacheSecret.length > 0) {
                    if (db) {

                        db.participants.where('expireTime')
                            .below(new Date().getTime())
                            .delete()
                            .then(function () {

                                var thenAble;

                                if (Object.keys(whereClause).length === 0) {
                                    thenAble = db.participants.where('threadId')
                                        .equals(parseInt(params.threadId))
                                        .and(function (participant) {
                                            return participant.owner == userInfo.id;
                                        });
                                }
                                else {
                                    if (whereClause.hasOwnProperty('name')) {
                                        thenAble = db.participants.where('threadId')
                                            .equals(parseInt(params.threadId))
                                            .and(function (participant) {
                                                return participant.owner == userInfo.id;
                                            })
                                            .filter(function (contact) {
                                                var reg = new RegExp(whereClause.name);
                                                return reg.test(chatDecrypt(contact.contactName, cacheSecret, contact.salt) + ' '
                                                    + chatDecrypt(contact.name, cacheSecret, contact.salt) + ' '
                                                    + chatDecrypt(contact.email, cacheSecret, contact.salt));
                                            });
                                    }
                                }

                                thenAble.offset(offset)
                                    .limit(count)
                                    .reverse()
                                    .toArray()
                                    .then(function (participants) {
                                        db.participants.where('threadId')
                                            .equals(parseInt(params.threadId))
                                            .and(function (participant) {
                                                return participant.owner == userInfo.id;
                                            })
                                            .count()
                                            .then(function (participantsCount) {

                                                var cacheData = [];

                                                for (var i = 0; i < participants.length; i++) {
                                                    try {
                                                        var tempData = {},
                                                            salt = participants[i].salt;

                                                        cacheData.push(formatDataToMakeParticipant(
                                                            JSON.parse(chatDecrypt(participants[i].data, cacheSecret, participants[i].salt)), participants[i].threadId));
                                                    }
                                                    catch (error) {
                                                        fireEvent('error', {
                                                            code: error.code,
                                                            message: error.message,
                                                            error: error
                                                        });
                                                    }
                                                }

                                                var returnData = {
                                                    hasError: false,
                                                    cache: true,
                                                    errorCode: 0,
                                                    errorMessage: '',
                                                    result: {
                                                        participants: cacheData,
                                                        contentCount: participantsCount,
                                                        hasNext: !(participants.length < count),//(offset + count < participantsCount && participants.length > 0),
                                                        nextOffset: offset + participants.length
                                                    }
                                                };

                                                if (cacheData.length > 0) {
                                                    callback && callback(returnData);
                                                    callback = undefined;
                                                    returnCache = true;
                                                }
                                            });
                                    })
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });
                            })
                            .catch(function (error) {
                                fireEvent('error', {
                                    code: error.code,
                                    message: error.message,
                                    error: error
                                });
                            });
                    }
                    else {
                        fireEvent('error', {
                            code: 6601,
                            message: CHAT_ERRORS[6601],
                            error: null
                        });
                    }
                }

                return sendMessage(sendMessageParams, {
                    onResult: function (result) {
                        var returnData = {
                            hasError: result.hasError,
                            cache: false,
                            errorMessage: result.errorMessage,
                            errorCode: result.errorCode
                        };

                        if (!returnData.hasError) {
                            var messageContent = result.result,
                                messageLength = messageContent.length,
                                resultData = {
                                    participants: reformatThreadParticipants(messageContent, params.threadId),
                                    contentCount: result.contentCount,
                                    hasNext: (sendMessageParams.content.offset + sendMessageParams.content.count < result.contentCount && messageLength > 0),
                                    nextOffset: sendMessageParams.content.offset + messageLength
                                };

                            returnData.result = resultData;

                            /**
                             * Add thread participants into cache database #cache
                             */
                            if (canUseCache && cacheSecret.length > 0) {
                                if (db) {

                                    var cacheData = [];

                                    for (var i = 0; i < resultData.participants.length; i++) {
                                        try {
                                            var tempData = {},
                                                salt = Utility.generateUUID();

                                            tempData.id = parseInt(resultData.participants[i].id);
                                            tempData.owner = parseInt(userInfo.id);
                                            tempData.threadId = parseInt(resultData.participants[i].threadId);
                                            tempData.notSeenDuration = resultData.participants[i].notSeenDuration;
                                            tempData.admin = resultData.participants[i].admin;
                                            tempData.name = Utility.crypt(resultData.participants[i].name, cacheSecret, salt);
                                            tempData.contactName = Utility.crypt(resultData.participants[i].contactName, cacheSecret, salt);
                                            tempData.email = Utility.crypt(resultData.participants[i].email, cacheSecret, salt);
                                            tempData.expireTime = new Date().getTime() + cacheExpireTime;
                                            tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(resultData.participants[i])), cacheSecret, salt);
                                            tempData.salt = salt;

                                            cacheData.push(tempData);
                                        }
                                        catch (error) {
                                            fireEvent('error', {
                                                code: error.code,
                                                message: error.message,
                                                error: error
                                            });
                                        }
                                    }

                                    db.participants.bulkPut(cacheData)
                                        .catch(function (error) {
                                            fireEvent('error', {
                                                code: error.code,
                                                message: error.message,
                                                error: error
                                            });
                                        });
                                }
                                else {
                                    fireEvent('error', {
                                        code: 6601,
                                        message: CHAT_ERRORS[6601],
                                        error: null
                                    });
                                }
                            }
                        }

                        callback && callback(returnData);
                        /**
                         * Delete callback so if server pushes response before
                         * cache, cache won't send data again
                         */
                        callback = undefined;

                        if (!returnData.hasError && returnCache) {
                            fireEvent('threadEvents', {
                                type: 'THREAD_PARTICIPANTS_LIST_CHANGE',
                                threadId: params.threadId,
                                result: returnData.result
                            });
                        }
                    }
                });
            },

            /**
             * Deliver
             *
             * This functions sends delivery messages for a message
             *
             * @access private
             *
             * @param {int}    ownerId    Id of Message owner
             * @param {long}   messageId  Id of Message
             *
             * @return {object} Instant sendMessage result
             */
            deliver = function (params) {
                if (userInfo && params.ownerId !== userInfo.id) {
                    return sendMessage({
                        chatMessageVOType: chatMessageVOTypes.DELIVERY,
                        typeCode: params.typeCode,
                        content: params.messageId,
                        pushMsgType: 3
                    });
                }
            },

            /**
             * Get Image.
             *
             * This functions gets an uploaded image from File Server.
             *
             * @since 3.9.9
             * @access private
             *
             * @param {long}    imageId         ID of image
             * @param {int}     width           Required width to get
             * @param {int}     height          Required height to get
             * @param {boolean} actual          Required height to get
             * @param {boolean} downloadable    TRUE to be downloadable / FALSE to not
             * @param {string}  hashCode        HashCode of uploaded file
             *
             * @return {object} Image Object
             */
            getImage = function (params, callback) {
                getImageData = {};

                if (params) {
                    if (parseInt(params.imageId) > 0) {
                        getImageData.imageId = params.imageId;
                    }

                    if (typeof params.hashCode == 'string') {
                        getImageData.hashCode = params.hashCode;
                    }

                    if (parseInt(params.width) > 0) {
                        getImageData.width = params.width;
                    }

                    if (parseInt(params.height) > 0) {
                        getImageData.height = params.height;
                    }

                    if (parseInt(params.actual) > 0) {
                        getImageData.actual = params.actual;
                    }

                    if (parseInt(params.downloadable) > 0) {
                        getImageData.downloadable = params.downloadable;
                    }
                }

                httpRequest({
                    url: SERVICE_ADDRESSES.FILESERVER_ADDRESS + SERVICES_PATH.GET_IMAGE,
                    method: 'GET',
                    data: getImageData
                }, function (result) {
                    if (!result.hasError) {
                        var queryString = '?';
                        for (var i in params) {
                            queryString += i + '=' + params[i] + '&';
                        }
                        queryString = queryString.slice(0, -1);
                        var image = SERVICE_ADDRESSES.FILESERVER_ADDRESS + SERVICES_PATH.GET_IMAGE + queryString;
                        callback({
                            hasError: result.hasError,
                            result: image
                        });
                    }
                    else {
                        callback({
                            hasError: true
                        });
                    }
                });
            },

            /**
             * Get File.
             *
             * This functions gets an uploaded file from File Server.
             *
             * @since 3.9.9
             * @access private
             *
             * @param {long}    fileId          ID of file
             * @param {boolean} downloadable    TRUE to be downloadable / False to not
             * @param {string}  hashCode        HashCode of uploaded file
             *
             * @return {object} File Object
             */
            getFile = function (params, callback) {
                getFileData = {};

                if (params) {
                    if (typeof params.fileId != 'undefined') {
                        getFileData.fileId = params.fileId;
                    }

                    if (typeof params.hashCode == 'string') {
                        getFileData.hashCode = params.hashCode;
                    }

                    if (typeof params.downloadable == 'boolean') {
                        getFileData.downloadable = params.downloadable;
                    }
                }

                httpRequest({
                    url: SERVICE_ADDRESSES.FILESERVER_ADDRESS +
                        SERVICES_PATH.GET_FILE,
                    method: 'GET',
                    data: getFileData
                }, function (result) {
                    if (!result.hasError) {
                        var queryString = '?';
                        for (var i in params) {
                            queryString += i + '=' + params[i] + '&';
                        }
                        queryString = queryString.slice(0, -1);
                        var file = SERVICE_ADDRESSES.FILESERVER_ADDRESS + SERVICES_PATH.GET_FILE + queryString;
                        callback({
                            hasError: result.hasError,
                            result: file
                        });
                    }
                    else {
                        callback({
                            hasError: true
                        });
                    }
                });
            },

            /**
             * Upload File
             *
             * Upload files to File Server
             *
             * @since 3.9.9
             * @access private
             *
             * @param {string}  fileName        A name for the file
             * @param {file}    file            FILE: the file
             *
             * @link http://docs.pod.land/v1.0.8.0/Developer/CustomPost/605/File
             *
             * @return {object} Uploaded File Object
             */
            uploadFile = function (params, callback) {
                var fileName,
                    fileType,
                    fileSize,
                    fileExtension,
                    uploadUniqueId,
                    uploadThreadId;

                fileName = params.file.name;
                fileType = params.file.type;
                fileSize = params.file.size;
                fileExtension = params.file.name.split('.')
                    .pop();


                var uploadFileData = {};

                if (params) {
                    if (typeof params.file !== 'undefined') {
                        uploadFileData.file = params.file;
                    }

                    if (params.randomFileName) {
                        uploadFileData.fileName = Utility.generateUUID() + '.' + fileExtension;
                    }
                    else {
                        uploadFileData.fileName = fileName;
                    }

                    uploadFileData.fileSize = fileSize;

                    if (parseInt(params.threadId) > 0) {
                        uploadThreadId = params.threadId;
                        uploadFileData.threadId = params.threadId;
                    }
                    else {
                        uploadThreadId = 0;
                        uploadFileData.threadId = 0;
                    }

                    if (typeof params.uniqueId == 'string') {
                        uploadUniqueId = params.uniqueId;
                        uploadFileData.uniqueId = params.uniqueId;
                    }
                    else {
                        uploadUniqueId = Utility.generateUUID();
                        uploadFileData.uniqueId = uploadUniqueId;
                    }

                    if (typeof params.originalFileName == 'string') {
                        uploadFileData.originalFileName = params.originalFileName;
                    }
                    else {
                        uploadFileData.originalFileName = fileName;
                    }
                }

                httpRequest({
                    url: SERVICE_ADDRESSES.FILESERVER_ADDRESS + SERVICES_PATH.UPLOAD_FILE,
                    method: 'POST',
                    headers: {
                        '_token_': token,
                        '_token_issuer_': 1
                    },
                    data: uploadFileData,
                    uniqueId: uploadUniqueId
                }, function (result) {
                    if (!result.hasError) {
                        try {
                            var response = (typeof result.result.responseText == 'string')
                                ? JSON.parse(result.result.responseText)
                                : result.result.responseText;
                            callback({
                                hasError: response.hasError,
                                result: response.result
                            });
                        }
                        catch (e) {
                            callback({
                                hasError: true,
                                errorCode: 999,
                                errorMessage: 'Problem in Parsing result'
                            });
                        }
                    }
                    else {
                        callback({
                            hasError: true,
                            errorCode: result.errorCode,
                            errorMessage: result.errorMessage
                        });
                    }
                });

                return {
                    uniqueId: uploadUniqueId,
                    threadId: uploadThreadId,
                    participant: userInfo,
                    content: {
                        caption: params.content,
                        file: {
                            uniqueId: uploadUniqueId,
                            fileName: fileName,
                            fileSize: fileSize,
                            fileObject: params.file
                        }
                    }
                };
            },

            /**
             * Upload File
             *
             * Upload files to File Server
             *
             * @since 3.9.9
             * @access private
             *
             * @param {string}  fileName        A name for the file
             * @param {file}    file            FILE: the file
             *
             * @link http://docs.pod.land/v1.0.8.0/Developer/CustomPost/605/File
             *
             * @return {object} Uploaded File Object
             */
            uploadFileFromUrl = function (params, callback) {
                var uploadUniqueId,
                    uploadThreadId;

                var uploadFileData = {},
                    fileExtension;

                if (params) {
                    if (typeof params.fileUrl !== 'undefined') {
                        uploadFileData.url = params.fileUrl;
                    }

                    if (typeof params.fileExtension !== 'undefined') {
                        fileExtension = params.fileExtension;
                    }
                    else {
                        fileExtension = 'png';
                    }

                    if (typeof params.fileName == 'string') {
                        uploadFileData.filename = params.fileName;
                    }
                    else {
                        uploadFileData.filename = Utility.generateUUID() + '.' + fileExtension;
                    }

                    if (typeof params.uniqueId == 'string') {
                        uploadUniqueId = params.uniqueId;
                    }
                    else {
                        uploadUniqueId = Utility.generateUUID();
                    }

                    if (parseInt(params.threadId) > 0) {
                        uploadThreadId = params.threadId;
                    }
                    else {
                        uploadThreadId = 0;
                    }

                    uploadFileData.isPublic = true;
                }

                httpRequest({
                    url: SERVICE_ADDRESSES.POD_DRIVE_ADDRESS + SERVICES_PATH.DRIVE_UPLOAD_FILE_FROM_URL,
                    method: 'POST',
                    headers: {
                        '_token_': token,
                        '_token_issuer_': 1
                    },
                    data: uploadFileData,
                    uniqueId: uploadUniqueId
                }, function (result) {
                    if (!result.hasError) {
                        try {
                            var response = (typeof result.result.responseText == 'string')
                                ? JSON.parse(result.result.responseText)
                                : result.result.responseText;
                            callback({
                                hasError: response.hasError,
                                result: response.result
                            });
                        }
                        catch (e) {
                            callback({
                                hasError: true,
                                errorCode: 999,
                                errorMessage: 'Problem in Parsing result',
                                error: e
                            });
                        }
                    }
                    else {
                        callback({
                            hasError: true,
                            errorCode: result.errorCode,
                            errorMessage: result.errorMessage
                        });
                    }
                });

                return {
                    uniqueId: uploadUniqueId,
                    threadId: uploadThreadId,
                    participant: userInfo,
                    content: {
                        file: {
                            uniqueId: uploadUniqueId,
                            fileUrl: params.fileUrl
                        }
                    }
                };
            },

            /**
             * Upload Image
             *
             * Upload images to Image Server
             *
             * @since 3.9.9
             * @access private
             *
             * @param {string}  fileName        A name for the file
             * @param {file}    image           FILE: the image file  (if its an image file)
             * @param {float}   xC              Crop Start point x    (if its an image file)
             * @param {float}   yC              Crop Start point Y    (if its an image file)
             * @param {float}   hC              Crop size Height      (if its an image file)
             * @param {float}   wC              Crop size Weight      (if its an image file)
             *
             * @link http://docs.pod.land/v1.0.8.0/Developer/CustomPost/215/UploadImage
             *
             * @return {object} Uploaded Image Object
             */
            uploadImage = function (params, callback) {
                var fileName,
                    fileType,
                    fileSize,
                    fileExtension,
                    uploadUniqueId,
                    uploadThreadId;

                fileName = params.image.name;
                fileType = params.image.type;
                fileSize = params.image.size;
                fileExtension = params.image.name.split('.')
                    .pop();


                if (imageMimeTypes.indexOf(fileType) >= 0 || imageExtentions.indexOf(fileExtension) >= 0) {
                    uploadImageData = {};

                    if (params) {
                        if (typeof params.image !== 'undefined') {
                            uploadImageData.image = params.image;
                            uploadImageData.file = params.image;
                        }

                        if (params.randomFileName) {
                            uploadImageData.fileName = Utility.generateUUID() + '.' + fileExtension;
                        }
                        else {
                            uploadImageData.fileName = fileName;
                        }

                        uploadImageData.fileSize = fileSize;

                        if (parseInt(params.threadId) > 0) {
                            uploadThreadId = params.threadId;
                            uploadImageData.threadId = params.threadId;
                        }
                        else {
                            uploadThreadId = 0;
                            uploadImageData.threadId = 0;
                        }

                        if (typeof params.uniqueId == 'string') {
                            uploadUniqueId = params.uniqueId;
                            uploadImageData.uniqueId = params.uniqueId;
                        }
                        else {
                            uploadUniqueId = Utility.generateUUID();
                            uploadImageData.uniqueId = uploadUniqueId;
                        }

                        if (typeof params.originalFileName == 'string') {
                            uploadImageData.originalFileName = params.originalFileName;
                        }
                        else {
                            uploadImageData.originalFileName = fileName;
                        }

                        if (parseInt(params.xC) > 0) {
                            uploadImageData.xC = params.xC;
                        }

                        if (parseInt(params.yC) > 0) {
                            uploadImageData.yC = params.yC;
                        }

                        if (parseInt(params.hC) > 0) {
                            uploadImageData.hC = params.hC;
                        }

                        if (parseInt(params.wC) > 0) {
                            uploadImageData.wC = params.wC;
                        }
                    }

                    httpRequest({
                        url: SERVICE_ADDRESSES.FILESERVER_ADDRESS + SERVICES_PATH.UPLOAD_IMAGE,
                        method: 'POST',
                        headers: {
                            '_token_': token,
                            '_token_issuer_': 1
                        },
                        data: uploadImageData,
                        uniqueId: uploadUniqueId
                    }, function (result) {
                        if (!result.hasError) {
                            try {
                                var response = (typeof result.result.responseText == 'string')
                                    ? JSON.parse(result.result.responseText)
                                    : result.result.responseText;
                                if (typeof response.hasError !== 'undefined' && !response.hasError) {
                                    callback({
                                        hasError: response.hasError,
                                        result: response.result
                                    });
                                }
                                else {
                                    callback({
                                        hasError: true,
                                        errorCode: response.errorCode,
                                        errorMessage: response.message
                                    });
                                }
                            }
                            catch (e) {
                                callback({
                                    hasError: true,
                                    errorCode: 6300,
                                    errorMessage: CHAT_ERRORS[6300]
                                });
                            }
                        }
                        else {
                            callback({
                                hasError: true,
                                errorCode: result.errorCode,
                                errorMessage: result.errorMessage
                            });
                        }
                    });

                    return {
                        uniqueId: uploadUniqueId,
                        threadId: uploadThreadId,
                        participant: userInfo,
                        content: {
                            caption: params.content,
                            file: {
                                uniqueId: uploadUniqueId,
                                fileName: fileName,
                                fileSize: fileSize,
                                fileObject: params.file
                            }
                        }
                    };
                }
                else {
                    callback({
                        hasError: true,
                        errorCode: 6301,
                        errorMessage: CHAT_ERRORS[6301]
                    });
                }
            },

            /**
             * Fire Event
             *
             * Fires given Event with given parameters
             *
             * @access private
             *
             * @param {string}  eventName       name of event to be fired
             * @param {object}  param           params to be sent to the event function
             *
             * @return {undefined}
             */
            fireEvent = function (eventName, param) {
                if (eventName == "chatReady") {
                    if (typeof navigator == "undefined") {
                        console.log("\x1b[90m    ☰ \x1b[0m\x1b[90m%s\x1b[0m", "Chat is Ready 😉");
                    } else {
                        console.log("%c   Chat is Ready 😉", 'border-left: solid #666 10px; color: #666;');
                    }
                }
                for (var id in eventCallbacks[eventName]) {
                    eventCallbacks[eventName][id](param);
                }
            },

            /**
             * Delete Cache Database
             *
             * This function truncates all tables of cache Database
             * and drops whole tables
             *
             * @access private
             *
             * @return {undefined}
             */
            deleteCacheDatabases = function () {
                if (db) {
                    db.close();
                }

                if (queueDb) {
                    queueDb.close();
                }

                var chatCacheDB = new Dexie('podChat');
                if (chatCacheDB) {
                    chatCacheDB.delete()
                        .then(function () {
                            console.log('PodChat Database successfully deleted!');

                            var queueDb = new Dexie('podQueues');
                            if (queueDb) {
                                queueDb.delete()
                                    .then(function () {
                                        console.log('PodQueues Database successfully deleted!');
                                        startCacheDatabases();
                                    })
                                    .catch(function (err) {
                                        console.log(err);
                                    });
                            }
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                }
            },

            /**
             * Clear Cache Database of Some User
             *
             * This function removes everything in cache
             * for one specific user
             *
             * @access private
             *
             * @return {undefined}
             */
            clearCacheDatabasesOfUser = function (callback) {
                if (db && !cacheDeletingInProgress) {
                    cacheDeletingInProgress = true;
                    db.threads
                        .where('owner')
                        .equals(parseInt(userInfo.id))
                        .delete()
                        .then(function () {
                            console.log('Threads table deleted');

                            db.contacts
                                .where('owner')
                                .equals(parseInt(userInfo.id))
                                .delete()
                                .then(function () {
                                    console.log('Contacts table deleted');

                                    db.messages
                                        .where('owner')
                                        .equals(parseInt(userInfo.id))
                                        .delete()
                                        .then(function () {
                                            console.log('Messages table deleted');

                                            db.participants
                                                .where('owner')
                                                .equals(parseInt(userInfo.id))
                                                .delete()
                                                .then(function () {
                                                    console.log('Participants table deleted');

                                                    db.messageGaps
                                                        .where('owner')
                                                        .equals(parseInt(userInfo.id))
                                                        .delete()
                                                        .then(function () {
                                                            console.log('MessageGaps table deleted');
                                                            cacheDeletingInProgress = false;
                                                            callback && callback();
                                                        });
                                                });
                                        });
                                });
                        })
                        .catch(function (error) {
                            fireEvent('error', {
                                code: error.code,
                                message: error.message,
                                error: error
                            });
                        });
                }
            },

            /**
             * Initialize Cache Database
             *
             * if client's environment is capable of supporting indexedDB
             * and the hasCache attribute set to be true, we created
             * a indexedDB instance based on DexieDb and Initialize
             * client sde caching
             *
             * @return {undefined}
             */
            startCacheDatabases = function (callback) {
                if (hasCache) {
                    queueDb = new Dexie('podQueues');

                    queueDb.version(1)
                        .stores({
                            waitQ: '[owner+threadId+uniqueId], owner, threadId, uniqueId, message'
                        });

                    if (enableCache) {
                        db = new Dexie('podChat');

                        db.version(1)
                            .stores({
                                users: '&id, name, cellphoneNumber, keyId',
                                contacts: '[owner+id], id, owner, uniqueId, userId, cellphoneNumber, email, firstName, lastName, expireTime',
                                threads: '[owner+id] ,id, owner, title, time, [owner+time]',
                                participants: '[owner+id], id, owner, threadId, notSeenDuration, admin, name, contactName, email, expireTime',
                                messages: '[owner+id], id, owner, threadId, time, [threadId+id], [threadId+owner+time]',
                                messageGaps: '[owner+id], [owner+waitsFor], id, waitsFor, owner, threadId, time, [threadId+owner+time]',
                                contentCount: 'threadId, contentCount'
                            });

                        db.open()
                            .catch(function (e) {
                                console.log('Open failed: ' + e.stack);
                            });

                        db.on('ready', function () {
                            isCacheReady = true;
                            callback && callback();
                        }, true);

                        db.on('versionchange', function (event) {
                            window.location.reload();
                        });
                    } else {
                        callback && callback();
                    }
                }
                else {
                    console.log(CHAT_ERRORS[6600]);
                }
            },

            /**
             * Get Chat Send Queue
             *
             * This function returns chat send queue
             *
             * @access private
             *
             * @return {array}  An array of messages on sendQueue
             */
            getChatSendQueue = function (threadId, callback) {
                if (threadId) {
                    var tempSendQueue = [];

                    for (var i = 0; i < chatSendQueue.length; i++) {
                        if (chatSendQueue[i].threadId == threadId) {
                            tempSendQueue.push(chatSendQueue[i]);
                        }
                    }
                    callback && callback(tempSendQueue);
                }
                else {
                    callback && callback(chatSendQueue);
                }
            },

            /**
             * Get Chat Wait Queue
             *
             * This function checks if cache is enbled on client's
             * machine, and if it is, retrieves WaitQueue from
             * cache. Otherwise returns WaitQueue from RAM
             * After getting failed messages from cache or RAM
             * we should check them with server to be sure if
             * they have been sent already or not?
             *
             * @access private
             *
             * @return {array}  An array of messages on sendQueue
             */
            getChatWaitQueue = function (threadId, active, callback) {
                if (active && threadId > 0) {
                    if (hasCache && typeof queueDb == 'object') {
                        queueDb.waitQ.where('threadId')
                            .equals(threadId)
                            .and(function (item) {
                                return item.owner == parseInt(userInfo.id);
                            })
                            .toArray()
                            .then(function (waitQueueOnCache) {
                                var uniqueIds = [];

                                for (var i = 0; i < waitQueueOnCache.length; i++) {
                                    uniqueIds.push(waitQueueOnCache[i].uniqueId);
                                }

                                if (uniqueIds.length && chatState) {
                                    sendMessage({
                                        chatMessageVOType: chatMessageVOTypes.GET_HISTORY,
                                        content: {
                                            uniqueIds: uniqueIds
                                        },
                                        subjectId: threadId
                                    }, {
                                        onResult: function (result) {
                                            if (!result.hasError) {
                                                var messageContent = result.result;

                                                /**
                                                 * Delete those messages from wait
                                                 * queue which are already on the
                                                 * server databases
                                                 */
                                                for (var i = 0; i < messageContent.length; i++) {
                                                    for (var j = 0; j < uniqueIds.length; j++) {
                                                        if (uniqueIds[j] == messageContent[i].uniqueId) {
                                                            deleteFromChatWaitQueue(messageContent[i], function () {
                                                            });
                                                            uniqueIds.splice(j, 1);
                                                            waitQueueOnCache.splice(j, 1);
                                                        }
                                                    }
                                                }

                                                /**
                                                 * Delete those messages from wait
                                                 * queue which are in the send
                                                 * queue and are going to be sent
                                                 */
                                                for (var i = 0; i < chatSendQueue.length; i++) {
                                                    for (var j = 0; j < uniqueIds.length; j++) {
                                                        if (uniqueIds[j] == chatSendQueue[i].message.uniqueId) {
                                                            deleteFromChatWaitQueue(chatSendQueue[i].message, function () {
                                                            });
                                                            uniqueIds.splice(j, 1);
                                                            waitQueueOnCache.splice(j, 1);
                                                        }
                                                    }
                                                }

                                                callback && callback(waitQueueOnCache);
                                            }
                                        }
                                    });
                                }
                                else {
                                    callback && callback(waitQueueOnCache);
                                }
                            })
                            .catch(function (error) {
                                fireEvent('error', {
                                    code: error.code,
                                    message: error.message,
                                    error: error
                                });
                            });
                    }
                    else {
                        var uniqueIds = [];

                        for (var i = 0; i < chatWaitQueue.length; i++) {
                            uniqueIds.push(chatWaitQueue[i].uniqueId);
                        }

                        if (uniqueIds.length) {
                            sendMessage({
                                chatMessageVOType: chatMessageVOTypes.GET_HISTORY,
                                content: {
                                    uniqueIds: uniqueIds
                                },
                                subjectId: threadId
                            }, {
                                onResult: function (result) {
                                    if (!result.hasError) {
                                        var messageContent = result.result;

                                        for (var i = 0; i < messageContent.length; i++) {
                                            for (var j = 0; j < uniqueIds.length; j++) {
                                                if (uniqueIds[j] == messageContent[i].uniqueId) {
                                                    uniqueIds.splice(j, 1);
                                                    chatWaitQueue.splice(j, 1);
                                                }
                                            }
                                        }
                                        callback && callback(chatWaitQueue);
                                    }
                                }
                            });
                        }
                        else {
                            callback && callback([]);
                        }
                    }
                }
                else {
                    callback && callback([]);
                }
            },

            /**
             * Get Chat Upload Queue
             *
             * This function checks if cache is enabled on client's
             * machine, and if it is, retrieves uploadQueue from
             * cache. Otherwise returns uploadQueue from RAM
             *
             * @access private
             *
             * @return {array}  An array of messages on uploadQueue
             */
            getChatUploadQueue = function (threadId, callback) {
                var uploadQ = [];
                for (var i = 0; i < chatUploadQueue.length; i++) {
                    if (parseInt(chatUploadQueue[i].message.subjectId) == threadId) {
                        uploadQ.push(chatUploadQueue[i]);
                    }
                }

                callback && callback(uploadQ);
            },

            /**
             * Delete an Item from Chat Send Queue
             *
             * This function gets an item and deletes it
             * from Chat Send Queue
             *
             * @access private
             *
             * @return {undefined}
             */
            deleteFromChatSentQueue = function (item, callback) {
                for (var i = 0; i < chatSendQueue.length; i++) {
                    if (chatSendQueue[i].message.uniqueId == item.message.uniqueId) {
                        chatSendQueue.splice(i, 1);
                    }
                }
                callback && callback();
            },

            /**
             * Delete an Item from Chat Wait Queue
             *
             * This function gets an item and deletes it
             * from Chat Wait Queue, from either cached
             * queue or the queue on RAM memory
             *
             * @access private
             *
             * @return {undefined}
             */
            deleteFromChatWaitQueue = function (item, callback) {
                if (hasCache && typeof queueDb == 'object') {
                    queueDb.waitQ.where('uniqueId')
                        .equals(item.uniqueId)
                        .and(function (item) {
                            return item.owner == parseInt(userInfo.id);
                        })
                        .delete()
                        .then(function () {
                            callback && callback();
                        })
                        .catch(function (error) {
                            fireEvent('error', {
                                code: error.code,
                                message: error.message,
                                error: error
                            });
                        });
                }
                else {
                    for (var i = 0; i < chatWaitQueue.length; i++) {
                        if (chatWaitQueue[i].uniqueId == item.uniqueId) {
                            chatWaitQueue.splice(i, 1);
                        }
                    }
                    callback && callback();
                }
            },

            /**
             * Delete an Item from Chat Upload Queue
             *
             * This function gets an item and deletes it
             * from Chat Upload Queue
             *
             * @access private
             *
             * @return {undefined}
             */
            deleteFromChatUploadQueue = function (item, callback) {
                for (var i = 0; i < chatUploadQueue.length; i++) {
                    if (chatUploadQueue[i].message.uniqueId == item.message.uniqueId) {
                        chatUploadQueue.splice(i, 1);
                    }
                }
                callback && callback();
            },

            /**
             * Push Message Into Send Queue
             *
             * This functions takes a message and puts it
             * into chat's send queue
             *
             * @access private
             *
             * @param {object}    params    The Message and its callbacks to be enqueued
             *
             * @return {undefined}
             */
            putInChatSendQueue = function (params, callback) {
                chatSendQueue.push(params);

                putInChatWaitQueue(params.message, function () {
                    callback && callback();
                });
            },

            /**
             * Put an Item inside Chat Wait Queue
             *
             * This function takes an item and puts it
             * inside Chat Wait Queue, either on cached
             * wait queue or the wait queue on RAM memory
             *
             * @access private
             *
             * @return {undefined}
             */
            putInChatWaitQueue = function (item, callback) {
                if (item.uniqueId != '') {
                    var waitQueueUniqueId = (typeof item.uniqueId == 'string') ? item.uniqueId : (Array.isArray(item.uniqueId)) ? item.uniqueId[0] : null;

                    if (waitQueueUniqueId != null) {
                        if (hasCache && typeof queueDb == 'object') {
                            queueDb.waitQ
                                .put({
                                    threadId: parseInt(item.subjectId),
                                    uniqueId: waitQueueUniqueId,
                                    owner: parseInt(userInfo.id),
                                    message: Utility.crypt(item, cacheSecret)
                                })
                                .then(function () {
                                    callback && callback();
                                })
                                .catch(function (error) {
                                    fireEvent('error', {
                                        code: error.code,
                                        message: error.message,
                                        error: error
                                    });
                                });
                        }
                        else {
                            item.uniqueId = waitQueueUniqueId;
                            chatWaitQueue.push(item);
                            callback && callback();
                        }
                    }
                }
            },

            /**
             * Put an Item inside Chat Upload Queue
             *
             * This function takes an item and puts it
             * inside Chat upload Queue
             *
             * @access private
             *
             * @return {undefined}
             */
            putInChatUploadQueue = function (params, callback) {
                chatUploadQueue.push(params);
                callback && callback();
            },

            /**
             * Transfer an Item from uploadQueue to sendQueue
             *
             * This function takes an uniqueId, finds that item
             * inside uploadQ. takes it's uploaded metadata and
             * attaches them to the message. Finally removes item
             * from uploadQueue and pushes it inside sendQueue
             *
             * @access private
             *
             * @return {undefined}
             */
            transferFromUploadQToSendQ = function (threadId, uniqueId, metadata, callback) {
                getChatUploadQueue(threadId, function (uploadQueue) {
                    for (var i = 0; i < uploadQueue.length; i++) {
                        if (uploadQueue[i].message.uniqueId == uniqueId) {
                            try {
                                var message = uploadQueue[i].message,
                                    callbacks = uploadQueue[i].callbacks;

                                message.metadata = metadata;
                            }
                            catch (e) {
                                console.log(e);
                            }

                            deleteFromChatUploadQueue(uploadQueue[i],
                                function () {
                                    putInChatSendQueue({
                                        message: message,
                                        callbacks: callbacks
                                    }, function () {
                                        callback && callback();
                                    });
                                });

                            break;
                        }
                    }
                });
            },

            /**
             * Decrypt Encrypted strings using secret key and salt
             *
             * @param string    String to get decrypted
             * @param secret    Cache Secret
             * @param salt      Salt used while string was getting encrypted
             *
             * @return  string  Decrypted string
             */
            chatDecrypt = function (string, secret, salt) {
                var decryptedString = Utility.decrypt(string, secret, salt);
                if (!decryptedString.hasError) {
                    return decryptedString.result;
                }
                else {
                    /**
                     * If there is a problem with decrypting cache
                     * Some body is trying to decrypt cache with wrong key
                     * or cacheSecret has been expired, so we should truncate
                     * cache databases to avoid attacks.
                     *
                     * But before deleting cache database we should make
                     * sure that cacheSecret has been retrieved from server
                     * and is ready. If so, and cache is still not decryptable,
                     * there is definitely something wrong with the key; so we are
                     * good to go and delete cache databases.
                     */
                    if (secret != 'undefined' && secret != '') {
                        if (db) {
                            db.threads
                                .where('owner')
                                .equals(parseInt(userInfo.id))
                                .count()
                                .then(function (threadsCount) {
                                    if (threadsCount > 0) {
                                        clearCacheDatabasesOfUser(function () {
                                            console.log('All cache databases have been cleared.');
                                        });
                                    }
                                })
                                .catch(function (e) {
                                    console.log(e);
                                });
                        }
                    }

                    return '{}';
                }
            };

        /******************************************************
         *             P U B L I C   M E T H O D S            *
         ******************************************************/

        this.on = function (eventName, callback) {
            if (eventCallbacks[eventName]) {
                var id = Utility.generateUUID();
                eventCallbacks[eventName][id] = callback;
                return id;
            }
        };

        this.getPeerId = function () {
            return peerId;
        };

        this.getCurrentUser = function () {
            return userInfo;
        };

        this.getUserInfo = getUserInfo;

        this.getThreads = getThreads;

        this.getAllThreadList = getAllThreadList;

        this.getHistory = getHistory;

        /**
         * Get Contacts
         *
         * Gets contacts list from chat server
         *
         * @access pubic
         *
         * @param {int}     count           Count of objects to get
         * @param {int}     offset          Offset of select Query
         * @param {string}  query           Search in contacts list to get (search LIKE firstName, lastName, email)
         *
         * @return {object} Instant Response
         */
        this.getContacts = function (params, callback) {
            var count = 50,
                offset = 0,
                content = {},
                whereClause = {},
                returnCache = false;

            if (params) {
                if (parseInt(params.count) > 0) {
                    count = parseInt(params.count);
                }

                if (parseInt(params.offset) > 0) {
                    offset = parseInt(params.offset);
                }

                if (typeof params.query === 'string') {
                    content.query = whereClause.query = params.query;
                }

                var functionLevelCache = (typeof params.cache == 'boolean') ? params.cache : true;
            }

            content.size = count;
            content.offset = offset;

            var sendMessageParams = {
                chatMessageVOType: chatMessageVOTypes.GET_CONTACTS,
                typeCode: params.typeCode,
                content: content
            };

            /**
             * Retrieve contacts from cache #cache
             */
            if (functionLevelCache && canUseCache && cacheSecret.length > 0) {
                if (db) {

                    /**
                     * First of all we delete all contacts those
                     * expireTime has been expired. after that
                     * we query our cache database to retrieve
                     * what we wanted
                     */
                    db.contacts.where('expireTime')
                        .below(new Date().getTime())
                        .delete()
                        .then(function () {

                            /**
                             * Query cache database to get contacts
                             */
                            var thenAble;

                            if (Object.keys(whereClause).length === 0) {
                                thenAble = db.contacts.where('owner')
                                    .equals(parseInt(userInfo.id));
                            }
                            else {
                                if (whereClause.hasOwnProperty('query')) {
                                    thenAble = db.contacts.where('owner')
                                        .equals(parseInt(userInfo.id))
                                        .filter(function (contact) {
                                            var reg = new RegExp(whereClause.query);
                                            return reg.test(chatDecrypt(contact.firstName, cacheSecret, contact.salt) + ' '
                                                + chatDecrypt(contact.lastName, cacheSecret, contact.salt) + ' '
                                                + chatDecrypt(contact.email, cacheSecret, contact.salt));
                                        });
                                }
                            }

                            thenAble.reverse()
                                .offset(offset)
                                .limit(count)
                                .toArray()
                                .then(function (contacts) {
                                    db.contacts.where('owner')
                                        .equals(parseInt(userInfo.id))
                                        .count()
                                        .then(function (contactsCount) {
                                            var cacheData = [];

                                            for (var i = 0; i < contacts.length; i++) {
                                                try {
                                                    var tempData = {},
                                                        salt = contacts[i].salt;

                                                    cacheData.push(formatDataToMakeContact(JSON.parse(chatDecrypt(contacts[i].data, cacheSecret, contacts[i].salt))));
                                                }
                                                catch (error) {
                                                    fireEvent('error', {
                                                        code: error.code,
                                                        message: error.message,
                                                        error: error
                                                    });
                                                }
                                            }

                                            var returnData = {
                                                hasError: false,
                                                cache: true,
                                                errorCode: 0,
                                                errorMessage: '',
                                                result: {
                                                    contacts: cacheData,
                                                    contentCount: contactsCount,
                                                    hasNext: !(contacts.length < count),//(offset + count < contactsCount && contacts.length > 0),
                                                    nextOffset: offset + contacts.length
                                                }
                                            };

                                            if (cacheData.length > 0) {
                                                callback && callback(returnData);
                                                callback = undefined;
                                                returnCache = true;
                                            }
                                        });
                                })
                                .catch(function (error) {
                                    fireEvent('error', {
                                        code: error.code,
                                        message: error.message,
                                        error: error
                                    });
                                });
                        })
                        .catch(function (error) {
                            fireEvent('error', {
                                code: error.code,
                                message: error.message,
                                error: error
                            });
                        });
                }
                else {
                    fireEvent('error', {
                        code: 6601,
                        message: CHAT_ERRORS[6601],
                        error: null
                    });
                }
            }

            /**
             * Retrieve Contacts from server
             */
            return sendMessage(sendMessageParams, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };

                    if (!returnData.hasError) {

                        var messageContent = result.result,
                            messageLength = messageContent.length,
                            resultData = {
                                contacts: [],
                                contentCount: result.contentCount,
                                hasNext: (offset + count <
                                    result.contentCount && messageLength > 0),
                                nextOffset: offset + messageLength
                            },
                            contactData;

                        for (var i = 0; i < messageLength; i++) {
                            contactData = formatDataToMakeContact(messageContent[i]);
                            if (contactData) {
                                resultData.contacts.push(contactData);
                            }
                        }

                        returnData.result = resultData;

                        /**
                         * Add Contacts into cache database #cache
                         */
                        if (canUseCache && cacheSecret.length > 0) {
                            if (db) {
                                var cacheData = [];

                                for (var i = 0; i < resultData.contacts.length; i++) {
                                    try {
                                        var tempData = {},
                                            salt = Utility.generateUUID();
                                        tempData.id = resultData.contacts[i].id;
                                        tempData.owner = userInfo.id;
                                        tempData.uniqueId = resultData.contacts[i].uniqueId;
                                        tempData.userId = Utility.crypt(resultData.contacts[i].userId, cacheSecret, salt);
                                        tempData.cellphoneNumber = Utility.crypt(resultData.contacts[i].cellphoneNumber, cacheSecret, salt);
                                        tempData.email = Utility.crypt(resultData.contacts[i].email, cacheSecret, salt);
                                        tempData.firstName = Utility.crypt(resultData.contacts[i].firstName, cacheSecret, salt);
                                        tempData.lastName = Utility.crypt(resultData.contacts[i].lastName, cacheSecret, salt);
                                        tempData.expireTime = new Date().getTime() + cacheExpireTime;
                                        tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(resultData.contacts[i])), cacheSecret, salt);
                                        tempData.salt = salt;

                                        cacheData.push(tempData);
                                    }
                                    catch (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    }
                                }

                                db.contacts.bulkPut(cacheData)
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }
                    }

                    callback && callback(returnData);
                    /**
                     * Delete callback so if server pushes response before
                     * cache, cache won't send data again
                     */
                    callback = undefined;

                    if (!returnData.hasError && returnCache) {
                        fireEvent('contactEvents', {
                            type: 'CONTACTS_LIST_CHANGE',
                            result: returnData.result
                        });
                    }
                }
            });
        };

        this.getThreadParticipants = getThreadParticipants;

        /**
         * Get Thread Admins
         *
         * Gets admins list of given thread
         *
         * @access pubic
         *
         * @param {int}     threadId        Id of thread which you want to get admins of
         *
         * @return {object} Instant Response
         */
        this.getThreadAdmins = function (params, callback) {
            getThreadParticipants({
                threadId: params.threadId,
                admin: true,
                cache: false
            }, callback);
        };

        this.addParticipants = function (params, callback) {

            /**
             * + AddParticipantsRequest   {object}
             *    - subjectId             {long}
             *    + content               {list} List of CONTACT IDs
             *       -id                  {long}
             *    - uniqueId              {string}
             */

            var sendMessageParams = {
                chatMessageVOType: chatMessageVOTypes.ADD_PARTICIPANT,
                typeCode: params.typeCode
            };

            if (params) {
                if (parseInt(params.threadId) > 0) {
                    sendMessageParams.subjectId = params.threadId;
                }

                if (Array.isArray(params.contacts)) {
                    sendMessageParams.content = params.contacts;
                }
            }

            return sendMessage(sendMessageParams, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };

                    if (!returnData.hasError) {
                        var messageContent = result.result,
                            resultData = {
                                thread: createThread(messageContent)
                            };

                        returnData.result = resultData;
                    }

                    callback && callback(returnData);
                }
            });
        };

        this.removeParticipants = function (params, callback) {

            /**
             * + RemoveParticipantsRequest    {object}
             *    - subjectId                 {long}
             *    + content                   {list} List of PARTICIPANT IDs from Thread's Participants object
             *       -id                      {long}
             *    - uniqueId                  {string}
             */

            var sendMessageParams = {
                chatMessageVOType: chatMessageVOTypes.REMOVE_PARTICIPANT,
                typeCode: params.typeCodes
            };

            if (params) {
                if (parseInt(params.threadId) > 0) {
                    sendMessageParams.subjectId = params.threadId;
                }

                if (Array.isArray(params.participants)) {
                    sendMessageParams.content = params.participants;
                }
            }

            return sendMessage(sendMessageParams, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };

                    if (!returnData.hasError) {
                        var messageContent = result.result,
                            resultData = {
                                thread: createThread(messageContent)
                            };

                        returnData.result = resultData;
                    }

                    callback && callback(returnData);
                }
            });
        };

        this.leaveThread = function (params, callback) {

            /**
             * + LeaveThreadRequest    {object}
             *    - subjectId          {long}
             *    - uniqueId           {string}
             */

            var sendMessageParams = {
                chatMessageVOType: chatMessageVOTypes.LEAVE_THREAD,
                typeCode: params.typeCode
            };

            if (params) {
                if (parseInt(params.threadId) > 0) {
                    sendMessageParams.subjectId = params.threadId;
                }
            }

            return sendMessage(sendMessageParams, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };

                    if (!returnData.hasError) {
                        var messageContent = result.result,
                            resultData = {
                                thread: createThread(messageContent)
                            };

                        returnData.result = resultData;
                    }

                    callback && callback(returnData);
                }
            });
        };

        this.createThread = function (params, callback) {

            /**
             * + CreateThreadRequest      {object}
             *    - ownerSsoId            {string}
             *    + invitees              {object}
             *       -id                  {string}
             *       -idType              {int} ** inviteeVOidTypes
             *    - title                 {string}
             *    - type                  {int} ** createThreadTypes
             *    - image                 {string}
             *    - description           {string}
             *    - metadata              {string}
             *    + message               {object}
             *       -text                {string}
             *       -type                {int}
             *       -repliedTo           {long}
             *       -uniqueId            {string}
             *       -metadata            {string}
             *       -systemMetadata      {string}
             *       -forwardedMessageIds {string}
             *       -forwardedUniqueIds  {string}
             */

            var content = {};

            if (params) {
                if (typeof params.title === 'string') {
                    content.title = params.title;
                }

                if (typeof params.type === 'string') {
                    var threadType = params.type;
                    content.type = createThreadTypes[threadType];
                }

                if (Array.isArray(params.invitees)) {
                    var tempInvitee;
                    content.invitees = [];
                    for (var i = 0; i < params.invitees.length; i++) {
                        var tempInvitee = formatDataToMakeInvitee(params.invitees[i]);
                        if (tempInvitee) {
                            content.invitees.push(tempInvitee);
                        }
                    }
                }

                if (typeof params.image === 'string') {
                    content.image = params.image;
                }

                if (typeof params.description === 'string') {
                    content.description = params.description;
                }

                if (typeof params.metadata === 'string') {
                    content.metadata = params.metadata;
                }
                else if (typeof params.metadata === 'object') {
                    try {
                        content.metadata = JSON.stringify(params.metadata);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }

                if (typeof params.message == 'object') {
                    content.message = {};

                    if (typeof params.message.text === 'string') {
                        content.message.text = params.message.text;
                    }

                    if (typeof params.message.uniqueId === 'string') {
                        content.message.uniqueId = params.message.uniqueId;
                    }

                    if (typeof params.message.type > 0) {
                        content.message.type = params.message.type;
                    }

                    if (typeof params.message.repliedTo > 0) {
                        content.message.repliedTo = params.message.repliedTo;
                    }

                    if (typeof params.message.metadata === 'string') {
                        content.message.metadata = params.message.metadata;
                    }
                    else if (typeof params.message.metadata === 'object') {
                        content.message.metadata = JSON.stringify(params.message.metadata);
                    }

                    if (typeof params.message.systemMetadata === 'string') {
                        content.message.systemMetadata = params.message.systemMetadata;
                    }
                    else if (typeof params.message.systemMetadata === 'object') {
                        content.message.systemMetadata = JSON.stringify(params.message.systemMetadata);
                    }

                    if (Array.isArray(params.message.forwardedMessageIds)) {
                        content.message.forwardedMessageIds = params.message.forwardedMessageIds;
                        content.message.forwardedUniqueIds = [];
                        for (var i = 0; i < params.message.forwardedMessageIds.length; i++) {
                            content.message.forwardedUniqueIds.push(Utility.generateUUID());
                        }
                    }

                }
            }

            var sendMessageParams = {
                chatMessageVOType: chatMessageVOTypes.CREATE_THREAD,
                content: content
            };

            return sendMessage(sendMessageParams, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };

                    if (!returnData.hasError) {
                        var messageContent = result.result,
                            resultData = {
                                thread: createThread(messageContent)
                            };

                        returnData.result = resultData;
                    }

                    callback && callback(returnData);
                }
            });

        };

        this.sendTextMessage = function (params, callbacks) {
            var metadata = {},
                uniqueId;

            if (typeof params.uniqueId != 'undefined') {
                uniqueId = params.uniqueId;
            }
            else {
                uniqueId = Utility.generateUUID();
            }

            putInChatSendQueue({
                message: {
                    chatMessageVOType: chatMessageVOTypes.MESSAGE,
                    typeCode: params.typeCode,
                    messageType: params.messageType,
                    subjectId: params.threadId,
                    repliedTo: params.repliedTo,
                    content: params.content,
                    uniqueId: uniqueId,
                    systemMetadata: JSON.stringify(params.systemMetadata),
                    metadata: JSON.stringify(metadata),
                    pushMsgType: 5
                },
                callbacks: callbacks
            }, function () {
                chatSendQueueHandler();
            });

            return {
                uniqueId: uniqueId,
                threadId: params.threadId,
                participant: userInfo,
                content: params.content
            };
        };

        this.sendBotMessage = function (params, callbacks) {
            var metadata = {};

            return sendMessage({
                chatMessageVOType: chatMessageVOTypes.BOT_MESSAGE,
                typeCode: params.typeCode,
                subjectId: params.messageId,
                repliedTo: params.repliedTo,
                content: params.content,
                uniqueId: params.uniqueId,
                receiver: params.receiver,
                systemMetadata: JSON.stringify(params.systemMetadata),
                metadata: JSON.stringify(metadata),
                pushMsgType: 4
            }, callbacks);
        };

        this.sendFileMessage = function (params, callbacks) {
            var metadata = {},
                fileUploadParams = {},
                fileUniqueId = Utility.generateUUID();

            if (params) {
                if (typeof params.file != 'undefined') {

                    var fileName,
                        fileType,
                        fileSize,
                        fileExtension;

                    fileName = params.file.name;
                    fileType = params.file.type;
                    fileSize = params.file.size;
                    fileExtension = params.file.name.split('.')
                        .pop();

                    fireEvent('fileUploadEvents', {
                        threadId: params.threadId,
                        uniqueId: fileUniqueId,
                        state: 'NOT_STARTED',
                        progress: 0,
                        fileInfo: {
                            fileName: fileName,
                            fileSize: fileSize
                        },
                        fileObject: params.file
                    });

                    /**
                     * File is a valid Image
                     * Should upload to image server
                     */
                    if (imageMimeTypes.indexOf(fileType) >= 0 || imageExtentions.indexOf(fileExtension) >= 0) {
                        fileUploadParams.image = params.file;

                        if (typeof params.xC == 'string') {
                            fileUploadParams.xC = params.xC;
                        }

                        if (typeof params.yC == 'string') {
                            fileUploadParams.yC = params.yC;
                        }

                        if (typeof params.hC == 'string') {
                            fileUploadParams.hC = params.hC;
                        }

                        if (typeof params.wC == 'string') {
                            fileUploadParams.wC = params.wC;
                        }
                    }
                    else {
                        fileUploadParams.file = params.file;
                    }

                    metadata['file'] = {};

                    metadata['file']['originalName'] = fileName;
                    metadata['file']['mimeType'] = fileType;
                    metadata['file']['size'] = fileSize;

                    fileUploadParams.threadId = params.threadId;
                    fileUploadParams.uniqueId = fileUniqueId;
                    fileUploadParams.fileObject = params.file;
                    fileUploadParams.originalFileName = fileName;

                    putInChatUploadQueue({
                        message: {
                            chatMessageVOType: chatMessageVOTypes.MESSAGE,
                            typeCode: params.typeCode,
                            messageType: params.messageType,
                            subjectId: params.threadId,
                            repliedTo: params.repliedTo,
                            content: params.content,
                            metadata: JSON.stringify(metadata),
                            systemMetadata: JSON.stringify(params.systemMetadata),
                            uniqueId: fileUniqueId,
                            pushMsgType: 4
                        },
                        callbacks: callbacks
                    }, function () {
                        if (imageMimeTypes.indexOf(fileType) >= 0 || imageExtentions.indexOf(fileExtension) >= 0) {
                            uploadImage(fileUploadParams, function (result) {
                                if (!result.hasError) {
                                    metadata['file']['actualHeight'] = result.result.actualHeight;
                                    metadata['file']['actualWidth'] = result.result.actualWidth;
                                    metadata['file']['height'] = result.result.height;
                                    metadata['file']['width'] = result.result.width;
                                    metadata['file']['name'] = result.result.name;
                                    metadata['file']['hashCode'] = result.result.hashCode;
                                    metadata['file']['id'] = result.result.id;
                                    metadata['file']['link'] = SERVICE_ADDRESSES.FILESERVER_ADDRESS +
                                        SERVICES_PATH.GET_IMAGE + '?imageId=' +
                                        result.result.id + '&hashCode=' +
                                        result.result.hashCode;

                                    transferFromUploadQToSendQ(parseInt(params.threadId), fileUniqueId, JSON.stringify(metadata), function () {
                                        chatSendQueueHandler();
                                    });
                                }
                                else {
                                    deleteFromChatUploadQueue({message: {uniqueId: fileUniqueId}});
                                }
                            });
                        }
                        else {
                            uploadFile(fileUploadParams, function (result) {
                                if (!result.hasError) {
                                    metadata['file']['name'] = result.result.name;
                                    metadata['file']['hashCode'] = result.result.hashCode;
                                    metadata['file']['id'] = result.result.id;
                                    metadata['file']['link'] = SERVICE_ADDRESSES.FILESERVER_ADDRESS +
                                        SERVICES_PATH.GET_FILE + '?fileId=' +
                                        result.result.id + '&hashCode=' +
                                        result.result.hashCode;

                                    transferFromUploadQToSendQ(parseInt(params.threadId), fileUniqueId, JSON.stringify(metadata), function () {
                                        chatSendQueueHandler();
                                    });
                                }
                                else {
                                    deleteFromChatUploadQueue({message: {uniqueId: fileUniqueId}});
                                }
                            });
                        }
                    });

                    return {
                        uniqueId: fileUniqueId,
                        threadId: params.threadId,
                        participant: userInfo,
                        content: {
                            caption: params.content,
                            file: {
                                uniqueId: fileUniqueId,
                                fileName: fileName,
                                fileSize: fileSize,
                                fileObject: params.file
                            }
                        }
                    };
                }
                else {
                    fireEvent('error', {
                        code: 6302,
                        message: CHAT_ERRORS[6302]
                    });
                }
            }

            return {
                uniqueId: fileUniqueId,
                threadId: params.threadId,
                participant: userInfo,
                content: params.content
            };
        };

        this.sendLocationMessage = function (params, callbacks) {
            var data = {},
                url = SERVICE_ADDRESSES.MAP_ADDRESS + SERVICES_PATH.STATIC_IMAGE,
                hasError = false;

            if (params) {
                if (typeof params.type === 'string') {
                    data.type = params.type;
                }
                else {
                    data.type = 'standard-night';
                }

                if (parseInt(params.zoom) > 0) {
                    data.zoom = params.zoom;
                }
                else {
                    data.zoom = 15;
                }

                if (parseInt(params.width) > 0) {
                    data.width = params.width;
                }
                else {
                    data.width = 800;
                }

                if (parseInt(params.height) > 0) {
                    data.height = params.height;
                }
                else {
                    data.height = 600;
                }

                if (typeof params.center === 'object') {
                    if (parseFloat(params.center.lat) > 0 && parseFloat(params.center.lng)) {
                        data.center = params.center.lat + ',' + parseFloat(params.center.lng);
                    }
                    else {
                        hasError = true;
                        fireEvent('error', {
                            code: 6700,
                            message: CHAT_ERRORS[6700],
                            error: undefined
                        });
                    }
                }
                else {
                    hasError = true;
                    fireEvent('error', {
                        code: 6700,
                        message: CHAT_ERRORS[6700],
                        error: undefined
                    });
                }

                data.key = mapApiKey;
            }

            var keys = Object.keys(data);

            if (keys.length > 0) {
                url += '?';

                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    url += key + '=' + data[key];
                    if (i < keys.length - 1) {
                        url += '&';
                    }
                }
            }

            if (!hasError) {

                var metadata = {},
                    fileUploadParams = {},
                    fileUniqueId = Utility.generateUUID();

                if (params) {
                    if (typeof url != 'undefined') {
                        metadata['file'] = {},
                            metadata['location'] = {};

                        fileUploadParams.threadId = params.threadId;
                        fileUploadParams.uniqueId = fileUniqueId;
                        fileUploadParams.fileUrl = url;

                        putInChatUploadQueue({
                            message: {
                                chatMessageVOType: chatMessageVOTypes.MESSAGE,
                                typeCode: params.typeCode,
                                messageType: params.messageType,
                                subjectId: params.threadId,
                                content: params.content,
                                metadata: JSON.stringify(metadata),
                                systemMetadata: JSON.stringify(params.systemMetadata),
                                uniqueId: fileUniqueId,
                                pushMsgType: 4
                            },
                            callbacks: callbacks
                        }, function () {
                            uploadFileFromUrl(fileUploadParams, function (result) {
                                if (!result.hasError) {
                                    metadata['location']['center'] = params.center;
                                    metadata['location']['zoom'] = params.zoom;
                                    metadata['file']['created'] = result.result.created;
                                    metadata['file']['size'] = result.result.size;
                                    metadata['file']['width'] = params.width;
                                    metadata['file']['height'] = params.height;
                                    metadata['file']['name'] = result.result.name;
                                    metadata['file']['hashCode'] = result.result.hashCode;
                                    metadata['file']['id'] = result.result.id;
                                    metadata['file']['link'] = SERVICE_ADDRESSES.POD_DRIVE_ADDRESS +
                                        SERVICES_PATH.DRIVE_DOWNLOAD_FILE + '?hash=' + result.result.hashCode;

                                    transferFromUploadQToSendQ(parseInt(params.threadId), fileUniqueId,
                                        JSON.stringify(metadata), function () {
                                            chatSendQueueHandler();
                                        });
                                }
                            });
                        });

                        return {
                            uniqueId: fileUniqueId,
                            threadId: params.threadId,
                            participant: userInfo,
                            content: {
                                caption: params.content,
                                file: {
                                    uniqueId: fileUniqueId,
                                    fileUrl: url
                                }
                            }
                        };
                    }
                    else {
                        fireEvent('error', {
                            code: 6302,
                            message: CHAT_ERRORS[6302]
                        });
                    }
                }
            }

            return {
                uniqueId: fileUniqueId,
                threadId: params.threadId,
                participant: userInfo,
                content: params.content
            };
        };

        this.resendMessage = function (uniqueId, callbacks) {
            if (hasCache && typeof queueDb == 'object') {
                queueDb.waitQ.where('uniqueId')
                    .equals(uniqueId)
                    .and(function (item) {
                        return item.owner == parseInt(userInfo.id);
                    })
                    .toArray()
                    .then(function (messages) {
                        if (messages.length) {
                            putInChatSendQueue({
                                message: Utility.jsonParser(chatDecrypt(messages[0].message, cacheSecret)),
                                callbacks: callbacks
                            }, function () {
                                chatSendQueueHandler();
                            });
                        }
                    })
                    .catch(function (error) {
                        fireEvent('error', {
                            code: error.code,
                            message: error.message,
                            error: error
                        });
                    });
            }
            else {
                for (var i = 0; i < chatWaitQueue.length; i++) {
                    if (chatWaitQueue[i].message.uniqueId == uniqueId) {
                        putInChatSendQueue({
                            message: chatWaitQueue[i].message,
                            callbacks: callbacks
                        }, function () {
                            chatSendQueueHandler();
                        });
                        break;
                    }
                }
            }
        };

        this.cancelMessage = function (uniqueId, callback) {
            deleteFromChatSentQueue({
                message: {
                    uniqueId: uniqueId
                }
            }, function () {
                deleteFromChatWaitQueue({
                    uniqueId: uniqueId
                }, callback);
            });
        };

        this.clearHistory = function (params, callback) {

            /**
             * + Clear History Request Object    {object}
             *    - subjectId                    {long}
             */

            var clearHistoryParams = {
                chatMessageVOType: chatMessageVOTypes.CLEAR_HISTORY,
                typeCode: params.typeCode
            };

            if (params) {
                if (parseInt(params.threadId) > 0) {
                    clearHistoryParams.subjectId = params.threadId;
                }
            }

            return sendMessage(clearHistoryParams, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };

                    if (!returnData.hasError) {
                        var resultData = {
                            thread: result.result
                        };

                        returnData.result = resultData;

                        /**
                         * Delete all messages of this thread from cache
                         */
                        if (canUseCache) {
                            if (db) {
                                db.messages.where('threadId')
                                    .equals(parseInt(result.result))
                                    .and(function (message) {
                                        return message.owner == userInfo.id;
                                    })
                                    .delete()
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }
                    }

                    callback && callback(returnData);
                }
            });
        };

        this.getImage = getImage;

        this.getFile = getFile;

        this.uploadFile = uploadFile;

        this.uploadImage = uploadImage;

        this.cancelFileUpload = function (params, callback) {
            if (params) {
                if (typeof params.uniqueId == 'string') {
                    var uniqueId = params.uniqueId;
                    httpRequestObject[eval('uniqueId')] && httpRequestObject[eval('uniqueId')].abort();
                    httpRequestObject[eval('uniqueId')] && delete(httpRequestObject[eval('uniqueId')]);

                    deleteFromChatUploadQueue({
                        message: {
                            uniqueId: uniqueId
                        }
                    }, callback);
                }
            }
            return;
        };

        this.editMessage = function (params, callback) {
            return sendMessage({
                chatMessageVOType: chatMessageVOTypes.EDIT_MESSAGE,
                typeCode: params.typeCode,
                messageType: params.messageType,
                subjectId: params.messageId,
                repliedTo: params.repliedTo,
                content: params.content,
                uniqueId: params.uniqueId,
                metadata: params.metadata,
                systemMetadata: params.systemMetadata,
                pushMsgType: 4
            }, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };

                    if (!returnData.hasError) {
                        var messageContent = result.result,
                            resultData = {
                                editedMessage: formatDataToMakeMessage(undefined, messageContent)
                            };

                        returnData.result = resultData;

                        /**
                         * Update Message on cache
                         */
                        if (canUseCache && cacheSecret.length > 0) {
                            if (db) {
                                try {
                                    var tempData = {},
                                        salt = Utility.generateUUID();
                                    tempData.id = parseInt(resultData.editedMessage.id);
                                    tempData.owner = parseInt(userInfo.id);
                                    tempData.threadId = parseInt(resultData.editedMessage.threadId);
                                    tempData.time = resultData.editedMessage.time;
                                    tempData.message = Utility.crypt(resultData.editedMessage.message, cacheSecret, salt);
                                    tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(resultData.editedMessage)), cacheSecret, salt);
                                    tempData.salt = salt;

                                    /**
                                     * Insert Message into cache database
                                     */
                                    db.messages.put(tempData)
                                        .catch(function (error) {
                                            fireEvent('error', {
                                                code: error.code,
                                                message: error.message,
                                                error: error
                                            });
                                        });
                                }
                                catch (error) {
                                    fireEvent('error', {
                                        code: error.code,
                                        message: error.message,
                                        error: error
                                    });
                                }
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }
                    }

                    callback && callback(returnData);
                }
            });
        };

        this.deleteMessage = function (params, callback) {
            return sendMessage({
                chatMessageVOType: chatMessageVOTypes.DELETE_MESSAGE,
                typeCode: params.typeCode,
                subjectId: params.messageId,
                uniqueId: params.uniqueId,
                content: JSON.stringify({
                    'deleteForAll': params.deleteForAll
                }),
                pushMsgType: 4
            }, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };

                    if (!returnData.hasError) {
                        var messageContent = result.result,
                            resultData = {
                                deletedMessage: {
                                    id: result.result
                                }
                            };

                        returnData.result = resultData;

                        /**
                         * Remove Message from cache
                         */
                        if (canUseCache) {
                            if (db) {
                                db.messages.where('id')
                                    .equals(parseInt(result.result))
                                    .delete()
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: 6602,
                                            message: CHAT_ERRORS[6602],
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }

                    }

                    callback && callback(returnData);
                }
            });
        };

        this.deleteMultipleMessages = function (params, callback) {
            var messageIdsList = params.messageIds,
                uniqueIdsList = [];

            for (i in messageIdsList) {
                var messageId = messageIdsList[i];

                var uniqueId = Utility.generateUUID();
                uniqueIdsList.push(uniqueId);

                messagesCallbacks[uniqueId] = function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };

                    if (!returnData.hasError) {
                        var messageContent = result.result,
                            resultData = {
                                deletedMessage: {
                                    id: result.result
                                }
                            };

                        returnData.result = resultData;

                        /**
                         * Remove Message from cache
                         */
                        if (canUseCache) {
                            if (db) {
                                db.messages.where('id')
                                    .equals(parseInt(result.result))
                                    .delete()
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: 6602,
                                            message: CHAT_ERRORS[6602],
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }

                    }

                    callback && callback(returnData);
                };
            }

            return sendMessage({
                chatMessageVOType: chatMessageVOTypes.DELETE_MESSAGE,
                typeCode: params.typeCode,
                content: {
                    uniqueIds: uniqueIdsList,
                    ids: messageIdsList,
                    deleteForAll: params.deleteForAll
                },
                pushMsgType: 4
            });
        };

        this.replyMessage = function (params, callbacks) {
            var uniqueId;

            if (typeof params.uniqueId != 'undefined') {
                uniqueId = params.uniqueId;
            }
            else {
                uniqueId = Utility.generateUUID();
            }

            putInChatSendQueue({
                message: {
                    chatMessageVOType: chatMessageVOTypes.MESSAGE,
                    typeCode: params.typeCode,
                    messageType: params.messageType,
                    subjectId: params.threadId,
                    repliedTo: params.repliedTo,
                    content: params.content,
                    uniqueId: uniqueId,
                    systemMetadata: JSON.stringify(params.systemMetadata),
                    pushMsgType: 5
                },
                callbacks: callbacks
            }, function () {
                chatSendQueueHandler();
            });

            return {
                uniqueId: uniqueId,
                threadId: params.threadId,
                participant: userInfo,
                content: params.content
            };
        };

        this.replyFileMessage = function (params, callbacks) {
            var metadata = {},
                fileUploadParams = {},
                fileUniqueId = Utility.generateUUID();

            if (params) {
                if (typeof params.file != 'undefined') {

                    var fileName,
                        fileType,
                        fileSize,
                        fileExtension;

                    fileName = params.file.name;
                    fileType = params.file.type;
                    fileSize = params.file.size;
                    fileExtension = params.file.name.split('.')
                        .pop();

                    fireEvent('fileUploadEvents', {
                        threadId: params.threadId,
                        uniqueId: fileUniqueId,
                        state: 'NOT_STARTED',
                        progress: 0,
                        fileInfo: {
                            fileName: fileName,
                            fileSize: fileSize
                        },
                        fileObject: params.file
                    });

                    /**
                     * File is a valid Image
                     * Should upload to image server
                     */
                    if (imageMimeTypes.indexOf(fileType) >= 0 || imageExtentions.indexOf(fileExtension) >= 0) {
                        fileUploadParams.image = params.file;

                        if (typeof params.xC == 'string') {
                            fileUploadParams.xC = params.xC;
                        }

                        if (typeof params.yC == 'string') {
                            fileUploadParams.yC = params.yC;
                        }

                        if (typeof params.hC == 'string') {
                            fileUploadParams.hC = params.hC;
                        }

                        if (typeof params.wC == 'string') {
                            fileUploadParams.wC = params.wC;
                        }
                    }
                    else {
                        fileUploadParams.file = params.file;
                    }

                    metadata['file'] = {};

                    metadata['file']['originalName'] = fileName;
                    metadata['file']['mimeType'] = fileType;
                    metadata['file']['size'] = fileSize;

                    if (typeof params.fileName == 'string') {
                        fileUploadParams.fileName = params.fileName.split('.')[0] + '.' + fileExtension;
                    }
                    else {
                        fileUploadParams.fileName = fileUniqueId + '.' + fileExtension;
                    }

                    fileUploadParams.threadId = params.threadId;
                    fileUploadParams.uniqueId = fileUniqueId;
                    fileUploadParams.fileObject = params.file;
                    fileUploadParams.originalFileName = fileName;

                    putInChatUploadQueue({
                        message: {
                            chatMessageVOType: chatMessageVOTypes.MESSAGE,
                            typeCode: params.typeCode,
                            messageType: params.messageType,
                            subjectId: params.threadId,
                            repliedTo: params.repliedTo,
                            content: params.content,
                            subjectId: params.threadId,
                            repliedTo: params.repliedTo,
                            content: params.content,
                            metadata: JSON.stringify(metadata),
                            systemMetadata: JSON.stringify(params.systemMetadata),
                            uniqueId: fileUniqueId,
                            pushMsgType: 4
                        },
                        callbacks: callbacks
                    }, function () {
                        if (imageMimeTypes.indexOf(fileType) >= 0 || imageExtentions.indexOf(fileExtension) >= 0) {
                            uploadImage(fileUploadParams, function (result) {
                                if (!result.hasError) {
                                    metadata['file']['actualHeight'] = result.result.actualHeight;
                                    metadata['file']['actualWidth'] = result.result.actualWidth;
                                    metadata['file']['height'] = result.result.height;
                                    metadata['file']['width'] = result.result.width;
                                    metadata['file']['name'] = result.result.name;
                                    metadata['file']['hashCode'] = result.result.hashCode;
                                    metadata['file']['id'] = result.result.id;
                                    metadata['file']['link'] = SERVICE_ADDRESSES.FILESERVER_ADDRESS +
                                        SERVICES_PATH.GET_IMAGE + '?imageId=' +
                                        result.result.id + '&hashCode=' +
                                        result.result.hashCode;

                                    transferFromUploadQToSendQ(
                                        parseInt(params.threadId), fileUniqueId,
                                        JSON.stringify(metadata), function () {
                                            chatSendQueueHandler();
                                        });
                                }
                            });
                        }
                        else {
                            uploadFile(fileUploadParams, function (result) {
                                if (!result.hasError) {
                                    metadata['file']['name'] = result.result.name;
                                    metadata['file']['hashCode'] = result.result.hashCode;
                                    metadata['file']['id'] = result.result.id;
                                    metadata['file']['link'] = SERVICE_ADDRESSES.FILESERVER_ADDRESS +
                                        SERVICES_PATH.GET_FILE + '?fileId=' +
                                        result.result.id + '&hashCode=' +
                                        result.result.hashCode;

                                    transferFromUploadQToSendQ(
                                        parseInt(params.threadId), fileUniqueId,
                                        JSON.stringify(metadata), function () {
                                            chatSendQueueHandler();
                                        });
                                }
                            });
                        }
                    });

                    return {
                        uniqueId: fileUniqueId,
                        threadId: params.threadId,
                        participant: userInfo,
                        content: {
                            caption: params.content,
                            file: {
                                uniqueId: fileUniqueId,
                                fileName: fileName,
                                fileSize: fileSize,
                                fileObject: params.file
                            }
                        }
                    };
                }
                else {
                    fireEvent('error', {
                        code: 6302,
                        message: CHAT_ERRORS[6302]
                    });
                }
            }
        };

        this.forwardMessage = function (params, callbacks) {
            var threadId = params.subjectId,
                messageIdsList = JSON.parse(params.content),
                uniqueIdsList = [];

            for (i in messageIdsList) {
                var messageId = messageIdsList[i];

                if (!threadCallbacks[threadId]) {
                    threadCallbacks[threadId] = {};
                }

                var uniqueId = Utility.generateUUID();
                uniqueIdsList.push(uniqueId);

                threadCallbacks[threadId][uniqueId] = {};

                sendMessageCallbacks[uniqueId] = {};

                if (callbacks.onSent) {
                    sendMessageCallbacks[uniqueId].onSent = callbacks.onSent;
                    threadCallbacks[threadId][uniqueId].onSent = false;
                    threadCallbacks[threadId][uniqueId].uniqueId = uniqueId;
                }

                if (callbacks.onSeen) {
                    sendMessageCallbacks[uniqueId].onSeen = callbacks.onSeen;
                    threadCallbacks[threadId][uniqueId].onSeen = false;
                }

                if (callbacks.onDeliver) {
                    sendMessageCallbacks[uniqueId].onDeliver = callbacks.onDeliver;
                    threadCallbacks[threadId][uniqueId].onDeliver = false;
                }
            }

            putInChatSendQueue({
                message: {
                    chatMessageVOType: chatMessageVOTypes.FORWARD_MESSAGE,
                    typeCode: params.typeCode,
                    subjectId: params.subjectId,
                    repliedTo: params.repliedTo,
                    content: params.content,
                    uniqueId: uniqueIdsList,
                    metadata: JSON.stringify(params.metadata),
                    pushMsgType: 5
                },
                callbacks: callbacks
            }, function () {
                chatSendQueueHandler();
            });
        };

        this.deliver = deliver(params);

        this.seen = function (params) {
            if (userInfo && params.ownerId !== userInfo.id) {
                return sendMessage({
                    chatMessageVOType: chatMessageVOTypes.SEEN,
                    typeCode: params.typeCode,
                    content: params.messageId,
                    pushMsgType: 3
                });
            }
        };

        this.startTyping = function (params) {
            var uniqueId = Utility.generateUUID();

            if (parseInt(params.threadId) > 0) {
                var threadId = params.threadId;
            }
            isTypingInterval && clearInterval(isTypingInterval);

            isTypingInterval = setInterval(function () {
                sendSystemMessage({
                    content: JSON.stringify({
                        type: systemMessageTypes.IS_TYPING
                    }),
                    subjectId: threadId,
                    uniqueId: uniqueId
                });
            }, systemMessageIntervalPitch);
        };

        this.stopTyping = function () {
            isTypingInterval && clearInterval(isTypingInterval);
        };

        this.getMessageDeliveredList = function (params, callback) {

            var deliveryListData = {
                chatMessageVOType: chatMessageVOTypes.GET_MESSAGE_DELEVERY_PARTICIPANTS,
                typeCode: params.typeCode,
                content: {},
                pushMsgType: 4,
                token: token,
                timeout: params.timeout
            };

            if (params) {
                if (parseInt(params.messageId) > 0) {
                    deliveryListData.content.messageId = params.messageId;
                }
            }

            return sendMessage(deliveryListData, {
                onResult: function (result) {
                    if (typeof result.result == 'object') {
                        for (var i = 0; i < result.result.length; i++) {
                            result.result[i] = formatDataToMakeUser(result.result[i]);
                        }
                    }
                    callback && callback(result);
                }
            });
        };

        this.getMessageSeenList = function (params, callback) {
            var seenListData = {
                chatMessageVOType: chatMessageVOTypes.GET_MESSAGE_SEEN_PARTICIPANTS,
                typeCode: params.typeCode,
                content: {},
                pushMsgType: 4,
                token: token,
                timeout: params.timeout
            };

            if (params) {
                if (parseInt(params.messageId) > 0) {
                    seenListData.content.messageId = params.messageId;
                }
            }

            return sendMessage(seenListData, {
                onResult: function (result) {
                    if (typeof result.result == 'object') {
                        for (var i = 0; i < result.result.length; i++) {
                            result.result[i] = formatDataToMakeUser(result.result[i]);
                        }
                    }
                    callback && callback(result);
                }
            });
        };

        this.updateThreadInfo = updateThreadInfo;

        this.muteThread = function (params, callback) {
            return sendMessage({
                chatMessageVOType: chatMessageVOTypes.MUTE_THREAD,
                typeCode: params.typeCode,
                subjectId: params.subjectId,
                content: {},
                pushMsgType: 4,
                token: token,
                timeout: params.timeout
            }, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.unMuteThread = function (params, callback) {
            return sendMessage({
                chatMessageVOType: chatMessageVOTypes.UNMUTE_THREAD,
                typeCode: params.typeCode,
                subjectId: params.subjectId,
                content: {},
                pushMsgType: 4,
                token: token,
                timeout: params.timeout
            }, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.spamPvThread = function (params, callback) {
            var spamData = {
                chatMessageVOType: chatMessageVOTypes.SPAM_PV_THREAD,
                typeCode: params.typeCode,
                pushMsgType: 4,
                token: token,
                timeout: params.timeout
            };

            if (params) {
                if (parseInt(params.threadId) > 0) {
                    spamData.subjectId = params.threadId;
                }
            }

            return sendMessage(spamData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.block = function (params, callback) {

            var blockData = {
                chatMessageVOType: chatMessageVOTypes.BLOCK,
                typeCode: params.typeCode,
                content: {},
                pushMsgType: 4,
                token: token,
                timeout: params.timeout
            };

            if (params) {
                if (parseInt(params.contactId) > 0) {
                    blockData.content.contactId = params.contactId;
                }

                if (parseInt(params.threadId) > 0) {
                    blockData.content.threadId = params.threadId;
                }

                if (parseInt(params.userId) > 0) {
                    blockData.content.userId = params.userId;
                }
            }

            return sendMessage(blockData, {
                onResult: function (result) {
                    if (typeof result.result == 'object') {
                        result.result = formatDataToMakeBlockedUser(result.result);
                    }
                    callback && callback(result);
                }
            });
        };

        this.unblock = function (params, callback) {
            var unblockData = {
                chatMessageVOType: chatMessageVOTypes.UNBLOCK,
                typeCode: params.typeCode,
                pushMsgType: 4,
                token: token,
                content: {},
                timeout: params.timeout
            };

            if (params) {
                if (parseInt(params.blockId) > 0) {
                    unblockData.subjectId = params.blockId;
                }

                if (parseInt(params.contactId) > 0) {
                    unblockData.content.contactId = params.contactId;
                }

                if (parseInt(params.threadId) > 0) {
                    unblockData.content.threadId = params.threadId;
                }

                if (parseInt(params.userId) > 0) {
                    unblockData.content.userId = params.userId;
                }
            }

            return sendMessage(unblockData, {
                onResult: function (result) {
                    if (typeof result.result == 'object') {
                        result.result = formatDataToMakeBlockedUser(result.result);
                    }

                    callback && callback(result);
                }
            });
        };

        this.getBlocked = function (params, callback) {
            var count = 50,
                offset = 0,
                content = {};

            if (params) {
                if (parseInt(params.count) > 0) {
                    count = params.count;
                }

                if (parseInt(params.offset) > 0) {
                    offset = params.offset;
                }
            }

            content.count = count;
            content.offset = offset;

            var getBlockedData = {
                chatMessageVOType: chatMessageVOTypes.GET_BLOCKED,
                typeCode: params.typeCode,
                content: content,
                pushMsgType: 4,
                token: token,
                timeout: params.timeout
            };

            return sendMessage(getBlockedData, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };

                    if (!returnData.hasError) {
                        var messageContent = result.result,
                            messageLength = messageContent.length,
                            resultData = {
                                blockedUsers: [],
                                contentCount: result.contentCount,
                                hasNext: (offset + count < result.contentCount && messageLength > 0),
                                nextOffset: offset + messageLength
                            },
                            blockedUser;

                        for (var i = 0; i < messageLength; i++) {
                            blockedUser = formatDataToMakeBlockedUser(messageContent[i]);
                            if (blockedUser) {
                                resultData.blockedUsers.push(blockedUser);
                            }
                        }

                        returnData.result = resultData;
                    }

                    callback && callback(returnData);
                }
            });
        };

        this.getNotSeenDuration = function (params, callback) {
            var content = {};

            if (params) {
                if (Array.isArray(params.userIds)) {
                    content.userIds = params.userIds;
                }
            }

            var getNotSeenDurationData = {
                chatMessageVOType: chatMessageVOTypes.GET_NOT_SEEN_DURATION,
                typeCode: params.typeCode,
                content: content,
                pushMsgType: 4,
                token: token,
                timeout: params.timeout
            };

            return sendMessage(getNotSeenDurationData, {
                onResult: function (result) {
                    var returnData = {
                        hasError: result.hasError,
                        cache: false,
                        errorMessage: result.errorMessage,
                        errorCode: result.errorCode
                    };

                    if (!returnData.hasError) {
                        returnData.result = result.result;
                    }

                    callback && callback(returnData);
                }
            });
        };

        this.addContacts = function (params, callback) {
            var data = {};

            if (params) {
                if (typeof params.firstName === 'string') {
                    data.firstName = params.firstName;
                }
                else {
                    data.firstName = '';
                }

                if (typeof params.typeCode === 'string') {
                    data.typeCode = params.typeCode;
                }
                else if (generalTypeCode) {
                    data.typeCode = generalTypeCode;
                }

                if (typeof params.lastName === 'string') {
                    data.lastName = params.lastName;
                }
                else {
                    data.lastName = '';
                }

                if (typeof params.cellphoneNumber === 'string') {
                    data.cellphoneNumber = params.cellphoneNumber;
                }
                else {
                    data.cellphoneNumber = '';
                }

                if (typeof params.email === 'string') {
                    data.email = params.email;
                }
                else {
                    data.email = '';
                }

                data.uniqueId = Utility.generateUUID();
            }

            var requestParams = {
                url: SERVICE_ADDRESSES.PLATFORM_ADDRESS + SERVICES_PATH.ADD_CONTACTS,
                method: 'POST',
                data: data,
                headers: {
                    '_token_': token,
                    '_token_issuer_': 1
                }
            };

            httpRequest(requestParams, function (result) {
                if (!result.hasError) {
                    var responseData = JSON.parse(result.result.responseText);

                    var returnData = {
                        hasError: responseData.hasError,
                        cache: false,
                        errorMessage: responseData.message,
                        errorCode: responseData.errorCode
                    };

                    if (!responseData.hasError) {
                        var messageContent = responseData.result,
                            messageLength = responseData.result.length,
                            resultData = {
                                contacts: [],
                                contentCount: messageLength
                            },
                            contactData;

                        for (var i = 0; i < messageLength; i++) {
                            contactData = formatDataToMakeContact(messageContent[i]);
                            if (contactData) {
                                resultData.contacts.push(contactData);
                            }
                        }

                        returnData.result = resultData;

                        /**
                         * Add Contacts into cache database #cache
                         */
                        if (canUseCache && cacheSecret.length > 0) {
                            if (db) {
                                var cacheData = [];

                                for (var i = 0; i < resultData.contacts.length; i++) {
                                    try {
                                        var tempData = {},
                                            salt = Utility.generateUUID();
                                        tempData.id = resultData.contacts[i].id;
                                        tempData.owner = userInfo.id;
                                        tempData.uniqueId = resultData.contacts[i].uniqueId;
                                        tempData.userId = Utility.crypt(resultData.contacts[i].userId, cacheSecret, salt);
                                        tempData.cellphoneNumber = Utility.crypt(resultData.contacts[i].cellphoneNumber, cacheSecret, salt);
                                        tempData.email = Utility.crypt(resultData.contacts[i].email, cacheSecret, salt);
                                        tempData.firstName = Utility.crypt(resultData.contacts[i].firstName, cacheSecret, salt);
                                        tempData.lastName = Utility.crypt(resultData.contacts[i].lastName, cacheSecret, salt);
                                        tempData.expireTime = new Date().getTime() + cacheExpireTime;
                                        tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(resultData.contacts[i])), cacheSecret, salt);
                                        tempData.salt = salt;

                                        cacheData.push(tempData);
                                    }
                                    catch (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    }
                                }

                                db.contacts.bulkPut(cacheData)
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }

                    }

                    callback && callback(returnData);

                }
                else {
                    fireEvent('error', {
                        code: result.errorCode,
                        message: result.errorMessage,
                        error: result
                    });
                }
            });
        };

        this.updateContacts = function (params, callback) {
            var data = {};

            if (params) {
                if (parseInt(params.id) > 0) {
                    data.id = parseInt(params.id);
                }
                else {
                    fireEvent('error', {
                        code: 999,
                        message: 'ID is required for Updating Contact!',
                        error: undefined
                    });
                }

                if (typeof params.firstName === 'string') {
                    data.firstName = params.firstName;
                }
                else {
                    fireEvent('error', {
                        code: 999,
                        message: 'firstName is required for Updating Contact!'
                    });
                }

                if (typeof params.lastName === 'string') {
                    data.lastName = params.lastName;
                }
                else {
                    fireEvent('error', {
                        code: 999,
                        message: 'lastName is required for Updating Contact!'
                    });
                }

                if (typeof params.cellphoneNumber === 'string') {
                    data.cellphoneNumber = params.cellphoneNumber;
                }
                else {
                    fireEvent('error', {
                        code: 999,
                        message: 'cellphoneNumber is required for Updating Contact!'
                    });
                }

                if (typeof params.email === 'string') {
                    data.email = params.email;
                }
                else {
                    fireEvent('error', {
                        code: 999,
                        message: 'email is required for Updating Contact!'
                    });
                }

                data.uniqueId = Utility.generateUUID();
            }

            var requestParams = {
                url: SERVICE_ADDRESSES.PLATFORM_ADDRESS +
                    SERVICES_PATH.UPDATE_CONTACTS,
                method: 'GET',
                data: data,
                headers: {
                    '_token_': token,
                    '_token_issuer_': 1
                }
            };

            httpRequest(requestParams, function (result) {
                if (!result.hasError) {
                    var responseData = JSON.parse(result.result.responseText);

                    var returnData = {
                        hasError: responseData.hasError,
                        cache: false,
                        errorMessage: responseData.message,
                        errorCode: responseData.errorCode
                    };

                    if (!responseData.hasError) {
                        var messageContent = responseData.result,
                            messageLength = responseData.result.length,
                            resultData = {
                                contacts: [],
                                contentCount: messageLength
                            },
                            contactData;

                        for (var i = 0; i < messageLength; i++) {
                            contactData = formatDataToMakeContact(messageContent[i]);
                            if (contactData) {
                                resultData.contacts.push(contactData);
                            }
                        }

                        returnData.result = resultData;

                        /**
                         * Add Contacts into cache database #cache
                         */
                        if (canUseCache && cacheSecret.length > 0) {
                            if (db) {
                                var cacheData = [];

                                for (var i = 0; i < resultData.contacts.length; i++) {
                                    try {
                                        var tempData = {},
                                            salt = Utility.generateUUID();
                                        tempData.id = resultData.contacts[i].id;
                                        tempData.owner = userInfo.id;
                                        tempData.uniqueId = resultData.contacts[i].uniqueId;
                                        tempData.userId = Utility.crypt(resultData.contacts[i].userId, cacheSecret, salt);
                                        tempData.cellphoneNumber = Utility.crypt(resultData.contacts[i].cellphoneNumber, cacheSecret, salt);
                                        tempData.email = Utility.crypt(resultData.contacts[i].email, cacheSecret, salt);
                                        tempData.firstName = Utility.crypt(resultData.contacts[i].firstName, cacheSecret, salt);
                                        tempData.lastName = Utility.crypt(resultData.contacts[i].lastName, cacheSecret, salt);
                                        tempData.expireTime = new Date().getTime() + cacheExpireTime;
                                        tempData.data = Utility.crypt(JSON.stringify(unsetNotSeenDuration(resultData.contacts[i])), cacheSecret, salt);
                                        tempData.salt = salt;

                                        cacheData.push(tempData);
                                    }
                                    catch (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    }
                                }

                                db.contacts.bulkPut(cacheData)
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }

                    }

                    callback && callback(returnData);

                }
                else {
                    fireEvent('error', {
                        code: result.errorCode,
                        message: result.errorMessage,
                        error: result
                    });
                }
            });
        };

        this.removeContacts = function (params, callback) {
            var data = {};

            if (params) {
                if (parseInt(params.id) > 0) {
                    data.id = parseInt(params.id);
                }
                else {
                    fireEvent('error', {
                        code: 999,
                        message: 'ID is required for Deleting Contact!',
                        error: undefined
                    });
                }
            }

            var requestParams = {
                url: SERVICE_ADDRESSES.PLATFORM_ADDRESS + SERVICES_PATH.REMOVE_CONTACTS,
                method: 'POST',
                data: data,
                headers: {
                    '_token_': token,
                    '_token_issuer_': 1
                }
            };

            httpRequest(requestParams, function (result) {
                if (!result.hasError) {
                    var responseData = JSON.parse(result.result.responseText);

                    var returnData = {
                        hasError: responseData.hasError,
                        cache: false,
                        errorMessage: responseData.message,
                        errorCode: responseData.errorCode
                    };

                    if (!responseData.hasError) {
                        returnData.result = responseData.result;
                    }

                    /**
                     * Remove the contact from cache
                     */
                    if (canUseCache) {
                        if (db) {
                            db.contacts.where('id')
                                .equals(parseInt(params.id))
                                .delete()
                                .catch(function (error) {
                                    fireEvent('error', {
                                        code: 6602,
                                        message: CHAT_ERRORS[6602],
                                        error: error
                                    });
                                });
                        }
                        else {
                            fireEvent('error', {
                                code: 6601,
                                message: CHAT_ERRORS[6601],
                                error: null
                            });
                        }
                    }

                    callback && callback(returnData);

                }
                else {
                    fireEvent('error', {
                        code: result.errorCode,
                        message: result.errorMessage,
                        error: result
                    });
                }
            });
        };

        this.searchContacts = function (params, callback) {
            var data = {
                    size: 50,
                    offset: 0
                },
                whereClause = {},
                returnCache = false;

            if (params) {
                if (typeof params.firstName === 'string') {
                    data.firstName = whereClause.firstName = params.firstName;
                }

                if (typeof params.lastName === 'string') {
                    data.lastName = whereClause.lastName = params.lastName;
                }

                if (parseInt(params.cellphoneNumber) > 0) {
                    data.cellphoneNumber = whereClause.cellphoneNumber = params.cellphoneNumber;
                }

                if (typeof params.email === 'string') {
                    data.email = whereClause.email = params.email;
                }

                if (typeof params.q === 'string') {
                    data.q = whereClause.q = params.q;
                }

                if (typeof params.uniqueId === 'string') {
                    data.uniqueId = whereClause.uniqueId = params.uniqueId;
                }

                if (parseInt(params.id) > 0) {
                    data.id = whereClause.id = params.id;
                }

                if (parseInt(params.typeCode) > 0) {
                    data.typeCode = whereClause.typeCode = params.typeCode;
                }

                if (parseInt(params.size) > 0) {
                    data.size = params.size;
                }

                if (parseInt(params.offset) > 0) {
                    data.offset = params.offset;
                }

                var functionLevelCache = (typeof params.cache == 'boolean') ? params.cache : true;
            }

            var requestParams = {
                url: SERVICE_ADDRESSES.PLATFORM_ADDRESS + SERVICES_PATH.SEARCH_CONTACTS,
                method: 'POST',
                data: data,
                headers: {
                    '_token_': token,
                    '_token_issuer_': 1
                }
            };

            /**
             * Search contacts in cache #cache
             */
            if (functionLevelCache && canUseCache && cacheSecret.length > 0) {
                if (db) {

                    /**
                     * First of all we delete all contacts those
                     * expireTime has been expired. after that
                     * we query our cache database to retrieve
                     * what we wanted
                     */
                    db.contacts.where('expireTime')
                        .below(new Date().getTime())
                        .delete()
                        .then(function () {

                            /**
                             * Query cache database to get contacts
                             */

                            var thenAble;

                            if (Object.keys(whereClause).length === 0) {
                                thenAble = db.contacts.where('owner')
                                    .equals(parseInt(userInfo.id));
                            }
                            else {
                                if (whereClause.hasOwnProperty('id')) {
                                    thenAble = db.contacts.where('owner')
                                        .equals(parseInt(userInfo.id))
                                        .and(function (contact) {
                                            return contact.id == whereClause.id;
                                        });
                                }
                                else if (whereClause.hasOwnProperty('uniqueId')) {
                                    thenAble = db.contacts.where('owner')
                                        .equals(parseInt(userInfo.id))
                                        .and(function (contact) {
                                            return contact.uniqueId == whereClause.uniqueId;
                                        });
                                }
                                else {
                                    if (whereClause.hasOwnProperty('firstName')) {
                                        thenAble = db.contacts.where('owner')
                                            .equals(parseInt(userInfo.id))
                                            .filter(function (contact) {
                                                var reg = new RegExp(whereClause.firstName);
                                                return reg.test(chatDecrypt(contact.firstName, cacheSecret, contact.salt));
                                            });
                                    }

                                    if (whereClause.hasOwnProperty('lastName')) {
                                        thenAble = db.contacts.where('owner')
                                            .equals(parseInt(userInfo.id))
                                            .filter(function (contact) {
                                                var reg = new RegExp(whereClause.lastName);
                                                return reg.test(chatDecrypt(contact.lastName, cacheSecret, contact.salt));
                                            });
                                    }

                                    if (whereClause.hasOwnProperty('email')) {
                                        thenAble = db.contacts.where('owner')
                                            .equals(parseInt(userInfo.id))
                                            .filter(function (contact) {
                                                var reg = new RegExp(whereClause.email);
                                                return reg.test(chatDecrypt(contact.email, cacheSecret, contact.salt));
                                            });
                                    }

                                    if (whereClause.hasOwnProperty('q')) {
                                        thenAble = db.contacts.where('owner')
                                            .equals(parseInt(userInfo.id))
                                            .filter(function (contact) {
                                                var reg = new RegExp(whereClause.q);
                                                return reg.test(chatDecrypt(contact.firstName, cacheSecret, contact.salt) + ' ' +
                                                    chatDecrypt(contact.lastName, cacheSecret, contact.salt) + ' ' +
                                                    chatDecrypt(contact.email, cacheSecret, contact.salt));
                                            });
                                    }
                                }
                            }

                            thenAble.offset(data.offset)
                                .limit(data.size)
                                .toArray()
                                .then(function (contacts) {
                                    db.contacts.where('owner')
                                        .equals(parseInt(userInfo.id))
                                        .count()
                                        .then(function (contactsCount) {
                                            var cacheData = [];

                                            for (var i = 0; i < contacts.length; i++) {
                                                try {
                                                    var tempData = {},
                                                        salt = contacts[i].salt;

                                                    cacheData.push(formatDataToMakeContact(JSON.parse(chatDecrypt(contacts[i].data, cacheSecret, ontacts[i].salt))));
                                                }
                                                catch (error) {
                                                    fireEvent('error', {
                                                        code: error.code,
                                                        message: error.message,
                                                        error: error
                                                    });
                                                }
                                            }

                                            var returnData = {
                                                hasError: false,
                                                cache: true,
                                                errorCode: 0,
                                                errorMessage: '',
                                                result: {
                                                    contacts: cacheData,
                                                    contentCount: contactsCount,
                                                    hasNext: !(contacts.length < data.size),//(data.offset + data.size < contactsCount && contacts.length > 0),
                                                    nextOffset: data.offset + contacts.length
                                                }
                                            };

                                            if (cacheData.length > 0) {
                                                callback && callback(returnData);
                                                callback = undefined;
                                                returnCache = true;
                                            }
                                        })
                                        .catch(function (error) {
                                            fireEvent('error', {
                                                code: error.code,
                                                message: error.message,
                                                error: error
                                            });
                                        });
                                })
                                .catch(function (error) {
                                    fireEvent('error', {
                                        code: error.code,
                                        message: error.message,
                                        error: error
                                    });
                                });
                        })
                        .catch(function (error) {
                            fireEvent('error', {
                                code: error.code,
                                message: error.message,
                                error: error
                            });
                        });
                }
                else {
                    fireEvent('error', {
                        code: 6601,
                        message: CHAT_ERRORS[6601],
                        error: null
                    });
                }
            }

            /**
             * Get Search Contacts Result From Server
             */
            httpRequest(requestParams, function (result) {
                if (!result.hasError) {
                    var responseData = JSON.parse(result.result.responseText);

                    var returnData = {
                        hasError: responseData.hasError,
                        cache: false,
                        errorMessage: responseData.message,
                        errorCode: responseData.errorCode
                    };

                    if (!responseData.hasError) {
                        var messageContent = responseData.result,
                            messageLength = responseData.result.length,
                            resultData = {
                                contacts: [],
                                contentCount: messageLength
                            },
                            contactData;

                        for (var i = 0; i < messageLength; i++) {
                            contactData = formatDataToMakeContact(messageContent[i]);
                            if (contactData) {
                                resultData.contacts.push(contactData);
                            }
                        }

                        returnData.result = resultData;

                        /**
                         * Add Contacts into cache database #cache
                         */
                        if (canUseCache && cacheSecret.length > 0) {
                            if (db) {
                                var cacheData = [];

                                for (var i = 0; i < resultData.contacts.length; i++) {
                                    try {
                                        var tempData = {},
                                            salt = Utility.generateUUID();

                                        tempData.id = resultData.contacts[i].id;
                                        tempData.owner = userInfo.id;
                                        tempData.uniqueId = resultData.contacts[i].uniqueId;
                                        tempData.userId = Utility.crypt(resultData.contacts[i].userId, cacheSecret, salt);
                                        tempData.cellphoneNumber = Utility.crypt(resultData.contacts[i].cellphoneNumber, cacheSecret, salt);
                                        tempData.email = Utility.crypt(resultData.contacts[i].email, cacheSecret, salt);
                                        tempData.firstName = Utility.crypt(resultData.contacts[i].firstName, cacheSecret, salt);
                                        tempData.lastName = Utility.crypt(resultData.contacts[i].lastName, cacheSecret, salt);
                                        tempData.expireTime = new Date().getTime() + cacheExpireTime;
                                        tempData.data = crypt(JSON.stringify(unsetNotSeenDuration(resultData.contacts[i])), cacheSecret, salt);
                                        tempData.salt = salt;

                                        cacheData.push(tempData);
                                    }
                                    catch (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    }
                                }

                                db.contacts.bulkPut(cacheData)
                                    .catch(function (error) {
                                        fireEvent('error', {
                                            code: error.code,
                                            message: error.message,
                                            error: error
                                        });
                                    });
                            }
                            else {
                                fireEvent('error', {
                                    code: 6601,
                                    message: CHAT_ERRORS[6601],
                                    error: null
                                });
                            }
                        }
                    }

                    callback && callback(returnData);
                    /**
                     * Delete callback so if server pushes response before
                     * cache, cache won't send data again
                     */
                    callback = undefined;

                    if (!returnData.hasError && returnCache) {
                        fireEvent('contactEvents', {
                            type: 'CONTACTS_SEARCH_RESULT_CHANGE',
                            result: returnData.result
                        });
                    }
                }
                else {
                    fireEvent('error', {
                        code: result.errorCode,
                        message: result.errorMessage,
                        error: result
                    });
                }
            });
        };

        this.mapReverse = function (params, callback) {
            var data = {};

            if (params) {
                if (parseFloat(params.lat) > 0) {
                    data.lat = params.lat;
                }

                if (parseFloat(params.lng) > 0) {
                    data.lng = params.lng;
                }

                data.uniqueId = Utility.generateUUID();
            }

            var requestParams = {
                url: SERVICE_ADDRESSES.MAP_ADDRESS + SERVICES_PATH.REVERSE,
                method: 'GET',
                data: data,
                headers: {
                    'Api-Key': mapApiKey
                }
            };

            httpRequest(requestParams, function (result) {
                if (!result.hasError) {
                    var responseData = JSON.parse(result.result.responseText);

                    var returnData = {
                        hasError: result.hasError,
                        cache: result.cache,
                        errorMessage: result.message,
                        errorCode: result.errorCode,
                        result: responseData
                    };

                    callback && callback(returnData);

                }
                else {
                    fireEvent('error', {
                        code: result.errorCode,
                        message: result.errorMessage,
                        error: result
                    });
                }
            });
        };

        this.mapSearch = function (params, callback) {
            var data = {};

            if (params) {
                if (typeof params.term === 'string') {
                    data.term = params.term;
                }

                if (parseFloat(params.lat) > 0) {
                    data.lat = params.lat;
                }

                if (parseFloat(params.lng) > 0) {
                    data.lng = params.lng;
                }

                data.uniqueId = Utility.generateUUID();
            }

            var requestParams = {
                url: SERVICE_ADDRESSES.MAP_ADDRESS + SERVICES_PATH.SEARCH,
                method: 'GET',
                data: data,
                headers: {
                    'Api-Key': mapApiKey
                }
            };

            httpRequest(requestParams, function (result) {
                if (!result.hasError) {
                    var responseData = JSON.parse(result.result.responseText);

                    var returnData = {
                        hasError: result.hasError,
                        cache: result.cache,
                        errorMessage: result.message,
                        errorCode: result.errorCode,
                        result: responseData
                    };

                    callback && callback(returnData);

                }
                else {
                    fireEvent('error', {
                        code: result.errorCode,
                        message: result.errorMessage,
                        error: result
                    });
                }
            });
        };

        this.mapRouting = function (params, callback) {
            var data = {};

            if (params) {
                if (typeof params.alternative === 'boolean') {
                    data.alternative = params.alternative;
                }
                else {
                    data.alternative = true;
                }

                if (typeof params.origin === 'object') {
                    if (parseFloat(params.origin.lat) > 0 && parseFloat(params.origin.lng)) {
                        data.origin = params.origin.lat + ',' + parseFloat(params.origin.lng);
                    }
                    else {
                        // Throw Error
                    }
                }

                if (typeof params.destination === 'object') {
                    if (parseFloat(params.destination.lat) > 0 && parseFloat(params.destination.lng)) {
                        data.destination = params.destination.lat + ',' + parseFloat(params.destination.lng);
                    }
                    else {
                        // Throw Error
                    }
                }

                data.uniqueId = Utility.generateUUID();
            }

            var requestParams = {
                url: SERVICE_ADDRESSES.MAP_ADDRESS + SERVICES_PATH.ROUTING,
                method: 'GET',
                data: data,
                headers: {
                    'Api-Key': mapApiKey
                }
            };

            httpRequest(requestParams, function (result) {
                if (!result.hasError) {
                    var responseData = JSON.parse(result.result.responseText);

                    var returnData = {
                        hasError: result.hasError,
                        cache: result.cache,
                        errorMessage: result.message,
                        errorCode: result.errorCode,
                        result: responseData
                    };

                    callback && callback(returnData);

                }
                else {
                    fireEvent('error', {
                        code: result.errorCode,
                        message: result.errorMessage,
                        error: result
                    });
                }
            });
        };

        this.mapStaticImage = function (params, callback) {
            var data = {},
                url = SERVICE_ADDRESSES.MAP_ADDRESS + SERVICES_PATH.STATIC_IMAGE,
                hasError = false;

            if (params) {
                if (typeof params.type === 'string') {
                    data.type = params.type;
                }
                else {
                    data.type = 'standard-night';
                }

                if (parseInt(params.zoom) > 0) {
                    data.zoom = params.zoom;
                }
                else {
                    data.zoom = 15;
                }

                if (parseInt(params.width) > 0) {
                    data.width = params.width;
                }
                else {
                    data.width = 800;
                }

                if (parseInt(params.height) > 0) {
                    data.height = params.height;
                }
                else {
                    data.height = 600;
                }

                if (typeof params.center === 'object') {
                    if (parseFloat(params.center.lat) > 0 && parseFloat(params.center.lng)) {
                        data.center = params.center.lat + ',' + parseFloat(params.center.lng);
                    }
                    else {
                        hasError = true;
                        fireEvent('error', {
                            code: 6700,
                            message: CHAT_ERRORS[6700],
                            error: undefined
                        });
                    }
                }
                else {
                    hasError = true;
                    fireEvent('error', {
                        code: 6700,
                        message: CHAT_ERRORS[6700],
                        error: undefined
                    });
                }

                data.key = mapApiKey;
            }

            var keys = Object.keys(data);

            if (keys.length > 0) {
                url += '?';

                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    url += key + '=' + data[key];
                    if (i < keys.length - 1) {
                        url += '&';
                    }
                }
            }

            var returnData = {
                hasError: hasError,
                cache: false,
                errorMessage: (hasError) ? CHAT_ERRORS[6700] : '',
                errorCode: (hasError) ? 6700 : undefined,
                result: {
                    link: (!hasError) ? url : ''
                }
            };

            callback && callback(returnData);
        };

        this.setAdmin = function (params, callback) {
            var setAdminData = {
                chatMessageVOType: chatMessageVOTypes.SET_ROLE_TO_USER,
                typeCode: params.typeCode,
                content: [],
                pushMsgType: 4,
                token: token,
                timeout: params.timeout
            };

            if (params) {
                if (parseInt(params.threadId) > 0) {
                    setAdminData.subjectId = params.threadId;
                }

                if (params.admins && Array.isArray(params.admins)) {
                    for (var i = 0; i < params.admins.length; i++) {
                        var temp = {};
                        if (parseInt(params.admins[i].userId) > 0) {
                            temp.userId = params.admins[i].userId;
                        }

                        if (params.admins[i].roleOperation == 'add' || params.admins[i].roleOperation == 'remove') {
                            temp.roleOperation = params.admins[i].roleOperation;
                        }
                        else {
                            temp.roleOperation = 'add';
                        }

                        temp.checkThreadMembership = true;

                        if (Array.isArray(params.admins[i].roles)) {
                            temp.roles = params.admins[i].roles;
                        }

                        setAdminData.content.push(temp);
                    }

                    setAdminData.content = JSON.stringify(setAdminData.content);
                }
            }

            return sendMessage(setAdminData, {
                onResult: function (result) {
                    callback && callback(result);
                }
            });
        };

        this.generateUUID = Utility.generateUUID;

        this.logout = function () {
            clearChatServerCaches();
            asyncClient.logout();
        };

        this.clearChatServerCaches = clearChatServerCaches;

        this.deleteCacheDatabases = deleteCacheDatabases;

        this.clearCacheDatabasesOfUser = clearCacheDatabasesOfUser;

        this.getChatState = function () {
            return chatFullStateObject;
        };

        this.reconnect = function () {
            asyncClient.reconnectSocket();
        };

        this.setToken = function (newToken) {
            if (typeof newToken != 'undefined') {
                token = newToken;
            }
        };

        init();
    }

    if (typeof module !== 'undefined' && typeof module.exports != 'undefined') {
        module.exports = Chat;
    }
    else {
        if (!window.POD) {
            window.POD = {};
        }
        window.POD.Chat = Chat;
    }
})();

},{"./utility/utility.js":47,"dexie":41,"podasync-ws-only":43,"querystring":4}],47:[function(require,module,exports){
(function (global){
(function() {

    /**
     * Global Variables
     */
    var CryptoJS;

    function ChatUtility() {

        if (typeof(require) !== 'undefined' && typeof(exports) !== 'undefined') {
            CryptoJS = require('crypto-js');
        }
        else {
            CryptoJS = window.CryptoJS;
        }

        /**
         * Checks if Client is using NodeJS or not
         * @return  {boolean}
         */
        this.isNode = function() {
            return (typeof global !== 'undefined' && ({}).toString.call(global) === '[object global]');
        };

        /**
         * Generate UUID
         *
         * Generates Random String
         *
         * @access public
         *
         * @param {int}     sectionCount    Sections of created unique code
         *
         * @return {string}
         */
        this.generateUUID = function(sectionCount) {
            var d = new Date().getTime();
            var textData = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

            if (sectionCount == 1) {
                textData = 'xxxxxxxx';
            }

            if (sectionCount == 2) {
                textData = 'xxxxxxxx-xxxx';
            }

            if (sectionCount == 3) {
                textData = 'xxxxxxxx-xxxx-4xxx';
            }

            if (sectionCount == 4) {
                textData = 'xxxxxxxx-xxxx-4xxx-yxxx';
            }

            var uuid = textData.replace(/[xy]/g, function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);

                return (
                    c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        };

        /**
         * Create Return data
         *
         * Returns data in ordered structure
         *
         * @param {boolean}     hasError
         * @param {string}      errorMessage
         * @param {string}      errorCode
         * @param {object}      result
         * @param {int}         contentCount
         *
         * @return  {object}
         */
        this.createReturnData = function(hasError, errorMessage, errorCode, result, contentCount) {
            var returnData = {
                hasError: hasError,
                errorMessage: typeof errorMessage == 'string'
                    ? errorMessage
                    : '',
                errorCode: typeof errorCode == 'number' ? errorCode : 0,
                result: result
            };

            if (typeof contentCount == 'number') {
                returnData.contentCount = contentCount;
            }

            return returnData;
        };

        /**
         * Chat Step Logger
         *
         * Prints Custom Message in console
         *
         * @param {string}    title      Title of message to be logged in
         *     terminal
         * @param {string}    message    Message to be logged in terminal
         *
         * @return {undefined}
         */
        this.chatStepLogger = function(title, message) {
            if (typeof navigator == 'undefined') {
                console.log('\x1b[90m    ☰ %s \x1b[0m \x1b[90m(%sms)\x1b[0m',
                    title, message);
            }
            else {
                console.log('%c   ' + title + ' (' + message + 'ms)',
                    'border-left: solid #666 10px; color: #666;');
            }
        };

        /**
         * MD5 (Message-Digest Algorithm)
         *
         * @param {string}  string    String to be digested
         *
         * @link  http://www.webtoolkit.info
         *
         * @return {string}  Digested hash string
         */
        this.MD5 = function(string) {
            function RotateLeft(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            }

            function AddUnsigned(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    }
                    else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                }
                else {
                    return (lResult ^ lX8 ^ lY8);
                }
            }

            function F(x, y, z) {
                return (x & y) | ((~x) & z);
            }

            function G(x, y, z) {
                return (x & z) | (y & (~z));
            }

            function H(x, y, z) {
                return (x ^ y ^ z);
            }

            function I(x, y, z) {
                return (y ^ (x | (~z)));
            }

            function FF(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function GG(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function HH(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function II(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function ConvertToWordArray(string) {
                var lWordCount;
                var lMessageLength = string.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 -
                    (lNumberOfWords_temp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] |
                    (string.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] |
                    (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };

            function WordToHex(lValue) {
                var WordToHexValue = '',
                    WordToHexValue_temp = '',
                    lByte, lCount;

                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    WordToHexValue_temp = '0' + lByte.toString(16);
                    WordToHexValue = WordToHexValue +
                        WordToHexValue_temp.substr(
                            WordToHexValue_temp.length - 2, 2);
                }

                return WordToHexValue;
            };

            function Utf8Encode(string) {
                string = string.replace(/\r\n/g, '\n');
                var utftext = '';
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);
                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }

                return utftext;
            };

            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22;

            var S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20;

            var S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23;

            var S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;

            string = Utf8Encode(string);
            x = ConvertToWordArray(string);
            a = 0x67452301;
            b = 0xEFCDAB89;
            c = 0x98BADCFE;
            d = 0x10325476;

            for (k = 0; k < x.length; k += 16) {
                AA = a;
                BB = b;
                CC = c;
                DD = d;

                a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = AddUnsigned(a, AA);
                b = AddUnsigned(b, BB);
                c = AddUnsigned(c, CC);
                d = AddUnsigned(d, DD);
            }

            var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) +
                WordToHex(d);

            return temp.toLowerCase();
        };

        /**
         * RC4 (Encryption/Decryption Algorithm)
         *
         * @param {string}  key     key fo encryption/decryption
         * @param {string}  str     String to be encrypted/decrypted
         *
         * @return {string}  Encrypted String
         */
        this.RC4 = function(key, str) {
            var s = [],
                j = 0,
                x, res = '';
            for (var i = 0; i < 256; i++) {
                s[i] = i;
            }
            for (i = 0; i < 256; i++) {
                j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
                x = s[i];
                s[i] = s[j];
                s[j] = x;
            }
            i = 0;
            j = 0;
            for (var y = 0; y < str.length; y++) {
                i = (i + 1) % 256;
                j = (j + s[i]) % 256;
                x = s[i];
                s[i] = s[j];
                s[j] = x;
                res += String.fromCharCode(
                    str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
            }
            return res;
        };

        /**
         * Dynamic Sort
         *
         * Dynamically sorts given Array in given order
         *
         * @param {object}    property    Given array to be sorted
         * @param {boolean}   reverse     Default order is ASC, if reverse is
         *     true, Array will be sorted in DESC
         *
         * @return {object}   Sorted Array
         */
        this.dynamicSort = function(property, reverse) {
            var sortOrder = 1;
            if (reverse) {
                sortOrder = -1;
            }
            return function(a, b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] >
                b[property]) ? 1 : 0;
                return result * sortOrder;
            };
        };

        /**
         * Crypt
         *
         * This function uses AES Algorithm to encrypt given string with
         * encryption key and in order to avoid generating same hash
         * for same given strings, it uses a random salt everytime
         *
         * @param {string}  str        Given string to be encrypted
         * @param {string}  key        Secret Encryption Key
         * @param {string}  salt       Encryption salt
         *
         * @return {string} Encrypted string
         */
        this.crypt = function(str, key, salt) {
            if (typeof str !== 'string') {
                str = JSON.stringify(str);
            }

            if (str == undefined || str == 'undefined') {
                str = '';
            }

            return CryptoJS.AES.encrypt(str, key + salt)
                .toString();
        };

        /**
         * Decrypt
         *
         * This function uses AES Algorithm to decrypt given string with
         * encryption key
         *
         * @param {string}  str        Given string to be decrypted
         * @param {string}  key        Secret Encryption Key
         * @param {string}  salt       Encryption salt
         *
         * @return {string} Decrypted string
         */
        this.decrypt = function(str, key, salt) {
            var bytes = CryptoJS.AES.decrypt(str, key + salt);

            try {
                bytes = bytes.toString(CryptoJS.enc.Utf8);

                return {
                    hasError: false,
                    result: bytes
                };
            }
            catch (error) {
                return {
                    hasError: true,
                    result: error
                };
            }
        };

        /**
         * Json Stringify
         *
         * This function takes a Json object including functions
         * and etc. and returns a string containing all of that
         *
         * @param {object}  json   Given JSON to be strigified
         *
         * @return {string} Stringified object
         */
        this.jsonStringify = function(json) {
            return JSON.stringify(json, function(k, v) {
                if (typeof v === 'function') {
                    return '' + v;
                }
                else {
                    return v;
                }
            });
        };

        /**
         * Json Parser
         *
         * This function takes a stringified json object including functions
         * and etc. and returns equaled object containing all of main jsons
         * attributes
         *
         * @param {string}  json   Given Json String to be parsed
         *
         * @return {object} Parsed JSON object
         */
        this.jsonParser = function(string) {
            try {
                return JSON.parse(string, function(k, v) {
                    if (typeof v === 'string') {
                        return (v.startsWith('function') ? eval('(' + v + ')') : v);
                    }
                    else {
                        return v;
                    }
                });
            } catch(e) {
                console.log("Error happened at Utility.jsonParser function()", e);
            }
        };
    }

    if (typeof module !== 'undefined' && typeof module.exports != 'undefined') {
        module.exports = ChatUtility;
    }
    else {
        if (!window.POD) {
            window.POD = {};
        }
        window.POD.ChatUtility = ChatUtility;
    }
})();

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"crypto-js":15}]},{},[6]);
