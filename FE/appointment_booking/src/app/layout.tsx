import './globals.css';

export const metadata = {
  title: 'Appointment Booking',
  description: 'Book your appointments easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}