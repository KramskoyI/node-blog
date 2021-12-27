const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const fs = require('fs')
// const path = require('path')
// const usersBase = path.join(__dirname, 'db/users.json')
// const usersBuffer = fs.readFileSync('db/users.json')
// const users = JSON.parse(usersBuffer.toString());

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}
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
  

module.exports = router;