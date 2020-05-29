const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { conn } = require('../db/connection');
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = class AuthController extends BaseController {

    async register(req, res) {
        const { username, password } = req.query;
        const handleError = new HandleError();

        conn.run(`INSERT INTO USER(username,password) VALUES(?,?)`, [username, md5(password)], function(err) {
            if (err) {
                handleError.sendCatchError(res, err);
                return;
            }

            res.json({
                "status": 200,
                "message": "register success",
            })
            return;
        })
    }

    async login(req, res) {
        const { username, password } = req.query;

        conn.get(`SELECT * FROM USER WHERE username = ?`, [username], async(err, result) => {
            if (err) {
                handleError.sendCatchError(res, err);
                return;
            }

            if (result.length === 0) {
                res.json({
                    "code": 206,
                    "failed": "username does not exist"
                })
                return;
            }

            if (md5(password) !== result.password) {
                res.json({
                    "code": 204,
                    "failed": "password does not match"
                })
                return;
            }

            // create a token
            var tokens = jwt.sign({ username: result.username, password: result.password }, config.token.secret, {
                expiresIn: 86400 // expires in 24 hours
            })

            res.json({
                "code": 200,
                "failed": "login succesfull",
                "token": tokens
            })
            return;
        })
    }
}