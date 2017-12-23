const sql = require('mssql');

exports.attempt = async (plate) => {
  try {
    const query = await sql.query`
      delete from servis
      where plaka=${plate}`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.status ? err.status : 500};
  }
}
