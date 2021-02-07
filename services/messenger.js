const options = require('../settings/options.js');
const messgener = require('./messenger.js');
var CronJob = require('cron').CronJob;

module.exports = function(logger) {
	function sendEmail(){

    }
    
	return {
        sendEmail:sendEmail
	};
};