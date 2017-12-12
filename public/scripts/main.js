/*DOGUM TARIHI SINIRLARI(2-6 YAS)*/
let minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 6)).toJSON().split('T')[0];
let maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toJSON().split('T')[0];
document.getElementById('studentBday').setAttribute('min', minDate);
document.getElementById('studentBday').setAttribute('max', maxDate);

/*Birim Taksit Hesabi*/
function calUnitPrice() {
  /*max 5 hane kontrolu*/
  if (document.getElementById('studentPrice').value.length > 5)
      document.getElementById('studentPrice').value = document.getElementById('studentPrice').value.slice(0,5);
  if (document.getElementById('studentAdvancePayment').value.length > 5)
      document.getElementById('studentAdvancePayment').value = document.getElementById('studentAdvancePayment').value.slice(0,5);
  /*Hesap*/
  let price = document.getElementById('studentPrice').value;
  let advancePayment = document.getElementById('studentAdvancePayment').value;
  let unitSize = document.getElementById('studentPayNum').value;
  if(price && advancePayment && unitSize && price > advancePayment)
    document.getElementById('studentPayUnitPrice').value = Math.round(((price - advancePayment)/unitSize) * 100) / 100;
  else
    document.getElementById('studentPayUnitPrice').value = null;

}//sex
