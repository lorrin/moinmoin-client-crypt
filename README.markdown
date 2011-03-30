# Overview
moinmoin-client-crypt provides client-side encryption/decryption of MoinMoin wiki pages (or portions thereof). It adds encrypt/decrypt buttons to the edit screen, providing an easy mechanism to secure all or a portion of the content. Encryption is via Chris Veness' Javascript AES implementation (256 bit key, CTR mode).

Installation involves dropping a couple JavaScript files into the appropriate MoinMoin directory and tweaking the theme init file to reference them. Full functionality with modern and classic themes, perhaps slightly degraded on others. It shouldn't take much tweaking to adapt to other themes; patches and bug reports are welcome!

The client-side JavaScript approach provides some security if the server were to be seized: the AES ciphertext should be extremely difficult to crack. Also, once the browser is closed on the client side, there should be no trace left of the plaintext. However, if the server were compromised it would be easy to replace moinmoin-client-crypt with a trojan horse if a malicious person were to gain control of the client, they could easily install e.g. a keylogger
you have to trust your client machine, your browser, your connection to the server, and the integrity of the server, as explained [here](http://rdist.root.org/2010/11/29/final-post-on-javascript-crypto/ "Final post on Javascript crypto") by Nate Lawson. The need for client-side security should be obvious; the server and connection must be trusted not to send/inject a modified version of the script.

# Installation
1. Place crypt directory into htdocs/common/js (e.g. /usr/share/moin/htdocs/common/js/crypt)
2. Update the html_head function (around line 900) in __init__.py (e.g. /usr/share/pyshared/MoinMoin/theme/__init__.py) to reference all the js files:
            self.externalScript('crypt/base64'),
            self.externalScript('crypt/utf8'),
            self.externalScript('crypt/aes'),
            self.externalScript('crypt/aes-ctr'),
            self.externalScript('crypt/moinmoin-client-crypt'),

# Usage
## Encryption
1. Edit a page
2. Enter a password
3. Click Encrypt
4. Click Save Changes

## Decryption and Updates
1. Edit a page
2. Enter a password
3. Click Decrypt
4. Make any desired changes
5. Click Encrypt & Save Changes

## Snippets
Encrypting snippets, rather than the whole page, is supported as well. Any sections of format PLAIN(text to be encrypted) in the document will be encrypted to ENC(ciphertext). Note that the plaintext must not contain any parentheses.

# Credits & License
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
