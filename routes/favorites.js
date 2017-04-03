'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const jwt = require('jsonwebtoken')


// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (req, res) => {
   if (!req.cookies.token) {
      res.status(401).type('text/plain').send('Unauthorized')
   } else {
   knex('favorites')
      .join('books', 'favorites.book_id', 'books.id')
      .then((data) => {
         res.send(humps.camelizeKeys(data))
      })
   }
})

router.get('/:id', (req, res) => {
   if (!req.cookies.token) {
      res.status(401).type('text/plain').send('Unauthorized')
   } else {
   let query_id =  req.query.bookId
   knex('favorites')
      .where('id', query_id)
      .then((book) => {
         if (book == ''){
            res.send(false)
         } else {
            res.send(true)
         }
      })
   }
})

router.post('/', (req, res) => {
   if (!req.cookies.token) {
      res.status(401).type('text/plain').send('Unauthorized')
   } else {
   let reqId = req.body.bookId
   knex('favorites')
      .returning(['id', 'book_id', 'user_id'])
      .insert({
        book_id: reqId,
        user_id: 1 })
        .then((book) => {
        res.send(humps.camelizeKeys(book[0]))
     })
  }
})

router.delete('/', (req, res) => {
   if (!req.cookies.token) {
      res.status(401).type('text/plain').send('Unauthorized')
   } else {

   knex('favorites')
      .returning(['book_id', 'user_id'])
       .where('book_id', req.body.bookId)
       .del()
       .then((fav) => {
        res.send(humps.camelizeKeys(fav[0]))
      })
   }
})

module.exports = router;
