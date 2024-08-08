import * as request from '../ultils/request';

export const getProvinces = async () => {
    try {
        const res = await request.get('1/0.htm');
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const getDistricts = async id => {
    try {
        const res = await request.get(`2/${id}.htm`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
