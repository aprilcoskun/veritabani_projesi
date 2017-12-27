const sql = require('mssql');

exports.attempt = async () => {
  try {
    const query = await sql.query`exec sp_yedekden_geri_don`;
//RESTORE DATABASE [anaokulu] FROM  DISK = N'/home/alp/a.bak' WITH  FILE = 1, REPLACE
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.status ? err.status : 500};
  }
}
