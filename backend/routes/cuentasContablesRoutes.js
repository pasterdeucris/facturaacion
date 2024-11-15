"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const abonoControllers_1 = require("../controllers/abonoControllers");
const cuentasContablesControllers_1 = require("../controllers/cuentasContablesControllers");
class CuentasContablesRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/saveAbono', abonoControllers_1.abonoControllers.saveAbono);
        this.router.get('/getClasesContables', cuentasContablesControllers_1.cuentasContablesControllers.getClasesContables);
        this.router.get('/getGrupoByClase', cuentasContablesControllers_1.cuentasContablesControllers.getGrupoByClase);
        this.router.get('/getCuentaByGrupo', cuentasContablesControllers_1.cuentasContablesControllers.getCuentaByGrupo);
        this.router.get('/getSubCuentaByCuenta', cuentasContablesControllers_1.cuentasContablesControllers.getSubCuentaByCuenta);
        this.router.get('/getAuxiliarBySubCuenta', cuentasContablesControllers_1.cuentasContablesControllers.getAuxiliarBySubCuenta);
    }
}
const cuentasContablesRoutes = new CuentasContablesRoutes();
exports.default = cuentasContablesRoutes.router;
