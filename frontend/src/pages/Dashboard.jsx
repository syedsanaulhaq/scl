import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import '../styles/dashboard.css';
import {
  Eye,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
} from 'lucide-react';

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('Monthly');

  const statCards = [
    {
      id: 1,
      label: 'Total views',
      value: '$3,456k',
      change: '0.43%',
      trend: 'up',
      icon: Eye,
      iconColor: 'blue',
    },
    {
      id: 2,
      label: 'Total Profit',
      value: '$45.2k',
      change: '4.35%',
      trend: 'up',
      icon: DollarSign,
      iconColor: 'green',
    },
    {
      id: 3,
      label: 'Total Product',
      value: '2450',
      change: '2.59%',
      trend: 'up',
      icon: ShoppingCart,
      iconColor: 'purple',
    },
    {
      id: 4,
      label: 'Total Users',
      value: '3456',
      change: '0.95%',
      trend: 'down',
      icon: Users,
      iconColor: 'orange',
    },
  ];

  const summaryData = [
    { label: 'Overdue', value: '0' },
    { label: 'Reopened', value: '1', isRed: true },
    { label: 'Open Bugs', value: '0' },
    { label: 'Pull Requests', value: '0' },
    { label: 'Vulnerabilities', value: '0' },
  ];

  const revenueData = [
    { month: 'Sep', revenue: 20, sales: 30 },
    { month: 'Oct', revenue: 25, sales: 15 },
    { month: 'Nov', revenue: 30, sales: 40 },
    { month: 'Dec', revenue: 35, sales: 35 },
    { month: 'Jan', revenue: 30, sales: 45 },
    { month: 'Feb', revenue: 40, sales: 25 },
    { month: 'Mar', revenue: 35, sales: 30 },
    { month: 'Apr', revenue: 45, sales: 25 },
    { month: 'May', revenue: 50, sales: 40 },
    { month: 'Jun', revenue: 55, sales: 35 },
    { month: 'Jul', revenue: 60, sales: 50 },
    { month: 'Aug', revenue: 55, sales: 45 },
  ];

  const profitData = [
    { day: 'M', revenue: 60, sales: 40 },
    { day: 'T', revenue: 45, sales: 50 },
    { day: 'W', revenue: 70, sales: 35 },
    { day: 'T', revenue: 55, sales: 45 },
    { day: 'F', revenue: 80, sales: 60 },
    { day: 'S', revenue: 50, sales: 40 },
    { day: 'S', revenue: 65, sales: 45 },
  ];

  const visitorsAnalytics = [
    { label: 'Direct', value: 80, color: '#3B82F6' },
    { label: 'Organic', value: 60, color: '#10B981' },
    { label: 'Paid', value: 45, color: '#A855F7' },
  ];

  const regionData = [
    { label: 'North America', percentage: '45%', color: '#3B82F6' },
    { label: 'Europe', percentage: '30%', color: '#10B981' },
    { label: 'Asia Pacific', percentage: '20%', color: '#A855F7' },
    { label: 'Others', percentage: '5%', color: '#F97316' },
  ];

  return (
    <main className="app-main">
      <div className="dashboard-container" style={{ padding: '2rem 1rem' }}>
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-content">
            <div className="flex-between">
              <div>
                <h1 className="dashboard-title">Dashboard</h1>
                <p className="dashboard-subtitle">Welcome back, User</p>
              </div>
              <button className="btn-generate-report">Generate Report</button>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stat-cards-grid">
          {statCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div key={card.id} className="stat-card">
                <div className="stat-card-content">
                  <p className="stat-card-label">{card.label}</p>
                  <p className="stat-card-value">{card.value}</p>
                  <p className={`stat-card-change ${card.trend}`}>
                    {card.trend === 'up' ? '↑' : '↓'} {card.change}
                  </p>
                </div>
                <div className={`stat-card-icon ${card.iconColor}`}>
                  <IconComponent size={24} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Grid */}
        <div className="summary-grid">
          {summaryData.map((item, index) => (
            <div key={index} className="summary-card">
              <p className="summary-card-label">{item.label}</p>
              <p className={`summary-card-value ${item.isRed ? 'red' : ''}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Revenue Chart */}
          <div className="chart-container revenue-chart">
            <h3 className="chart-title">Total Revenue</h3>
            <p className="chart-subtitle">12.04.2022 - 12.05.2022</p>
            <div className="chart-placeholder">
              <BarChart3 size={48} />
              <p>Line Chart - Revenue vs Sales</p>
            </div>
          </div>

          {/* Profit Chart */}
          <div className="chart-container profit-chart">
            <h3 className="chart-title">Profit this week</h3>
            <div className="chart-placeholder">
              <PieChart size={48} />
              <p>Bar Chart - Revenue vs Sales</p>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-grid">
          {/* Visitors Analytics */}
          <div className="analytics-card">
            <div className="analytics-header">
              <h3 className="analytics-title">Visitors Analytics</h3>
              <select
                className="analytics-select"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
            <div className="analytics-content">
              {visitorsAnalytics.map((item, index) => (
                <div key={index} className="progress-item">
                  <div className="progress-label">
                    <span className="progress-label-text">{item.label}</span>
                    <span className="progress-label-value">{item.value}</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${item.value}px`,
                        backgroundColor: item.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Region Labels */}
          <div className="analytics-card">
            <h3 className="analytics-title">Region Labels</h3>
            <div className="region-section">
              {regionData.map((region, index) => (
                <div key={index} className="region-item">
                  <span className="region-label">{region.label}</span>
                  <div className="region-value">
                    <div
                      className="region-dot"
                      style={{ backgroundColor: region.color }}
                    ></div>
                    <span className="region-percentage">{region.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
