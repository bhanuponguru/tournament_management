import axios from "axios";
const base_url = process.env.REACT_APP_baseUrl;
export default axios.create({
    baseURL: base_url,
});
