let studentsCache = [];
let busesCache = [];
let inventoryCache = [];
let usersCache = [];
let staffCache = [];
let paysCache = [];
let studentTC = document.getElementById('studentTC');
let studentName = document.getElementById('studentName');
let studentSurname = document.getElementById('studentSurname');
let studentBday = document.getElementById('studentBday');
let studentAddress = document.getElementById('studentAddress');
let studentSchoolBus = document.getElementById('studentSchoolBus');
let studentClass = document.getElementById('studentClass');
let studentParentName = document.getElementById('studentParentName');
let studentParentSurname = document.getElementById('studentParentSurname');
let studentParentJob = document.getElementById('studentParentJob');
let studentParentPhone = document.getElementById('studentParentPhone');
let studentPrice = document.getElementById('studentPrice');
let studentAdvancePayment = document.getElementById('studentAdvancePayment');
let studentPayNum = document.getElementById('studentPayNum');
let studentPayUnitPrice = document.getElementById('studentPayUnitPrice');
let studentExtraName = document.getElementById('studentExtraName');
let studentExtraSurname = document.getElementById('studentExtraSurname');
let studentExtraPhone = document.getElementById('studentExtraPhone');
let studentExtraState = document.getElementById('studentExtraState');
let studentExtraPhysical = document.getElementById('studentExtraPhysical');
let studentExtraAllergic = document.getElementById('studentExtraAllergic');
let classToList = document.getElementById('classToList');
let studentList = document.getElementById('studentList');
let schoolBus = document.getElementById('schoolbus');
let inventory = document.getElementById('inventory');
let _users = document.getElementById('users');
let _staffs = document.getElementById('staff');
let _pays = document.getElementById('_budget');
let ctx = document.getElementById("chart").getContext('2d');
let staffBday = document.getElementById('staffBday');
let backup = false;

function karakterKontrol(olay){
	var tusKodu;
	if(window.event){ // IE
		tusKodu = olay.keyCode
	}else if(olay.which){ // Netscape/Firefox/Opera
		tusKodu = olay.which;
	}
	//alert(tusKodu)
	if(tusKodu == 8){ // backspace tuşuna da izin vermek istiyorsak
		return true;
	}
	if ((tusKodu > 64 && tusKodu < 91)
				|| (tusKodu > 96 && tusKodu < 123)
				|| tusKodu == 32
				|| tusKodu == 105
				|| tusKodu == 305
				|| tusKodu == 287
				|| tusKodu == 252
				|| tusKodu == 351
				|| tusKodu == 246
				|| tusKodu == 231)
  {
	    return true;
	}
	else{
    tusKodu.keyCode = 0;
    return  false;
	}
}

function rakamKontrol(olay){
	var tusKodu;
	if(window.event){ // IE
		tusKodu = olay.keyCode
	}else if(olay.which){ // Netscape/Firefox/Opera
		tusKodu = olay.which;
	}
	//alert(tusKodu)
	if(tusKodu == 8){ // backspace tuşuna da izin vermek istiyorsak
		return true;
	}
	if (tusKodu < 48 || tusKodu > 57){
	    tusKodu.keyCode = 0;
	    return  false;
	}
	else{
	    return true;
	}
}

/*DOGUM TARIHI SINIRLARI*/

let minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 6)).toJSON().split('T')[0];
let maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toJSON().split('T')[0];

studentBday.setAttribute('min', minDate);
studentBday.setAttribute('max', maxDate);
staffBday.setAttribute(
  'max',
  new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toJSON().split('T')[0]
);

/*Birim Taksit Hesabi*/
function calUnitPrice() {
  if (studentPrice.value.length > 5)
      studentPrice.value = studentPrice.value.slice(0,5);
  if (studentAdvancePayment.value.length > 5)
      studentAdvancePayment.value = studentAdvancePayment.value.slice(0,5);
  let price = parseInt(studentPrice.value);
  let advancePayment = parseInt(studentAdvancePayment.value);
  let unitSize = parseInt(studentPayNum.value);
  if(price && advancePayment && unitSize && price > advancePayment)
    studentPayUnitPrice.value = Math.round(((price - advancePayment)/unitSize) * 100) / 100;
  else if (advancePayment == 0) {
    studentPayUnitPrice.value = Math.round((price /unitSize) * 100) / 100;
  }

  else
    studentPayUnitPrice.value = null;
}

