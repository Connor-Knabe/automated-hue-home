const options = require('../settings/options.js');
var v3 = require('node-hue-api').v3, 
host = options.hueBridgeIp,
username = options.hueUser;

var motionSensorTimeout = null,
	scheduleTimeout = null,
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
		await getSensorData();
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
			sensor.on = enable;
			sensor.battery = null;
			sensor.sensitivitymax = null;
			api.sensors.updateSensorConfig(sensor)
			.then(result => {
				logger.debug(`Updated sensor config: ${result}`);
			})
        });
	}

	async function getSensorScheduleStatus(){
		const mySchedule = await api.schedules.getSchedule(2);
		var scheduleEnabled = mySchedule.status == "enabled";

		logger.debug(scheduleEnabled)
		if(timerEndDate){
			timerEndDate = timerEndDate.toString();
		}
		return timerEndDate;		 
	}
    


	async function getSensorData(){
		var sensors = [];
		await api.sensors.getAll()
		.then(allSensors => {
			// Display the details of the sensors we got back
			allSensors.forEach(sensor => {
				if(sensor._data.productname == "Hue motion sensor"){
					var sensorData = {
						name: sensor._data.name,
						battery:sensor._data.config.battery,
						reachable: sensor._data.config.reachable,
						on: sensor._data.config.on
					}
					sensors.push(sensorData);
				}
			});
		}).catch(err => {
			console.log('err getting sensor data',err);
		});
		return sensors;
	}

	return {
		temporarilyDisableMotionSensorFor:temporarilyDisableMotionSensorFor,
		temporarilyDisableScheduleFor:temporarilyDisableScheduleFor,
		toggleSensor:toggleSensor,
		toggleSchedule:toggleSchedule,
		getSensorScheduleStatus:getSensorScheduleStatus,
		getSensorData:getSensorData
	};

};