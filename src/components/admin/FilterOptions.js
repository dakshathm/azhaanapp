import React from 'react';

const FilterOptions = ({ filters, onFilterChange }) => {
  const departments = ['all', 'Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance',
    'Operations', 'Customer Support', 'Product Management', 'Design',
    'Research & Development'];
  const statuses = ['all', 'active', 'tenured'];
  const registrationStatus = ['all', 'complete', 'incomplete'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <div className="flex flex-wrap gap-2">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => onFilterChange('department', dept)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                  filters.department === dept
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {dept === 'all' ? 'All Departments' : dept}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => onFilterChange('status', status)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                  filters.status === status
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Registration Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registration Status
          </label>
          <div className="flex flex-wrap gap-2">
            {registrationStatus.map(status => (
              <button
                key={status}
                onClick={() => onFilterChange('registration', status)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                  filters.registration === status
                    ? status === 'complete'
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : status === 'incomplete'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterOptions;