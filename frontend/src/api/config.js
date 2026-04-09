// API Configuration
// Vite automatically loads variables starting with VITE_ from .env
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://your-app-name.up.railway.app";

export default API_BASE_URL;
