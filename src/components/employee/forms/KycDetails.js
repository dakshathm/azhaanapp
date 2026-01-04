// components/KycDetails.jsx
import React, { useState } from "react";

export default function KycDetails({ data, update, nextStep, isLastStep, onFinalSubmit }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ SAFE FUNCTION NORMALIZATION (CRITICAL FIX)
  const safeNextStep = typeof nextStep === "function" ? nextStep : () => {
    console.warn("nextStep function not provided to KycDetails");
  };
  
  const safeFinalSubmit = typeof onFinalSubmit === "function" ? onFinalSubmit : () => {
    console.warn("onFinalSubmit function not provided to KycDetails");
  };

  const handleChange = (field, value) => {
    update({ ...data, [field]: value });
  };

  const InputField = ({ label, value, field, placeholder, helper }) => (
    <div className="space-y-1">
      <label className="text-sm text-[#666666] font-medium block">{label}</label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] border border-transparent focus:bg-white focus:border-[#0CD974] focus:outline-none transition-all text-gray-700"
      />
      {helper && <p className="text-xs text-gray-400">{helper}</p>}
    </div>
  );

  const UploadCard = ({ label, accept, multiple, field }) => {
    const handleFiles = (e) => {
      const files = Array.from(e.target.files);
      handleChange(field, files);
    };

    return (
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 cursor-pointer hover:border-[#0CD974] hover:bg-gray-100 transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v9m0-9l-4 4m4-4l4 4"
            />
          </svg>
          <span className="text-gray-500 text-sm">Click to upload or drag files here</span>
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFiles}
            className="hidden"
          />
        </label>
        {/* Show uploaded file names */}
        {data[field]?.length > 0 && (
          <ul className="text-xs text-gray-500 space-y-1 max-h-20 overflow-y-auto">
            {data[field].map((file, i) => (
              <li key={i} className="truncate">{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const handleSubmit = () => {
    // Basic validation for KYC
    if (!data.aadhaarNumber || !data.panNumber) {
      alert("Please fill Aadhaar and PAN details before continuing");
      return;
    }

    // ✅ SAFE SUBMIT HANDLING
    if (isLastStep) {
      safeFinalSubmit();
    } else {
      safeNextStep(); // Just navigate to next step
    }
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Aadhaar & PAN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Aadhaar Number*"
          field="aadhaarNumber"
          value={data.aadhaarNumber}
          placeholder="xxxx xxxx xxxx"
          helper="12-digit Aadhaar number"
        />
        <InputField
          label="PAN Number*"
          field="panNumber"
          value={data.panNumber}
          placeholder="ABCDE1234F"
          helper="10-character PAN number"
        />
      </div>

      {/* Passport */}
      <label className="text-xl text-[#000000] font-medium block">Passport Details</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Passport Number"
          field="passportNumber"
          value={data.passportNumber}
          placeholder="Enter passport number"
        />
        <div className="space-y-1">
          <label className="text-sm text-[#666666] font-medium block">Passport Expiry Date</label>
          <input
            type="date"
            value={data.passportExpiry || ""}
            onChange={(e) => handleChange("passportExpiry", e.target.value)}
            className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] border border-transparent focus:bg-white focus:border-[#0CD974] focus:outline-none"
          />
        </div>
      </div>

      {/* Bank Details */}
      <div className="space-y-4">
        <label className="text-xl text-[#000000] font-medium block">Bank Details</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm text-[#666666] font-medium block">Bank Name</label>
            <select
              value={data.bankName || ""}
              onChange={(e) => handleChange("bankName", e.target.value)}
              className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] border border-transparent focus:bg-white focus:border-[#0CD974] focus:outline-none"
            >
              <option value="">Select Bank</option>
              <option value="SBI">SBI</option>
              <option value="HDFC">HDFC</option>
              <option value="ICICI">ICICI</option>
              <option value="Axis">Axis Bank</option>
              <option value="Kotak">Kotak Mahindra</option>
              <option value="PNB">Punjab National Bank</option>
              <option value="BOB">Bank of Baroda</option>
              <option value="Canara">Canara Bank</option>
            </select>
          </div>

          <InputField
            label="IFSC Code"
            field="ifscCode"
            value={data.ifscCode}
            placeholder="Enter IFSC code"
          />
          <InputField
            label="Bank Account Number"
            field="bankAccount"
            value={data.bankAccount}
            placeholder="Enter account number"
          />
        </div>
      </div>

      {/* Upload Documents */}
      <div className="space-y-4 mt-6">
        <label className="text-xl font-medium text-[#000000]">Upload Supported Documents</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <UploadCard
            label="Aadhaar Card (Front and Back)"
            accept=".pdf,image/jpeg,image/jpg,image/png"
            multiple
            field="aadhaarFiles"
          />
          <UploadCard
            label="PAN Card (Front side)"
            accept=".pdf,image/jpeg,image/jpg,image/png"
            multiple
            field="panFiles"
          />
          <UploadCard
            label="Bank Passbook (First page)"
            accept=".pdf,image/jpeg,image/jpg,image/png"
            multiple
            field="bankFiles"
          />
        </div>
        <p className="text-xs text-gray-400">Max file size: 5MB each. Formats: PDF, JPG, PNG</p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-100">
        <button 
          onClick={handleSubmit}
          className="px-8 py-3 rounded-[10px] bg-[#0CD974] text-white font-medium hover:bg-[#0bb963] transition-colors shadow-md"
        >
          {isLastStep ? "Submit All" : "Save & Continue"}
        </button>
      </div>

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}

// Optional: Add default props for additional safety
KycDetails.defaultProps = {
  nextStep: () => {},
  onFinalSubmit: () => {},
  isLastStep: false,
  data: {},
  update: () => {},
};