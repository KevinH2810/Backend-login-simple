const express = require('express');
const { tokenController } = require('../controller');

const router = express.Router();

router.get('/', (req, res) => {
    tokenController.getToken(req, res)
});

module.exports = router;