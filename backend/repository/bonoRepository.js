"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bonoRepository = void 0;
class BonoRepository {
    constructor() {
        this.getIdBono = "select nextval('s_bono')";
        this.getTiposBono = "select * from tipo_bono";
        this.getBonoById = "select * from bono where bono_id= $1";
    }
}
exports.bonoRepository = new BonoRepository();
