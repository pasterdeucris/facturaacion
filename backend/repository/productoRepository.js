"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoRepository = void 0;
class ProductoRepository {
    constructor() {
        this.getProcedencias = "select * from procedencia_producto ";
        this.getProductosByEmpresa = "select * from producto where empresa_id = $1 and estado=1 order by nombre";
        this.getControlInventario = "select * from control_inventario where empresa_id = $1 order by nombre ";
        this.getControlInventarioByProductoId = "select * from control_inventario where producto_id = $1 order by nombre ";
        this.getProductosByGrupo = "";
        this.getGruposByEmpresa = "select * from grupo where empresa_id = $1 order by nombre";
        this.getSubGruposByEmpresa = "select * from sub_grupo where empresa_id = $1 order by nombre";
        this.getProductoById = "select * from producto where empresa_id = $1 and producto_id = $2 and estado=1";
        this.getProductoByCodBarras = "select * from producto where empresa_id = $1 and codigo_barras = $2 and estado=1";
        this.getProductoByNombre = "select * from producto where empresa_id = $1 and lower(nombre) like  lower('%$2%') and estado=1";
        this.getProductoPreciosById = "select * from producto_precios where  producto_id = $1";
        this.getSubProductoByProductoId = "select * from sub_producto where  producto_padre = $1";
        this.getIdProducto = "select nextval('s_producto')";
        this.getIdProductoPrecios = "select nextval('s_producto_precios')";
        this.getIdControlInventario = "select nextval('s_control_inventario')";
        this.getIdGrupo = "select nextval('s_grupo')";
        this.getIdSubProducto = "select nextval('s_sub_producto')";
        this.getIdAuditoria = "select nextval('s_auditoria')";
    }
}
exports.productoRepository = new ProductoRepository();
