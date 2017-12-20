const sql = require('mssql');

exports.attempt = async (tc) => {
  try {
    const query = await sql.query`
      update ogrenci
      set ogr_durum='Pasif'
      where ogr_tc=${tc}`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.status ? err.status : 500};
  }
}
