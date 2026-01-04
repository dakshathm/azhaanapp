import React, { useState, useEffect, memo } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PlusIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import EmployeeCard from "./EmployeeCard";
import FilterOptions from "./FilterOptions";
import CreateEmployeeForm from "./CreateEmployee";
import { LogoutService, GetEmployeesService } from "../services/ApiService";
import logo from "./logo2.png";

const MemoEmployeeCard = memo(EmployeeCard);

// Backend base URL (used for relative profile picture paths)
const BASE_URL = "http://192.168.1.15:8001";

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    department: "all",
    status: "all",
    registration: "all",
  });
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [openCardId, setOpenCardId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch employees from backend
  const fetchEmployees = async (skip = 0, limit = 100) => {
    try {
      setLoading(true);
      const res = await GetEmployeesService(skip, limit);

      if (res && res.employees) {
        // Map API fields to UI format
       const mappedEmployees = res.employees.map((emp) => ({
  id: emp.id,
  name: emp.full_name,
  employeeId: emp.username,
  department: emp.department,
  role: emp.position,
  hireDate: emp.date_of_joining,
  registrationComplete: emp.is_onboarding_completed,
  photo: emp.profile_picture_url
    ? `${BASE_URL}${emp.profile_picture_url}`
    : "https://images.unsplash.com/photo-1494790108755-2616b786d4d1?w=150&h=150&fit=crop&crop=face",
  email: emp.email,
  phone: emp.mobile_number,
  bloodGroup: emp.blood_group || "N/A",
  active: emp.is_account_active,  // ✅ ADD THIS LINE!
}));


        setEmployees(mappedEmployees);
      } else {
        setEmployees([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setEmployees([]);
      setLoading(false);
    }
  };

  const handleEmployeeUpdate = (employeeId, updatedData) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, ...updatedData } : emp
      )
    );

    setFilteredEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, ...updatedData } : emp
      )
    );
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // SEARCH + FILTER
  useEffect(() => {
    let results = employees;

    if (searchTerm) {
      results = results.filter(
        (employee) =>
          employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employeeId
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          employee.department
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          employee.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.department !== "all") {
      results = results.filter(
        (employee) => employee.department === filters.department
      );
    }

    if (filters.status !== "all") {
      const now = new Date();
      const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
      if (filters.status === "active") {
        results = results.filter(
          (employee) => new Date(employee.hireDate) > sixMonthsAgo
        );
      } else if (filters.status === "tenured") {
        results = results.filter(
          (employee) => new Date(employee.hireDate) <= sixMonthsAgo
        );
      }
    }

    if (filters.registration !== "all") {
      results = results.filter((employee) =>
        filters.registration === "complete"
          ? employee.registrationComplete
          : !employee.registrationComplete
      );
    }

    setFilteredEmployees(results);
  }, [searchTerm, filters, employees]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const resetFilters = () => {
    setFilters({ department: "all", status: "all", registration: "all" });
    setSearchTerm("");
  };

  const copyCredentials = () => {
    const text = `Employee Code : ${credentials.employee_id}\nPassword : ${credentials.temporary_password}`;

    // Modern clipboard API (HTTPS / localhost only)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for HTTP / IP-based access
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  const downloadEmployeeData = (employee) => {
    const dataStr = JSON.stringify(employee, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${employee.employeeId}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllData = () => {
    const dataStr = JSON.stringify(filteredEmployees, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "all_employees_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEmployeeCreate = ({ employee, credentials }) => {
    setEmployees((prev) => [...prev, employee]);
    if (credentials) {
      setCredentials(credentials);
      setShowCredentials(true);
    }
    console.log("✅ New employee added:", employee);
  };

  const handleToggle = (employeeId) => {
    setOpenCardId(openCardId === employeeId ? null : employeeId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Left: Logo */}
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Company Logo" className="h-10 w-auto" />
            </div>

            {/* Center: Title */}
            <div className="text-center flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Employee Management System
              </p>
            </div>

            {/* Right: Search + Buttons */}
            <div className="flex items-center space-x-3">
              {/* Search Icon */}
              <div className="relative">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400 cursor-pointer"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                />

                {/* Expandable search input */}
                {isSearchOpen && (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search employees..."
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-64 pl-3 pr-10 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={() => {
                      if (!searchTerm) setIsSearchOpen(false);
                    }}
                  />
                )}

                {/* Clear button */}
                {isSearchOpen && searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Create Employee Button */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Employee
              </button>

              {/* Logout Button */}
              <button
                onClick={async () => await LogoutService()}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading employees...
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ChevronDownIcon
                      className={`h-4 w-4 mr-1 transition-transform ${showFilters ? "rotate-180" : ""}`}
                    />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
              {showFilters && (
                <FilterOptions
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              )}
            </div>

            {/* Results Summary */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="text-gray-600">
                  Showing {filteredEmployees.length} of {employees.length}{" "}
                  employees
                </p>
              </div>
            </div>

            {/* Employee Cards */}
            {filteredEmployees.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEmployees.map((employee) => (
                  <MemoEmployeeCard
                    key={employee.id}
                    employee={employee}
                    isOpen={openCardId === employee.id}
                    onToggle={() => handleToggle(employee.id)}
                    onDownload={() => downloadEmployeeData(employee)}
                    onUpdate={handleEmployeeUpdate} // Add this prop
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No employees found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-12 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                © 2026 Admin Dashboard. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* CREATE EMPLOYEE FORM MODAL */}
      {showCreateForm && (
        <CreateEmployeeForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleEmployeeCreate}
        />
      )}
      {showCredentials && credentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowCredentials(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Employee Account Created
            </h3>

            <div className="bg-gray-900 text-green-400 font-mono rounded-lg p-4 text-sm space-y-1">
              <div>Employee Code : {credentials.employee_id}</div>
              <div>Password : {credentials.temporary_password}</div>
            </div>

            <button
              onClick={copyCredentials}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Copy Credentials
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
