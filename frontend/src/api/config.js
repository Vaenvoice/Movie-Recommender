// Base API URL configuration for backend requests
// Defaults to http://localhost:8000 for local development
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

export default API_BASE_URL;
