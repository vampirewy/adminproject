import axios from "axios";
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
});
let speed, netLevel = 3;
service.interceptors.request.use(
  config => {
    let options = {
      text: `Loading`,
      spinner: `el-icon-loading`,
      background: `rgba(0,0,0,.5)`
    };
    speed = localStorage.getItem(`speed`);
    speed < netLevel && (loading = Loading.service(options));
    config.headers.sessionId = localStorage.getItem(`sessionId`);
    // config.headers.sessionId = `f2e4902907574d568c9a91464ab24196`;
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