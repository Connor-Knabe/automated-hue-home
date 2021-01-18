const options = require('../settings/options.js');
var v3 = require('node-hue-api').v3, 
host = options.hueBridgeIp,
username = options.hueUser;

GroupLightState = v3.model.lightStates.GroupLightState;

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

	async function disableMotionSensors(res){


		var sensorConfig = {
            "on": false,
            "battery": 29,
            "alert": "none",
            "reachable": true,
            "sensitivity": 2,
            "sensitivitymax": 2
        };

		// api.sensors.updateSensorConfig(sensorConfig)
		// .then(result => {
		//   console.log(`Updated sensor config? ${result}`);
		// })

		api.sensors.getSensor(9)
        .then(sensor => {

			console.log('sensor', sensor);
			// sensor._data.config.on = false;
			console.log(sensor);
			sensor.on = false;
			api.sensors.updateSensorConfig(sensor)
			.then(result => {
				console.log(`Updated sensor config? ${result}`);
			})
			res.send(sensor.toStringDetailed());
        });

	}
    
	return {
		disableMotionSensors:disableMotionSensors
	};

};