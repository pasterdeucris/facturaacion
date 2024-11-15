"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentoDetalleRepository = void 0;
class DocumentoDetalleRepository {
    constructor() {
        this.getIdDocumentoDetalle = "select nextval('s_documento_detalle')";
        this.getDocumentoDetalleByDocumento = "select * from DOCUMENTO_DETALLE where estado=$2 and documento_id = $1"; 
        this.getfechaNow = "select CURRENT_TIMESTAMP fecha_registro";
        this.getFechaRegistro = "select fecha_registro from documento_detalle where documento_detalle_id = $1";
    }
}
exports.documentoDetalleRepository = new DocumentoDetalleRepository();
