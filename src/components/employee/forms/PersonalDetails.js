import React, { useRef, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { GetMyProfileService } from "../../services/ApiService";

export default function PersonalDetails({
  data,
  update,
  nextStep,
  isLastStep,
  onFinalSubmit,
}) {
  const inputRef = useRef(null);

  // ✅ SAFE FUNCTION NORMALIZATION (CRITICAL FIX)
  const safeNextStep =
    typeof nextStep === "function" ? nextStep : () => {
      console.log("safeNextStep called (empty function)");
    };
  const safeFinalSubmit =
    typeof onFinalSubmit === "function" ? onFinalSubmit : () => {
      console.log("safeFinalSubmit called (empty function)");
    };

  // ===============================
  // AUTO-FILL (UNCHANGED)
  // ===============================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await GetMyProfileService();
        if (res) {
          update({
            ...data,
            firstName: res.first_name || "",
            middleName: res.middle_name || "",
            lastName: res.last_name || "",
            email: res.email || "",
            phone: res.mobile_number || "",
            dob: res.date_of_birth || "",
            gender: res.gender ? res.gender.toLowerCase() : "",
            fatherName: res.father_name || "",
            motherName: res.mother_name || "",
            permanentAddress: res.permanent_address || "",
            residentialAddress: res.current_address || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Max date for 18+ restriction
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  const handleChange = (field, value) => {
    update({ ...data, [field]: value });
  };

  const handleSameAddress = (checked) => {
    if (checked) {
      update({ ...data, residentialAddress: data.permanentAddress });
    }
  };

  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "dob",
    "gender",
    "permanentAddress",
    "residentialAddress",
    "fatherName",
    "motherName",
  ];

  // ✅ FIXED: Check for null/undefined first, then check trim
  const isFormValid = () => {
    // Debug: Check each field
    const validationResults = requiredFields.map(field => {
      const value = data[field];
      const isValid = value && value.toString().trim() !== "";
      console.log(`${field}: "${value}" - valid: ${isValid}`);
      return isValid;
    });
    
    const allValid = validationResults.every(result => result === true);
    console.log("All fields valid:", allValid);
    return allValid;
  };

  // ===============================
  // ✅ ABSOLUTELY SAFE SUBMIT (WITH DEBUG)
  // ===============================
  const handleSubmit = () => {
    console.log("=== handleSubmit clicked ===");
    console.log("Form data:", data);
    
    const isValid = isFormValid();
    console.log("Form valid?", isValid);
    console.log("isLastStep?", isLastStep);
    console.log("safeNextStep:", typeof safeNextStep);
    console.log("safeFinalSubmit:", typeof safeFinalSubmit);

    if (!isValid) {
      alert("Please fill all required fields before continuing.");
      return;
    }

    console.log("=== Calling navigation function ===");
    if (isLastStep) {
      console.log("Calling safeFinalSubmit...");
      safeFinalSubmit();
    } else {
      console.log("Calling safeNextStep...");
      safeNextStep();
    }
  };

  return (
    <div className="space-y-8 mt-4">
      {/* Row 1: First, Middle, Last Name */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "First Name*", field: "firstName", placeholder: "Enter first name" },
          { label: "Middle Name", field: "middleName", placeholder: "Enter middle name" },
          { label: "Last Name*", field: "lastName", placeholder: "Enter last name" },
        ].map(({ label, field, placeholder }) => (
          <div key={field} className="space-y-2">
            <label className="text-sm pl-4 text-[#666666] font-medium">
              {label}
            </label>
            <input
              value={data?.[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] border border-transparent focus:bg-white focus:border-[#0CD974] outline-none"
            />
          </div>
        ))}
      </div>

      {/* Row 2: Email, Mobile, Alternate Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm text-[#666666] font-medium">
            Email ID*
          </label>
          <input
            type="email"
            value={data?.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email"
            className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] focus:bg-white focus:border-[#0CD974] outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#666666] font-medium">
            Mobile Number*
          </label>
          <input
            value={data?.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter mobile number"
            className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] focus:bg-white focus:border-[#0CD974] outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#666666] font-medium">
            Alternate Mobile <span className="text-xs text-gray-400">(Optional)</span>
          </label>
          <input
            value={data?.alternatePhone || ""}
            onChange={(e) => handleChange("alternatePhone", e.target.value)}
            placeholder="Enter alternate mobile"
            className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] focus:bg-white focus:border-[#0CD974] outline-none"
          />
        </div>
      </div>

      {/* Row 3: DOB & Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm text-[#666666] font-medium">
            Date of Birth*
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="date"
              value={data?.dob || ""}
              onChange={(e) => handleChange("dob", e.target.value)}
              max={maxDate}
              className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] focus:bg-white focus:border-[#0CD974] outline-none"
            />
            <FaCalendarAlt
              className="absolute right-4 top-4 text-gray-400 cursor-pointer"
              onClick={() => inputRef.current?.focus()}
            />
          </div>
          <p className="text-xs text-gray-400">Must be 18+ years old</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-[#666666] font-medium">
            Gender*
          </label>
          <div className="flex gap-8 h-12 items-center">
            {["male", "female"].map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={data?.gender === g}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  className="accent-[#0CD974]"
                />
                <span className="capitalize">{g}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Father & Mother Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Father's Name*", field: "fatherName", placeholder: "Enter Father's Name" },
          { label: "Mother's Name*", field: "motherName", placeholder: "Enter Mother's Name" },
        ].map(({ label, field, placeholder }) => (
          <div key={field} className="space-y-2">
            <label className="text-sm text-[#666666] font-medium">
              {label}
            </label>
            <input
              value={data?.[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              className="w-full h-12 px-4 rounded-[10px] bg-[#F5F5F5] focus:bg-white focus:border-[#0CD974] outline-none"
            />
          </div>
        ))}
      </div>

      {/* Row 5: Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm text-[#666666] font-medium">
            Permanent Address*
          </label>
          <textarea
            rows={4}
            value={data?.permanentAddress || ""}
            onChange={(e) => handleChange("permanentAddress", e.target.value)}
            placeholder="Enter permanent address"
            className="w-full p-4 rounded-[10px] bg-[#F5F5F5] resize-none focus:bg-white focus:border-[#0CD974] outline-none transition-colors"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <label className="text-sm text-[#666666] font-medium">
              Residential Address*
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                onChange={(e) => handleSameAddress(e.target.checked)}
                className="accent-[#0CD974]"
              />
              Same as Permanent Address
            </label>
          </div>

          <textarea
            rows={4}
            value={data?.residentialAddress || ""}
            onChange={(e) => handleChange("residentialAddress", e.target.value)}
            placeholder="Enter residential address"
            className="w-full p-4 rounded-[10px] bg-[#F5F5F5] resize-none focus:bg-white focus:border-[#0CD974] outline-none transition-colors"
          />
        </div>
      </div>

      {/* Submit / Next Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-lg bg-[#0CD974] text-white hover:bg-[#0bb963] transition-colors"
        >
          {isLastStep ? "Submit All" : "Save & Continue"}
        </button>
      </div>
    </div>
  );
}