const sql = require('mssql');

exports.attempt = async () => {
  try {
    const query = await sql.query`
      BACKUP DATABASE [anaokulu]
      TO DISK = N'/home/alp/anaokulu_yedek.bak'
      WITH NOFORMAT, INIT, NAME = 'anaokulu_yedek', NOREWIND`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.number ? err.number : 500};
  }
}
