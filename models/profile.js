var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var profiles = new Schema({
	userName: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	createdAt: { type: Date, required: true }
}, {usePushEach: true});

var Profile = mongoose.model('Profile', profiles);

module.exports = Profile;