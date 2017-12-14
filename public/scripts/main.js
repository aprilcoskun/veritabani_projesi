let studentTC = document.getElementById('studentTC');
let studentName = document.getElementById('studentName');
let studentSurname = document.getElementById('studentSurname');
let studentBday = document.getElementById('studentBday');
//cinsiyet?
let studentAddress = document.getElementById('studentAddress');
let studentStaff = document.getElementById('studentStaff');
let studentSchoolBus = document.getElementById('studentSchoolBus');
let studentClass = document.getElementById('studentClass');
let studentParentName = document.getElementById('studentParentName');
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

/*DOGUM TARIHI SINIRLARI(2-6 YAS)*/
let minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 6)).toJSON().split('T')[0];
let maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toJSON().split('T')[0];
studentBday.setAttribute('min', minDate);
studentBday.setAttribute('max', maxDate);

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

}
