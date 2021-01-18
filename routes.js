const port = 3000;
const hue = require('./services/hue.js');

module.exports = function(app, logger) {
    const hue = require('./services/hue.js')(logger);

    app.get('/', (req, res) => {
        res.send('Hello World!')
    });

    app.get('/disableSensors', (req,res) => {
        hue.disableMotionSensors(res);

      
        // res.send("Yep");
    });
    
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    });


};
