import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createDesignation, getDesignation, updateDesignation, getDepartments } from '../../services/api';
import { ArrowLeft } from 'lucide-react';

const DesignationForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        code: '',
        departmentId: '',
    });
    const [departments, setDepartments] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDepartments();
        if (isEdit) {
            loadDetails();
        }
    }, [id]);

    const loadDepartments = async () => {
        try {
            const data = await getDepartments();
            setDepartments(data);
        } catch (err) {
            console.error(err);
        }
    }

    const loadDetails = async () => {
        try {
            if (id) {
                const data = await getDesignation(id);
                setFormData({
                    title: data.title,
                    code: data.code,
                    departmentId: data.departmentId
                });
            }
        } catch (error) {
            console.error("Failed to load designation", error);
            setError("Failed to load designation details");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isEdit && id) {
                await updateDesignation(id, formData);
            } else {
                await createDesignation(formData);
            }
            navigate('/designations');
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save designation");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button onClick={() => navigate('/designations')} className="mb-4 flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} className="mr-1" /> Back to List
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Designation' : 'New Designation'}</h1>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            value={formData.departmentId}
                            onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                        >
                            <option value="">Select Department</option>
                            {departments.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.branch?.name})</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation Title</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation Code</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button type="button" onClick={() => navigate('/designations')} className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Save Designation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DesignationForm;
