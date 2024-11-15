"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coteroRepository = void 0;
class CoteroRepository {
    constructor() {
        this.getIdCotero = "select nextval('s_cotero')";
        this.getCoterosAll = "select * from cotero";
    }
}
exports.coteroRepository = new CoteroRepository();
