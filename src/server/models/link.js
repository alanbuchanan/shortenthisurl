const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LinkSchema = new Schema({
	name: String,
	code: String
});

module.exports = LinkSchema;