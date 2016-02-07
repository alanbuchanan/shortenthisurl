import express from 'express';
const app = express();
import mongoose from 'mongoose';
import _ from 'lodash';
import path from 'path';

import LinkSchema from '../models/link';
const Link = mongoose.model('links', LinkSchema);

let thisurl = 'http://localhost:3000/';

if (process.env.NODE_ENV == 'production') {
    thisurl = 'https://shortenthisurl.herokuapp.com/';
}

export default class {

    // User is entering a new url with `/new/:url`
    handlePost(req, res){

        let url = req.url.substr(5);
        const urlCheck = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

        // Make the url http if not already
        if(url.substr(0, 4) !== 'http'){
            url = 'http://' + url;
        }

        if(urlCheck.test(url)) {

            const getRandomStr = (length) => {
                const alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
                return _.times(length, () => _.sample(alphanumeric)).join('');
            }

            // Post to db
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
            // URL doesn't pass the `urlCheck` regex
            res.send({error: 'invalid url'});
        }

    }

    // User is entering a code for an existing URL
    handleUrlReq(req, res){
        const code = req.url.substr(1);

        Link.findOne({code: code}, (err, doc) => {
            if (doc) {
                // Redirect the user to the page linked to the urlcode
                res.redirect(doc.name);
            } else {
                res.send({error: 'No short URL found'});
            }
        });
    }

    handleRoot(req, res){
        // Landing page
        res.sendFile('../../views/index.html');
    }

};
