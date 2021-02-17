const options = require('../settings/options.js');
var CronJob = require('cron').CronJob;

module.exports = async function(logger,hue) {
	const messenger = require('./messenger.js')(logger);

	async function sendSensorEmail(){
		var sensorData = await hue.getSensorData();
		var sendBatteryLowEmail = false;
		var sensorInfo = "";
		sensorData.forEach(sensor => {
			if(sensor.battery < options.batteryPercentWarning){
				sensorInfo += `${sensor.name} is at ${sensor.battery}%\n`;
				sendBatteryLowEmail = true;
			}
		});
		if(sendBatteryLowEmail){
			messenger.sendEmail('Battery low', sensorInfo);
			logger.debug('Battery low sending email:', sensorInfo);
		}
	}

    var job = new CronJob(
		'5 5 * * 3',
		async function () {
			await sendSensorEmail();
		},
		null,
		true,
		'America/Chicago'
	);
	job.start();

};