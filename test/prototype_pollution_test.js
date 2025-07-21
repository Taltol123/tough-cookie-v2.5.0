/*!
This test checks that setting a cookie with a malicious domain "__proto__"
does not cause prototype pollution (CVE-2023-26136). If the library is patched,
Object.prototype should not be polluted by the cookie path.
 */

'use strict';

var vows = require('vows');
var assert = require('assert');
var tough = require('../lib/cookie');
var CookieJar = tough.CookieJar;

vows
  .describe('CVE-2023-26136 Prototype Pollution Fix')
  .addBatch({
    'When using a malicious cookie with __proto__ domain': {
      topic: function () {
        const callback = this.callback;
        const cookiejar = new CookieJar(undefined, { rejectPublicSuffixes: false });

        // Set a malicious cookie with domain=__proto__
        cookiejar.setCookie(
          "Hacked=polluted; Domain=__proto__; Path=/polluted",
          "https://__proto__/admin",
          { loose: true },
          function (err) {
            if (err) return callback(err);
            const testObj = {}; // Check if this object gets polluted
            callback(null, testObj);
          }
        );
      },

      'should not pollute Object.prototype': function (testObj) {
        assert.ok(
          !Object.prototype.hasOwnProperty('/polluted'),
          'Object.prototype was polluted — the vulnerability exists!'
        );
      }
    }
  })
  .export(module);


