const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const auth = require('../middleware/auth');

router.post('/book', auth, async (req, res) => {
  try {
    const slot = await Slot.findById(req.body.slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ message: 'Slot already booked' });

    slot.isBooked = true;
    slot.bookedBy = req.user.id;
    slot.bookingTime = new Date();
    await slot.save();

    const booking = await Booking.create({ userId: req.user.id, slotId: slot._id });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.body.bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not your booking' });

    booking.status = 'cancelled';
    await booking.save();

    const slot = await Slot.findById(booking.slotId);
    slot.isBooked = false;
    slot.bookedBy = null;
    slot.bookingTime = null;
    await slot.save();

    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('slotId', 'slotNumber')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;