/*Ogrenci ekleme*/
function addStudent() {
  let student = {};
  student.tc = studentTC.value;
  student.name = studentName.value;
  student.surname = studentSurname.value;
  student.bDay = new Date(studentBday.value).toISOString().slice(0, 10).replace('T', ' ');
  student.ageGroup = new Date().getFullYear() - new Date(student.bDay).getFullYear() < 4 ?
   '2-4' : '4-6';
  student.gender = document.getElementById('male').checked ? 'E' : 'K';
  student.address = studentAddress.value;
  student.sClass = studentClass.value;
  student.bus = studentSchoolBus.value == 'none' ?
   null : studentSchoolBus.value;
  student.parentName = studentParentName.value;
  student.parentSurname = studentParentSurname.value;
  student.parentPhone = studentParentPhone.value;
  student.parentJob = studentParentJob.value;
  student.price = studentPrice.value;
  student.advancePayment = studentAdvancePayment.value;
  student.payNum = studentPayNum.value;
  student.payUnitPrice = studentPayUnitPrice.value;
  student.extraName = studentExtraName.value;
  student.extraSurname = studentExtraSurname.value;
  student.extraPhone = studentExtraPhone.value;
  student.extraState = studentExtraState.value;
  student.extraPhysical = studentExtraPhysical.value;
  student.extraAllergic = studentExtraAllergic.value;
  return fetch('/student', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(student)
  })
  .then(response => {
    $('#addStudent').modal('hide');
    if(response.status < 400) {
      $.notify({
        message: `${studentName.value} adlı öğrenci kaydedildi.`
      },{
        type: 'success'
      });
    } else {
      $.notify({
        message: `${studentName.value} adlı öğrenci kaydedilemedi! HATA:(${response.status})`
      },{
        type: 'danger'
      });
    }
  })
}

/*Ogrenci listeleme*/
function listStudents() {
  let first = true;
  if($('#studentTable')[0]) {
    first = false;
    $('#studentTable').animateCss('flipOutX', function(){
      $("#studentTable").css('opacity', '0');
    });
  }

  let studentTableContent = ``;
  fetch(`/student/${classToList.value}`,{credentials: 'include'})
  .then(response => response.json()).then(students => {
    studentsCache = students;
    for (let i in students) {
      let student = students[i];
      if(student.ogr_durum == 'Aktif')
        studentTableContent += `
        <tr class="student" onclick="studentDetail('${i}')" ondblclick="studentAlert('${i}')">
          <td class="class="col-md-2">${student.ogr_tc}</td>
          <td class="class="col-md-2">${student.ogr_ad}</td>
          <td class="class="col-md-2">${student.ogr_soyad}</td>
        </tr>`;
    }
    studentList.innerHTML = `
    <table class="table table-striped table-bordered table-hover" id="studentTable">
      <thead>
        <tr>
          <th class="class="col-md-2">T.C</th>
          <th class="class="col-md-2">Ad</th>
          <th class="class="col-md-2">Soyad</th>
        </tr>
    </thead>
      ${studentTableContent}
    </table>
    `;
    studentList.innerHTML += `
    <div class="dropdown">
      <button
        class="btn btn-default dropdown-toggle"
        type="button"
        id="export"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="true">
        Export
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="export">
        <li>
          <a
            download="${classToList.value}.json"
            href='data:text/json;charset=utf-8,${JSON.stringify(studentsCache)}'>
              JSON
          </a>
        </li>
        <li><a href="javascript:studentsToPDF()">PDF</a></li>
        <li><a href="#"></a></li>
      </ul>
    </div>`;
    if(!first) {
      $("#studentTable").css('opacity', '1');
      $('#studentTable').animateCss('flipInX');
    } else {
      $('#studentTable').animateCss('zoomIn');
    }

  })
  .catch(err => console.error(err));
}

/*Ogrenci'ye cift tiklayinca cikan alert*/
function studentAlert(i) {
  let student = studentsCache[i];
  swal({
    title: `${student.ogr_ad} ${student.ogr_soyad}`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonText: 'Düzenle',
    cancelButtonText: 'Sil'
  }).then((result) => {
    if (result.dismiss === 'cancel') {
      return fetch(`/student/${student.ogr_tc}`, {
          method: 'DELETE',
          credentials: 'include',
      })
      .then(response => {
        if(response.status < 400) {
          $.notify({
            message: `${student.ogr_ad} adlı öğrenci silindi.`
          },{
            type: 'success'
          });
          listStudents();
        } else {
          $.notify({
            message: `${student.ogr_ad} adlı öğrenci silinemedi! HATA:(${response.status})`
          },{
            type: 'danger'
          });
        }
      })
      .catch(err => console.error(err));
  }
  })
}

/*Envantere cift tiklayinca cikan alert*/
function stuffAlert(i) {
  let stuff = inventoryCache[i];
  swal({
    title: `${stuff.urun_ad}`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: 'Sil'
  }).then((result) => {
    if (result.dismiss === 'cancel') {
      return fetch(`/inventory/${stuff.urun_no}`, {
          method: 'DELETE',
          credentials: 'include',
      })
      .then(response => {
        if(response.status < 400) {
          $.notify({
            message: `${stuff.urun_ad} silindi.`
          },{
            type: 'success'
          });
          listInventory();
        } else {
          $.notify({
            message: `${stuff.urun_ad} silinemedi! HATA:(${response.status})`
          },{
            type: 'danger'
          });
        }
      })
      .catch(err => console.error(err));
  }
  })
}

