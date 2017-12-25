const sql = require('mssql');

exports.attempt = async (bus) => {
  try {
    const query = await sql.query`
      insert into servis
      values(
        ${bus.path},
        ${bus.plate},
        ${bus.name},
        ${bus.surname},
        ${bus.phone}
      )`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.status ? err.status : 500};
  }
}
