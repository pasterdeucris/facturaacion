"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apiControllers_1 = require("../controllers/apiControllers");
class ApiRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/sendMail', apiControllers_1.apiControllers.sendMail);
    }
}
const apiRoutes = new ApiRoutes();
exports.default = apiRoutes.router;
