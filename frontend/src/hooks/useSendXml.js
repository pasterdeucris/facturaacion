import { useState } from "react";
import dayjs from "dayjs";

import { getDocumentsForInvoice } from '../api/invoices';
import { tipo_identificacion, tipo_pagos } from "../utils/constants";

export const useSendXml = (  ) => {

    const [documentosFacturacionElectronica, setDocumentosFacturacionElectronica] = useState([]);

    const getFacturacionElectronica = async () => {
		try {
			const response = await getDocumentsForInvoice(dateInit, dateEnd, consecutivoDian, document);
			setDocumentosFacturacionElectronica( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las ordenes por facturación electronica.');
		}
	}

    const getDocumentoDetalle = async (doc) => {
		let collection = [];

		try {
            const response = await getDocumentoDetalleAPI(doc);

            response.forEach( element => {
                collection.push( element );
            });
			setCurrentDocuments( collection );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las ordenes por facturación electronica.');
		}
	}

    const setXML = async(find, business, currentProducts, cl, resolution, paymentType) => {

        const totalNoIva = await getTotalNoIva(currentProducts);
        const totalOnlyIva = await getTotalOnlyIva(currentProducts);
        
        const { tax_totals, ites } = manageProductsXml(currentProducts);

        const enc1 = find.tipo_documento_id == 10 ? "1" : 
            find.tipo_documento_id == 12 ? "4" : 
            find.tipo_documento_id == 13 ? "5": 
            'N/A'

        const tipoPersona = cl?.fact_tipo_empresa_id === 1 ? 'Jurídico' : 'Natural';
        const codeIdentification = tipo_identificacion.find(val => val.id === cl.tipo_identificacion_id);

        const payment = tipo_pagos.find(item => item.id == paymentType)?.id_latam;
        const paymentForm = payment != 2 ? "1" : "2";
        
        const bJSON = {
            "number": find?.consecutivo_dian,
            "prefix": enc1 === 1 ? `${resolution?.letra_consecutivo}` : `${find?.letra_consecutivo}`,
            "type_document_id": enc1,
            "date": dayjs().format('YYYY-MM-DD'),
            "time": dayjs().format('HH:mm:ss'),
            "resolution_number": `${resolution?.resolucion_dian}`,
            "establishment_name": `${business?.nombre}`,
            "establishment_address": `${business?.direccion}`,
            "sendmail": true,
            "customer": {
                "identification_number": Number(cl.documento),
                "dv": cl.digito_verificacion ? `${cl.digito_verificacion}` : "",
                "name": `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
                "phone": `${cl.celular}`,
                "address": `${cl.direccion}`,
                "email": `${cl.mail}`,
                "merchant_registration": cl.tipo_identificacion_id !== 6 ? `0000-00` : `${cl.documento}-${cl.digito_verificacion}`,
                "type_document_identification_id": cl.tipo_identificacion_id,
                "type_organization_id": Number(cl.fact_tipo_empresa_id),
                // "type_liability_id": 117,
                "municipality_id": Number(cl.ciudad_id),
                "type_regime_id": Number(cl.fact_tipo_empresa_id),
            },
            "payment_form": {
                "duration_measure": "30",
                "payment_form_id": paymentForm,
                "payment_method_id": `${payment}`,
                "payment_due_date": dayjs().add(30, 'day').format('YYYY-MM-DD')
            },
            ...(Number(find.descuento > 0) && { "allowance_charges": [
                {
                    "discount_id": 10,
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": find.descuento,
                    "base_amount": (parseFloat(totalNoIva) + parseFloat(totalOnlyIva)).toFixed(2) //total sobre el que se hace el descuento (Puse TOT_7)
                }
            ]}),
            "legal_monetary_totals": {
                "line_extension_amount": totalNoIva.toFixed(2),
                "tax_exclusive_amount": totalNoIva.toFixed(2),
                "tax_inclusive_amount": (parseFloat(totalNoIva) + parseFloat(totalOnlyIva)).toFixed(2),
                "allowance_total_amount": find.descuento,
                "payable_amount": (parseFloat(totalNoIva) + parseFloat(totalOnlyIva) - parseFloat(find.descuento)).toFixed(2)
            },
            "tax_totals": tax_totals,
            "invoice_lines": ites
        }

        return bJSON
    }

    const setCreditNote = async(find, business, currentProducts, cl, resolution) => {

        const totalNoIva = await getTotalNoIva(currentProducts);
        const totalOnlyIva = await getTotalOnlyIva(currentProducts);
        
        const { tax_totals, ites } = manageProductsXml(currentProducts);

        const enc1 = find.tipo_documento_id == 10 ? "1" : 
            find.tipo_documento_id == 12 ? "4" : 
            find.tipo_documento_id == 13 ? "5": 
            'N/A'
        
        const bJSON = {
            "billing_reference": {
                "number": `${resolution?.letra_consecutivo}` + find?.consecutivo_dian,
                "uuid": find?.cufe,
                "issue_date": dayjs().format('YYYY-MM-DD')
            },
            "discrepancyresponsecode": 2,
            "resolution_number": `${resolution?.resolucion_dian}`,
            "prefix": "NC",
            "number": `${find?.consecutivo_dian}`,
            "type_document_id": enc1,
            "date": dayjs().format('YYYY-MM-DD'),
            "time": dayjs().format('HH:mm:ss'),
            "establishment_name": `${business?.nombre}`,
            "establishment_address": `${business?.direccion}`,
            "sendmail": true,
            "customer": {
                "identification_number": Number(cl.documento),
                "dv": cl.digito_verificacion ? `${cl.digito_verificacion}` : "",
                "name": `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
                "phone": `${cl.celular}`,
                "address": `${cl.direccion}`,
                "email": `${cl.mail}`,
                "merchant_registration": cl.tipo_identificacion_id !== 6 ? `0000-00` : `${cl.documento}-${cl.digito_verificacion}`,
                "type_document_identification_id": cl.tipo_identificacion_id,
                "type_organization_id": Number(cl.fact_tipo_empresa_id),
                // "type_liability_id": 117,
                "municipality_id": Number(cl.ciudad_id),
                "type_regime_id": Number(cl.fact_tipo_empresa_id),
            },
            "legal_monetary_totals": {
                "line_extension_amount": totalNoIva.toFixed(2),
                "tax_exclusive_amount": totalNoIva.toFixed(2),
                "tax_inclusive_amount": (parseFloat(totalNoIva) + parseFloat(totalOnlyIva)).toFixed(2),
                "allowance_total_amount": find.descuento,
                "payable_amount": (parseFloat(totalNoIva) + parseFloat(totalOnlyIva) - parseFloat(find.descuento)).toFixed(2)
            },
            "tax_totals": tax_totals,
            "credit_note_lines": ites
        }

        return bJSON
    }

    const setPosXML = async(find, business, currentProducts, cl, resolution) => {

        const totalNoIva = await getTotalNoIva(currentProducts);
        const totalOnlyIva = await getTotalOnlyIva(currentProducts);
        
        const { tax_totals, ites } = manageProductsXml(currentProducts);

        const enc1 = find.tipo_documento_id == 10 ? "1" : 
            find.tipo_documento_id == 12 ? "4" : 
            find.tipo_documento_id == 13 ? "5": 
            'N/A'

        // const tipoPersona = cl.fact_tipo_empresa_id === 1 ? 'Jurídico' : 'Natural';
        // const codeIdentification = tipo_identificacion.find(val => val.id === cl.tipo_identificacion_id);
        
        const bJSON = {
            "number": find?.consecutivo_dian,
            "prefix": enc1 === 1 ? `${resolution?.letra_consecutivo}` : `${find?.letra_consecutivo}`,
            "type_document_id": enc1,
            "date": dayjs().format('YYYY-MM-DD'),
            "time": dayjs().format('HH:mm:ss'),
            "resolution_number": `${resolution?.resolucion_dian}`,
            "establishment_name": `${business?.nombre}`,
            "establishment_address": `${business?.direccion}`,
            "sendmail": true,
            "buyer_benefits":{
                "code": `${cl.documento}`,
                "name": `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
                "points": "0"
            },
            "cash_information":{
                "plate_number": "DF-000-12345", //mac
                "location": `${business?.nombre}`,//location_caja
                "cashier": "JACK TORRANCE", //Nombre usuario cajero
                "cash_type": "CAJA PRINCIPAL", //Nombre de la caja
                "sales_code": `${find?.letra_consecutivo}${find?.consecutivo_dian}`, //
                "subtotal": (parseFloat(totalNoIva) + parseFloat(totalOnlyIva) - parseFloat(find.descuento)).toFixed(2)
            },
            "customer": {
                "identification_number": Number(cl.documento),
                "dv": cl.digito_verificacion ? `${cl.digito_verificacion}` : "",
                "name": `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
                "phone": `${cl.celular}`,
                "address": `${cl.direccion}`,
                "email": `${cl.mail}`,
                "merchant_registration": cl.tipo_identificacion_id !== 6 ? `0000-00` : `${cl.documento}-${cl.digito_verificacion}`,
                "type_document_identification_id": cl.tipo_identificacion_id,
                "type_organization_id": Number(cl.fact_tipo_empresa_id),
                // "type_liability_id": 117,
                "municipality_id": Number(cl.ciudad_id),
                "type_regime_id": Number(cl.fact_tipo_empresa_id),
            },
            "payment_form": {
                "duration_measure": "30",
                "payment_form_id": "1",
                "payment_method_id": "10",
                "payment_due_date": dayjs().add(30, 'day').format('YYYY-MM-DD')
            },
            ...(Number(find.descuento > 0) && { "allowance_charges": [
                {
                    "discount_id": 10,
                    "charge_indicator": false,
                    "allowance_charge_reason": "DESCUENTO GENERAL",
                    "amount": find.descuento,
                    "base_amount": (parseFloat(totalNoIva) + parseFloat(totalOnlyIva)).toFixed(2) //total sobre el que se hace el descuento (Puse TOT_7)
                }
            ]}),
            "legal_monetary_totals": {
                "line_extension_amount": totalNoIva.toFixed(2),
                "tax_exclusive_amount": totalNoIva.toFixed(2),
                "tax_inclusive_amount": (parseFloat(totalNoIva) + parseFloat(totalOnlyIva)).toFixed(2),
                "allowance_total_amount": find.descuento,
                "payable_amount": (parseFloat(totalNoIva) + parseFloat(totalOnlyIva) - parseFloat(find.descuento)).toFixed(2)
            },
            "tax_totals": tax_totals,
            "invoice_lines": ites
        }

        return bJSON
    }

    const getTotalNoIva = async(currentProducts) => {
        let totalNoIva = 0;

        currentProducts.forEach( el => {

            const result = parseFloat(el.parcial) 
                / (Number(el.impuesto_producto) == '19' ? 1.19 : 
                Number(el.impuesto_producto) == '5' ? 1.05 : 1);
            
            totalNoIva += parseFloat(result);
        });

        return totalNoIva;
    }

    const getTotalOnlyIva = async(currentProducts) => {
        let totalOnlyIva = 0;

        currentProducts.forEach( el => {
            const discount = parseFloat(el.unitario) * Number(el.impuesto_producto) / 100;//Descuento o cantidad que se reduce del precio actual.
            
            const result = parseFloat(el.parcial)
                / Number((el.impuesto_producto == '19') ? 1.19 : 
                Number(el.impuesto_producto == '5') ? 1.05 : 1);

                
            totalOnlyIva += parseFloat(el.parcial) - Number(result);
        });

        return totalOnlyIva;
    }

    const manageProductsXml = (currentProducts) => {
        let ites = [];
        const inititalTims = {
            impuesto19: {
                total: 0,
                totalImpuesto: 0,
                totalIVA: 0,
                percentage: 19
            },
            impuesto5: {
                total: 0,
                totalImpuesto: 0,
                totalIVA: 0,
                percentage: 5
            },
            impuesto0: {
                total: 0,
                totalImpuesto: 0,
                totalIVA: 0,
                percentage: 0
            }
        };
        let idx  = 1;
        for (const cp of currentProducts) {
            const iva = Number(cp.impuesto_producto) == 19 ? 1.19 :
                Number(cp.impuesto_producto) == 5 ? 1.05 : 1;

            const result = parseFloat(cp.parcial) / (cp.impuesto_producto == '19' ? 1.19 : cp.impuesto_producto == '5' ? 1.05 : 1);
            const result2 = cp.impuesto_producto == '19' ? 19 : cp.impuesto_producto == '5' ? 5 : 1;
            
            if (cp.impuesto_producto == '19') {
                inititalTims.impuesto19.total += parseFloat(cp.parcial);
                inititalTims.impuesto19.totalImpuesto += parseFloat(result);
                inititalTims.impuesto19.totalIVA += Number(result) * Number(result2) / 100;
            } else if (cp.impuesto_producto == '5') {
                inititalTims.impuesto5.total += parseFloat(cp.parcial);
                inititalTims.impuesto5.totalImpuesto += parseFloat(result);
                inititalTims.impuesto5.totalIVA += Number(result) * Number(result2) / 100;
            } else {
                inititalTims.impuesto0.total += parseFloat(cp.parcial);
                inititalTims.impuesto0.totalImpuesto += parseFloat(result);
                inititalTims.impuesto0.totalIVA += 0;
            }

            const priceBeforeIva = cp.parcial / iva;
            const priceUnitBeforeIva = parseFloat(cp.unitario) / iva;
            const ivaTotal = parseFloat(cp.parcial) - Number(priceBeforeIva);

            ites.push({
                "unit_measure_id": 70,
                "invoiced_quantity": Number(cp.cantidad),
                "line_extension_amount": Number(parseFloat(priceBeforeIva)).toFixed(2),
                "free_of_charge_indicator": false,
                "tax_totals": [
                    {
                        "tax_id": 1,
                        "tax_amount": Number(ivaTotal).toFixed(2),
                        "taxable_amount": Number(parseFloat(priceBeforeIva)).toFixed(2),
                        "percent": `${Number(cp.impuesto_producto).toFixed(2)}`
                    }
                ],
                "description": `${cp.descripcion}`,
                "code": `${cp.producto_id}`,
                "type_item_identification_id": 4,
                "price_amount": Number(parseFloat(priceBeforeIva) + parseFloat(ivaTotal)).toFixed(2),
                "base_quantity": 1
            });

            idx++;
        }

        let tax_totals = [];

        for (const ivaNumber in inititalTims) {
            if (inititalTims[ivaNumber].total !== 0) {
                let tax = {
                    "tax_id": 1,
                    "tax_amount": Number(inititalTims[ivaNumber].totalIVA).toFixed(2),
                    "percent": Number(inititalTims[ivaNumber].percentage),
                    "taxable_amount": Number(inititalTims[ivaNumber].totalImpuesto).toFixed(2)//Acá tomará el impuesto 19 y el 5
                }
                tax_totals.push(tax);
            }
        }

        return { tax_totals, ites }
    }

    return [ setXML, setCreditNote ]

}