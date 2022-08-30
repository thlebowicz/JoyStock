const mongoose = require('mongoose');

const User = mongoose.Schema(
	{
		userID: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		stockQuantities: {
			type: Map,
			of: Number
		},
	},
	{ collection: 'user-data' }
);

const model = mongoose.model('UserData', User);

module.exports = model;
