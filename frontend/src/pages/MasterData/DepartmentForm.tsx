import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createDepartment, getDepartment, updateDepartment, getBranches } from '../../services/api';
import { ArrowLeft } from 'lucide-react';

const DepartmentForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        branchId: '',
    });
    const [branches, setBranches] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        loadBranches();
        if (isEdit) {
            loadDetails();
        }
    }, [id]);

    const loadBranches = async () => {
        try {
            const data = await getBranches();
            setBranches(data);
        } catch (err) {
            console.error(err);
        }
    }

    const loadDetails = async () => {
        try {
            if (id) {
                const data = await getDepartment(id);
                setFormData({
                    name: data.name,
                    code: data.code,
                    branchId: data.branchId
                });
            }
        } catch (error) {
            console.error("Failed to load department", error);
            setError("Failed to load department details");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isEdit && id) {
                await updateDepartment(id, formData);
            } else {
                await createDepartment(formData);
            }
            navigate('/departments');
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save department");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button onClick={() => navigate('/departments')} className="mb-4 flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} className="mr-1" /> Back to List
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Department' : 'New Department'}</h1>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                        <select
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            value={formData.branchId}
                            onChange={e => setFormData({ ...formData, branchId: e.target.value })}
                        >
                            <option value="">Select Branch</option>
                            {branches.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department Code</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button type="button" onClick={() => navigate('/departments')} className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Save Department
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartmentForm;
