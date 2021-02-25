const options = require('../settings/options.js');
var CronJob = require('cron').CronJob;
var lastSensor = null;

module.exports = async function(logger,hue) {
	const messenger = require('./messenger.js')(logger);

	setTimeout(async ()=>{
		await sendSensorEmail();
	},25000);
	setTimeout(async ()=>{
		await sendSensorEmail();
	},30000);

	async function sendSensorEmail(){
		var sensorData = await hue.getSensorData();
		var sendBatteryLowEmail = false;
		var lowSensorInfo = "";
		var sensorInfo = "";
		var lastSensorInfo = "";
		sensorData.forEach(sensor => {
			sensorInfo += `${sensor.name} is at ${sensor.battery}%\n`;

			if(sensor.battery < options.batteryPercentWarning){
				lowSensorInfo += `${sensor.name} is at ${sensor.battery}%\n`;
				sendBatteryLowEmail = true;
			}
		});
		
		if (sendBatteryLowEmail){
			if(lastSensor != null){
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
			messenger.sendEmail('Battery low', `Sensor Info: ${sensorInfo} \nLow Sensors:${lowSensorInfo} \nLast Week Data:${lastSensorInfo}`);
			logger.debug('Battery low sending email:', lowSensorInfo);
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