/*Personele cift tiklayinca cikan alert*/
function staffAlert(i) {
  let staff = staffCache[i];
  swal({
    title: `${staff.per_ad} ${staff.per_soyad}`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: 'Sil'
  }).then((result) => {
    if (result.dismiss === 'cancel') {
      return fetch(`/staff/${staff.per_tc}`, {
          method: 'DELETE',
          credentials: 'include',
      })
      .then(response => {
        if(response.status < 400) {
          $.notify({
            message: `${staff.per_ad} silindi.`
          },{
            type: 'success'
          });
          listStaffs();
        } else {
          $.notify({
            message: `${staff.per_ad} silinemedi! HATA:(${response.status})`
          },{
            type: 'danger'
          });
        }
      })
      .catch(err => console.error(err));
  }
  })
}

/*Kullanıcıya cift tiklayinca cikan alert*/
function userAlert(i) {
  let user = usersCache[i];
  swal({
    title: `${user.kullanici_adi}`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: 'Sil'
  }).then((result) => {
    if (result.dismiss === 'cancel') {
      return fetch(`/user/${user.per_tc}`, {
          method: 'DELETE',
          credentials: 'include',
      })
      .then(response => {
        if(response.status < 400) {
          $.notify({
            message: `${user.kullanici_adi} silindi.`
          },{
            type: 'success'
          });
          listUsers();
        } else {
          $.notify({
            message: `${user.kullanici_adi} silinemedi! HATA:(${response.status})`
          },{
            type: 'danger'
          });
        }
      })
      .catch(err => console.error(err));
  }
  })
}

/*Kullanıcıya cift tiklayinca cikan alert*/
function busAlert(i) {
  let bus = busesCache[i];
  swal({
    title: `${bus.guzergah}`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: 'Sil'
  }).then((result) => {
    if (result.dismiss === 'cancel') {
      return fetch(`/bus/${bus.plaka}`, {
          method: 'DELETE',
          credentials: 'include',
      })
      .then(response => {
        if(response.status < 400) {
          $.notify({
            message: `${bus.guzergah} silindi.`
          },{
            type: 'success'
          });
          listBuses();
        } else {
          $.notify({
            message: `${bus.guzergah} silinemedi! HATA:(${response.status})`
          },{
            type: 'danger'
          });
        }
      })
      .catch(err => console.error(err));
  }
  })
}

/*OGRENCI DETAY*/
function studentDetail(i) {
  $('#studentDetail').animateCss('flash');

  let student = studentsCache[i];
  let parent = student.ebeveyn[0];
  let extra = student.ebeveyn[0].ekbilgi[0];
  document.getElementById('studentDetail').innerHTML = `
    <h4 id="studentDetailH">Öğrenci Detayı</h4>
    <label class="col-sm-6 control-label">Öğrenci Adı:</label>
    <p class="col-sm-6">${student.ogr_ad}</p>
    <label class="col-sm-6 control-label">Öğrenci Soyadı:</label>
    <p class="col-sm-6">${student.ogr_soyad}</p>
    <label class="col-sm-6 control-label">Öğrenci T.C:</label>
    <p class="col-sm-6">${student.ogr_tc}</p>
    <label class="col-sm-6 control-label">Öğrenci Cinsiyeti:</label>
    <p class="col-sm-6">${student.ogr_cins == 'E' ? 'Erkek' : 'Kız'}</p>
    <label class="col-sm-6 control-label">Öğrenci Adresi:</label>
    <p class="col-sm-6">${student.ogr_adres}</p>
    <label class="col-sm-6 control-label">Öğrenci Doğum Tarihi:</label>
    <p class="col-sm-6">${student.ogr_dog_tar}</p>
    <label class="col-sm-6 control-label">Öğrenci Yaş Grubu:</label>
    <p class="col-sm-6">${student.ogr_yas_grup}</p>
    <label class="col-sm-6 control-label">Öğrenci Kayıt Tarihi:</label>
    <p class="col-sm-6">${student.ogr_adres}</p>
    <label class="col-sm-6 control-label">Veli Adı:</label>
    <p class="col-sm-6">${parent.veli_ad}</p>
    <label class="col-sm-6 control-label">Veli Soyadı:</label>
    <p class="col-sm-6">${parent.veli_soyad}</p>
    <label class="col-sm-6 control-label">Veli Telefonu:</label>
    <p class="col-sm-6">${parent.veli_tel}</p>
    <label class="col-sm-6 control-label">Veli Mesleği:</label>
    <p class="col-sm-6">${parent.veli_meslek}</p>
    <label class="col-sm-6 control-label">Öğrencinin Servisi:</label>
    <p class="col-sm-6">${student.plaka ? student.plaka : 'Servis Kullanmıyor'}</p>
    <label class="col-sm-6 control-label">Ek Ad:</label>
    <p class="col-sm-6">${extra.ek_ad}</p>
    <label class="col-sm-6 control-label">Ek Soyad:</label>
    <p class="col-sm-6">${extra.ek_soyad}</p>
    <label class="col-sm-6 control-label">Ek Açıklama:</label>
    <p class="col-sm-6">${extra.ek_aciklama}</p>
    <label class="col-sm-6 control-label">Ek Tel:</label>
    <p class="col-sm-6">${extra.ek_tel}</p>
    <label class="col-sm-6 control-label">Ek Beden Durum:</label>
    <p class="col-sm-6">${extra.ek_beden_durum}</p>
    <label class="col-sm-6 control-label">Ek Alerji:</label>
    <p class="col-sm-6">${extra.ek_alerji}</p>`;
  }

