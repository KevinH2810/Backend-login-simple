var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')
const chalk = require('chalk');

const DBSOURCE = "./db/db.sqlite"

let conn = new sqlite3.Database(DBSOURCE, (error) => {
    if (error) {
        console.log(chalk.red("conn to db is error:  ", err))
    }

    console.log(chalk.green("database Connected"))
})

module.exports = { conn }