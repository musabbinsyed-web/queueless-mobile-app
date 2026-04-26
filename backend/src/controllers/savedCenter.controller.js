const SavedCenter = require('../models/SavedCenter');
const Provider = require('../models/Provider');

exports.saveCenter = async (req, res) => {
  try {
    const { providerId } = req.params;
    const userId = req.user.id;

    // Check if provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Try to insert
    try {
      await SavedCenter.create({ userId, providerId });
    } catch (err) {
      // Ignore duplicate key error, means it's already saved
      if (err.code !== 11000) throw err;
    }

    res.status(200).json({ saved: true });
  } catch (error) {
    console.error('Error saving center:', error);
    res.status(500).json({ message: 'Server error saving center' });
  }
};

exports.unsaveCenter = async (req, res) => {
  try {
    const { providerId } = req.params;
    const userId = req.user.id;

    await SavedCenter.deleteOne({ userId, providerId });

    res.status(200).json({ saved: false });
  } catch (error) {
    console.error('Error unsaving center:', error);
    res.status(500).json({ message: 'Server error unsaving center' });
  }
};

exports.getSavedCenters = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the saved records and populate provider details
    const savedCenters = await SavedCenter.find({ userId })
      .populate('providerId')
      .sort({ savedAt: -1 });

    // Map to array of providers
    const providers = savedCenters
      .map(sc => sc.providerId)
      .filter(p => p != null); // filter out if provider was deleted

    res.status(200).json(providers);
  } catch (error) {
    console.error('Error getting saved centers:', error);
    res.status(500).json({ message: 'Server error getting saved centers' });
  }
};
