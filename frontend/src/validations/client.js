// import {  } from 'lodash';
import { toast } from 'react-toastify';

export const validateClient1 = (form) => {

    const { 
        razon_social, 
        tipo_identificacion_id, 
        documento, 
        digito_verificacion, 
        direccion, 
        mail } = form;

    if(razon_social == "") {
        toast.warning('El campo razón social es obligatorio.');
        return false;
    }

    if(tipo_identificacion_id == "") {
        toast.warning('El campo tipo identificación es obligatorio.');
        return false;
    }

    if(documento == "") {
        toast.warning('El campo nro identificación es obligatorio.');
        return false;
    }

    if(digito_verificacion == "") {
        toast.warning('El campo dígito verificacion es obligatorio.');
        return false;
    }

    if(direccion == "") {
        toast.warning('El campo dirección es obligatorio.');
        return false;
    }

    if(mail == "") {
        toast.warning('El campo email es obligatorio.');
        return false;
    }

    return true;

}

export function validateClient2(form) {
    const { 
        nombre,
        apellidos, 
        tipo_identificacion_id, 
        documento, 
        digito_verificacion, 
        direccion, 
        mail } = form;

    if(nombre == "") {
        toast.warning('El campo primer nombre es obligatorio.');
        return false;
    }

    if(apellidos == "") {
        toast.warning('El campo primer apellido es obligatorio.');
        return false;
    }

    if(tipo_identificacion_id == "") {
        toast.warning('El campo tipo identificación es obligatorio.');
        return false;
    }

    if(documento == "") {
        toast.warning('El campo nro identificación es obligatorio.');
        return false;
    }

    if(digito_verificacion == "") {
        toast.warning('El campo dígito verificacion es obligatorio.');
        return false;
    }

    if(direccion == "") {
        toast.warning('El campo dirección es obligatorio.');
        return false;
    }

    if(mail == "") {
        toast.warning('El campo email es obligatorio.');
        return false;
    }

    return true;
}