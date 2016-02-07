'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LinkSchema = new Schema({
	name: String,
	code: String
});

module.exports = LinkSchema;