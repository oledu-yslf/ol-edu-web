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
  if(data && data.code && data.code == 200 && data.data){
    //返回成功,并且有返回值
    localStorage.setItem('jwToken', JSON.stringify(data.data));
  } else {
    localStorage.setItem('jwToken', '');
  }
};

const request = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

const isRespSuccess = data =>{
  if(data && data.code && data.code == 200 && data.data){
    return true;
  } else{
    return false;
  }
}

request.interceptors.request.use(
  function(config) {
    config.headers.Authorization = checkToken(config.url);
    return config;
  },
  function(error) {
    return Promise.reject(error);
  },
);

const isTokenExpired = data =>{
  if(data.code == 401 && data.msg.indexOf("Access token expired") != -1){
    return true;
  } else {
    return false;
  }
}

let isRefreshing = false;
let requests = []

request.interceptors.response.use(
  function(response) {
    const { data, config } = response;
    if (config.url.indexOf('/oauth/token') !== -1) {
      //正常请求token或者刷新token。
      if (isRespSuccess(data)){
        console.log("setToken");
        console.log(data);
        setToken(data);
      }
    }

    //token过期的情况。
    if (isTokenExpired(data) == true) {
      console.log(isRefreshing);
      if (!isRefreshing) {
        isRefreshing = true;
        return service
          .refreshToken()
          .then(res => {
            console.log("res");
            console.log(res);
            if (res.code != 200){
              //refresh_token失败
              isRefreshing = false;
              window.location.href = '/login';
             return ;
            }
            
            const token = res;
            setToken(token);
            isRefreshing = false;

            const config = response.config;
            // config.headers['X-Token'] = token;
            config.baseURL = ''; // url已经带上了/api，避免出现/api/api的情况
            requests.forEach(cb => cb(token))
            requests = [];
            return request(config);
          })
          .catch(res => {
            console.error('refreshtoken error =>', res);
            isRefreshing = false;
            //刷新token失败，神仙也救不了了，跳转到首页重新登录吧
            window.location.href = '/login';
            
          });
      }else {
        // 正在刷新token，返回一个未执行resolve的promise
        return new Promise((resolve) => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push(() => {
            config.baseURL = ''
            // config.headers['X-Token'] = token
            resolve(request(config))
          })
        })
      }
    }
    if (data.code !== 200 && isTokenExpired(data) == false) {
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
