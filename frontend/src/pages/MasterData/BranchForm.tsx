import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBranch, getBranch, updateBranch, getCompanies } from '../../services/api';
import { ArrowLeft } from 'lucide-react';

const BranchForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        companyId: '',
    });
    const [companies, setCompanies] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCompanies();
        if (isEdit) {
            loadBranch();
        }
    }, [id]);

    const loadCompanies = async () => {
        try {
            const data = await getCompanies();
            setCompanies(data);
        } catch (err) {
            console.error(err);
        }
    }

    const loadBranch = async () => {
        try {
            if (id) {
                const data = await getBranch(id);
                setFormData({
                    name: data.name,
                    code: data.code,
                    companyId: data.companyId
                });
            }
        } catch (error) {
            console.error("Failed to load branch", error);
            setError("Failed to load branch details");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isEdit && id) {
                await updateBranch(id, formData);
            } else {
                await createBranch(formData);
            }
            navigate('/branches');
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save branch");
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <button onClick={() => navigate('/branches')} className="mb-4 flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} className="mr-1" /> Back to List
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Branch' : 'New Branch'}</h1>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                        <select
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            value={formData.companyId}
                            onChange={e => setFormData({ ...formData, companyId: e.target.value })}
                        >
                            <option value="">Select Company</option>
                            {companies.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch Code</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button type="button" onClick={() => navigate('/branches')} className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Save Branch
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BranchForm;
