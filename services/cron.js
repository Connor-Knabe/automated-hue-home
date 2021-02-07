const options = require('../settings/options.js');
const messgener = require('./messenger.js');
var CronJob = require('cron').CronJob;

module.exports = function(logger) {
	
    var job = new cron(
		'5 5 * * *',
		function() {
			var sensorData = await hue.getSensorData();
			sensorData.forEach(sensor => {
				if(sensor.battery < 10){
					messenger.sendEmail('Battery low', sensor);
					logger.debug('Battery low sending email', sensor);
				}	
			});
		},
		null,
		true,
		'America/Chicago'
	);
	job.start();


    
	return {

	};

};