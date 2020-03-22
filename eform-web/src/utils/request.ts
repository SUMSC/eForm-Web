import axios, {AxiosResponse} from 'axios';
import {Message} from 'element-ui';
import {UserModule} from '@/store/modules/user';

export interface GeneralResponse extends AxiosResponse {
  code: number,
  message: any
}

export const service = axios.create({
  baseURL: process.env.VUE_APP_RESOURCE_API,
  timeout: 5000,
  // withCredentials: true // send cookies when cross-domain requests
});

export const loginService = axios.create({
  baseURL: process.env.VUE_APP_LOGIN_API, // url = base url + request url
  timeout: 5000,
  // withCredentials: true // send cookies when cross-domain requests
});

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['X-Custom-Auth'] = UserModule.token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
);

service.interceptors.response.use(
  (response) => {
    // general response:
    // { code: 200/201/204/400, message: ... }
    const res = response.data;
    if (res.code >= 400) {
      Message({
        message: res.message,
        type: 'error',
        duration: 8 * 1000,
      });
      return Promise.reject(new Error(res.message))
    } else {
      return response.data
    }
  },
  (error) => {
    return Promise.reject(error)
  }
);

// Response interceptors
loginService.interceptors.response.use(
  (response) => {
    // general response:
    // { code: 200/201/204/400, message: ... }
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
);
