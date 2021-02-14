const options = require('../settings/options.js');
var CronJob = require('cron').CronJob;
const prettyjson = require('prettyjson');

module.exports = async function(logger,hue) {
	const messenger = require('./messenger.js')(logger);


	setTimeout(async () => {
		await sendSensorEmail();
	}, 5000);


	async function sendSensorEmail(){
		var sensorData = await hue.getSensorData();
		var sendBatteryLowEmail = false;
		sensorData.forEach(sensor => {
			if(sensor.battery < options.batteryPercentWarning){
				sendBatteryLowEmail = true;
			}
		});
		if(sendBatteryLowEmail){
			messenger.sendEmail('Battery low', prettyjson.render(sensorData));
				logger.debug('Battery low sending email', prettyjson.render(sensorData));
		}
		}

    var job = new CronJob(
		'5 5 * * *',
		async function () {
			await sendSensorEmail();
		},
		null,
		true,
		'America/Chicago'
	);
	job.start();

};