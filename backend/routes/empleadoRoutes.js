"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empleadoControlles_1 = require("../controllers/empleadoControlles");
class EmpleadoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/empleadoAll', empleadoControlles_1.empleadoControllers.empleadoAll);
        this.router.post('/createEmpleado', empleadoControlles_1.empleadoControllers.createEmpleado);
        this.router.post('/createProductoEmpleado', empleadoControlles_1.empleadoControllers.createProductoEmpleado);
        this.router.put('/updateEmpleado', empleadoControlles_1.empleadoControllers.updateEmpleado);
        this.router.get('/getPagosEmpleadosAll', empleadoControlles_1.empleadoControllers.getPagosEmpleadosAll);
        this.router.get('/getProductoEmpleadoByEmpleado', empleadoControlles_1.empleadoControllers.getProductoEmpleadoByEmpleado);
    }
}
const empleadoRoutes = new EmpleadoRoutes();
exports.default = empleadoRoutes.router;
