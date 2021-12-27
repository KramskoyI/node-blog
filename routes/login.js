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
router.get('/login', checkNotAuthenticated, function(req, res, next) {
    res.render('login', { title: 'Login' });
});
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
    }
    
));

module.exports = router;