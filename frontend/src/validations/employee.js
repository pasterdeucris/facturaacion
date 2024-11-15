import { toast } from 'react-toastify';

export const validateEmployee = (form) => {

    const { 
        nombre, 
        apellido, 
        identificacion, 
        telefono
    } = form;

    if(nombre == "") {
        toast.warning('El campo nombre es obligatorio.');
        return false;
    }

    if(apellido == "") {
        toast.warning('El campo apellido es obligatorio.');
        return false;
    }

    if(identificacion == "") {
        toast.warning('El campo identificación es obligatorio.');
        return false;
    }

    if(telefono == "") {
        toast.warning('El campo telefono es obligatorio.');
        return false;
    }

    return true;

}