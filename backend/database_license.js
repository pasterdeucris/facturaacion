"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const keys_1 = __importDefault(require("./keys"));
const pool = new pg_1.default.Client(keys_1.default.database_license); //conexion local
pool.connect().then(() => console.log("connected susccessfuly lisence"));
exports.default = pool;
