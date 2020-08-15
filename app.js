const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const http2 = require('http2');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const options = {
  cert: fs.readFileSync(path.join(__dirname, '/localhost-cert.pem')),
  key: fs.readFileSync(path.join(__dirname, '/localhost-privkey.pem')),
};

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css/')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js/')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

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

app.use('/books', bookRouter);
app.get('/', (req, res) => {
  // res.send('Hello from the express server!');
  // res.sendFile(path.join(__dirname, 'views/index.html'));
  res.render('index', {
    title: 'Cheese App',
    nav,
  });
});
app.post('/', (req, res) => {
  res.set({
    Location: '/books',
    Refresh: '0; url=/books',
  });
  res.status(201).end();
});

http2
  .createSecureServer(options, app)
  .listen(port, (error) => {
    if (error) {
      debug(chalk.red(error));
      process.exit(1);
    } else {
      debug(`Listening on port ${chalk.green(port)}`);
    }
  });
