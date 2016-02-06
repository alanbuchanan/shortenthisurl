import express from 'express';
const app = express();
import mongoose from 'mongoose';
import path from 'path';

import LinkMethodsClass from './controllers/link';
const LinkMethods = new LinkMethodsClass;

const port = process.env.PORT || 3000;

const mongoURI = 'mongodb://127.0.0.1:27017/shortenthisurl';
mongoose.connect(process.env.MONGOLAB_URI || mongoURI, err => {if (err) console.log(err)});

app.use(express.static(path.join(__dirname, './views')));
app.get('/', LinkMethods.handleRoot);
app.get('/new/:url*', LinkMethods.handlePost);
app.get(/^\/(.+)/, LinkMethods.handleUrlReq);
app.delete('/:code', LinkMethods.deleteEntry);

app.listen(port, () => {
	console.log('Listening on ' + port);
});