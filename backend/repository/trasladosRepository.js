"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trasladosRepository = void 0;
class TrasladosRepository {
    constructor() {
        this.getIdRequerimiento = "select nextval('s_requerimiento')";
        this.getIdTraslado = "select nextval('s_traslado')";
        this.getIdRequerimientoDetalle = "select nextval('s_requerimiento_detalle')";
        this.deleteRequerimientoDetalle = "delete from requerimiento_detalle where requerimiento_id =$1";
        this.deleteTrasladoDetalle = "delete from traslado_detalle where traslado_id =$1";
    }
}
exports.trasladosRepository = new TrasladosRepository();
