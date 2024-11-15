import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Select, Spin } from 'antd';
import { toast } from 'react-toastify';
import { DeleteOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useSendXml } from '../../../hooks/useSendXml';
import { sendFacturaElectronica } from '../../../api/soap';

import LogoFactura from '../../../assets/logoempresa.jpg';

import { useForm } from '../../../hooks/useForm';
import { getClientsApi, getImpresorasApi } from '../../../api/client';
import { getUsersApi, updateProporcionApi } from '../../../api/user';
import { getDocumentoDetalleAPI, updateImpresoFromDocumentoApi } from '../../../api/document';
import { getBusinessApi } from '../../../api/business';
import { getByDocumentoIdApi } from '../../../api/nota';
import {
	getDocumentsApi,
	getResolutionByBusinessApi,
	updateDocumentoApi,
	updateConsecutivoEmpresaApi,
	createTipoPagoDocumentoApi,
	getProductsByBusinessApi
} from '../../../api/sales';
import { useActivations } from '../../../hooks/useActivations';
import useDayjs from '../../../hooks/useDays';
import { useInvoicePDF } from '../../../hooks/useInvoicePDF';
import InvoicePDFLittle from '../../PDF/InvoicePDFLittle';
import InvoicePDFMid from '../../PDF/InvoicePDFMid';

