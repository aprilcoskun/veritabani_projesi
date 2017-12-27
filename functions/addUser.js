const crypto = require('crypto');
const sql = require('mssql');

exports.attempt = async (user) => {
  try {
    const query = await sql.query`
      insert into giris
      values(${user.tc}, ${user.username}, ${hash(user.pass)})`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.number ? err.number : 500};
  }
}
function hash(text) {
  return  crypto.createHash('sha256').update(text).digest('hex');
}
