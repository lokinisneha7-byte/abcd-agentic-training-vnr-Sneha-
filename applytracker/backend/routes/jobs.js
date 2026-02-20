const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', (req, res) => {
  const jobs = db.prepare('SELECT * FROM jobs ORDER BY created_at DESC').all();
  res.json(jobs);
});

router.post('/', (req, res) => {
  const { company_name, job_role, salary_range, status, applied_date, interview_date, contact_person, contact_phone, contact_email, notes } = req.body;
  const result = db.prepare(`
    INSERT INTO jobs (company_name, job_role, salary_range, status, applied_date, interview_date, contact_person, contact_phone, contact_email, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(company_name, job_role, salary_range, status, applied_date, interview_date, contact_person, contact_phone, contact_email, notes);
  res.json({ id: result.lastInsertRowid, message: 'Job added!' });
});

router.put('/:id', (req, res) => {
  const { company_name, job_role, salary_range, status, applied_date, interview_date, contact_person, contact_phone, contact_email, notes } = req.body;
  db.prepare(`
    UPDATE jobs SET
      company_name = COALESCE(?, company_name),
      job_role = COALESCE(?, job_role),
      salary_range = COALESCE(?, salary_range),
      status = COALESCE(?, status),
      applied_date = COALESCE(?, applied_date),
      interview_date = COALESCE(?, interview_date),
      contact_person = COALESCE(?, contact_person),
      contact_phone = COALESCE(?, contact_phone),
      contact_email = COALESCE(?, contact_email),
      notes = COALESCE(?, notes)
    WHERE id = ?
  `).run(company_name, job_role, salary_range, status, applied_date, interview_date, contact_person, contact_phone, contact_email, notes, req.params.id);
  res.json({ message: 'Job updated!' });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);
  res.json({ message: 'Job deleted!' });
});

module.exports = router;