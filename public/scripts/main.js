let studentTC = document.getElementById('studentTC');
let studentName = document.getElementById('studentName');
let studentSurname = document.getElementById('studentSurname');
let studentBday = document.getElementById('studentBday');
//cinsiyet?
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
let studentsCache = [];
let studentList = document.getElementById('studentList');
listStudents();

/*DOGUM TARIHI SINIRLARI(2-6 YAS)*/
let minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 6)).toJSON().split('T')[0];
let maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toJSON().split('T')[0];

studentBday.setAttribute('min', minDate);
studentBday.setAttribute('max', maxDate);

studentBday.setAttribute('value', maxDate);

/*Birim Taksit Hesabi*/
function calUnitPrice() {
  /*max 5 hane kontrolu*/
  if (studentPrice.value.length > 5)
      studentPrice.value = studentPrice.value.slice(0,5);
  if (studentAdvancePayment.value.length > 5)
      studentAdvancePayment.value = studentAdvancePayment.value.slice(0,5);
  /*Hesap*/
  let price = parseInt(studentPrice.value);
  let advancePayment = parseInt(studentAdvancePayment.value);
  let unitSize = parseInt(studentPayNum.value);
  if(price && advancePayment && unitSize && price > advancePayment)
    studentPayUnitPrice.value = Math.round(((price - advancePayment)/unitSize) * 100) / 100;
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
  student.sClass = studentClass.options[studentClass.selectedIndex].value;
  student.bus = studentSchoolBus.options[studentSchoolBus.selectedIndex].value == 'none' ?
   null : studentSchoolBus.value;
  student.parentName = studentParentName.value;
  student.parentSurname = studentParentSurname.value;
  student.parentPhone = studentParentPhone.value;
  student.parentJob = studentParentJob.value;
  student.price = studentPrice.value;
  student.advancePayment = studentAdvancePayment.value;
  student.payNum = studentPayNum.options[studentPayNum.selectedIndex].value;
  student.payUnitPrice = studentPayUnitPrice.value;
  student.extraName = studentExtraName.value;
  student.extraSurname = studentExtraSurname.value;
  student.extraPhone = studentExtraPhone.value;
  student.extraState = studentExtraState.value;
  student.extraPhysical = studentExtraPhysical.value;
  student.extraAllergic = studentExtraAllergic.value;
  console.log(student);
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
  let studentTableContent = ``;
  fetch(`/student/${classToList.value}`,{credentials: 'include'})
  .then(response => response.json()).then(students => {
    studentsCache = students;
    for (let i in students) {
      let student = students[i];
      if(student.ogr_durum == 'Aktif')
        studentTableContent += `
        <tr class="student" onclick="studentDetail('${i}')" ondblclick="studentAlert('${i}')">
          <td class="class="col-md-2">${student.ogr_ad}</td>
          <td class="class="col-md-2">${student.ogr_soyad}</td>
          <td class="class="col-md-2">${student.ogr_tc}</td>
        </tr>`;
    }
    studentList.innerHTML = `
    <table class="table table-striped table-bordered table-hover" id="studentTable">
      <thead>
        <tr>
          <th class="class="col-md-2">Ad</th>
          <th class="class="col-md-2">Soyad</th>
          <th class="class="col-md-2">T.C</th>
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
  })
  .catch(err => console.error(err));
}

function studentAlert(i) {
  let student = studentsCache[i];
  console.log(student);
}

/*OGRENCI DETAY*/
function studentDetail(i) {
  let studentDetail = document.getElementById('studentDetail');
  let student = studentsCache[i];
  let parent = student.ebeveyn[0];
  studentDetail.innerHTML = `
    <h4>Öğrenci Detayı</h4>
    <label class="col-sm-4 control-label">Öğrenci Adı:</label>
    <p class="col-sm-6">${student.ogr_ad}</p>
    <label class="col-sm-4 control-label">Öğrenci Soyadı:</label>
    <p class="col-sm-6">${student.ogr_soyad}</p>
    <label class="col-sm-4 control-label">Öğrenci T.C:</label>
    <p class="col-sm-6">${student.ogr_tc}</p>
    <label class="col-sm-4 control-label">Öğrenci Cinsiyeti:</label>
    <p class="col-sm-6">${student.ogr_cins == 'E' ? 'Erkek' : 'Kız'}</p>
    <label class="col-sm-4 control-label">Öğrenci Adresi:</label>
    <p class="col-sm-6">${student.ogr_adres}</p>
    <label class="col-sm-4 control-label">Öğrenci Doğum Tarihi:</label>
    <p class="col-sm-6">${student.ogr_dog_tar}</p>
    <label class="col-sm-4 control-label">Öğrenci Yaş Grubu:</label>
    <p class="col-sm-6">${student.ogr_yas_grup}</p>
    <label class="col-sm-4 control-label">Öğrenci Kayıt Tarihi:</label>
    <p class="col-sm-6">${student.ogr_adres}</p>
    <label class="col-sm-4 control-label">Veli Adı:</label>
    <p class="col-sm-6">${parent.veli_ad}</p>
    <label class="col-sm-4 control-label">Veli Soyadı:</label>
    <p class="col-sm-6">${parent.veli_soyad}</p>
    <label class="col-sm-4 control-label">Veli Telefonu:</label>
    <p class="col-sm-6">${parent.veli_tel}</p>
    <label class="col-sm-4 control-label">Veli Mesleği:</label>
    <p class="col-sm-6">${parent.veli_meslek}</p>
    <label class="col-sm-6 control-label">Öğrencinin Kayıtlı Olduğu Servis:</label>
    <p class="col-sm-6">${student.plaka ? student.plaka : 'Servis Kullanmıyor'}</p>
  `;
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
        filename:`${classToList.options[classToList.selectedIndex].value}.pdf`,
        html2canvas:{ dpi: 192 },
      }
    );
    students.style.fontFamily = '';
}

/*Cikis Yapma*/
function logout() {
  document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  location.reload();
}
