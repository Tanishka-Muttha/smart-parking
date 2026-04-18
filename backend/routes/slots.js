const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const slots = await Slot.find().populate('bookedBy', 'name email');
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
  try {
    const slot = await Slot.create({ slotNumber: req.body.slotNumber });
    res.json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
  try {
    await Slot.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;