import api from "../utils/api";

export async function getByDocumentoIdApi(documentID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getByDocumentoId?documentoId=${documentID}`, params);

    return data;
}

export async function storeDocumentApi(item) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const items = {
        "anulado": 0,
        "base_5": item.base_5,
        "base_19": item.base_19,
        "cambio": 0,
        "cierre_diario": 0,
        "cliente_id": null,
        "consecutivo_dian": "",
        "cufe": "",
        "descripcion_cliente": "",
        "descripcion_trabajador": item.descripcion_trabajador,
        "descuento": 0,
        "detalle_entrada": "",
        "documento_id": "",
        "empleado_id": null,
        "empresa_id": item.empresa_id,
        "excento": parseFloat(item.excento).toFixed(2),
        "fecha_entrega": item.fecha_registro,
        "fecha_registro": item.fecha_registro,
        "fecha_vencimiento": item.fecha_registro,
        "gravado": item.gravado,
        "impreso": 0,
        "impresora": 0,
        "interes": 0,
        "invoice_id": null,
        "iva": item.iva,
        "iva_5": item.iva_5,
        "iva_19": item.iva_19,
        "letra_consecutivo": "",
        "linea_vehiculo": "",
        "mac": "",
        "modelo_marca_id": null,
        "nota_id": null,
        "peso_cotero": null,
        "peso_total": null,
        "proveedor_id": item.proveedor,
        "qrcode": null,
        "resolucion_empresa_id": null,
        "retefuente": 0,
        "saldo": item.saldo,
        "tipo_documento_id": item.tipo_documento,
        "total": item.total,
        "total_costo": null,
        "usuario_id": item.usuario_id
    }

    let datos = {
        ...items,
        ...item,
    }
    
    const { data } = await api.post(`documento/createDocumento`, datos, params);
    return data;
}

export async function storeDocumentoNotaApi(documentID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const items = {
        "documento_id": documentID,
        "nota_id": null,
        "estado": 1,
        "fecha_registro": new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
    }
    
    const { data } = await api.post(`documento/saveDocumentoNota`, items, params);
    return data;
}

export async function storeInvoiceApi(newDocumentID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const items = {
        "documento_id": newDocumentID,
        "invoice_id": 1,
        "fecha_registro": new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
        "mensaje": "",
        "status": ""
    }
    
    const { data } = await api.post(`documento/saveInvoice`, items, params);
    return data;
}

export async function storeDocumentoDetalleApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`documentoDetalle/createDocumentoDetalle`, items, params);
    return data;
}

export async function updateDocumentoApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`documento/updateDocumento`, items, params);
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