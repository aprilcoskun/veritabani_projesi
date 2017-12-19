/*KUTUPHANELER*/
const express = require('express');
const exphbs = require('express-handlebars');
const parser = require('body-parser');
const path = require('path');
const http = require('http');
const config = require('./config/default.json');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
//SQL BAGLANTISI
require('mssql').connect(config.connection);

/*GEREKLI DEGER ATAMALARI*/
const PORT = 3000;
const app = express();
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
if (process.env.NODE_ENV !== 'production') {
  morgan.token('response-time', function (req, res) {
  if (!req._startAt || !res._startAt) return

  let sec = (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6

  return (sec / 1000).toFixed(3);
});

  morgan.token('res', function getResponseHeader (req, res, field) {
    let newHeader = res.header()._headers;
    if (field == 'content-length' && res.header()._headers['content-length'])
      newHeader['content-length'] =
      (Number(newHeader['content-length']) / 1024).toFixed(2) + ' Kilobytes';

    if (!res.headersSent) return undefined;

    let header = newHeader[field];
    return Array.isArray(header)
    ? header.join(', ')
    : header
  });

app.use(morgan('dev'));
}

/*HTTP BODY'SININ JSON OLARAK BELIRLENMESI VE CEREZLERIN CEKILMESI*/
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(cookieParser());

//Auth Middleware
app.all('*',(req,res, next) => {
  let username = req.cookies.username;
  if(req.url === '/auth') {
    if(username) res.redirect('/');
    else return next();
  } else if(username) return next();
  else return res.redirect('/auth');
});

/*HTTP ISLEMLERININ YAPILDIGI ROUTER*/
app.use('/', routes);

/*SERVER'IN 3000 PORTUNU DINLEMESI*/
server.listen(PORT, async () => {
    console.log(`Listening on localhost:${PORT}`);
});
