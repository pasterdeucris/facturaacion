"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empleadoRepository = void 0;
class EmpleadoRepository {
    constructor() {
        this.getEmpleadoByAll = "select * from empleado  where empresa_id = $1";
        this.getIdEmpleado = "select nextval('s_empleado')";
        this.getIdProductoEmpleado = "select nextval('s_producto_empleado')";
        this.getPagosEmpleadosAll = "select * from pago_empleado  order by nombre";
    }
}
exports.empleadoRepository = new EmpleadoRepository();
