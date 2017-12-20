const sql = require('mssql');

exports.attempt = async (no) => {
  try {
    const query = await sql.query`
      delete from envanter
      where urun_no=${no}`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.status ? err.status : 500};

  }
}
