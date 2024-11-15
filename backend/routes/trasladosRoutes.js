"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trasladosControllers_1 = require("../controllers/trasladosControllers");
class TrasladosRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.put('/saveRequerimiento', trasladosControllers_1.trasladosControllers.saveRequerimiento);
        this.router.put('/saveTraslado', trasladosControllers_1.trasladosControllers.saveTraslado);
        this.router.put('/saveRequerimientoDetalle', trasladosControllers_1.trasladosControllers.saveRequerimientoDetalle);
        this.router.put('/saveTrasladoDetalle', trasladosControllers_1.trasladosControllers.saveTrasladoDetalle);
        this.router.put('/updateRequerimiento', trasladosControllers_1.trasladosControllers.updateRequerimiento);
        this.router.put('/updateTraslado', trasladosControllers_1.trasladosControllers.updateTraslado);
        this.router.get('/getRequerimientos', trasladosControllers_1.trasladosControllers.getRequerimientos);
        this.router.get('/getTraslados', trasladosControllers_1.trasladosControllers.getTraslados);
        this.router.get('/getRequerimientoDetalleByRequerimientoId', trasladosControllers_1.trasladosControllers.getRequerimientoDetalleByRequerimientoId);
        this.router.put('/deleteRequerimientoDetalle', trasladosControllers_1.trasladosControllers.deleteRequerimientoDetalle);
        this.router.put('/deleteTrasladoDetalle', trasladosControllers_1.trasladosControllers.deleteTrasladoDetalle);
        this.router.get('/getTrasladoDetalleByTrasladoId', trasladosControllers_1.trasladosControllers.getTrasladoDetalleByTrasladoId);
        this.router.get('/getRequerimientoById', trasladosControllers_1.trasladosControllers.getRequerimientoById);
        this.router.get('/getRequerimientoDetalleByRequerimientoIdList', trasladosControllers_1.trasladosControllers.getRequerimientoDetalleByRequerimientoIdList);
    }
}
const trasladosRoutes = new TrasladosRoutes();
exports.default = trasladosRoutes.router;
