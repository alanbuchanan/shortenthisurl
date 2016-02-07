'use strict';

var _chai = require('chai');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = 'http://localhost:3000/';

describe('URL shortener', function () {

    it('should return an error object when a non existant url code is passed', function (done) {
        (0, _request2.default)(url + 'gibberishh', function (error, response, body) {
            (0, _chai.expect)(JSON.parse(body).error).to.be.equal("No short URL found");
            (0, _chai.expect)(JSON.parse(body)).to.be.an('object');
            done();
        });
    });

    it('should return a json object from the db when an existant url is passed to /new', function (done) {
        (0, _request2.default)(url + 'new/bbc.net', function (error, response, body) {
            (0, _chai.expect)(JSON.parse(body).shortUrl).to.be.equal('http://localhost:3000/GMEN');
            done();
        });
    });
});

// These tests pass 2 - 4 times and then fail.