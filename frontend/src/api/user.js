import api from "../utils/api";

export async function getUsersApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getByUsuario?usuario=&empresaId=${businessID}&rolId=`, params);
    return data;
}

export async function storeUserApi(body) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`usuario/createUsuario?rolId=${body.rolId}`, body, params);
    return data;
}

export async function getRolesByUserIDApi(userID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getRolByUsuario?usuarioId=${userID}`, params);
    return data;
}

export async function updateUserApi(body) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`usuario/updateUsuario?rolId=${body.rolId}`, body, params);
    return data;
}

export async function getEmployeesByUserIDApi(userID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getEmpleadoByUsuario?usuarioId=${userID}`, params);
    return data;
}

export async function storeEmployeesByUserIDApi(userID, keys) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`/usuario/saveEmpleadoUsuario?empleadoId=${keys}&usuarioId=${userID}`, params);
    return data;
}

export async function getActivationAllApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getActivacionAll`, params);
    return data;
}

export async function getSubmenuAllApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getSubMenuAll`, params);
    return data;
}

export async function getInventoryAllApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getCampoInventarioAll`, params);
    return data;
}

export async function getActivationUserIDApi(userID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getActivacionByUsuario?usuarioId=${userID}`, params);
    return data;
}

export async function getSubmenuUserIDApi(userID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/opcionUsuarioByUsuarioSinMenu?usuarioId=${userID}`, params);
    return data;
}

export async function getInventoryUserIDApi(userID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getCamposInventarioByUsuario?usuarioId=${userID}`, params);
    return data;
}

export async function storeActivationsByUser(userID, item) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/guardarActivaciones?activacionId=${item}&usuarioId=${userID}`, params);
    return data;
}

export async function storeSubmenusByUser(userID, item) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/guardarRutas?subMenuId=${item}&usuarioId=${userID}`, params);
    return data;
}

export async function storeInventoryByUser(userID, item) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/guardarCamposInventario?activacionId=${item}&usuarioId=${userID}`, params);
    return data;
}

export async function getProporcionApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getProporcion?empresaId=${businessID}`, params);
    return data;
}

export async function updateProporcionApi(body) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`usuario/updateProporcion`, body, params);
    return data;
}