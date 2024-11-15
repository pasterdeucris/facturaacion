import { toast } from 'react-toastify';

export const validationEntry = (form, clientRequired) => {

    const { 
        fecha_registro, 
        cliente_id,
        empleado_id, 
        detalle_entrada, 
        codigo_barras,
        codigo_producto,
        nombre_producto,
        cantidad,
        costo_publico,
    } = form;

    if(clientRequired) {
        if(cliente_id == "" || !cliente_id) {
            toast.warning('El campo cliente es obligatorio.');
            return false;
        }
    }

    // if(empleado_id == "" || !empleado_id) {
    //     toast.warning('El campo empleado es obligatorio.');
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

    // if(cantidad == "" || cantidad == null) {
    //     toast.warning('El campo cantidad no puede ser vacío.');
    //     return false;
    // }

    return true;

}

export const validationEntryUpdate = (form, clientRequired) => {

    const { 
        cliente_id, 
        empleado_id, 
        codigo_barras,
        codigo_producto,
        nombre_producto,
        cantidad,
        costo_publico,
    } = form;

    if(clientRequired) {
        if(cliente_id == "" || !cliente_id) {
            toast.warning('El campo cliente es obligatorio.');
            return false;
        }
    }

    // if(empleado_id == "" || !empleado_id) {
    //     toast.warning('El campo empleado es obligatorio.');
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