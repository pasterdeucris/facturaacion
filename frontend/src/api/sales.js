import api from "../utils/api";

export async function getDocumentsApi(businessID, userID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getDocumentoByTipo?tipoDocumentoId=10,9,4&empresaId=${businessID}&usuarioId=${userID}&cerrado=&impreso=0`, params);
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
        "base_5": 0,
        "base_19": 0,
        "cambio": 0,
        "cierre_diario": 0,
        "cliente_id": item.cliente_id,
        "consecutivo_dian": "",
        "cufe": "",
        "descripcion_cliente": "",
        "descripcion_trabajador": "",
        "descuento": 0,
        "detalle_entrada": null,
        "documento_id": "",
        "empleado_id": item.empleado_id,
        "empresa_id": item.empresa_id,
        "excento": 0,
        "fecha_entrega": item.fecha_registro,
        "fecha_registro": item.fecha_registro,
        "fecha_vencimiento": item.fecha_vencimiento,
        "gravado": 0,
        "impreso": 0,
        "impresora": 0,
        "interes": 0,
        "invoice_id": null,
        "iva": 0,
        "iva_5": 0,
        "iva_19": 0,
        "letra_consecutivo": "",
        "linea_vehiculo": "",
        "mac": "",
        "modelo_marca_id": null,
        "nota_id": null,
        "peso_cotero": 0,
        "peso_total": 0,
        "proveedor_id": null,
        "qrcode": "",
        "resolucion_empresa_id": null,
        "retefuente": 0,
        "saldo": 0,
        "tipo_documento_id": item.tipo_documento ? item.tipo_documento : 10,
        "total": Number(item.costo_publico) * Number(item.cantidad),
        "total_costo": 0,
        "usuario_id": item.usuario_id
    }
    
    const { data } = await api.post(`documento/createDocumento`, items, params);
    return data;
}

export async function storeDocumentoDetalleApi(item, documentID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }

    const items = {
        "cantidad": item.cantidad ?? 1,
        "costo_producto": item.costo_publico != null ? item.costo_publico : item.product.costo_publico,
        "cotero_id": null,
        "descripcion": item.product.nombre,
        "documento_detalle_id": null,
        "documento_id": documentID,
        "estado": item.product.estado,
        "fecha_registro": item.fecha_registro,
        "ingreso_comanda": 0,
        "impuesto_producto": item.product.impuesto,
        "nombre_producto": "",
        "parcial": parseFloat(item.cantidad ?? 1) * parseFloat(item.costo_publico != null ? item.costo_publico : item.product.costo_publico),
        "peso_cotero": 0,
        "peso_producto": item.product.peso,
        "producto_id": item.nombre_producto,
        "saldo": null,
        "unitario": item.costo_publico != null ? item.costo_publico : item.product.costo_publico,
        "unitarioAntesIva": 0,
        "url_foto": "",
        "varios": item.product.varios,
        "grupo_id": item.product.grupo_id,
        "sub_grupo_id": item.product.sub_grupo_id
    }
    
    const { data } = await api.post(`documentoDetalle/createDocumentoDetalle`, items, params);
    return data;
}

export async function updateProductCantidadApi(item, documentID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }

    let cantidadTotal = 0;

    // if(item.tipo_documento == 10) {
    //     cantidadTotal = Number(item.product.cantidad) - Number(item.cantidad);
    // } else if(item.tipo_documento == 9) {
    //     cantidadTotal = Number(item.product.cantidad) - Number(item.cantidad);
    // } else 
    if(item.tipo_documento == 4) {
        cantidadTotal = Number(item.currentQty);
    } else {
        cantidadTotal = Number(item.currentQty) - Number(item.cantidad ?? 1);
    }

    const items = {
        "balanza": item.product.balanza,
        "cantidad": cantidadTotal,
        "costo_producto": item.product.costo_unitario,
        "cotero_id": null,
        "descripcion": item.product.nombre,
        "documento_detalle_id": null,
        "documento_id": documentID,
        "estado": item.product.estado,
        "fecha_registro": item.product.fecha_registro,
        "ingreso_comanda": 0,
        "impuesto_producto": item.product.impuesto,
        "nombre_producto": "",
        "parcial": Number(cantidadTotal) * Number(item.product.costo_unitario),
        "peso_cotero": 0,
        "peso_producto": item.product.peso,
        "producto_id": item.nombre_producto,
        "saldo": null,
        "unitario": item.product.costo_unitario,
        "unitarioAntesIva": 0,
        "url_foto": "",
        "varios": item.product.varios
    }
    
    const { data } = await api.put(`producto/updateCantidad`, items, params);
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

export async function updateFechaRegistro(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`documento/updateFechaDocumento`, items, params);
    return data;
}

export async function getProductsByBusinessApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`producto/getProductosByEmpresa?empresaId=${businessID}`, params);
    return data;
}

/** Al momento de  imprimir. */
export async function getResolutionByBusinessApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`cliente/getResolucion?empresaId=${businessID}`, params);
    return data;
}

export async function updateConsecutivoEmpresaApi(info) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`empresa/updateConsecutivoEmpresa`, info, params);
    return data;
}

export async function createTipoPagoDocumentoApi(info) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`documento/createTipoPagoDocumento`, info, params);
    return data;
}

export async function getCuadreDeCaja(userID, businessID, remisiones) {
    const docs = remisiones ? '9,10' : '10';

    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getCuadreCaja?tipoDocumentoId=${docs}&empresaId=${businessID}&usuarioId=${userID}&cerrado=0`, params);
    return data;
}

export async function getVentasPorGrupo(userID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getVentasPorGrupos?usuarioId=${userID}&fechaInicial=&fechaFinal=&conCierre=true`, params);
    return data;
}

export async function getNominaPorEmpleado(employeesID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getNominaByEmpleado?fechaInicial=&fechaFinal=&idEmpleados=${employeesID}&tipoDocumentoId=10`, params);
    return data;
}

export async function getPreciosByProductoID(productID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`producto/getProductoPreciosById?productoId=${productID}`, params);
    return data;
}

export async function getProductByProductoCodeBar(codBarras, empresaId) {

    const config = {
        headers: {
            "content-type": "application/json"
        },
        params: {
            codBarras, empresaId
        }
    }

    const { data } = await api.get('producto/getProductoByCodBarras', config);
    return data;

}

export async function getProductByProductoId(productoId, empresaId) {

    const config = {
        headers: {
            "content-type": "application/json"
        },
        params: {
            productoId, empresaId
        }
    }

    const { data } = await api.get('producto/getProductoById', config);
    return data;

}

export async function getProductByName(nombre, empresaId) {

    const config = {
        headers: {
            "content-type": "application/json"
        },
        params: {
            nombre, empresaId
        }
    }

    const { data } = await api.get('producto/getProductoByNombre', config);
    return data;

}