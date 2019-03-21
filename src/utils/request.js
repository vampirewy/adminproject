import axios from "axios";
import {
  Loading
} from "element-ui";
let loading = null,
  speed = null,
  netLevel = 3; //网速等于
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL
});
service.interceptors.request.use(
  config => {
    let options = {
      text: `Loading`,
      spinner: `el-icon-loading`,
      background: `rgba(0,0,0,.5)`
    };
    speed = localStorage.getItem(`speed`);
    speed < netLevel && (loading = Loading.service(options));
    // config.headers.sessionId = localStorage.getItem(`sessionId`);
    config.headers.sessionId = `f2e4902907574d568c9a91464ab24196`;
    return config;
  },
  error => {
    speed < netLevel && loading.close();
    return error;
  }
);
service.interceptors.response.use(
  response => {
    speed < netLevel && loading.close();
    return response;
  },
  error => {
    return error;
  }
);
export default service;