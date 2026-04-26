const cron = require('node-cron');
const Provider = require('../models/Provider');
const Booking = require('../models/Booking');

// Run every day at midnight (00:00)
// '0 0 * * *'
const scheduleQueueReset = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log(`[${new Date().toISOString()}] CRON: Running daily queue reset...`);
    try {
      // 1. Reset Provider queues to 0
      const result = await Provider.updateMany(
        {}, 
        { 
          $set: { 
            'queue.nowServing': 0, 
            'queue.nextToken': 0 
          } 
        }
      );
      
      console.log(`[CRON] Reset queues for ${result.modifiedCount} providers.`);

      // 2. Mark any lingering ACTIVE bookings as CANCELLED (or EXPIRED)
      // Since it's a new day, they missed their turn.
      const bookingResult = await Booking.updateMany(
        { status: 'ACTIVE' },
        { 
          $set: { 
            status: 'CANCELLED',
            // optionally add a note why it was cancelled
          } 
        }
      );

      console.log(`[CRON] Cancelled ${bookingResult.modifiedCount} lingering active bookings from yesterday.`);
      
    } catch (error) {
      console.error('[CRON] Error during daily queue reset:', error);
    }
  });

  console.log('Cron jobs initialized: queueReset scheduled for 00:00 daily.');
};

module.exports = scheduleQueueReset;
