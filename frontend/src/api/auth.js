import api from "../utils/api"

export const loginApi = async (email) => {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/usuarioByMail?mail=${email}`, params);
    return data;
}

export const setUserOn = (user) => {
    localStorage.setItem("user_on_facturacion", JSON.stringify(user));
}

export const logoutRemoveUser = () => {
    localStorage.removeItem("user_on_facturacion");
}

export const isLoggedUser = () => {
    return JSON.parse(localStorage.getItem("user_on_facturacion")) || null;
}

/** Initials endpoints dashboard entry*/
export async function getRolesApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getRolByIds?ids=1,2,5,6`, params);
    return data;
}

export async function activationsByUserApi(userID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getActivacionByUsuario?usuarioId=${userID}`, params);
    return data;
}

export async function getMyUserApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/getByUsuario?usuario=null&empresaId=${businessID}&rolId=null`, params);
    return data;
}

export async function userSubmenusApi(userID, menuID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/opcionUsuarioByUsuario?usuarioId=${userID}&menuId=${menuID}`, params);
    return data;
}


