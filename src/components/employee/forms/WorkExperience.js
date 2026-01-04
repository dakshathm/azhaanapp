// components/WorkExperience.jsx
import React, { useState } from "react";
import { 
  FaPlus, FaTrash, FaUpload, FaBuilding, FaBriefcase, 
  FaCalendarAlt, FaDollarSign, FaFile, FaTimes, FaChevronDown, FaChevronUp
} from "react-icons/fa";

export default function WorkExperience({ data, update, nextStep, isLastStep, onFinalSubmit }) {
  const [message, setMessage] = useState("");

  // Add a new empty work experience object
  const addExperience = () => {
    const newId = data.length > 0 ? Math.max(...data.map(w => w.id)) + 1 : 1;
    update([
      ...data, 
      { 
        id: newId, 
        company: "", 
        designation: "", 
        fromDate: "", 
        toDate: "", 
        lastSalary: "", 
        // Array to store multiple files
        documents: [],
        // For dropdown
        isDropdownOpen: false,
        // For checkboxes
        documentSelections: []
      }
    ]);
  };

  // Remove a specific work experience entry
  const removeExperience = (id) => {
    if (data.length > 1) {
      update(data.filter((item) => item.id !== id));
    } else {
      setMessage("At least one work experience is required");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // Handle text input changes
  const handleChange = (id, field, value) => {
    update(data.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // Toggle dropdown
  const toggleDropdown = (id) => {
    update(data.map((item) => 
      item.id === id ? { ...item, isDropdownOpen: !item.isDropdownOpen } : item
    ));
  };

  // Toggle document checkbox
  const toggleDocumentCheckbox = (id, docType) => {
    update(data.map((item) => {
      if (item.id === id) {
        const currentSelections = item.documentSelections || [];
        const index = currentSelections.indexOf(docType);
        
        let newSelections;
        if (index > -1) {
          // Remove if already selected
          newSelections = currentSelections.filter(doc => doc !== docType);
        } else {
          // Add if not selected
          newSelections = [...currentSelections, docType];
        }
        
        return { 
          ...item, 
          documentSelections: newSelections,
          isDropdownOpen: true 
        };
      }
      return item;
    }));
  };

  // Handle file upload for specific document type
  const handleFileChange = (id, file, docType) => {
    if (!file) return;
    
    update(data.map((item) => {
      if (item.id === id) {
        const newDocument = {
          id: Date.now(),
          type: docType,
          file: file,
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };
        
        return {
          ...item,
          documents: [...(item.documents || []), newDocument]
        };
      }
      return item;
    }));
  };

  // Remove a specific file
  const removeFile = (id, fileId) => {
    update(data.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          documents: (item.documents || []).filter(doc => doc.id !== fileId)
        };
      }
      return item;
    }));
  };

  // Document options
  const documentOptions = [
    "Joining Letter",
    "Experience Letter",
    "Salary Slip",
    "Offer Letter",
    "Relieving Letter",
    "Appointment Letter",
    "Resignation Letter",
    "Other Document"
  ];

  // Get files by document type
  const getFilesByType = (documents, docType) => {
    return (documents || []).filter(doc => doc.type === docType);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validation function
  const validateWorkExperience = () => {
    if (data.length === 0) {
      return true; // Work experience is optional
    }

    for (const work of data) {
      if (!work.company?.trim()) {
        setMessage("Please enter company name for all work experiences");
        return false;
      }
      if (!work.designation?.trim()) {
        setMessage("Please enter designation for all work experiences");
        return false;
      }
      if (!work.fromDate) {
        setMessage("Please enter from date for all work experiences");
        return false;
      }
      if (!work.toDate) {
        setMessage("Please enter to date for all work experiences");
        return false;
      }
      // Validate date order
      if (work.fromDate && work.toDate && work.fromDate > work.toDate) {
        setMessage("From date cannot be after to date");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = () => {
    // Validate work experience
    if (!validateWorkExperience()) {
      return;
    }

    // For the last step, call onFinalSubmit
    if (isLastStep) {
      onFinalSubmit();
    } else {
      nextStep(); // Just navigate to next step
    }
  };

  return (
    <div className="space-y-8 mt-4">
      {data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
          <FaBuilding className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">No work experience added</p>
          <p className="text-gray-500 text-sm mt-2">Click "Add work experience" to begin</p>
          <p className="text-gray-400 text-xs mt-1">(This section is optional)</p>
        </div>
      ) : (
        data.map((work, index) => (
          <div key={work.id} className="p-6 bg-[#F9F9F9] rounded-[20px] border border-gray-100 hover:border-gray-200 transition-colors">
            
            {/* Header with Delete Button */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Work Experience {index + 1}</h3>
                <p className="text-sm text-gray-500 mt-1">Fill details for this work experience</p>
              </div>
              {data.length > 0 && (
                <button 
                  onClick={() => removeExperience(work.id)}
                  className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"
                  title="Remove this entry"
                >
                  <FaTrash size={14} />
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Row 1: Company & Designation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-[#666666] font-medium block">Company Name*</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={work.company || ""}
                      onChange={(e) => handleChange(work.id, "company", e.target.value)}
                      placeholder="Enter Company Name"
                      className="w-full h-12 pl-10 pr-4 rounded-[10px] bg-white border border-gray-200 focus:border-[#0CD974] focus:outline-none transition-all text-gray-700"
                    />
                    <FaBuilding className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#666666] font-medium block">Designation*</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={work.designation || ""}
                      onChange={(e) => handleChange(work.id, "designation", e.target.value)}
                      placeholder="Enter Your Designation"
                      className="w-full h-12 pl-10 pr-4 rounded-[10px] bg-white border border-gray-200 focus:border-[#0CD974] focus:outline-none transition-all text-gray-700"
                    />
                    <FaBriefcase className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Row 2: Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-[#666666] font-medium block">From Date*</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={work.fromDate || ""}
                      onChange={(e) => handleChange(work.id, "fromDate", e.target.value)}
                      className="w-full h-12 pl-10 pr-4 rounded-[10px] bg-white border border-gray-200 focus:border-[#0CD974] focus:outline-none transition-all text-gray-700"
                      max={new Date().toISOString().split('T')[0]}
                    />
                    <FaCalendarAlt className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#666666] font-medium block">To Date*</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={work.toDate || ""}
                      onChange={(e) => handleChange(work.id, "toDate", e.target.value)}
                      className="w-full h-12 pl-10 pr-4 rounded-[10px] bg-white border border-gray-200 focus:border-[#0CD974] focus:outline-none transition-all text-gray-700"
                      max={new Date().toISOString().split('T')[0]}
                    />
                    <FaCalendarAlt className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
                  </div>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id={`currentlyWorking-${work.id}`}
                      checked={work.toDate === ""}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleChange(work.id, "toDate", "");
                        }
                      }}
                      className="w-4 h-4 text-[#0CD974] rounded border-gray-300"
                    />
                    <label htmlFor={`currentlyWorking-${work.id}`} className="ml-2 text-sm text-gray-600">
                      Currently working here
                    </label>
                  </div>
                </div>
              </div>

              {/* Row 3: Salary */}
              <div className="space-y-2">
                <label className="text-sm text-[#666666] font-medium block">Monthly CTC (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={work.lastSalary || ""}
                    onChange={(e) => handleChange(work.id, "lastSalary", e.target.value)}
                    placeholder="Enter your last salary (e.g., ₹50,000)"
                    className="w-full h-12 pl-10 pr-4 rounded-[10px] bg-white border border-gray-200 focus:border-[#0CD974] focus:outline-none transition-all text-gray-700"
                  />
                  <FaDollarSign className="absolute left-3.5 top-3.5 text-gray-400 w-4 h-4" />
                </div>
              </div>

              {/* Document Selection Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#666666] font-medium block">
                    Select Documents to Upload (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleDropdown(work.id)}
                    className="w-full flex items-center justify-between p-4 rounded-[10px] bg-white border border-gray-200 hover:border-[#0CD974] transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded bg-[#0CD974]/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-[#0CD974]">
                          {(work.documentSelections || []).length}
                        </span>
                      </div>
                      <span className="text-gray-700">
                        {(work.documentSelections || []).length === 0 
                          ? "Select document types" 
                          : `${(work.documentSelections || []).length} document types selected`}
                      </span>
                    </div>
                    {work.isDropdownOpen ? (
                      <FaChevronUp className="text-gray-400" />
                    ) : (
                      <FaChevronDown className="text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Dropdown Content */}
                {work.isDropdownOpen && (
                  <div className="bg-white border border-gray-200 rounded-[10px] p-4">
                    <div className="space-y-3">
                      {documentOptions.map((docType) => {
                        const isSelected = (work.documentSelections || []).includes(docType);
                        return (
                          <div key={docType} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <input
                              type="checkbox"
                              id={`${work.id}-${docType}`}
                              checked={isSelected}
                              onChange={() => toggleDocumentCheckbox(work.id, docType)}
                              className="w-4 h-4 text-[#0CD974] rounded border-gray-300 focus:ring-[#0CD974] focus:ring-2"
                            />
                            <label 
                              htmlFor={`${work.id}-${docType}`}
                              className="flex-1 text-sm text-gray-700 cursor-pointer select-none"
                            >
                              {docType}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => toggleDropdown(work.id)}
                        className="w-full py-2 text-sm font-medium text-[#0CD974] hover:bg-[#0CD974]/5 rounded-lg transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                {/* Upload Sections */}
                {(work.documentSelections || []).length > 0 && (
                  <div className="space-y-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700">Upload Documents</h4>
                    
                    <div className="space-y-4">
                      {(work.documentSelections || []).map((docType) => {
                        const filesForType = getFilesByType(work.documents || [], docType);
                        
                        return (
                          <div key={docType} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">
                                {docType}
                                {filesForType.length > 0 && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    ({filesForType.length} uploaded)
                                  </span>
                                )}
                              </label>
                            </div>
                            
                            <div className="space-y-2">
                              <input
                                type="file"
                                id={`file-${work.id}-${docType.replace(/\s+/g, '-')}`}
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    handleFileChange(work.id, file, docType);
                                    e.target.value = '';
                                  }
                                }}
                                multiple
                              />
                              <label
                                htmlFor={`file-${work.id}-${docType.replace(/\s+/g, '-')}`}
                                className="flex items-center justify-center gap-2 w-full h-12 rounded-[10px] border border-dashed border-gray-300 bg-white cursor-pointer hover:border-[#0CD974] hover:bg-green-50 transition-all"
                              >
                                <FaUpload className="text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  Upload {docType}
                                </span>
                              </label>
                            </div>

                            {/* Uploaded Files */}
                            {filesForType.length > 0 && (
                              <div className="space-y-2">
                                {filesForType.map((doc) => (
                                  <div key={doc.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                      <FaFile className="text-gray-400 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 truncate">{doc.name}</p>
                                        <p className="text-xs text-gray-500">
                                          {formatFileSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeFile(work.id, doc.id)}
                                      className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded-full ml-2 flex-shrink-0"
                                    >
                                      <FaTimes size={14} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Add Button */}
      <button 
        onClick={addExperience}
        type="button"
        className="w-full flex items-center justify-center gap-2 text-[#0CD974] hover:text-[#0bb963] font-medium py-3 border border-dashed border-[#0CD974] rounded-[10px] hover:bg-green-50 transition-all"
      >
        <FaPlus size={14} />
        <span>Add work experience</span>
      </button>

      {/* Validation message */}
      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm text-center">{message}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 rounded-[10px] bg-[#0CD974] text-white font-medium hover:bg-[#0bb963] transition-colors shadow-md"
        >
          {isLastStep ? "Submit All" : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}