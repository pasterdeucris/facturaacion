"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bonoControllers_1 = require("../controllers/bonoControllers");
class BonoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/saveBono', bonoControllers_1.bonoControllers.saveBono);
        this.router.post('/updateBono', bonoControllers_1.bonoControllers.updateBono);
        this.router.get('/getBonosByEmpresa', bonoControllers_1.bonoControllers.getBonosByEmpresa);
        this.router.get('/getTiposBono', bonoControllers_1.bonoControllers.getTiposBono);
        this.router.get('/getBonoById', bonoControllers_1.bonoControllers.getBonoById);
    }
}
const bonoRoutes = new BonoRoutes();
exports.default = bonoRoutes.router;
