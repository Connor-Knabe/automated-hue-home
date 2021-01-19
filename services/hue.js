const options = require('../settings/options.js');
var v3 = require('node-hue-api').v3, 
host = options.hueBridgeIp,
username = options.hueUser;

var motionSensorTimeout = null,
	scheduleTimeout = null;

module.exports = function(logger) {

	var api = null;
    (async function() {
        api = await v3.api.createLocal(host).connect(username);
		await temporarilyDisableSchedule(2)
    })();


	async function temporarilyDisableSchedule(hours){
		
		  await toggleSchedule(false);
		  clearTimeout(scheduleTimeout);
		  scheduleTimeout = setTimeout(async ()=>{
			  await toggleSchedule(true);
		  }, hours * 60 * 60 * 1000);
	}

	async function toggleSchedule(enable){
		const mySchedule = await api.schedules.getSchedule(2);
		mySchedule.status = enable ? 'enabled' : 'disabled';
		api.schedules.updateSchedule(mySchedule)
		  .then(updateResult => {
			logger.debug(`Updated Schedule ${JSON.stringify(updateResult)}`); 
		  });
	}

	async function temporarilyDisableMotionSensorFor(hours){
		await toggleSensor(false);
		clearTimeout(motionSensorTimeout);
		motionSensorTimeout = setTimeout(async ()=>{
			await toggleSensor(true);
		}, hours * 60 * 60 * 1000);
	}

	async function toggleSensor(enable){
		api.sensors.getSensor(9)
        .then(sensor => {
			sensor.on = enable;
			sensor.battery = null;
			sensor.sensitivitymax = null;

			api.sensors.updateSensorConfig(sensor)
			.then(result => {
				logger.debug(`Updated sensor config? ${result}`);
			})
        });

	}
    
	return {
		temporarilyDisableMotionSensorFor:temporarilyDisableMotionSensorFor
	};

};