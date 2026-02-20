const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'applytrack.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name TEXT NOT NULL,
    job_role TEXT NOT NULL,
    salary_range TEXT,
    status TEXT DEFAULT 'Applied',
    applied_date TEXT,
    interview_date TEXT,
    contact_person TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  db.exec(`ALTER TABLE jobs ADD COLUMN contact_phone TEXT`);
} catch (e) {}

try {
  db.exec(`ALTER TABLE jobs ADD COLUMN contact_email TEXT`);
} catch (e) {}

console.log('Database connected!');

module.exports = db;