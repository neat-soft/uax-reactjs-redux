import apisauce from 'apisauce';

const create = (baseURL = 'https://uxa-project.com/api') => {
  const api = apisauce.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  function json(data) {
    return JSON.stringify(data);
  }

  function formData(data) {
    const str = [];
    for (const p in data) {
      const key = encodeURIComponent(p);
      const value = encodeURIComponent(data[p]);
      str.push(`${key}=${value}`);
    }
    return str.join('&');
  }

  const login = (authData) => {
    const { email, password } = authData;
    return api.post('/auth/login', json({
      email,
      password,
    }));
  };
  const fblogin = (fbtoken) => {
    return api.post('/auth/fblogin', json({
      fbtoken,
    }));
  };
  const signup = (authData) => {
    const { name, email, password } = authData;
    return api.post('/auth/signup', json({
      name,
      email,
      password,
    }));
  };
  const getfilter = (token) => {
    return api.post('/product/get_myfilter', json({
      token,
    }));
  };
  return {
    login,
    signup,
    getfilter,
    fblogin,
  };
};

// let's return back our create method as the default.
export default {
  create,
};
