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
            console.log(group.toStringDetailed());
            });
        });

		api.sensors.getAll()
			.then(allSensors => {
				// Display the details of the sensors we got back
				console.log(JSON.stringify(allSensors, null, 2));
			})
			;
    })();

	function disableMotionSensors(){



	}
    
	return {
		disableMotionSensors:disableMotionSensors
	};

};