/*Servisleri listeleme*/
function listSchoolBuses() {
  let first = true;
  if($('#busesTable')[0]) {
    first = false;
    $('#busesTable').animateCss('flipOutX', function(){
      $("#busesTable").css('opacity', '0');
    });
  }

  let busTableContent = ``;
  fetch(`/bus`,{credentials: 'include'})
  .then(response => response.json()).then(buses => {
    busesCache = buses;
    for (let i in buses) {
      let bus = buses[i];
        busTableContent += `
        <tr class="staff" onclick="busAlert('${i}')">
          <td>${bus.sofor_ad}</td>
          <td>${bus.sofor_soyad}</td>
          <td>${bus.ser_tel}</td>
          <td>${bus.guzergah}</td>
          <td>${bus.plaka}</td>
        </tr>`;
    }
    schoolBus.innerHTML = `
    <div class="form-group" style="margin-top:12px;">
      <a class="btn btn-primary" href="javascript:listSchoolBuses()">Servisleri Listele</a>
      <button class="btn btn-primary" data-toggle="modal" data-target="#addBus">
        Servis Kayıt
      </button>
    </div>
    <table class="table table-striped table-bordered table-hover" id="busesTable">
      <thead>
        <tr>
          <th>Şöför Adı</th>
          <th>Şöför Soyadı</th>
          <th>Şöför Telefonu</th>
          <th>Güzergah</th>
          <th>Plaka</th>
        </tr>
      </thead>
      ${busTableContent}
    </table>
    `;
    schoolBus.innerHTML += `
    <div class="dropdown">
      <button
        class="btn btn-default dropdown-toggle"
        type="button"
        id="export"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="true">
        Export
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="export">
        <li>
          <a
            download="Servisler.json"
            href='data:text/json;charset=utf-8,${JSON.stringify(busesCache)}'>
              JSON
          </a>
        </li>
        <li><a href="javascript:busesToPDF()">PDF</a></li>
        <li><a href="#"></a></li>
      </ul>
    </div>`;
    if(!first) {
      $("#busesTable").css('opacity', '1');
      $('#busesTable').animateCss('flipInX');
    } else {
      $('#busesTable').animateCss('zoomIn');
    }

  })
  .catch(err => console.error(err));
}

/*Envanteri listeleme*/
function listInventory() {
  let first = true;
  if($('#inventoryTable')[0]) {
    first = false;
    $('#inventoryTable').animateCss('flipOutX', function(){
      $("#inventoryTable").css('opacity', '0');
    });
  }

  let inventoryTableContent = ``;
  fetch(`/inventory`,{credentials: 'include'})
  .then(response => response.json()).then(stuffs => {
    inventoryCache = stuffs;
    for (let i in stuffs) {
      let stuff = stuffs[i];
        inventoryTableContent += `
        <tr class="staff" onclick="stuffAlert('${i}')">
          <td>${stuff.urun_no}</td>
          <td>${stuff.urun_ad}</td>
          <td>${stuff.birim_fiyat}</td>
          <td>${stuff.adet}</td>
          <td>${stuff.toplam_fiyat}</td>
          <td>${stuff.urun_kayit_tar}</td>
          <td>${stuff.firma_ad}</td>
          <td>${stuff.firma_tel}</td>
          <td>${stuff.personel[0].per_ad} ${stuff.personel[0].per_soyad}</td>
        </tr>`;
    }

    inventory.innerHTML = `
    <div class="form-group" style="margin-top:12px;">
      <a class="btn btn-primary" href="javascript:listInventory()">Envanteri Listele</a>
      <button class="btn btn-primary" data-toggle="modal" data-target="#addStuff">
        Eşya Kayıt
      </button>
    </div>
    <table class="table table-striped table-bordered table-hover" id="inventoryTable">
      <thead>
        <tr>
          <th>Ürün No.</th>
          <th>Ürün Adı</th>
          <th>Birim Fiyat</th>
          <th>Adet</th>
          <th>Toplam Fiyat</th>
          <th>Ürün Kayıt Tarihi</th>
          <th>Firma Ad</th>
          <th>Firma Tel</th>
          <th>Personel</th>
        </tr>
      </thead>
      ${inventoryTableContent}
    </table>
    `;
    if(!first) {
      $("#inventoryTable").css('opacity', '1');
      $('#inventoryTable').animateCss('flipInX');
    } else {
      $('#inventoryTable').animateCss('zoomIn');
    }

  })
  .catch(err => console.error(err));
}

