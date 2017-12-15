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
    for (let i in students) {
      let student = students[i];
      if(student.ogr_ad)
        studentTableContent += `
        <tr class="student" data-toggle="collapse" data-target="#${student.ogr_ad}">
          <td>${student.ogr_ad}</td>
          <td>${student.ogr_soyad}</td>
          <td>${student.ogr_tc}</td>
          <td>${student.ogr_dog_tar}</td>
          <td>${student.ogr_cins}</td>
        </tr><tr id="${student.ogr_ad}" class="collapse"><td>${student.ogr_ad}</td></tr>`;
    }
    studentList.innerHTML = `
    <table>
      <tr>
        <th>Ad</th>
        <th>Soyad</th>
        <th>T.C</th>
        <th>Doğum Tarihi</th>
        <th>Cinsiyet</th>
      </tr>
      ${studentTableContent}
    </table>
    `;
  });
}

/*Cikis Yapma*/
function logout() {
  document.cookie = 'username=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  location.reload();
}
