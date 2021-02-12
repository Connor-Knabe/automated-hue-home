const options = require('../settings/options.js');
var CronJob = require('cron').CronJob;

module.exports = async function(logger,hue) {
	const messenger = require('./messenger.js')(logger);


	setTimeout(async () => {
		var sensorData = await hue.getSensorData();
		sensorData.forEach(sensor => {
			if(sensor.battery < options.batteryPercentWarning){
				messenger.sendEmail('Battery low', sensor);
				logger.debug('Battery low sending email', sensor);
			}
		});
	}, 5000);


    var job = new CronJob(
		'5 5 * * *',
		async function () {
			var sensorData = await hue.getSensorData();
			sensorData.forEach(sensor => {
				if(sensor.battery < options.batteryPercentWarning){
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

};