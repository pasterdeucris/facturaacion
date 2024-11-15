"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clienteControllers_1 = require("../controllers/clienteControllers");
class ClienteRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getClientesByEmpresa', clienteControllers_1.clienteControllers.getClientesByEmpresa);
        this.router.get('/getConfiguracionByEmpresa', clienteControllers_1.clienteControllers.getConfiguracionByEmpresa);
        this.router.get('/getTipoPago', clienteControllers_1.clienteControllers.getTipoPago);
        this.router.get('/getResolucion', clienteControllers_1.clienteControllers.getResolucion);
        this.router.get('/getResolucionById', clienteControllers_1.clienteControllers.getResolucionById);
        this.router.get('/getResponsabilidades', clienteControllers_1.clienteControllers.getResponsabilidades);
        this.router.get('/getImpresorasEmpresa', clienteControllers_1.clienteControllers.getImpresorasEmpresa);
        this.router.post('/saveCliente', clienteControllers_1.clienteControllers.saveCliente);
        this.router.post('/saveVehiculo', clienteControllers_1.clienteControllers.saveVehiculo);
        this.router.post('/saveResponsabilidadFiscalCliente', clienteControllers_1.clienteControllers.saveResponsabilidadFiscalCliente);
        this.router.post('/updateCliente', clienteControllers_1.clienteControllers.updateCliente);
        this.router.post('/updateVehiculo', clienteControllers_1.clienteControllers.updateVehiculo);
        this.router.get('/getById', clienteControllers_1.clienteControllers.getById);
        this.router.get('/getTipoEmpresa', clienteControllers_1.clienteControllers.getTipoEmpresa);
        this.router.get('/getTipoIdentificacionAll', clienteControllers_1.clienteControllers.getTipoIdentificacionAll);
        this.router.get('/getResponsabilidadesByCliente', clienteControllers_1.clienteControllers.getResponsabilidadesByCliente);
        this.router.get('/getVehiculos', clienteControllers_1.clienteControllers.getVehiculos);
    }
}
const clienteRoutes = new ClienteRoutes();
exports.default = clienteRoutes.router;
