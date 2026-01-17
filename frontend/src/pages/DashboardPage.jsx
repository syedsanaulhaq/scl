import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, BookOpen, AlertCircle, Eye, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import * as authService from '../services/authService';
import '../styles/dashboard.css';

// Sample data for charts
const revenueData = [
  { name: 'Sep', total: 25, sales: 30 },
  { name: 'Oct', total: 30, sales: 25 },
  { name: 'Nov', total: 35, sales: 40 },
  { name: 'Dec', total: 45, sales: 35 },
  { name: 'Jan', total: 40, sales: 50 },
  { name: 'Feb', total: 50, sales: 45 },
  { name: 'Mar', total: 45, sales: 55 },
  { name: 'Apr', total: 55, sales: 50 },
  { name: 'May', total: 60, sales: 65 },
  { name: 'Jun', total: 65, sales: 60 },
  { name: 'Jul', total: 70, sales: 75 },
  { name: 'Aug', total: 75, sales: 70 },
];

const profitData = [
  { day: 'M', sales: 75, revenue: 50 },
  { day: 'T', sales: 60, revenue: 45 },
  { day: 'W', sales: 80, revenue: 60 },
  { day: 'T', sales: 70, revenue: 55 },
  { day: 'F', sales: 90, revenue: 75 },
  { day: 'S', sales: 65, revenue: 50 },
  { day: 'S', sales: 85, revenue: 65 },
];

const COLORS = ['#3B82F6', '#10B981'];

const StatCard = ({ title, value, change, trend, icon: Icon, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <p className="stat-card-label">{title}</p>
        <p className="stat-card-value">{value}</p>
        <p className={`stat-card-change ${trend === 'up' ? 'up' : 'down'}`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </p>
      </div>
      <div className={`stat-card-icon ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

const ProgressBar = ({ label, percentage, color }) => {
  return (
    <div className="progress-item">
      <div className="progress-label">
        <span className="progress-label-text">{label}</span>
        <span className="progress-label-value">{percentage}</span>
      </div>
      <div className="progress-bar">
        <div className={`progress-fill ${color}`} style={{ width: percentage }}></div>
      </div>
    </div>
  );
};

const RegionItem = ({ label, percentage, color }) => {
  return (
    <div className="region-item">
      <span className="region-label">{label}</span>
      <div className="region-value">
        <div className={`region-dot`} style={{
          backgroundColor: color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : color === 'purple' ? '#a855f7' : '#f97316'
        }}></div>
        <span className="region-percentage">{percentage}</span>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalViews: '$3,456k',
    totalProfit: '$45.2k',
    totalProduct: 2450,
    totalUsers: 3456
  });

  useEffect(() => {
    // Get user profile on mount
    const loadUserProfile = async () => {
      try {
        const profileResponse = await authService.getProfile();
        setUser(profileResponse.user);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadUserProfile();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-content">
          <div className="flex-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'User'}</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '100%' }}>
        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
          padding: '0 1rem'
        }}>
          <StatCard
            title="Total views"
            value={stats.totalViews}
            change="0.43%"
            trend="up"
            icon={Eye}
            color="blue"
          />
          <StatCard
            title="Total Profit"
            value={stats.totalProfit}
            change="4.35%"
            trend="up"
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Total Product"
            value={stats.totalProduct}
            change="2.59%"
            trend="up"
            icon={ShoppingCart}
            color="purple"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            change="0.95%"
            trend="down"
            icon={Users}
            color="orange"
          />
        </div>

        {/* Metrics Summary */}
        <div className="summary-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '0 1rem'
        }}>
          <div className="summary-card">
            <p className="summary-card-label">Overdue</p>
            <p className="summary-card-value">0</p>
          </div>
          <div className="summary-card">
            <p className="summary-card-label">Reopened</p>
            <p className="summary-card-value red">1</p>
          </div>
          <div className="summary-card">
            <p className="summary-card-label">Open Bugs</p>
            <p className="summary-card-value">0</p>
          </div>
          <div className="summary-card">
            <p className="summary-card-label">Pull Requests</p>
            <p className="summary-card-value">0</p>
          </div>
          <div className="summary-card">
            <p className="summary-card-label">Vulnerabilities</p>
            <p className="summary-card-value">0</p>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
          padding: '0 1rem'
        }}>
          {/* Total Revenue Chart */}
          <div className="chart-container" style={{ gridColumn: 'span 2' }}>
            <h3 className="chart-title">Total Revenue</h3>
            <p className="chart-subtitle">12.04.2022 - 12.05.2022</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#3B82F6" name="Total Revenue" />
                <Line type="monotone" dataKey="sales" stroke="#10B981" name="Total Sales" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Profit This Week */}
          <div className="chart-container">
            <h3 className="chart-title">Profit this week</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3B82F6" />
                <Bar dataKey="revenue" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="analytics-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.5rem',
          padding: '0 1rem'
        }}>
          {/* Visitors Analytics */}
          <div className="analytics-card">
            <div className="analytics-header">
              <h3 className="analytics-title">Visitors Analytics</h3>
              <select className="analytics-select">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
            <div>
              <ProgressBar label="Direct" percentage={80} color="blue" />
              <ProgressBar label="Organic" percentage={60} color="green" />
              <ProgressBar label="Paid" percentage={45} color="purple" />
            </div>
          </div>

          {/* Region Labels */}
          <div className="analytics-card">
            <h3 className="analytics-title">Region Labels</h3>
            <div style={{ marginTop: '1rem' }}>
              <RegionItem label="North America" percentage="45%" color="blue" />
              <RegionItem label="Europe" percentage="30%" color="green" />
              <RegionItem label="Asia Pacific" percentage="20%" color="purple" />
              <RegionItem label="Others" percentage="5%" color="orange" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
