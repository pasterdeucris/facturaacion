import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

import useAuth from '../../hooks/useAuth';
import { getDocumentsTypeApi, getDocumentoDetalleAPI , updateDocumentoApi} from '../../api/document';
import { getClientsApi } from '../../api/client';
import { getDocumentsForInvoice } from '../../api/invoices';
import { sendFacturaElectronica, sendCreditNote } from '../../api/soap';
import { getBusinessApi } from '../../api/business';
import { getResolutionByBusinessApi } from '../../api/sales';
import { ciudades, departamentos, vEnv } from '../../utils/info';
import { getUsersApi } from '../../api/user';

import AdminLayout from "../../layouts/AdminLayout";
import ListDocumentSendComponent from '../../components/DocumentSendComponent/ListComponent';
import { ISPROD, TYPE_BUSINESS } from '../../utils/constants';
import { useSendXml } from '../../hooks/useSendXml';
import { getQRString } from '../../utils/helper';

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

	const [ setXML, setCreditNote ] = useSendXml();

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
				const find = documentosFacturacionElectronica.find( item => item.documento_id ==  doc);
				const estado = find.tipo_documento_id == 12 ? 0 : 1;

				const response = await getDocumentoDetalleAPI(doc, estado);
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
	  

	const onExportJSON = async () => {

		setLoadingSendDocument(true);

		for await (const doc of checkboxDocuments) {
			const find = documentosFacturacionElectronica.find( item => item.documento_id ==  doc);
			const business = businessData.find( item => item.empresa_id == logged?.empresa_id );
			const currentProducts = currentDocuments.filter( item => item.documento_id == doc );

			const cliente = find.cliente_id ? find.cliente_id : 1;
			const cl = clientsData.find( item => item.cliente_id ==  cliente);
			const resolution = resolutionsData;

			let json = null;

			if(find.tipo_documento_id === 12)
			{
				json = await setCreditNote(find, business, currentProducts, cl, resolution);
			} 
			
			else if(find.tipo_documento_id === 10) 
			{
				json = await setXML(find, business, currentProducts, cl, resolution, find?.tipopagodocumentos[0]?.tipo_pago_id);
			}

			const jsonBlob = new Blob([JSON.stringify(json)], { type: 'application/json' });
			saveAs(jsonBlob, 'facturacion_base.json');

			setLoadingSendDocument(false);
		}
	}

	const sendXML = async () => {
		
		setLoadingSendDocument(true);

		for await (const doc of checkboxDocuments) {
			const find = documentosFacturacionElectronica.find( item => item.documento_id ==  doc);
			const business = businessData.find( item => item.empresa_id == logged?.empresa_id );
			const currentProducts = currentDocuments.filter( item => item.documento_id == doc );

			const cliente = find.cliente_id ? find.cliente_id : 1;
			const cl = clientsData.find( item => item.cliente_id == cliente);
			const user = cajeros.find( item => item.user_id ==  find.user_id);
			console.log(user)
			const resolution = resolutionsData;

			try {
				let json = null;
				let isInvoice = true;

				if(find.tipo_documento_id === 12)
				{
					json = await setCreditNote(find, business, currentProducts, cl, resolution);
					isInvoice = false;
				} 
				
				else if(find.tipo_documento_id === 10) 
				{
					json = await setXML(find, business, currentProducts, cl, resolution, find?.tipopagodocumentos[0]?.tipo_pago_id);
				}

				const data = isInvoice ? await sendFacturaElectronica(json) : await sendCreditNote(json);
				const isValid = data?.data?.ResponseDian?.Envelope?.Body?.SendBillSyncResponse?.SendBillSyncResult?.IsValid;

				console.log(data.data.message);

				const condition = isInvoice ? data.data.cufe : isValid;

				if(condition)
				{
					toast.success("Documento electrónico firmado éxitosamente.");

					const qr = await getQRString(data.data.QRStr);

					const documentupdt = {
						...find,
						cufe: data.data.cufe,
						qrcode: qr,
						invoice_id: 2
					}
					await updateDocumentoApi(documentupdt);
				} else {
					toast.warning("Documento electrónico contiene errores.");
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