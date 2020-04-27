import axios from "axios";
import { env } from "./env";

const http = axios.create();
http.defaults.baseURL = env.baseUrl;
http.defaults.timeout = env.httpTimeout;

export default http;
