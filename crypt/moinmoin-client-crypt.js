//moinmoin-client-crypt.js
//Copyright 2011 Lorrin Nelson. All rights reserved.
//Simplified BSD Licence

//inject text node into DOM
function formPrependText(text) {
  var node = document.createTextNode(text)
  this.prepend(node);
}
//inject element into DOM
function formPrepend(new_element) {
  this.insertBefore(new_element, this.childNodes[0]);
}
function passwordVisibility(show) {
  var field = document.getElementById("field_password");
  if (show) {
    field.setAttribute("type","text");
  }
  else {
    field.setAttribute("type","password");
  }
}
function passwordAndBoxVisibility(show) {
  passwordVisibility(show);
  document.getElementById("box_show").checked = show;
}
function setupCryptUI() {
  var form = document.getElementById("editor");
  if (form == null) {
    return;
  }
  var fieldSet = form.elements[0];
  for (i = 0; i < form.elements.length; i++) {
    var name = form.elements[i].getAttribute("name");
    if (name == "button_save" || name == "button_preview" || name == "button_cancel" || name == "button_spellcheck" ) {
      form.elements[i].setAttribute("id",name);
    }
  }
  fieldSet.prepend = formPrepend;
  fieldSet.prependText = formPrependText;

  var breakElement = document.createElement("br");
  fieldSet.prepend(breakElement);

  var changeButton = document.createElement("input");
  changeButton.setAttribute("type", "button");
  changeButton.setAttribute("value","Change Password");
  changeButton.setAttribute("id","button_change");
  fieldSet.prepend(changeButton);

  fieldSet.prependText(" ");

  var cryptButton = document.createElement("input");
  cryptButton.setAttribute("type", "button");
  cryptButton.setAttribute("value","error");
  cryptButton.setAttribute("id","button_crypt");
  fieldSet.prepend(cryptButton);

  fieldSet.prependText(" ");

  fieldSet.prependText("Show");
  var showBox = document.createElement("input");
  showBox.setAttribute("type","checkbox");
  showBox.setAttribute("onchange","passwordVisibility(this.checked)");
  showBox.setAttribute("id","box_show");
  fieldSet.prepend(showBox);

  fieldSet.prependText(" ");

  var passwordField = document.createElement("input");
  passwordField.setAttribute("type", "password");
  passwordField.setAttribute("size", "50");
  passwordField.setAttribute("id", "field_password");
  //Ugh. Fine if user wants their browser to remember passwords. But want to
  //avoid remembering contents without prompting (and less security) as just
  //a form field. This seems liable to happen
  //when Show checkbox is used despite all the submission handlers setting the
  //type back to password before proceeding.
  passwordField.setAttribute("autocomplete", "off");
  //some browsers are confused and expect autocomplete on the form rather than the field
  form.setAttribute("autocomplete", "off");
  fieldSet.prepend(passwordField);

  fieldSet.prependText("Password: ");

  cryptState();
}
function applyToRegexMatch(fn,str,pat) {
  var index = str.search(pat);
  if (index < 0) {
    return str;
  } else {
    var before = str.substring(0,index);
    var matchArray = str.match(pat);
    var matchText = matchArray[0];
    var matchCapture = matchArray[1]
    var after = str.substr(index+matchText.length);
    var replace = fn(matchCapture);
    return before + replace + applyToRegexMatch(fn,after,pat);
  }
}
var encryptedSnippet=/ENC\(([^\)]*)\)/;
var decryptedSnippet=/PLAIN\(([^\)]*)\)/;
var encryptedDoc=/----- ENCRYPTED -----\n.*\n---------------------/;

