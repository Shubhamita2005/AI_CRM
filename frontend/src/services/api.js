const API_BASE_URL = "https://ai-crm-83jh.onrender.com/api";

// Generic fetch function with error handling
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Companies API
export const companiesAPI = {
  getAll: () => fetchAPI("/dashboard/companies"),
  getById: (id) => fetchAPI(`/companies/${id}`),
  getByName: (name) => fetchAPI(`/companies/name/${encodeURIComponent(name)}`),
  getCompanyDetails: (customerId) => fetchAPI(`/dashboard/company/${customerId}`),
  create: (companyData) =>
    fetchAPI("/companies", {
      method: "POST",
      body: JSON.stringify(companyData),
    }),
  update: (id, companyData) =>
    fetchAPI(`/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(companyData),
    }),
  delete: (id) =>
    fetchAPI(`/companies/${id}`, {
      method: "DELETE",
    }),
};

// Pipeline/Stages API
export const pipelineAPI = {
  getStages: (salesRepId = null) =>
    fetchAPI(
      salesRepId
        ? `/dashboard/pipeline/${salesRepId}`
        : `/dashboard/pipeline`
    ),

  moveDeal: (dealId, newStage) =>
    fetchAPI("/dashboard/pipeline/move", {
      method: "POST",
      body: JSON.stringify({ dealId, newStage }),
    }),
};

// Activities / Followups API
export const activitiesAPI = {
  getFollowups: (salesRepId = null) =>
    fetchAPI(
      salesRepId
        ? `/dashboard/followups/${salesRepId}`
        : `/dashboard/followups`
    ),

  getActivities: () => fetchAPI("/dashboard/activities"),
};

// Meetings API
export const meetingsAPI = {
  getAll: () => fetchAPI("/meetings"),
  create: (meetingData) =>
    fetchAPI("/meetings", {
      method: "POST",
      body: JSON.stringify(meetingData),
    }),
};

// ✅ Manager Dashboard API
export const statsAPI = {
  getDashboardStats: () => fetchAPI("/dashboard/manager"),
};

// ✅ Sales Rep Dashboard API
export const salesAPI = {
  getDashboardStats: (salesRepId) => 
    fetchAPI(`/dashboard/sales/${salesRepId}`),
};

// ✅ Demo Booking API
export const demoBookingAPI = {
  getAll: () => fetchAPI("/demo-bookings"),
};