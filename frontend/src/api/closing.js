import api from "../utils/api";

export const getCierreInforme = async (businessID) => {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`informeDiario/getCierreDiario?empresaId=${businessID}`, params);
    return data;
}

export const setCierreDiario = async (businessID) => {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`informeDiario/hacerCierreDiario?empresaId=${businessID}`, params);
    return data;
}