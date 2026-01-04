// import React, { useState } from 'react';

// const EmployeeLoginPage = () => {
//   const [formData, setFormData] = useState({
//     employeeCode: '',
//     password: '',
//     rememberMe: false
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       alert(`Login attempted with:\nEmployee Code: ${formData.employeeCode}\nPassword: ${formData.password}`);
//       setIsLoading(false);
//     }, 1500);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
//       <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden">
        
//         {/* Left side - Gradient illustration */}
//         <div className="md:w-1/2 bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 p-8 md:p-12 flex flex-col justify-between text-white">
//           <div>
//             <div className="flex items-center mb-8">
//               <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mr-3">
//                 <span className="text-xl font-bold">🏢</span>
//               </div>
//               <h1 className="text-2xl font-bold">Corporate Portal</h1>
//             </div>
            
//             <h2 className="text-3xl md:text-4xl font-bold mb-6">Employee Access Portal</h2>
//             <p className="text-blue-100 text-lg mb-8">
//               Secure access to company resources, tools, and information. Please enter your credentials to continue.
//             </p>
            
//             <div className="space-y-6 mt-10">
//               <div className="flex items-center">
//                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
//                   <span>🔐</span>
//                 </div>
//                 <div>
//                   <h3 className="font-bold">Secure Login</h3>
//                   <p className="text-sm text-blue-100">Your credentials are encrypted</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center">
//                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
//                   <span>👥</span>
//                 </div>
//                 <div>
//                   <h3 className="font-bold">Employee Access</h3>
//                   <p className="text-sm text-blue-100">Exclusive to company personnel</p>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="mt-8 pt-6 border-t border-white/20">
//             <p className="text-sm">
//               Need help? Contact IT Support at <span className="font-semibold">support@company.com</span> or call <span className="font-semibold">x1234</span>
//             </p>
//           </div>
//         </div>
        
//         {/* Right side - Login form */}
//         <div className="md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
//           <div className="mb-10">
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
//             <p className="text-gray-600">Sign in to your employee account</p>
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="employeeCode" className="block text-sm font-medium text-gray-700 mb-2">
//                 Employee Code
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-500">👤</span>
//                 </div>
//                 <input
//                   type="text"
//                   id="employeeCode"
//                   name="employeeCode"
//                   value={formData.employeeCode}
//                   onChange={handleChange}
//                   className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                   placeholder="Enter your employee code"
//                   required
//                 />
//               </div>
//               <p className="mt-1 text-xs text-gray-500">Format: EMP-XXXX or your 6-digit code</p>
//             </div>
            
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <span className="text-gray-500">🔒</span>
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
//                   placeholder="Enter your password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   <span className="text-gray-500 hover:text-gray-700">
//                     {showPassword ? "🙈" : "👁️"}
//                   </span>
//                 </button>
//               </div>
//               <div className="flex justify-between mt-1">
//                 <p className="text-xs text-gray-500">Minimum 8 characters with uppercase & number</p>
//                 <a href="#" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
//                   Forgot?
//                 </a>
//               </div>
//             </div>
            
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="rememberMe"
//                 name="rememberMe"
//                 checked={formData.rememberMe}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
//                 Remember my login on this device
//               </label>
//             </div>
            
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
//             >
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing In...
//                 </>
//               ) : (
//                 'Sign In to Employee Portal'
//               )}
//             </button>
            
//             <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-300"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-4 bg-white text-gray-500">Alternative login methods</span>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 type="button"
//                 className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
//               >
//                 <span className="mr-2">📱</span>
//                 <span className="font-medium">Mobile App</span>
//               </button>
//               <button
//                 type="button"
//                 className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
//               >
//                 <span className="mr-2">🪪</span>
//                 <span className="font-medium">ID Card</span>
//               </button>
//             </div>
//           </form>
          
//           <div className="mt-10 pt-6 border-t border-gray-200 text-center">
//             <p className="text-gray-600 text-sm">
//               New employee? <a href="#" className="font-medium text-blue-600 hover:text-blue-800">Request account access</a>
//             </p>
//             <p className="text-gray-500 text-xs mt-4">
//               By signing in, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeeLoginPage;