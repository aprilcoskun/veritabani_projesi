const sql = require('mssql');

exports.attempt = async Class => {
  try {
    const query = await sql.query`select * from ogrenci inner join ebeveyn on ogrenci.ogr_tc = ebeveyn.ogr_tc where sinif_ad=${Class} for json auto`;
    return JSON.parse(first(query.recordset[0]));
  } catch(err) {
    console.error(err);
    return {status:500};
  }
}

function first(obj) {
    for (let a in obj) return obj[a];
}
