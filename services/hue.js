const options = require('../settings/options.js');
var v3 = require('node-hue-api').v3, 
host = options.hueBridgeIp,
username = options.hueUser;

var motionSensorTimeout = null;

module.exports = function(logger) {

	var api = null;
    (async function() {
        api = await v3.api.createLocal(host).connect(username);

        api.groups.getAll()
            .then(allGroups => {
            // Display the groups from the bridge
            allGroups.forEach(group => {
				console.log('done loading');
            // console.log(group.toStringDetailed());
            });
        });

		
    })();

	async function temporarilyDisableMotionSensorFor(hours){
		var sensorConfig = {
            "on": false,
            "battery": 29,
            "alert": "none",
            "reachable": true,
            "sensitivity": 2,
            "sensitivitymax": 2
        };

		api.sensors.getSensor(9)
        .then(sensor => {
			sensor.on = true;
			sensor.battery = null;
			sensor.sensitivitymax = null;

			api.sensors.updateSensorConfig(sensor)
			.then(result => {
				console.log(`Updated sensor config? ${result}`);
			})
			res.send(sensor.toStringDetailed());
        });

	}
    
	return {
		temporarilyDisableMotionSensorFor:temporarilyDisableMotionSensorFor
	};

};