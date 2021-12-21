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
const fs = require('fs')
var path = require('path');
const multer = require('multer');
const initializePassport = require('../passport-config')
const usersBase = path.join(__dirname, 'db/users.json')
const postsBase = path.join(__dirname, 'db/posts.json')
const usersBuffer = fs.readFileSync('db/users.json');
const postsBuffer = fs.readFileSync('db/posts.json');
const users = JSON.parse(usersBuffer.toString());
const posts = JSON.parse(postsBuffer.toString());
initializePassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id),
)

router.use(express.static(__dirname + 'db'))
const imagesBase = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/images') 
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
const upload = multer({storage: imagesBase});


router.use(multer({storage:imagesBase}).single('filedata'));
router.use(express.urlencoded({extended: false}))
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
router.get('/',  checkAuthenticated, function(req, res, next) {
  function getPosts() {
    try {
      const postsBuffer = fs.readFileSync('db/posts.json');
      return JSON.parse(postsBuffer.toString());
    } catch (err) {
      return [];
    }
  }

  let posts = getPosts()
  
  
  let allPosts = posts.map(function(post){
    let user = users.find(user => user.id == post.idAutor)
    post.autor = user.name + user.lastName
    let id = post.id;
    id = Number(id)
    let date = new Date(id)
    post.date  = date.toDateString()
  })
  const tag = req.query.tag

  let postsTag 

  if(tag !=''){
    postsTag = posts.filter(post => post.tag === tag)
  }
  const postsOnPage = 2

  let pageAll
  
  if( postsTag.length > 0){
    pageAll = Math.ceil(postsTag.length / postsOnPage)
  } else{
    pageAll = Math.ceil(posts.length / postsOnPage)
  }
  console.log("=====================>>>",postsTag.length)
 
  // let pageAll = Math.ceil(posts.length / postsOnPage) 
  const pages = []
  
  for (let i = 1; i <= pageAll; i++) {
    const page = { page: i}
    pages.push(page)
  }
  let page = 1
  let test = req.query.page
  if(test > page){
    page = test
  }
  posts = posts.slice((page-1) * postsOnPage , page * postsOnPage)
  postsT = postsTag.slice((page-1) * postsOnPage , page * postsOnPage)
  console.log("======>>>",page,"======>>>",postsTag.length, postsT.length)
  res.render('index', {user: req.user.name, posts, postsT, pages, tag})
  
})

/* GET REG page. */
router.get('/register', checkNotAuthenticated, function(req, res, next) {
  res.render('register', { title: 'Register' });
});
/* POST REG page. */
router.post('/register', checkNotAuthenticated, async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    function getUsers() {
      try {
        const usersBuffer = fs.readFileSync('db/users.json');
        return JSON.parse(usersBuffer.toString());
      } catch (err) {
        return [];
      }
    }

    const users = getUsers()

    let user = {
      id: Date.now().toString(),
      name: req.body.name,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    }
    users.push(user)
    fs.writeFileSync('db/users.json', JSON.stringify(users));

    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  
});

/* GET Add Posts page. */
router.get('/addPost',function(req, res, next) {
  res.render('addPost', { title: 'addPost' });
});

/* POST Add Posts page. */
router.post('/addPost', function(req, res, next) {
  try {
    
    function getPosts() {
      try {
        const postsBuffer = fs.readFileSync('db/posts.json');
        return JSON.parse(postsBuffer.toString());
      } catch (err) {
        return [];
      }
    }

    const posts = getPosts()
   
    let filedata  = req.file ? req.file.filename : null
    
    let post = {
      id: Date.now(),
      idAutor: req.user.id,
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
      image: filedata
    }
    posts.push(post)
    fs.writeFileSync('db/posts.json', JSON.stringify(posts));
    console.log(post)
    res.redirect('/')
  } catch {
    res.redirect('/login')
  }
});


/* GET Log In page. */
router.get('/login', checkNotAuthenticated, function(req, res, next) {
  res.render('login', { title: 'Login' });
});
/* post Log In page. */
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
  }
  
));
/* GET Read Post page. */
router.get('/readPost', function(req, res, next) {
  
  let id = req.query.id;
  let post = posts.find(post => post.id == id)
  id = Number(id)
  let date = new Date(id)
  post.date  = date.toDateString()
  
  let user = users.find(user => user.id == post.idAutor)
  post.autor = user.name + user.lastName
  console.log(post, user)

  res.render('readPost', post)
})

router.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/')
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
