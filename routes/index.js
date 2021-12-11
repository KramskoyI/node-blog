if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport =require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('../passport-config')
initializePassport(
  passport, 
  email => user.find(user => user.email === email),
  id => user.find(user => user.id === id),
)

const user = [];

router.use(express.urlencoded({extended: false}));
router.use(flash())
router.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
router.use(methodOverride('_method'))

/* GET home page. */
router.get('/', checkAuthenticated, function(req, res, next) {
  res.render('index', {user: req.user });
});

/* GET REG page. */
router.get('/register', checkNotAuthenticated, function(req, res, next) {
  res.render('register', { title: 'Register' });
});
/* POST REG page. */
router.post('/register', checkNotAuthenticated, async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    user.push({
      id: Date.now().toString(),
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(user)
});

/* GET Add Posts page. */
router.get('/addPosts',function(req, res, next) {
  res.render('addPosts', { title: 'addPosts' }, {name: 'fxjjjjj'} );
});

/* GET Log In page. */
router.get('/login', checkNotAuthenticated, function(req, res, next) {
  res.render('login', { title: 'Login' });
});
/* post Log In page. */
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
  }
  
));

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}


module.exports = router;
