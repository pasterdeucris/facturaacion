import api from "../utils/api";

export async function getSuppliesApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`proveedor/getProveedoresByEmpresa?empresaId=${businessID}`, params);
    return data;
}

export async function storeSuppliersApi(body) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`proveedor/saveProveedor`, body, params);
    return data;
}

export async function updateSupplierApi(body) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`proveedor/updateProveedor`, body, params);
    return data;
}