import axios from "axios";
const api = axios.create(
  {
    "http://49.232.244.162:9090/api", //这里配置的是后端服务提供的接口
  }
);
export default api;
