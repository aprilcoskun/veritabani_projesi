const sql = require('mssql');

exports.attempt = async (student) => {
  let now = new Date();
  let {tc, name, surname, bDay, ageGroup, gender, address,
  status, plate, sClass, parentName,
  parentPhone, parentJob, parentSurname, extraName, extraSurname,
  extraPhone, extraState, extraPhysical, extraAllergic, price,
  advancePayment, payNum, payUnitPrice} = student;
  const request = new sql.Request()
  .input('tc', tc)
  .input('ad', name)
  .input('soyad', surname)
  .input('dogtar', bDay)
  .input('cins', gender)
  .input('adres', address)
  .input('kayittar', new Date().toISOString().slice(0, 10).replace('T', ' '))
  .input('durum', 'Aktif')
  .input('yasgrup', ageGroup)
  .input('plaka', plate)
  .input('sinif', sClass)
  .input('veli_ad', parentName)
  .input('veli_soyad', parentSurname)
  .input('veli_tel', parentPhone)
  .input('veli_meslek', parentJob)
  .input('ek_ad', extraName)
  .input('ek_soyad', extraSurname)
  .input('ek_tel', extraPhone)
  .input('aciklama', extraState)
  .input('beden_durum', extraPhysical)
  .input('alerji', extraAllergic);
  try {
    const exec = await request.execute('sp_ogrenci_kayit');
    if(exec.returnValue != 1) return {status:500};
    if (advancePayment > 0)
      await sql.query`
        insert into taksit
          values(
            ${tc},
            ${new Date().toISOString().slice(0, 10).replace('T', ' ')},
            ${advancePayment},
            'Ödenmedi'
          )`;

    for (var i = 0; i < payNum; i++) {
      let paymentDay = now;
      paymentDay.setMonth(now.getMonth() + i + 1);
      paymentDay = paymentDay.toISOString().slice(0, 10).replace('T', ' ');
      await sql.query`
        insert into taksit
          values(
            ${tc},
            ${paymentDay},
            ${payUnitPrice},
            'Ödenmedi'
          )`;
    }

  } catch (err) {
    console.error(err);
    return {status:err.status ? err.status : 500};

  }
}
