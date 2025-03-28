const express = require('express');
const router = express.Router();
const { initiatePayment } = require('../Controllers/paymentController');

router.post('/initiate', initiatePayment);

module.exports = router;
