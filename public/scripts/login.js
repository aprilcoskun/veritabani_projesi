/*Hatayi gizle eger acik kaldiysa*/
hideErr();

/*HTML'den formu bulup formu gonderme eventini yakala*/
document.getElementById('signin-form').onsubmit = event => {
  /*normal form olarak calismasini engele*/
  event.preventDefault();
  /*
  Login olmayi dene
  (parametre olarak yollanan nesnede html'den alinmis kullanici adi ve sifre degerleri var)
  */
  attemptLogin({
     username: document.getElementById('username').value,
     pass: document.getElementById('password').value
   });
}

/*Giris Yapmayi Dene*/
 function attemptLogin(data) {
  /*Animasyon*/
  document.getElementById('wrapper').className = 'wrapper animated fadeOutRightBig';
  /*Hata gizle eger acik kaldiysa*/
  hideErr();
  /*Api'ye istek yolla*/
  return fetch('/auth', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username:data.username, password:data.pass})
  })
  .then(async (response) => {
    /*Gelen cevabi kontrol et(eger hatali islem yapildi ise http kodu 400'un ustundedir)*/
    if(400 <= response.status) throw response.status;
    else {
      data = await response.json(); //Burada async/await kullandik cunku eger apiden cevap gelmeden bu islem yapilirsa bos degere esitler ve buyuk sicariz
      document.cookie = 'username=' + data.username + ';'
      window.location.href = '/';
    }
  })
  .catch(err => showErr(err));/*Bu islemlerde hata olursa yakala ve hatayi goster*/
}

/*Hatayi Gosterme Fonksiyonu*/
function showErr(code) {
  /*Animasyon*/
  document.getElementById('wrapper').className = 'wrapper animated fadeInRightBig';

  /*HTML'deki hata div'ini bul*/
  let errAlert = document.getElementById('err');
  /*Hata koduna gore farkli hatayi yazdir(innerHTML ile div'in icine)*/
  if (code === 401)
    errAlert.innerHTML = '<a href="javascript:hideErr()" class="close" aria-label="close">&tim'+
      'es;</a><strong>Error!</strong> Yanlış Şifre!'+
      '<img src="/400.gif" width="270" height="103" id="ticket" alt="Your Ticket">'
  else if (code === 404)
    errAlert.innerHTML = '<a href="javascript:hideErr()" class="close" aria-label="close">&tim'+
      'es;</a><strong>Error!</strong> Kullanıcı Bulunamadı!'+
      '<img src="/400.gif" width="270" height="103" id="ticket" alt="Your Ticket">'
  else if (code === 500)
    errAlert.innerHTML = '<a href="javascript:hideErr()" class="close" aria-label="close">&tim'+
    'es;</a><strong>Error!</strong> Server Bozuldu!'+
    '<img src="/400.gif" width="270" height="103" id="ticket" alt="Your Ticket">'
  else if(code === undefined || code === 0)
    return false
  else
    errAlert.innerHTML = '<a href="javascript:hideErr()" class="close" aria-label="close">&tim'+
      'es;</a><strong>Unknown Error!</strong> ' + code
  /*hata div'ini gorunur yap(css ile)*/
  errAlert.style.visibility = 'visible'
}

/*Hata gizleme Fonksiyonu*/
function hideErr() {
  /*HTML'den hata div'ini bulup gorunmez yap(css ile)*/
  document.getElementById('err').style.visibility = 'hidden'
}
