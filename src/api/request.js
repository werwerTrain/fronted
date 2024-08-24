import axios from "axios";
const api = axios.create(
  {
    baseURL: "http://backend-service:8080/api", //这里配置的是后端服务提供的接口
  }
);
export default api;
