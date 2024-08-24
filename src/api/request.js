import axios from "axios";
const api = axios.create(
  {
    baseURL: "http://10.109.16.77:30001/api", //这里配置的是后端服务提供的接口
  }
);
export default api;
