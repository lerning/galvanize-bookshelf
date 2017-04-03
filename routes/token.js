'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var cookieSession = require('cookie-session');

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

   knex('users')
      .where ('email', email)
      .then((user) => {
         // console.log('UUUSER', user[0])
         if(user.length === 0){
           res.type('text/plain');
           res.status(400);
           res.send("Bad email or password");
        } else {
           let checky = bcrypt.compareSync(password, user[0].hashed_password);
           if (checky){
             let token = jwt.sign ({email: email, password: password}, 'sh');
             res.cookie('token', token, { httpOnly:true });
             delete user[0].hashed_password
             res.send(humps.camelizeKeys(user[0]))
          } else {
             res.type('text/plain');
             res.status('400');
             res.send('Bad email or password');
          }
        }
      })
})

router.delete('/', (req, res) => {
  res.clearCookie('token')
  res.send()
})

module.exports = router;
