const port = 3000;
const hue = require('./services/hue.js');

module.exports = function(app, logger, options) {
    const hue = require('./services/hue.js')(logger);

    app.get('/', (req, res) => {
        res.send('Hello World!')
    });

    app.get('/sensorScheduleStatus', async (req, res) => {
        var status = await hue.getSensorScheduleStatus();
        res.send(status);
    });

    app.post('/disableSensors', (req,res) => {
        hue.temporarilyDisableMotionSensorFor(options.disableSensorHours);
        res.send("200");
    });

    app.post('/disableSchedules', (req,res) => {
        hue.temporarilyDisableScheduleFor(options.disableScheduleHours)
        res.send("200");
    });

    app.post('/disableSchedulesAndSensors', (req,res)=>{
        hue.temporarilyDisableMotionSensorFor(options.disableSensorHours);
        hue.temporarilyDisableScheduleFor(options.disableScheduleHours);
        res.send("200");
    });

    app.post('/enableSchedulesAndSensors', (req,res)=>{
        hue.toggleSchedule(true);
        hue.toggleSensor(true);
        res.send("200");
    });
    
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });

};
