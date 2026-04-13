// routes/auth.routes.js - SAHIHISHA HII
const express = require('express');
const router = express.Router();
const userController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware'); // ADD THIS
const { isAdminByPhone } = require('../middleware/admin.middleware');
// Public routes (hazihitaji token)
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh', userController.refreshToken);
router.post('/haraka-webhook', userController.snippeWebhook);

// ADD THIS LINE - all routes below need token
router.use(authenticate);

// Protected routes (zinahitaji token)
router.post('/deposit', userController.depositMoney);
router.post('/withdraw', userController.withdrawMoney);
// router.post('/withdrawAdmin', userController.AdminWithdrawMoney);
router.get('/balance', userController.checkBalance);
router.get('/profile', userController.getProfile);
router.get('/payment-status/:order_id', userController.checkPaymentStatus);
// Add to your routes
router.get('/check-admin', authenticate, userController.checkAdminStatus);

// ADMIN ONLY route - requires both authentication AND admin privileges
router.post('/withdrawAdmin', isAdminByPhone, userController.AdminWithdrawMoney);


module.exports = router;