import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, BookOpen, GraduationCap, BarChart } from 'lucide-react';

const AdminDashboard = () => {
    const stats = [
        { title: 'Total Users', value: '124', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { title: 'Active Students', value: '98', icon: GraduationCap, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { title: 'Courses', value: '12', icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { title: 'Revenue', value: '$12,450', icon: BarChart, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="bg-card border-border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bg}`}>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">+20% from last month</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-muted-foreground text-sm">Activity feed placeholder...</div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-foreground">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-muted-foreground text-sm">Action buttons placeholder...</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
