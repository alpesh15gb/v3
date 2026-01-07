import React, { useEffect, useState } from 'react';
import { getMonthlyReport } from '../../services/api';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';

const MonthlyReport: React.FC = () => {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, [month, year]);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await getMonthlyReport(month, year);
            setData(result);
        } catch (error) {
            console.error("Failed to fetch report", error);
        } finally {
            setLoading(false);
        }
    };

    const changeMonth = (delta: number) => {
        let newMonth = month + delta;
        let newYear = year;
        if (newMonth > 12) { newMonth = 1; newYear++; }
        if (newMonth < 1) { newMonth = 12; newYear--; }
        setMonth(newMonth);
        setYear(newYear);
    };

    // Generate days for table header
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Monthly Attendance Register</h1>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-white border rounded px-2 py-1">
                        <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} /></button>
                        <span className="mx-3 font-medium min-w-[100px] text-center">
                            {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
                    </div>
                    <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center hover:bg-green-700">
                        <Download size={18} className="mr-2" /> Export
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 w-48">Employee</th>
                            {daysArray.map(d => (
                                <th key={d} className="px-1 py-3 text-center font-medium text-gray-500 w-8">{d}</th>
                            ))}
                            <th className="px-2 py-3 text-center font-medium text-gray-900 bg-gray-100">P</th>
                            <th className="px-2 py-3 text-center font-medium text-gray-900 bg-gray-100">A</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={daysInMonth + 3} className="p-6 text-center">Loading...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={daysInMonth + 3} className="p-6 text-center text-gray-500">No data available for this month.</td></tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.id}>
                                    <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white z-10 border-r">
                                        <div className="font-medium text-gray-900">{row.name}</div>
                                        <div className="text-[10px] text-gray-500">{row.code}</div>
                                    </td>
                                    {daysArray.map(d => {
                                        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                        const status = row.attendance[dateStr];
                                        let cellClass = "";
                                        let cellContent = "";

                                        if (status === 'PRESENT') { cellClass = "bg-green-100 text-green-800"; cellContent = "P"; }
                                        else if (status === 'ABSENT') { cellClass = "bg-red-100 text-red-800"; cellContent = "A"; }
                                        else if (status === 'LEAVE') { cellClass = "bg-yellow-100 text-yellow-800"; cellContent = "L"; }
                                        else if (status === 'HOLIDAY') { cellClass = "bg-blue-100 text-blue-800"; cellContent = "H"; }
                                        else { cellClass = "bg-gray-50 text-gray-400"; cellContent = "-"; }

                                        return (
                                            <td key={d} className="px-0 py-1 text-center border-r border-gray-100">
                                                <div className={`w-6 h-6 mx-auto flex items-center justify-center rounded ${cellClass}`}>
                                                    {cellContent}
                                                </div>
                                            </td>
                                        );
                                    })}
                                    <td className="px-2 py-3 text-center font-bold bg-gray-50 border-l">{row.summary.present}</td>
                                    <td className="px-2 py-3 text-center font-bold bg-gray-50 text-red-600">{row.summary.absent}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MonthlyReport;
