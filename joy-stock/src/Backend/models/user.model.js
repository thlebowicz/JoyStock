const mongoose = require('mongoose');

const User = mongoose.Scheme(
	{
		userID: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			unique: true,
			required: true,
		},
		stockQuantities: {
			ticker: Number,
		},
	},
	{ collection: 'user-data' }
);

const model = mongoose.model('UserData', User);

module.exports = model;
