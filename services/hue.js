const options = require('../settings/options.js');
var v3 = require('node-hue-api').v3, 
host = options.hueBridgeIp,
username = options.hueUser;

var motionSensorTimeout = null;

module.exports = function(logger) {

	var api = null;
    (async function() {
        api = await v3.api.createLocal(host).connect(username);
    })();

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
				console.log(`Updated sensor config? ${result}`);
			})
        });

	}
    
	return {
		temporarilyDisableMotionSensorFor:temporarilyDisableMotionSensorFor
	};

};