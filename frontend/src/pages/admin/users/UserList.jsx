import React, { useEffect } from 'react';
import useUserStore from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash } from 'lucide-react';

const UserList = () => {
    const { users, fetchUsers, isLoading, pagination, deleteUser } = useUserStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await deleteUser(id);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">All Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-border">
                        <table className="w-full text-sm text-left text-muted-foreground">
                            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center">Loading...</td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center">No users found</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                                            <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' :
                                                    user.role === 'faculty' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {user.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-4 w-4 text-blue-400" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-300">
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserList;
