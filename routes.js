const express = require('express');
const router = express.Router();
const sql = require('mssql');
const login = require('./functions/login');
router.get('/', async (req, res) => {
  try {
    const mainPageData = await sql.query`exec sp_anasayfa`;
    const classes = await JSON.parse(first(mainPageData.recordsets[0][0]));
    const staffs = await JSON.parse(first(mainPageData.recordsets[1][0]));
    const schoolBuses = await JSON.parse(first(mainPageData.recordsets[2][0]));
    res.render('index', {
      Admin:false,
      Classes:classes,
      Staffs:staffs,
      SchoolBuses:schoolBuses,
      helpers: {
              ifEquals: function(arg1, arg2, options) {
                  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
              }
          }
    });
  } catch (err) {
    console.error(err);
  }
});

router.get('/auth', async(req, res) => {
  res.render('login');
});

router.post('/auth', async(req, res) => {
  login.attempt(req.body.username,req.body.password)
  .then(data => res.status(data.status).json({username:req.body.username}))
  .catch(err => console.error(err));
});

function first(obj) {
    for (let a in obj) return obj[a];
}

module.exports = router;
