import { Users } from "lucide-react";

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Users Management</h1>
                    <p className=" mt-1">
                        Manage organization users and permissions
                    </p>
                </div>
                <button className="  px-4 py-2 rounded-lg transition-colors">
                    Add User
                </button>
            </div>

            <div className="rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Users List</h2>
                    <div className="space-y-4">
                        {/* Demo user list */}
                        {[
                            { name: 'Admin User', email: 'admin@pharmacare.com', role: 'Admin', status: 'Active' },
                            { name: 'Sales Manager', email: 'sales@pharmacare.com', role: 'Salesman', status: 'Active' },
                            { name: 'John Doe', email: 'john@pharmacare.com', role: 'Staff', status: 'Inactive' }
                        ].map((user, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                        <Users className="h-5 w-5 " />
                                    </div>
                                    <div>
                                        <p className="font-medium ">{user.name}</p>
                                        <p className="text-sm ">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                    <span className="text-sm   px-3 py-1 rounded">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}