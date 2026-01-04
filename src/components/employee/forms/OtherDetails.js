// components/OtherDetails.jsx
import React, { useState, useEffect } from "react";
import { FaTimes, FaGlobe } from "react-icons/fa";

export default function OtherDetails({ 
  data, 
  update, 
  resetAll, 
  onFinalSubmit, 
  isSubmitting = false 
}) {
  const languagesList = ["English", "Hindi", "German"]; // Only allowed dropdown options
  const [tags, setTags] = useState([]);

  // Initialize tags from data on mount
  useEffect(() => {
    if (data.languagesAndInfo) {
      const initialTags = data.languagesAndInfo
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== "");
      setTags(initialTags);
    }
  }, [data.languagesAndInfo]);

  // Add tag from dropdown
  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      update({ ...data, languagesAndInfo: newTags.join(', ') });
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    setTags(newTags);
    update({ ...data, languagesAndInfo: newTags.join(', ') });
  };

  return (
    <div className="space-y-8 mt-4">
      {/* Language Dropdown */}
      <div className="space-y-2">
        <label className="text-sm text-[#666666] font-medium block">
          Select Language
        </label>
        <div className="relative">
          <select
            onChange={(e) => {
              if (e.target.value) {
                addTag(e.target.value);
                e.target.value = ""; // reset selection
              }
            }}
            className="w-full h-12 pl-4 pr-4 rounded-[10px] border border-[#E0E0E0] bg-white focus:border-[#0CD974] focus:outline-none appearance-none"
          >
            <option value="">-- Select a Language --</option>
            {languagesList.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <p className="text-xs text-gray-400">Select languages from the dropdown</p>
      </div>

      {/* Tags display */}
      <div className="space-y-2">
        <label className="block text-[#666666] text-sm font-medium">
          Selected Languages
        </label>
        <div className="min-h-[60px] flex flex-wrap gap-2 p-2 rounded-[10px] border border-[#E0E0E0] bg-white">
          {tags.length === 0 && (
            <span className="text-gray-400 text-sm">No languages selected</span>
          )}
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#0CD974] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button type="button" onClick={() => removeTag(tag)}>
                <FaTimes size={10} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Declaration Section */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide">DECLARATION</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          I hereby declare that the particulars furnished above are true to the best of my 
          knowledge and I will take the responsibility for any misrepresentation of the facts.
        </p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={data.confirmation}
            onChange={(e) => update({...data, confirmation: e.target.checked})}
            className="w-5 h-5 rounded border-gray-300 text-[#0CD974] focus:ring-[#0CD974]"
          />
          <span className="text-sm text-gray-500">I confirm the above details are correct.</span>
        </label>

        {/* Place / Name / Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 w-12">Place :</span>
            <input 
              value={data.place}
              onChange={e => update({...data, place: e.target.value})}
              className="flex-1 border-b border-gray-300 bg-transparent py-1 focus:border-[#0CD974] outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 w-12">Name :</span>
            <input 
              value={data.signatureName}
              onChange={e => update({...data, signatureName: e.target.value})}
              className="flex-1 border-b border-gray-300 bg-transparent py-1 focus:border-[#0CD974] outline-none"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 w-12">Date :</span>
            <input 
              type="date"
              value={data.date}
              onChange={e => update({...data, date: e.target.value})}
              className="flex-1 border-b border-gray-300 bg-transparent py-1 focus:border-[#0CD974] outline-none"
            />
          </div>
        </div>
      </div>

       {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-gray-100">
        <button 
          onClick={resetAll}
          className="px-8 py-3 rounded-[10px] border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Reset
        </button>
        <button 
          onClick={() => {
            if (!data.confirmation) {
              alert("Please confirm the declaration before submitting");
              return;
            }
            if (!data.place || !data.signatureName || !data.date) {
              alert("Please fill Place, Name, and Date in declaration");
              return;
            }
            onFinalSubmit();
          }}
          disabled={isSubmitting}
          className="px-8 py-3 rounded-[10px] bg-[#0CD974] text-white font-medium hover:bg-[#0bb963] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Form"
          )}
        </button>
      </div>
    </div>
  );
}
