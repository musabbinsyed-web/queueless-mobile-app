const Booking = require('../models/Booking');

exports.getProfileStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const activeBookings = await Booking.countDocuments({ userId, status: 'ACTIVE' });
    
    // Calculate simulated time saved from completed bookings
    // Assuming each completed booking saves 45 minutes
    const completedBookings = await Booking.countDocuments({ userId, status: 'COMPLETED' });
    const timeSavedMinutes = completedBookings * 45;

    res.status(200).json({
      stats: {
        activeBookings,
        timeSavedMinutes,
      }
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({ message: 'Server error fetching profile stats' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { displayName } = req.body;
    
    const updateData = {};
    if (displayName) updateData.displayName = displayName;
    
    // Handle avatar upload
    if (req.file) {
      // In a real app, you'd use an environment variable for the base URL
      // For local dev, we construct it from the request
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      updateData.avatarUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    const User = require('../models/User');

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        avatarUrl: updatedUser.avatarUrl,
        role: updatedUser.role,
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};
