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
let studentExtraPhone = document.getElementById('studentExtraPhone');
let studentExtraState = document.getElementById('studentExtraState');
let studentPrice = document.getElementById('studentPrice');
let studentAdvancePayment = document.getElementById('studentAdvancePayment');
let studentPayNum = document.getElementById('studentPayNum');
let studentPayUnitPrice = document.getElementById('studentPayUnitPrice');
let studentExtraName = document.getElementById('studentExtraName');
let studentExtraSurname = document.getElementById('studentExtraSurname');
let studentExtraPhysical = document.getElementById('studentExtraPhysical');
let studentExtraAllergic = document.getElementById('studentExtraAllergic');
let classToList = document.getElementById('classToList');
let studentsCache = [];
/*DOGUM TARIHI SINIRLARI(2-6 YAS)*/
let minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 6)).toJSON().split('T')[0];
let maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toJSON().split('T')[0];

studentBday.setAttribute('min', minDate);
studentBday.setAttribute('max', maxDate);

studentBday.setAttribute('value', maxDate);

listStudents();

/*Birim Taksit Hesabi*/
function calUnitPrice() {
  /*max 5 hane kontrolu*/
  if (studentPrice.value.length > 5)
      studentPrice.value = ogrFiyat.value.slice(0,5);
  if (studentAdvancePayment.value.length > 5)
      studentAdvancePayment.value = studentAdvancePayment.value.slice(0,5);
  /*Hesap*/
  let price = studentPrice.value;
  let advancePayment = studentAdvancePayment.value;
  let unitSize = studentPayNum.value;
  if(price && advancePayment && unitSize && price > advancePayment)
    studentPayUnitPrice.value = Math.round(((price - advancePayment)/unitSize) * 100) / 100;
  else
    studentPayUnitPrice.value = null;
}

/*Ogrenci ekleme*/
function addStudent() {
 let bDay = new Date(studentBday.value).toISOString().slice(0, 10).replace('T', ' ');
}

/*Ogrenci listeleme*/
function listStudents() {
  let studentList = document.getElementById('studentList');
  let studentTableContent = ``;
  fetch(`/student/${classToList.options[classToList.selectedIndex].value}`,{credentials: 'include'})
  .then((response) => {
    return response.json();
  }).then(students => {
    studentsCache = students;
    for (let i in students) {
      let student = students[i];
      if(student.ogr_ad)
        studentTableContent += `
        <tr class="student" onclick="studentDetail('${i}')">
          <td class="class="col-md-2">${student.ogr_ad}</td>
          <td class="class="col-md-2">${student.ogr_soyad}</td>
          <td class="class="col-md-2">${student.ogr_tc}</td>
        </tr>`;
    }
    studentList.innerHTML = `
    <table class="table">
      <tr>
        <th class="class="col-md-2">Ad</th>
        <th class="class="col-md-2">Soyad</th>
        <th class="class="col-md-2">T.C</th>
      </tr>
      ${studentTableContent}
    </table>
    `;
  });
}

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

/*Cikis Yapma*/
function logout() {
  document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  location.reload();
}
