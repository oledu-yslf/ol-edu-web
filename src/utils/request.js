import axios from 'axios';

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

const setToken = (url, data) => {
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
      setToken(config.url, data);
    }
    return data;
  },
  function(error) {
    return Promise.reject(error);
  },
);

export default request;
