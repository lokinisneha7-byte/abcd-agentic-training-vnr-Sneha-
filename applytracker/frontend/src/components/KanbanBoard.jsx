import React from 'react';
import JobCard from './JobCard';

const columns = ['Applied', 'Interview', 'Offer', 'Rejected'];

const columnColors = {
  Applied: '#f9c74f',
  Interview: '#4cc9f0',
  Offer: '#4caf50',
  Rejected: '#e94560',
};

const columnIcons = {
  Applied: '📝',
  Interview: '📞',
  Offer: '🎉',
  Rejected: '❌',
};

function KanbanBoard({ jobs, fetchJobs, search }) {
  const filteredJobs = (col) => {
    if (!jobs || jobs.length === 0) return [];
    return jobs.filter(j => {
      if (!j || j.status !== col) return false;
      if (!search || search === '') return true;
      const company = j.company_name ? j.company_name.toLowerCase() : '';
      const role = j.job_role ? j.job_role.toLowerCase() : '';
      const searchLower = search.toLowerCase();
      return company.includes(searchLower) || role.includes(searchLower);
    });
  };

  return (
    <div style={styles.board}>
      {columns.map(col => (
        <div style={styles.column} key={col}>
          {/* Column Header */}
          <div style={{ ...styles.columnHeader, borderLeft: `4px solid ${columnColors[col]}` }}>
            <span style={styles.columnIcon}>{columnIcons[col]}</span>
            <h3 style={styles.columnTitle}>{col}</h3>
            <span style={{ ...styles.count, backgroundColor: columnColors[col] }}>
              {filteredJobs(col).length}
            </span>
          </div>

          {/* Job Cards */}
          <div style={styles.cardList}>
            {filteredJobs(col).length === 0 ? (
              <div style={styles.empty}>
                <p style={styles.emptyIcon}>📭</p>
                <p style={styles.emptyText}>No jobs here yet</p>
              </div>
            ) : (
              filteredJobs(col).map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  index={index}
                  fetchJobs={fetchJobs}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    width: '100%',
  },
  column: {
    backgroundColor: '#f8f9fa',
    borderRadius: '14px',
    padding: '12px',
    minHeight: '400px',
    maxHeight: '75vh',
    overflowY: 'auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'white',
    padding: '10px 12px',
    borderRadius: '10px',
    marginBottom: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  columnIcon: {
    fontSize: '16px',
  },
  columnTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    flex: 1,
  },
  count: {
    color: 'white',
    borderRadius: '20px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  empty: {
    textAlign: 'center',
    padding: '30px 0',
  },
  emptyIcon: {
    fontSize: '28px',
    margin: '0 0 8px 0',
  },
  emptyText: {
    color: '#aaa',
    fontSize: '13px',
    margin: 0,
  },
};

export default KanbanBoard;