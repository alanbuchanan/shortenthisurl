'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app = (0, _express2.default)();

// How can I do the following LinkSchema with ES6 import/export?
var LinkSchema = require('../models/link');

var Link = _mongoose2.default.model('links', LinkSchema);

var thisurl = 'https://shortenthisurl.herokuapp.com/';
// const thisurl = 'http://localhost:3000/';

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'handlePost',
        value: function handlePost(req, res) {
            var url = req.url.substr(5);
            var urlCheck = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

            if (url.substr(0, 4) !== 'http') {
                url = 'http://' + url;
            }

            if (urlCheck.test(url)) {
                (function () {

                    var getRandomStr = function getRandomStr(length) {
                        var alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
                        return _lodash2.default.times(length, function () {
                            return _lodash2.default.sample(alphanumeric);
                        }).join('');
                    };

                    // Post
                    Link.findOne({ name: url }, function (err, doc) {
                        if (err) return console.log(err);

                        var code = getRandomStr(4);

                        if (!doc) {
                            // URL doesn't exist in db, so create it
                            Link.create({ code: code, name: url }, function (err, link) {
                                if (err) return console.log(err);
                                Link.findOne({ code: code }, function (err, doc) {
                                    if (err) return console.log(err);
                                    return res.send({ shortUrl: thisurl + doc.code, originalUrl: doc.name });
                                });
                            });
                        } else {
                            // URL exists in db, so send that info
                            Link.findOne({ name: url }, function (err, doc) {
                                if (err) return console.log(err);
                                return res.send({ shortUrl: thisurl + doc.code, originalUrl: doc.name });
                            });
                        }
                    });
                })();
            } else {
                res.send({ error: 'invalid url' });
            }
        }
    }, {
        key: 'handleUrlReq',
        value: function handleUrlReq(req, res) {
            var code = req.url.substr(1);

            Link.findOne({ code: code }, function (err, doc) {
                if (doc) {
                    res.redirect(doc.name);
                } else {
                    res.send({ error: 'No short URL found' });
                }
            });
        }
    }, {
        key: 'handleRoot',
        value: function handleRoot(req, res) {
            res.sendFile('./views/index.html');
        }
    }, {
        key: 'deleteEntry',
        value: function deleteEntry(req, res) {
            Link.remove({ code: req.url.substr(1) }, function (result) {
                res.send(result);
            });
        }
    }]);

    return _class;
}();

exports.default = _class;
;
'use strict';

require('babel-core/register');
require('./server.js');
'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LinkSchema = new Schema({
	name: String,
	code: String
});

module.exports = LinkSchema;
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

app.use(_express2.default.static(_path2.default.join(__dirname, './views')));
app.get('/', LinkMethods.handleRoot);
app.get('/new/:url*', LinkMethods.handlePost);
app.get(/^\/(.+)/, LinkMethods.handleUrlReq);
app.delete('/:code', LinkMethods.deleteEntry);

app.listen(port, function () {
	console.log('Listening on ' + port);
});
'use strict';

var _chai = require('chai');

var request = require('request');
var burl = 'http://localhost:3000/';

describe('URL shortener', function () {

    it('should return an error object when a non existant url code is passed', function (done) {
        request(burl + 'gibberishh', function (error, response, body) {
            (0, _chai.expect)(JSON.parse(body).error).to.be.equal("No short URL found");
            (0, _chai.expect)(JSON.parse(body)).to.be.an('object');
            done();
        });
    });

    it('should return a json object from the db when an existant url is passed to /new', function (done) {
        request(burl + 'new/bbc.net', function (error, response, body) {
            (0, _chai.expect)(JSON.parse(body).shortUrl).to.be.equal('http://localhost:3000/GMEN');
            done();
        });
    });
});

// These tests pass 2 - 4 times and then fail.

//# sourceMappingURL=script.compiled.js.map