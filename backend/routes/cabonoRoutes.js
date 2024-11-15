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
        this.router.get('/getImpresorasEmpresa', clienteControllers_1.clienteControllers.getImpresorasEmpresa);
        this.router.post('/saveCliente', clienteControllers_1.clienteControllers.saveCliente);
        this.router.post('/updateCliente', clienteControllers_1.clienteControllers.updateCliente);
        this.router.get('/getTipoEmpresa', clienteControllers_1.clienteControllers.getTipoEmpresa);
        this.router.get('/getTipoIdentificacionAll', clienteControllers_1.clienteControllers.getTipoIdentificacionAll);
    }
}
const clienteRoutes = new ClienteRoutes();
exports.default = clienteRoutes.router;
