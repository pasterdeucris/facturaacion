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
exports.coteroControllers = void 0;
const coteroRepository_1 = require("../repository/coteroRepository");
const database_1 = __importDefault(require("../database"));
class CoteroControllers {
    saveCotero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nombre = req.body.nombre;
            let peso = req.body.peso;
            let estado = req.body.estado;
            console.log(req.body);
            const id = yield database_1.default.query(coteroRepository_1.coteroRepository.getIdCotero);
            const cotero_id = id.rows[0].nextval;
            console.log(cotero_id);
            var query = "INSERT INTO cotero(cotero_id,nombre, peso, estado) VALUES ($1,$2,$3,$4)";
            yield database_1.default.query(query, [cotero_id, nombre, peso, estado]).then(res2 => {
                res.json({ "code": 200, "cotero_id": cotero_id });
            }).catch(error => {
                console.error(error);
                res.json({ "code": 400, "cotero_id": cotero_id });
            });
        });
    }
    updateCotero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let nombre = req.body.nombre;
            let peso = req.body.peso;
            let estado = req.body.estado;
            let cotero_id = req.body.cotero_id;
            console.log(req.body);
            var query = "UPDATE cotero SET  nombre=$1, peso= $2, estado=$3 WHERE cotero_id = $4";
            yield database_1.default.query(query, [nombre, peso, estado, cotero_id]).then(res2 => {
                res.json({ "code": 200, "cotero_id": cotero_id });
            }).catch(error => {
                console.error("error actualizando documento detalle");
                console.error(error);
                res.json({ "code": 400, "cotero_id": cotero_id, "error": error.error });
            });
        });
    }
    getCoteros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresaId = req.query.empresaId; //este parametro no se esta usando pero tiene que hacerse
            const coteros = yield database_1.default.query(coteroRepository_1.coteroRepository.getCoterosAll);
            res.json(coteros.rows);
        });
    }
}
exports.coteroControllers = new CoteroControllers();
