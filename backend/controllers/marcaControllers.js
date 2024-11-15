"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.marcaControllers = void 0;
const database_1 = __importDefault(require("../database"));
const marcaRepository_1 = require("../repository/marcaRepository");
class MarcaControllers {
    getMarcas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const marcas = yield database_1.default.query(marcaRepository_1.marcaRepository.getMarcas);
            res.json(marcas.rows);
        });
    }
    getModeloByMarca(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const marcaId = req.query.marcaId;
            const productos = yield database_1.default.query(marcaRepository_1.marcaRepository.getModeloByMarca, [marcaId]);
            res.json(productos.rows);
        });
    }
    getModeloById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const modeloId = req.query.modeloId;
            const productos = yield database_1.default.query(marcaRepository_1.marcaRepository.getModeloById, [modeloId]);
            res.json(productos.rows);
        });
    }
}
exports.marcaControllers = new MarcaControllers();
