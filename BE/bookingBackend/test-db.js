const sqlite3 = require('sqlite3').verbose();

const testDBConnection = () => {
  const db = new sqlite3.Database('./appointments.db', (err) => {
    if (err) {
      console.error('Failed to connect to the database:', err.message);
      process.exit(1);
    }
    console.log('Successfully connected to the SQLite database.');

    // Test a simple query to verify the table exists
    db.all('SELECT name FROM sqlite_master WHERE type="table" AND name="appointments"', (err, rows) => {
      if (err) {
        console.error('Error querying database:', err.message);
        db.close();
        process.exit(1);
      }

      if (rows.length > 0) {
        console.log('Appointments table exists.');
      } else {
        console.log('Appointments table does not exist. It will be created on first use.');
      }

      // Test a write operation
      db.run('CREATE TABLE IF NOT EXISTS test_table (id INTEGER PRIMARY KEY)', (err) => {
        if (err) {
          console.error('Error creating test table:', err.message);
          db.close();
          process.exit(1);
        }
        console.log('Test table creation successful.');

        // Clean up test table
        db.run('DROP TABLE IF EXISTS test_table', (err) => {
          if (err) {
            console.error('Error dropping test table:', err.message);
          } else {
            console.log('Test table dropped successfully.');
          }

          // Close the database connection
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err.message);
              process.exit(1);
            }
            console.log('Database connection closed.');
          });
        });
      });
    });
  });
};

testDBConnection();