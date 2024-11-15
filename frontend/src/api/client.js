import api from "../utils/api";

export async function getClientsApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`cliente/getClientesByEmpresa?empresaId=${businessID}`, params);
    return data;
}

export async function getIdentificationsTypeApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`cliente/getTipoIdentificacionAll`, params);
    return data;
}

export async function storeClient(body) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`cliente/saveCliente`, body, params);
    return data;
}

export async function updateClient(body) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`cliente/updateCliente`, body, params);
    return data;
}

export async function getCiudadesApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getCiudades`, params);
    return data;
}

export async function getImpresorasApi(businessId) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`cliente/getImpresorasEmpresa?empresaId=${businessId}`, params);
    return data;
}