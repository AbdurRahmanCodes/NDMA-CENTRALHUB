// Central API configuration. Change `REACT_APP_API_BASE` in environment
// to override the default local host. Keep onrender URL available for quick switching.
const API_HOSTS = {
  local: "http://localhost:5555",
  onrender: "https://kartak-demo-od0f.onrender.com",
};

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE) ||
  (typeof globalThis !== "undefined" &&
    globalThis.process &&
    globalThis.process.env &&
    globalThis.process.env.REACT_APP_API_BASE) ||
  API_HOSTS.onrender;

export { API_HOSTS, API_BASE };

export default {
  API_HOSTS,
  API_BASE,
};
