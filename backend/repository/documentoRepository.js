"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentoRepository = void 0;
class DocumentoRepository {
    constructor() {
        this.getIdDocumento = "select nextval('s_documento')";
        this.getIdDocumentoInvoice = "select nextval('s_DOCUMENTO_INVOICE')";
        this.getIdDocumentoNota = "select nextval('s_DOCUMENTO_NOTA')";
        this.getIdRetiroCaja = "select nextval('s_RETIRO_CAJA')";
        this.getOrdenesTrabajo = "";
        this.getFechaRegistro = "select fecha_registro from documento where documento_id = $1";
        this.getfechaNow = "select CURRENT_TIMESTAMP fecha_registro";
    }
}
exports.documentoRepository = new DocumentoRepository();
