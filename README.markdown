# client-side cryptography for MoinMoin
## Overview
__moinmoin-client-crypt provides client-side encryption/decryption of MoinMoin wiki pages (or portions thereof).__ It adds encrypt/decrypt buttons to the edit screen, providing an easy mechanism to secure all or a portion of the content. Encryption is done via [Chris Veness' Javascript AES implementation](http://www.movable-type.co.uk/scripts/aes.html) (256 bit key, CTR mode).

Installation involves dropping a couple JavaScript files into the appropriate MoinMoin directory and tweaking the theme init file to reference them.

![Screenshot](screenshot.png)

## Installation
1. Place crypt directory into `htdocs/common/js`
  * Debian/Ubuntu: `/usr/share/moin/htdocs/common/js/crypt`
  * Desktop Edition: `./MoinMoin/web/static/htdocs/common/js/crypt`
2. Update `__init__.py` to reference all the moinmoin-client-crypt js files. In the `html_head` function (around line 900) find the `externalScript` invocation and add the following additional ones. Remember, Python requires consistent indentation!
  * Debian/Ubuntu (wheezy / 14.04 and newer): `/usr/lib/python2.7/dist-packages/MoinMoin/theme/__init__.py`
  * Debian/Ubuntu (squeeze / 13.10 and older): `/usr/share/pyshared/MoinMoin/theme/__init__.py`
  * Desktop Edition: `./MoinMoin/theme/__init__.py`

  ```python
self.externalScript('crypt/base64'),
self.externalScript('crypt/utf8'),
self.externalScript('crypt/aes'),
self.externalScript('crypt/aes-ctr'),
self.externalScript('crypt/moinmoin-client-crypt'),
```

### Theme Compatibility
 moinmoin-client-crypt has full functionality with *modern* and *classic* themes. Perhaps slightly degraded on others. It shouldn't take much tweaking to adapt to other themes; patches and bug reports are welcome!

## Usage
### Encryption
1. Edit a page
2. Enter a password
3. Click Encrypt
4. Click Save Changes

### Decryption and Updates
1. Edit a page
2. Enter a password
3. Click Decrypt
4. Make any desired changes
5. Click Encrypt & Save Changes

### Snippets
Encrypting snippets, rather than the whole page, is supported as well. Any sections of format `PLAIN(text to be encrypted)` in the document will be encrypted to `ENC(ciphertext)`. Note that the plaintext must not contain any parentheses.

## Security Considerations
Client-side JavaScript is only as secure as the server hosting the JavaScript. A compromised server could serve up a trojan-horse replacement of the Javascript and the client would not be able to detect it. Therefore one could argue that if you must trust the server, you might as well store the data in plaintext on the server. If it is believed, however, that the server is more likely to be seized than subverted, then the client-side JavaScript approach provides some security: the AES ciphertext should be extremely difficult to crack. And, if the server is trusted, nothing is given up by running the encryption client-side rather than server-side. For a more thorough discussion, see [Final post on Javascript crypto](http://rdist.root.org/2010/11/29/final-post-on-javascript-crypto/) by Nate Lawson and [Javascript Cryptography Considered Harmful](http://www.matasano.com/articles/javascript-cryptography/) by Matasano Security.

## Credits & License
Encryption logic is supplied via [Chris Veness' JavaScript AES implementation](http://www.movable-type.co.uk/scripts/aes.html).
Files with Chriss Veness' copyright are distributed under the Creative Commons [CC-BY licence](http://creativecommons.org/licenses/by/3.0/).

moinmoin-client-crypt files are distributed under the Simplified BSD License:

Copyright 2011 Lorrin Nelson. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY LORRIN NELSON ``AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL LORRIN NELSON OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
