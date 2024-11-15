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
exports.controlInventarioControllers = void 0;
const database_1 = __importDefault(require("../database"));
const productoRepository_1 = require("../repository/productoRepository");
class ControlInventarioControllers {
    getControlInventario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            console.log(req.query);
            const productos = yield database_1.default.query(productoRepository_1.productoRepository.getControlInventario, [empresaId]);
            res.json(productos.rows);
        });
    }
    getControlInventarioByProductoId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productoId = req.query.productoId;
            console.log(req.query);
            const productos = yield database_1.default.query(productoRepository_1.productoRepository.getControlInventarioByProductoId, [productoId]);
            res.json(productos.rows);
        });
    }
    updateControlInventario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var control_inventario_id = req.body.control_inventario_id;
            var producto_id = req.body.producto_id;
            var empresa_id = req.body.empresa_id;
            var nombre = req.body.nombre;
            var inicial = req.body.inicial;
            var entrada = req.body.entrada;
            var venta = req.body.venta;
            let query = " update control_inventario set producto_id=$2, empresa_id=$3,nombre=$4, inicial=$5,"
                + " entrada=$6, venta=$7 where control_inventario_id = $1 ";
            console.log(req.body);
            yield database_1.default.query(query, [control_inventario_id, producto_id, empresa_id, nombre, inicial, entrada, venta]).then(res2 => {
                res.json({ "code": 200, "control_inventario_id": control_inventario_id });
                console.log(req.body);
            }).catch(error => {
                console.error("updateGrupo");
                res.json({ "code": 200, "control_inventario_id": control_inventario_id, "error:": error.error });
                console.log(error);
            });
        });
    }
}
exports.controlInventarioControllers = new ControlInventarioControllers();
