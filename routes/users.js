'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const bcrypt = require('bcrypt');
const humps = require('humps');

router.post('/users', (req, res) => {
      knex('users')
         .returning(['id', 'email', 'first_name', 'last_name'])
         .insert({
           'email': req.body.email,
           'first_name': req.body.firstName,
           'last_name': req.body.lastName,
           'hashed_password': bcrypt.hashSync(req.body.password, 8)
        })
         .then((data) => {
            res.send(humps.camelizeKeys(data[0]))
      })
})

module.exports = router;
