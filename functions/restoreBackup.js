const sql = require('mssql');

exports.attempt = async () =>
  new sql.ConnectionPool({
    "server"  : "52.164.200.179",
    "user": "SA",
    "password": "anaokulu_123",
    "database": "master",
  }).connect().then(pool => {
    return pool.query`exec sp_yedekten_geri_yukle`;
  }).then(result => {return {status:200}}).catch(err => {
    console.error(err);
    return {status:err.number ? err.number : 500};
  });
