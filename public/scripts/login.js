hideErr();
let signinForm = document.getElementById('signin-form');
let usernameArea = document.getElementById('username');
let passArea  = document.getElementById('password');
signinForm.onsubmit = e => {
  e.preventDefault();
  let data = {};
  data.username = usernameArea.value;
  data.pass = passArea.value;
  attemptLogin(data);
}

function attemptLogin(data) {
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
    if(400 <= response.status) return response.status;
    else return response.json();
  })
  .then(data => {
    if(typeof data == 'number')
      showErr(data);
    else {
      document.cookie = 'username=' + data.username + ';'
      window.location.href = '/';
    }
  });
}

function showErr(code) {
  let errAlert = document.getElementById('err')
  if (code === 409)
    errAlert.innerHTML = '<a href="javascript:hideErr()" class="close" aria-label="close">&tim'+
      'es;</a><strong>Error!</strong> This email address is already in use!'
  else if (code === 401)
    errAlert.innerHTML = '<a href="javascript:hideErr()" class="close" aria-label="close">&tim'+
      'es;</a><strong>Error!</strong> Invalid Password!'
  else if (code === 404)
    errAlert.innerHTML = '<a href="javascript:hideErr()" class="close" aria-label="close">&tim'+
      'es;</a><strong>Error!</strong> User not found!'
  else if (code === 500)
    errAlert.innerHTML = '<a href="javascript:hideErr()" class="close" aria-label="close">&tim'+
    'es;</a><strong>Error!</strong> Server Fucked Up!'
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
