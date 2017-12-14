const crypto = require('crypto');
const sql = require('mssql');

exports.attempt = async (username, password) => {
  const userQuery = await sql.query`select * from giris where kullaniciadi=${username} for json path`;
  const rawUser = await first(userQuery.recordset[0]);
  const user = await rawUser ? JSON.parse(rawUser)[0]: null;
  if(user)
    if(compareHash(password, user.sifre)) return {status:200};
    else return {status:401};
  else return {status:404};
}

function compareHash(text, hash) {
  let h  = crypto.createHash('sha256');
  h.update(text);
  if (h.digest('hex') == hash)
    return true;
  else {
    return false;
  }
}

function first(obj) {
    for (let a in obj) return obj[a];
}
