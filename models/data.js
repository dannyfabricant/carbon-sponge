var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var data = new Schema({
	plot: Schema.Types.ObjectId,
	timestamp: Date,
	date: {
		day: Number,
        month: Number,
        year: Number,
        hour: Number,
        minute: String,
        period: String
	},
	moisture: Number,
	vwc: Number,
	temp: Number
}, {usePushEach: true})

var Data = mongoose.model('Data', data);

module.exports = Data;