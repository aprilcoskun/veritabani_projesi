const sql = require('mssql');

exports.attempt = async (buses) => {
  try {
    await buses.forEach(async (bus) => {
      const query = await sql.query`
        insert into servis
        values(
          ${bus.guzergah},
          ${bus.plaka},
          ${bus.sofor_ad},
          ${bus.sofor_soyad},
          ${bus.ser_tel}
        )`;
    })
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.number ? err.number : 500};
  }
}
