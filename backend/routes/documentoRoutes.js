"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentoControllers_1 = require("../controllers/documentoControllers");
class DocumentoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/createDocumento', documentoControllers_1.documentoControllers.createDocumento);
        this.router.post('/saveDocumentoNota', documentoControllers_1.documentoControllers.saveDocumentoNota);
        this.router.post('/saveRetiro', documentoControllers_1.documentoControllers.saveRetiro);
        this.router.post('/saveInvoice', documentoControllers_1.documentoControllers.saveInvoice);
        this.router.post('/updateDocumento', documentoControllers_1.documentoControllers.updateDocumento);
        this.router.post('/updateDocumentoNota', documentoControllers_1.documentoControllers.updateDocumentoNota);
        this.router.post('/createTipoPagoDocumento', documentoControllers_1.documentoControllers.createTipoPagoDocumento);
        this.router.get('/getDocumentoByTipo', documentoControllers_1.documentoControllers.getDocumentoByTipo);
        this.router.get('/getCuadreCaja', documentoControllers_1.documentoControllers.getCuadreCaja);
        this.router.get('/getOrdenesTrabajo', documentoControllers_1.documentoControllers.getOrdenesTrabajo);
        //this.router.get('/getOrdenesEnCero', documentoControllers_1.documentoControllers.getOrdenesEnCero);
       // this.router.get('/borrarOrdenesEn0', documentoControllers_1.documentoControllers.borrarOrdenesEn0);
        this.router.post('/createDocumentoOrden', documentoControllers_1.documentoControllers.createDocumentoOrden);
        this.router.post('/deleteDocumentoOrdenByOrden', documentoControllers_1.documentoControllers.deleteDocumentoOrdenByOrden);
        this.router.post('/deleteDocumentoOrdenByDocumento', documentoControllers_1.documentoControllers.deleteDocumentoOrdenByDocumento);
        //this.router.post('/deleteDocumento', documentoControllers_1.documentoControllers.deleteDocumento);
        this.router.get('/getDocumentoOrdenById', documentoControllers_1.documentoControllers.getDocumentoOrdenById);
        this.router.get('/getOrdenesByDocumentoId', documentoControllers_1.documentoControllers.getOrdenesByDocumentoId);
        this.router.get('/getNominaByEmpleado', documentoControllers_1.documentoControllers.getNominaByEmpleado);
        this.router.get('/getVentasPorGrupos', documentoControllers_1.documentoControllers.getVentasPorGrupos);
        this.router.get('/getVentasPorSubGrupos', documentoControllers_1.documentoControllers.getVentasPorSubGrupos);
        this.router.get('/getOrdenesByEmpleado', documentoControllers_1.documentoControllers.getOrdenesByEmpleado);
        this.router.get('/getOrdenesByEmpleados', documentoControllers_1.documentoControllers.getOrdenesByEmpleados);
        this.router.get('/getDocumentosByFechaAndTipoDetalle', documentoControllers_1.documentoControllers.getDocumentosByFechaAndTipoDetalle);
        this.router.post('/cierreNomina', documentoControllers_1.documentoControllers.cierreNomina);
        this.router.get('/getTiposDocumento', documentoControllers_1.documentoControllers.getTiposDocumento);
        this.router.get('/getInvoice', documentoControllers_1.documentoControllers.getInvoice);
        this.router.get('/getDocumentosByFechaAndTipo', documentoControllers_1.documentoControllers.getDocumentosByFechaAndTipo);
        this.router.get('/getDocumentoByTipoAndFecha', documentoControllers_1.documentoControllers.getDocumentoByTipoAndFecha);
        this.router.get('/getRetirosByFechaAndTipo', documentoControllers_1.documentoControllers.getRetirosByFechaAndTipo);
        this.router.get('/getUltimoDocumentoId', documentoControllers_1.documentoControllers.getUltimoDocumentoId);
        this.router.get('/getDocumentosByTipoPago', documentoControllers_1.documentoControllers.getDocumentosByTipoPago);
        this.router.get('/getCarteraClientes', documentoControllers_1.documentoControllers.getCarteraClientes);
        this.router.get('/getDocumentoForFacturacionElectronica', documentoControllers_1.documentoControllers.getDocumentoForFacturacionElectronica);
        this.router.get('/getByDocumentoId', documentoControllers_1.documentoControllers.getByDocumentoId);
        this.router.get('/getDocumentoInvoiceByDocumento', documentoControllers_1.documentoControllers.getDocumentoInvoiceByDocumento);
        this.router.get('/getDocumentoNotaByDocumento', documentoControllers_1.documentoControllers.getDocumentoNotaByDocumento);
        this.router.get('/getGananciaDocumentos', documentoControllers_1.documentoControllers.getGananciaDocumentos);
        this.router.get('/getTerceros', documentoControllers_1.documentoControllers.getTerceros);
        this.router.get('/getCiudades', documentoControllers_1.documentoControllers.getCiudades);
        this.router.post('/updateFechaDocumento', documentoControllers_1.documentoControllers.updateFechaRegistroDocumento);
        this.router.get('/reset-documents-to-zero', documentoControllers_1.documentoControllers.setTotalDocumentoToZero);
        this.router.post('/update-impreso-in-documento', documentoControllers_1.documentoControllers.updateImpresoFromDocumento);
        //this.router.get('/getTipoPagoByDocumento', documentoControllers_1.documentoControllers.getTipoPagoByDocumento);
    }
}
const documentoRoutes = new DocumentoRoutes();
exports.default = documentoRoutes.router;
