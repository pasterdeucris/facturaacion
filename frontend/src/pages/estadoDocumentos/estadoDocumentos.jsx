import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

import useAuth from '../../hooks/useAuth';
import { getDocumentsTypeApi, getDocumentoDetalleAPI , updateDocumentoApi} from '../../api/document';
import { getClientsApi } from '../../api/client';
import { getDocumentsForVerificationInvoice } from '../../api/invoices';
import { sendFacturaElectronica } from '../../api/soap';
import { getBusinessApi } from '../../api/business';
import { getResolutionByBusinessApi } from '../../api/sales';
import { ciudades, departamentos, vEnv } from '../../utils/info';
import { useSendXml } from '../../hooks/useSendXml';

import AdminLayout from "../../layouts/AdminLayout";
import ListDocumentSendComponent from '../../components/VerificationDocumentComponent/ListComponent';

function envioDocumentos() {

	const logged = useAuth();
	const [dateInit, setDateInit] = useState("");
	const [dateEnd, setDateEnd] = useState("");
	const [consecutivoDian, setConsecutivoDian] = useState("");
	const [document, setDocument] = useState("");
	const [statusInvoice, setStatusInvoice] = useState("");
	const [documentosFacturacionElectronica, setDocumentosFacturacionElectronica] = useState([]);
	const [clientsData, setClientsData] = useState([]);
	const [resolutionsData, setResolutionsData] = useState([]);
	const [businessData, setBusinessData] = useState([]);
	const [documentsTypeData, setDocumentsTypeData] = useState([]);
	const [checkboxDocuments, setCheckboxDocuments] = useState([]);
	const [currentDocuments, setCurrentDocuments] = useState([]);
	const [currentJSON, setCurrentJSON] = useState([]);
	const [loadingSendDocument, setLoadingSendDocument] = useState(false);

	const [ setXML ] = useSendXml();

	const getFacturacionElectronica = async () => {
		try {
			const response = await getDocumentsForVerificationInvoice(dateInit, dateEnd, consecutivoDian, document, statusInvoice);
			let res = response.filter( item => item.invoice_id != 1 );
			setDocumentosFacturacionElectronica( res );
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

	const descartarDocumento = async (document) => {
		const documentupdt = {
			...document,
			invoice_id: 3
		}
		await updateDocumentoApi(documentupdt);
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

		console.log(currentDocuments);
		console.log(documentosFacturacionElectronica)

		let generalJSON = [];

		for (const doc of checkboxDocuments) {
			const find = documentosFacturacionElectronica.find( item => item.documento_id ==  doc);
			const business = businessData.find( item => item.empresa_id == logged?.empresa_id );
			const currentProducts = currentDocuments.filter( item => item.documento_id == doc );

			const cliente = business.cliente_id ? business.cliente_id : 1;
			const cl = clientsData.find( item => item.cliente_id ==  cliente);
			const resolution = resolutionsData;

			const cityName = ciudades.find( item => item.id == cl.ciudad_id);
			const departmentName = departamentos.find( item => item.id == cityName?.departamento_id) ?? null;

			let totalNoIva = 0;
			currentProducts.forEach( el => {
				const result = parseFloat(el.parcial) 
					* (el.impuesto_producto == '19' ? 0.19 : 
					el.impuesto_producto == '5' ? 0.05 : 0);
				
				const totalWithoutIva = parseFloat(el.parcial) - parseFloat(result);
				totalNoIva += totalWithoutIva;
			});

			let ites = [];
			let idx  = 1;
			for (const cp of currentProducts) {
				const priceWithDiscount = parseFloat(cp.unitario) * parseFloat(1 - 0.05);

				ites.push({
					ITE_1: idx,
					ITE_3: cp.cantidad,
					ITE_4: 94,
					ITE_5: priceWithDiscount.toFixed(2),
					ITE_6: "COP",
					ITE_7: parseFloat(cp.unitario).toFixed(2),
					ITE_8: "COP",
					ITE_11: `${cp.descripcion}`,
					ITE_19: parseFloat(cp.parcial).toFixed(2),
					ITE_20: "COP",
					ITE_21: parseFloat(cp.parcial).toFixed(2),
					ITE_22: "COP",
					ITE_23: cp.cantidad,
					ITE_24: "COP",
					ITE_27: cp.cantidad,
					ITE_28: 94,
					IAE: {
						IAE_1: cp.producto_id,
						IAE_2: 999
					}
				});

				idx++;
			}

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
						ENC_2: 901143311,
						ENC_3: Number(business?.nit),
						ENC_4: "UBL 2.1",
						ENC_5: "DIAN 2.1",
						ENC_6: `${resolution?.letra_consecutivo}${prefix}${resolution?.consecutivo}`,
						ENC_7: new Date().toISOString().slice(0, 10),
						ENC_8: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false }).replace(/([\d:]+) /, '$1-') + '-05:00',
						ENC_9: enc9,
						ENC_10: "COP",
						ENC_15: currentProducts.length,
						ENC_20: vEnv.vTipoAmbiente,
						ENC_21: Number(enc21),
					},
					EMI: {
						EMI_1: 1,
						EMI_2: 901143311,
						EMI_3: 31,
						EMI_6: 'FACTURATECH SA. DE CV',
						EMI_7: 'FACTURATECH SA. DE CV',
						EMI_10: 'Carrera 48',
						EMI_11: 5,
						EMI_13: 'MEDELLIN',
						EMI_15: 'CO',
						EMI_19: 'Antioquia',
						EMI_22: 8,
						EMI_23: vEnv.vCodigoPostal,
						EMI_24: 'FACTURATECH SA. DE CV',
						TAC: {
							TAC_1: "R-99-PN"
						},
						DFE: {
							DFE_1: Number(vEnv.vCodigoPostalDepartamento),
							DFE_2: Number(vEnv.vCodigoCiudad),
							DFE_3: "CO",
							DFE_4: Number(vEnv.vCodigoPostalDepartamento),
							DFE_5: "Colombia",
							DFE_6: `${business.departamento}`,
							DFE_7: `${business.ciudad}`,
							DFE_8: `${business.direccion}`
						},
						ICC: {
							ICC_1: `${resolution?.resolucion_dian}`,
							ICC_9: `${resolution?.letra_consecutivo}${prefix}`
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
						ADQ_1: 1,
						ADQ_2: cl.documento,
						ADQ_3: 31,
						ADQ_6: `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
						ADQ_7: `${cl.nombre} ${cl.razon_social} ${cl.apellidos}`,
						ADQ_10: `${cl.direccion}`,
						ADQ_11: 5,
						ADQ_13: cityName?.nombre ? `${cityName?.nombre}` : 'N/A',
						ADQ_14: 5001,
						ADQ_15: "CO",
						ADQ_19: `${departmentName?.nombre}`,
						ADQ_21: "Colombia",
						ADQ_22: 1,
						ADQ_23: 5001,
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
							DFA_2: 5,
							DFA_3: 5001,
							DFA_4: 5001,
							DFA_5: "Colombia",
							DFA_6: `${departmentName?.nombre}`,
							DFA_7: cityName?.nombre ? `${cityName?.nombre}` : 'N/A',
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
						TOT_8: "COP"
					},
					DRF: {
						DRF_1: `${resolution?.resolucion_dian}`,
						DRF_2: `${resolution?.fecha_resolucion.slice(0,10)}`,
						DRF_3: "2030-12-31",
						DRF_4: `${resolution?.letra_consecutivo}${prefix}`,
						DRF_5: `${resolution?.autorizacion_desde}`,
						DRF_6: `${resolution?.autorizacion_hasta}`
					},
					MEP: {
						MEP_1: 10,
						MEP_2: 1,
						MEP_3: find.fecha_registro.slice(0, 10)
					}
				}
			}

			buildJSON.FACTURA.ITE = ites;
			
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
		
		setLoadingSendDocument(true);

		for await (const doc of checkboxDocuments) {
			const find = documentosFacturacionElectronica.find( item => item.documento_id ==  doc);
			const business = businessData.find( item => item.empresa_id == logged?.empresa_id );
			const currentProducts = currentDocuments.filter( item => item.documento_id == doc );

			const cliente = find.cliente_id ? find.cliente_id : 1;
			const cl = clientsData.find( item => item.cliente_id ==  cliente);
			const resolution = resolutionsData;

			try {
				const json = await setXML(find, business, currentProducts, cl, resolution)

				const data = await sendFacturaElectronica(json);
				const isValid = data?.data?.ResponseDian?.Envelope?.Body?.SendBillSyncResponse?.SendBillSyncResult?.IsValid;

				console.log(data.data.message)

				if(isValid)
				{
					if(isValid === "false")
					{
						toast.warning("Documento electrónico contiene errores.");
					} else {
						toast.success("Documento electrónico firmado éxitosamente.");

						const documentupdt = {
							...find,
							cufe: data.data.cufe,
							qrcode: data.data.QRStr,
							invoice_id: 2
						}
						await updateDocumentoApi(documentupdt);
					}
				}

				getFacturacionElectronica();
			} catch (err) {
				toast.warning(err.message);
				console.log(err.errors);
			}

			// const jsonBlob = new Blob([JSON.stringify(json)], { type: 'application/json' });
			// saveAs(jsonBlob, 'facturacion_base.json');

			setLoadingSendDocument(false);
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
	
	useEffect(() => {
	  if(statusInvoice == 1) {
		alert('No puedes ver las facturas sin enviar en esta sección.');
		setStatusInvoice("");
	  }
	}, [statusInvoice])
	

	return (
		<AdminLayout>
			<div className="envioDocumento">
				<h3>
					<strong>Verificar estado de documentos enviados</strong>
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
						setStatusInvoice={setStatusInvoice}
						clientsData={ clientsData }
						documentsTypeData={ documentsTypeData }
						actionSelectedDocuments={ actionSelectedDocuments }
						documentsCheckbox={ checkboxDocuments }
						setCheckboxDocuments={ setCheckboxDocuments }
						getFacturacionElectronica={ getFacturacionElectronica }
						onExportJSON={ onExportJSON }
						sendXML={ sendXML }
						businessData={ businessData }
						logged={ logged }
					/>
				)
			}
		</AdminLayout>
	)
}

export default envioDocumentos;