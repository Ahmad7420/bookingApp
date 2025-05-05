const express = require('express');
const cors = require('cors');
const { db, initDB } = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

initDB();

// Generate time slots (10:00 AM - 5:00 PM, excluding 1:00 PM - 2:00 PM)
const generateTimeSlots = () => {
  const slots = [];
  let hour = 10;
  while (hour < 17) {
    if (hour !== 13) {
      slots.push(`${hour}:00`, `${hour}:30`);
    }
    hour++;
  }
  return slots;
};

// Get available slots for a date
app.get('/api/slots/:date', (req, res) => {
  const { date } = req.params;
  const allSlots = generateTimeSlots();

  db.all('SELECT time FROM appointments WHERE date = ?', [date], (err, booked) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    const bookedSlots = booked.map(b => b.time);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
    res.json({ slots: availableSlots });
  });
});

// Book an appointment
app.post('/api/book', (req, res) => {
  const { date, time, name, phone } = req.body;

  if (!date || !time || !name || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    'INSERT INTO appointments (date, time, name, phone) VALUES (?, ?, ?, ?)',
    [date, time, name, phone],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          return res.status(400).json({ error: 'Slot already booked' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Appointment booked successfully', id: this.lastID });
    }
  );
});

app.listen(3001, () => console.log('Server running on port 3001'));