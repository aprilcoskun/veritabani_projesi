const sql = require('mssql');

exports.attempt = async (staff) => {
  try {
    const query = await sql.query`
      insert into personel
      values(
        ${staff.tc},
        ${staff.name},
        ${staff.surname},
        ${staff.bDay},
        ${staff.phone},
        ${new Date().toISOString().slice(0, 10).replace('T', ' ')},
        ${null},
        ${staff.email},
        ${staff.salary},
        ${staff.position},
        'Aktif',
        ${staff.insurance}
      )`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.number ? err.number : 500};

  }
}