function PrintComponent({ 
	showModalPrintSale, 
	setShowModalPrintSale,
	logged, 
	currentDocumentID, 
	resetListSales, 
	getAllDocuments, 
	productsOpt,
	currentProducts,
	dataProporcion }) {

	const [form] = Form.useForm();

	const [users, setUsers] = useState([]);
	const [clients, setClients] = useState([])
	const [productsDocument, setProductsDocument] = useState([]);
	// const [productsOpt, setProductsOpt] = useState([]);
	const [productsWithDiscount, setProductsWithDiscount] = useState([]);
	const [businessData, setBusinessData] = useState([]);
	const [printersData, setPrintersData] = useState([]);
	const [inProgressPrint, setInProgressPrint] = useState(false);
	const [hideForm, setHideForm] = useState(false);
	const [countPrint, setCountPrint] = useState(0);

	const [currentDocument, setCurrentDocument] = useState(null);
	const [payments, setPayments] = useState([]);
	const [resolutions, setResolutions] = useState([]);
	const [saldo, setSaldo] = useState(0);
	const [cambio, setCambio] = useState(0);
	const [totalToPay, setTotalToPay] = useState(0);
	const [nameInvoiceScreen, setNameInvoiceScreen] = useState(false);
	const [loadingPrint, setLoadingPrint] = useState(true);
	const [invoice, setInvoice] = useState(false);
	const [tipoImpresion, setTipoImpresion] = useState(null);

	const [total, setTotal] = useState(0);
	const [totalKG, setTotalKG] = useState(0);
	const [showIva, setShowIva] = useState(null);
	const [showTotalSoloIVA, setShowTotalSoloIVA] = useState(0)
	const [totalSinIVA, setTotalSinIVA] = useState(0);

	const [ setXML ] = useSendXml();

	const { printScreen, multiPrinters, activateDiscount, activatePaymentType, onProporcion, autoElectronicInvoice } = useActivations(logged);

	const { Option } = Select;

	const [formValues, handleInputChange, setValues, formReset] = useForm({
		descuento: 0,
		impresora: 0,
		tipo_pago: 1,
		valor_pago: 0,
		resolucion: null,
		imprimir_pantalla: "",
		continuar_pantalla: "",
	});

	const [ generatePDF, generatePDFMid ] = useInvoicePDF();
	const [isButtonVisible, setIsButtonVisible] = useState(true);

	const discountRef = useRef(null);
	const printRef = useRef(null);
	const typePaymentRef = useRef(null);
	const costPaymentRef = useRef(null);
	const resolutionRef = useRef(null);
	const printScreenRef = useRef(null);
	const printContinueRef = useRef(null);
	const downloadLinkRef = useRef(null);

	const getDocumentoByID = async (documentoID) => {
		try {
			const response = await getByDocumentoIdApi(documentoID);
			setCurrentDocument(response[0]);
		} catch (err) {
			console.log(err)
			toast.warning('Ocurrió un error al intentar traer el documento por su id.');
		}
	}

	const getBusiness = async () => {
		try {
			const response = await getBusinessApi();
			setBusinessData(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las las empresas.');
		}
	}

	const getClients = async (businessID) => {
		try {
			let response = await getClientsApi(businessID);
			setClients( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos de clientes.');
		}
	}

	const getPrinters = async (businessID) => {
		try {
			const response = await getImpresorasApi(businessID);
			setPrintersData(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las impresoras.');
		}
	}

	const listResolutions = async (id) => {
		let resolucion = formValues?.resolucion ? formValues?.resolucion : 1

		try {
			const response = await getResolutionByBusinessApi(id);
			const found = response.find( res => res.resolucion_empresa_id == resolucion);
			setResolutions(found);
		} catch (err) {
			console.log(err)
			toast.warning('Ocurrió un error al intentar traer la resolución.');
		}
	}

	const updateProporcion = async (body) => {
		try {
			const response = await updateProporcionApi(body);
			console.log(response)
		} catch (err) {
			console.log(err)
			toast.warning('Ocurrió un error al intentar traer la resolución.');
		}
	}

	const updateImpresoFromDocumento = async (documentId) => {
		try {
			await updateImpresoFromDocumentoApi(documentId);
		} catch (err) {
			console.log(err)
			toast.warning('Ocurrió un error al intentar al actualizar los datos de factura.');
		}
	}

	const discountClick = (e) => {

		if (e.key == 'Enter') {
			if (multiPrinters) {
				printRef.current.focus();
			} else {
				typePaymentRef.current.focus();
			}
		}
	}

	const setClickResolution = (e) => {
		if (e.key == 'Enter') {

			listResolutions(logged.empresa_id);

			if (printScreen) {
				printScreenRef.current.focus()
			} else {
				printContinueRef.current.focus();
			}

			localStorage.setItem('paymentInPrint', JSON.stringify(payments));
		}
	}

	const saveTypePrint = (printer) => {
		if(printer === 1 || printer === "" || printer === 0)
		{
			setTipoImpresion("PDF 50mm");
		} else if(printer === 2)
		{
			setTipoImpresion("PDF MEDIA CARTA");
		}
	}

	const calculateValues = () => {
		let vrExcento = 0;
		let vrGravado = 0;
		let vrIva = 0;
		let vrBaseIva5 = 0;
		let vrBaseIva19 = 0;
		let vrIva5 = 0;
		let vrIva19 = 0;
		let vrTotal = 0;

		const operator = formValues.descuento > 0 ? 1 : -1

		if(productsDocument.length) {
			productsDocument.forEach(element => {
				const pct = Math.abs(formValues.descuento) / 100;
				const pctValueParcial = Number(element.parcial) * Number(pct);
				const newParcial = operator === -1  ? (Number(element.parcial) - Number(pctValueParcial)) 
					: (Number(element.parcial) + Number(pctValueParcial));
				
				const gravado = element.impuesto_producto == 5 ? parseFloat(newParcial) / 1.05 
				: element.impuesto_producto == 19 ? parseFloat(newParcial) / 1.19 
				: 0;

				const result = parseFloat(newParcial)
				/ Number((element.impuesto_producto == '19') ? 1.19 : 
				Number(element.impuesto_producto == '5') ? 1.05 : 1);
	
				const totalOnlyIVA = parseFloat(newParcial) - Number(result);
	
				const totalWithoutIva = parseFloat(newParcial) - parseFloat(totalOnlyIVA);
	
				vrExcento += element.impuesto_producto == 0 || !element.impuesto_producto ? 
					Number(newParcial) : 0;
				vrGravado += element.impuesto_producto == 0 || !element.impuesto_producto ? 0 : totalWithoutIva;
				vrIva += totalOnlyIVA ? Number(totalOnlyIVA) : 0;
				vrBaseIva5 += element.impuesto_producto == 5 ? Number(parseFloat(newParcial) / 1.05) : 0;
				vrBaseIva19 += element.impuesto_producto == 19 ? Number(parseFloat(newParcial) / 1.19) : 0;
				vrIva5 += element.impuesto_producto == 5 && Number(parseFloat(newParcial) - parseFloat(gravado));
				vrIva19 += element.impuesto_producto == 19 && Number(parseFloat(newParcial) - parseFloat(gravado));
				vrTotal += Number(newParcial)
			});
		}

		return {
			vrExcento,
			vrGravado,
			vrIva,
			vrBaseIva5,
			vrBaseIva19,
			vrIva5,
			vrIva19,
			vrTotal
		}
	}

	const determineDocument = (base, variable, contadorFactura, contadorRemisión) => {
		if ((contadorFactura + contadorRemisión) % (base + variable) < base) {
			return 10;  // factura
		} else {
			return 9;  // remisión
		}
	}		

	const onSubmit = async () => {
		const {
			vrExcento,
			vrGravado,
			vrIva,
			vrBaseIva5,
			vrBaseIva19,
			vrIva5,
			vrIva19,
			vrTotal
		} = calculateValues();

		const impresora = Number(formValues?.impresora);

		setInvoice(true);
		saveTypePrint(impresora);

		let bodyProporcion;
		let proporcionActive = onProporcion ? true : false;

		const discount = formValues.descuento;

		let typeDocument = determineDocument(
			dataProporcion?.base,
			dataProporcion?.variable, 
			dataProporcion?.contador_factura, 
			dataProporcion?.contador_remision
		);

		if(currentDocument?.tipo_documento_id == 4 || Number(formValues.resolucion) === 2) {
			proporcionActive = false;
		}

		if(typeDocument === 9 && currentDocument.cliente_id !== 1 && proporcionActive) {
			typeDocument = 10;
			await updateProporcion({
				...dataProporcion,
				contador_factura: 0,
				contador_remision: 0,
			})
		}

		let creditPay = payments.find(payment => Number(payment.type) === 2) || null;

		const data = {
			...currentDocument,
			tipo_documento_id: proporcionActive ? typeDocument : currentDocument?.tipo_documento_id,
			descuento: discount,
			// resolucion_empresa_id: 1,
			resolucion_empresa_id: formValues.resolucion ? Number(formValues.resolucion) : 1,
			consecutivo_dian: proporcionActive && typeDocument === 9 ? resolutions.consecutivo - 5 : resolutions.consecutivo + 1,
			letra_consecutivo: resolutions.letra_consecutivo,
			impreso: 1,
			impresora: 1,
			invoice_id: 1,
			excento: vrExcento.toFixed(2),
			gravado: vrGravado.toFixed(2),
			iva: vrIva.toFixed(2),
			iva_5: Number(vrIva5).toFixed(2),
			iva_19: vrIva19.toFixed(2),
			base_5: vrBaseIva5.toFixed(2),
			base_19: vrBaseIva19.toFixed(2),
			total: formValues.descuento !== 0 ? vrTotal.toFixed(2) : currentDocument?.total,
			saldo: creditPay ? Number(creditPay.cost) : 0
		}

		const data_consecutivo = {
			...resolutions,
			consecutivo: proporcionActive && typeDocument === 9 ? resolutions.consecutivo : resolutions.consecutivo + 1,
		}

		if(proporcionActive) {
			bodyProporcion = {
				...dataProporcion,
				contador_factura: typeDocument == 10 ? Number(dataProporcion?.contador_factura) + 1 : dataProporcion?.contador_factura,
				contador_remision: typeDocument == 9 ? Number(dataProporcion?.contador_remision) + 1 : dataProporcion?.contador_remision,
			}
		}

		try {
			if(countPrint === 0 && !hideForm) {
				const promisesSubmit = [
					updateDocumentoApi(data),
					updateConsecutivoEmpresaApi(data_consecutivo),
				];
				if(bodyProporcion) {
					promisesSubmit.push(updateProporcion(bodyProporcion));
				}
				await Promise.all(promisesSubmit);
				// payments.map((pay) => {
				for (const pay of payments) {
					const data_payment = {
						tipo_pago_documento_id: null,
						tipo_pago_id: pay.type || 1,
						documento_id: currentDocumentID,
						fecha_registro: new Date().toISOString(),
						valor:
							Number(pay.type) === 1 
							&& parseFloat(pay.cost) > parseFloat(currentDocument?.total)
							&& !isNaN(parseFloat(currentDocument?.total))
								? Number(currentDocument?.total) || 0
								: Number(pay.cost) || 0,
						nombre: equalTypePayment(pay.type || 1),
					};
					
					await createTipoPagoDocumentoApi(data_payment);
				}
				// }),
				
				setCountPrint(1);
			}

			
			if(impresora === 1 || impresora === "" || impresora === 0)
			{
				generatePDF(payments, currentDocument, nameInvoiceScreen);
			} else if(impresora === 2)
			{
				setTimeout(() => {
					// setIsButtonVisible(false); // Hide the download button temporarily
					document.getElementById("download-link").click();
				}, 1000);
			}

			if(Number(data.resolucion_empresa_id) === 2 && autoElectronicInvoice)
			{
				sendXML(data, businessData, currentProducts, clients, resolutions, payments);
			}

			onCloseModal(true);
			resetListSales();
		} catch (err) {
			toast.warning('Ocurrió un error al intentar  imprimir.');
			console.log(err)
			setInProgressPrint(false);
		} finally {
			setInvoice(false);
		}

	}

	const sendXML = async (find, businessData, currentProducts, clients, resolution, payments) => {
		const business = businessData.find( item => item.empresa_id == logged?.empresa_id );
		const cliente = find.cliente_id ? find.cliente_id : 1;
		const cl = clients.find( item => item.cliente_id ==  cliente);

		try {
			const json = await setXML(find, business, currentProducts, cl, resolution, payments[0].type)

			const data = await sendFacturaElectronica(json);

			console.log(data.data.message);

			if(data.data.cufe)
			{
				const documentupdt = {
					...find,
					cufe: data.data.cufe,
					qrcode: data.data.QRStr,
					invoice_id: 2
				}
				await updateDocumentoApi(documentupdt);
			}
		} catch (err) {
			// toast.warning(err.message);
			console.log(err);
		}
	}

	const operations = (items) => {
		let discountTotal = formValues.descuento ?? 0;
		const operator = discountTotal > 0 ? 1 : -1
	
		const newProducts = items.map(product => {
		  const pct = Math.abs(discountTotal) / 100;
		  const pctValueParcial = Number(product.parcial) * Number(pct);
		  const pctValueUnit = Number(product.unitario) * Number(pct);
		  // const productPeso = productsOpt.find(item => item.producto_id === product.producto_id);
	
		  return {
			...product,
			parcial: operator === -1 ? (Number(product.parcial) - Number(pctValueParcial)) : (Number(product.parcial) + Number(pctValueParcial)),
			unitario: operator === -1 ? (Number(product.unitario) - Number(pctValueUnit)) : (Number(product.unitario) + Number(pctValueUnit)),
		  };
		});
	
		let totalProducts = 0;
		let pesoTotal = 0;
		let totalIVA = 0;
		let totalNoIVA = 0;
		let parcialesIVA = {
		  iva19: 19,
		  totalWithoutIVA19: 0,
		  onlyIVA19: 0,
		  iva5: 5,
		  totalWithoutIVA5: 0,
		  onlyIVA5: 0,
		  iva0: 0,
		  totalWithoutIVA0: 0,
		  onlyIVA0: 0
		};
	
		newProducts.forEach(item => {
		  totalProducts += Number(item.parcial);
	
		  if (Number(item.impuesto_producto) == 19) {
			const value19 = parseFloat(item.parcial) / 1.19;
			parcialesIVA.totalWithoutIVA19 += Number(value19);
			parcialesIVA.onlyIVA19 += parseFloat(item.parcial) - Number(value19);
	
			totalIVA += Number(item.parcial) - Number(value19);
			totalNoIVA += Number(value19);
		  }
	
		  if (Number(item.impuesto_producto) == 5) {
			const value5 = parseFloat(item.parcial) / 1.05;
			parcialesIVA.totalWithoutIVA5 += Number(value5);
			parcialesIVA.onlyIVA5 += parseFloat(item.parcial) - Number(value5);
	
	
			totalIVA += Number(item.parcial) - Number(value5);
			totalNoIVA += Number(value5);
		  }
	
		  if (Number(item.impuesto_producto) == 0 || item.impuesto === null) {
			const value0 = parseFloat(item.parcial) / 1;
			parcialesIVA.totalWithoutIVA0 += Number(value0);
			parcialesIVA.onlyIVA0 += parseFloat(item.parcial) - Number(value0);
	
	
			totalIVA += 0;
			totalNoIVA += Number(value0);
		  }
		});
	
		items.forEach(product => {
		  const productPeso = productsOpt.find(item => item.producto_id == product.producto_id)
		  pesoTotal += productPeso?.peso ? parseFloat(productPeso.peso) * parseFloat(product.cantidad) : 0;
		});
	
		setTotal(totalProducts);
		setTotalKG(pesoTotal);
		setShowIva(parcialesIVA);
		setShowTotalSoloIVA(totalIVA);
		setTotalSinIVA(totalNoIVA);
	}

	const setTypePayment = (e) => {
		let val = e.target.value;

		if (val == "") {
			val = 1;
		}

		if (e.key == "Enter") {
			if (val < 1 || val > 6 || isNaN(val)) {
				toast.warning('Tipo de pago no válido');
				return;
			}

			costPaymentRef.current.focus();
		}
	}

	const printClick = (e) => {
		if (e.key == 'Enter') {
			if (activatePaymentType) {
				typePaymentRef.current.focus()
			} else {
				costPaymentRef.current.focus();
			}
		}
	}

	// const setCostPayment = (e) => {
	// 	let val = e.target.value;

	// 	if (e.key == "Enter") {
	// 		if (formValues.tipo_pago != "" && val == "") {
	// 			if(payments.length > 0) {
	// 				typePaymentRef.current.focus();
	// 				return;
	// 			}
	// 			val = currentDocument?.total;
	// 		}

	// 		if (val == 0) {
	// 			typePaymentRef.current.focus();
	// 			return;
	// 		}

	// 		if (val == "") {
	// 			const payment = {
	// 				type: 1,
	// 				cost: currentDocument?.total
	// 			}

	// 			if (payments.some(it => it.type == 1 && it.cost == currentDocument?.total)) {
	// 				resolutionRef.current.focus();
	// 				return;
	// 			}

	// 			if (payments.some(it => it.type == 1)) {
	// 				let find = payments.findIndex(it => it.type == payment.type);
	// 				const newArr = payments.splice(find, 1);
	// 				setPayments(newArr);
	// 			}

	// 			setPayments([...payments, payment]);
	// 		} else {
	// 			const payment = {
	// 				type: !activatePaymentType ? 1 : formValues.tipo_pago,
	// 				cost: Number(val).toFixed(2)
	// 			}

	// 			if (payments.some(it => it.type == payment.type && it.cost == payment.cost)) {
	// 				resolutionRef.current.focus();
	// 				return
	// 			}

	// 			if (payments.some(it => it.type == payment.type)) {
	// 				let find = payments.findIndex(it => it.type == payment.type);
	// 				const newArr = payments.splice(find, 1);
	// 				setPayments(newArr);
	// 			}

	// 			resolutionRef.current.focus();
	// 			form.setFieldsValue({
	// 				tipo_pago: 1,
	// 				valor_pago: null
	// 			});
	// 			setPayments([...payments, payment]);
	// 		}
	// 	}
	// }
	const setCostPayment = (e) => {
		let val = e.target.value;
	
		if (e.key == "Enter") {
			if (formValues.tipo_pago != "" && val == "") {
				if(payments.length > 0) {
					typePaymentRef.current.focus();
					return;
				}
				val = currentDocument?.total;
			}
	
			if (val == 0) {
				typePaymentRef.current.focus();
				return;
			}
	
			if (val == "") {
				const payment = {
					type: 1,
					cost: Number(currentDocument?.total)
				}
	
				if (payments.some(it => it.type == 1 && it.cost == currentDocument?.total)) {
					resolutionRef.current.focus();
					return;
				}
	
				if (payments.some(it => it.type == 1)) {
					let find = payments.findIndex(it => it.type == payment.type);
					payments.splice(find, 1);
					setPayments([...payments]);
				}
	
				setPayments([...payments, payment]);
			} else {
				const payment = {
					type: !activatePaymentType ? 1 : formValues.tipo_pago,
					cost: Number(val).toFixed(2)
				}
	
				if (payments.some(it => it.type == payment.type && it.cost == payment.cost)) {
					resolutionRef.current.focus();
					return
				}
	
				if (payments.some(it => it.type == payment.type)) {
					let find = payments.findIndex(it => it.type == payment.type);
					payments.splice(find, 1);
					setPayments([...payments]);
				}
	
				resolutionRef.current.focus();
				form.setFieldsValue({
					tipo_pago: 1,
					valor_pago: null
				});
				formValues.tipo_pago = 1;
				setPayments([...payments, payment]);
			}
		}
	}
	

	const equalTypePayment = (val = null) => {
		let data = [
			{ val: 1, text: 'Efectivo' },
			{ val: 2, text: 'Crédito' },
			{ val: 3, text: 'Cheque' },
			{ val: 4, text: 'Consignación' },
			{ val: 5, text: 'Tarjeta' },
			{ val: 6, text: 'Vale' }
		];

		return data.find(item => item.val == val)?.text || null;
	}

	const removePay = (index) => {
		setPayments(payments.filter((item, idx) => idx != index));
	}

	const setPrintInScreen = (e) => {
		let val = e.target.value;

		if (val == "") {
			val = 'N';
		}

		if (val == 's' || val == 'n' || val == 'S' || val == 'N') {
			printContinueRef.current.focus();
		} else {
			toast.warning('Expresión no válida');
			return;
		}

		if (val == 'S' || val == 's') {
			setNameInvoiceScreen(true);
		}
	}

	const setPrintContinue = (e) => {
		let val = e.target.value;

		if (val == "") {
			val = 'S';
		}

		if (val == 's' || val == 'n' || val == 'S' || val == 'N') {
			
			if(payments.some( item => Number(item.type) === 2 && currentDocument.cliente_id === 1))
			{
				toast.warn('No se puede pagar con crédito cuando el cliente es varios.');
				return;
			}

			setInProgressPrint(true);
			onSubmit();
		} else {
			toast.warning('Expresión no válida');
			return;
		}
	}

	const resetForm = () => {
		form.resetFields();
		formReset();
	}

	const onCloseModal = (pressSubmit = false) => {
		setShowModalPrintSale(false);
		if(pressSubmit) updateImpresoFromDocumento(currentDocumentID);
		resetForm();

		setPayments([]);
		setSaldo(0);
		setCambio(0);
		setNameInvoiceScreen(false);
		setCountPrint(0);
		setTimeout(() => {
			setCurrentDocument(null);
			localStorage.removeItem('paymentInPrint');
		}, 2000);
	}

	useEffect(() => {
		if (showModalPrintSale) {

			resetForm();
			setPayments([]);
			setSaldo(0);
			setCambio(0);
			setCurrentDocument(null);
			setLoadingPrint(true)
			setInProgressPrint(false);
			setTotal(0),
			setTotalKG(0),
			setShowIva(null),
			setShowTotalSoloIVA(0),
			setTotalSinIVA(0)
			setTipoImpresion(null);
			localStorage.removeItem('paymentInPrint');

			if (currentDocumentID) {
				const promises = [
					listResolutions(logged?.empresa_id),
					getDocumentoByID(currentDocumentID),
					getPrinters(logged?.empresa_id),
					getClients(logged?.empresa_id)
				];

				setProductsDocument(currentProducts);
				operations(currentProducts);

				Promise.all(promises)
                .then(() => { setLoadingPrint(false) })
                .catch(() => console.log('Ocurrió un error mientras se obtenían los datos de impresión.'))
				.finally( () => {
					setTimeout(() => {
						typePaymentRef?.current?.focus();
						discountRef?.current?.focus();
						printRef?.current?.focus();
					}, 200);
				})
			}
		}

	}, [showModalPrintSale, currentDocumentID])
	
	useEffect(() => {
		let totals = 0;
		let saldoTotal = currentDocument && currentDocument.total;

		payments.forEach(item => {
			totals += Number(item.cost);
		});

		const newSaldo = Number(saldoTotal) - Number(totals);
		setSaldo(newSaldo);
		setTotalToPay(totals);

		if (totals < currentDocument?.total) {
			typePaymentRef?.current?.focus();
		}

		setCambio(payments.length > 0 ? Math.sign(newSaldo) > 0 ? '-' + newSaldo : newSaldo * -1 : 0);
	}, [payments])

	useEffect(() => {
		if (currentDocument && showModalPrintSale) {
			setSaldo(currentDocument.total);
			getBusiness();
		}
	}, [currentDocument])

	useEffect(() => {
	  if(inProgressPrint) {
		setHideForm(true);
	  }else {
		setHideForm(false);
	  }
	}, [inProgressPrint])
	
	
	return (
		<Modal
			title="Imprimir"
			visible={showModalPrintSale}
			onCancel={() => { onCloseModal() }}
			okButtonProps={{ style: { display: 'none' } }}
			cancelButtonProps={{ style: { display: 'none' } }}
			footer={false}
			forceRender
		>
			{
				!hideForm && countPrint == 0 && (

				<Form
					form={form}
					layout='vertical'
					initialValues={{
						descuento: "",
						impresora: "",
					}}
				>
					<Row gutter={24}>

						<span style={{ margin: '0 1em' }}>
							<span>
								<strong>
									Total a pagar: ${currentDocument?.total || 0}
								</strong>
							</span><br />
							<span>
								<strong>
									Saldo: {saldo}
								</strong>
							</span><br />
						</span><br />

						<Divider />

						{
							activateDiscount && (
								<Col span={multiPrinters ? 12 : 24}>
									<Form.Item name="descuento" label="Descuento">
										<Input
											addonAfter="%"
											name='descuento'
											ref={discountRef}
											onChange={handleInputChange}
											placeholder='Descuento'
											min="0"
											max="100"
											onKeyDown={e => discountClick(e)}
										/>
									</Form.Item>
								</Col>
							)
						}
						{
							multiPrinters && (
								<Col span={activateDiscount ? 12 : 24}>
									<Form.Item name="impresora" label="Impresora">
										<Input
											name='impresora'
											ref={printRef}
											onChange={handleInputChange}
											placeholder='Impresora'
											onKeyDown={e => printClick(e)}
										/>
									</Form.Item>
								</Col>
							)
						}

						<Divider />

						<span style={{ margin: 'auto' }}>
							<strong>
								1.Efectivo 2.Credito 3.Cheque 4.Consignación 5.Tarjeta 6.Vale.
							</strong>
						</span><br />

						<Divider />

						{
							activatePaymentType && (
								<Col span={12}>
									<Form.Item name="tipo_pago" label="Tipo de pago">
										<Input
											name='tipo_pago'
											ref={typePaymentRef}
											onChange={handleInputChange}
											placeholder='Tipo de pago'
											onKeyDown={e => setTypePayment(e)}
										/>
									</Form.Item>
								</Col>
							)}
						<Col span={!activatePaymentType ? 24 : 12}>
							<Form.Item name="valor_pago" label="Valor de pago">
								<Input
									name='valor_pago'
									ref={costPaymentRef}
									onChange={handleInputChange}
									placeholder='Valor de pago'
									onKeyDown={e => setCostPayment(e)}
								/>
							</Form.Item>
						</Col>

						<Divider />

						{
							payments.length > 0 && (
								<div style={{ margin: 'auto', textAlign: 'center' }}>
									{
										payments.map((payment, idx) => (
											<p
												key={idx}
												style={{ marginTop: '0.3em' }}
											>
												<strong>
													Tipo: {equalTypePayment(payment.type)}&nbsp;
													- Valor: ${payment.cost}&nbsp;
													<Button
														size='middle'
														type='default'
														onClick={() => removePay(idx)}
													>
														<DeleteOutlined />
													</Button>
												</strong>
											</p>
										))
									}
								</div>
							)
						}

						<Divider />

						<span style={{ margin: 'auto' }}>
							<strong>
								1.resolucion por defecto
								2.resolucion factura electronica
							</strong>
						</span><br />

						<p style={{ margin: 'auto' }}>
							<strong>
								Cambio: {cambio}
							</strong>
						</p>

						<Divider />

						<Col span={24}>
							<Form.Item name="resolucion" label="Resolución">
								<Input
									name='resolucion'
									ref={resolutionRef}
									onChange={handleInputChange}
									placeholder='Resolución'
									onKeyDown={e => setClickResolution(e)}
								/>
							</Form.Item>
						</Col>

						<Divider />

						<h3 style={{ margin: 'auto' }}>
							<strong>
								Cambio: 0
							</strong>
						</h3>

						<Divider />

						{
							printScreen && (
								<Col span={12}>
									<Form.Item name="imprimir_pantalla" label="Imprimir en pantalla? S/N">
										<Input
											name='imprimir_pantalla'
											ref={printScreenRef}
											onChange={handleInputChange}
											placeholder='Imprimir en pantalla? S/N'
											onKeyDown={e => e.key == 'Enter' && setPrintInScreen(e)}
										/>
									</Form.Item>
								</Col>
							)
						}
						{
							!hideForm && (
								<Col span={printScreen ? 12 : 24}>
									<Form.Item name="continuar_impresion" label="Continuar impresión? S/N">
										<Input
											name='continuar_impresion'
											ref={printContinueRef}
											onChange={handleInputChange}
											placeholder='Continuar impresión? S/N'
											onKeyDown={e => e.key == 'Enter' && setPrintContinue(e)}
										/>
									</Form.Item>
								</Col>
							)
						}

						<Divider />
					</Row>

				</Form> )
			}

			{showModalPrintSale && tipoImpresion === "PDF 50mm" && currentDocument ? 
				
					(
						<div id='factura' hidden>
							<FacturaPDF
								document={currentDocument}
								saldo={saldo}
								cambio={cambio}
								payments={payments}
								totalToPay={totalToPay}
								productsDocument={productsDocument}
								discountTotal={formValues.descuento ?? 0}
								resolutions={resolutions}
								productsOpt={productsOpt}
								businessData={businessData}
								invoice={invoice}
							/>
						</div>
					)
				
			: tipoImpresion === "PDF MEDIA CARTA" ?
			(
				<PDFDownloadLink
					document={
						<InvoicePDFMid 
							document={currentDocument}
							saldo={saldo}
							cambio={cambio}
							totalToPay={totalToPay}
							productsDocument={productsDocument}
							discountTotal={formValues.descuento ?? 0}
							resolutions={resolutions}
							productsOpt={productsOpt}
							businessData={businessData}
							invoice={invoice}
							total={total}
							totalKG={totalKG}
							showIva={showIva}
							showTotalSoloIVA={showTotalSoloIVA}
							totalSinIVA={totalSinIVA}
						/>
					}
					fileName={`FACTURA_DE_VENTA_CARTA.pdf`}
					id="download-link"
					// style={{ display: isButtonVisible ? "inline-block" : "none" }} // Toggle visibility using state
				>
				</PDFDownloadLink>
			) : ""}

		</Modal>
	)
}

function FacturaPDF({
	document,
	saldo,
	cambio,
	totalToPay,
	productsDocument,
	discountTotal,
	resolutions,
	productsOpt,
	businessData,
	invoice
}) {
	return ( 
		<>
			<InvoicePDFLittle 
				document={document}
				saldo={saldo}
				cambio={cambio}
				totalToPay={totalToPay}
				productsDocument={productsDocument}
				discountTotal={discountTotal}
				resolutions={resolutions}
				productsOpt={productsOpt}
				businessData={businessData}
				invoice={invoice}
			/>
		</>
	)
}

export default PrintComponent;