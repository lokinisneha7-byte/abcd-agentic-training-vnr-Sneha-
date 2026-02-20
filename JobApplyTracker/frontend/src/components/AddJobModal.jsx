import React, { useState } from 'react';
import axios from 'axios';

function AddJobModal({ onClose, fetchJobs }) {
  const [form, setForm] = useState({
    company_name: '',
    job_role: '',
    salary_range: '',
    status: 'Applied',
    applied_date: '',
    interview_date: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    notes: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const scheduleInterviewNotification = (interviewDate, companyName) => {
    if (!interviewDate) return;
    const interviewTime = new Date(interviewDate).getTime();
    const now = new Date().getTime();
    const diff = interviewTime - now;
    if (diff > 0 && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification('🎯 Interview Reminder!', {
          body: `You have an interview with ${companyName} today! Good luck! 🍀`,
          icon: '/favicon.ico',
        });
      }, diff);
    }
  };

  const handleSubmit = () => {
    if (!form.company_name || !form.job_role) {
      alert('Company name and job role are required!');
      return;
    }
    requestNotificationPermission();
    scheduleInterviewNotification(form.interview_date, form.company_name);
    axios.post('http://localhost:5000/api/jobs', form)
      .then(() => {
        fetchJobs();
        onClose();
      })
      .catch(err => console.log(err));
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add New Job 🎯</h2>
          <button style={styles.close} onClick={onClose}>✕</button>
        </div>
        <div style={styles.form}>

          <div style={styles.field}>
            <label style={styles.label}>Company Name *</label>
            <input
              style={styles.input}
              name="company_name"
              placeholder="e.g. Google, TCS, Infosys"
              onChange={handleChange}
              list="company-list"
            />
            <datalist id="company-list">
              <option value="Google" />
              <option value="Microsoft" />
              <option value="Amazon" />
              <option value="Apple" />
              <option value="Meta" />
              <option value="Netflix" />
              <option value="TCS" />
              <option value="Infosys" />
              <option value="Wipro" />
              <option value="HCL Technologies" />
              <option value="Tech Mahindra" />
              <option value="Accenture" />
              <option value="Cognizant" />
              <option value="Capgemini" />
              <option value="IBM" />
              <option value="Oracle" />
              <option value="SAP" />
              <option value="Deloitte" />
              <option value="Flipkart" />
              <option value="Swiggy" />
              <option value="Zomato" />
              <option value="Paytm" />
              <option value="Razorpay" />
              <option value="PhonePe" />
              <option value="Freshworks" />
              <option value="Zoho" />
              <option value="Myntra" />
              <option value="CRED" />
              <option value="Groww" />
              <option value="Zerodha" />
              <option value="Samsung" />
              <option value="Intel" />
              <option value="Nvidia" />
              <option value="Salesforce" />
              <option value="Adobe" />
              <option value="Spotify" />
              <option value="LinkedIn" />
              <option value="Uber" />
              <option value="Airbnb" />
              <option value="Stripe" />
              <option value="Shopify" />
            </datalist>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Job Role *</label>
            <input
              style={styles.input}
              name="job_role"
              placeholder="e.g. Frontend Developer"
              onChange={handleChange}
              list="job-roles"
            />
            <datalist id="job-roles">
              <option value="Frontend Developer" />
              <option value="React Developer" />
              <option value="Angular Developer" />
              <option value="Vue.js Developer" />
              <option value="Backend Developer" />
              <option value="Node.js Developer" />
              <option value="Python Developer" />
              <option value="Java Developer" />
              <option value="Full Stack Developer" />
              <option value="MERN Stack Developer" />
              <option value="Mobile Developer" />
              <option value="Android Developer" />
              <option value="iOS Developer" />
              <option value="React Native Developer" />
              <option value="Flutter Developer" />
              <option value="Data Analyst" />
              <option value="Data Scientist" />
              <option value="Machine Learning Engineer" />
              <option value="AI Engineer" />
              <option value="DevOps Engineer" />
              <option value="Cloud Engineer" />
              <option value="UI/UX Designer" />
              <option value="QA Engineer" />
              <option value="Product Manager" />
              <option value="Business Analyst" />
              <option value="Software Engineer" />
              <option value="Cybersecurity Analyst" />
              <option value="Blockchain Developer" />
              <option value="Game Developer" />
              <option value="Database Administrator" />
            </datalist>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>💰 Salary Range</label>
            <select style={styles.input} name="salary_range" onChange={handleChange}>
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
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Status</label>
            <select style={styles.input} name="status" onChange={handleChange}>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>📅 Applied Date</label>
            <p style={styles.hint}>The date you submitted your resume or application</p>
            <input style={styles.input} name="applied_date" type="date" onChange={handleChange} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>🗓️ Interview Date</label>
            <p style={styles.hint}>Fill this when you get an interview call — you'll get a browser notification!</p>
            <input style={styles.input} name="interview_date" type="date" onChange={handleChange} />
          </div>

          <div style={styles.sectionTitle}>
            👤 Company HR / Recruiter Details
            <span style={{ fontSize: '11px', fontWeight: 'normal', color: '#888', marginLeft: '8px' }}>
              (Fill this when company contacts you)
            </span>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>HR / Recruiter Name</label>
            <input style={styles.input} name="contact_person" placeholder="e.g. Priya (HR Manager at Google)" onChange={handleChange} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>HR Phone Number</label>
            <input style={styles.input} name="contact_phone" placeholder="e.g. +91 9876543210" onChange={handleChange} type="tel" />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>HR Email Address</label>
            <input style={styles.input} name="contact_email" placeholder="e.g. hr@google.com" onChange={handleChange} type="email" />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>📝 Notes</label>
            <textarea style={styles.textarea} name="notes" placeholder="e.g. Prepare DSA, HR was friendly, 3 rounds" onChange={handleChange} />
          </div>

          <button style={styles.button} onClick={handleSubmit}>Add Job ✅</button>

        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    width: '500px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: { margin: 0, color: '#1a1a2e' },
  close: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#e94560',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    backgroundColor: '#f0f2f5',
    padding: '10px',
    borderRadius: '8px',
    marginTop: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  hint: {
    fontSize: '11px',
    color: '#888',
    margin: '0 0 4px 0',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    height: '80px',
    outline: 'none',
    resize: 'none',
  },
  button: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '8px',
  },
};

export default AddJobModal;