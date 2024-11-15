"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const coteroControllers_1 = require("../controllers/coteroControllers");
class CoteroRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.put('/saveCotero', coteroControllers_1.coteroControllers.saveCotero);
        this.router.post('/updateCotero', coteroControllers_1.coteroControllers.updateCotero);
        this.router.get('/getCoteros', coteroControllers_1.coteroControllers.getCoteros);
    }
}
const coteroRoutes = new CoteroRoutes();
exports.default = coteroRoutes.router;
