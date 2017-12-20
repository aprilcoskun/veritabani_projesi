const sql = require('mssql');

exports.attempt = async (staff) => {
  try {
    const query = await sql.query`
      delete from personel
      where per_tc=${staff.tc}`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:500};
  }
}
