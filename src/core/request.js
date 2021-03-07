import axios from 'axios';

/**
 * API 域名与端口
 */
const apiHost = 'http://chatapi.pcdeng.com';

axios.defaults.timeout = 10000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
axios.defaults.baseURL = apiHost;

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken') || '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  response => {
    return response.data;
  },
  err => {
    const { response } = err;
    const { data } = response || {};
    return Promise.reject(data);
  }
);

const request = function(url, params, config, method) {
  return new Promise((resolve, reject) => {
    axios[method](url, params, Object.assign({}, config))
      .then(
        data => {
          resolve(data);
        },
        err => {
          reject(err);
        }
      )
      .catch(err => {
        reject(err);
      });
  });
};

const post = (url, params, config = {}) => {
  return request(url, params, config, 'post');
};

/**
 * GET 方法
 * @param string url
 * @param Object params
 * @param Object config
 * @returns
 */
const get = (url, params, config = {}) => {
  return request(url, params, config, 'get');
};

const put = (url, params, config = {}) => {
  return request(url, params, config, 'put');
};

export { post, put, get, apiHost };
