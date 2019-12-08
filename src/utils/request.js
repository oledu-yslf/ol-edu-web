import axios from 'axios';
import { notification } from 'antd';
import * as service from '@/services/index';

const checkToken = url => {
  let token;
  if (url.indexOf('/oauth/token') === -1 && localStorage.getItem('jwToken')) {
    const jwToken = JSON.parse(localStorage.getItem('jwToken'));
    if (jwToken) {
      token = `${jwToken.token_type} ${jwToken.access_token}`;
    }
  } else {
    token = '';
  }
  return token;
};

const setToken = data => {
  localStorage.setItem('jwToken', JSON.stringify(data));
};

const request = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});


request.interceptors.request.use(
  function(config) {
    config.headers.Authorization = checkToken(config.url);
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);


let isRefreshing = false;
let requests = []

request.interceptors.response.use(
  function(response) {
    const { data, config } = response;
    if (config.url.indexOf('/oauth/token') !== -1) {
      setToken(data);
    }
    if (data.code === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        return service
          .refreshToken()
          .then(res => {
            debugger;
            console.log(res);
            const token = res;
            setToken(token);
            const config = response.config;
            // config.headers['X-Token'] = token;
            config.baseURL = ''; // url已经带上了/api，避免出现/api/api的情况
            requests.forEach(cb => cb(token))
            requests = [];
            return request(config);
          })
          .catch(res => {
            console.error('refreshtoken error =>', res);
            window.location.href = '/login';
          });
      }else {
        return new Promise((resolve) => {
          requests.push(() => {
            config.baseURL = ''
            resolve(request(config))
          })
        })
      }
    }
    if (data.code !== 200 && data.code !== 401) {
      const { msg } = data;
      notification.error({
        message: `请求错误${config.url}`,
        description: msg,
      });
    }
    return data;
  },
  function(error) {
    return Promise.reject(error);
  },
);

export default request;
