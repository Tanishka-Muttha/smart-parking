const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  slotNumber:  { type: String, required: true, unique: true },
  isBooked:    { type: Boolean, default: false },
  bookedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  bookingTime: { type: Date, default: null }
});

module.exports = mongoose.model('Slot', SlotSchema);