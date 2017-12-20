const sql = require('mssql');

exports.attempt = async (stuff) => {
  try {
    const query = await sql.query`
      insert into envanter
      values(
        ${stuff.name},
        ${stuff.price},
        ${stuff.number},
        ${new Date().toISOString().slice(0, 10).replace('T', ' ')},
        ${stuff.compName},
        ${stuff.compPhone},
        ${stuff.staffTC}
      )`;
    return {status:200};
  } catch(err) {
    console.error(err);
    return {status:err.status ? err.status : 500};

  }
}
