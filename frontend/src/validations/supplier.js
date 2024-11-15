import { toast } from 'react-toastify';

export const validateSupplier = (form) => {

    const { 
        nombre,
        apellidos, 
        tipo_identificacion_id,
        documento,
        direccion, 
        mail
    } = form;

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
        toast.warning('El campo nro. identificación es obligatorio.');
        return false;
    }

    if(direccion == "") {
        toast.warning('El campo direccion es obligatorio.');
        return false;
    }

    if(mail == "") {
        toast.warning('El campo email es obligatorio.');
        return false;
    }

    return true;

}