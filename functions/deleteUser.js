const sql = require('mssql');

exports.attempt = async (user) => {
  try {
    const query = await sql.query`
      delete from giris
      where per_tc=${user.tc}`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.status ? err.status : 500};
  }
}
