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
exports.apiControllers = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class ApiControllers {
    sendMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req.body);
            let html = req.body.html;
            let email = req.body.emailCliente;
            let xml_64 = req.body.xml_64;
            let xml_name = req.body.xml_name;
            let pdf_name = req.body.pdf_name;
            let pdf_64 = req.body.pdf_64;
            pdf_64 = pdf_64.replace("data:application/pdf;filename=generated.pdf;base64,", "");
            //console.log(pdf_64);
            let transporter = nodemailer_1.default.createTransport({
                host: "mail.effectivesoftware.com.co",
                pool: true,
                port: 465,
                secure: true,
                auth: {
                    user: 'facturacion_electronica@effectivesoftware.com.co',
                    pass: 'Luismg88121234'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            let ruta = __dirname.replace("\controllers", "public\\images\\");
            //html = html + `<b/><img src="${ruta + 'logo.png'}" height="42" width="42">`
            //html = html + `<b/><img src="${ruta + 'nice.jpeg'}" height="42" width="42">`
            //console.log(html);
            yield transporter.sendMail({
                from: '"Facturacion Effective" <facturacion_electronica@effectivesoftware.com.co>',
                to: email,
                subject: "Factura Electrónica Effective",
                html: html,
                attachments: [
                    /*{
                      filename: 'logo.png',
                      path: ruta + 'logo.png',
                      cid: 'logo.png'
                    },
                    {
                      filename: 'nice.jpeg',
                      path: ruta + 'nice.jpeg',
                      cid: 'nice.png'
                    },*/
                    {
                        filename: xml_name,
                        content: xml_64,
                        encoding: 'base64'
                    },
                    {
                        filename: pdf_name,
                        content: pdf_64,
                        encoding: 'base64'
                    }
                ]
            }, function (err, info) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(info);
                }
            });
            res.json({ "code": 200, "messaje": "info.messajeId" });
        });
    }
}
exports.apiControllers = new ApiControllers();
