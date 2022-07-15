"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
class User {
}
User.add = (url, data, result) => {
    db_1.default.query(`INSERT INTO storage (url, data) VALUES ('${url}', '${data}')`, (err) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        console.log('Add data: ', { url: data });
        result(null, { url: data });
    });
};
User.findByUrl = (url, result) => {
    db_1.default.query(`SELECT data FROM storage WHERE url = '${url}'`, (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log('Found data: ', res[0].data);
            result(null, res[0].data);
            return;
        }
        result({ kind: 'Not_found' }, null);
    });
};
exports.default = User;
