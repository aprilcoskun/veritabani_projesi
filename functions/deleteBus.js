const sql = require('mssql');

exports.attempt = async (bus) => {
  try {
    const query = await sql.query`
      delete from servis
      where plaka=${bus.plate}`;
    return {status:200};
  } catch(err) {
    return {status:err.status ? err.status : 500};
  }
}
