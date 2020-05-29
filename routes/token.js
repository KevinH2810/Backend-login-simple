const express = require('express');
const { tokenController } = require('../controller');

const router = express.Router();

router.get('/', (req, res) => {
    tokenController.getToken(req, res)
});

router.post('/add', (req, res) => {
    tokenController.addToken(req, res)
});

module.exports = router;