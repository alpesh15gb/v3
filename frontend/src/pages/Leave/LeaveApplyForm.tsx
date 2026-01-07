import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyLeave, getLeaveTypes, getEmployees } from '../../services/api'; // getEmployees for simple user selection
import { ArrowLeft } from 'lucide-react';

const LeaveApplyForm: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employeeId: '',
        leaveTypeId: '',
        fromDate: '',
        toDate: '',
        reason: ''
    });

    const [employees, setEmployees] = useState<any[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        loadMasterData();
    }, []);

    const loadMasterData = async () => {
        try {
            const [emp, types] = await Promise.all([
                getEmployees(),
                getLeaveTypes()
            ]);
            setEmployees(emp);
            setLeaveTypes(types);
        } catch (err) {
            console.error("Failed to load master data", err);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await applyLeave(formData);
            navigate('/leaves');
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Failed to apply for leave");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button onClick={() => navigate('/leaves')} className="mb-4 flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} className="mr-1" /> Back to List
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">Apply for Leave</h1>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee *</label>
                            <select required className="w-full p-2 border rounded" value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })}>
                                <option value="">Select Employee</option>
                                {employees.map(i => <option key={i.id} value={i.id}>{i.firstName} {i.lastName} ({i.employeeCode})</option>)}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">In a real app, this would be auto-selected for logged-in user.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
                            <select required className="w-full p-2 border rounded" value={formData.leaveTypeId} onChange={e => setFormData({ ...formData, leaveTypeId: e.target.value })}>
                                <option value="">Select Leave Type</option>
                                {leaveTypes.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From Date *</label>
                                <input type="date" required className="w-full p-2 border rounded" value={formData.fromDate} onChange={e => setFormData({ ...formData, fromDate: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To Date *</label>
                                <input type="date" required className="w-full p-2 border rounded" value={formData.toDate} onChange={e => setFormData({ ...formData, toDate: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                            <textarea className="w-full p-2 border rounded h-24" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })}></textarea>
                        </div>

                    </div>

                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={() => navigate('/leaves')} className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeaveApplyForm;
