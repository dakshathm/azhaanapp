// components/QualificationDetails.jsx
import React, { useState } from "react";
import { FaPlus, FaUpload, FaTrash } from "react-icons/fa";

const DEGREE_OPTIONS = ["10th", "12th", "Degree", "University"];

export default function QualificationDetails({ data, update, nextStep, isLastStep, onFinalSubmit }) {
  const [message, setMessage] = useState("");
  
  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  const addQualification = () => {
    update([
      ...safeData,
      {
        id: Date.now(),
        schoolName: "",
        degree: "",
        percentage: "",
        year: "",
        file: null,
      },
    ]);
  };

  const deleteQualification = (id) => {
    if (safeData.length === 1) {
      alert("At least one qualification is required");
      return;
    }
    update(safeData.filter((q) => q.id !== id));
  };

  const updateItem = (id, field, value) => {
    update(
      safeData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleFileChange = (id, file) => {
    updateItem(id, "file", file);
  };

  const getAvailableDegrees = (currentIndex) => {
    const usedBefore = safeData
      .slice(0, currentIndex)
      .map((q) => q.degree);

    return DEGREE_OPTIONS.filter((opt) => {
      if (opt === "Degree") return true;
      if (opt === "University") return true;
      return !usedBefore.includes(opt); // hide 10th/12th after use
    });
  };

  // Validation function
  const validateQualifications = () => {
    if (safeData.length === 0) {
      setMessage("Please add at least one qualification");
      return false;
    }

    for (const qual of safeData) {
      if (!qual.schoolName.trim()) {
        setMessage("Please enter institution name for all qualifications");
        return false;
      }
      if (!qual.degree) {
        setMessage("Please select degree for all qualifications");
        return false;
      }
      if (!qual.percentage) {
        setMessage("Please enter percentage for all qualifications");
        return false;
      }
      if (!qual.year) {
        setMessage("Please enter year of passing for all qualifications");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = () => {
    // Validate qualifications
    if (!validateQualifications()) {
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
      {safeData.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
          <p className="text-gray-500">No qualifications added yet</p>
          <p className="text-sm text-gray-400 mt-2">Click "Add qualification" to get started</p>
        </div>
      ) : (
        safeData.map((item, index) => (
          <div
            key={item.id}
            className="space-y-6 pb-6 border-b border-gray-100 last:border-0"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Qualification {index + 1}
              </h3>
              {safeData.length > 1 && (
                <button
                  onClick={() => deleteQualification(item.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full"
                  title="Delete qualification"
                >
                  <FaTrash />
                </button>
              )}
            </div>

            {/* School / College */}
            <div className="space-y-2">
              <label className="text-sm text-[#666666] font-medium block">
                School / College / University Name*
              </label>
              <input
                className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] border border-transparent focus:bg-white focus:border-[#0CD974] outline-none"
                value={item.schoolName}
                onChange={(e) =>
                  updateItem(item.id, "schoolName", e.target.value)
                }
                placeholder="Enter institution name"
              />
            </div>

            {/* ONE ROW: Degree + Percentage + Year */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-[#666666] font-medium block">
                  Qualification / Degree*
                </label>
                <select
                  value={item.degree}
                  onChange={(e) =>
                    updateItem(item.id, "degree", e.target.value)
                  }
                  className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] border border-transparent focus:bg-white focus:border-[#0CD974] outline-none"
                >
                  <option value="">Select</option>
                  {getAvailableDegrees(index).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#666666] font-medium block">
                  Percentage (%)*
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] border border-transparent focus:bg-white focus:border-[#0CD974] outline-none"
                  value={item.percentage}
                  onChange={(e) =>
                    updateItem(item.id, "percentage", e.target.value)
                  }
                  placeholder="Percentage"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-[#666666] font-medium block">
                  Year of Passing*
                </label>
                <input
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] border border-transparent focus:bg-white focus:border-[#0CD974] outline-none"
                  value={item.year}
                  onChange={(e) =>
                    updateItem(item.id, "year", e.target.value)
                  }
                  placeholder="Year"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm text-[#666666] font-medium block">
                Upload Supported Documents (Optional)
              </label>

              <input
                type="file"
                id={`file-${item.id}`}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  handleFileChange(item.id, e.target.files[0])
                }
              />

              <label
                htmlFor={`file-${item.id}`}
                className="flex items-center justify-center gap-2 w-full h-12 rounded-[10px] border border-dashed border-gray-300 bg-white cursor-pointer hover:border-[#0CD974] hover:bg-green-50 transition-all"
              >
                <FaUpload className="text-gray-400" />
                <span className="text-sm text-gray-500 truncate max-w-[220px]">
                  {item.file ? item.file.name : "Click to upload"}
                </span>
              </label>

              <div className="flex justify-between text-xs text-gray-400">
                <span>PDF / JPG / PNG allowed</span>
                {item.file && (
                  <button
                    type="button"
                    onClick={() => handleFileChange(item.id, null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove file
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* ADD BUTTON */}
      <div className="flex justify-center">
        <button
          onClick={addQualification}
          type="button"
          className="text-[#0CD974] hover:text-[#0bb963] font-medium flex items-center gap-2 px-4 py-2 border border-dashed border-[#0CD974] rounded-lg hover:bg-green-50 transition-all"
        >
          <FaPlus className="w-4 h-4" />
          Add another qualification
        </button>
      </div>

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