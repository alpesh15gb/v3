import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmployee, getEmployee, updateEmployee, getCompanies, getBranches, getDepartments, getDesignations, getLocations } from '../../services/api';
import { ArrowLeft } from 'lucide-react';

const EmployeeForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        employeeCode: '',
        email: '',
        phone: '',
        dateOfJoining: '',
        companyId: '',
        branchId: '',
        departmentId: '',
        designationId: '',
        locationId: '',
    });

    const [companies, setCompanies] = useState<any[]>([]);
    const [branches, setBranches] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [designations, setDesignations] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);

    const [error, setError] = useState('');

    useEffect(() => {
        loadMasterData();
        if (isEdit) {
            loadDetails();
        }
    }, [id]);

    const loadMasterData = async () => {
        try {
            const [c, b, d, des, l] = await Promise.all([
                getCompanies(),
                getBranches(),
                getDepartments(),
                getDesignations(),
                getLocations()
            ]);
            setCompanies(c);
            setBranches(b);
            setDepartments(d);
            setDesignations(des);
            setLocations(l);
        } catch (err) {
            console.error("Failed to load master data", err);
        }
    }

    const loadDetails = async () => {
        try {
            if (id) {
                const data = await getEmployee(id);
                const doj = data.dateOfJoining ? new Date(data.dateOfJoining).toISOString().split('T')[0] : '';
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName || '',
                    employeeCode: data.employeeCode,
                    email: data.email || '',
                    phone: data.phone || '',
                    dateOfJoining: doj,
                    companyId: data.companyId,
                    branchId: data.branchId,
                    departmentId: data.departmentId || '',
                    designationId: data.designationId || '',
                    locationId: data.locationId || ''
                });
            }
        } catch (error) {
            console.error("Failed to load employee", error);
            setError("Failed to load employee details");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isEdit && id) {
                await updateEmployee(id, formData);
            } else {
                await createEmployee(formData);
            }
            navigate('/employees');
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.message || "Failed to save employee");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <button onClick={() => navigate('/employees')} className="mb-4 flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} className="mr-1" /> Back to List
            </button>

            <div className="bg-white rounded-lg shadow p-6">
                <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Employee' : 'New Employee'}</h1>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Personal Info */}
                        <div className="bg-gray-50 p-4 rounded md:col-span-2">
                            <h3 className="text-lg font-medium mb-3">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                    <input type="text" required className="w-full p-2 border rounded" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" className="w-full p-2 border rounded" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="text" className="w-full p-2 border rounded" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Official Info */}
                        <div className="bg-gray-50 p-4 rounded md:col-span-2">
                            <h3 className="text-lg font-medium mb-3">Official Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee Code *</label>
                                    <input type="text" required className="w-full p-2 border rounded" value={formData.employeeCode} onChange={e => setFormData({ ...formData, employeeCode: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining *</label>
                                    <input type="date" required className="w-full p-2 border rounded" value={formData.dateOfJoining} onChange={e => setFormData({ ...formData, dateOfJoining: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Assignment Info */}
                        <div className="bg-gray-50 p-4 rounded md:col-span-2">
                            <h3 className="text-lg font-medium mb-3">Assignment</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
                                    <select required className="w-full p-2 border rounded" value={formData.companyId} onChange={e => setFormData({ ...formData, companyId: e.target.value })}>
                                        <option value="">Select Company</option>
                                        {companies.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                                    <select required className="w-full p-2 border rounded" value={formData.branchId} onChange={e => setFormData({ ...formData, branchId: e.target.value })}>
                                        <option value="">Select Branch</option>
                                        {branches.filter(b => !formData.companyId || b.companyId === formData.companyId).map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select className="w-full p-2 border rounded" value={formData.departmentId} onChange={e => setFormData({ ...formData, departmentId: e.target.value })}>
                                        <option value="">Select Department</option>
                                        {departments.filter(d => !formData.branchId || d.branchId === formData.branchId).map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                    <select className="w-full p-2 border rounded" value={formData.designationId} onChange={e => setFormData({ ...formData, designationId: e.target.value })}>
                                        <option value="">Select Designation</option>
                                        {designations.filter(d => !formData.departmentId || d.departmentId === formData.departmentId).map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <select className="w-full p-2 border rounded" value={formData.locationId} onChange={e => setFormData({ ...formData, locationId: e.target.value })}>
                                        <option value="">Select Location</option>
                                        {locations.filter(l => !formData.branchId || l.branchId === formData.branchId).map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={() => navigate('/employees')} className="mr-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Save Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;
