const crypto = require('crypto');

function compareHash(text, hash) {
  let h  = crypto.createHmac('sha256', 'qwerty?');
  h.update(text);
  if (h.digest('hex') == hash)
    return true;
  else {
    return false;
  }
}
