import { toast } from 'react-toastify';

export const validationEntry = (form) => {

    const { 
        fecha_registro, 
        proveedor, 
        detalle_entrada, 
        codigo_barras,
        codigo_producto,
        nombre_producto,
        cantidad,
        costo_unitario,
        costo_publico,
    } = form;

    // if(fecha_registro == "" || !fecha_registro) {
    //     toast.warning('El campo fecha de registro es obligatorio.');
    //     return false;
    // }

    if(proveedor == "" || !proveedor) {
        toast.warning('El campo proveedor es obligatorio.');
        return false;
    }

    // if(detalle_entrada == "") {
    //     toast.warning('El campo detalle de entrada es obligatorio.');
    //     return false;
    // }

    // if(codigo_barras == "") {
    //     toast.warning('El campo codigo de barra es obligatorio.');
    //     return false;
    // }

    if(codigo_producto == "") {
        toast.warning('El campo codigo de producto es obligatorio.');
        return false;
    }

    if(nombre_producto == "" || !nombre_producto) {
        toast.warning('El campo nombre de producto es obligatorio.');
        return false;
    }

    if(cantidad == "" || cantidad == null) {
        toast.warning('El campo cantidad no puede ser vacío.');
        return false;
    }

    // if(costo_unitario == "" < 1) {
    //     toast.warning('El campo costo unitario es obligatorio.');
    //     return false;
    // }

    // if(costo_publico == "" < 1) {
    //     toast.warning('El campo costo_publico es obligatorio.');
    //     return false;
    // }

    return true;

}

export const validationEntryUpdate = (form) => {

    const { 
        proveedor, 
        detalle_entrada, 
        codigo_barras,
        codigo_producto,
        nombre_producto,
        cantidad,
        costo_unitario,
        costo_publico,
    } = form;

    if(proveedor == "" || !proveedor) {
        toast.warning('El campo proveedor es obligatorio.');
        return false;
    }

    // if(detalle_entrada == "") {
    //     toast.warning('El campo detalle de entrada es obligatorio.');
    //     return false;
    // }

    // if(codigo_barras == "") {
    //     toast.warning('El campo codigo de barra es obligatorio.');
    //     return false;
    // }

    if(codigo_producto == "") {
        toast.warning('El campo codigo de producto es obligatorio.');
        return false;
    }

    if(nombre_producto == "" || !nombre_producto) {
        toast.warning('El campo nombre de producto es obligatorio.');
        return false;
    }

    return true;

}