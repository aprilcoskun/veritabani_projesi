/*KUTUPHANELER*/
const router = require('express').Router();
const sql = require('mssql');

/*FONKSIYONLAR*/
const login = require('./functions/login');

const addBus = require('./functions/addBus');
const addStaff = require('./functions/addStaff');
const addStudent = require('./functions/addStudent');
const addStuff = require('./functions/addStuff');
const addUser = require('./functions/addUser');

const deleteBus = require('./functions/deleteBus');
const deleteStaff = require('./functions/deleteStaff');
const deleteStudent = require('./functions/deleteStudent');
const deleteStuff = require('./functions/deleteStuff');
const deleteUser = require('./functions/deleteUser');

const listBuses = require('./functions/listBuses');
const listInventory = require('./functions/listInventory');
const listStaffs = require('./functions/listStaffs');
const listStudents = require('./functions/listStudents');
const listUsers = require('./functions/listUsers');

/*Anasayfayi getirme*/
router.get('/', async (req, res) => {
  try {
    const mainPageData = await sql.query`exec sp_anasayfa`;
    res.render('index', {
      Admin:req.cookies.username == 'admin',
      Classes:mainPageData.recordsets[0][0],
      Staffs:mainPageData.recordsets[1][0],
      SchoolBuses:mainPageData.recordsets[2][0],
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

/*API ISTEKLERINI YONLENDIRME*/

/*Login Sayfasini getirme*/
router.get('/auth', async(req, res) => {
  res.render('login');
});

/*Login islemi*/
router.post('/auth', async(req, res) => {
  login.attempt(req.body.username,req.body.password)
  .then(data => res.status(data.status).json({username:req.body.username}))
  .catch(err => console.error(err));
});

/*Kullanicilari getirme*/
router.get('/user', async(req, res) => {
  listUsers.attempt()
  .then(data => res.status(200).json(data))
  .catch(err => console.error(err));
});

/*Kullanici ekleme*/
router.post('/user', (req, res) => {
  addUser.attempt(req.body)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

/*Kullanici silme*/
router.delete('/user/:tc', (req, res) => {
  deleteUser.attempt(req.params.tc)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

/*Personelleri listeleme*/
router.get('/staff', (req, res) => {
  listStaffs.attempt()
  .then(data => res.status(200).json(data))
  .catch(err => console.error(err));
});

/*Personel ekleme*/
router.post('/staff', (req, res) => {
  addStaff.attempt(req.body)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

/*Personel silme*/
router.delete('/staff/:tc', (req, res) => {
  deleteStaff.attempt(req.params.tc)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

/*Envanteri listeleme*/
router.get('/inventory', (req, res) => {
  listInventory.attempt()
  .then(data => res.status(200).json(data))
  .catch(err => console.error(err));
});

/*Esya ekleme*/
router.post('/inventory', (req, res) => {
  addStuff.attempt(req.body)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

/*Esya silme*/
router.delete('/inventory/:no', (req, res) => {
  deleteStuff.attempt(req.params.no)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

/*Sinifa gore ogrencileri listele*/
router.get('/student/:class', (req, res) => {
  listStudents.attempt(req.params.class)
  .then(data => res.status(200).json(data))
  .catch(err => console.error(err));
});

/*Ogrenci ekleme*/
router.post('/student', (req, res) => {
  addStudent.attempt(req.body)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

/*Ogrenci silme*/
router.delete('/student/:tc', (req, res) => {
  deleteStudent.attempt(req.params.tc)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

/*Servisleri listeleme*/
router.get('/bus', (req, res) => {
  listBuses.attempt()
  .then(data => res.status(200).json(data))
  .catch(err => console.error(err));
});

/*Servis ekleme*/
router.post('/bus', (req, res) => {
  addBus.attempt(req.body)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

/*Servis silme*/
router.delete('/bus/:plate', (req, res) => {
  deleteBus.attempt(req.params.plate)
  .then(data => res.status(data.status).send())
  .catch(err => console.error(err));
});

module.exports = router;
