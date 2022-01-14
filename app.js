const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const addPostRouter = require('./routes/addPost');
const readPostRouter = require('./routes/readpost');
const app = express();

// const MongoClient = require("mongodb").MongoClient;
// const url = "mongodb://localhost:27017/";


// const mongoClient = new MongoClient(url);
// mongoClient.connect(function(err, client){
      
//   const db = client.db("blog");
//   const users = db.collection("users");

//   if(err) return console.log(err);
    
//   users.find().toArray(function(err, results){
//     console.log(results);
//     client.close();
//   });
// });

// view engine setup
app.set('views', path.join(__dirname, 'views', 'pages'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.get('/register', registerRouter);
app.post('/register', registerRouter);
app.get('/login', loginRouter);
app.post('/login', loginRouter);
app.get('/addPost', addPostRouter);
app.post('/addPost', addPostRouter);
app.get('/readPost', readPostRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
