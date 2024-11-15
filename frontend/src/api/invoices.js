import api from "../utils/api";

export async function getDocumentsForInvoice(dateInit, dateEnd, dian, documentID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getDocumentoForFacturacionElectronica?fechaInicial=${dateInit}&fechaFinal=${dateEnd}&tipoDocumentoId=10,12,13&consecutivoDian=${dian}&documentoId=${documentID}&invoiceId=1&empresaId=1`, params);
    return data;
}

export async function saveInvoiceApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`documento/saveInvoice`, items, params);
    return data;
}

export async function getDocumentsByDateAndType(dateInit, dateEnd, businessID, documentID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getDocumentosByFechaAndTipo?fechaInicial=${dateInit}&fechaFinal=${dateEnd}&idEmpleados=&tipoDocumentoId=${documentID}&usuarioId=&empresaId=${businessID}&autorizacion=`, params);
    return data;
}

export async function getDocumentsByTipoDetalle(dateInit, dateEnd, businessID, documentType = '') {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getDocumentosByFechaAndTipoDetalle?idEmpleados=&tipoDocumentoId=${documentType}&usuarioId=&empresaId=${businessID}&fechaInicial=${dateInit}&fechaFinal=${dateEnd}`, params);
    return data;
}

export async function getDocumentsByTipoPago(dateInit, dateEnd, businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getDocumentosByTipoPago?empresaId=${businessID}&tipoDocumentoId=10&fechaInicial=${dateInit}&fechaFinal=${dateEnd}`, params);
    return data;
}

export async function getUserByRole(dateInit, dateEnd, businessID, roleID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/usuarioByRol?rolId=${roleID}&empresaId=${businessID}&tipoDocumentoId=10&fechaInicial=${dateInit}&fechaFinal=${dateEnd}`, params);
    return data;
}

export async function getDocumentsForVerificationInvoice(dateInit, dateEnd, dian, documentID, statusInvoice) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getDocumentoForFacturacionElectronica?fechaInicial=${dateInit}&fechaFinal=${dateEnd}&tipoDocumentoId=10,12,13&consecutivoDian=${dian}&documentoId=${documentID}&invoiceId=${statusInvoice}&empresaId=1`, params);
    return data;
}

export async function getSalesByGroupApi(dateInit, dateEnd) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getVentasPorGrupos?usuarioId=&fechaInicial=${dateInit}&fechaFinal=${dateEnd}&conCierre=false`, params);
    return data;
}

export async function getSalesBySubGroupApi(dateInit, dateEnd) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getVentasPorSubGrupos?usuarioId=&fechaInicial=${dateInit}&fechaFinal=${dateEnd}&conCierre=false`, params);
    return data;
}
