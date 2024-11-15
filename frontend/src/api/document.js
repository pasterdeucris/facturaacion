import api from "../utils/api";

export async function getDocumentsTypeApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getTiposDocumento`, params);
    return data;
}

export async function getSuppliersByBusinessApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`proveedor/getProveedoresByEmpresa?empresaId=${businessID}`, params);
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

export async function getDocumentOptionsApi(userID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`usuario/opcionPuntoVentaByUsuario?usuarioId=${userID}`, params);
    return data;
}

export async function getDocumentsApi(businessID, userID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getDocumentoByTipo?tipoDocumentoId=1,2,6&empresaId=${businessID}&usuarioId=${userID}&cerrado=&impreso=0`, params);
    return data;
}

export async function getProductsByDocumentID(documentID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documentoDetalle/getDocumentoDetalleByDocumentoList?documento_id=${documentID}`, params);
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
        "base_5": item.base_5 || 0,
        "base_19": item.base_19 || 0,
        "cambio": 0,
        "cierre_diario": 0,
        "cliente_id": null,
        "consecutivo_dian": "",
        "cufe": "",
        "descripcion_cliente": "",
        "descripcion_trabajador": "",
        "descuento": 0,
        "detalle_entrada": item.detalle_entrada,
        "documento_id": "",
        "empleado_id": null,
        "empresa_id": item.empresa_id,
        "excento": item.excento || 0,
        "fecha_entrega": item.fecha_registro,
        "fecha_registro": item.fecha_registro,
        "fecha_vencimiento": item.fecha_registro,
        "gravado": item.gravado || 0,
        "impreso": 0,
        "impresora": 0,
        "interes": 0,
        "invoice_id": null,
        "iva": item.iva || 0,
        "iva_5": item.iva_5 || 0,
        "iva_19": item.iva_19 || 0,
        "letra_consecutivo": "",
        "linea_vehiculo": "",
        "mac": "",
        "modelo_marca_id": null,
        "nota_id": null,
        "peso_cotero": 0,
        "peso_total": 0,
        "proveedor_id": item.proveedor,
        "qrcode": "",
        "resolucion_empresa_id": null,
        "retefuente": 0,
        "saldo": 0,
        "tipo_documento_id": item.tipo_documento ? item.tipo_documento : 2,
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
        "cantidad": item.cantidad,
        "costo_producto": item.costo_unitario,
        "cotero_id": null,
        "descripcion": item.product.nombre,
        "documento_detalle_id": null,
        "documento_id": documentID,
        "estado": item.product.estado,
        "fecha_registro": item.fecha_registro,
        "ingreso_comanda": 0,
        "impuesto_producto": item.product.impuesto,
        "nombre_producto": "",
        "parcial": parseFloat(item.cantidad) * parseFloat(item.costo_unitario),
        "peso_cotero": 0,
        "peso_producto": item.product.peso,
        "producto_id": item.nombre_producto,
        "saldo": null,
        "unitario": item.costo_unitario,
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

    const cantidadTotal = item.tipo_documento <= 2 ? parseFloat(item.cantidad) + parseFloat(item.product.cantidad)
        : parseFloat(item.product.cantidad) - parseFloat(item.cantidad);

    const items = {
        "balanza": item.product.balanza,
        "cantidad": cantidadTotal,
        "costo_producto": item.costo_unitario,
        "cotero_id": null,
        "descripcion": item.product.nombre,
        "documento_detalle_id": null,
        "documento_id": documentID,
        "estado": item.product.estado,
        "fecha_registro": item.product.fecha_registro,
        "ingreso_comanda": 0,
        "impuesto_producto": item.product.impuesto,
        "nombre_producto": "",
        "parcial": parseFloat(item.product.cantidad) * parseFloat(item.product.costo_unitario),
        "peso_cotero": 0,
        "peso_producto": item.product.peso,
        "producto_id": item.nombre_producto,
        "saldo": null,
        "unitario": item.costo_unitario,
        "unitarioAntesIva": 0,
        "url_foto": "",
        "varios": item.product.varios
    }
    
    const { data } = await api.put(`producto/updateCantidad`, items, params);
    return data;
}

export async function modifyProductCantidadApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`producto/updateCantidad`, items, params);
    return data;
}

export async function deleteProductFromDocument(item) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }

    const items = {
        "cantidad": item.cantidad,
        "costo_producto": item.costo_unitario,
        "cotero_id": item.cotero_id,
        "descripcion": item.descripcion,
        "documento_detalle_id": item.documento_detalle_id,
        "documento_id": item.documento_id,
        "estado": 0,
        "fecha_registro": item.fecha_registro,
        "ingreso_comanda": item.ingreso_comanda,
        "impuesto_producto": item.impuesto_producto,
        "nombre_producto": item.nombre_producto,
        "parcial": item.parcial,
        "peso_cotero": item.peso_cotero,
        "peso_producto": item.peso_producto,
        "producto_id": item.producto_id,
        "saldo": item.saldo,
        "unitario": item.costo_unitario,
        "unitarioAntesIva": item.unitarioAntesIva,
        "url_foto": item.url_foto,
        "varios": item.varios,
        "grupo_id": item.grupo_id,
        "sub_grupo_id": item.sub_grupo_id
    }
    
    const { data } = await api.post(`documentoDetalle/updateDocumentoDetalle`, items, params);
    return data;
}

export async function updateProductFromDocumentApi(item) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }

    const items = {
        "cantidad": item.cantidad,
        "costo_producto": item.unitario,
        "cotero_id": item.cotero_id,
        "descripcion": item.descripcion,
        "documento_detalle_id": item.documento_detalle_id,
        "documento_id": item.documento_id,
        "estado": item.estado,
        "fecha_registro": item.fecha_registro,
        "ingreso_comanda": item.ingreso_comanda,
        "impuesto_producto": item.impuesto_producto,
        "nombre_producto": item.nombre_producto,
        "parcial": item.parcial,
        "peso_cotero": item.peso_cotero,
        "peso_producto": item.peso_producto,
        "producto_id": item.producto_id,
        "saldo": item.saldo,
        "unitario": item.unitario,
        "unitarioAntesIva": item.unitarioAntesIva,
        "url_foto": item.url_foto,
        "varios": item.varios,
        "grupo_id": item.grupo_id,
        "sub_grupo_id": item.sub_grupo_id
    }
    
    const { data } = await api.post(`documentoDetalle/updateDocumentoDetalle`, items, params);
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


/** Buscar documentos por fecha */
export async function searchDocumentApi(item) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getDocumentoByTipoAndFecha?tipoDocumentoId=${item.tipo_documento}&empresaId=${item.empresa_id}&usuarioId=${item.cajero}&empleadoId=${item.empleado}&consecutivoDian=${item.dian}&fechaInicial=${item.fecha_inicial}&fechaFinal=${item.fecha_final}&documentoId=${item.documento_interno}&clienteId=${item.cliente}&proveedorId=${item.proveedor}`, params);

    return data;
}

