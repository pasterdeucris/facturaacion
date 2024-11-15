import api from "../utils/api"

export const getClientWalletApi = async (
    clienteID, dateInit, dateEnd, supplier, businessID
) => {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const url = '/documento/getCarteraClientes'
    + '?empresaId=' + businessID
    + '&clienteId=' + clienteID
    + '&proveedorId=' + supplier
    + '&fechaInicial=' + dateInit
    + '&fechaFinal=' + dateEnd
    + '&tipoDocumentoId=10'

    const { data } = await api.get(url, params);

    return data;
}

export const getByDocumentoIdApi = async (
    documentID
) => {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const url = '/documento/getByDocumentoId' + '?documentoId=' + documentID

    const { data } = await api.get(url, params);

    return data;
}

export const getAbonosApi = async (
    documentID
) => {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const url = '/abono/getAbonosByDocumento' + '?documentoId=' + documentID

    const { data } = await api.get(url, params);

    return data;
}

export const getProductsByIdApi = async (
    documentID
) => {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const url = '/documentoDetalle/getDocumentoDetalleByDocumento' + '?documento_id=' + documentID

    const { data } = await api.get(url, params);

    return data;
}

export async function saveAbonoApi(body) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`abono/saveAbono`, body, params);
    return data;
}

export async function updateFechaVencimientoApi(body) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`documento/updateFechaVencimientoDocumento`, body, params);
    return data;
}