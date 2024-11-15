"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trasladosControllers = void 0;
const database_1 = __importDefault(require("../database"));
const documentoRepository_1 = require("../repository/documentoRepository");
const trasladosRepository_1 = require("../repository/trasladosRepository");
class TrasladosControllers {
    saveRequerimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let empresa_id = req.body.empresa_id;
            let observacion = req.body.observacion;
            let usuario_id = req.body.usuario_id;
            let estado = req.body.estado;
            let total = req.body.total;
            const fecha = yield database_1.default.query(documentoRepository_1.documentoRepository.getfechaNow);
            var fecha_registro = fecha.rows[0].fecha_registro;
            console.log(req.body);
            const id = yield database_1.default.query(trasladosRepository_1.trasladosRepository.getIdRequerimiento);
            const requerimiento_id = id.rows[0].nextval;
            console.log(requerimiento_id);
            var query = "INSERT INTO requerimiento(requerimiento_id,empresa_id, usuario_id, fecha_registro, estado,total,observacion) VALUES ($1,$2,$3,$4,$5,$6,$7)";
            yield database_1.default.query(query, [requerimiento_id, empresa_id, usuario_id, fecha_registro, estado, total, observacion]).then(res2 => {
                res.json({ "code": 200, "requerimiento_id": requerimiento_id, "fecha_registro": fecha_registro });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "requerimiento_id": requerimiento_id });
            });
        });
    }
    saveTraslado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let requerimiento_id = req.body.requerimiento_id;
            let empresa_origen_id = req.body.empresa_origen_id;
            let empresa_destino_id = req.body.empresa_destino_id;
            let usuario_crea_id = req.body.usuario_crea_id;
            let usuario_aprueba_id = req.body.usuario_aprueba_id;
            let estado = req.body.estado;
            let total = req.body.total;
            const fecha = yield database_1.default.query(documentoRepository_1.documentoRepository.getfechaNow);
            var fecha_registro = fecha.rows[0].fecha_registro;
            console.log(req.body);
            const id = yield database_1.default.query(trasladosRepository_1.trasladosRepository.getIdTraslado);
            const traslado_id = id.rows[0].nextval;
            console.log(traslado_id);
            var query = "INSERT INTO traslado(traslado_id,requerimiento_id,empresa_origen_id, empresa_destino_id, usuario_crea_id, usuario_aprueba_id,estado,total,fecha_registro) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)";
            yield database_1.default.query(query, [traslado_id, requerimiento_id, empresa_origen_id, empresa_destino_id, usuario_crea_id, usuario_aprueba_id,
                estado, total, fecha_registro]).then(res2 => {
                res.json({ "code": 200, "traslado_id": traslado_id, "fecha_registro": fecha_registro });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "traslado_id": traslado_id });
            });
        });
    }
    updateRequerimiento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let empresa_id = req.body.empresa_id;
            let observacion = req.body.observacion;
            let usuario_id = req.body.usuario_id;
            let estado = req.body.estado;
            let total = req.body.total;
            const requerimiento_id = req.body.requerimiento_id;
            console.log(req.body);
            var query = "UPDATE requerimiento SET empresa_id=$1, usuario_id=$2, estado=$3,total=$4,observacion=$5 WHERE requerimiento_id = $6";
            yield database_1.default.query(query, [empresa_id, usuario_id, estado, total, observacion, requerimiento_id]).then(res2 => {
                res.json({ "code": 200, "requerimiento_id": requerimiento_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "requerimiento_id": requerimiento_id });
            });
        });
    }
    updateTraslado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let traslado_id = req.body.traslado_id;
            let empresa_origen_id = req.body.empresa_origen_id;
            let empresa_destino_id = req.body.empresa_destino_id;
            let usuario_crea_id = req.body.usuario_crea_id;
            let usuario_aprueba_id = req.body.usuario_aprueba_id;
            let estado = req.body.estado;
            let total = req.body.total;
            const requerimiento_id = req.body.requerimiento_id;
            console.log(req.body);
            var query = "UPDATE traslado SET empresa_origen_id=$1, empresa_destino_id=$2, usuario_crea_id=$3,usuario_aprueba_id=$4,estado=$5, requerimiento_id=$6, total=$7 WHERE traslado_id = $8";
            yield database_1.default.query(query, [empresa_origen_id, empresa_destino_id, usuario_crea_id, usuario_aprueba_id, estado, requerimiento_id, total, traslado_id]).then(res2 => {
                res.json({ "code": 200, "traslado_id": traslado_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "traslado_id": traslado_id });
            });
        });
    }
    saveRequerimientoDetalle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let requerimiento_id = req.body.requerimiento_id;
            let producto_id = req.body.producto_id;
            let cantidad = req.body.cantidad;
            let estado = req.body.estado;
            let parcial = req.body.parcial;
            let unitario = req.body.unitario;
            let descripcion = req.body.descripcion;
            const fecha = yield database_1.default.query(documentoRepository_1.documentoRepository.getfechaNow);
            var fecha_registro = fecha.rows[0].fecha_registro;
            console.log(req.body);
            const id = yield database_1.default.query(trasladosRepository_1.trasladosRepository.getIdRequerimientoDetalle);
            const requerimiento_detalle_id = id.rows[0].nextval;
            console.log(requerimiento_detalle_id);
            var query = "INSERT INTO requerimiento_detalle(requerimiento_detalle_id,requerimiento_id, cantidad, estado, parcial,unitario,descripcion,fecha_registro,producto_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)";
            yield database_1.default.query(query, [requerimiento_detalle_id, requerimiento_id, cantidad, estado, parcial, unitario, descripcion, fecha_registro, producto_id]).then(res2 => {
                res.json({ "code": 200, "requerimiento_detalle_id": requerimiento_detalle_id, "fecha_registro": fecha_registro });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "requerimiento_detalle_id": requerimiento_detalle_id });
            });
        });
    }
    saveTrasladoDetalle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let traslado_id = req.body.traslado_id;
            let producto_id = req.body.producto_id;
            let cantidad_aceptada = req.body.cantidad_aceptada;
            let cantidad_traslado = req.body.cantidad_traslado;
            let cantidad_rechazada = req.body.cantidad_rechazada;
            let estado = req.body.estado;
            let parcial = req.body.parcial;
            let unitario = req.body.unitario;
            let descripcion = req.body.descripcion;
            const fecha = yield database_1.default.query(documentoRepository_1.documentoRepository.getfechaNow);
            var fecha_registro = fecha.rows[0].fecha_registro;
            console.log(req.body);
            const id = yield database_1.default.query(trasladosRepository_1.trasladosRepository.getIdRequerimientoDetalle);
            const traslado_detalle_id = id.rows[0].nextval;
            console.log(traslado_detalle_id);
            var query = "INSERT INTO traslado_detalle(traslado_detalle_id,traslado_id, producto_id,cantidad_aceptada,cantidad_traslado,cantidad_rechazada, estado, parcial,unitario,descripcion,fecha_registro) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)";
            yield database_1.default.query(query, [traslado_detalle_id, traslado_id, producto_id, cantidad_aceptada, cantidad_traslado, cantidad_rechazada, estado, parcial, unitario, descripcion, fecha_registro]).then(res2 => {
                res.json({ "code": 200, "traslado_detalle_id": traslado_detalle_id, "fecha_registro": fecha_registro });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "traslado_detalle_id": traslado_detalle_id });
            });
        });
    }
    getRequerimientoDetalleByRequerimientoId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requerimientoId = req.query.requerimientoId;
            let query = "select * from requerimiento_detalle where requerimiento_id = " + requerimientoId;
            query = query + "  order by requerimiento_detalle_id desc";
            console.log(query);
            const docuemntos = yield database_1.default.query(query);
            res.json(docuemntos.rows);
        });
    }
    getTrasladoDetalleByTrasladoId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const trasladoId = req.query.trasladoId;
            let query = "select * from traslado_detalle where traslado_id = " + trasladoId;
            query = query + "  order by traslado_detalle_id desc";
            console.log(query);
            const docuemntos = yield database_1.default.query(query);
            res.json(docuemntos.rows);
        });
    }
    deleteRequerimientoDetalle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var requerimientoId = req.body.requerimiento_id;
            console.log(req.body);
            const usuario = yield database_1.default.query(trasladosRepository_1.trasladosRepository.deleteRequerimientoDetalle, [requerimientoId]);
            res.json({ "code": 200, "usuario_id": requerimientoId });
        });
    }
    deleteTrasladoDetalle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var trasladoId = req.body.traslado_id;
            console.log(req.body);
            const usuario = yield database_1.default.query(trasladosRepository_1.trasladosRepository.deleteTrasladoDetalle, [trasladoId]);
            res.json({ "code": 200, "trasladoId": trasladoId });
        });
    }
    getRequerimientoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requerimientoId = req.query.requerimientoId;
            let query = "select * from requerimiento where requerimiento_id = " + requerimientoId;
            console.log(query);
            const docuemntos = yield database_1.default.query(query);
            res.json(docuemntos.rows);
        });
    }
    getRequerimientoDetalleByRequerimientoIdList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const documento_id = req.query.requerimientoIdList;
            let query = "select descripcion, sum(cantidad) cantidad from REQUERIMIENTO_DETALLE,requerimiento where  " +
                " requerimiento.requerimiento_id = requerimiento_detalle.requerimiento_id" +
                " and requerimiento.requerimiento_id in () " +
                " and requerimiento.estado=0 group by descripcion";
            query = query.replace('()', "(" + documento_id.toString() + ")");
            console.log(query);
            const usuario = yield database_1.default.query(query);
            res.json(usuario.rows);
        });
    }
    getTraslados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaOrigenId = req.query.empresaOrigenId;
            const empresaDestinoId = req.query.empresaDestinoId;
            const fechaIni = req.query.fechaIni;
            const fechaFin = req.query.fechaFin;
            const estado = req.query.estado;
            let query = "select * from traslado where 1= 1 ";
            if (empresaOrigenId != "") {
                query = query + " and empresa_origen_id= " + empresaOrigenId;
            }
            if (empresaDestinoId != "") {
                query = query + " and empresa_destino_id= " + empresaDestinoId;
            }
            if (fechaIni != '') {
                query = query + " and fecha_registro>= '" + fechaIni + "'";
            }
            if (fechaFin != '') {
                query = query + " and fecha_registro <= '" + fechaFin + "'";
            }
            if (estado != '') {
                query = query + " and estado = " + estado;
            }
            query = query + "  order by fecha_registro desc";
            console.log(query);
            const docuemntos = yield database_1.default.query(query);
            res.json(docuemntos.rows);
        });
    }
    getRequerimientos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const fechaIni = req.query.fechaIni;
            const fechaFin = req.query.fechaFin;
            const estado = req.query.estado;
            let query = "select * from requerimiento where 1= 1 ";
            if (empresaId != "") {
                query = query + " and empresa_id= " + empresaId;
            }
            if (fechaIni != '') {
                query = query + " and fecha_registro>= '" + fechaIni + "'";
            }
            if (fechaFin != '') {
                query = query + " and fecha_registro <= '" + fechaFin + "'";
            }
            if (estado != '') {
                query = query + " and estado = " + estado;
            }
            query = query + "  order by fecha_registro desc";
            console.log(query);
            const docuemntos = yield database_1.default.query(query);
            res.json(docuemntos.rows);
        });
    }
}
exports.trasladosControllers = new TrasladosControllers();
