const sql = require('mssql');

exports.attempt = async studentClass => {
  try {
    const query = await sql.query`
      select *
      from ogrenci
      inner join ebeveyn on ogrenci.ogr_tc = ebeveyn.ogr_tc
      inner join ekbilgi on ogrenci.ogr_tc = ekbilgi.ogr_tc
      where sinif_ad=${studentClass}
      for json auto`;

    return query.recordset[0];
  } catch(err) {
    console.error(err);
    return {status:500};
  }
}
