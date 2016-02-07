import {expect} from 'chai';
var request = require('request');
var burl = 'http://localhost:3000/';

describe('URL shortener', () => {

    it('should return an error object when a non existant url code is passed', done => {
        request(burl + 'gibberishh', (error, response, body) => {
            expect(JSON.parse(body).error).to.be.equal("No short URL found");
            expect(JSON.parse(body)).to.be.an('object');
            done();
        });
    });

    it('should return a json object from the db when an existant url is passed to /new', done => {
        request(burl + 'new/bbc.net', (error, response, body) => {
            expect(JSON.parse(body).shortUrl).to.be.equal('http://localhost:3000/GMEN');    
            done();
        });
    });
})

// These tests pass 2 - 4 times and then fail.