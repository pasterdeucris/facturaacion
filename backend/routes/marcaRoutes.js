"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const marcaControllers_1 = require("../controllers/marcaControllers");
class MarcaRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/getMarcas', marcaControllers_1.marcaControllers.getMarcas);
        this.router.get('/getModeloByMarca', marcaControllers_1.marcaControllers.getModeloByMarca);
        this.router.get('/getModeloById', marcaControllers_1.marcaControllers.getModeloById);
    }
}
const marcaRoutes = new MarcaRoutes();
exports.default = marcaRoutes.router;
