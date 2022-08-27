const mongoose = require('mongoose');

const Notification = mongoose.Schema(
	{
    ticker: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    condition: {
      type: String,
      required: true,
    },
    lastTriggered: {
      type: Date,
    },  
	},
	{ collection: 'notification-data' }
);

const model = mongoose.model('UserData', Notification);

module.exports = model;
