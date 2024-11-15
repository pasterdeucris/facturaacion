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
exports.documentoDetalleControllers = void 0;
const database_1 = __importDefault(require("../database"));
const documentoDetalleRepository_1 = require("../repository/documentoDetalleRepository");
class DocumentoDetalleControllers {
    createDocumentoDetalle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let documento_id = req.body.documento_id;
            let producto_id = req.body.producto_id;
            let proveedor_id = req.body.proveedor_id;
            let cotero_id = req.body.cotero_id;
            const fecha = yield database_1.default.query(documentoDetalleRepository_1.documentoDetalleRepository.getfechaNow);
            var fecha_registro = fecha.rows[0].fecha_registro;
            console.log(fecha_registro);
            let cantidad = req.body.cantidad;
            let estado = req.body.estado;
            let parcial = req.body.parcial;
            let unitario = req.body.unitario;
            let impreso_comanda = req.body.impreso_comanda;
            let descripcion = req.body.descripcion;
            let impuesto_producto = req.body.impuesto_producto;
            let saldo = req.body.saldo;
            let procedencia_producto_id = req.body.procedencia_producto_id;
            let grupo_id = req.body.grupo_id;
            let sub_grupo_id = req.body.sub_grupo_id;
            console.log(req.body);
            const id = yield database_1.default.query(documentoDetalleRepository_1.documentoDetalleRepository.getIdDocumentoDetalle);
            const documento_detalle_id = id.rows[0].nextval;
            var query = "INSERT INTO documento_detalle(documento_detalle_id, documento_id, producto_id, fecha_registro, cantidad, estado,parcial,unitario,impreso_comanda,descripcion,impuesto_producto,saldo,cotero_id,proveedor_id,procedencia_producto_id, grupo_id, sub_grupo_id) VALUES ($9,$1,$2,$3,$4,$5,$6,$7,$8,$10,$11,$12,$13,$14,$15, $16, $17)";
            console.log(query);
            yield database_1.default.query(query, [documento_id, producto_id, fecha_registro, cantidad, estado, parcial, unitario, impreso_comanda, documento_detalle_id, descripcion, impuesto_producto, saldo, cotero_id, proveedor_id, procedencia_producto_id, grupo_id, sub_grupo_id]).then(res2 => {
                res.json({ "code": 200, "documento_detalle_id": documento_detalle_id });
            }).catch(error => {
                console.error("error creando documento detalle");
                console.log(error);
                res.json({ "code": 400, "documento_detalle_id": documento_detalle_id, "error": error.error });
            });
        });
    }
    updateDocumentoDetalle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let documento_detalle_id = req.body.documento_detalle_id;
            let documento_id = req.body.documento_id;
            let producto_id = req.body.producto_id;
            let cotero_id = req.body.cotero_id;
            let proveedor_id = req.body.proveedor_id;
            const id = yield database_1.default.query(documentoDetalleRepository_1.documentoDetalleRepository.getFechaRegistro, [documento_detalle_id]);
            var fecha_registro = id.rows[0].fecha_registro;
            console.log(fecha_registro);
            let cantidad = req.body.cantidad;
            let estado = req.body.estado;
            let parcial = req.body.parcial;
            let unitario = req.body.unitario;
            let impreso_comanda = req.body.impreso_comanda;
            let descripcion = req.body.descripcion;
            let impuesto_producto = req.body.impuesto_producto;
            let saldo = req.body.saldo;
            let peso_cotero = req.body.peso_cotero;
            let procedencia_producto_id = req.body.procedencia_producto_id;
            let grupo_id = req.body.grupo_id;
            let sub_grupo_id = req.body.sub_grupo_id;
            console.log(req.body);
            var query = "UPDATE documento_detalle SET  documento_id=$1, producto_id= $2, fecha_registro=$3, cantidad=$4, estado=$5, parcial=$6," +
                "unitario=$7, impreso_comanda=$8,descripcion=$9, impuesto_producto=$11, saldo=$12,cotero_id=$13, peso_cotero=$14," +
                " proveedor_id=$15,procedencia_producto_id=$16, grupo_id=$17, sub_grupo_id=$18 WHERE documento_detalle_id = $10";
            yield database_1.default.query(query, [documento_id, producto_id, fecha_registro, cantidad, estado, parcial, unitario, impreso_comanda, descripcion,
                documento_detalle_id, impuesto_producto, saldo, cotero_id, peso_cotero, proveedor_id, procedencia_producto_id, grupo_id, sub_grupo_id]).then(res2 => {
                res.json({ "code": 200, "documento_detalle_id": documento_detalle_id });
            }).catch(error => {
                console.error("error actualizando documento detalle");
                console.error(error);
                res.json({ "code": 400, "documento_id": documento_id, "error": error.error });
            });
        });
    }
    getDocumentoDetalleByDocumento(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const documento_id = req.query.documento_id;
            const estado = req.query?.estado ?? 1;
            console.log(documento_id);
            const usuario = yield database_1.default.query(documentoDetalleRepository_1.documentoDetalleRepository.getDocumentoDetalleByDocumento, [documento_id, estado]);
            res.json(usuario.rows);
        });
    }
    getDocumentoDetalleByDocumentoList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const documento_id = req.query.documento_id;
            let query = "select * from DOCUMENTO_DETALLE where  estado=1 and documento_id in () order by documento_detalle_id asc";
            query = query.replace('()', "(" + documento_id.toString() + ")");
            console.log(query);
            const usuario = yield database_1.default.query(query);
            res.json(usuario.rows);
        });
    }
    getDocumentosByFechaAndTipo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fechaInicial = req.query.fechaInicial;
            const fechaFinal = req.query.fechaFinal;
            let empleadoId = req.query.idEmpleados;
            let empresaId = req.query.empresaId;
            let usuarioId = req.query.usuarioId;
            console.log(req.query);
            let query = `select dd.documento_detalle_id, dd.fecha_registro,pp.nombre, COALESCE(pp.porcentaje_venta,0) porcentaje_venta, d.consecutivo_dian, 
        dd.cantidad, dd.unitario, d.empleado_id vendedor, dd.parcial, dd.parcial*(COALESCE(pp.porcentaje_venta,0)/100) gana
        from documento_detalle dd, producto pp, documento d
        where dd.producto_id = pp.producto_id
        and dd.documento_id = d.documento_id
        and d.impreso=1
        and pp.porcentaje_venta is not null 
        and pp.porcentaje_venta > 0 
        and d.tipo_documento_id=10
        and d.empresa_id= ${empresaId}
        and dd.estado= 1 `;
            if (fechaInicial != '') {
                query = query + " and dd.fecha_registro>= '" + fechaInicial + "'";
            }
            if (fechaFinal != '') {
                query = query + " and dd.fecha_registro <= '" + fechaFinal + "'";
            }
            if (usuarioId != '') {
                query = query + " and d.usuario_id = " + usuarioId;
            }
            if (empleadoId != '') {
                query = query + " and d.empleado_id =  " + empleadoId;
            }
            query = query + " order by dd.documento_detalle_id desc";
            console.log(query);
            const usuario = yield database_1.default.query(query);
            res.json(usuario.rows);
        });
    }
    getDetalleExterno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fechaInicial = req.query.fechaInicial;
            const fechaFinal = req.query.fechaFinal;
            let proveedor_id = req.query.proveedor_id;
            let procedencia_producto_id = req.query.procedencia_producto_id;
            let documento_id = req.query.documento_id;
            console.log(req.query);
            let query = `select *  from documento_detalle dd where estado=1 `;
            if (fechaInicial != '') {
                query = query + " and dd.fecha_registro>= '" + fechaInicial + "'";
            }
            if (fechaFinal != '') {
                query = query + " and dd.fecha_registro <= '" + fechaFinal + "'";
            }
            if (proveedor_id != '') {
                query = query + " and dd.proveedor_id = " + proveedor_id;
            }
            if (procedencia_producto_id != '') {
                query = query + " and dd.procedencia_producto_id =  " + procedencia_producto_id;
            }
            if (documento_id != '') {
                query = query + " and dd.documento_id = " + documento_id;
            }
            query = query + " order by dd.documento_detalle_id desc";
            console.log(query);
            const usuario = yield database_1.default.query(query);
            res.json(usuario.rows);
        });
    }
    // getKardex(req, res) {
    //     return __awaiter(this, void 0, void 0, function* () {
    //         const fechaInicial = req.query.fechaInicial;
    //         const fechaFinal = req.query.fechaFinal;
    //         let productoId = req.query.productoId;
    //         let empresaId = req.query.empresaId;
    //         let nombreParcial = req.query.nombreParcial;
    //         console.log(req.query);
    //         let query = `select *, documento.consecutivo_dian, documento.detalle_entrada from documento_detalle dd,documento
    //     where dd.documento_id=documento.documento_id
    //     and estado=1
    //     and documento.empresa_id= ${empresaId}`;
    //         if (fechaInicial != '') {
    //             query = query + " and dd.fecha_registro>= '" + fechaInicial + "'";
    //         }
    //         if (fechaFinal != '') {
    //             query = query + " and dd.fecha_registro <= '" + fechaFinal + "'";
    //         }
    //         if (nombreParcial != '') {
    //             query = query + " and LOWER(dd.descripcion) like LOWER('%" + nombreParcial + "%')";
    //         }
    //         if (productoId != '') {
    //             query = query + " and dd.producto_id =  " + productoId;
    //         }
    //         query = query + " order by dd.documento_detalle_id desc";
    //         console.log(query);
    //         const usuario = yield database_1.default.query(query);
    //         res.json(usuario.rows);
    //     });
    // }
    getKardex(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fechaInicial = req.query.fechaInicial;
            const fechaFinal = req.query.fechaFinal;
            let productoId = req.query.productoId;
            let proveedorId = req.query.proveedorId;
            let tipoDocumentoId = req.query.tipoDocumentoId;
            let empresaId = req.query.empresaId;
            let nombreParcial = req.query.nombreParcial;
            let grupoId = req.query.grupoId;
            let subgrupoId = req.query.subgrupoId;
            console.log(req.query);
            let query = `select *, documento.consecutivo_dian, documento.detalle_entrada`;
            // if (productoId != '') {
            //     query = query + `, p.grupo_id, p.sub_grupo_id from documento_detalle dd
            //     JOIN documento ON dd.documento_id=documento.documento_id
            //     INNER JOIN producto p ON dd.producto_id = p.producto_id and p.producto_id = ${productoId}`;
            //     if (grupoId != '') {
            //         query = query + " and p.grupo_id =  " + grupoId;
            //     }
            //     if (subgrupoId != '') {
            //         query = query + " and p.sub_grupo_id =  " + subgrupoId;
            //     }
            // } else {
                query = query + ` from documento_detalle dd
                JOIN documento ON dd.documento_id=documento.documento_id`;
            // }
            query = query + ` where dd.estado=1
            and documento.empresa_id= ${empresaId}`;
            if (fechaInicial != '') {
                query = query + " and dd.fecha_registro>= '" + fechaInicial + "'";
            }
            if (fechaFinal != '') {
                query = query + " and dd.fecha_registro <= '" + fechaFinal + "'";
            }
            if (nombreParcial != '') {
                query = query + " and LOWER(dd.descripcion) like LOWER('%" + nombreParcial + "%')";
            }
            if (productoId != '') {
                query = query + " and dd.producto_id =  " + productoId;
            }
            if (proveedorId != '') {
                query = query + " and dd.proveedor_id =  " + proveedorId;
            }
            if (tipoDocumentoId != '') {
                query = query + " and documento.tipo_documento_id =  " + tipoDocumentoId;
            }
            if (grupoId != '') {
                query = query + " and dd.grupo_id =  " + grupoId;
            }
            if (subgrupoId != '') {
                query = query + " and dd.sub_grupo_id =  " + subgrupoId;
            }
            query = query + " order by dd.documento_detalle_id desc";
            console.log(query);
            const usuario = yield database_1.default.query(query);
            res.json(usuario.rows);
        });
    }
}
exports.documentoDetalleControllers = new DocumentoDetalleControllers();
