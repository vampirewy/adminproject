import axios from "axios";
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
});
service.interceptors.request.use(
  config => {
    config.headers.sessionId = localStorage.getItem(`sessionId`);
    // config.headers.sessionId = `2b97be9e156645839b417528a65388a7`;
    return config;
  },
  error => {
    return error;
  }
);
service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return error;
  }
);
export default service;