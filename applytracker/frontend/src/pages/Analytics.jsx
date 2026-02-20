import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Analytics() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  const applied = jobs.filter(j => j.status === 'Applied').length;
  const interview = jobs.filter(j => j.status === 'Interview').length;
  const offer = jobs.filter(j => j.status === 'Offer').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;

  const pieData = {
    labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
    datasets: [{
      data: [applied, interview, offer, rejected],
      backgroundColor: ['#f9c74f', '#4cc9f0', '#4caf50', '#e94560'],
      borderWidth: 0,
    }],
  };

  const barData = {
    labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
    datasets: [{
      label: 'Jobs',
      data: [applied, interview, offer, rejected],
      backgroundColor: ['#f9c74f', '#4cc9f0', '#4caf50', '#e94560'],
      borderRadius: 8,
    }],
  };

  const successRate = jobs.length > 0 ? ((offer / jobs.length) * 100).toFixed(1) : 0;
  const interviewRate = jobs.length > 0 ? ((interview / jobs.length) * 100).toFixed(1) : 0;
  const rejectionRate = jobs.length > 0 ? ((rejected / jobs.length) * 100).toFixed(1) : 0;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Analytics 📊</h1>

      {/* Summary Cards */}
      <div style={styles.summaryCards}>
        <div style={{ ...styles.summaryCard, borderTop: '4px solid #4caf50' }}>
          <div style={styles.summaryNumber}>{successRate}%</div>
          <div style={styles.summaryLabel}>Success Rate</div>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: '4px solid #4cc9f0' }}>
          <div style={styles.summaryNumber}>{interviewRate}%</div>
          <div style={styles.summaryLabel}>Interview Rate</div>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: '4px solid #e94560' }}>
          <div style={styles.summaryNumber}>{rejectionRate}%</div>
          <div style={styles.summaryLabel}>Rejection Rate</div>
        </div>
        <div style={{ ...styles.summaryCard, borderTop: '4px solid #4361ee' }}>
          <div style={styles.summaryNumber}>{jobs.length}</div>
          <div style={styles.summaryLabel}>Total Applications</div>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.charts}>
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Application Status</h3>
          <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Status Breakdown</h3>
          <Bar data={barData} options={{
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
          }} />
        </div>
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
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: '25px',
  },
  summaryCards: {
    display: 'flex',
    gap: '15px',
    flexWrap: 'wrap',
    marginBottom: '30px',
  },
  summaryCard: {
    flex: 1,
    minWidth: '140px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  summaryNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#666',
    marginTop: '5px',
  },
  charts: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  chartBox: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  },
  chartTitle: {
    margin: '0 0 20px 0',
    color: '#1a1a2e',
    fontSize: '16px',
  },
};

export default Analytics;