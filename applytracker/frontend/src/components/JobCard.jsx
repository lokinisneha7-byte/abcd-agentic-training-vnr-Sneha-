import React, { useState } from 'react';
import axios from 'axios';

function JobCard({ job, fetchJobs }) {
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    company_name: job.company_name,
    job_role: job.job_role,
    salary_range: job.salary_range || '',
    status: job.status,
    applied_date: job.applied_date || '',
    interview_date: job.interview_date || '',
    contact_person: job.contact_person || '',
    contact_phone: job.contact_phone || '',
    contact_email: job.contact_email || '',
    notes: job.notes || '',
  });

  const updateStatus = (newStatus) => {
    axios.put(`http://localhost:5000/api/jobs/${job.id}`, { status: newStatus })
      .then(() => fetchJobs())
      .catch(err => console.log(err));
  };

  const deleteJob = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      axios.delete(`http://localhost:5000/api/jobs/${job.id}`)
        .then(() => fetchJobs())
        .catch(err => console.log(err));
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    axios.put(`http://localhost:5000/api/jobs/${job.id}`, editForm)
      .then(() => {
        fetchJobs();
        setShowEdit(false);
      })
      .catch(err => console.log(err));
  };

  const daysSinceApplied = () => {
    if (!job.applied_date) return null;
    return Math.floor((new Date() - new Date(job.applied_date)) / (1000 * 60 * 60 * 24));
  };

  const days = daysSinceApplied();

  const statusColors = {
    Applied: '#f9c74f',
    Interview: '#4cc9f0',
    Offer: '#4caf50',
    Rejected: '#e94560',
  };

  const quickButtons = {
    Applied: [
      { label: '📞 Got Interview Call?', next: 'Interview', color: '#4cc9f0' },
      { label: '❌ Got Rejected?', next: 'Rejected', color: '#e94560' },
    ],
    Interview: [
      { label: '🎉 Got Offer?', next: 'Offer', color: '#4caf50' },
      { label: '❌ Got Rejected?', next: 'Rejected', color: '#e94560' },
    ],
    Offer: [
      { label: '✅ Accepted Offer', next: 'Offer', color: '#4caf50' },
    ],
    Rejected: [
      { label: '🔄 Re-Applied?', next: 'Applied', color: '#f9c74f' },
    ],
  };

  return (
    <div style={styles.card}>

      <div style={styles.header}>
        <h4 style={styles.company}>{job.company_name}</h4>
        <button style={styles.deleteBtn} onClick={deleteJob}>✕</button>
      </div>

      <p style={styles.role}>💼 {job.job_role}</p>

      {job.salary_range && <p style={styles.info}>💰 {job.salary_range}</p>}

      {days !== null && (
        <p style={{ ...styles.info, color: days > 7 ? '#e94560' : '#666' }}>
          📅 Applied {days} days ago {days > 7 ? '⚠️ Follow up!' : ''}
        </p>
      )}

      {job.interview_date && (
        <p style={styles.info}>🗓️ Interview: {job.interview_date}</p>
      )}

      {job.contact_person && <p style={styles.info}>👤 HR: {job.contact_person}</p>}
      {job.contact_phone && <p style={styles.info}>📞 {job.contact_phone}</p>}
      {job.contact_email && <p style={styles.info}>✉️ {job.contact_email}</p>}
      {job.notes && <p style={styles.notes}>📝 {job.notes}</p>}

      <div style={{ ...styles.statusBadge, backgroundColor: statusColors[job.status] }}>
        {job.status}
      </div>

      <div style={styles.quickActions}>
        {quickButtons[job.status] && quickButtons[job.status].map(btn => (
          <button
            key={btn.next}
            style={{ ...styles.quickBtn, backgroundColor: btn.color }}
            onClick={() => updateStatus(btn.next)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <button style={styles.editBtn} onClick={() => setShowEdit(true)}>
        ✏️ Edit Details
      </button>

      {showEdit && (
        <div style={styles.overlay}>
          <div style={styles.editModal}>
            <div style={styles.editHeader}>
              <h3 style={{ margin: 0 }}>Edit Job ✏️</h3>
              <button style={styles.closeBtn} onClick={() => setShowEdit(false)}>✕</button>
            </div>
            <div style={styles.editForm}>

              <label style={styles.label}>Company Name</label>
              <input style={styles.input} name="company_name" value={editForm.company_name} onChange={handleEditChange} />

              <label style={styles.label}>Job Role</label>
              <input style={styles.input} name="job_role" value={editForm.job_role} onChange={handleEditChange} />

              <label style={styles.label}>💰 Salary Range</label>
              <select style={styles.input} name="salary_range" value={editForm.salary_range} onChange={handleEditChange}>
                <option value="">Select Salary Range</option>
                <option value="0 - 2 LPA (Fresher)">0 - 2 LPA (Fresher)</option>
                <option value="2 - 3 LPA">2 - 3 LPA</option>
                <option value="3 - 5 LPA">3 - 5 LPA</option>
                <option value="5 - 8 LPA">5 - 8 LPA</option>
                <option value="8 - 12 LPA">8 - 12 LPA</option>
                <option value="12 - 15 LPA">12 - 15 LPA</option>
                <option value="15 - 20 LPA">15 - 20 LPA</option>
                <option value="20+ LPA">20+ LPA</option>
                <option value="Not Disclosed">Not Disclosed</option>
              </select>

              <label style={styles.label}>📅 Applied Date</label>
              <input style={styles.input} name="applied_date" type="date" value={editForm.applied_date} onChange={handleEditChange} />

              <label style={styles.label}>🗓️ Interview Date</label>
              <input style={styles.input} name="interview_date" type="date" value={editForm.interview_date} onChange={handleEditChange} />

              <div style={styles.sectionTitle}>
                👤 Company HR / Recruiter Details
              </div>

              <label style={styles.label}>HR / Recruiter Name</label>
              <input style={styles.input} name="contact_person" value={editForm.contact_person} onChange={handleEditChange} placeholder="e.g. Priya (HR Manager)" />

              <label style={styles.label}>HR Phone Number</label>
              <input style={styles.input} name="contact_phone" value={editForm.contact_phone} onChange={handleEditChange} placeholder="+91 9876543210" />

              <label style={styles.label}>HR Email Address</label>
              <input style={styles.input} name="contact_email" value={editForm.contact_email} onChange={handleEditChange} placeholder="hr@company.com" />

              <label style={styles.label}>📝 Notes</label>
              <textarea style={styles.textarea} name="notes" value={editForm.notes} onChange={handleEditChange} placeholder="Any notes..." />

              <button style={styles.saveBtn} onClick={saveEdit}>Save Changes ✅</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #f0f0f0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  company: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  role: {
    margin: '4px 0',
    color: '#4361ee',
    fontSize: '13px',
    fontWeight: '500',
  },
  info: {
    margin: '3px 0',
    fontSize: '12px',
    color: '#666',
  },
  notes: {
    margin: '5px 0',
    fontSize: '12px',
    color: '#888',
    fontStyle: 'italic',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '5px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '3px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: 'white',
    marginTop: '8px',
  },
  quickActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '10px',
  },
  quickBtn: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
    textAlign: 'left',
  },
  editBtn: {
    width: '100%',
    marginTop: '8px',
    padding: '7px',
    borderRadius: '8px',
    border: '1px solid #4361ee',
    backgroundColor: 'white',
    color: '#4361ee',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#e94560',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  editModal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    width: '450px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  editHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#e94560',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    backgroundColor: '#f0f2f5',
    padding: '8px',
    borderRadius: '6px',
    marginTop: '4px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    height: '70px',
    outline: 'none',
    resize: 'none',
  },
  saveBtn: {
    backgroundColor: '#4361ee',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '15px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default JobCard;