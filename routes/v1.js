const express 			= require('express');
const router 			= express.Router();

const UserController 	= require('../controllers/user.controller');

const passport      	= require('passport');
const path            = require('path');


require('./../middleware/passport')(passport);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"CHEFLING'S API", data:{"version_number":"v1.0.0"}});
});


router.post(    '/user/signup',           UserController.signup);
router.post(    '/user/profile',          passport.authenticate('jwt', {session:false}), UserController.getProfile);        
router.put(     '/user/profile/update/:first_name/:last_name/:password',   passport.authenticate('jwt', {session:false}), UserController.updateProfile);    
router.post(    '/user/login',            UserController.login);

module.exports = router;
