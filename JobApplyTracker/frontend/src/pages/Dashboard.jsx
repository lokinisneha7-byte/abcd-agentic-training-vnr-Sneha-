import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  const total = jobs.length;
  const applied = jobs.filter(j => j.status === 'Applied').length;
  const interview = jobs.filter(j => j.status === 'Interview').length;
  const offer = jobs.filter(j => j.status === 'Offer').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;
  const successRate = total > 0 ? ((offer / total) * 100).toFixed(1) : 0;

  const cards = [
    { label: 'Total Applied', value: total, color: '#4361ee', icon: '📨', bg: 'linear-gradient(135deg, #4361ee, #3a0ca3)' },
    { label: 'Waiting', value: applied, color: '#f9c74f', icon: '⏳', bg: 'linear-gradient(135deg, #f9c74f, #f3722c)' },
    { label: 'Interviews', value: interview, color: '#4cc9f0', icon: '📞', bg: 'linear-gradient(135deg, #4cc9f0, #4361ee)' },
    { label: 'Offers', value: offer, color: '#4caf50', icon: '🎉', bg: 'linear-gradient(135deg, #4caf50, #2d6a4f)' },
    { label: 'Rejected', value: rejected, color: '#e94560', icon: '❌', bg: 'linear-gradient(135deg, #e94560, #c1121f)' },
  ];

  const followUp = jobs.filter(j => {
    if (!j.applied_date) return false;
    const days = Math.floor((new Date() - new Date(j.applied_date)) / (1000 * 60 * 60 * 24));
    return days > 7 && j.status === 'Applied';
  });

  return (
    <div style={styles.container}>

      {/* Welcome */}
      <div style={styles.welcomeBox}>
        <div>
          <h1 style={styles.welcomeTitle}>Welcome Back! 👋</h1>
          <p style={styles.welcomeSub}>Track your job applications and stay organized</p>
        </div>
        <div style={styles.successRate}>
          <div style={styles.rateNumber}>{successRate}%</div>
          <div style={styles.rateLabel}>Success Rate</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.cards}>
        {cards.map(card => (
          <div key={card.label} style={{ ...styles.card, background: card.bg }}>
            <div style={styles.cardIcon}>{card.icon}</div>
            <div style={styles.cardNumber}>{card.value}</div>
            <div style={styles.cardLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Follow Up Alert */}
      {followUp.length > 0 && (
        <div style={styles.alertBox}>
          <h3 style={styles.alertTitle}>⚠️ Follow Up Needed!</h3>
          <p style={styles.alertSub}>These companies haven't responded in 7+ days:</p>
          <div style={styles.alertList}>
            {followUp.map(job => (
              <div key={job.id} style={styles.alertItem}>
                <span>🏢 {job.company_name}</span>
                <span style={styles.alertRole}>{job.job_role}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Applications */}
      <div style={styles.recentBox}>
        <h2 style={styles.recentTitle}>📋 Recent Applications</h2>
        {jobs.slice(0, 5).map(job => (
          <div key={job.id} style={styles.recentItem}>
            <div>
              <div style={styles.recentCompany}>{job.company_name}</div>
              <div style={styles.recentRole}>{job.job_role}</div>
            </div>
            <div style={{
              ...styles.recentStatus,
              backgroundColor:
                job.status === 'Offer' ? '#4caf50' :
                job.status === 'Interview' ? '#4cc9f0' :
                job.status === 'Rejected' ? '#e94560' : '#f9c74f'
            }}>
              {job.status}
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <p style={styles.noJobs}>No applications yet. Go to Board and add your first job! 🚀</p>
        )}
      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: '30px 40px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  welcomeBox: {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    borderRadius: '16px',
    padding: '30px',
    marginBottom: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
  },
  welcomeTitle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 'bold',
  },
  welcomeSub: {
    margin: '8px 0 0 0',
    color: '#aaa',
    fontSize: '14px',
  },
  successRate: {
    textAlign: 'center',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '15px 25px',
  },
  rateNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#4caf50',
  },
  rateLabel: {
    fontSize: '12px',
    color: '#aaa',
    marginTop: '4px',
  },
  cards: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '25px',
  },
  card: {
    flex: 1,
    minWidth: '140px',
    borderRadius: '16px',
    padding: '20px',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
  cardIcon: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  cardNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: '13px',
    opacity: 0.9,
    marginTop: '4px',
  },
  alertBox: {
    backgroundColor: '#fff5f5',
    border: '1px solid #ffccd5',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '25px',
  },
  alertTitle: {
    margin: '0 0 5px 0',
    color: '#e94560',
    fontSize: '16px',
  },
  alertSub: {
    margin: '0 0 12px 0',
    color: '#666',
    fontSize: '13px',
  },
  alertList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  alertItem: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: '10px 15px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  alertRole: {
    color: '#666',
    fontWeight: 'normal',
  },
  recentBox: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  recentTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    color: '#1a1a2e',
  },
  recentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  recentCompany: {
    fontWeight: 'bold',
    color: '#1a1a2e',
    fontSize: '14px',
  },
  recentRole: {
    color: '#666',
    fontSize: '12px',
    marginTop: '2px',
  },
  recentStatus: {
    padding: '4px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  noJobs: {
    textAlign: 'center',
    color: '#aaa',
    padding: '20px',
  },
};

export default Dashboard;