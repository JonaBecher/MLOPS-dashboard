import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://mlops.mbyt.de/',
});

export default axiosClient;