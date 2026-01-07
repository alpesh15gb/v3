import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, BarChart } from 'lucide-react';

const ReportsDashboard: React.FC = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Reports & Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <Link to="/reports/daily" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Daily Attendance</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                        View detailed attendance status for all employees for a specific date. Includes In/Out times and late/early status.
                    </p>
                </Link>

                <Link to="/reports/monthly" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4">
                            <Calendar size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Monthly Register</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                        View attendance summary for the entire month in a matrix format. Useful for payroll processing.
                    </p>
                </Link>

                <div className="bg-white p-6 rounded-lg shadow opacity-60 cursor-not-allowed">
                    <div className="flex items-center mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full mr-4">
                            <BarChart size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Analytics (Coming Soon)</h3>
                    </div>
                    <p className="text-gray-600 text-sm">
                        Visual insights into attendance trends, absenteeism, and overtime analysis.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ReportsDashboard;
