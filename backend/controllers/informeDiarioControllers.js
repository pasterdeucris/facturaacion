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
exports.informeDiarioControllers = void 0;
const database_1 = __importDefault(require("../database"));
const documentoRepository_1 = require("../repository/documentoRepository");
const productoRepository_1 = require("../repository/productoRepository");
class InformeDiarioControllers {
    getClientesByEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            console.log(req.query);
            let query = "select sum(total) total_ventas, sum(total_costo) costo_ventas, sum(iva) iva_ventas, "
                + "sum(iva_5) iva_5, sum(iva_19) iva_19, sum(base_5) base_5, sum(base_19) base_19, sum(excento) excento, (sum(total)-sum(total_costo)) ganancias "
                + "from documento "
                + "where tipo_documento_id = 10 "
                + "and impreso=1 "
                + "and consecutivo_dian is not null "
                + "and empresa_id= " + empresaId
                + " and cierre_diario= 0 ";
            console.log(query);
            const docuemntos = yield database_1.default.query(query);
            res.json(docuemntos.rows);
        });
    }
    getInfoDiarioByDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const fechaInforme = req.query.fechaInforme;
            const fechaFin = req.query.fechaFin;
            console.log(req.query);
            let query = "select * from informe_diario where fecha_informe >= '" + fechaInforme + "' and  fecha_informe <= '" + fechaFin + "'"
                + "and empresa_id= " + empresaId;
            console.log(query);
            const docuemntos = yield database_1.default.query(query);
            res.json(docuemntos.rows);
        });
    }
    hacerCierreDiario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            console.log(req.query);
            const fecha = yield database_1.default.query(documentoRepository_1.documentoRepository.getfechaNow);
            var fecha_registro = fecha.rows[0].fecha_registro;
            let query = "update documento set impreso=1, cierre_diario=1 where tipo_documento_id in (10,9,5,4,8,12,13) and empresa_id=" + empresaId;
            console.log(query);
            yield database_1.default.query("delete from control_inventario where empresa_id=" + empresaId + ";");
            const productos = yield database_1.default.query(productoRepository_1.productoRepository.getProductosByEmpresa, [empresaId]);
            let queryInventario = "";
            for (let p of productos.rows) {
                const id = yield database_1.default.query(productoRepository_1.productoRepository.getIdControlInventario);
                const control_inventario_id = id.rows[0].nextval;
                queryInventario = queryInventario + "INSERT INTO control_inventario (control_inventario_id,producto_id,empresa_id,nombre,inicial,entrada,venta,fecha_cierre)"
                    + " VALUES (" + control_inventario_id + ", " + p.producto_id + ", " + empresaId + ", '" + p.nombre + "', " + p.cantidad + ",0,0, '" + new Date(fecha_registro).toLocaleDateString() + "');";
            }
            console.log(queryInventario);
            yield database_1.default.query(queryInventario);
            yield database_1.default.query("update retiro_caja set cierre_diario=1 where cierre_diario=0;");
            yield database_1.default.query("update abono set cierre_diario=1 where cierre_diario=0 or cierre_diario is null;");
            yield database_1.default.query(query).then(res2 => {
                res.json({ "code": 200, "empresaId": empresaId });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "empresaId": empresaId, "error": error.error });
            });
        });
    }
}
exports.informeDiarioControllers = new InformeDiarioControllers();
