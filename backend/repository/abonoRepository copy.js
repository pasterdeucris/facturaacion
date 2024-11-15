"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abonoRepository = void 0;
class AbonoRepository {
    constructor() {
        this.getIdAbono = "select nextval('s_abono')";
        this.getAbonosByDocumento = "select * from abono where documento_id = $1";
    }
}
exports.abonoRepository = new AbonoRepository();
