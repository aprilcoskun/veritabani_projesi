const express = require('express');
const router = express.Router();
const sql = require('mssql');
const login = require('./functions/login');
const addBus = require('./functions/addBus');
const addStudent = require('./functions/addStudent');
const addUser = require('./functions/addUser');
const addStaff = require('./functions/addStaff');
const addStuff = require('./functions/addStuff');

const listStudents = require('./functions/listStudents');
const listBuses = require('./functions/listBuses');
const listInventory = require('./functions/listInventory');

router.get('/', async (req, res) => {
  try {
    const mainPageData = await sql.query`exec sp_anasayfa`;
    const classes = mainPageData.recordsets[0][0];
    const staffs = mainPageData.recordsets[1][0];
    const schoolBuses = mainPageData.recordsets[2][0];
    const users = mainPageData.recordsets[3][0];
    res.render('index', {
      Admin:req.cookies.username == 'admin',
      Classes:classes,
      Staffs:staffs,
      SchoolBuses:schoolBuses,
      users:users,
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

router.post('/user', (req, res) => {
  addUser.attempt(req.body)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

router.post('/staff', (req, res) => {
  addStaff.attempt(req.body)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

router.post('/inventory', (req, res) => {
  addStuff.attempt(req.body)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});


router.post('/student', (req, res) => {
  addStudent.attempt(req.body)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

router.post('/bus', (req, res) => {
  addBus.attempt(req.body)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

router.get('/student/:class', (req, res) => {
  listStudents.attempt(req.params.class)
  .then(data => res.status(200).json(data))
  .catch(err => console.error(err))
});

router.get('/bus', (req, res) => {
  listBuses.attempt()
  .then(data => res.status(200).json(data))
  .catch(err => console.error(err))
});

router.get('/inventory', (req, res) => {
  listInventory.attempt()
  .then(data => res.status(200).json(data))
  .catch(err => console.error(err))
});

module.exports = router;
