import React, { useState } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  CameraIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  CalendarIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { CreateEmployeeService } from '../services/ApiService';

const CreateEmployeeForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    phone_code: '+91',
    department: '',
    position: '',
    date_of_joining: '',
    file: null,
    photoPreview: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
const [showCredentials, setShowCredentials] = useState(false);
const [credentials, setCredentials] = useState(null);

  const departments = [
    'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance',
    'Operations', 'Customer Support', 'Product Management', 'Design',
    'Research & Development'
  ];

  const positions = {
    'Engineering': ['Software Engineer', 'Senior Developer', 'DevOps Engineer', 'QA Engineer', 'Tech Lead'],
    'Marketing': ['Marketing Manager', 'Content Strategist', 'SEO Specialist', 'Social Media Manager'],
    'Sales': ['Sales Executive', 'Account Manager', 'Business Development', 'Sales Representative'],
    'Human Resources': ['HR Manager', 'Recruiter', 'HR Coordinator', 'Training Specialist'],
    'Finance': ['Financial Analyst', 'Accountant', 'Finance Manager', 'Auditor'],
    'Operations': ['Operations Manager', 'Project Manager', 'Logistics Coordinator'],
    'Customer Support': ['Support Specialist', 'Customer Success Manager', 'Help Desk Analyst'],
    'Product Management': ['Product Manager', 'Product Owner', 'Product Analyst'],
    'Design': ['UX Designer', 'UI Designer', 'Graphic Designer', 'Product Designer'],
    'Research & Development': ['Research Scientist', 'R&D Engineer', 'Lab Technician']
  };

  const countryCodes = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Reset position & clear error if department changes
    if (name === 'department') {
      setFormData(prev => ({ ...prev, position: '' }));
      if (errors.position) setErrors(prev => ({ ...prev, position: '' }));
    }
  };

  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = value.match(/.{1,4}/g).join(' ');
      if (value.length > 15) value = value.slice(0, 15);
    }
    setFormData(prev => ({ ...prev, phone: value }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, file: 'Please select an image file (JPG, PNG, GIF)' }));
      return;
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, file: 'Image size should be less than 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, file, photoPreview: reader.result }));
      if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null, photoPreview: '' }));
    if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    else if (formData.first_name.length < 2) newErrors.first_name = 'First name must be at least 2 characters';

    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    else if (formData.last_name.length < 2) newErrors.last_name = 'Last name must be at least 2 characters';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';

    const fullPhoneNumber = `${formData.phone_code}${formData.phone.replace(/\s/g, '')}`;
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[\+]?[1-9][0-9]{8,15}$/.test(fullPhoneNumber)) newErrors.phone = 'Please enter a valid phone number';

    if (!formData.department) newErrors.department = 'Please select a department';
    if (!formData.position) newErrors.position = 'Please select a position';

    if (!formData.date_of_joining) newErrors.date_of_joining = 'Please select a hire date';
    else if (new Date(formData.date_of_joining) > new Date()) newErrors.date_of_joining = 'Hire date cannot be in the future';

    return newErrors;
  };

  const getPositionsForDepartment = () => positions[formData.department] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append('first_name', formData.first_name);
      dataToSend.append('middle_name', formData.middle_name || '');
      dataToSend.append('last_name', formData.last_name);
      dataToSend.append('email', formData.email);

      // Normalize phone number without spaces
     const normalizedPhone = `${formData.phone_code}${formData.phone.replace(/\s/g, '')}`;
