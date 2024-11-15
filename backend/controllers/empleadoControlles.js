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
exports.empleadoControllers = void 0;
const empleadoRepository_1 = require("../repository/empleadoRepository");
const database_1 = __importDefault(require("../database"));
class EmpleadoControllers {
    createEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var empresa_id = req.body.empresa_id;
            var nombre = req.body.nombre;
            var apellido = req.body.apellido;
            var telefono = req.body.telefono;
            var identificacion = req.body.identificacion;
            var estado = req.body.estado;
            console.log(req.body);
            const id = yield database_1.default.query(empleadoRepository_1.empleadoRepository.getIdEmpleado);
            const empleado_id = id.rows[0].nextval;
            console.log(empleado_id);
            var query = "INSERT INTO empleado(empleado_id,nombre, apellido, telefono, identificacion,estado,empresa_id) VALUES ($1,$2,$3,$4,$5,$6,$7)";
            yield database_1.default.query(query, [empleado_id, nombre, apellido, telefono, identificacion, estado, empresa_id]).then(res2 => {
                res.json({ "code": 200, "empleado_id": empleado_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "empleado_id": empleado_id });
            });
        });
    }
    createProductoEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var empleado_id = req.body.empleado_id;
            var concepto_producto = req.body.concepto_producto;
            var valor = req.body.valor;
            var fecha_registro = req.body.fecha_registro;
            var cierre_diario = req.body.cierre_diario;
            console.log(req.body);
            const id = yield database_1.default.query(empleadoRepository_1.empleadoRepository.getIdProductoEmpleado);
            const producto_empleado_id = id.rows[0].nextval;
            console.log(producto_empleado_id);
            var query = "INSERT INTO producto_empleado(producto_empleado_id,empleado_id,concepto_producto, valor, fecha_registro,cierre_diario) VALUES ($1,$2,$3,$4,$5,$6)";
            yield database_1.default.query(query, [producto_empleado_id, empleado_id, concepto_producto, valor, fecha_registro, cierre_diario]).then(res2 => {
                res.json({ "code": 200, "producto_empleado_id": producto_empleado_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "producto_empleado_id": producto_empleado_id });
            });
        });
    }
    updateEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var empresa_id = req.body.empresa_id;
            var nombre = req.body.nombre;
            var apellido = req.body.apellido;
            var telefono = req.body.telefono;
            var identificacion = req.body.identificacion;
            var estado = req.body.estado;
            var empleado_id = req.body.empleado_id;
            var pago_empleado_id = req.body.pago_empleado_id;
            var porcentaje_pago = req.body.porcentaje_pago;
            var sueldo = req.body.sueldo;
            var pago_admin = req.body.pago_admin;
            var porcentaje_descuento = req.body.porcentaje_descuento;
            console.log(req.body);
            var query = "UPDATE empleado SET  empresa_id=$1, nombre= $2, apellido=$3, telefono=$4,identificacion =$5, estado=$6, pago_empleado_id=$8, porcentaje_pago=$9, sueldo=$10, pago_admin=$11, porcentaje_descuento=$12 WHERE empleado_id = $7";
            yield database_1.default.query(query, [empresa_id, nombre, apellido, telefono, identificacion, estado, empleado_id, pago_empleado_id, porcentaje_pago, sueldo, pago_admin, porcentaje_descuento]).then(res2 => {
                res.json({ "code": 200, "empleado_id": empleado_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "empleado_id": empleado_id, "error": error.error });
            });
        });
    }
    empleadoAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const rol = yield database_1.default.query(empleadoRepository_1.empleadoRepository.getEmpleadoByAll, [empresaId]);
            res.json(rol.rows);
        });
    }
    getPagosEmpleadosAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const rol = yield database_1.default.query(empleadoRepository_1.empleadoRepository.getPagosEmpleadosAll);
            res.json(rol.rows);
        });
    }
    getProductoEmpleadoByEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empleadoId = req.query.empleadoId;
            const fechaInicial = req.query.fechaInicial;
            const fechaFinal = req.query.fechaFinal;
            let query = "select * from producto_empleado where 1=1 ";
            if (empleadoId != null) {
                query = query + " and empleado_id= " + empleadoId;
            }
            if (fechaInicial != '') {
                query = query + " and fecha_registro>= '" + fechaInicial + "'";
            }
            if (fechaFinal != '') {
                query = query + " and fecha_registro <= '" + fechaFinal + "'";
            }
            else {
                query = query + " and (cierre_diario=0 or cierre_diario is null)";
            }
            query = query + " order by fecha_registro desc";
            console.log(query);
            const docuemntos = yield database_1.default.query(query);
            res.json(docuemntos.rows);
        });
    }
}
exports.empleadoControllers = new EmpleadoControllers();
