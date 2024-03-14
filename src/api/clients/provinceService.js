import axiosClient from './axiosClient';

export const districtApi = () =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosClient({
                method: 'get',
                url: 'https://vapi.vnappmob.com/api/province/district/01'
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
export const wardApi = (districtIds) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await axiosClient({
                method: 'get',
                url: `https://vapi.vnappmob.com/api/province/ward/${districtIds}`
            });
            resolve(response);
        } catch (error) {
            reject(error);
        }
    });
