var express = require('express');
var router = express.Router();
require('dotenv').config();

const User = require('../models/user');
const Slot = require('../models/slot');
const Meeting = require('../models/meeting');
const Attendee = require('../models/attendee');
var bcrypt = require('bcryptjs');
const UserMeeting = require('../models/usermeeting');
const userController = require('../controllers/user');


  User.sync();
  Meeting.sync();
  Slot.sync();
  Attendee.sync();
  UserMeeting.sync();
  const x = bcrypt.hashSync('1234');
  User.findOrCreate({
      where: {
          email: 'john@mail.com'
        },
      defaults: {
        uFname: 'john',
        password: x,
        uType: 'admin'
        }
    });
    User.findOrCreate({
        where: {
            email: 'adam@mail.com'
          },
        defaults: {
          uFname: 'adam',
          password: x,
          uType: 'convener'
          }
      });

     User.findOrCreate({
          where: {
            email: 'sdep@mail.com'
        },
       defaults: {
        uFname: 'sdep',
        password: x,
        uType: 'organiser'
        }
    }).spread((user, created) => {
        console.log(user.get({plain: true}))
        // console.log('created: '+created)
    });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });


var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        if(req.session.user.uType == 'admin'){
            res.redirect('/admin');
        }
        else if(req.session.user.uType == 'convener'){
            res.redirect('/users/conv/dash');
        }
        else if(req.session.user.uType == 'organiser'){
            res.redirect('/users/org/dash');
        }
    } else {
        next();
    }
  };

// Session checker
router.get('/', sessionChecker, (req, res) => {
    res.render('index', { error: req.session.error });
});

// GET request for Login
router.post('/login', userController.login);

// GET request for Logout
router.get('/logout', userController.logout);



router.get('/*', function(req, res, next){
    if(req.session.user){
        next();
    }
    else{
        res.status(404).send('Not found');
    }
});

router.get('/users/admin*',function(req, res, next){
    if(req.session.user.uType == 'admin'){
        next();
    }
    else{
        res.status(404).send('Not found');
    }
});

router.get('/users/conv*', function(req, res, next){
    if(req.session.user.uType == 'convener'){
        next();
    }
    else{
        res.status(404).send('Not found');
    }
});

router.get('/users/org*', function(req, res, next){
    if(req.session.user.uType == 'organiser'){
        next();
    }
    else{
        res.status(404).send('Not found');
    }
});


// router.get('/home', function(req, res, next) {
//   res.render('home',{ error: req.session.error });
// });









module.exports = router;
