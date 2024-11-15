"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proveedorControllers_1 = require("../controllers/proveedorControllers");
class ProveedorRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getProveedoresByEmpresa', proveedorControllers_1.proveedorControllers.getProveedoresByEmpresa);
        this.router.post('/saveProveedor', proveedorControllers_1.proveedorControllers.saveProveedor);
        this.router.post('/updateProveedor', proveedorControllers_1.proveedorControllers.updateProveedor);
    }
}
const proveedorRoutes = new ProveedorRoutes();
exports.default = proveedorRoutes.router;
