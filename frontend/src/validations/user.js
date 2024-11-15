import { toast } from 'react-toastify';

export const validateUser = (form, roles) => {

    const { 
        nombre,
        correo, 
        identificacion,
        clave
    } = form;

    if(nombre == "") {
        toast.warning('El campo nombre es obligatorio.');
        return false;
    }

    if(correo == "") {
        toast.warning('El campo correo es obligatorio.');
        return false;
    }

    if(identificacion == "") {
        toast.warning('El campo identificación es obligatorio.');
        return false;
    }

    if(clave == "") {
        toast.warning('El campo clave es obligatorio.');
        return false;
    }

    if(clave.length < 6) {
        toast.warning('El campo clave debe tener minimo 6 carácteres.');
        return false;
    }

    if(roles.length == 0) {
        toast.warning('No has seleccionado ningún rol.');
        return false;
    }

    return true;

}