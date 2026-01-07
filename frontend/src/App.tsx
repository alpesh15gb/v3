import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
// Master Data Pages
import CompanyList from './pages/MasterData/CompanyList';
import CompanyForm from './pages/MasterData/CompanyForm';
import BranchList from './pages/MasterData/BranchList';
import BranchForm from './pages/MasterData/BranchForm';
import LocationList from './pages/MasterData/LocationList';
import LocationForm from './pages/MasterData/LocationForm';
import DepartmentList from './pages/MasterData/DepartmentList';
import DepartmentForm from './pages/MasterData/DepartmentForm';
import DesignationList from './pages/MasterData/DesignationList';
import DesignationForm from './pages/MasterData/DesignationForm';
import EmployeeList from './pages/Employee/EmployeeList';
import EmployeeForm from './pages/Employee/EmployeeForm';
import ShiftList from './pages/Shift/ShiftList';
import ShiftForm from './pages/Shift/ShiftForm';
import AttendanceDashboard from './pages/Attendance/AttendanceDashboard';
import LeaveDashboard from './pages/Leave/LeaveDashboard';
import LeaveApplyForm from './pages/Leave/LeaveApplyForm';
import ReportsDashboard from './pages/Reports/ReportsDashboard';
import DailyReport from './pages/Reports/DailyReport';
import MonthlyReport from './pages/Reports/MonthlyReport';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <MainRoutes />
    </AuthProvider>
  );
}

const MainRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div className="p-6"><h1 className="text-3xl font-bold">Dashboard</h1><p className="mt-4">Welcome, {user.name}!</p></div>} />

          {/* Master Data Routes */}
          <Route path="companies" element={<CompanyList />} />
          <Route path="companies/new" element={<CompanyForm />} />
          <Route path="companies/:id" element={<CompanyForm />} />

          <Route path="branches" element={<BranchList />} />
          <Route path="branches/new" element={<BranchForm />} />
          <Route path="branches/:id" element={<BranchForm />} />

          <Route path="locations" element={<LocationList />} />
          <Route path="locations/new" element={<LocationForm />} />
          <Route path="locations/:id" element={<LocationForm />} />

          <Route path="departments" element={<DepartmentList />} />
          <Route path="departments/new" element={<DepartmentForm />} />
          <Route path="departments/:id" element={<DepartmentForm />} />

          <Route path="designations" element={<DesignationList />} />
          <Route path="designations/new" element={<DesignationForm />} />
          <Route path="designations/:id" element={<DesignationForm />} />

          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/new" element={<EmployeeForm />} />
          <Route path="employees/:id" element={<EmployeeForm />} />

          <Route path="shifts" element={<ShiftList />} />
          <Route path="shifts/new" element={<ShiftForm />} />
          <Route path="shifts/:id" element={<ShiftForm />} />

          <Route path="attendance" element={<AttendanceDashboard />} />

          <Route path="leaves" element={<LeaveDashboard />} />
          <Route path="leaves/apply" element={<LeaveApplyForm />} />

          <Route path="reports" element={<ReportsDashboard />} />
          <Route path="reports/daily" element={<DailyReport />} />
          <Route path="reports/monthly" element={<MonthlyReport />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
