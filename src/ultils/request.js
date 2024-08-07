import axios from 'axios';

const request = axios.create({
    baseURL: 'https://esgoo.net/api-tinhthanh/',
});

export const get = async (path, options = {}) => {
    const res = await request.get(path, options);
    return res.data;
};
