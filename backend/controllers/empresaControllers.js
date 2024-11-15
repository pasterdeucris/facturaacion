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
exports.empresaControllers = void 0;
const empresaRepository_1 = require("../repository/empresaRepository");
const database_1 = __importDefault(require("../database"));
class EmpresaControllers {
    pagosEmpresaByEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa_id = req.query.empresa_id;
            console.log(empresa_id);
            const usuario = yield database_1.default.query(empresaRepository_1.empresaRepository.pagosEmpresaByEmpresa, [empresa_id]);
            res.json(usuario.rows);
        });
    }
    getEmpresaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa_id = req.query.empresa_id;
            console.log(empresa_id);
            const usuario = yield database_1.default.query(empresaRepository_1.empresaRepository.getEmpresaById, [empresa_id]);
            res.json(usuario.rows);
        });
    }
    updateConsecutivoEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var consecutivo = req.body.consecutivo;
            var resolucion_empresa_id = req.body.resolucion_empresa_id;
            console.log(req.body);
            var query = "UPDATE RESOLUCION_EMPRESA SET  consecutivo=$1 WHERE resolucion_empresa_id = $2";
            yield database_1.default.query(query, [consecutivo, resolucion_empresa_id]).then(res2 => {
                res.json({ "code": 200, "resolucion_empresa_id": resolucion_empresa_id });
            }).catch(error => {
                console.error(res);
                res.json({ "code": 400, "resolucion_empresa_id": resolucion_empresa_id, "error": error });
            });
        });
    }
}
exports.empresaControllers = new EmpresaControllers();
