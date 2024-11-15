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
exports.abonoControllers = void 0;
const abonoRepository_1 = require("../repository/abonoRepository");
const database_1 = __importDefault(require("../database"));
class AbonoControllers {
    saveAbono(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let documento_id = req.body.documento_id;
            let tipo_pago_id = req.body.tipo_pago_id;
            let usuario_id = req.body.usuario_id;
            let cantidad = req.body.cantidad;
            let fecha_ingreso = req.body.fecha_ingreso;
            let cierre_diario = req.body.cierre_diario;
            console.log(req.body);
            const id = yield database_1.default.query(abonoRepository_1.abonoRepository.getIdAbono);
            const abono_id = id.rows[0].nextval;
            console.log(abono_id);
            var query = "INSERT INTO abono(abono_id,documento_id, tipo_pago_id, usuario_id, cantidad,fecha_ingreso,cierre_diario) VALUES ($1,$2,$3,$4,$5,$6,$7)";
            yield database_1.default.query(query, [abono_id, documento_id, tipo_pago_id, usuario_id, cantidad, fecha_ingreso, cierre_diario]).then(res2 => {
                res.json({ "code": 200, "abono_id": abono_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "abono_id": abono_id });
            });
        });
    }
    getAbonosByDocumento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentoId = req.query.documentoId;
            const abonos = yield database_1.default.query(abonoRepository_1.abonoRepository.getAbonosByDocumento, [documentoId]);
            res.json(abonos.rows);
        });
    }
}
exports.abonoControllers = new AbonoControllers();
