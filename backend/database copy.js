"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const keys_1 = __importDefault(require("./keys"));
//const pool=new pg.Client(keys.database_avenidagp); //conexcion nube 
const pool = new pg_1.default.Client(keys_1.default.database_local); //conexion local
pool.connect().then(() => console.log("connected susccessfuly"));
exports.default = pool;
