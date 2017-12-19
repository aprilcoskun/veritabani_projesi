const crypto = require('crypto');
const sql = require('mssql');

exports.attempt = async (username, password) => {
  try {
    const userQuery = await sql.query`select * from giris where kullanici_adi=${username} for json path`;
    const user = userQuery.recordset[0][0];
    if(user)
      if(compareHash(password, user.kullanici_sifre)) return {status:200};
      else return {status:401};
    else return {status:404};
  } catch (err) {
    return {status:404};
  }

}

function compareHash(text, hash) {
  return crypto.createHash('sha256').update(text).digest('hex') == hash;
}
