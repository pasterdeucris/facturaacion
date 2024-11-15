"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empresaControllers_1 = require("../controllers/empresaControllers");
class EmpresaRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/pagosEmpresaByEmpresa', empresaControllers_1.empresaControllers.pagosEmpresaByEmpresa);
        this.router.get('/getEmpresaById', empresaControllers_1.empresaControllers.getEmpresaById);
        this.router.post('/updateConsecutivoEmpresa', empresaControllers_1.empresaControllers.updateConsecutivoEmpresa);
    }
}
const usuarioRoutes = new EmpresaRoutes();
exports.default = usuarioRoutes.router;
