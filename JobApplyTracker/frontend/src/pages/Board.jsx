import React, { useEffect, useState } from 'react';
import axios from 'axios';
import KanbanBoard from '../components/KanbanBoard';
import AddJobModal from '../components/AddJobModal';

const sampleJobs = [
  { company_name: 'Google', job_role: 'Frontend Developer', salary_range: '20+ LPA', status: 'Applied', applied_date: '2026-02-10', contact_person: 'Priya', contact_phone: '+91 9876543210', contact_email: 'hr@google.com', notes: 'Prepare DSA and system design' },
  { company_name: 'Microsoft', job_role: 'Full Stack Developer', salary_range: '15 - 20 LPA', status: 'Interview', applied_date: '2026-02-05', interview_date: '2026-02-25', contact_person: 'Rahul', contact_phone: '+91 9123456789', contact_email: 'hr@microsoft.com', notes: '3 rounds - coding, system design, HR' },
  { company_name: 'Infosys', job_role: 'React Developer', salary_range: '5 - 8 LPA', status: 'Offer', applied_date: '2026-01-20', contact_person: 'Sneha', contact_phone: '+91 9988776655', contact_email: 'hr@infosys.com', notes: 'Got offer letter!' },
  { company_name: 'TCS', job_role: 'Software Engineer', salary_range: '3 - 5 LPA', status: 'Rejected', applied_date: '2026-01-15', contact_person: 'Amit', notes: 'Did not clear coding round' },
  { company_name: 'Flipkart', job_role: 'Backend Developer', salary_range: '12 - 15 LPA', status: 'Applied', applied_date: '2026-02-18', contact_person: 'Neha', contact_email: 'hr@flipkart.com', notes: 'Applied via LinkedIn' },
];

function Board() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchJobs = () => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const loadSampleData = () => {
    setLoading(true);
    Promise.all(sampleJobs.map(job =>
      axios.post('http://localhost:5000/api/jobs', job)
    )).then(() => {
      fetchJobs();
      setLoading(false);
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Job Board 📋</h1>
        <div style={styles.actions}>
          <input
            style={styles.search}
            placeholder="🔍 Search company or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button style={styles.sampleBtn} onClick={loadSampleData}>
            {loading ? '⏳ Loading...' : '📂 Load Sample Data'}
          </button>
          <button style={styles.addBtn} onClick={() => setShowModal(true)}>
            + Add Job
          </button>
        </div>
      </div>

      <KanbanBoard jobs={jobs} fetchJobs={fetchJobs} search={search} />

      {showModal && (
        <AddJobModal
          onClose={() => setShowModal(false)}
          fetchJobs={fetchJobs}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 40px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  search: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    width: '220px',
    backgroundColor: 'white',
  },
  sampleBtn: {
    backgroundColor: '#4361ee',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default Board;