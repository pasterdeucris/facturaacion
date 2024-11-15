"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuentasContablesRepository = void 0;
class CuentasContablesRepository {
    constructor() {
        this.getIdAbono = "select nextval('s_abono')";
        this.getClasesContables = "select * from clase where empresa_id = $1";
        this.getGrupoByClase = "select * from grupo_contable where clase_id = $1 order by grupo_contable_id ";
        this.getCuentaByGrupo = "select * from cuenta where grupo_contable_id = $1 order by cuenta_id ";
        this.getSubCuentaByCuenta = "select * from sub_cuenta where cuenta_id = $1 order by sub_cuenta_id ";
        this.getAuxiliarBySubCuenta = "select * from auxiliar where sub_cuenta_id = $1 order by auxiliar_id desc ";
    }
}
exports.cuentasContablesRepository = new CuentasContablesRepository();
