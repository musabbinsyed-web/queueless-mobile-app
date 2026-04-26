const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

exports.bookToken = async (req, res) => {
  try {
    const { providerId, serviceId } = req.body;
    const userId = req.user.id;

    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    const service = provider.services.id(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found in provider' });
    }

    // Atomically increment the nextToken in the provider document
    const updatedProvider = await Provider.findByIdAndUpdate(
      providerId,
      { $inc: { 'queue.nextToken': 1 } },
      { new: true }
    );

    const tokenNumber = updatedProvider.queue.nextToken - 1;
    const queuePosition = tokenNumber - updatedProvider.queue.nowServing;

    // Generate random reference code like QL-HSP-XXXXX
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(5, '0');
    const referenceCode = `QL-HSP-${randomHex}`;

    const booking = new Booking({
      userId,
      providerId: provider._id,
      serviceId,
      serviceName: service.name,
      providerName: provider.name,
      providerLocation: provider.location,
      providerImage: provider.imageUrl,
      tokenNumber,
      queuePosition,
      referenceCode,
      status: 'ACTIVE',
    });

    await booking.save();

    // Prepare response data matching frontend TokenConfirmationData
    const estimatedWaitMinutes = Math.max(5, queuePosition * parseInt(service.duration)); // basic logic
    const tokenConfirmation = {
      tokenNumber: booking.tokenNumber,
      queuePosition: queuePosition,
      estimatedWaitTime: `~${estimatedWaitMinutes} mins`,
      referenceCode: booking.referenceCode,
      status: 'ACTIVE',
    };

    res.status(201).json({ booking, tokenConfirmation });
  } catch (error) {
    console.error('Error booking token:', error);
    res.status(500).json({ message: 'Server error during booking' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.bookingId, userId: req.user.id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ message: 'Server error fetching booking details' });
  }
};
