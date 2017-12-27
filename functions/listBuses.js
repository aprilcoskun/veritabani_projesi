const sql = require('mssql');

exports.attempt = async () => {
  try {
    const query = await sql.query`
      select *
      from servis
      for json auto`;

    return query.recordset[0];
  } catch(err) {
    console.error(err);
    return {status:err.number ? err.number : 500};

  }
}
