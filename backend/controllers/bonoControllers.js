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
exports.bonoControllers = void 0;
const bonoRepository_1 = require("../repository/bonoRepository");
const database_1 = __importDefault(require("../database"));
const documentoRepository_1 = require("../repository/documentoRepository");
class BonoControllers {
    saveBono(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let vehiculo_id = req.body.vehiculo_id;
            let documento_id = req.body.documento_id;
            let usuario_id = req.body.usuario_id;
            let empresa_id = req.body.empresa_id;
            let tipo_bono_id = req.body.tipo_bono_id;
            let observacion = req.body.observacion;
            let total = req.body.total;
            let estado = req.body.estado;
            const fecha = yield database_1.default.query(documentoRepository_1.documentoRepository.getfechaNow);
            var fecha_registro = fecha.rows[0].fecha_registro;
            console.log(req.body);
            const id = yield database_1.default.query(bonoRepository_1.bonoRepository.getIdBono);
            const bono_id = id.rows[0].nextval;
            console.log(bono_id);
            var query = "INSERT INTO bono(bono_id, vehiculo_id, documento_id, usuario_id, empresa_id, tipo_bono_id,observacion,total,estado,fecha_registro) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
            yield database_1.default.query(query, [bono_id, vehiculo_id, documento_id, usuario_id, empresa_id, tipo_bono_id, observacion, total, estado, fecha_registro]).then(res2 => {
                res.json({ "code": 200, "bono_id": bono_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "bono_id": bono_id });
            });
        });
    }
    updateBono(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let estado = req.body.estado;
            let bono_id = req.body.bono_id;
            const fecha = yield database_1.default.query(documentoRepository_1.documentoRepository.getfechaNow);
            var fecha_uso = fecha.rows[0].fecha_registro;
            console.log(req.body);
            var query = "UPDATE bono SET  estado=$2, fecha_uso =$3 WHERE bono_id = $1";
            console.log(query);
            yield database_1.default.query(query, [bono_id, estado, fecha_uso]).then(res2 => {
                res.json({ "code": 200, "bono_id": bono_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "bono_id": bono_id, "error": error.error });
            });
        });
    }
    getTiposBono(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.query);
            const abonos = yield database_1.default.query(bonoRepository_1.bonoRepository.getTiposBono);
            res.json(abonos.rows);
        });
    }
    getBonoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.query);
            const bonoId = req.query.bonoId;
            const abonos = yield database_1.default.query(bonoRepository_1.bonoRepository.getBonoById, [bonoId]);
            res.json(abonos.rows);
        });
    }
    getBonosByEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const placa = req.query.placa;
            const clienteId = req.query.clienteId;
            const bonoId = req.query.bonoId;
            const estado = req.query.estado;
            const fechaIni = req.query.fechaIni;
            const fechaFin = req.query.fechaFin;
            const empresaId = req.query.empresaId;
            console.log(req.query);
            let query = "select placa, bono_id, estado,fecha_registro,fecha_uso, total,observacion from bono, vehiculo where bono.vehiculo_id= vehiculo.vehiculo_id and  empresa_id = " + empresaId;
            if (placa != "") {
                query = query + " and LOWER(placa) like LOWER('%" + placa + "%')";
            }
            if (bonoId != "") {
                query = query + " and bono_id=" + bonoId;
            }
            if (estado != "") {
                query = query + " and estado= " + "'" + estado + "'";
            }
            if (clienteId != "") {
                query = query + " and cliente_id=" + clienteId;
            }
            if (fechaIni != '') {
                query = query + " and fecha_registro>= '" + fechaIni + "'";
            }
            if (fechaFin != '') {
                query = query + " and fecha_registro <= '" + fechaFin + "'";
            }
            query = query + " order by bono_id desc";
            console.log(query);
            const abonos = yield database_1.default.query(query);
            res.json(abonos.rows);
        });
    }
}
exports.bonoControllers = new BonoControllers();
