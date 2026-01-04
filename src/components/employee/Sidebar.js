import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaIdCard,
  FaFileInvoice,
  FaGraduationCap,
  FaBriefcase,
  FaEllipsisH,
  FaCheckCircle,
} from "react-icons/fa";
import logo from "./image.png";
import { GetMyProfileService } from "../services/ApiService"; // make sure the path is correct

const steps = [
  { id: 1, label: "Personal Details", icon: <FaIdCard /> },
  { id: 2, label: "KYC Documents & Details", icon: <FaFileInvoice /> },
  { id: 3, label: "Qualification Details", icon: <FaGraduationCap /> },
  { id: 4, label: "Work Experience", icon: <FaBriefcase /> },
  { id: 5, label: "Other Details", icon: <FaEllipsisH /> },
];

export default function Sidebar({ activeStep, setActiveStep }) {
  const [maxStep, setMaxStep] = useState(1); // Tracks the farthest step reached
  const [profile, setProfile] = useState(null); // Store profile data

  // Fetch employee profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await GetMyProfileService();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }
    fetchProfile();
  }, []);

  // Update maxStep whenever activeStep increases
  useEffect(() => {
    if (activeStep > maxStep) setMaxStep(activeStep);
  }, [activeStep, maxStep]);

  return (
    <div className="lg:w-[320px] bg-black h-full flex flex-col p-8 border-r border-gray-100 relative">
      {/* Logo */}
      <div className="absolute top-2 left-5 w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4">
        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center mt-7">
        <div className="w-28 h-28 rounded-full bg-[#E0E0E0] flex items-center justify-center mb-4 relative overflow-hidden shadow-inner">
          {profile?.profile_picture_url ? (
            <img
              src={profile.profile_picture_url}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <FaUser className="text-gray-400 text-5xl" />
          )}
        </div>
        <h3 className="text-lg font-bold text-white">
          {profile?.full_name || "Employee Name"}
        </h3>
        <p className="text-sm text-gray-400">{profile?.username || "Employee ID"}</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-2 mt-6">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          const isCompleted = step.id < activeStep && step.id <= maxStep;

          return (
            <div
              key={step.id}
              onClick={() => {
                // Can only click current step or next step, never go back
                if (step.id >= activeStep) {
                  setActiveStep(step.id);
                }
              }}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${isActive ? "bg-[#0CD974]" : "hover:bg-[#333333]"}
              `}
            >
              <div className="relative p-2 rounded-lg text-white">
                {React.cloneElement(step.icon, { className: "w-5 h-5" })}
                {isCompleted && (
                  <FaCheckCircle className="text-green-500 absolute -top-1 -right-1 w-4 h-4 z-10" />
                )}
              </div>

              <span className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-400"}`}>
                {step.label}
              </span>

              {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-white"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
