const options = require('../settings/options.js');
var CronJob = require('cron').CronJob;
var lastSensor = null;

module.exports = async function(logger,hue) {
	const messenger = require('./messenger.js')(logger);

	async function sendLowBatterySensorEmail(){
		var sensorData = await hue.getSensorData();
		var sendBatteryLowEmail = false;
		var lowSensorInfo = "";
		var sensorInfo = "";
		var lastSensorInfo = "";
		var lastLowSensorInfo = "";

		sensorData.forEach(sensor => {
			sensorInfo += `${sensor.name} is at ${sensor.battery}%\n`;
			if(sensor.battery < options.batteryPercentWarning){
				lowSensorInfo += `${sensor.name} is at ${sensor.battery}%\n`;
				sendBatteryLowEmail = true;
			}
		});
		
		if(lastSensor != null){
			lastSensor.forEach(sensor => {
				lastSensorInfo += `${sensor.name} is at ${sensor.battery}%\n`;
				if(sensor.battery < options.batteryPercentWarning){
					lastLowSensorInfo += `${sensor.name} previously was at ${sensor.battery}%\n`;
					sendBatteryLowEmail = true;
				}
			});
		}
		lastSensor = sensorData;
	

		if(sendBatteryLowEmail){
			var emailContent = `Sensor Info: \n${sensorInfo} \nLow Sensors:\n${lowSensorInfo} \nLast Week Data:\n${lastSensorInfo} \nLow Sensors:\n${lastLowSensorInfo}`;
			messenger.sendEmail('Battery low', emailContent);
			logger.debug('Battery low sending email:', emailContent);
		}
	}

    var job = new CronJob(
		'5 5 * * 3',
		async function () {
			await sendLowBatterySensorEmail();
		},
		null,
		true,
		'America/Chicago'
	);
	job.start();

};