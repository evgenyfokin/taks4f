import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://chatf-594d6adb216e.herokuapp.com'
});

instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;