const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const spdy = require('spdy');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const http2Options = {
  cert: fs.readFileSync(path.join(__dirname, '/localhost-cert.pem')),
  key: fs.readFileSync(path.join(__dirname, '/localhost-privkey.pem')),
};

app.use(helmet());
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css/')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js/')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.disable('x-powered-by');

const nav = [{
  title: 'Books',
  link: '/books',
}, {
  title: 'Authors',
  link: '/authors',
}, {
  title: 'Macaroni',
  link: '/pets',
}];
const bookRouter = require('./src/routes/books.route')(nav);

app.use((req, res, next) => {
  next();
});
app.use('/books', bookRouter);
app.get('/processing', (req, res) => {
  res.set({
    'Content-Type': 'application/html',
    Location: '/books',
    'Content-length': 0,
    Expires: 0,
  });
  res.status(302).end();
});
app.get('/', (req, res) => {
  req.headers['x-timestamp'] = Date.now();
  res.render('index', {
    title: 'Cheese App',
    nav,
  });
});
app.post('/', (req, res) => {
  res.set({
    Location: '/processing',
    Refresh: '0; url=/processing',
    'Content-length': 0,
    'last-modified': Date.now(),
  });
  res.status(201).end();
});

spdy
  .createServer(http2Options, app)
  .listen(port, (error) => {
    if (error) {
      debug(chalk.red(error));
      process.exit(1);
    } else {
      debug(`Listening on port ${chalk.green(port)}`);
    }
  });
