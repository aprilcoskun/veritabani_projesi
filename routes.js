const express = require('express');
const router = express.Router();
const sql = require('mssql');
const login = require('./functions/login');
const addStudent = require('./functions/addStudent');
const listStudents = require('./functions/listStudents');

router.get('/', async (req, res) => {
  try {
    const mainPageData = await sql.query`exec sp_anasayfa`;
    const classes = await JSON.parse(first(mainPageData.recordsets[0][0]));
    const staffs = await JSON.parse(first(mainPageData.recordsets[1][0]));
    const schoolBuses = await JSON.parse(first(mainPageData.recordsets[2][0]));

    res.render('index', {
      Admin:req.cookies.username == 'admin',
      Classes:classes,
      Staffs:staffs,
      SchoolBuses:schoolBuses,
      helpers: {
              ifEquals: function(arg1, arg2, options) {
                  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
              },
              json: function(context) {
                return JSON.stringify(context);
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

router.post('/student', (req, res) => {
  addStudent.attempt(req.body)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

router.get('/student/:class', (req, res) => {
  listStudents.attempt(req.params.class)
  .then(data => res.status(200).json(data))
  .catch(err => console.error(err))
});

function first(obj) {
    for (let a in obj) return obj[a];
}

module.exports = router;
