var express = require("express")
var app = express()
const cors = require('cors');
const { DB } = require('./db')
const config = require('./config/config')

// const DbInit = new DB()

app.use(cors())

// DbInit.init()
require('./routes')(app);

app.listen(config.app.port, () => console.log(`Express server currently running on port ${config.app.port}`));