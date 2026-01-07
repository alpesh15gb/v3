import React, { useEffect, useState } from 'react';
import { processAttendance, getDailyAttendance } from '../../services/api';
import { RefreshCw, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';

const AttendanceDashboard: React.FC = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadData();
    }, [date]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getDailyAttendance(date);
            setRecords(data);
        } catch (error) {
            console.error("Failed to fetch attendance", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = async () => {
        setProcessing(true);
        try {
            await processAttendance(date);
            await loadData();
            alert("Processing completed!");
        } catch (error) {
            console.error("Processing failed", error);
            alert("Processing failed. Check console.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Attendance Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-white border rounded px-3 py-2">
                        <CalendarIcon size={18} className="text-gray-500 mr-2" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="outline-none"
                        />
                    </div>
                    <button
                        onClick={handleProcess}
                        disabled={processing}
                        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center hover:bg-blue-700 disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={`mr-2 ${processing ? 'animate-spin' : ''}`} />
                        {processing ? 'Processing...' : 'Process Day'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={6} className="p-6 text-center">Loading...</td></tr>
                        ) : records.length === 0 ? (
                            <tr><td colSpan={6} className="p-6 text-center text-gray-500">No records found for this date.</td></tr>
                        ) : (
                            records.map((rec) => (
                                <tr key={rec.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{rec.employee?.firstName} {rec.employee?.lastName}</div>
                                        <div className="text-xs text-gray-500">{rec.employee?.employeeCode}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.shift?.name || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {rec.inTime ? new Date(rec.inTime).toLocaleTimeString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {rec.outTime ? new Date(rec.outTime).toLocaleTimeString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec.totalHours?.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${rec.status === 'PRESENT' ? 'bg-green-100 text-green-800' :
                                                rec.status === 'ABSENT' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {rec.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceDashboard;
