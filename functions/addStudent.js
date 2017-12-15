const sql = require('mssql');

exports.attempt = async (
  tc, name, surname, bDay, gender, address,
  status, yasgrup, plate, sClass, PName,
  pPhone, pJob, pSurname, extraName, extraSurname,
  extraPhone, extraState, extraPhysical, extraAllergic
) => {
  try {
    await sql.query`
      exec sp_ogrencikayit
      '${tc}',
      '${name}',
      '${surname}',
      '${bDay}',
      '${gender}',
      '${address}',
      '${new Date().toISOString().slice(0, 10).replace('T', ' ')}',
      '${status}',
      '${yasgrup}',
      '${plate}',
      '${sClass}',
      '${PName}',
      '${pPhone}',
      '${pJob}',
      '${pSurname}',
      '${extraName}',
      '${extraSurname}',
      '${extraPhone}',
      '${extraState}',
      '${extraPhysical}',
      '${extraAllergic}'`;
  } catch (err){
    console.error(err);
    return {status:500};
  }
  return {status:200};
}

function first(obj) {
    for (let a in obj) return obj[a];
}