function encryptSnippet(plainText) {
  var field_password = document.getElementById("field_password");
  return "ENC(" + Aes.Ctr.encrypt("CLEAN" + plainText, field_password.value, 256) + ")";
}
function encrypt() {
  var field_password = document.getElementById("field_password");
  var doc = document.getElementById("editor-textarea");

  if (field_password.value.length == 0) {
    alert("Encryption has been stripped.");
  }
  else {
    if (decryptedSnippet.test(doc.value)) {
      doc.value = applyToRegexMatch(encryptSnippet, doc.value, decryptedSnippet);
    } else {
      doc.value = "----- ENCRYPTED -----\n" + Aes.Ctr.encrypt("CLEAN"+doc.value, field_password.value, 256) + "\n---------------------";
    }
  }
  passwordAndBoxVisibility(false);
  cryptState();
}
function decryptWithCorrectnessHeuristics(cipherText) {
    var decrypted = Aes.Ctr.decrypt(cipherText, field_password.value, 256);
    var charsToCheck = Math.min(decrypted.lengh, 10);
    if (decrypted.slice(0,5) == "CLEAN") { //new text marks cleartext explicitly so we know password was correct
        return decrypted.slice(5);
    } else if (decrypted.match(/^[ -~]{5}/)) { //legacy text. Assume clean if starts with printable ASCII
        return decrypted;
    } else {
        var retry = confirm("Bad password? OK to re-enter, Cancel to proceed with suspect plaintext.");
        if (retry) {
            return null;
        } else {
            return decrypted;
        }
    }
}
function decryptSnippet(cipherText) {
  var field_password = document.getElementById("field_password");
  var decrypted = decryptWithCorrectnessHeuristics(cipherText);
  if (decrypted) {
      return "PLAIN(" + decrypted + ")";
  } else {
      return "ENC("+cipherText+")";
  }
}
function decrypt() {
  var doc = document.getElementById("editor-textarea");
  var field_password = document.getElementById("field_password");
  if (encryptedDoc.test(doc.value)) {
    var decrypted = decryptWithCorrectnessHeuristics(doc.value.substring(doc.value.indexOf("----- ENCRYPTED -----\n")+22,doc.value.indexOf("\n---------------------")));
    if (decrypted) {
        doc.value = decrypted;
    }
  } else {
    doc.value = applyToRegexMatch(decryptSnippet, doc.value, encryptedSnippet);
  }
  flgChange = false;
  passwordAndBoxVisibility(false);
  cryptState();
}
function cryptState() {
  var doc = document.getElementById("editor-textarea");
  var button_crypt = document.getElementById("button_crypt");
  var button_save = document.getElementById("button_save");
  var button_preview = document.getElementById("button_preview");
  var button_change = document.getElementById("button_change");
  var button_spell = document.getElementById("button_spellcheck");
  var button_cancel = document.getElementById("button_cancel");
  var field_password = document.getElementById("field_password");

  var contains_decrypted_plaintext;
  if (encryptedSnippet.test(doc.value) || encryptedDoc.test(doc.value)) {
    contains_decrypted_plaintext = false;
    button_crypt.setAttribute("value","Decrypt");
    button_crypt.setAttribute("onclick","decrypt()");
  }
  else {
    button_crypt.setAttribute("value","Encrypt");
    button_crypt.setAttribute("onclick","encrypt()");
    contains_decrypted_plaintext = (field_password.value.length > 0);
  }

  if (contains_decrypted_plaintext) {
    button_change.removeAttribute("disabled");
    button_change.setAttribute("onclick", "document.getElementById('field_password').removeAttribute('disabled')");
    button_save.setAttribute("value","Encrypt & Save Changes");
    button_save.setAttribute("onclick","passwordAndBoxVisibility(false); encrypt(); flgChange = false;");
    field_password.setAttribute("disabled","true");
    button_preview.setAttribute("disabled","true");
    button_preview.removeAttribute("onclick");
    button_spell.setAttribute("disabled","true");
    button_cancel.setAttribute("onclick","encrypt()");
  }
  else {
    button_change.setAttribute("disabled","true");
    button_change.removeAttribute("onclick");
    button_save.setAttribute("value","Save Changes");
    button_save.setAttribute("onclick","passwordAndBoxVisibility(false); flgChange = false;");
    field_password.removeAttribute("disabled");
    button_preview.removeAttribute("disabled");
    button_preview.setAttribute("onclick","flgChange = false;");
    button_spell.removeAttribute("disabled");
    button_cancel.removeAttribute("onclick");
  }

}
window.onload = setupCryptUI;