/*Personelleri listeleme*/
function listStaffs() {
  let first = true;
  if($('#staffTable')[0]) {
    first = false;
    $('#staffTable').animateCss('flipOutX', function(){
      $("#staffTable").css('opacity', '0');
    });
  }

  let staffTableContent = ``;
  fetch(`/staff`,{credentials: 'include'})
  .then(response => response.json()).then(staffs => {
    staffCache = staffs;
    for (let i in staffs) {
      let staff = staffs[i];
        staffTableContent += `
        <tr class="staff" onclick="staffAlert('${i}')">
          <td>${staff.per_tc}</td>
          <td>${staff.per_ad}</td>
          <td>${staff.per_soyad}</td>
          <td>${staff.per_dog_tar}</td>
          <td>${staff.per_tel}</td>
          <td>${staff.per_maas}</td>
          <td>${staff.per_gorev}</td>
          <td>${staff.per_email}</td>
          <td>${staff.per_sigorta_no}</td>
        </tr>`;
    }

    _staffs.innerHTML = `
      <div class="form-group" style="margin-top:12px;">
        <a class="btn btn-primary" href="javascript:listStaffs()">Personelleri Listele</a>
        <button class="btn btn-primary" data-toggle="modal" data-target="#addStaff">
          <i class="fa fa-user-plus"></i> Personel Kayıt
        </button>
      </div>
      <table class="table table-bordered table-hover table-responsive table-striped" id="staffTable">
        <thead>
          <tr>
            <th>T.C</th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Doğum Tarihi</th>
            <th>Telefon</th>
            <th>Maaş</th>
            <th>Görev</th>
            <th>Eposta</th>
            <th>Sigorta No.</th>
          </tr>
        </thead>
        ${staffTableContent}
      </table>
      <div class="dropdown">
        <button
          class="btn btn-default dropdown-toggle"
          type="button"
          id="exportStaff"
          data-toggle="dropdown"
        >
          Export
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          <li><a
            download="Personeller.json"
            href="data:text/json;charset=utf-8,${JSON.stringify(staffs)}">JSON</a></li>
          <li><a href="javascript:staffToPDF()">PDF</a></li>
          <li><a href="#"></a></li>
        </ul>
      </div>
    `;

    if(!first) {
      $("#staffTable").css('opacity', '1');
      $('#staffTable').animateCss('flipInX');
    } else {
      $('#staffTable').animateCss('zoomIn');
    }
  })
  .catch(err => console.error(err));
}

/*Kullanıcıları listeleme*/
function listUsers() {
  let first = true;
  if($('#usersTable')[0]) {
    first = false;
    $('#usersTable').animateCss('flipOutX', function(){
      $("#usersTable").css('opacity', '0');
    });
  }

  let usersTableContent = ``;
  fetch(`/user`,{credentials: 'include'})
  .then(response => response.json()).then(users => {
    usersCache = users;
    for (let i in users) {
      let user = users[i];
        usersTableContent += `
        <tr class="staff" onclick="userAlert('${i}')">
          <td>${user.personel[0].per_ad} ${user.personel[0].per_soyad}</td>
          <td>${user.kullanici_adi}</td>
          <td>${user.kullanici_sifre}</td>
        </tr>`;
    }

    _users.innerHTML = `
    <div class="form-group" style="margin-top:12px;">
      <a class="btn btn-primary" href="javascript:listUsers()">Kullanıcıları Listele</a>
      <button class="btn btn-primary" data-toggle="modal" data-target="#addUser">
        <i class="fa fa-user-plus" aria-hidden="true"></i> Kullanıcı Kayıt
      </button>
    </div>
    <table class="table table-bordered table-hover table-striped" id="usersTable">
      <thead>
        <tr>
          <th>Personel</th>
          <th>Kullanıcı Adı</th>
          <th>Hash'lenmiş şifre</th>
        </tr>
      </thead>
      ${usersTableContent}
    </table>`;
    _users.innerHTML += `
    <div class="dropdown">
      <button
        class="btn btn-default dropdown-toggle"
        type="button"
        id="export"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="true">
        Export
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="export">
        <li>
          <a
            download="Kullanıcılar.json"
            href='data:text/json;charset=utf-8,${JSON.stringify(usersCache)}'>
              JSON
          </a>
        </li>
        <li><a href="javascript:usersToPDF()">PDF</a></li>
        <li><a href="#"></a></li>
      </ul>
    </div>`;

    if(!first) {
      $("#usersTable").css('opacity', '1');
      $('#usersTable').animateCss('flipInX');
    } else {
      $('#usersTable').animateCss('zoomIn');
    }

  })
  .catch(err => console.error(err));
}