dataToSend.append('phone', normalizedPhone);


      dataToSend.append('department', formData.department);
      dataToSend.append('position', formData.position);

      const joiningDate = new Date(formData.date_of_joining).toISOString().split('T')[0];
      dataToSend.append('date_of_joining', joiningDate);

      if (formData.file) dataToSend.append('file', formData.file);

      // API Call
      const response = await CreateEmployeeService(dataToSend);

      const newEmployee = {
        id: Date.now(),
        name: `${formData.first_name} ${formData.middle_name ? formData.middle_name + ' ' : ''}${formData.last_name}`.trim(),
        employeeId: response?.employee_id || `EMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        department: formData.department,
        role: formData.position,
        email: formData.email,
        phone: normalizedPhone,
        date_of_joining: formData.date_of_joining,
        registrationComplete: false,
        photo: formData.photoPreview || 'https://images.unsplash.com/photo-1494790108755-2616b786d4d1?w=150&h=150&fit=crop'
      };

    //   onSubmit(newEmployee);
    onSubmit({
  employee: newEmployee,
  credentials: {
    employee_id: response.employee_id,
    temporary_password: response.temporary_password,
    message: response.message
  }
});

onClose();

    } catch (err) {
      console.error('Error creating employee:', err);
      setErrors(prev => ({ ...prev, submit: err.message || 'Failed to create employee. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create New Employee</h2>
                <p className="text-gray-600 mt-1">Fill in all required details</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Profile Photo */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                    <CameraIcon className="w-4 h-4 mr-2" /> Profile Photo
                  </h3>
                  <div className="flex flex-col items-center">
                    {formData.photoPreview ? (
                      <div className="relative mb-6">
                        <div className="w-40 h-40 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl">
                          <img src={formData.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <XMarkIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-40 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-gray-300">
                        <UserCircleIcon className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                    <div className="w-full">
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <div className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-colors duration-200 w-full group">
                          <ArrowUpTrayIcon className="w-5 h-5 mr-2 text-gray-500 group-hover:text-gray-700" />
                          {formData.photoPreview ? 'Change Photo' : 'Upload Photo'}
                        </div>
                      </label>
                      <p className="text-xs text-gray-500 text-center mt-3">JPG, PNG or GIF • Max 5MB</p>
                    </div>
                  </div>
                  {errors.file && <p className="text-red-500 text-sm mt-3 text-center">{errors.file}</p>}
                </div>

                {/* Department */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <BuildingOfficeIcon className="w-4 h-4 mr-2" /> Department *
                    </span>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.department ? 'border-red-300' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                    >
                      <option value="">Select a department</option>
                      {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                    {errors.department && <p className="text-red-500 text-sm mt-2">{errors.department}</p>}
                  </label>
                </div>

                {/* Position */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-2">Position *</span>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      disabled={!formData.department}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.position ? 'border-red-300' : 'border-gray-300'} bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
                    >
                      <option value="">{formData.department ? 'Select a position' : 'Select department first'}</option>
                      {getPositionsForDepartment().map(pos => <option key={pos} value={pos}>{pos}</option>)}
                    </select>
                    {errors.position && <p className="text-red-500 text-sm mt-2">{errors.position}</p>}
                  </label>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-2">First Name *</span>
                      <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="John"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.first_name ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder:text-gray-400`} />
                      {errors.first_name && <p className="text-red-500 text-sm mt-2">{errors.first_name}</p>}
                    </label>
                  </div>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="text-sm font-medium text-gray-700 mb-2">Last Name *</span>
                      <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Doe"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.last_name ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder:text-gray-400`} />
                      {errors.last_name && <p className="text-red-500 text-sm mt-2">{errors.last_name}</p>}
                    </label>
                  </div>
                </div>

                {/* Middle Name */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-2">Middle Name (Optional)</span>
                    <input type="text" name="middle_name" value={formData.middle_name} onChange={handleChange} placeholder="Michael"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder:text-gray-400" />
                  </label>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center"><EnvelopeIcon className="w-4 h-4 mr-2" /> Email Address *</span>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@company.com"
                      className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder:text-gray-400`} />
                    {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                  </label>
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center"><PhoneIcon className="w-4 h-4 mr-2" /> Phone Number *</span>
                    <div className="flex gap-2">
                      <select name="phone_code" value={formData.phone_code} onChange={handleChange}
                        className="px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200">
                        {countryCodes.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                      </select>
                      <input type="text" name="phone" value={formData.phone} onChange={handlePhoneInput} placeholder="98765 43210"
                        className={`flex-1 px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 placeholder:text-gray-400`} />
                    </div>
                    {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
                  </label>
                </div>

                {/* Date of Joining */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-700 mb-2 flex items-center"><CalendarIcon className="w-4 h-4 mr-2" /> Date of Joining *</span>
                    <input type="date" name="date_of_joining" value={formData.date_of_joining} onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.date_of_joining ? 'border-red-300' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`} />
                    {errors.date_of_joining && <p className="text-red-500 text-sm mt-2">{errors.date_of_joining}</p>}
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-end gap-4">
              <button type="button" onClick={onClose} className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors duration-200">Cancel</button>
              <button type="submit" disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                {isSubmitting && <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="4" stroke="#fff" strokeLinecap="round" /></svg>}
                Create Employee
              </button>
            </div>
            {errors.submit && <p className="text-red-500 text-center mt-4">{errors.submit}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployeeForm;
