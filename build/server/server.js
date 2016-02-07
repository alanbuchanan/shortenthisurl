'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _link = require('./controllers/link');

var _link2 = _interopRequireDefault(_link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var LinkMethods = new _link2.default();

var port = process.env.PORT || 3000;

var mongoURI = 'mongodb://127.0.0.1:27017/shortenthisurl';
_mongoose2.default.connect(process.env.MONGOLAB_URI || mongoURI, function (err) {
    if (err) console.log(err);
});

// Serve static landing page
app.use(_express2.default.static(_path2.default.join(__dirname, '../../views')));

app.get('/', LinkMethods.handleRoot);
app.get('/new/:url*', LinkMethods.handlePost);
app.get(/^\/(.+)/, LinkMethods.handleUrlReq);

app.listen(port, function () {
    console.log('Listening on ' + port);
});