/*Kullanıcı ekleme*/
function addUser() {
  let user = {
    username: document.getElementById('userName').value,
    pass: document.getElementById('userPassword').value,
    tc: document.getElementById('userStaff').value
  };
  return fetch('/user', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
  })
  .then(response => {
    $('#addUser').modal('hide');
    if(response.status < 400) {
      $.notify({
        message: `${user.username} kaydedildi.`
      },{
        type: 'success'
      });
    } else {
      $.notify({
        message: `${user.username} kaydedilemedi! HATA:(${response.status})`
      },{
        type: 'danger'
      });
    }
  })
  .catch(err => console.error(err))
}

/*Personel ekleme*/
function addStaff() {
  let staff = {
    tc: document.getElementById('staffTC').value,
    name: document.getElementById('staffName').value,
    surname: document.getElementById('staffSurname').value,
    bDay: staffBday.value,
    phone: document.getElementById('staffPhone').value,
    position: document.getElementById('staffPosition').value,
    email: document.getElementById('staffEmail').value,
    salary: document.getElementById('staffSalary').value,
    insurance: document.getElementById('staffInsurance').value,
  };
  return fetch('/staff', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(staff)
  })
  .then(response => {
    $('#addStaff').modal('hide');
    if(response.status < 400) {
      $.notify({
        message: `${staff.name} kaydedildi.`
      },{
        type: 'success'
      });
    } else {
      $.notify({
        message: `${staff.name} kaydedilemedi! HATA:(${response.status})`
      },{
        type: 'danger'
      });
    }
  })
  .catch(err => console.error(err))
}

/*Esya ekleme*/
function addStuff() {
  let stuff = {
    name: document.getElementById('stuffName').value,
    price: document.getElementById('stuffPrice').value,
    number: document.getElementById('stuffNum').value,
    compName: document.getElementById('stuffCompName').value,
    compPhone: document.getElementById('stuffCompPhone').value,
    staffTC: document.getElementById('stuffStaff').value,
  };
  return fetch('/inventory', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stuff)
  })
  .then(response => {
    $('#addStuff').modal('hide');
    if(response.status < 400) {
      $.notify({
        message: `${stuff.name} kaydedildi.`
      },{
        type: 'success'
      });
    } else {
      $.notify({
        message: `${stuff.name} kaydedilemedi! HATA:(${response.status})`
      },{
        type: 'danger'
      });
    }
  })
  .catch(err => console.error(err))
}

/*Servis ekleme*/
function addBus() {
  let bus = {
    name: document.getElementById('busName').value,
    surname: document.getElementById('busSurname').value,
    phone: document.getElementById('busPhone').value,
    path: document.getElementById('busPath').value,
    plate: document.getElementById('busPlate').value,
  };
  return fetch('/bus', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bus)
  })
  .then(response => {
    $('#addBus').modal('hide');
    if(response.status < 400) {
      $.notify({
        message: `${bus.path} kaydedildi.`
      },{
        type: 'success'
      });
    } else {
      $.notify({
        message: `${bus.path} kaydedilemedi! HATA:(${response.status})`
      },{
        type: 'danger'
      });
    }
  })
  .catch(err => console.error(err))
}

/*Butce listelemeleri*/
function listOldPays() {
  let first = true;
  if($('#paysTable')[0]) {
    first = false;
    $('#paysTable').animateCss('flipOutX', function(){
      $("#paysTable").css('opacity', '0');
    });
  }

  let paysTableContent = ``;
  fetch(`/oldpays`,{credentials: 'include'})
  .then(response => response.json()).then(pays => {
    for (let i in pays) {
      let pay = pays[i];
        paysTableContent += `
        <tr class="staff" onclick="payAlert('${i}')">
          <td>${pay.ogrenci[0].ogr_ad} ${pay.ogrenci[0].ogr_soyad}</td>
          <td>${pay.taksit_fiyat}</td>
          <td>${pay.odeme_tar}</td>
          <td>${pay.taksit_durum}</td>
        </tr>`;
    }

    _pays.innerHTML = `
    <div class="form-group" style="margin-top:12px;">
      <a class="btn btn-primary" href="javascript:listOldPays()">Ödeme Tarihi Geçmiş ve Ödenmemiş Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listPays()">Bu Ayki Ödenmemiş Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listPaid()">Bu Ayki Ödenen Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listNextPays()">Gelecek Taksitleri Listele</a>
    </div>
    <table class="table table-bordered table-hover table-striped" id="paysTable">
      <thead>
        <tr>
          <th>Öğrenci</th>
          <th>Tutar</th>
          <th>Ödeme Tarihi</th>
          <th>Durum</th>
        </tr>
      </thead>
      ${paysTableContent}
    </table>`;

    if(!first) {
      $("#paysTable").css('opacity', '1');
      $('#paysTable').animateCss('flipInX');
    } else {
      $('#paysTable').animateCss('zoomIn');
    }

  })
  .catch(err => console.error(err));
}

