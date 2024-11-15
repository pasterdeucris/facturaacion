"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cotrolInventarioControllers_1 = require("../controllers/cotrolInventarioControllers");
class ControlInventarioRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getControlInventario', cotrolInventarioControllers_1.controlInventarioControllers.getControlInventario);
        this.router.get('/getControlInventarioByProductoId', cotrolInventarioControllers_1.controlInventarioControllers.getControlInventarioByProductoId);
        this.router.post('/updateControlInventario', cotrolInventarioControllers_1.controlInventarioControllers.updateControlInventario);
    }
}
const controlInventarioRoutes = new ControlInventarioRoutes();
exports.default = controlInventarioRoutes.router;
