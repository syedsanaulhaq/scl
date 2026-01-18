import React, { useState } from 'react';
import {
  Eye,
  DollarSign,
  ShoppingCart,
  Users,
  BarChart3,
  PieChart,
} from 'lucide-react';

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('Monthly');

  const statCards = [
    {
      id: 1,
      label: 'Total Views',
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
    <div className="page-wrapper">
      <div className="container-fluid">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h1 className="page-title h3 text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome back, User</p>
            </div>
            <button className="btn-primary">Generate Report</button>
          </div>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className="card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm font-medium mb-2">{card.label}</p>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{card.value}</h3>
                      <p
                        className={`text-sm font-semibold ${
                          card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {card.trend === 'up' ? '↑' : '↓'} {card.change}
                      </p>
                    </div>
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        card.iconColor === 'blue'
                          ? 'bg-blue-100 text-blue-600'
                          : card.iconColor === 'green'
                          ? 'bg-green-100 text-green-600'
                          : card.iconColor === 'purple'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      <IconComponent size={24} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {summaryData.map((item, index) => (
            <div key={index} className="card text-center">
              <div className="card-body">
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">{item.label}</p>
                <p
                  className={`text-2xl font-bold ${
                    item.isRed ? 'text-red-600' : 'text-gray-900'
                  }`}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 card">
            <div className="card-header">
              <h3 className="card-title">Total Revenue</h3>
              <p className="text-sm text-gray-600">12.04.2022 - 12.05.2022</p>
            </div>
            <div className="card-body">
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center flex-col gap-3">
                <BarChart3 size={48} className="text-gray-400" />
                <p className="text-gray-500 font-medium">Line Chart - Revenue vs Sales</p>
              </div>
            </div>
          </div>

          {/* Profit Chart */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Profit this week</h3>
            </div>
            <div className="card-body">
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center flex-col gap-3">
                <PieChart size={48} className="text-gray-400" />
                <p className="text-gray-500 font-medium">Bar Chart</p>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Visitors Analytics */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <h3 className="card-title">Visitors Analytics</h3>
                <select
                  className="search-input text-sm"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
              </div>
            </div>
            <div className="card-body space-y-4">
              {visitorsAnalytics.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                    <span className="text-sm font-bold text-gray-600">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
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

          {/* Region Data */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Region Labels</h3>
            </div>
            <div className="card-body space-y-4">
              {regionData.map((region, index) => (
                <div key={index} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-b-0">
                  <span className="text-sm font-semibold text-gray-700">{region.label}</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: region.color }}
                    ></div>
                    <span className="text-sm font-bold text-gray-600">{region.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
