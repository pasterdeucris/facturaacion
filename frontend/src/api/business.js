import api from "../utils/api";

export async function configBusinessApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`cliente/getConfiguracionByEmpresa?empresaId=${businessID}`, params);
    return data;
}

export async function getBusinessApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getEmpresas`, params);
    return data;
}

export async function getBusinessTypeApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`cliente/getTipoEmpresa`, params);
    return data;
}