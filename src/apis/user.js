import axios from '../axios';

export const apiRegister = data =>
    axios({
        url: '/user/register',
        method: 'post',
        data,
        credentials: 'include', //credentials khi đăng ký tài khoản thì lưu vào cookie trình duyệt
        withCredentials: true,
    });

export const apiLogin = data =>
    axios({
        url: '/user/login',
        method: 'post',
        data,
    });

export const apiGetCurrent = () =>
    axios({
        url: '/user/current',
        method: 'get',
    });

export const apiUpdateUser = data =>
    axios({
        url: '/user/update',
        method: 'put',
        data,
    });
