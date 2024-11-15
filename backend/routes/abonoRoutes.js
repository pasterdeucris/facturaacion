"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const abonoControllers_1 = require("../controllers/abonoControllers");
class AbonoRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/saveAbono', abonoControllers_1.abonoControllers.saveAbono);
        this.router.get('/getAbonosByDocumento', abonoControllers_1.abonoControllers.getAbonosByDocumento);
    }
}
const abonoRoutes = new AbonoRoutes();
exports.default = abonoRoutes.router;
