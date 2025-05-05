import React from 'react';
import { createRoot } from 'react-dom/client';
import BookingWidget from '../src/components/BookingWidget';

const initBookingWidget = () => {
  const containers = document.querySelectorAll('[data-appointment-booking]');
  containers.forEach((container) => {
    const root = createRoot(container);
    root.render(<BookingWidget />);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBookingWidget);
} else {
  initBookingWidget();
}