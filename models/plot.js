var mongoose = require('mongoose');	
var Schema = mongoose.Schema;

var plot = new Schema({
	location:  [{ type: Schema.Types.ObjectId, ref: 'Location' }],
	info: {
		plotnumber: Number,
		crops: Array,
		water: Number,
		vwc: {
			saturation: Number,
			capacity: Number,
			dry: Number
		}
	},
	current: {
		timestamp: {
			time: Date,
			string: String
		},
		moisture: Number,
		temp: Number
	},
	meta: {
		created: {
			username: String,
			date: Date
		},
		updated: {
			username: String,
			date: Date
		}
	}
})

var Plot = mongoose.model('Plot', plot);

module.exports = Plot;