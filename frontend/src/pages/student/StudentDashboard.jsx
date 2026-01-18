import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, Clock, Award } from 'lucide-react';

const StudentDashboard = () => {
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white">Student Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Enrolled Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">4</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Hours Learned</CardTitle>
                        <Clock className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">12.5</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Completed</CardTitle>
                        <Award className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">1</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">My Learning Path</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-slate-400">Course list placeholder...</div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentDashboard;
