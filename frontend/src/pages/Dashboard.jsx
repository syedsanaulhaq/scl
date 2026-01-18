import React, { useState } from 'react';
import {
  Eye,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  CreditCard,
  Download
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState('Monthly');

  const statCards = [
    {
      id: 1,
      label: 'Total Views',
      value: '345.6k',
      change: '+0.43%',
      trend: 'up',
      icon: Eye,
      description: 'Since last month'
    },
    {
      id: 2,
      label: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
      description: 'Since last month'
    },
    {
      id: 3,
      label: 'New Courses',
      value: '+573',
      change: '+201',
      trend: 'up',
      icon: ShoppingCart,
      description: 'Since last month'
    },
    {
      id: 4,
      label: 'Active Users',
      value: '2,350',
      change: '-5% from last week',
      trend: 'down',
      icon: Users,
      description: 'Since last hour'
    },
  ];

  const revenueData = [
    { name: 'Jan', total: 1500 },
    { name: 'Feb', total: 2300 },
    { name: 'Mar', total: 3200 },
    { name: 'Apr', total: 4500 },
    { name: 'May', total: 3800 },
    { name: 'Jun', total: 5100 },
    { name: 'Jul', total: 4800 },
    { name: 'Aug', total: 5600 },
    { name: 'Sep', total: 6200 },
    { name: 'Oct', total: 7500 },
    { name: 'Nov', total: 8100 },
    { name: 'Dec', total: 9200 },
  ];

  const recentSales = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: "+$1,999.00",
      status: "Success",
      initials: "OM"
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: "+$39.00",
      status: "Pending",
      initials: "JL"
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: "+$299.00",
      status: "Success",
      initials: "IN"
    },
    {
      name: "William Kim",
      email: "will@email.com",
      amount: "+$99.00",
      status: "Success",
      initials: "WK"
    },
    {
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      amount: "+$39.00",
      status: "Rejected",
      initials: "SD"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your institute's performance and analytics.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={card.trend === 'up' ? "text-green-500" : "text-red-500"}>
                    {card.change}
                  </span>
                  {" "}{card.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription>
                Monthly revenue performance for the current year.
              </CardDescription>
              <Select defaultValue="monthly" onValueChange={setTimeframe}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={revenueData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity / Sales */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>
              You made 265 sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-2 ring-background">
                    {sale.initials}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {sale.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 - More Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Completion</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            <div className="h-2 w-full bg-secondary mt-3 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[85%] rounded-full" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5.0</div>
            <p className="text-xs text-muted-foreground">+0.2 from last month</p>
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className={`h-2 flex-1 rounded-full ${star < 5 ? 'bg-primary' : 'bg-secondary'}`} />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">View All</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
