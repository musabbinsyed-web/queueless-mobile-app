const express = require('express');
const router = express.Router();
const savedCenterController = require('../controllers/savedCenter.controller');
const { authenticateJWT } = require('../middleware/auth');

router.post('/:providerId', authenticateJWT, savedCenterController.saveCenter);
router.delete('/:providerId', authenticateJWT, savedCenterController.unsaveCenter);
router.get('/', authenticateJWT, savedCenterController.getSavedCenters);

module.exports = router;
