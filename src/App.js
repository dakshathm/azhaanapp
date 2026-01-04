import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminLogin from "./components/admin/AdminLogin";
import CreateEmployee from "./components/admin/CreateEmployee";
import EmployeeOnboarding from "./components/employee/EmployeeOnboarding";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/login" />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-employee" element={<CreateEmployee />} />

        {/* Employee Onboarding */}
        {/* REMOVED LayoutWithSidebar here because EmployeeOnboarding has its own Sidebar built-in */}
        <Route path="/employee" element={<EmployeeOnboarding />} />

        {/* Fallback */}
        <Route path="*" element={<h2>404 – Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;