import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, MapPin, Users, Calendar, ClipboardList, Briefcase, UserCheck, FileText } from 'lucide-react';

const Layout: React.FC = () => {
    const location = useLocation();

    // Define navigation items
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { type: 'heading', label: 'Master Data' },
        { icon: Building2, label: 'Companies', path: '/companies' },
        { icon: Building2, label: 'Branches', path: '/branches' },
        { icon: MapPin, label: 'Locations', path: '/locations' },
        { icon: Briefcase, label: 'Departments', path: '/departments' },
        { icon: UserCheck, label: 'Designations', path: '/designations' },
        { type: 'heading', label: 'HR & Ops' },
        { icon: Users, label: 'Employees', path: '/employees' },
        { icon: Calendar, label: 'Shifts', path: '/shifts' },
        { icon: ClipboardList, label: 'Attendance', path: '/attendance' },
        { icon: Calendar, label: 'Leaves', path: '/leaves' },
        { icon: FileText, label: 'Reports', path: '/reports' },
    ];

    const isActive = (path: string) => location.pathname.startsWith(path) ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white';

    const handleLogout = () => {
        // Implement logout logic here
        console.log('Logging out...');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold">Attendance V3</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link to="/" className={`flex items-center space-x-3 px-4 py-3 rounded transition ${location.pathname === '/' ? 'bg-slate-700' : 'hover:bg-slate-800'}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>

                    <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Master Data
                    </div>
                    <Link to="/companies" className={`flex items-center space-x-3 px-4 py-3 rounded transition ${isActive('/companies')}`}>
                        <Building2 size={20} />
                        <span>Companies</span>
                    </Link>
                    <Link to="/branches" className={`flex items-center space-x-3 px-4 py-3 rounded transition ${isActive('/branches')}`}>
                        <Building2 size={20} />
                        <span>Branches</span>
                    </Link>
                    <Link to="/locations" className={`flex items-center space-x-3 px-4 py-3 rounded transition ${isActive('/locations')}`}>
                        <MapPin size={20} />
                        <span>Locations</span>
                    </Link>
                    <Link to="/departments" className={`flex items-center space-x-3 px-4 py-3 rounded transition ${isActive('/departments')}`}>
                        <Briefcase size={20} />
                        <span>Departments</span>
                    </Link>
                    <Link to="/designations" className={`flex items-center space-x-3 px-4 py-3 rounded transition ${isActive('/designations')}`}>
                        <UserCheck size={20} />
                        <span>Designations</span>
                    </Link>

                    <div className="pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        HR & Ops
                    </div>
                    <Link to="/employees" className={`flex items-center space-x-3 px-4 py-3 rounded transition ${isActive('/employees')}`}>
                        <Users size={20} />
                        <span>Employees</span>
                    </Link>
                    <Link to="/shifts" className={`flex items-center space-x-3 px-4 py-3 rounded transition ${isActive('/shifts')}`}>
                        <Calendar size={20} />
                        <span>Shifts</span>
                    </Link>
                    <Link to="/attendance" className={`flex items-center space-x-3 px-4 py-3 rounded transition ${isActive('/attendance')}`}>
                        <ClipboardList size={20} />
                        <span>Attendance</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-medium">Admin User</p>
                            <p className="text-xs text-slate-400">admin@company.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
