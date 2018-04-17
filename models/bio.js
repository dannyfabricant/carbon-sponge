var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bio = new Schema({
	plot: Schema.Types.ObjectId,
	timestamp: Date,
	date: Object,
	reading: Number,
})

var Bio = mongoose.model('Bio', bio);

module.exports = Bio;