"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const informeDiarioControllers_1 = require("../controllers/informeDiarioControllers");
class InformeDiarioRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getCierreDiario', informeDiarioControllers_1.informeDiarioControllers.getClientesByEmpresa);
        this.router.get('/hacerCierreDiario', informeDiarioControllers_1.informeDiarioControllers.hacerCierreDiario);
        this.router.get('/getInfoDiarioByDate', informeDiarioControllers_1.informeDiarioControllers.getInfoDiarioByDate);
    }
}
const informeDiarioRoutes = new InformeDiarioRoutes();
exports.default = informeDiarioRoutes.router;
