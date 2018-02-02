var mongoose = require('mongoose');
var Plot = require(__dirname + '/plot')
var PlotSchema = mongoose.model('Plot').schema
var Schema = mongoose.Schema;

var location = new Schema({
	location : { 
		name: String,
		address: String
	},
	plots: [{ type: Schema.Types.ObjectId, ref: 'Plot' }],
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

var Location = mongoose.model('Location', location);

module.exports = Location;