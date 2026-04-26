const express = require('express');
const router = express.Router();
const providerController = require('../controllers/provider.controller');
const { authenticateJWT } = require('../middleware/auth');
const { requireProviderOwnership } = require('../middleware/ownsProvider');

// Protected Phase 5 routes (Provider only)
// getMyVenue MUST come before /:providerId wildcard routes
router.get('/my-venue', authenticateJWT, providerController.getMyVenue);
router.post('/my-venue', authenticateJWT, providerController.updateMyVenue);

// Public Phase 2 / Phase 3 routes
router.get('/search', providerController.searchProviders);
router.get('/:providerId/queue', providerController.getProviderQueue);
router.get('/:providerId', providerController.getProviderById);

router.use('/:providerId', authenticateJWT, requireProviderOwnership);
router.patch('/:providerId', authenticateJWT, requireProviderOwnership, providerController.updateProvider);
router.post('/:providerId/queue/advance', providerController.advanceQueue);
router.get('/:providerId/queue/list', providerController.getQueueList);
router.post('/:providerId/services', providerController.addService);
router.patch('/:providerId/services/:serviceId', providerController.updateService);
router.delete('/:providerId/services/:serviceId', providerController.deleteService);
router.get('/:providerId/stats', providerController.getProviderStats);

module.exports = router;
