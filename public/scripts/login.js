let signinForm = document.getElementById('signin-form');
let usernameArea = document.getElementById('username');
let passArea  = document.getElementById('password');
signinForm.onsubmit = e => {
  e.preventDefault();
  let data = {};
  data.username = usernameArea.value;
  data.pass = passArea.value;
  window.location.href = '/';
  /*attemptLogin(data)
  .then(response => {
    let data = JSON.parse(response);
    document.cookie = 'token=' + data.token + ';'
    document.cookie = 'email=' + data.email + ';'
    window.location.href = '/';
  });*/
}

function attemptLogin(data) {
  return fetch();
}