function listPays() {
  let first = true;
  if($('#paysTable')[0]) {
    first = false;
    $('#paysTable').animateCss('flipOutX', function(){
      $("#paysTable").css('opacity', '0');
    });
  }

  let paysTableContent = ``;
  fetch(`/newpays`,{credentials: 'include'})
  .then(response => response.json()).then(pays => {
    for (let i in pays) {
      let pay = pays[i];
        paysTableContent += `
        <tr class="staff" onclick="payAlert('${i}')">
          <td>${pay.ogrenci[0].ogr_ad} ${pay.ogrenci[0].ogr_soyad}</td>
          <td>${pay.taksit_fiyat}</td>
          <td>${pay.odeme_tar}</td>
          <td>${pay.taksit_durum}</td>
        </tr>`;
    }

    _pays.innerHTML = `
    <div class="form-group" style="margin-top:12px;">
      <a class="btn btn-primary" href="javascript:listOldPays()">Ödeme Tarihi Geçmiş ve Ödenmemiş Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listPays()">Bu Ayki Ödenmemiş Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listPaid()">Bu Ayki Ödenen Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listNextPays()">Gelecek Taksitleri Listele</a>
    </div>
    <table class="table table-bordered table-hover table-striped" id="paysTable">
      <thead>
        <tr>
          <th>Öğrenci</th>
          <th>Tutar</th>
          <th>Ödeme Tarihi</th>
          <th>Durum</th>
        </tr>
      </thead>
      ${paysTableContent}
    </table>`;

    if(!first) {
      $("#paysTable").css('opacity', '1');
      $('#paysTable').animateCss('flipInX');
    } else {
      $('#paysTable').animateCss('zoomIn');
    }

  })
  .catch(err => console.error(err));
}

function listPaid() {
  let first = true;
  if($('#paysTable')[0]) {
    first = false;
    $('#paysTable').animateCss('flipOutX', function(){
      $("#paysTable").css('opacity', '0');
    });
  }

  let paysTableContent = ``;
  fetch(`/newpaid`,{credentials: 'include'})
  .then(response => response.json()).then(pays => {
    for (let i in pays) {
      let pay = pays[i];
        paysTableContent += `
        <tr class="staff">
          <td>${pay.ogrenci[0].ogr_ad} ${pay.ogrenci[0].ogr_soyad}</td>
          <td>${pay.taksit_fiyat}</td>
          <td>${pay.odeme_tar}</td>
          <td>${pay.taksit_durum}</td>
        </tr>`;
    }

    _pays.innerHTML = `
    <div class="form-group" style="margin-top:12px;">
      <a class="btn btn-primary" href="javascript:listOldPays()">Ödeme Tarihi Geçmiş ve Ödenmemiş Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listPays()">Bu Ayki Ödenmemiş Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listPaid()">Bu Ayki Ödenen Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listNextPays()">Gelecek Taksitleri Listele</a>
    </div>
    <table class="table table-bordered table-hover table-striped" id="paysTable">
      <thead>
        <tr>
          <th>Öğrenci</th>
          <th>Tutar</th>
          <th>Ödeme Tarihi</th>
          <th>Durum</th>
        </tr>
      </thead>
      ${paysTableContent}
    </table>`;

    if(!first) {
      $("#paysTable").css('opacity', '1');
      $('#paysTable').animateCss('flipInX');
    } else {
      $('#paysTable').animateCss('zoomIn');
    }

  })
  .catch(err => console.error(err));
}

