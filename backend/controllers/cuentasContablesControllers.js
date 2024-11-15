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
exports.cuentasContablesControllers = void 0;
const abonoRepository_1 = require("../repository/abonoRepository");
const database_1 = __importDefault(require("../database"));
const cuentasContablesRepository_1 = require("../repository/cuentasContablesRepository");
class CuentasContablesControllers {
    saveAbono(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let documento_id = req.body.documento_id;
            let tipo_pago_id = req.body.tipo_pago_id;
            let usuario_id = req.body.usuario_id;
            let cantidad = req.body.cantidad;
            let fecha_ingreso = req.body.fecha_ingreso;
            console.log(req.body);
            const id = yield database_1.default.query(abonoRepository_1.abonoRepository.getIdAbono);
            const abono_id = id.rows[0].nextval;
            console.log(abono_id);
            var query = "INSERT INTO abono(abono_id,documento_id, tipo_pago_id, usuario_id, cantidad,fecha_ingreso) VALUES ($1,$2,$3,$4,$5,$6)";
            yield database_1.default.query(query, [abono_id, documento_id, tipo_pago_id, usuario_id, cantidad, fecha_ingreso]).then(res2 => {
                res.json({ "code": 200, "abono_id": abono_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "abono_id": abono_id });
            });
        });
    }
    getClasesContables(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const abonos = yield database_1.default.query(cuentasContablesRepository_1.cuentasContablesRepository.getClasesContables, [empresaId]);
            res.json(abonos.rows);
        });
    }
    getGrupoByClase(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const claseId = req.query.claseId;
            console.log(req.query);
            const abonos = yield database_1.default.query(cuentasContablesRepository_1.cuentasContablesRepository.getGrupoByClase, [claseId]);
            res.json(abonos.rows);
        });
    }
    getCuentaByGrupo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const grupoId = req.query.grupoId;
            console.log(req.query);
            const abonos = yield database_1.default.query(cuentasContablesRepository_1.cuentasContablesRepository.getCuentaByGrupo, [grupoId]);
            res.json(abonos.rows);
        });
    }
    getSubCuentaByCuenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cuentaId = req.query.cuentaId;
            console.log(req.query);
            const abonos = yield database_1.default.query(cuentasContablesRepository_1.cuentasContablesRepository.getSubCuentaByCuenta, [cuentaId]);
            res.json(abonos.rows);
        });
    }
    getAuxiliarBySubCuenta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const subCuentaId = req.query.subCuentaId;
            console.log(req.query);
            const abonos = yield database_1.default.query(cuentasContablesRepository_1.cuentasContablesRepository.getAuxiliarBySubCuenta, [subCuentaId]);
            res.json(abonos.rows);
        });
    }
}
exports.cuentasContablesControllers = new CuentasContablesControllers();
