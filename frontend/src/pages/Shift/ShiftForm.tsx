import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createShift, getShift, updateShift } from '../../services/api';
import { ArrowLeft } from 'lucide-react';

const ShiftForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        startTime: '09:00',
        endTime: '18:00',
        breakDuration: 60,
        graceTime: 15,
        description: ''
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            loadDetails();
        }
    }, [id]);

    const loadDetails = async () => {
        try {
            if (id) {
                const data = await getShift(id);
                setFormData({
                    name: data.name,
                    code: data.code,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    breakDuration: data.breakDuration,
                    graceTime: data.graceTime,
                    description: data.description || ''
                });
            }
        } catch (error) {
            console.error("Failed to load shift", error);
            setError("Failed to load shift details");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic conversion to numbers
        const payload = {
            ...formData,
            breakDuration: Number(formData.breakDuration),
            graceTime: Number(formData.graceTime)
        };

        try {
            if (isEdit && id) {
                await updateShift(id, payload);
            } else {
                await createShift(payload);
            }
            navigate('/shifts');
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Failed to save shift");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button onClick={() => navigate('/shifts')} className="mb-4 flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} className="mr-1" /> Back to List
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Shift' : 'New Shift'}</h1>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shift Name *</label>
                            <input type="text" required className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shift Code *</label>
                            <input type="text" required className="w-full p-2 border rounded" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                        </div>

                        <div className="hidden md:block"></div> {/* Spacer */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time (HH:mm) *</label>
                            <input type="time" required className="w-full p-2 border rounded" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time (HH:mm) *</label>
                            <input type="time" required className="w-full p-2 border rounded" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Break Duration (mins)</label>
                            <input type="number" min="0" className="w-full p-2 border rounded" value={formData.breakDuration} onChange={e => setFormData({ ...formData, breakDuration: Number(e.target.value) })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Grace Time (mins)</label>
                            <input type="number" min="0" className="w-full p-2 border rounded" value={formData.graceTime} onChange={e => setFormData({ ...formData, graceTime: Number(e.target.value) })} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea className="w-full p-2 border rounded h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                        </div>

                    </div>

                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={() => navigate('/shifts')} className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Save Shift
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShiftForm;
