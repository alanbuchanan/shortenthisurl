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

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _link = require('../models/link');

var _link2 = _interopRequireDefault(_link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var app = (0, _express2.default)();

var Link = _mongoose2.default.model('links', _link2.default);

var thisurl = 'http://localhost:3000/';

if (process.env.NODE_ENV == 'production') {
    thisurl = 'https://shortenthisurl.herokuapp.com/';
}

var _class = function () {
    function _class() {
        _classCallCheck(this, _class);
    }

    _createClass(_class, [{
        key: 'handlePost',

        // User is entering a new url with `/new/:url`
        value: function handlePost(req, res) {

            var url = req.url.substr(5);
            var urlCheck = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

            // Make the url http if not already
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

                    // Post to db
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
                // URL doesn't pass the `urlCheck` regex
                res.send({ error: 'invalid url' });
            }
        }

        // User is entering a code for an existing URL

    }, {
        key: 'handleUrlReq',
        value: function handleUrlReq(req, res) {
            var code = req.url.substr(1);

            Link.findOne({ code: code }, function (err, doc) {
                if (doc) {
                    // Redirect the user to the page linked to the urlcode
                    res.redirect(doc.name);
                } else {
                    res.send({ error: 'No short URL found' });
                }
            });
        }
    }, {
        key: 'handleRoot',
        value: function handleRoot(req, res) {
            // Landing page
            res.sendFile('../../views/index.html');
        }
    }]);

    return _class;
}();

exports.default = _class;
;