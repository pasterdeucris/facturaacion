"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClienteRepository {
    constructor() {
        this.getClientesByEmpresa = "select * from cliente where empresa_id = $1";
        this.getConfiguracionByEmpresa = "select * from configuracion where empresa_id = $1";
        this.getTipoPago = "select * from tipo_pago";
        this.getImpresorasEmpresa = "select * from impresora_empresa where empresa_id = $1 order by numero_impresora";
        this.getIdCliente = "select nextval('s_cliente')";
        this.getTipoIdentificacionAll = "select * from tipo_identificacion order by tipo_identificacion_id";
        this.getTipoEmpresa = "select * from fact_tipo_empresa order by nombre";
    }
}
exports.clienteRepository = new ClienteRepository();
