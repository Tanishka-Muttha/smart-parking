const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  bookingDate: { type: Date, default: Date.now },
  status:      { type: String, enum: ['active', 'cancelled'], default: 'active' }
});

module.exports = mongoose.model('Booking', BookingSchema);