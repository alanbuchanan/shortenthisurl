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