const { conn } = require('../db/connection');
const BaseController = require('./BaseController');
const HandleError = require('./HandleError');

module.exports = class TokenController extends BaseController {
    async getToken(req, res) {
        const handleError = new HandleError();

        conn.all("SELECT * FROM Token", (err, results) => {
            if (err) {
                handleError.sendCatchError(res, err);
                return;
            }

            res.json({
                "status": 200,
                "data": results,
            })
        })
    }

    async addToken(req, res) {
        const handleError = new HandleError();

        const { tokenName, tokenPrice } = req.query;

        conn.run("INSERT INTO Token(TokenName, Price) VALUES(?, ?", [tokenName, tokenPrice], (err) => {
            if (err) {
                handleError.sendCatchError(res, err);
                return;
            }

            res.json({
                "status": 200,
                "message": "new token inserted",
            })
        })
    }
}