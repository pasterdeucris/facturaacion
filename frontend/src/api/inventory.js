import api from "../utils/api";

export async function getProductsInventoryApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`producto/getProductosByEmpresa?empresaId=${businessID}`, params);
    return data;
}

export async function createProductInventoryApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`producto/saveProducto`, items, params);
    return data;
}

export async function createProductPriceInventoryApi(item, productID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }

    console.log(item)

    const items = {
        ...item,
        producto_id: productID
    }
    
    const { data } = await api.put(`producto/saveProductoPrecios`, items, params);
    return data;
}

export async function updateProductInventoryApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`producto/updateProducto`, items, params);
    return data;
}

export async function saveAuditoriaApi({
    businessID, 
    detail, 
    userID, 
    currentValue, 
    latestValue, 
    aplicativo,
    accion_auditoria,
    tipo_documento_id = null
}) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }

    const items = {
        accion_auditoria_id: accion_auditoria,
        aplicativo: aplicativo,
        auditoria_id: null,
        empresa_id: businessID,
        fecha_registro: Date.now().toLocaleString(),
        observacion: detail,
        usuario_id: userID,
        valor_actual: currentValue,
        valor_anterior: latestValue,
        tipo_documento_id: tipo_documento_id
    }
    
    const { data } = await api.put(`producto/saveAuditoria`, items, params);
    return data;
}

export async function inactiveProductInventoryApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`producto/inactivar`, items, params);
    return data;
}




/** Groups Submodule */
export async function getGroupsApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`producto/getGruposByEmpresa?empresaId=${businessID}`, params);
    return data;
}

export async function storeGroupsApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`producto/saveGrupo`, items, params);
    return data;
}

export async function updateGroupsApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`producto/updateGrupo`, items, params);
    return data;
}



/** SubGroups Submodule */
export async function getSubgroupsApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`producto/getSubGruposByEmpresa?empresaId=${businessID}`, params);
    return data;
}

export async function storeSubgroupsApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`producto/saveSubGrupo`, items, params);
    return data;
}

export async function updateSubgroupsApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`producto/updateSubGrupo`, items, params);
    return data;
}

export async function getAuditoriasApi(dateInit, dateEnd, accion_auditoria_id, userID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`producto/getAuditorias?desde=${dateInit}&hasta=${dateEnd}&accion_auditoria_id=${accion_auditoria_id}&usuario_id=${userID}`, params);
    return data;
}