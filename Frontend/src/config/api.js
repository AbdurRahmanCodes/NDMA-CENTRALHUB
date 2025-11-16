// Central API configuration. Change `REACT_APP_API_BASE` in environment
// to override the default local host. Keep onrender URL available for quick switching.
const API_HOSTS = {
  local: "http://localhost:5000",
  onrender: "https://kartak-demo-od0f.onrender.com",
};

// Vite exposes env vars on `import.meta.env`. Use `VITE_API_BASE` in your Vite
// environment (e.g. `.env`) to override the default API base.
// Fall back to `process.env.REACT_APP_API_BASE` only when `process` is defined
// (e.g. in some Node-based environments). In the browser `process` is undefined,
// so this avoids the runtime "process is not defined" ReferenceError.
const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  (typeof globalThis !== "undefined" &&
    globalThis.process &&
    globalThis.process.env &&
    globalThis.process.env.REACT_APP_API_BASE) ||
  API_HOSTS.local;

export { API_HOSTS, API_BASE };

export default {
  API_HOSTS,
  API_BASE,
};
