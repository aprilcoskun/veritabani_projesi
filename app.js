/*KUTUPHANELER*/
const express = require('express');
const exphbs = require('express-handlebars');
const parser = require('body-parser');
const path = require('path');
const http = require('http');
const config = require('./config/default.json');
/*GEREKLI DEGER ATAMALARI*/
const PORT = 3000;
const app = express();
const router = express.Router();
const server = http.createServer(app);

/*HANDLEBARS KURULUMU*/
app.engine('hbs', exphbs({
  defaultLayout: "layout",
  extname:'.hbs',
  layoutsDir: `${__dirname}/views`
}));
app.set('view engine', 'hbs');

/*STATIC DOSYALARIN(CSS, FOTOLAR) KURULUMU*/
app.use(express.static(path.join(__dirname, 'public')));

/*MORGAN(LOGLAMA KUTUPHANESI) KURULUMU*/
if (process.env.NODE_ENV !== 'production')
  app.use(require('morgan')('dev'));

/*HTTP BODY'SININ JSON OLARAK BELIRLENMESI*/
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

/*SERVER'IN 3000 PORTUNU DINLEMESI*/
server.listen(PORT, () => {
    console.log(`Listening on localhost:${PORT}`);
});

app.get('/lp', (req, res) => {
  res.render('index',{deger:'sex',Admin:false});
});
