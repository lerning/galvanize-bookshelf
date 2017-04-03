'use strict';

const express = require('express');
const app = express();

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('knex');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var cookieSession = require('cookie-session');

// app.use(cookieSession({
//   name: 'session',
//   keys: ['Gotham','Batman'],
// }))


router.get('/', (req, res) => {
   if (req.cookies.token == undefined){
      res.status(200).send(false)
   } else {
      res.status(200).send(true)
   }
})

router.post('/', (req, res) => {
   let email = req.body.email
   let password = req.body.password
   // if (!email){
   //    console.log('bad email caught');
   //    res.sendStatus(400, 'Bad email or password');
   // }

   console.log('email', email);
   console.log('password', password);
   console.log('req body', req.body);

   knex('users')
      .where ('email', email)
      .then((user) => {
         if(user.length === 0){
           res.type('text/plain');
           res.status(400);
           res.send("Bad email or password");
         }
      })

      var token = jwt.sign ({email: email, password: password}, 'sh');
      console.log('token', token);

   res.cookie('token', token);
   res.send()


})

module.exports = router;
