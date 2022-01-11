const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
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

      const tags = req.body.tag
      const arrTags = tags.split(',');

      
      let post = {
        id: Date.now(),
        idAutor: req.user.id,
        title: req.body.title,
        description: req.body.description,
        tag: arrTags,
        image: filedata
      }
      if (post.title === ''|| post.description === '') {
        console.log("=========================")
        res.render('addPost', { errorAdd : 'You did not write Title or Description!!!'})
        
      } else {
        console.log('========>>', post)
        posts.push(post)
        fs.writeFileSync('db/posts.json', JSON.stringify(posts));
        res.redirect('/')
      }
    } catch {
      res.redirect('/login')
    }
  })

module.exports = router;