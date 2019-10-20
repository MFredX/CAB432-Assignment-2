var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var resultsRouter = require('./routes/results');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

const hostname = '127.0.0.1';
const port = 3000;

//make available all the routes
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/results', resultsRouter);

//handle 404 errors
app.use(function(req, res) {
  return res.status(404).render('error', {error: "404", details: "The page you are looking for could not be found! Try checking the link"});
});

app.listen(port, function () {
  console.log(`Express app listening at http://${hostname}:${port}/`);
});