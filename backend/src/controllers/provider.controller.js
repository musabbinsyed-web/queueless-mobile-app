const Provider = require('../models/Provider');

exports.searchProviders = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json([]);
    }
    const regex = new RegExp(q, 'i');
    const providers = await Provider.find({
      $or: [{ name: regex }, { location: regex }]
    });
    
    // Format queue wait time estimates
    const formattedProviders = providers.map(p => {
      const pJson = p.toJSON();
      const queueLength = Math.max(0, p.queue.nextToken - p.queue.nowServing);
      pJson.services = pJson.services.map(s => ({
        ...s,
        waitEstimate: `~${Math.max(5, queueLength * 10)}m`
      }));
      return pJson;
    });

    res.status(200).json(formattedProviders);
  } catch (error) {
    console.error('Error searching providers:', error);
    res.status(500).json({ message: 'Server error searching providers' });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const providerJson = provider.toJSON();
    const queueLength = Math.max(0, provider.queue.nextToken - provider.queue.nowServing);
    
    providerJson.services = providerJson.services.map((service) => {
      const estimatedWaitMinutes = Math.max(5, queueLength * 10);
      return {
        ...service,
        waitEstimate: `~${estimatedWaitMinutes}m`,
      };
    });

    res.status(200).json(providerJson);
  } catch (error) {
    console.error('Error fetching provider details:', error);
    res.status(500).json({ message: 'Server error fetching provider details' });
  }
};

exports.getProviderQueue = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const peopleAhead = Math.max(0, provider.queue.nextToken - provider.queue.nowServing - 1);
    const estimatedWaitMinutes = Math.max(5, peopleAhead * 10);

    res.status(200).json({
      nowServing: provider.queue.nowServing,
      nextToken: provider.queue.nextToken,
      peopleAhead,
      estimatedWaitMinutes,
    });
  } catch (error) {
    console.error('Error fetching queue status:', error);
    res.status(500).json({ message: 'Server error fetching queue status' });
  }
};

// ================= PHASE 5 ENDPOINTS =================

exports.getMyVenue = async (req, res) => {
  try {
    const Provider = require('../models/Provider');
    const provider = await Provider.findOne({ ownerUserId: req.user.id });
    if (!provider) {
      return res.status(404).json({ message: 'No venue found for this provider' });
    }
    res.status(200).json(provider);
  } catch (error) {
    console.error('Error fetching my venue:', error);
    res.status(500).json({ message: 'Server error fetching venue' });
  }
};

exports.updateMyVenue = async (req, res) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can manage venues' });
    }

    const Provider = require('../models/Provider');
    const { name, location, busyness, currentVisitors, imageUrl } = req.body;
    
    let provider = await Provider.findOne({ ownerUserId: req.user.id });
    
    if (!provider) {
      // Create new venue
      const newId = `prov-${req.user.id.toString().slice(-6)}`;
      provider = new Provider({
        _id: newId,
        ownerUserId: req.user.id,
        name: name || 'My New Venue',
        location: location || 'TBD',
        categoryId: 'cat-hospital', // Default category, ideally sent by frontend
        busyness: busyness || 'low',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop&q=80',
        services: [],
        queue: { nowServing: 0, nextToken: 1 }
      });
    } else {
      // Update existing
      if (name) provider.name = name;
      if (location) provider.location = location;
      if (busyness) provider.busyness = busyness;
      if (currentVisitors !== undefined) provider.currentVisitors = currentVisitors;
      if (imageUrl) provider.imageUrl = imageUrl;
    }
    
    await provider.save();
    res.status(200).json(provider);
  } catch (error) {
    console.error('Error upserting my venue:', error);
    res.status(500).json({ message: 'Server error saving venue details' });
  }
};

