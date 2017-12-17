const sql = require('mssql');

exports.attempt = async (student) => {
  let {tc, name, surname, bDay, gender, address,
  status, plate, sClass, parentName,
  parentPhone, parentJob, parentSurname, extraName, extraSurname,
  extraPhone, extraState, extraPhysical, extraAllergic} = student;
  console.log(gender);
  try {
    let a = await sql.query`
      Exec sp_ogrencikayit
      ${tc},
      '${name}',
      '${surname}',
      ${bDay},
      '${gender}',
      '${address}',
      ${new Date().toISOString().slice(0, 10).replace('T', ' ')},
      'Aktif',
      '4-6',
      '${plate}',
      '${sClass}',
      '${parentName}',
      '${parentSurname}',
      ${parentPhone},
      '${parentJob}',
      '${extraName}',
      '${extraSurname}',
      ${extraPhone},
      '${extraState}',
      '${extraPhysical}',
      '${extraAllergic}'`;
      console.log(a);
  } catch (err){
    console.error(err.originalError);
    return {status:500};
  }
  return {status:200};
}

function first(obj) {
    for (let a in obj) return obj[a];
}
