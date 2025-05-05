'use client';

import { useState, useEffect } from 'react';
import '@/styles/BookingWidgets.css';

const BookingWidget = ({ apiBaseUrl = 'http://localhost:3001/api' }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (date) {
      loadSlots(date);
    }
  }, [date]);

  const loadSlots = async (selectedDate) => {
 
      const response = await fetch(`${apiBaseUrl}/slots/${selectedDate}`);
      const data = await response.json();
      setSlots(data.slots || []);

  };

  const bookAppointment = async () => {
    if (!date || !time || !name || !phone) {
      showMessage('Please fill all fields', true);
      return;
    }

 
      const response = await fetch(`${apiBaseUrl}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, name, phone }),
      });
      const data = await response.json();

      if (response.ok) {
        showMessage('Appointment booked successfully!');
        setTime('');
        loadSlots(date);
      } else {
        showMessage(data.error || 'Booking failed', true);
      }
   
  };

  const showMessage = (msg, error = false) => {
    setMessage(msg);
    setIsError(error);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="booking-container">
      <h2>Book an Appointment</h2>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="time">Time Slot</label>
        <select
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        >
          <option value="">Select a time slot</option>
          {slots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <button onClick={bookAppointment}>Book Appointment</button>
      {message && (
        <div className={`message ${isError ? 'error' : ''}`}>{message}</div>
      )}
    </div>
  );
};

export default BookingWidget;