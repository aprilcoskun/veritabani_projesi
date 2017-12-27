const sql = require('mssql');

exports.attempt = async () => {
  try {
    const query = await sql.query`exec sp_yedekle`;
//BACKUP DATABASE [anaokulu] TO DISK = N'/home/alp/a.bak' WITH NOFORMAT, NOINIT, NAME = 'anaokulu-full', NOREWIND
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.status ? err.status : 500};
  }
}
