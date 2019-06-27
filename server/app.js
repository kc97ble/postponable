const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const debug = require('debug')('server:app');

const indexRouter = require('./routes/index');
const formsRouter = require('./routes/forms');

const app = express();

app.set('json spaces', 2);

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  debug('req.originalUrl = %o, req.body = %o', req.originalUrl, req.body);
  next();
});

app.use('/', indexRouter);
app.use('/forms', formsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.json(err);
  next();
});

module.exports = app;
