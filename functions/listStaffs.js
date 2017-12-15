const sql = require('mssql');

exports.attempt = async () => {
  try {
    const query = await sql.query`select * from personel for json path`;
    return JSON.parse(first(query.recordset[0]));
  } catch(err) {
    console.error(err);
    return {status:500};
  }
}

function first(obj) {
    for (let a in obj) return obj[a];
}