exports.advanceQueue = async (req, res) => {
  try {
    console.log('advanceQueue called for provider:', req.provider._id);
    const provider = req.provider; // from ownsProvider middleware
    const Booking = require('../models/Booking');

    // Find the next ACTIVE booking (lowest token number = first in line)
    const nextBooking = await Booking.findOne({
      providerId: provider._id,
      status: 'ACTIVE'
    }).sort({ tokenNumber: 1 });

    console.log('nextBooking found:', nextBooking?.tokenNumber || 'null');

    if (!nextBooking) {
      console.log('No active bookings found! Returning 400.');
      return res.status(400).json({ message: 'No active bookings to advance' });
    }

    // Mark it as completed
    nextBooking.status = 'COMPLETED';
    nextBooking.completedAt = new Date();
    await nextBooking.save();
    console.log('Saved nextBooking as COMPLETED.');

    // Keep nowServing in sync with the token we just served
    provider.queue.nowServing = nextBooking.tokenNumber;
    await provider.save();
    console.log('Updated provider nowServing to:', nextBooking.tokenNumber);

    res.status(200).json({
      message: 'Queue advanced',
      servedTokenNumber: nextBooking.tokenNumber,
      nowServing: provider.queue.nowServing,
    });
  } catch (error) {
    console.error('Error advancing queue:', error);
    res.status(500).json({ message: 'Server error advancing queue' });
  }
};

exports.getQueueList = async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const bookings = await Booking.find({ providerId: req.provider._id, status: 'ACTIVE' })
      .sort({ tokenNumber: 1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error getting queue list:', error);
    res.status(500).json({ message: 'Server error getting queue list' });
  }
};

exports.updateProvider = async (req, res) => {
  try {
    const { busyness, currentVisitors, name, location, imageUrl } = req.body;
    const provider = req.provider;

    if (busyness) provider.busyness = busyness;
    if (currentVisitors !== undefined) provider.currentVisitors = currentVisitors;
    if (name) provider.name = name;
    if (location) provider.location = location;
    if (imageUrl) provider.imageUrl = imageUrl;

    await provider.save();
    res.status(200).json(provider);
  } catch (error) {
    console.error('Error updating provider:', error);
    res.status(500).json({ message: 'Server error updating provider' });
  }
};

exports.addService = async (req, res) => {
  try {
    const { name, duration, price, description } = req.body;
    const provider = req.provider;

    provider.services.push({ name, duration, price, description });
    await provider.save();

    res.status(201).json(provider.services[provider.services.length - 1]);
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ message: 'Server error adding service' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, duration, price, description } = req.body;
    const provider = req.provider;

    const service = provider.services.id(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (name) service.name = name;
    if (duration) service.duration = duration;
    if (price) service.price = price;
    if (description !== undefined) service.description = description;

    await provider.save();
    res.status(200).json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error updating service' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const provider = req.provider;

    provider.services.pull(serviceId);
    await provider.save();

    res.status(200).json({ deleted: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error deleting service' });
  }
};

exports.getProviderStats = async (req, res) => {
  try {
    const Booking = require('../models/Booking');
    const provider = req.provider;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Get today's completed bookings
    const completedBookings = await Booking.find({
      providerId: provider._id,
      status: 'COMPLETED',
      completedAt: { $gte: startOfDay }
    });

    const tokensServed = completedBookings.length;

    let avgWaitMinutes = 0;
    let peakHour = '--';

    if (tokensServed > 0) {
      // Calculate Average Wait Time
      const totalWaitMs = completedBookings.reduce((sum, booking) => {
        const waitMs = new Date(booking.completedAt) - new Date(booking.bookedAt);
        return sum + waitMs;
      }, 0);
      avgWaitMinutes = Math.round(totalWaitMs / tokensServed / 1000 / 60);

      // Calculate Peak Hour
      const hourCounts = {};
      completedBookings.forEach(booking => {
        const hour = new Date(booking.completedAt).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      let maxCount = 0;
      let peakH = null;
      for (const [hour, count] of Object.entries(hourCounts)) {
        if (count > maxCount) {
          maxCount = count;
          peakH = hour;
        }
      }
      
      if (peakH !== null) {
        // Format as HH:00
        peakHour = `${String(peakH).padStart(2, '0')}:00`;
      }
    }

    res.status(200).json({
      tokensServed,
      avgWaitMinutes,
      peakHour
    });
  } catch (error) {
    console.error('Error getting provider stats:', error);
    res.status(500).json({ message: 'Server error getting provider stats' });
  }
};
