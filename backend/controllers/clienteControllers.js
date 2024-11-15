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
exports.clienteControllers = void 0;
const clienteRepository_1 = require("../repository/clienteRepository");
const database_1 = __importDefault(require("../database"));
class ClienteControllers {
    getClientesByEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const opcionUsuario = yield database_1.default.query(clienteRepository_1.clienteRepository.getClientesByEmpresa, [empresaId]);
            res.json(opcionUsuario.rows);
        });
    }
    getImpresorasEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const impresoraEmpresa = yield database_1.default.query(clienteRepository_1.clienteRepository.getImpresorasEmpresa, [empresaId]);
            res.json(impresoraEmpresa.rows);
        });
    }
    getVehiculos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const impresoraEmpresa = yield database_1.default.query(clienteRepository_1.clienteRepository.getVehiculos);
            res.json(impresoraEmpresa.rows);
        });
    }
    saveResponsabilidadFiscalCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let cliente_id = req.body.cliente_id;
            let responsabilidad_fiscal_id = req.body.responsabilidad_fiscal_id;
            console.log(req.body);
            const id = yield database_1.default.query(clienteRepository_1.clienteRepository.getIdResponsabilidadCliente);
            const responsabilidad_fiscal_cliente_id = id.rows[0].nextval;
            console.log(responsabilidad_fiscal_cliente_id);
            yield database_1.default.query("delete from responsabilidad_fiscal_cliente where cliente_id=$1 ", [cliente_id]);
            var query = "INSERT INTO responsabilidad_fiscal_cliente(responsabilidad_fiscal_cliente_id,cliente_id,responsabilidad_fiscal_id) VALUES ($1,$2,$3)";
            yield database_1.default.query(query, [responsabilidad_fiscal_cliente_id, cliente_id, responsabilidad_fiscal_id]).then(res2 => {
                res.json({ "code": 200, "responsabilidad_fiscal_cliente_id": responsabilidad_fiscal_cliente_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "responsabilidad_fiscal_cliente_id": responsabilidad_fiscal_cliente_id });
            });
        });
    }
    saveCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nombre = req.body.nombre;
            let razon_social = req.body.razon_social;
            let apellidos = req.body.apellidos;
            let documento = req.body.documento;
            let barrio = req.body.barrio;
            let direccion = req.body.direccion;
            let celular = req.body.celular;
            let fijo = req.body.fijo;
            let fecha_registro = req.body.fecha_registro;
            let credito_activo = req.body.credito_activo;
            let mail = req.body.mail;
            let digito_verificacion = req.body.digito_verificacion;
            let empresa_id = req.body.empresa_id;
            let tipo_identificacion_id = req.body.tipo_identificacion_id;
            let segundo_nombre = req.body.segundo_nombre;
            let segundo_apellido = req.body.segundo_apellido;
            let fact_tipo_empresa_id = req.body.fact_tipo_empresa_id;
            let ciudad = req.body.ciudad_id;
            console.log(req.body);
            const id = yield database_1.default.query(clienteRepository_1.clienteRepository.getIdCliente);
            const cliente_id = id.rows[0].nextval;
            console.log(cliente_id);
            var query = "INSERT INTO cliente(cliente_id,nombre, apellidos, documento, barrio,direccion, celular, fijo, fecha_registro, credito_activo,mail,empresa_id,tipo_identificacion_id,segundo_nombre,segundo_apellido,fact_tipo_empresa_id,razon_social,digito_verificacion, ciudad_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18, $19)";
            yield database_1.default.query(query, [cliente_id, nombre, apellidos, documento, barrio, direccion, celular, fijo, fecha_registro, credito_activo, mail, empresa_id, tipo_identificacion_id, segundo_nombre, segundo_apellido, fact_tipo_empresa_id, razon_social, digito_verificacion, ciudad]).then(res2 => {
                res.json({ "code": 200, "cliente_id": cliente_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "cliente_id": cliente_id });
            });
        });
    }
    saveVehiculo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let cliente_id = req.body.cliente_id;
            let marca_vehiculo_id = req.body.marca_vehiculo_id;
            let modelo_marca_id = req.body.modelo_marca_id;
            let placa = req.body.placa;
            let linea_vehiculo = req.body.linea_vehiculo;
            console.log(req.body);
            const id = yield database_1.default.query(clienteRepository_1.clienteRepository.getIdVehiculo);
            const vehiculo_id = id.rows[0].nextval;
            console.log(vehiculo_id);
            var query = "INSERT INTO vehiculo (vehiculo_id,marca_vehiculo_id, modelo_marca_id, placa, linea_vehiculo,cliente_id) VALUES ($1,$2,$3,$4,$5,$6)";
            yield database_1.default.query(query, [vehiculo_id, marca_vehiculo_id, modelo_marca_id, placa, linea_vehiculo, cliente_id]).then(res2 => {
                res.json({ "code": 200, "vehiculo_id": vehiculo_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "vehiculo_id": vehiculo_id });
            });
        });
    }
    updateVehiculo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let vehiculo_id = req.body.vehiculo_id;
            let cliente_id = req.body.cliente_id;
            let marca_vehiculo_id = req.body.marca_vehiculo_id;
            let modelo_marca_id = req.body.modelo_marca_id;
            let placa = req.body.placa;
            let linea_vehiculo = req.body.linea_vehiculo;
            console.log(req.body);
            var query = "UPDATE vehiculo SET  cliente_id=$1, marca_vehiculo_id= $2, modelo_marca_id=$3, placa=$4, linea_vehiculo=$5 WHERE vehiculo_id = $6";
            console.log(query);
            yield database_1.default.query(query, [cliente_id, marca_vehiculo_id, modelo_marca_id, placa, linea_vehiculo, vehiculo_id]).then(res2 => {
                res.json({ "code": 200, "vehiculo_id": vehiculo_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "vehiculo_id": vehiculo_id, "error": error.error });
            });
        });
    }
    updateCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let cliente_id = req.body.cliente_id;
            let nombre = req.body.nombre;
            let apellidos = req.body.apellidos;
            let documento = req.body.documento;
            let barrio = req.body.barrio;
            let direccion = req.body.direccion;
            let razon_social = req.body.razon_social;
            let digito_verificacion = req.body.digito_verificacion;
            let celular = req.body.celular;
            let fijo = req.body.fijo;
            let fecha_registro = req.body.fecha_registro;
            let credito_activo = req.body.credito_activo;
            let mail = req.body.mail;
            let empresa_id = req.body.empresa_id;
            let tipo_identificacion_id = req.body.tipo_identificacion_id;
            let segundo_nombre = req.body.segundo_nombre;
            let segundo_apellido = req.body.segundo_apellido;
            let fact_tipo_empresa_id = req.body.fact_tipo_empresa_id;
            let ciudad = req.body.ciudad_id;
            console.log(req.body);
            var query = "UPDATE cliente SET  nombre=$1, apellidos= $2, documento=$3, barrio=$4, direccion=$5, celular=$6, fijo=$7, fecha_registro=$8,credito_activo=$9,mail=$10,empresa_id=$11,tipo_identificacion_id=$12,segundo_nombre=$13,segundo_apellido=$14, fact_tipo_empresa_id=$16,razon_social=$17,digito_verificacion=$18, ciudad_id=$19  WHERE cliente_id = $15";
            console.log(query);
            yield database_1.default.query(query, [nombre, apellidos, documento, barrio, direccion, celular, fijo, fecha_registro, credito_activo, mail, empresa_id, tipo_identificacion_id, segundo_nombre, segundo_apellido, cliente_id, fact_tipo_empresa_id, razon_social, digito_verificacion, ciudad]).then(res2 => {
                res.json({ "code": 200, "cliente_id": cliente_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "cliente_id": cliente_id, "error": error.error });
            });
        });
    }
    getConfiguracionByEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const configuracion = yield database_1.default.query(clienteRepository_1.clienteRepository.getConfiguracionByEmpresa, [empresaId]);
            res.json(configuracion.rows);
        });
    }
    getResponsabilidadesByCliente(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clienteId = req.query.clienteId;
            const configuracion = yield database_1.default.query(clienteRepository_1.clienteRepository.getResponsabilidadesByCliente, [clienteId]);
            res.json(configuracion.rows);
        });
    }
    getTipoPago(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipoPago = yield database_1.default.query(clienteRepository_1.clienteRepository.getTipoPago);
            res.json(tipoPago.rows);
        });
    }
    getResolucion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const tipoPago = yield database_1.default.query(clienteRepository_1.clienteRepository.getResolucion, [empresaId]);
            res.json(tipoPago.rows);
        });
    }
    getResolucionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolucionEmpresaId = req.query.resolucionEmpresaId;
            const resoulucion = yield database_1.default.query(clienteRepository_1.clienteRepository.getResolucionId, [resolucionEmpresaId]);
            res.json(resoulucion.rows);
        });
    }
    getResponsabilidades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const responsabilidades = yield database_1.default.query(clienteRepository_1.clienteRepository.getResponsabilidades);
            res.json(responsabilidades.rows);
        });
    }
    getTipoIdentificacionAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipoIdentificacion = yield database_1.default.query(clienteRepository_1.clienteRepository.getTipoIdentificacionAll);
            res.json(tipoIdentificacion.rows);
        });
    }
    getTipoEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tipoIdentificacion = yield database_1.default.query(clienteRepository_1.clienteRepository.getTipoEmpresa);
            res.json(tipoIdentificacion.rows);
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const getById = req.query.getById;
            console.log(req.query);
            const tipoIdentificacion = yield database_1.default.query(clienteRepository_1.clienteRepository.getById, [getById]);
            res.json(tipoIdentificacion.rows);
        });
    }
}
exports.clienteControllers = new ClienteControllers();
