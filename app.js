
// var v3 = require('node-hue-api').v3, 
// host = options.hueBridgeIp,
// username = options.hueUser,
// lightsOffTimeout = null,
// lightsOffTimedTimeout = null,
// GroupLightState = v3.model.lightStates.GroupLightState;

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});