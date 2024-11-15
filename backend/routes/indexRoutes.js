"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const indexControlles_1 = require("../controllers/indexControlles");
class IndexRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/', indexControlles_1.indexControllers.index);
        this.router.get('/validarLisencia', indexControlles_1.indexControllers.validarLisencia);
    }
}
const indexRoutes = new IndexRoutes();
exports.default = indexRoutes.router;
