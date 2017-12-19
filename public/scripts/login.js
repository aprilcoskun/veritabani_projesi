hideErr();
let signinForm = document.getElementById('signin-form');
let usernameArea = document.getElementById('username');
let passArea  = document.getElementById('password');
/*Submit yapinca*/
signinForm.onsubmit = e => {
  e.preventDefault();
  attemptLogin({ username: usernameArea.value, pass: passArea.value });
}

/*Giris Yapmayi Dene*/
function attemptLogin(data) {
  document.getElementById('wrapper').className = 'wrapper animated fadeOutRightBig';
  hideErr();
  return fetch('/auth', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username:data.username, password:data.pass})
  })
  .then(response => {
    if(400 <= response.status) throw response.status;
    else return response.json();
  })
  .then(data => {
      document.cookie = 'username=' + data.username + ';'
      window.location.href = '/';
  })
  .catch(err => showErr(err));
}

function showErr(code) {
  document.getElementById('wrapper').className = 'wrapper animated fadeInRightBig';

  let errAlert = document.getElementById('err');

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

  errAlert.style.visibility = 'visible'
}

function hideErr() {
  document.getElementById('err').style.visibility = 'hidden'
}
