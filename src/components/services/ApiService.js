const BASE_URL = 'http://192.168.1.15:8001/api/v1';

/* =========================
   TOKEN STORAGE
========================= */

export const saveTokens = (access, refresh) => {
  sessionStorage.setItem('access_token', access);
  sessionStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
};

export const getAccessToken = () =>
  sessionStorage.getItem('access_token');

export const getRefreshToken = () =>
  sessionStorage.getItem('refresh_token');

/* =========================
   CORE FETCH WRAPPER
========================= */

const apiFetch = async (endpoint, options = {}) => {
  const token = getAccessToken();

  const config = {
    credentials: 'include',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    },
    ...options
  };

  const response = await fetch(`${BASE_URL}/${endpoint}`, config);

  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) return apiFetch(endpoint, options);

    clearTokens();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'API error');
  }

  const contentType = response.headers.get('content-type');
  return contentType?.includes('application/json')
    ? response.json()
    : response.blob();
};

/* =========================
   AUTH APIs
========================= */

// LOGIN (OAuth2PasswordRequestForm)
export const LoginService = async ({ username, password }) => {
  const body = new URLSearchParams();
  body.append('username', username);
  body.append('password', password);

  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || 'Login failed');
  }

  const data = await response.json();

  saveTokens(data.access_token, data.refresh_token);

  return data; 
};

// REFRESH TOKEN (ROTATION)
export const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const data = await apiFetch('auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh })
    });

    saveTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
};

// LOGOUT
export const LogoutService = async () => {
  await apiFetch('auth/logout', { method: 'POST' });
  clearTokens();
  window.location.href = '/admin/login';
};



/* =========================
   ADMIN APIs
========================= */

// CREATE EMPLOYEE (FormData + File)
export const CreateEmployeeService = async (formData) => {
  return apiFetch('admin/create-employee', {
    method: 'POST',
    body: formData
  });
};


// GET ALL EMPLOYEES (Paginated)
export const GetEmployeesService = (skip = 0, limit = 10) =>
  apiFetch(`admin/employees?skip=${skip}&limit=${limit}`);

// GET EMPLOYEE BY ID
export const GetEmployeeByIdService = (id) =>
  apiFetch(`admin/employees/${id}`);

// GET EMPLOYEE BY CODE
export const GetEmployeeByCodeService = (code) =>
  apiFetch(`admin/employees/${code}`);

// TOGGLE ACTIVE STATUS
export const ToggleEmployeeStatusService = (code, active) =>
  apiFetch(`admin/employees/${code}/toggle-status?active=${active}`, {
    method: 'PATCH'
  });

/* =========================
   EMPLOYEE APIs
========================= */

// MY PROFILE
export const GetMyProfileService = () =>
  apiFetch('employee/me');

// UPDATE PERSONAL DETAILS
export const UpdatePersonalDetailsService = (data) =>
  apiFetch('employee/personal-details', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

// UPDATE KYC DETAILS (JSON ONLY)
export const UpdateKycDetailsService = (data) =>
  apiFetch('employee/kyc-details', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

// ADD EDUCATION (LIST)
// services/ApiService.js
export const AddEducationService = (educationList, isFormData = false) =>
  apiFetch("employee/education", {
    method: "POST",
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? educationList : JSON.stringify(educationList),
  });


// ADD WORK EXPERIENCE (LIST)
export const AddWorkExperienceService = (workList, isFormData = false) =>
  apiFetch('employee/work-experience', {
    method: 'POST',
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    body: isFormData ? workList : JSON.stringify(workList)
  });

// SYNC PROFILE (Main data submission)
export const SyncProfileService = async (data) => {
  return apiFetch('employee/sync-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};

// UPLOAD DOCUMENTS (Files upload)
export const UploadDocumentsService = async (formData) => {
  return apiFetch('employee/upload-documents', {
    method: 'POST',
    body: formData // FormData object
  });
};

// FINALIZE ONBOARDING
export const FinalizeOnboardingService = async () => {
  return apiFetch('employee/finalize-onboarding', {
    method: 'POST'
  });
};


// UPDATE EMPLOYEE DETAILS (Admin)
export const UpdateEmployeeService = async (employeeCode, data) =>
  apiFetch(`admin/employees/${employeeCode}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

// DOWNLOAD PROFILE PDF
export const DownloadProfilePdfService = async (employeeId) => {
  try {
    // Make API call for a specific employee
    const response = await fetch(`http://YOUR_API_URL/employee/download-profile/${employeeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
      }
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Employee_${employeeId}_Profile.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error('Download PDF error:', error);
    throw error;
  }
};
