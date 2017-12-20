const sql = require('mssql');

exports.attempt = async () => {
  try {
    const query = await sql.query`select * from personel for json path`;
    return query.recordset[0];
  } catch(err) {
    console.error(err);
    return {status:err.status ? err.status : 500};
  }
}
