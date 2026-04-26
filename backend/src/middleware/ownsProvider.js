const Provider = require('../models/Provider');

exports.requireProviderOwnership = async (req, res, next) => {
  try {
    // Make sure user has provider role
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Access denied: Requires provider role' });
    }

    const { providerId } = req.params;
    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // For development, if ownerUserId is not set, allow access
    // In production, this should strictly check ownership
    if (provider.ownerUserId && provider.ownerUserId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied: You do not own this provider venue' });
    }

    // Attach provider to req so controllers don't have to fetch it again
    req.provider = provider;
    next();
  } catch (error) {
    console.error('Provider ownership check error:', error);
    res.status(500).json({ message: 'Server error checking ownership' });
  }
};
