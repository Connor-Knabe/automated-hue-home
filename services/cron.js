const options = require('../settings/options.js');
var CronJob = require('cron').CronJob;
var lastSensor = null;

module.exports = async function(logger,hue) {
	const messenger = require('./messenger.js')(logger);

	setTimeout(async ()=>{
		await sendSensorEmail();
	},10000);
	setTimeout(async ()=>{
		await sendSensorEmail();
	},20000);

	async function sendSensorEmail(){
		var sensorData = await hue.getSensorData();
		var sendBatteryLowEmail = false;
		var sensorInfo = "";
		var lastSensorInfo = "";
		sensorData.forEach(sensor => {
			if(sensor.battery < options.batteryPercentWarning){
				sensorInfo += `${sensor.name} is at ${sensor.battery}%\n`;
				sendBatteryLowEmail = true;
			}
		});
		
		if (sendBatteryLowEmail){
			sendBatteryLowEmail += `${sensor.name} is at ${sensor.battery}%\n`;
			if(lastSensor){
				lastSensor.forEach(sensor => {
					if(sensor.battery < options.batteryPercentWarning){
						lastSensorInfo += `${sensor.name} previously was at ${sensor.battery}%\n`;
						sendBatteryLowEmail = true;
					}
				});
			}
			lastSensor = sensorData;

		}

		if(sendBatteryLowEmail){
			messenger.sendEmail('Battery low', sensorInfo + lastSensorInfo);
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