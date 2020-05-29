const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const { conn } = require('../db/connection');
const TokenController = require("./TokenController")

module.exports = class TopUpController extends BaseController {

    async AddMoney(req, res) {
        const { username, amount } = req.query
        const handleError = new HandleError();

        conn.run("UPDATE user SET balance = balance + ? WHERE username = ?", [amount, username], (err) => {

            if (err) {
                handleError.sendCatchError(res, err);
                return;
            }

            conn.run(`INSERT INTO topupTransaction(userid,amount) Select userid, ? from user where username = ?`, [amount, username], function(err) {
                if (err) {
                    handleError.sendCatchError(res, err);
                    return;
                }

                res.json({
                    "status": 200,
                    "message": "topup success",
                })
                return;
            })

        })
    }

    async AddAssets(req, res) {
        const handleError = new HandleError();
        const { tokenName, TokenAmount } = req.query
        const tokenController = new TokenController();

        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        if (token) {
            jwt.verify(token, config.token.secret, (err, decoded) => {
                if (err) {
                    return res.json({
                        status: 500,
                        success: false,
                        message: `Token is not valid error = ${err}`
                    });
                } else {
                    req.query.decoded = decoded
                    conn.get(`SELECT * FROM user WHERE username = ?`, [decoded.username], async(err, result) => {
                        if (err) {
                            handleError.sendCatchError(res, err);
                            return;
                        }

                        if (result.Balance === 0) {
                            return res.json({
                                status: 200,
                                success: false,
                                message: `Your Balance is 0, topup your Balance to continue`
                            });
                        }

                        const selectedToken = await tokenController.getToken(req, res)

                        if (result.Balance < (selectedToken.Price * TokenAmount)) {
                            return res.json({
                                status: 200,
                                success: false,
                                message: `Your Balance is not enough, topup your Balance to continue`
                            });
                        }
                    })
                }
            });
        } else {
            return res.json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    };
}