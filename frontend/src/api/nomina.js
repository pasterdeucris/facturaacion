import api from "../utils/api";

export async function getNominaApi(dateInit, dateEnd, employeesID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getNominaByEmpleado?fechaInicial=${dateInit}&fechaFinal=${dateEnd}&idEmpleados=${employeesID}&tipoDocumentoId=11`, params);
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
        "cliente_id": null,
        "consecutivo_dian": "",
        "cufe": "",
        "descripcion_cliente": "",
        "descripcion_trabajador": item.concepto,
        "descuento": 0,
        "detalle_entrada": "",
        "documento_id": "",
        "empleado_id": item.empleado_id,
        "empresa_id": item.empresa_id,
        "excento": 0,
        "fecha_entrega": new Date().toDateString(),
        "fecha_registro": new Date().toDateString(),
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
        "tipo_documento_id": 8,
        "total": item.valor,
        "total_costo": 0,
        "usuario_id": item.usuario_id
    }
    
    const { data } = await api.post(`documento/createDocumento`, items, params);
    return data;
}

export async function productAssociateApi(items) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.post(`empleado/createProductoEmpleado`, items, params);
    return data;
}

export async function getPrinterBusinessApi(businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`cliente/getImpresorasEmpresa?empresaId=${businessID}`, params);
    return data;
}

/** Configurar empleado */

export async function updateEmpleadoApi(olddata, item) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }

    const body = {
        "apellido": olddata.apellido,
        "empleado_id": olddata.empleado_id,
        "empresa_id": olddata.empresa_id,
        "estado": olddata.estado,
        "identificacion": olddata.identificacion,
        "nombre": olddata.nombre,
        "pago_admin": item.pago_admin,
        "pago_empleado_id": item.pago_empleado_id,
        "porcentaje_descuento": item.ahorro,
        "porcentaje_pago": 0,
        "sueldo": item.sueldo,
        "telefono": olddata.telefono
    };
    
    const { data } = await api.put(`empleado/updateEmpleado`, body, params);
    return data;
}

export async function getPaymentsEmployeesApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    const { data } = await api.get(`empleado/getPagosEmpleadosAll`, params);
    return data;
}

/** Cierre nomina */
export async function getOrdersEmployeeApi(dateInit, dateEnd, employeesID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getOrdenesByEmpleados?empleadoId=${employeesID}&fechaInicial=${dateInit}&fechaFinal=${dateEnd}&tipoDocumentoId=11`, params);
    return data;
}

export async function cierreNominaApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }

    const body = {};
    
    const { data } = await api.post(`documento/cierreNomina`, body, params);
    return data;
}

/** Detalle nomina */
export async function getValesEmployeeApi(employeesID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`documento/getOrdenesByEmpleado?empleadoId=${employeesID}&fechaInicial=&fechaFinal=&tipoDocumentoId=8`, params);
    return data;
}

export async function getProductsEmployeeApi(employeesID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`empleado/getProductoEmpleadoByEmpleado?empleadoId=${employeesID}&fechaInicial=&fechaFinal=`, params);
    return data;
}