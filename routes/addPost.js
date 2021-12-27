const express = require('express')
const router = express.Router()
const fs = require('fs')
// const path = require('path')
const multer = require('multer')
// const postsBase = path.join(__dirname, 'db/posts.json')
// const postsBuffer = fs.readFileSync('db/posts.json')
// const posts = JSON.parse(postsBuffer.toString())
const imagesBase = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images') 
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  });
const upload = multer({storage: imagesBase})
router.use(multer({storage:imagesBase}).single('filedata'))




/* GET Add Posts page. */
router.get('/addPost',function(req, res, next) {
    res.render('addPost', { title: 'addPost' });
})

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
  })

module.exports = router;