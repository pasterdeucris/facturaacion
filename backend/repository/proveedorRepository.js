"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proveedorRepository = void 0;
class ProveedorRepository {
    constructor() {
        this.getProveedorByEmpresa = "select * from proveedor where empresa_id = $1";
        this.getIdProveedor = "select nextval('s_proveedor')";
    }
}
exports.proveedorRepository = new ProveedorRepository();
