var express = require('express')
var mongoose = require('mongoose')
var Location = require('../models/location')
var Plot = require('../models/plot')
var Data = require('../models/data')
var router = express.Router()

router.get('/update', function(req, res) {
	console.log('hey')
	res.send('hey')
})

module.exports = router
