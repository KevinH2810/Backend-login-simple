const AuthController = require('./AuthController')
const TopUpMoneyController = require('./TopUpController')
const TokenController = require("./TokenController")

module.exports = {
    authController: new AuthController(),
    topupController: new TopUpMoneyController(),
    tokenController: new TokenController(),
}