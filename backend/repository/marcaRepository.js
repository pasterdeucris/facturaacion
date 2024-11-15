"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marcaRepository = void 0;
class MarcaRepository {
    constructor() {
        this.getMarcas = "select * from marca_vehiculo order by nombre";
        this.getModeloByMarca = "select * from modelo_marca where marca_vehiculo_id = $1 order by nombre";
        this.getModeloById = "select * from modelo_marca where modelo_marca_id = $1 ";
    }
}
exports.marcaRepository = new MarcaRepository();
