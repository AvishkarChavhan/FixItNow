import React from 'react';

const AdminPortal = () => {
  const stats = [
    { label: 'Total Issues', value: '1,245', borderColor: 'border-l-primary' },
    { label: 'Resolved Issues', value: '987', borderColor: 'border-l-secondary' },
    { label: 'Pending Issues', value: '258', borderColor: 'border-l-accent' },
    { label: 'Staff on Duty', value: '45', borderColor: 'border-l-blue-400' },
    { label: 'New Reports (Today)', value: '22', borderColor: 'border-l-purple-400' },
    { label: 'Predictive Insights', value: 'High demand in Q4', borderColor: 'border-l-red-400', isText: true }
  ];

  const issues = [
    {
      id: 1,
      title: 'Broken Streetlight',
      status: 'Pending',
      description: 'Streetlight on khradi is not working, reported by citizen.',
      timeAgo: '1 hour ago',
      department: 'Infrastructure',
      statusClass: 'bg-red-400 text-white'
    },
    {
      id: 2,
      title: 'Water Leakage',
      status: 'In Progress',
      description: 'Leak in the main water pipe on highstreet',
      timeAgo: '3 hours ago',
      department: 'Utilities',
      statusClass: 'status-in-progress'
    }
  ];

  return (
    <div className="portal-section fade-in">
      <h2 className="section-title">
        Admin Dashboard
      </h2>
      
      {/* Statistics Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.borderColor}`}>
            <p className="stat-label">{stat.label}</p>
            <p className={`stat-value ${stat.isText ? 'text-xl' : ''}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      
      {/* Issue Management Section */}
      <div className="mt-8">
        <h2 className="section-title">
          Issue Management
        </h2>
        
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue.id} className="issue-card">
              <h3 className="issue-title">{issue.title}</h3>
              <span className={`status-badge ${issue.statusClass}`}>
                {issue.status}
              </span>
              <p className="issue-description">{issue.description}</p>
              <div className="issue-meta">
                <span>{issue.timeAgo}</span>
                <span>{issue.department}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;