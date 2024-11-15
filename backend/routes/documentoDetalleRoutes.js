"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentoDetalleControllers_1 = require("../controllers/documentoDetalleControllers");
class DocumentoDetalleRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/createDocumentoDetalle', documentoDetalleControllers_1.documentoDetalleControllers.createDocumentoDetalle);
        this.router.get('/createDocumentoDetalle', documentoDetalleControllers_1.documentoDetalleControllers.createDocumentoDetalle);
        this.router.post('/updateDocumentoDetalle', documentoDetalleControllers_1.documentoDetalleControllers.updateDocumentoDetalle);
        this.router.get('/updateDocumentoDetalle', documentoDetalleControllers_1.documentoDetalleControllers.updateDocumentoDetalle);
        this.router.get('/getDocumentoDetalleByDocumento', documentoDetalleControllers_1.documentoDetalleControllers.getDocumentoDetalleByDocumento);
        this.router.get('/getDocumentoDetalleByDocumentoList', documentoDetalleControllers_1.documentoDetalleControllers.getDocumentoDetalleByDocumentoList);
        this.router.get('/getDocumentosByFechaAndTipo', documentoDetalleControllers_1.documentoDetalleControllers.getDocumentosByFechaAndTipo);
        this.router.get('/getKardex', documentoDetalleControllers_1.documentoDetalleControllers.getKardex);
        this.router.get('/getDetalleExterno', documentoDetalleControllers_1.documentoDetalleControllers.getDetalleExterno);
    }
}
const documentoDetalleRoutes = new DocumentoDetalleRoutes();
exports.default = documentoDetalleRoutes.router;
