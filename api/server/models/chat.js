const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		refPath: 'users'
	},
	recipient: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		refPath: 'users'
	},
	text: String,
}, {timestamps: true});


const MessageModel = mongoose.model('Messages', messageSchema);

module.exports = MessageModel;