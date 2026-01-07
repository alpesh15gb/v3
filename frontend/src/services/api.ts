import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getCompanies = () => api.get('/companies').then(res => res.data);
export const getCompany = (id: string) => api.get(`/companies/${id}`).then(res => res.data);
export const createCompany = (data: any) => api.post('/companies', data).then(res => res.data);
export const updateCompany = (id: string, data: any) => api.put(`/companies/${id}`, data).then(res => res.data);
export const deleteCompany = (id: string) => api.delete(`/companies/${id}`);

export const getBranches = () => api.get('/branches').then(res => res.data);
export const getBranch = (id: string) => api.get(`/branches/${id}`).then(res => res.data);
export const createBranch = (data: any) => api.post('/branches', data).then(res => res.data);
export const updateBranch = (id: string, data: any) => api.put(`/branches/${id}`, data).then(res => res.data);
export const deleteBranch = (id: string) => api.delete(`/branches/${id}`);

export const getLocations = () => api.get('/locations').then(res => res.data);
export const getLocation = (id: string) => api.get(`/locations/${id}`).then(res => res.data);
export const createLocation = (data: any) => api.post('/locations', data).then(res => res.data);
export const updateLocation = (id: string, data: any) => api.put(`/locations/${id}`, data).then(res => res.data);
export const deleteLocation = (id: string) => api.delete(`/locations/${id}`);

export const getDepartments = () => api.get('/departments').then(res => res.data);
export const getDepartment = (id: string) => api.get(`/departments/${id}`).then(res => res.data);
export const createDepartment = (data: any) => api.post('/departments', data).then(res => res.data);
export const updateDepartment = (id: string, data: any) => api.put(`/departments/${id}`, data).then(res => res.data);
export const deleteDepartment = (id: string) => api.delete(`/departments/${id}`);

export const getDesignations = () => api.get('/designations').then(res => res.data);
export const getDesignation = (id: string) => api.get(`/designations/${id}`).then(res => res.data);
export const createDesignation = (data: any) => api.post('/designations', data).then(res => res.data);
export const updateDesignation = (id: string, data: any) => api.put(`/designations/${id}`, data).then(res => res.data);
export const deleteDesignation = (id: string) => api.delete(`/designations/${id}`);

export const getEmployees = (params?: any) => api.get('/employees', { params }).then(res => res.data);
export const getEmployee = (id: string) => api.get(`/employees/${id}`).then(res => res.data);
export const createEmployee = (data: any) => api.post('/employees', data).then(res => res.data);
export const updateEmployee = (id: string, data: any) => api.put(`/employees/${id}`, data).then(res => res.data);
export const deleteEmployee = (id: string) => api.delete(`/employees/${id}`);

export const getShifts = () => api.get('/shifts').then(res => res.data);
export const getShift = (id: string) => api.get(`/shifts/${id}`).then(res => res.data);
export const createShift = (data: any) => api.post('/shifts', data).then(res => res.data);
export const updateShift = (id: string, data: any) => api.put(`/shifts/${id}`, data).then(res => res.data);
export const deleteShift = (id: string) => api.delete(`/shifts/${id}`);

export const processAttendance = (date: string) => api.post('/attendance/process', { date }).then(res => res.data);
export const getDailyAttendance = (date: string) => api.get('/attendance/daily', { params: { date } }).then(res => res.data);

export const getLeaveTypes = () => api.get('/leaves/types').then(res => res.data);
export const createLeaveType = (data: any) => api.post('/leaves/types', data).then(res => res.data);
export const getLeaveRequests = (params?: any) => api.get('/leaves/requests', { params }).then(res => res.data);
export const applyLeave = (data: any) => api.post('/leaves/requests', data).then(res => res.data);
export const updateLeaveStatus = (id: string, status: string) => api.put(`/leaves/requests/${id}/status`, { status }).then(res => res.data);

export const getDailyReport = (date: string) => api.get('/reports/daily', { params: { date } }).then(res => res.data);
export const getMonthlyReport = (month: number, year: number) => api.get('/reports/monthly', { params: { month, year } }).then(res => res.data);

export const login = (data: any) => api.post('/auth/login', data).then(res => res.data);

export default api;
