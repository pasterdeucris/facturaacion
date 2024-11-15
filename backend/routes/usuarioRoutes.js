"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioControlles_1 = require("../controllers/usuarioControlles");
class UsuarioRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/opcionUsuarioByUsuario', usuarioControlles_1.usuarioController.opcionUsuarioByUsuario);
        this.router.get('/usuarioByMail', usuarioControlles_1.usuarioController.usuarioByMail);
        this.router.get('/getRolByIds', usuarioControlles_1.usuarioController.getRolByIds);
        this.router.get('/getByUsuario', usuarioControlles_1.usuarioController.getByUsuario);
        this.router.get('/getRolByUsuario', usuarioControlles_1.usuarioController.getRolByUsuario);
        this.router.delete('/deleteUsuario/:id', usuarioControlles_1.usuarioController.deleteUsuario);
        this.router.post('/createUsuario', usuarioControlles_1.usuarioController.createUsuario);
        this.router.post('/createUsuarioMasivo', usuarioControlles_1.usuarioController.createUsuarioMasivo);
        this.router.put('/updateUsuario', usuarioControlles_1.usuarioController.updateUsuario);
        this.router.get('/getSubMenuAll', usuarioControlles_1.usuarioController.getSubMenuAll);
        this.router.get('/getActivacionAll', usuarioControlles_1.usuarioController.getActivacionAll);
        this.router.get('/opcionPuntoVentaByUsuario', usuarioControlles_1.usuarioController.opcionPuntoVentaByUsuario);
        this.router.get('/opcionUsuarioByUsuarioSinMenu', usuarioControlles_1.usuarioController.opcionUsuarioByUsuarioSinMenu);
        this.router.get('/getActivacionByUsuario', usuarioControlles_1.usuarioController.getActivacionByUsuario);
        this.router.get('/getEmpleadoByUsuario', usuarioControlles_1.usuarioController.getEmpleadoByUsuario);
        this.router.get('/getCamposInventarioByUsuario', usuarioControlles_1.usuarioController.getCamposInventarioByUsuario);
        this.router.get('/guardarRutas', usuarioControlles_1.usuarioController.guardarRutas);
        this.router.get('/guardarActivaciones', usuarioControlles_1.usuarioController.guardarActivaciones);
        this.router.get('/guardarCamposInventario', usuarioControlles_1.usuarioController.guardarCamposInventario);
        this.router.post('/postFile', usuarioControlles_1.usuarioController.postFile);
        this.router.get('/getFile', usuarioControlles_1.usuarioController.getFile);
        this.router.get('/usuarioByRol', usuarioControlles_1.usuarioController.usuarioByRol);
        this.router.get('/getProporcion', usuarioControlles_1.usuarioController.getProporcion);
        this.router.get('/getLiberarCuadre', usuarioControlles_1.usuarioController.getLiberarCuadre);
        this.router.get('/getCampoInventarioAll', usuarioControlles_1.usuarioController.getCampoInventarioAll);
        this.router.put('/updateProporcion', usuarioControlles_1.usuarioController.updateProporcion);
        this.router.post('/saveActivacionUsuario', usuarioControlles_1.usuarioController.saveActivacionUsuario);
        this.router.get('/saveEmpleadoUsuario', usuarioControlles_1.usuarioController.saveEmpleadoUsuario);
        this.router.get('/getEmpresas', usuarioControlles_1.usuarioController.getEmpresas);
        this.router.post('/deleteActivacionUsuario', usuarioControlles_1.usuarioController.deleteActivacionUsuario);
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
