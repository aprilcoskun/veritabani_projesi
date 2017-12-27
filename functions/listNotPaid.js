const sql = require('mssql');

exports.attempt = async () => {
  try {
    const query = await sql.query`exec sp_odenmemis_taksit`;


    return query.recordsets[0][0];
  } catch(err) {
    console.error(err);
    return {status:err.status ? err.status : 500};
  }
}
