import api from "../utils/api";

export async function getEmployeesApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`empleado/empleadoAll?empresaId=${businessID}`, params);
    return data;
}

export async function storeEmployeesApi(body) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`empleado/createEmpleado`, body, params);
    return data;
}

export async function updateEmployeesApi(body) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`empleado/updateEmpleado`, body, params);
    return data;
}