function listNextPays() {
  let first = true;
  if($('#paysTable')[0]) {
    first = false;
    $('#paysTable').animateCss('flipOutX', function(){
      $("#paysTable").css('opacity', '0');
    });
  }

  let paysTableContent = ``;
  fetch(`/nextpays`,{credentials: 'include'})
  .then(response => response.json()).then(pays => {
    paysCache = pays;
    for (let i in pays) {
      let pay = pays[i];
        paysTableContent += `
        <tr class="staff" onclick="payAlert('${i}')">
          <td>${pay.ogrenci[0].ogr_ad} ${pay.ogrenci[0].ogr_soyad}</td>
          <td>${pay.taksit_fiyat}</td>
          <td>${pay.odeme_tar}</td>
          <td>${pay.taksit_durum}</td>
        </tr>`;
    }

    _pays.innerHTML = `
    <div class="form-group" style="margin-top:12px;">
      <a class="btn btn-primary" href="javascript:listOldPays()">Ödeme Tarihi Geçmiş ve Ödenmemiş Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listPays()">Bu Ayki Ödenmemiş Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listPaid()">Bu Ayki Ödenen Taksitleri Listele</a>
      <a class="btn btn-primary" href="javascript:listNextPays()">Gelecek Taksitleri Listele</a>
    </div>
    <table class="table table-bordered table-hover table-striped" id="paysTable">
      <thead>
        <tr>
          <th>Öğrenci</th>
          <th>Tutar</th>
          <th>Ödeme Tarihi</th>
          <th>Durum</th>
        </tr>
      </thead>
      ${paysTableContent}
    </table>`;

    if(!first) {
      $("#paysTable").css('opacity', '1');
      $('#paysTable').animateCss('flipInX');
    } else {
      $('#paysTable').animateCss('zoomIn');
    }
  })
  .catch(err => console.error(err));
}

function payAlert(i) {
  let pay = paysCache[i];
  swal({
    title: `${pay.ogrenci[0].ogr_ad} ${pay.ogrenci[0].ogr_soyad} ${pay.odeme_tar}`,
    showConfirmButton: true,
    showCancelButton: false,
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ödendi'
  }).then((result) => {
    if (result.value) {
      return fetch(`/pay/${pay.ogrenci[0].ogr_tc}/${pay.odeme_tar}`, {
          method: 'PATCH',
          credentials: 'include',
      })
      .then(response => {
        if(response.status < 400) {
          $.notify({
            message: `Ödendi.`
          },{
            type: 'success'
          });
        } else {
          $.notify({
            message: `Ödenemedi! HATA:(${response.status})`
          },{
            type: 'danger'
          });
        }
      })
      .catch(err => console.error(err));
  }
  })
}

function getBackup() {
  fetch(`/getbackup`,{credentials: 'include'})
  .then(response => {
    if(response.status < 400) {
      $.notify({
        message: `Yedek kaydedildi.`
      },{
        type: 'success'
      });
    } else {
      $.notify({
        message: `Yedek kaydedilemedi.`
      },{
        type: 'danger'
      });
    }
  });
}

function restoreBackup() {
  fetch(`/restorebackup`,{credentials: 'include'})
  .then(response => {
    if(response.status < 400) {
      $.notify({
        message: `Yedekden geri dönüldü.`
      },{
        type: 'success'
      });
    } else {
      $.notify({
        message: `Yedekden geri dönülemedi.`
      },{
        type: 'danger'
      });
    }
  });
}

/*PDF CIKTILARI*/
function staffToPDF() {
    let staffs = document.getElementById('staffTable');
    staffs.style.fontFamily = 'Helvetica,Arial,sans-serif';
    html2pdf(
      staffs,
      {
        margin:4,
        filename:'Personeller.pdf',
        html2canvas:{ dpi: 192 },
        jsPDF:{ orientation: 'landscape' }
      }
    );
    staffs.style.fontFamily = '';
}
function studentsToPDF() {
    let students = document.getElementById('studentTable');
    students.style.fontFamily = 'Helvetica,Arial,sans-serif';
    html2pdf(
      students,
      {
        margin:4,
        filename:`${classToList.value}.pdf`,
        html2canvas:{ dpi: 192 },
      }
    );
    students.style.fontFamily = '';
}

function usersToPDF() {
    let users = document.getElementById('usersTable');
    users.style.fontFamily = 'Helvetica,Arial,sans-serif';
    html2pdf(
      users,
      {
        margin:4,
        filename:`Kullanıcılar.pdf`,
        html2canvas:{ dpi: 192 },
      }
    );
    users.style.fontFamily = '';
}

function busesToPDF() {
    let buses = document.getElementById('busesTable');
    buses.style.fontFamily = 'Helvetica,Arial,sans-serif';
    html2pdf(
      buses,
      {
        margin:4,
        filename:`Servisler.pdf`,
        html2canvas:{ dpi: 192 },
      }
    );
    buses.style.fontFamily = '';
}

/*Cikis Yapma*/
function logout() {
  document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  location.reload();
}

let myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    datasets: [{
        label: '# Giderler',
        data: [_sum,_sum,_sum,_sum,_sum,_sum,_sum,_sum,_sum,_sum,_sum,_sum],
        backgroundColor: 'rgba(211,47,47,.5)',
        borderColor: 'rgba(211,47,47,.5)',
        fill:false
    },
    {
        label: '# Gelirler',
        data: [55000,65000,76000,64000,59000,44000,37000,45000,58000,62000,64000,69000],
        backgroundColor: 'rgba(67,160,71,.5)',
        borderColor: 'rgba(67,160,71,.5)',
        fill:false
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: { beginAtZero:true }
      }]
    }
  }
});
