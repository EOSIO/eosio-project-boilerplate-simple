// mongoose db server config
const http = require ('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const ip = require('ip');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
let localDB = 'mongodb://localhost/eosContracts';

mongoose.connect(localDB , {useMongoClient: true});
mongoose.connection
  .once('open', () => { console.log(`Server is now connected to ${localDB} db...`) })
  .on('error', (err) => { console.warn('Warning', err) });

// The http server will listen to an appropriate port, or default to port 5000.
let port = process.env.PORT || 5000;

// app setup
let app = express();
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

let router = require('./router');
router(app);

// create instance of express
let server = http.createServer(app);
server.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on: ${port}, captain~!`);
  console.log("Localhost port " + ip.address() + ":5000");
});