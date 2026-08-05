const API_BASE_URL = "http://localhost:5000/api"; // Change this to your backend URL

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
  getAll: () => fetchAPI("/companies"),
  getById: (id) => fetchAPI(`/companies/${id}`),
  getByName: (name) => fetchAPI(`/companies/name/${encodeURIComponent(name)}`),
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
  getStages: () => fetchAPI("/dashboard/pipeline"),
  getStageDeals: (stageName) =>
    fetchAPI(`/dashboard/pipeline/${encodeURIComponent(stageName)}`),

  moveDeal: (dealId, newStage) =>
    fetchAPI("/dashboard/pipeline/move", {
      method: "POST",
      body: JSON.stringify({ dealId, newStage }),
    }),
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

// Sales Dashboard API
export const salesAPI = {
  getDashboardStats: () => fetchAPI("/sales/dashboard"),
};

// Analytics/Stats API
export const statsAPI = {
 getDashboardStats: () => fetchAPI("/dashboard/stats"),
  getConversionRate: () => fetchAPI("/conversion-rate/stats"),
};

// Activities API
export const activitiesAPI = {
  getRecent: (limit = 10) => fetchAPI(`/activities?limit=${limit}`),
  create: (activityData) =>
    fetchAPI("/activities", {
      method: "POST",
      body: JSON.stringify(activityData),
    }),
};