export async function getDocumentoDetalleAPI(documentID, estado = 1) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documentoDetalle/getDocumentoDetalleByDocumento?documento_id=${documentID}&estado=${estado}`, params);
    return data;
}

/** Edición de productos */
export async function updateProductApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`producto/updateProducto`, items, params);

    return data;
}

export async function updateProductoPrecioApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`producto/updateProductoPrecios`, items, params);

    return data;
}

//Actualizar producto
export async function updateProductFromInventoryApi(items, product) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }

    const cantidadTotal = product.tipo_documento <= 2 ? parseFloat(product.cantidad) + parseFloat(product.product.cantidad)
        : parseFloat(product.product.cantidad) - parseFloat(product.cantidad);
    
    items = {
        ...items,
        cantidad: cantidadTotal
    }
    
    const { data } = await api.put(`producto/updateProducto`, items, params);
    return data;
}

export async function updateProductCostFromInventoryApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.put(`producto/updateProducto`, items, params);
    return data;
}

export async function resetTotalDocumentsToZeroApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/reset-documents-to-zero`, params);
    return data;
}

export async function updateImpresoFromDocumentoApi(documentID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }

    const body = {
        documento_id: documentID
    }
    
    const { data } = await api.post(`documento/update-impreso-in-documento`, body, params);
    return data;
}