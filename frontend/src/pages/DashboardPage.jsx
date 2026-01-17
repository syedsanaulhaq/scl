import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, BookOpen, AlertCircle, Eye, DollarSign, ShoppingCart, Activity } from 'lucide-react';
import { authService } from '../services/authService';

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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className={`text-sm mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'User'}</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total views"
            value={stats.totalViews}
            change="0.43%"
            trend="up"
            icon={Eye}
            color="bg-blue-600"
          />
          <StatCard
            title="Total Profit"
            value={stats.totalProfit}
            change="4.35%"
            trend="up"
            icon={DollarSign}
            color="bg-green-600"
          />
          <StatCard
            title="Total Product"
            value={stats.totalProduct}
            change="2.59%"
            trend="up"
            icon={ShoppingCart}
            color="bg-purple-600"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            change="0.95%"
            trend="down"
            icon={Users}
            color="bg-orange-600"
          />
        </div>

        {/* Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Overdue</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Reopened</p>
            <p className="text-2xl font-bold text-red-600">1</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Open Bugs</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Pull Requests</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Vulnerabilities</p>
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
              <p className="text-gray-600 text-sm">12.04.2022 - 12.05.2022</p>
            </div>
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
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit this week</h3>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visitors Analytics */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Visitors Analytics</h3>
              <select className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Direct</span>
                  <span className="text-sm font-medium text-gray-700">80%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Organic</span>
                  <span className="text-sm font-medium text-gray-700">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Paid</span>
                  <span className="text-sm font-medium text-gray-700">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Region Labels */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Region Labels</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">North America</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-sm font-medium text-gray-900">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Europe</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  <span className="text-sm font-medium text-gray-900">30%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Asia Pacific</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  <span className="text-sm font-medium text-gray-900">20%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Others</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                  <span className="text-sm font-medium text-gray-900">5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
