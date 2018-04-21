var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var data = new Schema({
	plot: Schema.Types.ObjectId,
	timestamp: Date,
	moisture: Number,
	temp: Number
}, {usePushEach: true})

var Data = mongoose.model('Data', data);

module.exports = Data;