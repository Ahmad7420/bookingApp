const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./appointments.db');

const initDB = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        time TEXT,
        name TEXT,
        phone TEXT,
        UNIQUE(date, time)
      )
    `);
  });
};

module.exports = { db, initDB };