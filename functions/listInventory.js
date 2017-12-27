const sql = require('mssql');

exports.attempt = async () => {
  try {
    const query = await sql.query`
      select *
      from envanter
      inner join personel on envanter.per_tc = personel.per_tc
      for json auto`;
    return query.recordset[0];
  } catch(err) {
    console.error(err);
    return {status:err.status ? err.status : 500};

  }
}
