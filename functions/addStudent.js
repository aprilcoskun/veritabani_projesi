const sql = require('mssql');

exports.attempt = async (student) => {
  let {tc, name, surname, bDay, ageGroup, gender, address,
  status, plate, sClass, parentName,
  parentPhone, parentJob, parentSurname, extraName, extraSurname,
  extraPhone, extraState, extraPhysical, extraAllergic} = student;
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
    .input('alerji', extraAllergic)

    let exec = await request.execute('sp_ogrenci_kayit');

    return exec.returnValue == 1 ? {status:200} : {status:500};

}
