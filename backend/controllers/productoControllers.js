
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
exports.productoControllers = void 0;
const productoRepository_1 = require("../repository/productoRepository");
const database_1 = __importDefault(require("../database"));
const documentoRepository_1 = require("../repository/documentoRepository");
class ProductoControllers {
    getProductosByEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            console.log(req.query);
            const productos = yield database_1.default.query(productoRepository_1.productoRepository.getProductosByEmpresa, [empresaId]);
            res.json(productos.rows);
        });
    }
    getProcedencias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("llega a");
            const procedencias = yield database_1.default.query(productoRepository_1.productoRepository.getProcedencias);
            res.json(procedencias.rows);
        });
    }
    getProductosByGrupo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const grupoId = req.query.grupoId;
            const subGrupoId = req.query.subGrupoId;
            const proveedorId = req.query.proveedorId;
            const agotado = req.query.agotado;
            const stock = req.query.stock;
            const estrella = req.query.estrella;
            console.log(req.query);
            let query = "";
            if (estrella == 'true') {
                query = query + `select nombre, grupo.cantidad, producto.costo_publico, producto.costo,
          producto.impuesto, producto.codigo_barras from producto,  (select producto_id, sum(cantidad) 
          cantidad from documento_detalle
         group by producto_id) grupo where grupo.producto_id = producto.producto_id
         order by grupo.cantidad desc`;
            }
            else {
                query = "select * from producto where empresa_id =  " + empresaId;
                if (grupoId != "") {
                    if (grupoId == '0') {
                        query = query + " and grupo_id is null ";
                    }
                    else {
                        query = query + " and grupo_id =" + grupoId;
                    }
                }
                if (subGrupoId != "") {
                    if (subGrupoId == '0') {
                        query = query + " and sub_grupo_id is null ";
                    }
                    else {
                        query = query + " and sub_grupo_id =" + subGrupoId;
                    }
                }
                if (proveedorId != "") {
                    query = query + " and proveedor_id =" + proveedorId;
                }
                if (agotado == 'true') {
                    query = query + " and stock_min >= cantidad";
                }
                if (stock == 'true') {
                    query = query + " and stock_min >= cantidad";
                }
                query = query + " and estado=1 order by nombre";
            }
            const productos = yield database_1.default.query(query);
            res.json(productos.rows);
        });
    }
    getGruposByEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const productos = yield database_1.default.query(productoRepository_1.productoRepository.getGruposByEmpresa, [empresaId]);
            res.json(productos.rows);
        });
    }
    getSubGruposByEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const productos = yield database_1.default.query(productoRepository_1.productoRepository.getSubGruposByEmpresa, [empresaId]);
            res.json(productos.rows);
        });
    }
    getProductoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const productoId = req.query.productoId;
            const productos = yield database_1.default.query(productoRepository_1.productoRepository.getProductoById, [empresaId, productoId]);
            res.json(productos.rows);
        });
    }
    getProductoByCodBarras(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId;
            const codBarras = req.query.codBarras;
            const productos = yield database_1.default.query(productoRepository_1.productoRepository.getProductoByCodBarras, [empresaId, codBarras]);
            res.json(productos.rows);
        });
    }
    getProductoByNombre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
    
            const empresaId = req.query.empresaId;
            const nombre = req.query.nombre;
    
            const palabrasClave = nombre.split(' ');
    
            // Condición para cuando la palabra es la primera en el nombre
            const primeraCondicion = `(
                CASE
                    WHEN LOWER(nombre) LIKE LOWER('${palabrasClave[0]}%') THEN 2
                    WHEN LOWER(nombre) LIKE LOWER('%${palabrasClave[0]}%') THEN 1
                    ELSE 0
                END
            )`;
    
            // Condiciones para las demás palabras clave
            const condicionesRestantes = palabrasClave.slice(1).map((clave) => {
                if (!isNaN(clave)) {
                    return `(
                        CASE
                            WHEN costo::text LIKE '${clave}%' THEN 1
                            WHEN costo_publico::text LIKE '${clave}%' THEN 1
                            ELSE 0
                        END
                    )`;
                } else {
                    return `(
                        CASE
                            WHEN LOWER(nombre) LIKE LOWER('%${clave}%') THEN 1
                            ELSE 0
                        END
                    )`;
                }
            });
    
            const recuentoCoincidenciasRestantes = condicionesRestantes.length > 0
                ? condicionesRestantes.join(' + ')
                : '0';
    
            const sql = `SELECT
                            *,
                            ${primeraCondicion} AS coincidencias_primera_palabra,
                            (${recuentoCoincidenciasRestantes}) AS coincidencias_restantes
                        FROM
                            producto
                        WHERE
                            empresa_id = ${empresaId}
                        AND estado = 1
                        ORDER BY
                            coincidencias_primera_palabra DESC,
                            coincidencias_restantes DESC
                        LIMIT 20`;
    
            console.log(sql);
    
            const productos = yield database_1.default.query(sql);
            res.json(productos.rows);
        });
    }
    
    
    getProductoPreciosById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productoId = req.query.productoId;
            console.log(req.query);
            const productos = yield database_1.default.query(productoRepository_1.productoRepository.getProductoPreciosById, [productoId]);
            res.json(productos.rows);
        });
    }
    getSubProductoByProductoId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productoId = req.query.productoId;
            console.log(req.query);
            const productos = yield database_1.default.query(productoRepository_1.productoRepository.getSubProductoByProductoId, [productoId]);
            res.json(productos.rows);
        });
    }
    inactivar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var producto_id = req.body.producto_id;
            let query = "update producto set estado=0 where producto_id = $1";
            yield database_1.default.query(query, [producto_id]).then(res2 => {
                res.json({ "code": 200, "producto_id": producto_id });
            }).catch(error => {
                res.json({ "code": 200, "producto_id": producto_id, "error:": error.error });
            });
        });
    }
    updateCantidad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var producto_id = req.body.producto_id;
            var cantidad = req.body.cantidad;
            let query = "update producto set cantidad=$1 where producto_id = $2";
            yield database_1.default.query(query, [cantidad, producto_id]).then(res2 => {
                res.json({ "code": 200, "producto_id": producto_id });
            }).catch(error => {
                console.error("updateCantidad");
                res.json({ "code": 200, "producto_id": producto_id, "error:": error.error });
            });
        });
    }
    updateGrupo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var grupo_id = req.body.grupo_id;
            var empresa_id = req.body.empresa_id;
            var nombre = req.body.nombre;
            let query = " update grupo set empresa_id=$2, nombre=$3 where grupo_id = $1 ";
            console.log(req.body);
            yield database_1.default.query(query, [grupo_id, empresa_id, nombre]).then(res2 => {
                res.json({ "code": 200, "grupo_id": grupo_id });
                console.log(req.body);
            }).catch(error => {
                console.error("updateGrupo");
                res.json({ "code": 200, "grupo_id": grupo_id, "error:": error.error });
                console.log(error);
            });
        });
    }
    updateSubGrupo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var grupo_id = req.body.sub_grupo_id;
            var empresa_id = req.body.empresa_id;
            var nombre = req.body.nombre;
            let query = " update sub_grupo set empresa_id=$2, nombre=$3 where sub_grupo_id = $1 ";
            console.log(req.body);
            yield database_1.default.query(query, [grupo_id, empresa_id, nombre]).then(res2 => {
                res.json({ "code": 200, "grupo_id": grupo_id });
                console.log(req.body);
            }).catch(error => {
                console.error("updateProductoPrecios");
                res.json({ "code": 200, "grupo_id": grupo_id, "error:": error.error });
                console.error(error);
            });
        });
    }
    updateProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var producto_id = req.body.producto_id;
            var grupo_id = req.body.grupo_id;
            var proveedor_id = req.body.proveedor_id;
            var marca_id = req.body.marca_id;
            var fecha_registro = req.body.fecha_registro;
            var costo = req.body.costo;
            var costo_publico = req.body.costo_publico;
            var codigo_interno = req.body.codigo_interno;
            var impuesto = req.body.impuesto;
            var stock_min = req.body.stock_min;
            var stock_max = req.body.stock_max;
            var codigo_barras = req.body.codigo_barras;
            var peso = req.body.peso;
            var balanza = req.body.balanza;
            var nombre = req.body.nombre;
            var cantidad = req.body.cantidad;
            var promo = req.body.promo;
            var pub_promo = req.body.pub_promo;
            var estado = req.body.estado;
            var kg_promo = req.body.kg_promo;
            var varios = req.body.varios;
            var utilidad_sugerida = req.body.utilidad_sugerida;
            var sub_producto = req.body.sub_producto;
            var fecha_vencimiento = req.body.fecha_vencimiento;
            var porcentaje_venta = req.body.porcentaje_venta;
            var sub_grupo_id = req.body.sub_grupo_id;
            var lote = req.body.lote;
            var cum = req.body.cum;
            var registro_sanitario = req.body.registro_sanitario;
            var laboratorio = req.body.laboratorio;
            let query = " update producto set grupo_id=$1, proveedor_id=$2, marca_id=$3, fecha_registro=$4,"
                + " costo=$5, costo_publico=$6, sub_producto=$7, impuesto=$8, stock_min=$9,"
                + " stock_max=$10, codigo_barras=$11, peso=$12, balanza=$13, nombre=$14, "
                + " cantidad=$15, promo=$16, pub_promo=$17, estado=$18, kg_promo=$19, "
                + " varios=$20, utilidad_sugerida=$21, fecha_vencimiento=$23, porcentaje_venta=$24, sub_grupo_id=$25, "
                + " lote=$26,cum=$27,registro_sanitario=$28, laboratorio=$29"
                + " where producto_id = $22";
            console.log(req.body);
            yield database_1.default.query(query, [grupo_id, proveedor_id, marca_id, fecha_registro, costo, costo_publico, sub_producto,
                impuesto, stock_min, stock_max, codigo_barras, peso, balanza, nombre, cantidad, promo, pub_promo, estado, kg_promo,
                varios, utilidad_sugerida, producto_id, fecha_vencimiento, porcentaje_venta, sub_grupo_id, lote, cum, registro_sanitario, laboratorio]).then(res2 => {
                res.json({ "code": 200, "producto_id": producto_id });
                console.log(req.body);
            }).catch(error => {
                console.error("updateProductoPrecios");
                res.json({ "code": 200, "producto_id": producto_id, "error:": error.error });
                console.error(error);
            });
        });
    }
    updateProductoPrecios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var producto_id = req.body.producto_id;
            var producto_precios_id = req.body.producto_precios_id;
            var precio_2 = req.body.precio_2;
            var precio_3 = req.body.precio_3;
            var precio_4 = req.body.precio_4;
            var precio_5 = req.body.precio_5;
            var precio_6 = req.body.precio_6;
            var precio_7 = req.body.precio_7;
            var precio_8 = req.body.precio_8;
            var precio_9 = req.body.precio_9;
            var precio_10 = req.body.precio_10;
            let query = " update producto_precios set producto_id=$2, precio_2=$3, precio_3=$4,"
                + " precio_4=$5, precio_5=$6, precio_6=$7, precio_7=$8, precio_8=$9,"
                + " precio_9=$10, precio_10=$11"
                + " where producto_precios_id = $1";
            console.log(req.body);
            yield database_1.default.query(query, [producto_precios_id, producto_id, precio_2, precio_3, precio_4, precio_5, precio_6, precio_7, precio_8, precio_9, precio_10]).then(res2 => {
                res.json({ "code": 200, "producto_precios_id": producto_precios_id });
            }).catch(error => {
                console.error("updateProductoPrecios");
                console.error(error);
                res.json({ "code": 400, "producto_id": producto_id });
            });
        });
    }
    deleteSubProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var sub_producto_id = req.body.sub_producto_id;
            console.log(req.body);
            yield database_1.default.query("delete from sub_producto where sub_producto_id=$1 ", [sub_producto_id]);
            console.log("subproducto borrado");
            res.json({ "code": 200, "sub_producto_id": sub_producto_id });
        });
    }
    saveProductoPrecios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var producto_id = req.body.producto_id;
            var precio_2 = req.body.precio_2;
            var precio_3 = req.body.precio_3;
            var precio_4 = req.body.precio_4;
            var precio_5 = req.body.precio_5;
            var precio_6 = req.body.precio_6;
            var precio_7 = req.body.precio_7;
            var precio_8 = req.body.precio_8;
            var precio_9 = req.body.precio_9;
            var precio_10 = req.body.precio_10;
            console.log(req.body);
            const id = yield database_1.default.query(productoRepository_1.productoRepository.getIdProductoPrecios);
            const producto_precios_id = id.rows[0].nextval;
            console.log(producto_precios_id);
            var query = "INSERT INTO producto_precios(producto_precios_id,producto_id,precio_2,precio_3,precio_4,precio_5,precio_6,precio_7,precio_8,precio_9,precio_10)"
                + " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)";
            yield database_1.default.query(query, [producto_precios_id, producto_id, precio_2, precio_3, precio_4, precio_5, precio_6, precio_7, precio_8, precio_9, precio_10]).then(res2 => {
                res.json({ "code": 200, "producto_precios_id": producto_precios_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "producto_id": producto_id });
            });
        });
    }
    saveProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var grupo_id = req.body.grupo_id;
            var empresa_id = req.body.empresa_id;
            var proveedor_id = req.body.proveedor_id;
            var marca_id = req.body.marca_id;
            var fecha_registro = req.body.fecha_registro;
            var costo = req.body.costo;
            var costo_publico = req.body.costo_publico;
            var codigo_interno = req.body.codigo_interno;
            var impuesto = req.body.impuesto;
            var stock_min = req.body.stock_min;
            var stock_max = req.body.stock_max;
            var codigo_barras = req.body.codigo_barras;
            var peso = req.body.peso;
            var balanza = req.body.balanza;
            var nombre = req.body.nombre;
            var cantidad = req.body.cantidad;
            var promo = req.body.promo;
            var pub_promo = req.body.pub_promo;
            var estado = req.body.estado;
            var kg_promo = req.body.kg_promo;
            var varios = req.body.varios;
            var utilidad_sugerida = req.body.utilidad_sugerida;
            var sub_producto = req.body.sub_producto;
            var fecha_vencimiento = req.body.fecha_vencimiento;
            var porcentaje_venta = req.body.porcentaje_venta;
            var sub_grupo_id = req.body.sub_grupo_id;
            var lote = req.body.lote;
            var cum = req.body.cum;
            var registro_sanitario = req.body.registro_sanitario;
            var laboratorio = req.body.laboratorio;
            console.log(req.body);
            const id = yield database_1.default.query(productoRepository_1.productoRepository.getIdProducto);
            const producto_id = id.rows[0].nextval;
            console.log(producto_id);
            var query = "INSERT INTO producto(producto_id,grupo_id,proveedor_id,marca_id,fecha_registro,costo,costo_publico," +
                "sub_producto,impuesto,stock_min,stock_max,codigo_barras,peso,balanza,nombre,cantidad,promo,pub_promo,estado," +
                "kg_promo,varios,utilidad_sugerida,empresa_id,fecha_vencimiento,porcentaje_venta,sub_grupo_id,lote,cum,registro_sanitario,laboratorio)"
                + " VALUES ($23,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$24,$25,$26,$27,$28,$29,$30)";
            yield database_1.default.query(query, [grupo_id, proveedor_id, marca_id, fecha_registro, costo, costo_publico, sub_producto,
                impuesto, stock_min, stock_max, codigo_barras, peso, balanza, nombre, cantidad, promo, pub_promo, estado, kg_promo,
                varios, utilidad_sugerida, empresa_id, producto_id, fecha_vencimiento, porcentaje_venta, sub_grupo_id, lote, cum,
                registro_sanitario, laboratorio]).then(res2 => {
                res.json({ "code": 200, "producto_id": producto_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "producto_id": producto_id });
            });
        });
    }
    saveSubProducto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var producto_padre = req.body.producto_padre;
            var producto_hijo = req.body.producto_hijo;
            var cantidad = req.body.cantidad;
            var estado = req.body.estado;
            var pesado = req.body.pesado;
            console.log(req.body);
            const id = yield database_1.default.query(productoRepository_1.productoRepository.getIdSubProducto);
            const sub_producto_id = id.rows[0].nextval;
            console.log(sub_producto_id);
            var query = "INSERT INTO sub_producto(sub_producto_id, producto_padre, producto_hijo,cantidad,estado,pesado)"
                + " VALUES ($1,$2,$3,$4,$5,$6)";
            yield database_1.default.query(query, [sub_producto_id, producto_padre, producto_hijo, cantidad, estado, pesado]).then(res2 => {
                res.json({ "code": 200, "sub_producto_id": sub_producto_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "sub_producto_id": sub_producto_id });
            });
        });
    }
    saveGrupo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var empresa_id = req.body.empresa_id;
            var nombre = req.body.nombre;
            console.log(req.body);
            const id = yield database_1.default.query(productoRepository_1.productoRepository.getIdGrupo);
            const grupo_id = id.rows[0].nextval;
            console.log(grupo_id);
            var query = "INSERT INTO grupo(grupo_id,empresa_id,nombre)"
                + " VALUES ($1,$2,$3)";
            yield database_1.default.query(query, [grupo_id, empresa_id, nombre]).then(res2 => {
                res.json({ "code": 200, "grupo_id": grupo_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "grupo_id": grupo_id });
            });
        });
    }
    saveSubGrupo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var empresa_id = req.body.empresa_id;
            var nombre = req.body.nombre;
            console.log(req.body);
            const id = yield database_1.default.query(productoRepository_1.productoRepository.getIdGrupo);
            const grupo_id = id.rows[0].nextval;
            console.log(grupo_id);
            var query = "INSERT INTO sub_grupo (sub_grupo_id,empresa_id,nombre)"
                + " VALUES ($1,$2,$3)";
            yield database_1.default.query(query, [grupo_id, empresa_id, nombre]).then(res2 => {
                res.json({ "code": 200, "sub_grupo_id": grupo_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "sub_grupo_id": grupo_id });
            });
        });
    }
    saveAuditoria(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var empresa_id = req.body.empresa_id;
            var accion_auditoria_id = req.body.accion_auditoria_id;
            var usuario_id = req.body.usuario_id;
            var valor_anterior = req.body.valor_anterior;
            var valor_actual = req.body.valor_actual;
            var aplicativo = req.body.aplicativo;
            var observacion = req.body.observacion;
            var tipo_documento_id = req.body.tipo_documento_id;
            const fecha = yield database_1.default.query(documentoRepository_1.documentoRepository.getfechaNow);
            var fecha_registro = fecha.rows[0].fecha_registro;
            console.log(req.body);
            const id = yield database_1.default.query(productoRepository_1.productoRepository.getIdAuditoria);
            const auditoria_id = id.rows[0].nextval;
            console.log(auditoria_id);
            var query = "INSERT INTO auditoria (auditoria_id,accion_auditoria_id,empresa_id,usuario_id,valor_anterior,valor_actual,aplicativo,observacion,fecha_registro, tipo_documento_id)"
                + " VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)";
            yield database_1.default.query(query, [auditoria_id, accion_auditoria_id, empresa_id, usuario_id, valor_anterior, valor_actual, aplicativo, observacion, fecha_registro, tipo_documento_id]).then(res2 => {
                res.json({ "code": 200, "auditoria_id": auditoria_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "auditoria_id": auditoria_id });
            });
        });
    }

    getAuditorias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fechaInicial = req.query.desde;
            const fechaFinal = req.query.hasta;
            let accion_auditoria_id = req.query.accion_auditoria_id;
            let usuario_id = req.query.usuario_id;
            console.log(req.query);
            let query = "SELECT auditoria.*, usuario.nombre AS nombre_usuario, usuario.apellido AS apellido_usuario, empresa.nombre AS nombre_empresa FROM auditoria ";
            query += "INNER JOIN usuario ON auditoria.usuario_id = usuario.usuario_id ";
            query += "INNER JOIN empresa ON auditoria.empresa_id = empresa.empresa_id ";
    
            if (fechaInicial != "") {
                query = query + " AND DATE(auditoria.fecha_registro) >= '" + fechaInicial + "'";
            }
            if (fechaFinal != "") {
                query = query + " AND DATE(auditoria.fecha_registro) <= '" + fechaFinal + "'";
            }
    
            if (accion_auditoria_id != '' || accion_auditoria_id) {
                query += " AND auditoria.accion_auditoria_id = '" + accion_auditoria_id + "'";
            }
    
            if (usuario_id != '' || usuario_id) {
                query += " AND auditoria.usuario_id = '" + usuario_id + "'";
            }
    
            query = query + " ORDER BY auditoria.fecha_registro DESC";
            console.log(query);
            const auditoria = yield database_1.default.query(query);
            res.json(auditoria.rows);
        });
    }
    
}
exports.productoControllers = new ProductoControllers();
