import axios from "axios";
import api from "../utils/api"
import { URL_FAC_LATAM, TOKEN_FAC_LATAM } from '../utils/constants';

export async function sendFacturaElectronica(data) {
    const params = {
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${TOKEN_FAC_LATAM}`
        }
    }

    const response = await api.post(`${URL_FAC_LATAM}/ubl2.1/invoice`, data, params);
    // console.log(res.data.return.code.$value)
    return response;
}

export async function sendCreditNote(data) {
    const params = {
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${TOKEN_FAC_LATAM}`
        }
    }

    const response = await api.post(`${URL_FAC_LATAM}/ubl2.1/credit-note`, data, params);
    // console.log(res.data.return.code.$value)
    return response;
}


export async function getPDF(nit, prefix, number) {
  const res = await axios.get(`${URL_FAC_LATAM}/invoice/${nit}/FES-${prefix}${number}.pdf`, { responseType: 'blob' });
  return res;
}