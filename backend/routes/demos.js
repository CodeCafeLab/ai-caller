const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Helper: validate weekday (Mon-Fri)
function isWeekday(date) {
  const day = date.getUTCDay(); // 0=Sun,6=Sat
  return day >= 1 && day <= 5;
}

// Helper: parse HH:MM to minutes
function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// POST /api/demos - create a new demo booking (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, company, message, dateISO, slotStart, slotEnd } = req.body || {};

    if (!name || !email || !dateISO || !slotStart || !slotEnd) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const date = new Date(dateISO);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date' });
    }

    // Enforce weekday constraint
    if (!isWeekday(date)) {
      return res.status(400).json({ success: false, message: 'Demos are available Monday to Friday only' });
    }

    // Enforce 3:00pm to 6:00pm half-hour slots
    const startMin = toMinutes(slotStart);
    const endMin = toMinutes(slotEnd);
    const minStart = 15 * 60; // 3:00pm
    const maxEnd = 18 * 60;   // 6:00pm
    if (startMin < minStart || endMin > maxEnd || endMin - startMin !== 30) {
      return res.status(400).json({ success: false, message: 'Time must be a 30-minute slot between 3:00pm and 6:00pm' });
    }

    const sql = `
      INSERT INTO demos (name, email, company, message, scheduled_date, slot_start, slot_end)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, email, company || null, message || null, new Date(date), slotStart, slotEnd];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Failed to insert demo booking:', err);
        return res.status(500).json({ success: false, message: 'Database error', error: err.message });
      }
      res.json({ success: true, id: result.insertId });
    });
  } catch (e) {
    console.error('POST /api/demos error:', e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;


