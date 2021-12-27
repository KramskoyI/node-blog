if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
const passport =require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const fs = require('fs')
const initializePassport = require('../passport-config')
const usersBuffer = fs.readFileSync('db/users.json')
const users = JSON.parse(usersBuffer.toString())

initializePassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id),
)

router.use(express.static(__dirname + 'db'))
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
  const postsOnPage = 6

  let pageAll
  
  if( postsTag.length > 0){
    pageAll = Math.ceil(postsTag.length / postsOnPage)
  } else{
    pageAll = Math.ceil(posts.length / postsOnPage)
  }
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
  res.render('index', {user: req.user.name, posts, postsT, pages, tag})
  
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

module.exports = router;
