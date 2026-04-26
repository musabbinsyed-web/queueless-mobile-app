require('dotenv').config();
const mongoose = require('mongoose');

async function testAdvanceQueue() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const Provider = require('./src/models/Provider');
  const Booking = require('./src/models/Booking');

  const provider = await Provider.findById('prov-hosp-pmc');
  if (!provider) {
    console.log('Provider not found');
    process.exit(0);
  }

  const nextBooking = await Booking.findOne({
    providerId: provider._id,
    status: 'ACTIVE'
  }).sort({ tokenNumber: 1 });

  if (!nextBooking) {
    console.log('No active bookings to advance');
  } else {
    console.log('Next booking to advance:', nextBooking.tokenNumber);
    nextBooking.status = 'COMPLETED';
    nextBooking.completedAt = new Date();
    await nextBooking.save();

    provider.queue.nowServing = nextBooking.tokenNumber;
    await provider.save();
    console.log('Advanced successfully to token', provider.queue.nowServing);
  }
  process.exit(0);
}

testAdvanceQueue();
