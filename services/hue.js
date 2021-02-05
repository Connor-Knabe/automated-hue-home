const options = require('../settings/options.js');
var v3 = require('node-hue-api').v3, 
host = options.hueBridgeIp,
username = options.hueUser;

var motionSensorTimeout = null,
	scheduleTimeout = null,
	sensorEnabled = true,
	scheduleEnabled = true,
	timerEndDate = null;

module.exports = function(logger) {
	//on start turn on schedule and sensor
	

	var api = null;
    (async function() {
        api = await v3.api.createLocal(host).connect(username);
		await getSensorScheduleStatus();
		toggleSchedule(true);
		toggleSensor(true);
		await getSensorScheduleStatus();
		getSensorBatteryData();
    })();


	async function temporarilyDisableScheduleFor(hours){
		
		  await toggleSchedule(false);
		  clearTimeout(scheduleTimeout);

		  scheduleTimeout = setTimeout(async ()=>{
			  await toggleSchedule(true);
		  }, hours * 60 * 60 * 1000);
	}

	async function toggleSchedule(enable){
		if(enable){
			timerEndDate = null;
			clearTimeout(motionSensorTimeout);
			clearTimeout(scheduleTimeout);
		}
		const mySchedule = await api.schedules.getSchedule(2);
		mySchedule.status = enable ? 'enabled' : 'disabled';
		api.schedules.updateSchedule(mySchedule)
		  .then(updateResult => {
			scheduleEnabled = enable;
			logger.debug(`Updated Schedule ${JSON.stringify(updateResult)}`); 
		  });
	}

	async function temporarilyDisableMotionSensorFor(hours){
		await toggleSensor(false);
		clearTimeout(motionSensorTimeout);
		timerEndDate = new Date();
		timerEndDate.setHours(timerEndDate.getHours() + hours);

		motionSensorTimeout = setTimeout(async ()=>{
			await toggleSensor(true);
			timerEndDate = null;
		}, hours * 60 * 60 * 1000);
	}

	async function toggleSensor(enable){
		api.sensors.getSensor(9)
        .then(sensor => {
			sensorEnabled = enable;
			sensor.on = enable;
			sensor.battery = null;
			sensor.sensitivitymax = null;

			api.sensors.updateSensorConfig(sensor)
			.then(result => {
				logger.debug(`Updated sensor config? ${result}`);
			})
        });
	}

	async function getSensorScheduleStatus(){
		var sensorEnabled = false;
		await api.sensors.getSensor(9)
			.then(sensor => {
				sensorEnabled = sensor.on;
			});
		const mySchedule = await api.schedules.getSchedule(2);
		var scheduleEnabled = mySchedule.status == "enabled";

		logger.debug(scheduleEnabled)
		if(timerEndDate){
			timerEndDate = timerEndDate.toString();
		}
		return timerEndDate;		 
	}
    


	async function getSensorBatteryData(){

		api.sensors.getAll()
		.then(allSensors => {
			// Display the details of the sensors we got back
			allSensors.forEach(sensor => {
				if(sensor._data.productname == "Hue motion sensor"){
					console.log('Sensors', sensor._data.name, sensor._data.config.battery, sensor._data.id);
				}
			});
		});

	}

	return {
		temporarilyDisableMotionSensorFor:temporarilyDisableMotionSensorFor,
		temporarilyDisableScheduleFor:temporarilyDisableScheduleFor,
		toggleSensor:toggleSensor,
		toggleSchedule:toggleSchedule,
		getSensorScheduleStatus:getSensorScheduleStatus
	};

};