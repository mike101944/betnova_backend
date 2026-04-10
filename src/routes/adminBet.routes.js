// routes/adminBet.routes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { isAdminByPhone } = require('../middleware/admin.middleware');
const adminBetController = require('../controllers/adminBet.controller');

router.use(authenticate);
router.use(isAdminByPhone);

// Remove /adminBets prefix since it's already in the base path
router.get('/', adminBetController.getAllBets);  // Changed from /adminBets
router.get('/:id', adminBetController.getBetDetails);  // Changed from /adminBets/:id
router.put('/:id/selections', adminBetController.updateBetSelections);  // Changed from /adminBets/:id/selections
router.patch('/:id/approve', adminBetController.approveBet);
router.delete('/:id', adminBetController.deleteBet);
router.get('/stats', adminBetController.getStatistics);

module.exports = router;