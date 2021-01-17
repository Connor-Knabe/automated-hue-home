
const options = require('./settings/options.js');

var log4js = require('log4js');
var logger = log4js.getLogger();

const express = require('express');
const app = express();


require('./routes.js')(app, logger);

