// API Configuration
// Vite automatically loads variables starting with VITE_ from .env
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default API_BASE_URL;
