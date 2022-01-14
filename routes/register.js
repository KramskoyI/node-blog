const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const fs = require('fs')
const path = require('path')
const usersBase = path.join(__dirname, 'db/users.json')
const usersBuffer = fs.readFileSync('db/users.json')
const users = JSON.parse(usersBuffer.toString());
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const mongoClient = new MongoClient(url);

/* GET REG page. */
router.get('/register', function(req, res, next) {
  // , checkNotAuthenticated,
  if (req.isAuthenticated()) {
    return res.redirect('/')
  } else {
    res.render('register', { title: 'Register' });
  }
    
});



/* POST REG page. */
router.post('/register', async (req, res, next) => {
  
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      function getUsers() {
        try {
         
          const usersBuffer = fs.readFileSync('db/users.json');
          return JSON.parse(usersBuffer.toString());
        } catch (err) {
          return [];
        };
      };
  
      const users = getUsers()
  
      let user = {
        // id: Date.now().toString(),
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
      }
      async function run(user) {
        try {
            await mongoClient.connect();
            const db = mongoClient.db("blog");
            const collection = db.collection("users");
            const result = await collection.insertOne(user);
            console.log(result);
            console.log(user);
        }catch(err) {
            console.log(err);
        } finally {
            await mongoClient.close();
        }
      }
      run();

      users.push(user)
      fs.writeFileSync('db/users.json', JSON.stringify(users));
  
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
    
});
  

module.exports = router;