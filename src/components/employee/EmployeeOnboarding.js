import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PersonalDetails from "../employee/forms/PersonalDetails";
import KycDetails from "../employee/forms/KycDetails";
import QualificationDetails from "../employee/forms/QualificationDetails";
import WorkExperience from "../employee/forms/WorkExperience";
import OtherDetails from "../employee/forms/OtherDetails";
import { FaCheckCircle } from "react-icons/fa";  // Importing checkmark icon for Sidebar

export default function EmployeeOnboarding() {
  const [activeStep, setActiveStep] = useState(1);

  // --- Centralized State (Lifted Up) ---
  const [personalDetails, setPersonalDetails] = useState({
    firstName: "", lastName: "", middleName: "", email: "", phone: "",
    altPhone: "", dob: "", gender: "", permanentAddress: "", residentialAddress: "",
  });

  const [kycDetails, setKycDetails] = useState({
    aadhaarNumber: "", panNumber: "", passportNumber: "",
    passportExpiry: "", bankName: "", ifscCode: "", bankAccount: "",
  });

  const [qualifications, setQualifications] = useState([
    { id: 1, institutionName: "", degree: "", percentage: "", year: "", file: null },
  ]);

  const [workExperiences, setWorkExperiences] = useState([
    { id: 1, company: "", designation: "", fromDate: "", toDate: "", lastSalary: "", documentType: "", documentFile: null },
  ]);

  const [otherDetails, setOtherDetails] = useState({
    languagesAndInfo: "", confirmation: false, place: "", date: "", signatureName: "",
  });

  // --- Navigation Handlers ---
  const handleNext = () => {
    if (activeStep < 5) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (activeStep > 1) setActiveStep(prev => prev - 1);
  };

  // --- Render Active Form ---
  const renderForm = () => {
    switch (activeStep) {
      case 1: return <PersonalDetails data={personalDetails} update={setPersonalDetails} />;
      case 2: return <KycDetails data={kycDetails} update={setKycDetails} />;
      case 3: return <QualificationDetails data={qualifications} update={setQualifications} />;
      case 4: return <WorkExperience data={workExperiences} update={setWorkExperiences} />;
      case 5: return <OtherDetails data={otherDetails} update={setOtherDetails} resetAll={() => window.location.reload()} />;
      default: return null;
    }
  };

  const getStepTitle = () => {
    const titles = ["Personal Details", "KYC Documents & Details", "Qualification Details", "Work Experience", "Other Details"];
    return titles[activeStep - 1];
  };

  return (
<div className="min-h-screen bg-[#F5F5F5] flex justify-center p-6">
      {/* Header - Centered Title */}
      <div className="absolute top-4 left-0 right-0 text-center">
        <h1 className="text-3xl font-semibold text-gray-800">Employee Registration</h1>
      </div>

      {/* Main Card Container with Fixed Height for scrolling */}
<div className="w-full max-w-6xl h-[85vh] 
                bg-white rounded-[40px] shadow-xl 
                overflow-hidden 
                flex">

        {/* Left Sidebar (Fixed) */}
        <Sidebar activeStep={activeStep} setActiveStep={setActiveStep} />

        {/* Right Content (Scrollable) */}
        <div className="flex-1 flex flex-col h-full">
          {/* Fixed Header inside Right Content */}
          <div className="px-10 pt-10 pb-4 bg-white z-10">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
              {getStepTitle()}
            </h2>
            <div className="w-12 h-1 bg-gray-200 mt- rounded-full"></div>
          </div>

          {/* Scrollable Form Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-10 pb-10">
            {renderForm()}
          </div>

          {/* Fixed Footer for Navigation Buttons */}
          {/* <div className="px-10 py-6 border-t border-gray-100 bg-white flex justify-end">
             {activeStep < 5 ? (
                <button 
                  onClick={handleNext}
                  className="bg-[#0CD974] hover:bg-[#0bb963] text-white px-8 py-3 rounded-[10px] font-medium transition-colors flex items-center gap-2 shadow-sm"
                >
                  Save & next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
             ) : null}
          </div> */}
        </div>
      </div>

      {/* Footer Section */}
      {/* <footer className="w-full bg-gray-800 py-4 mt-6">
        <div className="text-center text-white text-sm">
          <span>© 2025 51Code Solutions Pvt. Ltd.</span>
        </div>
      </footer> */}
    </div>
  );
}
