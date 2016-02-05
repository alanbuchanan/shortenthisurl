var express = require('express');
var app = express();
var mongoose = require('mongoose');
var _ = require('lodash');
var port = process.env.PORT || 3000;
var thisurl = 'https://shortenthisurl.herokuapp.com/';
// var thisurl = 'http://localhost:3000/';
var path = require('path');
var mongoURI = 'mongodb://127.0.0.1:27017/shortenthisurl';

mongoose.connect(process.env.MONGOLAB_URI || mongoURI, err => {if (err) console.log(err)});
var Schema = mongoose.Schema;
var LinkSchema = new Schema({
	name: String,
	code: String
});

var Link = mongoose.model('links', LinkSchema);

var handleGet = (req, res) => {
	console.log('nothing')
};

var handlePost = (req, res) => {
	var url = req.url.substr(5);
	console.log('url:', url)
	var urlCheck = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

	if(url.substr(0, 4) !== 'http'){
		url = 'http://' + url
	}

	if(urlCheck.test(url)) {

		var getRandomStr = (length) => {
			var alphanumeric = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
			return _.times(length, () => _.sample(alphanumeric)).join('');
		}

		// Post
		Link.findOne({ name: url}, function (err, doc){
			if (err) return console.log(err)

			var code = getRandomStr(4);

			if (!doc) {
				// URL doesn't exist in db, so create it
				Link.create({code: code, name: url}, (err, link) => {
					if (err) return (console.log(err));
					Link.findOne({code: code}, (err, doc) => {
						if (err) return (console.log(err));
						return res.send({shortUrl: thisurl + doc.code, originalUrl: doc.name})
					})
				});
			} else {
				// URL exists in db, so send that info
				Link.findOne({name: url}, (err, doc) => {
					if (err) return (console.log(err));
					return res.send({shortUrl: thisurl + doc.code, originalUrl: doc.name})
				})
			}
		});

	} else {
		res.send({error: 'invalid url'})
	}

};

var handleUrlReq = (req, res) => {
	var code = req.url.substr(1);

	Link.findOne({code: code}, (err, doc) => {
		if (doc) {
			console.log('code:', code)
			console.log('doc:', doc)

			res.redirect(doc.name)
		} else {
			res.send({error: 'No short URL found'});
		}
	})
};

app.use(express.static(path.join(__dirname, 'html')));
var handleRoot = (req, res) => {
	res.sendFile('./html/index.html');
}

app.get('/')
app.get('/new/:url*', handlePost);
app.get('/:urlcode', handleUrlReq);

app.delete('/:code', (req, res) => {
	Link.remove({code: req.url.substr(1)}, result => {
		res.send(result)
	});
});

app.listen(port, () => {
	console.log('Listening on ' + port)
})