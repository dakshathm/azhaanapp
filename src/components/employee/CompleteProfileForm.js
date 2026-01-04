// components/CompleteProfileForm.jsx
import React, { useState } from "react";
import PersonalDetails from "./PersonalDetails";
import KycDetails from "./KycDetails";
import WorkExperience from "./WorkExperience";
import QualificationDetails from "./QualificationDetails";
import OtherDetails from "./OtherDetails";
import {
  SyncProfileService,
  UploadDocumentsService,
  FinalizeOnboardingService,
} from "../../services/ApiService";

export default function CompleteProfileForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  console.log("=== CompleteProfileForm rendered ===");
  console.log("activeStep:", activeStep);
  console.log("isSubmitting:", isSubmitting);

  // Initialize all form states
  const [formData, setFormData] = useState({
    personalDetails: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      alternatePhone: "",
      dob: "",
      gender: "",
      fatherName: "",
      motherName: "",
      permanentAddress: "",
      residentialAddress: "",
    },
    kycDetails: {
      aadhaarNumber: "",
      panNumber: "",
      passportNumber: "",
      passportExpiry: "",
      bankName: "",
      ifscCode: "",
      bankAccount: "",
      aadhaarFiles: [],
      panFiles: [],
      bankFiles: [],
    },
    workExperience: [
      {
        id: 1,
        company: "",
        designation: "",
        fromDate: "",
        toDate: "",
        lastSalary: "",
        documents: [],
        documentSelections: [],
      },
    ],
    qualifications: [
      {
        id: Date.now(),
        schoolName: "",
        degree: "",
        percentage: "",
        year: "",
        file: null,
      },
    ],
    otherDetails: {
      languagesAndInfo: "",
      confirmation: false,
      place: "",
      signatureName: "",
      date: "",
    },
  });

  // Navigation functions WITH DEBUG LOGS
  const nextStep = () => {
    console.log("=== nextStep() called ===");
    console.log("Current activeStep:", activeStep);
    
    if (activeStep < 4) { // 0-4 for 5 steps
      const newStep = activeStep + 1;
      console.log(`Moving from step ${activeStep} to step ${newStep}`);
      setActiveStep(newStep);
    } else {
      console.log("Already at last step (4)");
    }
  };

  const prevStep = () => {
    console.log("=== prevStep() called ===");
    if (activeStep > 0) {
      const newStep = activeStep - 1;
      console.log(`Moving from step ${activeStep} to step ${newStep}`);
      setActiveStep(newStep);
    }
  };

  // Update specific section data
  const updateFormData = (section, data) => {
    console.log(`updateFormData: ${section}`, data);
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  // Transform form data to match API structure
  const prepareSyncData = () => {
    const {
      personalDetails,
      kycDetails,
      qualifications,
      workExperience,
      otherDetails,
    } = formData;

    // Transform personal details
    const personalData = {
      mobile_number: personalDetails.phone || "",
      email: personalDetails.email || "",
      date_of_birth: personalDetails.dob || "",
      father_name: personalDetails.fatherName || "",
      gender: personalDetails.gender
        ? personalDetails.gender.toUpperCase()
        : "MALE",
      permanent_address: personalDetails.permanentAddress || "",
      current_address:
        personalDetails.residentialAddress ||
        personalDetails.permanentAddress ||
        "",
    };

    // Transform KYC details
    const kycData = {
      aadhaar_number: kycDetails.aadhaarNumber || "",
      pan_number: kycDetails.panNumber || "",
      bank_account_no: kycDetails.bankAccount || "",
      ifsc_code: kycDetails.ifscCode || "",
      passport_number: kycDetails.passportNumber || "",
    };

    // Transform education data
    const educationData = qualifications.map((qual) => ({
      level: mapDegreeToLevel(qual.degree),
      institution_name: qual.schoolName || "",
      year_of_passing: parseInt(qual.year) || 0,
      percentage_marks: parseFloat(qual.percentage) || 0,
    }));

    // Transform work experience
    const workExperienceData = workExperience.map((work) => ({
      company_name: work.company || "",
      role: work.designation || "",
      start_date: work.fromDate || "",
      end_date: work.toDate || "",
      last_salary: parseFloat(work.lastSalary) || 0,
    }));

    return {
      personal_details: personalData,
      kyc_details: kycData,
      education: educationData,
      work_experience: workExperienceData,
      declaration_accepted: otherDetails.confirmation || false,
    };
  };

  // Helper to map degree to API level
  const mapDegreeToLevel = (degree) => {
    switch (degree) {
      case "10th":
        return "10th";
      case "12th":
        return "12th";
      case "Degree":
        return "degree";
      case "University":
        return "higher_degree";
      default:
        return "other";
    }
  };

  // Prepare FormData for document uploads
  const prepareDocumentsFormData = () => {
    const formDataObj = new FormData();
    const { kycDetails, qualifications, workExperience } = formData;

    // KYC Documents
    if (kycDetails.aadhaarFiles?.length > 0) {
      kycDetails.aadhaarFiles.forEach((file) => {
        formDataObj.append("aadhaar", file);
      });
    }

    if (kycDetails.panFiles?.length > 0) {
      kycDetails.panFiles.forEach((file) => {
        formDataObj.append("pan", file);
      });
    }

    if (kycDetails.bankFiles?.length > 0) {
      kycDetails.bankFiles.forEach((file) => {
        formDataObj.append("passbook", file);
      });
    }

    // Education Documents
    qualifications.forEach((qual, index) => {
      if (qual.file) {
        const fieldName = mapDegreeToDocumentField(qual.degree);
        formDataObj.append(fieldName, qual.file);
      }
    });

    // Work Experience Documents
    workExperience.forEach((work) => {
      work.documents?.forEach((doc) => {
        const fieldName = mapDocumentTypeToField(doc.type);
        if (fieldName && doc.file) {
          formDataObj.append(fieldName, doc.file);
        }
      });
    });

    return formDataObj;
  };

  // Helper to map document types to API field names
  const mapDocumentTypeToField = (docType) => {
    const mapping = {
      "Joining Letter": "joining_letter",
      "Experience Letter": "experience_letter",
      "Salary Slip": "salary_slip",
      "Offer Letter": "offer_letter",
      "Relieving Letter": "relieving_letter",
      "Appointment Letter": "appointment_letter",
      "Resignation Letter": "resignation_letter",
      "Other Document": "other_document",
    };
    return mapping[docType] || null;
  };

  const mapDegreeToDocumentField = (degree) => {
    switch (degree) {
      case "10th":
        return "tenth";
      case "12th":
        return "twelfth";
      case "Degree":
        return "degree";
      case "University":
        return "higher_degree";
      default:
        return "other";
    }
  };

  // Validation functions
  const validatePersonalDetails = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dob",
      "gender",
      "permanentAddress",
      "residentialAddress",
      "fatherName",
    ];

    return required.every(
      (field) =>
        formData.personalDetails[field] &&
        formData.personalDetails[field].toString().trim() !== ""
    );
  };

  const validateOtherDetails = () => {
    const other = formData.otherDetails;
    return (
      other.confirmation && other.place && other.signatureName && other.date
    );
  };

  // Main submission handler
  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Step 1: Validate data
      if (!validatePersonalDetails()) {
        alert("Please fill all required personal details before submitting");
        setIsSubmitting(false);
        return;
      }

      if (!validateOtherDetails()) {
        alert("Please complete the declaration section");
        setIsSubmitting(false);
        return;
      }

      // Step 2: Prepare and send profile data
      console.log("Submitting profile data...");
      const syncData = prepareSyncData();
      await SyncProfileService(syncData);
      console.log("Profile data submitted successfully");

      // Step 3: Upload documents (if any)
      const documentsFormData = prepareDocumentsFormData();

      // Check if there are any files to upload
      let hasFiles = false;
      for (let value of documentsFormData.values()) {
        if (value instanceof File) {
          hasFiles = true;
          break;
        }
      }

      if (hasFiles) {
        console.log("Uploading documents...");
        await UploadDocumentsService(documentsFormData);
        console.log("Documents uploaded successfully");
      }

      // Step 4: Finalize onboarding
      console.log("Finalizing onboarding...");
      await FinalizeOnboardingService();
      console.log("Onboarding finalized");

      // Step 5: Show success message
      setShowSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Failed to submit profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset all forms
  const resetAllForms = () => {
    setFormData({
      personalDetails: { ...formData.personalDetails },
      kycDetails: { ...formData.kycDetails },
      workExperience: [...formData.workExperience],
      qualifications: [...formData.qualifications],
      otherDetails: { ...formData.otherDetails },
    });
  };

  // Success Screen Component
  const SuccessScreen = () => (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-12 max-w-2xl text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your profile has been successfully submitted.
        </p>

        <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg mb-8">
          <p className="text-gray-700">
            <span className="font-medium">What happens next:</span>
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              Your profile is under review by HR
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              You will receive a confirmation email
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              Further onboarding steps will be communicated
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#0CD974] text-white font-medium rounded-lg hover:bg-[#0bb963] transition-colors"
          >
            Submit Another Form
          </button>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  if (showSuccess) {
    return <SuccessScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Step Navigation */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Complete Your Profile
        </h1>
        <p className="text-gray-600">
          Fill in all sections to submit your profile
        </p>

        <div className="flex items-center mt-6 overflow-x-auto pb-4">
          {[
            "Personal Details",
            "KYC Details",
            "Work Experience",
            "Qualification Details",
            "Other Details",
          ].map((title, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === activeStep
                    ? "bg-[#0CD974] text-white border-2 border-[#0CD974]"
                    : index < activeStep
                      ? "bg-green-100 text-green-600 border-2 border-green-200"
                      : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`ml-3 text-sm font-medium whitespace-nowrap ${
                  index === activeStep ? "text-[#0CD974]" : "text-gray-500"
                }`}
              >
                {title}
              </span>
              {index < 4 && (
                <div className="w-8 h-[2px] bg-gray-300 mx-4 flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {activeStep === 0 && (
          <PersonalDetails
            key={`personal-${activeStep}`}
            data={formData.personalDetails}
            update={(data) => updateFormData("personalDetails", data)}
            nextStep={nextStep}
            isLastStep={activeStep === 4}
            onFinalSubmit={handleFinalSubmit}
          />
        )}
        {activeStep === 1 && (
          <KycDetails
            key={`kyc-${activeStep}`}
            data={formData.kycDetails}
            update={(data) => updateFormData("kycDetails", data)}
            nextStep={nextStep}
            isLastStep={activeStep === 4}
            onFinalSubmit={handleFinalSubmit}
          />
        )}
        {activeStep === 2 && (
          <WorkExperience
            key={`work-${activeStep}`}
            data={formData.workExperience}
            update={(data) => updateFormData("workExperience", data)}
            nextStep={nextStep}
            isLastStep={activeStep === 4}
            onFinalSubmit={handleFinalSubmit}
          />
        )}
        {activeStep === 3 && (
          <QualificationDetails
            key={`qualification-${activeStep}`}
            data={formData.qualifications}
            update={(data) => updateFormData("qualifications", data)}
            nextStep={nextStep}
            isLastStep={activeStep === 4}
            onFinalSubmit={handleFinalSubmit}
          />
        )}
        {activeStep === 4 && (
          <OtherDetails
            key={`other-${activeStep}`}
            data={formData.otherDetails}
            update={(data) => updateFormData("otherDetails", data)}
            resetAll={resetAllForms}
            onFinalSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6">
        {activeStep > 0 && (
          <button
            onClick={prevStep}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            ← Previous
          </button>
        )}
      </div>
    </div>
  );
}