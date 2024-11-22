const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/authController.js');

router.post('/bfhl', adminController.postReq);
router.get('/bfhl', adminController.getReq);

module.exports = router;
