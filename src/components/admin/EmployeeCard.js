import React, { useState, useEffect } from "react";
import {
  ArrowDownTrayIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  UserCircleIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  BriefcaseIcon,
  ClockIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon as XIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import { DownloadProfilePdfService, ToggleEmployeeStatusService, UpdateEmployeeService } from "../services/ApiService";

const EmployeeCard = ({ employee, isOpen, onToggle, onDownload, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
const [activeStatus, setActiveStatus] = useState(employee.active);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState({ ...employee });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
  };

useEffect(() => {
  console.log("🔍 DEBUG - Full employee object:", employee);
  console.log("🔍 is_account_active value:", employee.is_account_active);
  console.log("🔍 isaccountactive value:", employee.isaccountactive);
  console.log("🔍 active value:", employee.active);
  console.log("🔍 activeStatus will be set to:", employee.is_account_active);
  
  setActiveStatus(employee.is_account_active);
  setEditedEmployee({ ...employee });
}, [employee]);

// Sync state when employee prop changes
useEffect(() => {
  setActiveStatus(employee.active);
  setEditedEmployee({ ...employee });
}, [employee]);


  // Format date for display
  const formatFullDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle toggle status
  const handleToggleStatus = async () => {
    if (isTogglingStatus) return;
    
    try {
      setIsTogglingStatus(true);
      const newStatus = !activeStatus;
      
await ToggleEmployeeStatusService(employee.username, newStatus);
      
      setActiveStatus(newStatus);
      
      // Update the employee in parent component
      if (onUpdate) {
        onUpdate(employee.id, { is_account_active: newStatus });
      }
    } catch (error) {
      console.error("Error toggling employee status:", error);
      alert("Failed to toggle status. Please try again.");
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // Handle save edits
  const handleSaveEdits = async () => {
    try {
      const updateData = {
        full_name: editedEmployee.name,
        email: editedEmployee.email,
        phone: editedEmployee.phone,
        department: editedEmployee.department,
        position: editedEmployee.role,
        // Add other fields as needed
      };

await UpdateEmployeeService(employee.username, updateData);
      
      // Update parent component
      if (onUpdate) {
        onUpdate(employee.id, editedEmployee);
      }
      
      setIsEditing(false);
      alert("Employee details updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee. Please try again.");
    }
  };

  // Handle cancel edits
  const handleCancelEdits = () => {
    setEditedEmployee({ ...employee });
    setIsEditing(false);
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditedEmployee(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      {/* Employee Card - Original Design */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group">
        {/* Employee Photo & Status */}
        <div className="relative">
          <div className="h-48 overflow-hidden">
            <img
              src={employee.photo}
              alt={employee.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Registration Status Badge */}
          <div className="absolute top-4 right-4">
            {employee.registrationComplete ? (
              <div className="flex items-center bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Complete
              </div>
            ) : (
              <div className="flex items-center bg-red-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                <XCircleIcon className="h-4 w-4 mr-1" />
                Incomplete
              </div>
            )}
          </div>

          {/* Department Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              {employee.department}
            </span>
          </div>

          {/* Active Status Badge */}
          <div className="absolute top-4 left-4">
            <button
              onClick={handleToggleStatus}
              disabled={isTogglingStatus}
              className={`flex items-center backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium shadow-lg ${
                activeStatus 
                  ? 'bg-green-500/90 text-white hover:bg-green-600/90' 
                  : 'bg-red-500/90 text-white hover:bg-red-600/90'
              } ${isTogglingStatus ? 'opacity-70 cursor-not-allowed' : ''}`}
              title={activeStatus ? "Click to deactivate" : "Click to activate"}
            >
              <PowerIcon className="h-3 w-3 mr-1" />
              {activeStatus ? 'Active' : 'Inactive'}
              {isTogglingStatus && (
                <span className="ml-1 animate-spin">⟳</span>
              )}
            </button>
          </div>
        </div>

        {/* Employee Info */}
        <div className="p-6">
          <div className="mb-4">
            <h3
              className="text-lg font-bold text-gray-900 truncate"
              title={employee.name}
            >
              {employee.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{employee.role}</p>
            <div className="flex items-center mt-2">
              <UserCircleIcon className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
              <span
                className="text-sm font-mono text-gray-700 truncate"
                title={employee.employeeId}
              >
                {employee.employeeId}
              </span>
            </div>
          </div>

          {/* Hire Date */}
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span>
              Hired: {new Date(employee.hireDate).toLocaleDateString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mb-4">
            <button
              onClick={openModal}
              aria-label={`View full details for ${employee.name}`}
              className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 shadow-sm"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              View Details
            </button>
            <button
              onClick={() => onDownload(employee)}
              aria-label={`Download data for ${employee.name}`}
              className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-200 shadow-sm"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>

          {/* Expandable Details */}
          {isOpen && (
            <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300 fade-in">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  Additional Information
                </h4>
                {/* Edit button - only show if onboarding is complete */}
                {employee.registrationComplete && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                )}
              </div>
              <div className="space-y-3 text-sm">
                {/* Email Field */}
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">Email</span>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedEmployee.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full mt-1 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span className="font-medium text-gray-900 block truncate">
                        {employee.email}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Phone Field */}
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-gray-600 block">Phone</span>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedEmployee.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full mt-1 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <span className="font-medium text-gray-900 block">
                        {employee.phone}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Edit Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={handleSaveEdits}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdits}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      <XIcon className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Enhanced with Edit Functionality */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Blurred Background */}
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Edit Button */}
              <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden ring-3 ring-white shadow-lg">
                        <img
                          src={employee.photo}
                          alt={employee.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-3 border-white ${employee.registrationComplete ? "bg-emerald-500" : "bg-amber-500"}`}
                      >
                        {employee.registrationComplete ? (
                          <CheckCircleIcon className="w-full h-full p-1 text-white" />
                        ) : (
                          <ClockIcon className="w-full h-full p-1 text-white" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedEmployee.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="text-2xl font-bold text-gray-900 border-b focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <h2 className="text-2xl font-bold text-gray-900">
                          {employee.name}
                        </h2>
                      )}
                      
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedEmployee.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          className="text-lg text-gray-600 mt-1 border-b focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-lg text-gray-600 mt-1">
                          {employee.role}
                        </p>
                      )}
                      
                      <div className="flex items-center mt-3 space-x-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedEmployee.department}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                            className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border focus:outline-none focus:border-blue-500"
                          />
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            <BuildingOfficeIcon className="w-4 h-4 mr-1.5" />
                            {employee.department}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${employee.registrationComplete ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                        >
                          {employee.registrationComplete
                            ? "Registration Complete"
                            : "Registration Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Toggle Status Button in Modal */}
                    <button
                      onClick={handleToggleStatus}
                      disabled={isTogglingStatus}
                      className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                        activeStatus 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      } ${isTogglingStatus ? 'opacity-70 cursor-not-allowed' : ''}`}
                      title={activeStatus ? "Deactivate employee" : "Activate employee"}
                    >
                      <PowerIcon className="w-4 h-4 mr-1" />
                      {activeStatus ? 'Active' : 'Inactive'}
                    </button>
                    
                    {/* Edit Toggle Button - Only show if onboarding complete */}
                    {employee.registrationComplete && (
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`p-2 rounded-xl transition-colors duration-200 ${
                          isEditing 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'hover:bg-gray-100 text-gray-400'
                        }`}
                        aria-label={isEditing ? "Cancel editing" : "Edit employee"}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                    )}
                    
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      aria-label="Close modal"
                    >
                      <XMarkIcon className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Employee Information
                    </h3>
                    <div className="space-y-4">
                      <InfoRow
                        icon={<IdentificationIcon className="w-5 h-5" />}
                        label="Employee ID"
                        value={employee.employeeId}
                        mono
                        editable={false}
                      />
                      <InfoRow
                        icon={<BriefcaseIcon className="w-5 h-5" />}
                        label="Position"
                        value={editedEmployee.role}
                        isEditing={isEditing}
                        onChange={(value) => handleInputChange('role', value)}
                      />
                      <InfoRow
                        icon={<BuildingOfficeIcon className="w-5 h-5" />}
                        label="Department"
                        value={editedEmployee.department}
                        isEditing={isEditing}
                        onChange={(value) => handleInputChange('department', value)}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Contact Details
                    </h3>
                    <div className="space-y-4">
                      <InfoRow
                        icon={<EnvelopeIcon className="w-5 h-5" />}
                        label="Email"
                        value={editedEmployee.email}
                        link={!isEditing}
                        isEditing={isEditing}
                        onChange={(value) => handleInputChange('email', value)}
                      />
                      <InfoRow
                        icon={<PhoneIcon className="w-5 h-5" />}
                        label="Phone"
                        value={editedEmployee.phone}
                        link={!isEditing}
                        isEditing={isEditing}
                        onChange={(value) => handleInputChange('phone', value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Employment Details
                    </h3>
                    <div className="space-y-4">
                      <InfoRow
                        icon={<CalendarIcon className="w-5 h-5" />}
                        label="Hire Date"
                        value={formatFullDate(employee.hireDate)}
                        editable={false}
                      />
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Registration Status
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${employee.registrationComplete ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                          >
                            {employee.registrationComplete
                              ? "Completed"
                              : "Pending"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {employee.registrationComplete
                            ? "All required documents and information have been submitted."
                            : "Pending completion of registration documents."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          onDownload(employee);
                          closeModal();
                        }}
                        className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                        Download Employee Data
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await DownloadProfilePdfService(employee.id);
                            closeModal();
                          } catch (err) {
                            console.error("Error downloading PDF:", err);
                            alert("Failed to download PDF. Please try again.");
                          }
                        }}
                        className="w-full px-4 py-3 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with Save/Cancel buttons when editing */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {isEditing && "Make changes and click Save to update employee details"}
                  </span>
                  <div className="flex space-x-3">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancelEdits}
                          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdits}
                          className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={closeModal}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Enhanced InfoRow Component with Edit Support
const InfoRow = ({ 
  icon, 
  label, 
  value, 
  mono = false, 
  link = false, 
  editable = true,
  isEditing = false,
  onChange
}) => {
  if (isEditing && editable) {
    return (
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5 mr-3 text-gray-400">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange && onChange(e.target.value)}
            className={`mt-1 w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${mono ? 'font-mono' : 'font-medium'}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-0.5 mr-3 text-gray-400">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        {link ? (
          <a
            href={label === "Email" ? `mailto:${value}` : `tel:${value}`}
            className={`block mt-1 text-sm ${mono ? "font-mono" : "font-medium"} text-gray-900 hover:text-blue-600 transition-colors duration-200 truncate`}
          >
            {value}
          </a>
        ) : (
          <p
            className={`mt-1 text-sm ${mono ? "font-mono" : "font-medium"} text-gray-900 truncate`}
          >
            {value}
          </p>
        )}
      </div>
    </div>
  );
};

EmployeeCard.displayName = "EmployeeCard";

export default EmployeeCard;