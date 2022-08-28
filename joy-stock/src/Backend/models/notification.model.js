const mongoose = require('mongoose');

const Notification = mongoose.Schema(
	{
    notifID: {
      type: String,
      required: true,
      unique: true,
    },
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
      type: Number,
    },  
	},
	{ collection: 'notification-data' }
);

const model = mongoose.model('NotificationData', Notification);

module.exports = model;
