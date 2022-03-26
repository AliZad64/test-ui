import axios from "axios";
import { BASE_URL } from "./Constants";
axios.defaults.baseURL = BASE_URL;
export default axios;
