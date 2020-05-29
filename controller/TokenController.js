const { conn } = require('../db/connection');
const BaseController = require('./BaseController');
const HandleError = require('./HandleError');

module.exports = class TokenController extends BaseController {
    async getToken(req, res) {
        const handleError = new HandleError();
        const { tokenName } = req.query

        return new Promise(resolve => {
            conn.get("SELECT * FROM Token WHERE TokenName = ?", [tokenName], (err, result) => {
                if (err) {
                    handleError.sendCatchError(res, err);
                    return;
                }

                res.json({
                    "status": 200,
                    "data": result,
                })

                resolve(result)
            })
        })
    }
}