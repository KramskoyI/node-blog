const express = require('express')
const router = express.Router()
const passport =require('passport')
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
}

/* GET Log In page. */
router.get('/login', function(req, res, next) {
    // , checkNotAuthenticated
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('login', { title: 'Login' });
    }
});
router.post('/login', passport.authenticate('local', {
    // , checkNotAuthenticated,
    
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
    }
));

module.exports = router;