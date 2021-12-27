const express = require('express')
const router = express.Router()
const fs = require('fs')
const usersBuffer = fs.readFileSync('db/users.json');
const postsBuffer = fs.readFileSync('db/posts.json');
const users = JSON.parse(usersBuffer.toString());
const posts = JSON.parse(postsBuffer.toString());
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

module.exports = router;