const sql = require('mssql');

exports.attempt = async (tc,date) => {
  try {
    const query = await sql.query`
      update taksit
      set taksit_durum='Ödendi'
      where ogr_tc=${tc}
      and odeme_tar=${date}`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.number ? err.number : 500};
  }
}
