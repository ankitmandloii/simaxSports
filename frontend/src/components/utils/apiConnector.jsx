import axios from "axios"

export const axiosInstance = axios.create({});
const Base_Url = process.env.REACT_APP_BASE_URL;
export const apiConnecter = (method, url, bodyData, headers, params) => {
    //console.log(Base_Url,url);
    return axiosInstance({
        method: `${method}`,
        url: `${Base_Url}${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
}