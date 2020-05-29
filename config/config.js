const dotenv = require('dotenv')

module.exports = {
    app: {
        port: 9099,
    },
    token: {
        secret: process.env.SECRET,
    }
}