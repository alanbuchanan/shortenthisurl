import express from 'express';
const app = express();
import mongoose from 'mongoose';
import _ from 'lodash';
import path from 'path';

// How can I do the following LinkSchema with ES6 import/export?
const LinkSchema = require('../models/link');

const Link = mongoose.model('links', LinkSchema);

let thisurl = 'http://localhost:3000/';

if (process.env.NODE_ENV == 'production') {
    thisurl = 'https://shortenthisurl.herokuapp.com/';
}

export default class {

    handlePost(req, res){
        let url = req.url.substr(5);
        const urlCheck = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

        if(url.substr(0, 4) !== 'http'){
            url = 'http://' + url;
        }

        if(urlCheck.test(url)) {

            const getRandomStr = (length) => {
                const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
                return _.times(length, () => _.sample(alphanumeric)).join('');
            }

            // Post
            Link.findOne({ name: url}, function (err, doc){
                if (err) return console.log(err);

                const code = getRandomStr(4);

                if (!doc) {
                    // URL doesn't exist in db, so create it
                    Link.create({code: code, name: url}, (err, link) => {
                        if (err) return (console.log(err));
                        Link.findOne({code: code}, (err, doc) => {
                            if (err) return (console.log(err));
                            return res.send({shortUrl: thisurl + doc.code, originalUrl: doc.name});
                        })
                    });
                } else {
                    // URL exists in db, so send that info
                    Link.findOne({name: url}, (err, doc) => {
                        if (err) return (console.log(err));
                        return res.send({shortUrl: thisurl + doc.code, originalUrl: doc.name});
                    })
                }
            });

        } else {
            res.send({error: 'invalid url'});
        }

    }

    handleUrlReq(req, res){
        const code = req.url.substr(1);

        Link.findOne({code: code}, (err, doc) => {
            if (doc) {
                res.redirect(doc.name);
            } else {
                res.send({error: 'No short URL found'});
            }
        });
    }

    handleRoot(req, res){
        res.sendFile('../../views/index.html');
    }

    deleteEntry(req, res){
        Link.remove({code: req.url.substr(1)}, result => {
            res.send(result);
        });
    }

};
