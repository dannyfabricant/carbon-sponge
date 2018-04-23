var express = require('express')
var passport = require('passport')
var Account = require('../models/account')
var mongoose = require('mongoose')
var Profile = require('../models/profile')
var Location = require('../models/location')
var Plot = require('../models/plot')
var Data = require('../models/data')
var router = express.Router()

router.get('/register', function(req, res) {
    // if(req.user) {
    //     res.redirect('/dashboard')
    // } else {
        res.render('register', {page: '/register'})
    // }
})

router.post('/register', function(req, res, next) {
    // if(req.user) {
        var profile = new Profile ({
            userName: req.body.username,
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            createdAt: new Date()
        })

        profile.save(function(err) {
            if (err) {
                throw err;
            } else {
                console.log('User saved successfully!');
                Account.register(new Account({ username : req.body.username, email : req.body.email }), req.body.password, function(err, account) {
                    if (err) {
                      return res.render('register', { error : err.message })
                    }

                    passport.authenticate('local')(req, res, function () {
                        req.session.save(function (err) {
                            if (err) {
                                return next(err)
                            }
                            return res.send({redirect: '/dashboard'})
                        })
                    })
                })
            }
        })
    // }
})

router.get('/login', function(req, res) {
    if(req.user) {
        res.redirect('/dashboard')
    } else {
        res.render('pages/login', { user : req.user })
    }
})

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/')
})

router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/login')
})

module.exports = router