// routes/auth.routes.js - SAHIHISHA HII
const express = require('express');
const router = express.Router();
const userController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware'); // ADD THIS

// Public routes (hazihitaji token)
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh', userController.refreshToken);
router.post('/haraka-webhook', userController.mzalendoWebhook);

// ADD THIS LINE - all routes below need token
router.use(authenticate);

// Protected routes (zinahitaji token)
router.post('/deposit', userController.depositMoney);
router.post('/withdraw', userController.withdrawMoney);
router.get('/balance', userController.checkBalance);
router.get('/profile', userController.getProfile);
router.get('/payment-status/:order_id', userController.checkPaymentStatus);


module.exports = router;