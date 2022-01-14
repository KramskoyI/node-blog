const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
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

      let user = {
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
      }
      mongoClient.connect(function(err, client){
      
        const db = client.db("blog");
        const collection = db.collection("users");
        collection.insertOne(user, function(err, result){
              
            if(err){ 
                return console.log(err);
            }
            console.log(result);
            client.close();
        });
    });
  
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
});
  

module.exports = router;