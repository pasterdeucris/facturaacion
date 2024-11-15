import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

import useAuth from '../../hooks/useAuth';
import { getDocumentsTypeApi, getDocumentoDetalleAPI , updateDocumentoApi} from '../../api/document';
import { getClientsApi } from '../../api/client';
import { getDocumentsForInvoice } from '../../api/invoices';
import { sendSoapXML, documentStatus, getCUFE, getCUFEQR } from '../../api/soap';
import { getBusinessApi } from '../../api/business';
import { getResolutionByBusinessApi } from '../../api/sales';
import { ciudades, departamentos, vEnv } from '../../utils/info';
import { getUsersApi } from '../../api/user';

import AdminLayout from "../../layouts/AdminLayout";
import ListDocumentSendComponent from '../../components/DocumentSendComponent/ListComponent';
import { ISPROD, TYPE_BUSINESS } from '../../utils/constants';

function envioDocumentos() {

	const logged = useAuth();
	const [dateInit, setDateInit] = useState("");
	const [dateEnd, setDateEnd] = useState("");
	const [consecutivoDian, setConsecutivoDian] = useState("");
	const [document, setDocument] = useState("");
	const [documentosFacturacionElectronica, setDocumentosFacturacionElectronica] = useState([]);
	const [clientsData, setClientsData] = useState([]);
	const [cajeros, setCajeros] = useState([]);
	const [resolutionsData, setResolutionsData] = useState([]);
	const [businessData, setBusinessData] = useState([]);
	const [documentsTypeData, setDocumentsTypeData] = useState([]);
	const [checkboxDocuments, setCheckboxDocuments] = useState([]);
	const [currentDocuments, setCurrentDocuments] = useState([]);
	const [currentJSON, setCurrentJSON] = useState([]);
	const [loadingSendDocument, setLoadingSendDocument] = useState(false);

	const getFacturacionElectronica = async () => {
		try {
			const response = await getDocumentsForInvoice(dateInit, dateEnd, consecutivoDian, document);
			setDocumentosFacturacionElectronica( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las ordenes por facturación electronica.');
		}
	}

	const getDocumentoDetalle = async (documentsCheckbox) => {
		let collection = [];

		try {
			for (const doc of documentsCheckbox) {
				const response = await getDocumentoDetalleAPI(doc);
				// collection.push(response);
				// collection.push(response.map( element => element  ));
				response.forEach( element => {
					collection.push( element );
				});
			}
			setCurrentDocuments( collection );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las ordenes por facturación electronica.');
		}
	}

	const getClientes = async (businessID) => {
		try {
			const response = await getClientsApi(businessID);
			setClientsData( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las ordenes por facturación electronica.');
		}
	}

	const getCajeros = async (businessID) => {
		try {
			const response = await getUsersApi(businessID);
			setCajeros(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los usuarios para la búsqueda de documento.');
		}
	}

	const getResolutions = async (businessID) => {
		try {
			const response = await getResolutionByBusinessApi(businessID);
			const found = response.find( res => res.resolucion_empresa_id == 2 );
			setResolutionsData( found );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las ordenes por facturación electronica.');
		}
	}

	const getDocumentsType = async () => {
		try {
			const response = await getDocumentsTypeApi();
			setDocumentsTypeData( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las ordenes por facturación electronica.');
		}
	}

	const getBusiness = async () => {
		try {
			const response = await getBusinessApi();
			setBusinessData( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las las empresas.');
		}
	}

	const searchDocuments = async () => {
		getFacturacionElectronica();
	}

	function OBJtoXML(obj) {
		var xml = '';
		for (var prop in obj) {
		  if (obj.hasOwnProperty(prop)) {
			if (obj[prop] instanceof Array) {
			  for (var i = 0; i < obj[prop].length; i++) {
				xml += "<" + prop + ">";
				xml += OBJtoXML(obj[prop][i]);
				xml += "</" + prop + ">";
			  }
			} else if (typeof obj[prop] === "object") {
			  xml += "<" + prop + ">";
			  xml += OBJtoXML(obj[prop]);
			  xml += "</" + prop + ">";
			} else {
			  xml += "<" + prop + ">" + obj[prop] + "</" + prop + ">";
			}
		  }
		}
		return xml;
	  }
	  

	const onExportJSON = () => {

		if(currentDocuments.length < 1) {
			toast.warn('No has seleccionado ningún documento.');
			return;
		}

		// console.log(currentDocuments);
		// console.log(documentosFacturacionElectronica)

		let generalJSON = [];

		for (const doc of checkboxDocuments) {
			const find = documentosFacturacionElectronica.find( item => item.documento_id ==  doc);
			const business = businessData.find( item => item.empresa_id == logged?.empresa_id );
			const currentProducts = currentDocuments.filter( item => item.documento_id == doc );

			const cliente = find.cliente_id ? find.cliente_id : 1;
			const cl = clientsData.find( item => item.cliente_id ==  cliente);
			const user = cajeros.find( item => item.user_id ==  find.user_id);
			const resolution = resolutionsData;

			const cityName = ciudades.find( item => item.id == cl.ciudad_id);
			const departmentName = departamentos.find( item => item.id == cityName?.departamento_id) ?? null;

			let totalNoIva = 0;
			currentProducts.forEach( el => {
				const result = parseFloat(el.parcial) 
					/ (el.impuesto_producto == '19' ? 1.19 : 
					el.impuesto_producto == '5' ? 1.05 : 1);
				
				const totalWithoutIva = parseFloat(el.parcial) - parseFloat(result);
				totalNoIva += totalWithoutIva;
			});

			let ites = [];
			const inititalTims = {
				impuesto19: {
					total: 0,
					totalImpuesto: 0,
					percentage: 19
				},
				impuesto5: {
					total: 0,
					totalImpuesto: 0,
					percentage: 5
				},
				impuesto0: {
					total: 0,
					totalImpuesto: 0,
					percentage: 0
				}
			};
			let idx  = 1;
			for (const cp of currentProducts) {
				const iva = Number(cp.impuesto_producto) == 19 ? 1.19 :
					Number(cp.impuesto_producto) == 5 ? 1.05 : 1;

				const result = parseFloat(cp.parcial) / (cp.impuesto_producto == '19' ? 1.19 : cp.impuesto_producto == '5' ? 1.05 : 1);
				
				if (cp.impuesto_producto == '19') {
					inititalTims.impuesto19.total += parseFloat(cp.parcial);
					inititalTims.impuesto19.totalImpuesto += parseFloat(result);
				} else if (cp.impuesto_producto == '5') {
					inititalTims.impuesto5.total += parseFloat(cp.parcial);
					inititalTims.impuesto5.totalImpuesto += parseFloat(result);
				} else {
					inititalTims.impuesto0.total += parseFloat(cp.parcial);
					inititalTims.impuesto0.totalImpuesto += parseFloat(result);
				}

				// const discount = parseFloat(cp.unitario) * Number(cp.impuesto_producto) / 100;//Descuento o cantidad que se reduce del precio actual.
				// const priceBeforeIva = parseFloat(cp.unitario) - parseFloat(discount); //Precio con descuento del IVA al unitario.
				// const discount2 = parseFloat(priceBeforeIva) * Number(cp.impuesto_producto) / 100;//IVA del precio resultante.
				// const ivaTotal = discount2 * cp.cantidad; // Iva total pero del precio con descuento no del unitario.
				const priceBeforeIva = cp.parcial / iva;
				const priceUnitBeforeIva = parseFloat(cp.unitario) / iva;
				const ivaTotal = parseFloat(cp.parcial) - Number(priceBeforeIva);

				ites.push({
					ITE_1: idx,
					ITE_3: cp.cantidad,
					ITE_4: 94,
					ITE_5: Number(parseFloat(priceBeforeIva)).toFixed(2),
					ITE_6: "COP",
					ITE_7: Number(parseFloat(priceUnitBeforeIva)).toFixed(2),
					ITE_8: "COP",
					ITE_11: `${cp.descripcion}`,
					ITE_20: "COP",
					ITE_21: Number(parseFloat(priceBeforeIva) + parseFloat(ivaTotal)).toFixed(2),
					ITE_24: "COP",
					ITE_27: Number(cp.cantidad).toFixed(2),
					ITE_28: 94,
					IAE: {
						IAE_1: cp.producto_id,
						IAE_2: 999
					},
					TII: {
						TII_1: Number(ivaTotal).toFixed(2),
						TII_2: 'COP',
						TII_3: false,
						IIM: {
							IIM_1: "01",
							IIM_2: Number(ivaTotal).toFixed(2),
							IIM_3: 'COP',
							IIM_4: Number(parseFloat(priceBeforeIva)).toFixed(2),
							IIM_5: 'COP',
							IIM_6: Number(cp.impuesto_producto).toFixed(2)
						}
					}
				});

				idx++;
			}

			let tims = [];
			for (const ivaNumber in inititalTims) {
				if (inititalTims[ivaNumber].total !== 0) {
					let result = {
						TIM_1: false,
						TIM_2: Number(inititalTims[ivaNumber].totalImpuesto).toFixed(2),
						TIM_3: "COP",
						IMP: {
							IMP_1: "01",
							IMP_2: Number(inititalTims[ivaNumber].total),
							IMP_3: "COP",
							IMP_4: Number(inititalTims[ivaNumber].totalImpuesto).toFixed(2),
							IMP_5: "COP",
							IMP_6: Number(inititalTims[ivaNumber].percentage)
						}
					}

					tims.push(result);
				}
			}

			let refs = {
				REF1_1: 'IV',
				REF_2: resolution?.resolucion_dian,
				REF_3: new Date().toISOString().slice(0, 10),
				REF_4: find.cufe ?? '',
				REF_5: 'CUFE-SHA384'
			};

			const title = find.tipo_documento_id == 10 ? 'FACTURA' : 'NOTA'

			const enc1 = find.tipo_documento_id == 10 ? 'INVOIC' : 
				find.documento_id == 12 ? 'NC' : 
				find.documento_id == 13 ? 'ND' : 
				'N/A'

			const enc9 = find.tipo_documento_id == 10 ? "01" : 
				find.documento_id == 12 ? "91" : 
				find.documento_id == 13 ? "92" : 
				0;

			const enc21 = find.tipo_documento_id == 10 ? "10" : 
				find.documento_id == 12 ? "20" : 
				find.documento_id == 13 ? "22" : 
				0;

			const prefix = find.tipo_documento_id == 10 ? 'FA' : 
				find.documento_id == 12 ? 'NC' : 
				find.documento_id == 13 ? 'ND' : 
				'N/A'

			const buildJSON = {
				FACTURA: {
					ENC: {
						ENC_1: enc1,
						ENC_2: Number(business?.nit),
						ENC_3: ISPROD ? cl.documento : '901143311',
						ENC_4: "UBL 2.1",
						ENC_5: "DIAN 2.1",
						ENC_6: `${find?.letra_consecutivo}${find?.consecutivo_dian}`,
						ENC_7: new Date().toISOString().slice(0, 10),
						ENC_8: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false }).replace(/([\d:]+) /, '$1-') + '-05:00',
						ENC_9: enc9,
						ENC_10: "COP",
						ENC_15: currentProducts.length,
						ENC_16: find.fecha_registro.slice(0, 10),
						ENC_20: vEnv.vTipoAmbiente,
						ENC_21: Number(enc21),
					},
					IPV: {
						IPV_1: `${user?.mac}`, //MAC
						IPV_2: 'Zona Centro', //zona 
						IPV_3: `${user?.nombre} ${user?.apellido}`, //usuario nombre, apellido de usuario
						IPV_4: 'TC01', //tipo caja
						IPV_5: 'CV01', //codigo de venta
						IPV_6: totalNoIva.toFixed(2)
					},
					BAC: {
						BAC_1: `${user?.identificacion}`,//documento de identidad del cajero
						BAC_2: `${user?.nombre} ${user?.apellido}`,//usuario nombre, apellido de usuario
						BAC_3: 0
					},
					EMI: {
						EMI_1: TYPE_BUSINESS, //1 juridico, 2 natural.
						EMI_2: Number(business?.nit),
						EMI_3: 31,
						EMI_6: `${business.nombre}`,
						EMI_7: `${business.nombre}`,
						EMI_10: `${business.direccion}`,
						EMI_11: 19,
						EMI_13: `${business.ciudad}`,
						EMI_15: 'CO',
						EMI_19: `${business.departamento}`,
						EMI_22: 6,
						EMI_23: 19001,
						EMI_24: `${business.nombre}`,
						TAC: {
							TAC_1: "R-99-PN"
						},
						DFE: {
							DFE_1: `${cl.codigo_ciudad}`, //codigo municipio
							DFE_2: `${cl.codigo_departamento}`, //codigo departamento
							DFE_3: "CO",
							DFE_4: '190003', //codigo postal
							DFE_5: "Colombia",
							DFE_6: `${business.departamento}`,
							DFE_7: `${business.ciudad}`,
							DFE_8: `${business.direccion}`
						},
						ICC: {
							ICC_1: `${resolution?.resolucion_dian}`,
							ICC_9: enc1 === 'INVOIC' ? `${resolution?.letra_consecutivo}` : `${find?.letra_consecutivo}`
						},
						CDE: {
							CDE_1: 1,
							CDE_2: `${business.represente}`,
							CDE_3: `${business.cel}`,
							CDE_4: `${business.correo}`
						},
						GTE: {
							GTE_1: 1,
							GTE_2: "IVA"
						}
					},
					ADQ: {
						ADQ_1: cl.fact_tipo_empresa_id,
						ADQ_2: cl.documento,
						ADQ_3: cl.nombre_corto,
						ADQ_6: `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
						ADQ_7: `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
						ADQ_10: `${cl.direccion}`,
						ADQ_11: `${cl.codigo_departamento}`,
						ADQ_13: `${cl?.nombre_ciudad}`,
						ADQ_14: `${cl.codigo_ciudad}`,
						ADQ_15: "CO",
						ADQ_19: `${cl.nombre_departamento}`,
						ADQ_21: "Colombia",
						ADQ_22: cl.fact_tipo_empresa_id == 1 ? cl.digito_verificacion : 1,
						ADQ_23: `${cl.codigo_ciudad}`,
						TCR: {
							TCR_1: "R-99-PN"
						},
						ILA: {
							ILA_1: `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
							ILA_2: cl.documento,
							ILA_3: 31,
							ILA_4: 1
						},
						DFA: {
							DFA_1: "CO",
							DFA_2: `${cl.codigo_departamento}`,
							DFA_3: '190003',
							DFA_4: `${cl.codigo_ciudad}`,
							DFA_5: "Colombia",
							DFA_6: `${cl.nombre_departamento}`,
							DFA_7: `${cl?.nombre_ciudad}`,
							DFA_8: `${cl.direccion}`
						},
						ICR: {
							ICR_1: 784112
						},
						CDA: {
							CDA_1: 1,
							CDA_2: `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
							CDA_3: 583100,
							CDA_4: `${cl.mail}`
						},
						GTA: {
							GTA_1: 1,
							GTA_2: "IVA"
						}
					},
					TOT: {
						TOT_1: totalNoIva.toFixed(2),
						TOT_2: "COP",
						TOT_3: find.iva != '0' || find.iva != 0 ? parseFloat(find.gravado) : 0,
						TOT_4: "COP",
						TOT_5: (parseFloat(find.total) - parseFloat(find.descuento)).toFixed(2),
						TOT_6: "COP",
						TOT_7: parseFloat(find.total).toFixed(2),
						TOT_8: "COP",
						TOT_9: 0.00,
						TOT_10: "COP",
						TOT_11: 0.00,
						TOT_12: "COP"
					},
					TIM: {},
					DRF: {
						DRF_1: `${resolution?.resolucion_dian}`,
						DRF_2: find.tipo_documento_id == 10  ? '2023-10-18' : '2023-10-30',
						DRF_3: "2024-04-18", //fecha resolucion
						DRF_4: (find.tipo_documento_id == 10 || find.tipo_documento_id == 12 || find.tipo_documento_id == 13) ? `${find?.letra_consecutivo}` : `${find?.letra_consecutivo}${find?.consecutivo_dian}`,
						DRF_5: `${resolution?.autorizacion_desde}`,
						DRF_6: `${resolution?.autorizacion_hasta}`
					},
					NOT: {
						NOT_1: `${business.represente}`
					},
					...(title != 'FACTURA' && {
						REF: refs,
					}),
					MEP: {
						MEP_1: 10,
						MEP_2: 1,
						MEP_3: find.fecha_registro.slice(0, 10)
					}
				}
			}

			buildJSON.FACTURA.ITE = ites;
			buildJSON.FACTURA.TIM = tims;
			
			// const xmlData = OBJtoXML(buildJSON);
			// const formattedXMLData = XMLFormatter(xmlData);
			// const xmlBlob = new Blob([formattedXMLData], { type: 'application/xml' });
			// saveAs(xmlBlob, 'facturacion_base.xml');

			generalJSON.push(buildJSON);
		}

		setCurrentJSON(generalJSON);

		const jsonBlob = new Blob([JSON.stringify(generalJSON)], { type: 'application/json' });
		saveAs(jsonBlob, 'facturacion_base.json'); // Nombre del archivo a descargar
	}

	const sendXML = async () => {
		
		let generalJSON = [];
		setLoadingSendDocument(true);

		for await (const doc of checkboxDocuments) {
			const find = documentosFacturacionElectronica.find( item => item.documento_id ==  doc);
			const business = businessData.find( item => item.empresa_id == logged?.empresa_id );
			const currentProducts = currentDocuments.filter( item => item.documento_id == doc );

			const cliente = find.cliente_id ? find.cliente_id : 1;
			const cl = clientsData.find( item => item.cliente_id ==  cliente);
			const user = cajeros.find( item => item.user_id ==  find.user_id);
			const resolution = resolutionsData;

			const cityName = ciudades.find( item => item.id == cl.ciudad_id);
			const departmentName = departamentos.find( item => item.id == cityName?.departamento_id);

			let totalNoIva = 0;
			currentProducts.forEach( el => {
				const result = parseFloat(el.parcial) 
					/ (Number(el.impuesto_producto) == '19' ? 1.19 : 
					Number(el.impuesto_producto) == '5' ? 1.05 : 1);
				
				// const totalWithoutIva = parseFloat(el.parcial) - parseFloat(result);
				// console.log(el.parcial, result)
				totalNoIva += parseFloat(result);
			});

			let totalOnlyIva = 0;
			currentProducts.forEach( el => {
				const discount = parseFloat(el.unitario) * Number(el.impuesto_producto) / 100;//Descuento o cantidad que se reduce del precio actual.
				// const priceBeforeIva = parseFloat(el.unitario) - parseFloat(discount); //Precio con descuento del IVA al unitario.

				const result = parseFloat(el.parcial)
					/ Number((el.impuesto_producto == '19') ? 1.19 : 
					Number(el.impuesto_producto == '5') ? 1.05 : 1);

					
				totalOnlyIva += parseFloat(el.parcial) - Number(result);
			});

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

				// const discount = parseFloat(cp.unitario) * Number(cp.impuesto_producto) / 100;//Descuento o cantidad que se reduce del precio actual.
				// const priceBeforeIva = parseFloat(cp.unitario) - parseFloat(discount); //Precio con descuento del IVA al unitario.
				// const discount2 = parseFloat(priceBeforeIva) * Number(cp.impuesto_producto) / 100;//IVA del precio resultante.
				// const ivaTotal = discount2 * cp.cantidad; // Iva total pero del precio con descuento no del unitario.
				const priceBeforeIva = cp.parcial / iva;
				const priceUnitBeforeIva = parseFloat(cp.unitario) / iva;
				const ivaTotal = parseFloat(cp.parcial) - Number(priceBeforeIva);

				ites.push({
					ITE_1: idx,
					ITE_3: cp.cantidad,
					ITE_4: 94,
					ITE_5: Number(parseFloat(priceBeforeIva)).toFixed(2),
					ITE_6: "COP",
					ITE_7: Number(parseFloat(priceUnitBeforeIva)).toFixed(2),
					ITE_8: "COP",
					ITE_11: `${cp.descripcion}`,
					ITE_20: "COP",
					ITE_21: Number(parseFloat(priceBeforeIva) + parseFloat(ivaTotal)).toFixed(2),
					ITE_24: "COP",
					ITE_27: Number(cp.cantidad).toFixed(2),
					ITE_28: 94,
					IAE: {
						IAE_1: cp.producto_id,
						IAE_2: 999
					},
					TII: {
						TII_1: Number(ivaTotal).toFixed(2),
						TII_2: 'COP',
						TII_3: false,
						IIM: {
							IIM_1: "01",
							IIM_2: Number(ivaTotal).toFixed(2),
							IIM_3: 'COP',
							IIM_4: Number(parseFloat(priceBeforeIva)).toFixed(2),
							IIM_5: 'COP',
							IIM_6: Number(cp.impuesto_producto).toFixed(2)
						}
					}
				});

				idx++;
			}

			// let tims = [];
			// for (const ivaNumber in inititalTims) {
			// 	if (inititalTims[ivaNumber].total !== 0) {
			// 		let result = {
			// 			TIM_1: false,
			// 			TIM_2: Number(inititalTims[ivaNumber].totalIVA).toFixed(2),
			// 			TIM_3: "COP",
			// 			IMP: {
			// 				IMP_1: "01",
			// 				IMP_2: Number(inititalTims[ivaNumber].totalImpuesto).toFixed(2),
			// 				IMP_3: "COP",
			// 				IMP_4: Number(inititalTims[ivaNumber].totalIVA).toFixed(2),
			// 				IMP_5: "COP",
			// 				IMP_6: Number(inititalTims[ivaNumber].percentage)
			// 			}
			// 		}

			// 		tims.push(result);
			// 	}
			// }

			let tims = {
				TIM_1: false,
				TIM_2: Number(inititalTims.impuesto19.totalIVA + inititalTims.impuesto5.totalIVA).toFixed(2),
				TIM_3: "COP",
				IMP: []
			}
			for (const ivaNumber in inititalTims) {
				if (inititalTims[ivaNumber].total !== 0) {
						let IMP = {
							IMP_1: "01",
							IMP_2: Number(inititalTims[ivaNumber].totalImpuesto).toFixed(2),
							IMP_3: "COP",
							IMP_4: Number(inititalTims[ivaNumber].totalIVA).toFixed(2),
							IMP_5: "COP",
							IMP_6: Number(inititalTims[ivaNumber].percentage)
						}
					tims.IMP.push(IMP);
				}
			}

			let refs = {
				REF1_1: 'IV',
				REF_2: resolution?.resolucion_dian,
				REF_3: new Date().toISOString().slice(0, 10),
				REF_4: find.cufe ?? '',
				REF_5: 'CUFE-SHA384'
			};

			const title = find.tipo_documento_id == 10 ? 'FACTURA' : 'NOTA'

			const enc1 = find.tipo_documento_id == 10 ? 'INVOIC' : 
				find.tipo_documento_id == 12 ? 'NC' : 
				find.tipo_documento_id == 13 ? 'ND' : 
				'N/A'

			const enc9 = find.tipo_documento_id == 10 ? "01" : 
				find.tipo_documento_id == 12 ? "91" : 
				find.tipo_documento_id == 13 ? "92" : 
				0;

			const enc21 = find.tipo_documento_id == 10 ? "10" : 
				find.tipo_documento_id == 12 || find.tipo_documento_id == 12 && find.cufe != "" ? "20" : 
				find.tipo_documento_id == 12 || find.tipo_documento_id == 13 && find.cufe == "" ? "30" : 
				0;

			const prefix = find.tipo_documento_id == 10 ? 'FA' : 
				find.tipo_documento_id == 12 ? 'NC' : 
				find.tipo_documento_id == 13 ? 'ND' : 
				'N/A'

			const buildJSON = {
				[title]: {
					ENC: {
						ENC_1: enc1,
						ENC_2: Number(business?.nit),
						ENC_3: ISPROD ? cl.documento : '901143311',
						ENC_4: "UBL 2.1",
						ENC_5: "DIAN 2.1",
						ENC_6: `${find?.letra_consecutivo}${find?.consecutivo_dian}`,
						ENC_7: new Date().toISOString().slice(0, 10),
						ENC_8: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false }).replace(/([\d:]+) /, '$1-') + '-05:00',
						ENC_9: enc9,
						ENC_10: "COP",
						ENC_15: currentProducts.length,
						ENC_20: vEnv.vTipoAmbiente,
						ENC_21: Number(enc21),
					},
					IPV: {
						IPV_1: `${user?.mac}`, //MAC
						IPV_2: 'Zona Centro', //zona 
						IPV_3: `${user?.nombre} ${user?.apellido}`, //usuario nombre, apellido de usuario
						IPV_4: 'TC01', //tipo caja
						IPV_5: 'CV01', //codigo de venta
						IPV_6: totalNoIva.toFixed(2)
					},
					BAC: {
						BAC_1: `${user?.identificacion}`,//documento de identidad del cajero
						BAC_2: `${user?.nombre} ${user?.apellido}`,//usuario nombre, apellido de usuario
						BAC_3: 0
					},
					EMI: {
						EMI_1: TYPE_BUSINESS, //1 juridico, 2 natural.
						EMI_2: Number(business?.nit),
						EMI_3: 31,
						EMI_6: `${business.nombre}`,
						EMI_7: `${business.nombre}`,
						EMI_10: `${business.direccion}`,
						EMI_11: 19,
						EMI_13: `${business.ciudad}`,
						EMI_15: 'CO',
						EMI_19: `${business.departamento}`,
						EMI_22: 6,
						EMI_23: 19001,
						EMI_24: `${business.nombre}`,
						TAC: {
							TAC_1: "R-99-PN"
						},
						DFE: {
							DFE_1: `${cl.codigo_ciudad}`, //codigo municipio
							DFE_2: `${cl.codigo_departamento}`, //codigo departamento
							DFE_3: "CO",
							DFE_4: '190003', //codigo postal
							DFE_5: "Colombia",
							DFE_6: `${business.departamento}`,
							DFE_7: `${business.ciudad}`,
							DFE_8: `${business.direccion}`
						},
						ICC: {
							ICC_1: `${resolution?.resolucion_dian}`,
							ICC_9: enc1 === 'INVOIC' ? `${resolution?.letra_consecutivo}` : `${find?.letra_consecutivo}`
						},
						CDE: {
							CDE_1: 1,
							CDE_2: `${business.represente}`,
							CDE_3: `${business.cel}`,
							CDE_4: `${business.correo}`
						},
						GTE: {
							GTE_1: 1,
							GTE_2: "IVA"
						}
					},
					ADQ: {
						ADQ_1: cl.fact_tipo_empresa_id,
						ADQ_2: cl.documento,
						ADQ_3: cl.nombre_corto,
						ADQ_6: `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
						ADQ_7: `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
						...(cl.fact_tipo_empresa_id == 2 && {
							ADQ_8: `${cl.nombre} ${cl.segundo_nombre}`,
							ADQ_9: `${cl.nombre} ${cl.segundo_nombre} ${cl.apellidos} ${cl.segundo_apellido}`
						}),
						ADQ_10: `${cl.direccion}`,
						ADQ_11: `${cl.codigo_departamento}`,
						ADQ_13: `${cl?.nombre_ciudad}`,
						ADQ_14: `${cl.codigo_ciudad}`,
						ADQ_15: "CO",
						ADQ_19: `${cl.nombre_departamento}`,
						ADQ_21: "Colombia",
						ADQ_22: cl.fact_tipo_empresa_id == 1 ? cl.digito_verificacion : 1,
						ADQ_23: `${cl.codigo_ciudad}`,
						TCR: {
							TCR_1: "R-99-PN"
						},
						ILA: {
							ILA_1: `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
							ILA_2: cl.documento,
							ILA_3: 31,
							ILA_4: 1
						},
						DFA: {
							DFA_1: "CO",
							DFA_2: `${cl.codigo_departamento}`,
							DFA_3: '190003',
							DFA_4: `${cl.codigo_ciudad}`,
							DFA_5: "Colombia",
							DFA_6: `${cl.nombre_departamento}`,
							DFA_7: `${cl?.nombre_ciudad}`,
							DFA_8: `${cl.direccion}`
						},
						ICR: {
							ICR_1: 784112
						},
						CDA: {
							CDA_1: 1,
							CDA_2: `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
							CDA_3: 583100,
							CDA_4: `${cl.mail}`
						},
						GTA: {
							GTA_1: 1,
							GTA_2: "IVA"
						}
					},
					TOT: {
						TOT_1: totalNoIva.toFixed(2),
						TOT_2: "COP",
						// TOT_3: totalOnlyIva.toFixed(2),
						TOT_3: totalNoIva.toFixed(2),
						TOT_4: "COP",
						TOT_5: (parseFloat(totalNoIva) + parseFloat(totalOnlyIva) - parseFloat(find.descuento)).toFixed(2),
						TOT_6: "COP",
						TOT_7: (parseFloat(totalNoIva) + parseFloat(totalOnlyIva)).toFixed(2),
						TOT_8: "COP",
						TOT_9: 0.00,
						TOT_10: "COP",
						TOT_11: 0.00,
						TOT_12: "COP"
					},
					TIM: {},
					DRF: {
						DRF_1: `${resolution?.resolucion_dian}`,
						DRF_2: find.tipo_documento_id == 10  ? '2023-10-18' : '2023-10-30',
						DRF_3: "2024-04-18",
						DRF_4: (find.tipo_documento_id == 10 || find.tipo_documento_id == 12 || find.tipo_documento_id == 13) ? `${find?.letra_consecutivo}` : `${find?.letra_consecutivo}${find?.consecutivo_dian}`,
						DRF_5: `${resolution?.autorizacion_desde}`,
						DRF_6: `${resolution?.autorizacion_hasta}`
					},
					NOT: {
						NOT_1: `${business.represente}`
					},
					...(title != 'FACTURA' && {
						REF: refs,
					}),
					MEP: {
						MEP_1: 10,
						MEP_2: 1,
						MEP_3: find.fecha_registro.slice(0, 10)
					}
				}
			}

			buildJSON[title].ITE = ites;
			buildJSON[title].TIM = tims;
			// if(title != 'FACTURA') {
			// 	buildJSON[title].REF = refs;
			// }
			// console.log(buildJSON);
			// console.log(find)
			// const xmlData = OBJtoXML(buildJSON);
			const xmlData = '<?xml version="1.0" encoding="utf-8" standalone="yes"?>' + OBJtoXML(buildJSON);
			// const formattedXMLData = XMLFormatter(xmlData);
			// const xmlBlob = new Blob([xmlData], { type: 'application/xml' });
			// saveAs(xmlBlob, 'facturacion_base.xml');
			// console.log(xmlData)
			// return;
			const encoder = new TextEncoder();
			const dataEncoder = encoder.encode(xmlData);
			const xmlBase64 = btoa(String.fromCharCode.apply(null, dataEncoder)); // Codificar a base64
			const res = await sendSoapXML(xmlBase64);
			if(res.data.return.code.$value == 201 && find.tipo_documento_id == 10) {
				await documentStatus(res.data.return.transaccionID.$value);
				const resCufe = await getCUFE(find.consecutivo_dian, find.letra_consecutivo);
				const cufeqr = await getCUFEQR(find.consecutivo_dian, find.letra_consecutivo);
				const documentupdt = {
					...find,
					cufe: resCufe.data.return.resourceData.$value,
					qrcode: cufeqr.data.return.resourceData.$value,
					invoice_id: 2
				}
				await updateDocumentoApi(documentupdt);
				await getFacturacionElectronica();
				toast.success("Documento electrónico firmado éxitosamente.");
				setCheckboxDocuments([]);
			} else if(res.data.return.code.$value == 201 && (find.tipo_documento_id == 12 || find.tipo_documento_id == 13)) {
				const documentupdt = {
					...find,
					invoice_id: 2
				}
				await updateDocumentoApi(documentupdt);
				await getFacturacionElectronica();
				setCheckboxDocuments([]);
				toast.success("Documento electrónico enviado éxitosamente.");
			} else {
				setCheckboxDocuments([]);
				toast.warning("Ocurrió un error al enviar un documento electrónico por favor comunicate con soporte.");
			}
			setLoadingSendDocument(false);
			generalJSON.push(buildJSON);
		}
	}

	const actionSelectedDocuments = (value, checked) => {
		let documents = [];
		documents = checkboxDocuments.slice();

		if(checked) {
			documents.push( value );
		} else {
			const idx = documents.findIndex( el => el == value );
			documents.splice(idx, 1);
		}

		setCheckboxDocuments(documents);
	}

	useEffect(() => {
	  getFacturacionElectronica();
	  getClientes(logged?.empresa_id);
	  getCajeros(logged?.empresa_id);
	  getDocumentsType();
	  getBusiness();
	  getResolutions(logged?.empresa_id);
	}, [logged]);

	useEffect(() => {
		if(checkboxDocuments.length) {
			getDocumentoDetalle(checkboxDocuments);
		} else {
			setCurrentDocuments([]);
		}
	}, [checkboxDocuments])
	
	

	return (
		<AdminLayout>
			<div className="envioDocumento">
				<h3>
					<strong>Envío de documentos</strong>
				</h3>
			</div>

			<br />

			{
				loadingSendDocument ? (
					<Spin tip="Loading..." size="large"></Spin>
				) : (
					<ListDocumentSendComponent 
						data={ documentosFacturacionElectronica }
						setDateInit={ setDateInit }
						setDateEnd={ setDateEnd }
						searchDocuments={ searchDocuments }
						setConsecutivoDian={ setConsecutivoDian }
						setDocument={ setDocument }
						clientsData={ clientsData }
						documentsTypeData={ documentsTypeData }
						actionSelectedDocuments={ actionSelectedDocuments }
						documentsCheckbox={ checkboxDocuments }
						setCheckboxDocuments={ setCheckboxDocuments }
						getFacturacionElectronica={ getFacturacionElectronica }
						onExportJSON={ onExportJSON }
						sendXML={ sendXML }
					/>
				)
			}
		</AdminLayout>
	)
}

export default envioDocumentos;