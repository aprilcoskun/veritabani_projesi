const sql = require('mssql');

exports.attempt = async () => {
  try {
    const query = await sql.query`exec sp_odenmis_taksit`;


    return query.recordsets[0][0];
  } catch(err) {
    console.error(err);
    return {status:err.number ? err.number : 500};

  }

}
