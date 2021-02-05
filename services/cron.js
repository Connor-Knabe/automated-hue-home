const options = require('../settings/options.js');
var CronJob = require('cron').CronJob;

var v3 = require('node-hue-api').v3, 
host = options.hueBridgeIp,
username = options.hueUser;

var motionSensorTimeout = null;

module.exports = function(logger) {
	//on start turn on schedule and sensor
	

	var api = null;
    (async function() {
        api = await v3.api.createLocal(host).connect(username);
		await getSensorScheduleStatus();
		toggleSchedule(true);
		toggleSensor(true);
		await getSensorScheduleStatus();
    })();

    var job = new cron(
		'5 * * * *',
		function() {
            messenger.sendEmail('Battery low', "Battery data");
		},
		null,
		true,
		'America/Chicago'
	);
	job.start();


    
	return {

	};

};