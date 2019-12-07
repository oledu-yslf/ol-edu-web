import axios from 'axios';
import { notification } from 'antd';
import * as service from '@/services/index';


const checkToken = url => {
  let token;
  if (url.indexOf('/oauth/token') === -1) {
    const jwToken = JSON.parse(localStorage.getItem('jwToken'));
    if (jwToken) {
      token = `${jwToken.token_type} ${jwToken.access_token}`;
    }
  } else {
    token = '';
  }
  return token;
};

const setToken = (data) => {
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

request.interceptors.response.use(
  function(response) {
    const { data, config } = response;
    if (config.url.indexOf('/oauth/token') !== -1) {
      setToken(data);
    }
    if(data.code === 401){
      return service.refreshToken().then(res => {
        const { token } = res.data
        setToken(token)
        const config = response.config
        config.headers['X-Token'] = token
        config.baseURL = '' // url已经带上了/api，避免出现/api/api的情况
        return request(config)
      }).catch(res => {
        console.error('refreshtoken error =>', res)
        //刷新token失败，神仙也救不了了，跳转到首页重新登录吧
        // window.location.href = '/login'
      })
    }
    if (data.code !== 200 && data.code !== 401) {
      const { msg } = data;
      notification.error({
        message: `请求错误`,
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
