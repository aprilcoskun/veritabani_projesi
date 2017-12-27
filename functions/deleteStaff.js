const sql = require('mssql');

exports.attempt = async (tc) => {
  try {
    const query = await sql.query`
      update personel
      set per_durum='Pasif'
      where per_tc=${tc}`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.number ? err.number : 500};

  }
}
