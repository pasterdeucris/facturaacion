import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Row, Col, Divider, Button, Select, Spin } from 'antd';
import { toast } from 'react-toastify';
import { DeleteOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';

import LogoFactura from '../../../assets/logoempresa.jpg';

import { useForm } from '../../../hooks/useForm';
import { getClientsApi } from '../../../api/client';
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

	const { printScreen, multiPrinters, activateDiscount, activatePaymentType, onProporcion } = useActivations(logged);

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

	const discountRef = useRef(null);
	const printRef = useRef(null);
	const typePaymentRef = useRef(null);
	const costPaymentRef = useRef(null);
	const resolutionRef = useRef(null);
	const printScreenRef = useRef(null);
	const printContinueRef = useRef(null);

	// const getDocuments = async (businessID, userID, documentoID) => {
	// 	try {
	// 		const response = await getDocumentsApi(businessID, userID);
	// 		const found = response.find(item => item.documento_id == documentoID);
	// 		setCurrentDocument(found);
	// 	} catch (err) {
	// 		console.log(err)
	// 		toast.warning('Ocurrió un error al intentar traer los documentos.');
	// 	}
	// }

	const getDocumentoByID = async (documentoID) => {
		try {
			const response = await getByDocumentoIdApi(documentoID);
			setCurrentDocument(response[0]);
		} catch (err) {
			console.log(err)
			toast.warning('Ocurrió un error al intentar traer el documento por su id.');
		}
	}

	// const getDocuments = async (document) => {
	// 	try {
	// 		setCurrentDocument(document);
	// 	} catch (err) {
	// 		console.log(err)
	// 		toast.warning('Ocurrió un error al intentar traer los usuarios.');
	// 	}
	// }

	const getBusiness = async () => {
		try {
			const response = await getBusinessApi();
			setBusinessData(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las las empresas.');
		}
	}

	// const getProductsByBusiness = async (businessID) => {
	// 	try {
	// 		const response = await getProductsByBusinessApi(businessID);
	// 		setProductsOpt(response)
	// 	} catch (err) {
	// 		console.log(err);
	// 		toast.warning('Error al obtener los productos de mi empresa.');
	// 	}
	// }

	// const listUsers = async (businessID) => {
	// 	try {
	// 		const response = await getUsersApi(businessID);
	// 		setUsers(response);
	// 	} catch (err) {
	// 		console.log(err)
	// 		toast.warning('Ocurrió un error al intentar traer los usuarios.');
	// 	}
	// }

	// const listClients = async (businessID) => {
	// 	try {
	// 		const response = await getClientsApi(businessID);
	// 		setClients(response);
	// 	} catch (err) {
	// 		console.log(err)
	// 		toast.warning('Ocurrió un error al intentar traer los clientes.');
	// 	}
	// }

	// const listDocumentoProducts = async (documentID) => {
	// 	try {
	// 		const response = await getDocumentoDetalleAPI(documentID);
	// 		setProductsDocument(response);
	// 	} catch (err) {
	// 		console.log(err)
	// 		toast.warning('Ocurrió un error al intentar traer los productos del documento.');
	// 	}
	// }

	const listResolutions = async (id) => {
		let resolucion = formValues?.resolucion ? formValues?.resolucion : 1

		// if(currentDocument?.tipo_documento_id === 9 && Number(resolucion) === 2) {
		// 	toast.warn("Si el documento es nro de guía no puede ser factura electronica.");
		// 	onCloseModal();
		// 	return;
		// }

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

		setInvoice(true);

		let bodyProporcion;

		const discount = formValues.descuento;

		const typeDocument = determineDocument(
			dataProporcion?.base,
			dataProporcion?.variable, 
			dataProporcion?.contador_factura, 
			dataProporcion?.contador_remision
		);

		const data = {
			...currentDocument,
			tipo_documento_id: onProporcion ? typeDocument : currentDocument?.tipo_documento_id,
			descuento: discount,
			// resolucion_empresa_id: 1,
			resolucion_empresa_id: formValues.resolucion ? Number(formValues.resolucion) : 1,
			consecutivo_dian: onProporcion && typeDocument === 9 ? resolutions.consecutivo - 5 : resolutions.consecutivo + 1,
			letra_consecutivo: resolutions.letra_consecutivo,
			impreso: 1,
			impresora: 1,
			invoice_id: 1,
			saldo: saldo,
			excento: vrExcento.toFixed(2),
			gravado: vrGravado.toFixed(2),
			iva: vrIva.toFixed(2),
			iva_5: Number(vrIva5).toFixed(2),
			iva_19: vrIva19.toFixed(2),
			base_5: vrBaseIva5.toFixed(2),
			base_19: vrBaseIva19.toFixed(2),
			total: formValues.descuento !== 0 ? vrTotal.toFixed(2) : currentDocument?.total
		}

		// if(data.tipo_documento_id === 9 && data.resolucion_empresa_id === 2) {
		// 	toast.warn("Si el documento es nro de guía no puede ser factura electronica.");
		// 	onCloseModal();
		// 	return;
		// }

		if(data.tipo_documento_id === 9 && data.cliente_id !== 1) {
			toast.warn("Si el documento es nro de guía solo puede ser cliente Consumidor Final.");
			onCloseModal();
			return;
		}

		const data_consecutivo = {
			...resolutions,
			consecutivo: onProporcion && typeDocument === 9 ? resolutions.consecutivo : resolutions.consecutivo + 1,
		}

		if(onProporcion) {
			bodyProporcion = {
				...dataProporcion,
				contador_factura: typeDocument == 10 ? Number(dataProporcion?.contador_factura) + 1 : dataProporcion?.contador_factura,
				contador_remision: typeDocument == 9 ? Number(dataProporcion?.contador_remision) + 1 : dataProporcion?.contador_remision,
			}
		}

		// console.log(bodyProporcion)

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
						Number(pay.type) === 1 && parseFloat(pay.cost) > parseFloat(currentDocument?.total)
							? (Number(currentDocument?.total) || 0)
							: (Number(pay.cost) || 0),
						nombre: equalTypePayment(pay.type || 1),
					};
					
					await createTipoPagoDocumentoApi(data_payment);
				}
				// }),
				
				setCountPrint(1);
			}

			  generatePDF();
			  onCloseModal(true);
			  resetListSales();
			//   setInProgressPrint(false);
			  
			// payments.forEach(async pay => {
			// 	const data_payment = {
			// 		tipo_pago_documento_id: null,
			// 		tipo_pago_id: pay.type,
			// 		documento_id: currentDocument?.documento_id,
			// 		fecha_registro: new Date().toISOString(),
			// 		valor: pay.cost,
			// 		nombre: equalTypePayment(pay.type)
			// 	}

			// 	await createTipoPagoDocumentoApi(data_payment);
			// });

			// for (const pay of payments) {
			// 	const data_payment = {
			// 		tipo_pago_documento_id: null,
			// 		tipo_pago_id: pay.type,
			// 		documento_id: currentDocument?.documento_id,
			// 		fecha_registro: new Date().toISOString(),
			// 		valor: Number(pay.type) === 1 && parseFloat(pay.cost) > parseFloat(currentDocument?.total) ? (currentDocument?.total || 0) : pay.cost,
			// 		nombre: equalTypePayment(pay.type)
			// 	};
				
			// 	await createTipoPagoDocumentoApi(data_payment);
			// }
		} catch (err) {
			toast.warning('Ocurrió un error al intentar  imprimir.');
			console.log(err)
			setInProgressPrint(false);
		} finally {
			setInvoice(false);
		}

	}

	const generatePDF = () => {
		document.querySelector("#factura").removeAttribute("hidden");
		let doc = new jsPDF("p", "mm", [297, 80]);

		// if(Number(formValues.tipo_pago) == 4 || Number(formValues.tipo_pago) == 5)
		if(payments.some(payment => Number(payment.type) === 4 || Number(payment.type) === 5))
		
		{
			// for (let index = 0; index < 2; index++) {
				doc.html(document.querySelector("#factura"), {
					callback: (pdf) => {
						let nameInvoice = '';
						if(currentDocument?.tipo_documento_id == 4) {
							nameInvoice = `COTIZACION_${currentDocument?.documento_id}`;
						} else {
							nameInvoice = nameInvoiceScreen ? `FACTURA_DE_VENTA_PANTALLA_${currentDocument?.documento_id}` : `FACTURA_DE_VENTA_${currentDocument?.documento_id}`;
						}

						pdf.save(`${nameInvoice}.pdf`);
						pdf.save(`${nameInvoice}(1).pdf`);
						document.querySelector("#factura").setAttribute("hidden", "true");

					},
					x: 10,
					y: 10
				});
			// }
		} else {
			doc.html(document.querySelector("#factura"), {
				callback: (pdf) => {
					let nameInvoice = '';
					if(currentDocument?.tipo_documento_id == 4) {
						nameInvoice = `COTIZACION_${currentDocument?.documento_id}`;
					} else {
						nameInvoice = nameInvoiceScreen ? `FACTURA_DE_VENTA_PANTALLA_${currentDocument?.documento_id}` : `FACTURA_DE_VENTA_${currentDocument?.documento_id}`;
					}

					pdf.save(`${nameInvoice}.pdf`);
					document.querySelector("#factura").setAttribute("hidden", "true");
				},
				x: 10,
				y: 10
			});
		}
		
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

	const setCostPayment = (e) => {
		let val = e.target.value;

		if (e.key == "Enter") {
			if (formValues.tipo_pago != "" && val == "") {
				if(payments.length > 0) {
					typePaymentRef.current.focus();
					return;
				}
				// formValues.tipo_pago = currentDocument?.total;
				val = currentDocument?.total;
				// toast.warn('Cantidad inválida');
				// return;
			}

			if (val == 0) {
				typePaymentRef.current.focus();
				return;
			}

			if (val == "") {
				const payment = {
					type: 1,
					cost: currentDocument?.total
				}

				if (payments.some(it => it.type == 1 && it.cost == currentDocument?.total)) {
					resolutionRef.current.focus();
					return;
				}

				if (payments.some(it => it.type == 1)) {
					let find = payments.findIndex(it => it.type == payment.type);
					const newArr = payments.splice(find, 1);
					setPayments(newArr);
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
					const newArr = payments.splice(find, 1);
					setPayments(newArr);
				}

				resolutionRef.current.focus();
				form.setFieldsValue({
					tipo_pago: 1,
					valor_pago: null
				});
				setPayments([...payments, payment]);
			}

			// typePaymentRef.current.focus();

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
		setCurrentDocument(null);
		setNameInvoiceScreen(false);
		setCountPrint(0);
		localStorage.removeItem('paymentInPrint');
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
			localStorage.removeItem('paymentInPrint');

			if (currentDocumentID) {
				const promises = [
					// listUsers(logged?.empresa_id),
					// listClients(logged?.empresa_id),
					// listDocumentoProducts(currentDocumentID),
					listResolutions(logged?.empresa_id),
					getDocumentoByID(currentDocumentID),
					// getDocuments(logged?.empresa_id, logged?.userID, currentDoc?.content?.documento_id),
					// getDocuments(currentDoc?.content),
					// getProductsByBusiness(logged?.empresa_id),
				];

				setProductsDocument(currentProducts),

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
			typePaymentRef.current.focus();
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
			// onOk={(e) => onSubmit(e)}
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
								<div style={{ margin: 'auto' }}>
									{
										payments.map((payment, idx) => (
											<p
												key={idx}
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
											// onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), setPrintContinue(e))}
											// disabled={ inProgressPrint }
										/>
									</Form.Item>
								</Col>
							)
						}

						<Divider />
					</Row>

				</Form> )
			}

			{showModalPrintSale && <div id='factura' hidden>
				{
					currentDocument && (
						<FacturaPDF
							document={currentDocument}
							saldo={saldo}
							cambio={cambio}
							payments={payments}
							totalToPay={totalToPay}
							// users={users}
							// clients={clients}
							productsDocument={productsDocument}
							discountTotal={formValues.descuento ?? 0}
							resolutions={resolutions}
							productsOpt={productsOpt}
							businessData={businessData}
							invoice={invoice}
						/>
					)
				}
			</div>}

		</Modal>
	)
}

function FacturaPDF({
	document,
	saldo,
	cambio,
	// payments,
	totalToPay,
	// users,
	// clients,
	productsDocument,
	discountTotal,
	resolutions,
	productsOpt,
	businessData,
	invoice
}) {

	const [allProducts, setAllProducts] = useState([]);
	const [total, setTotal] = useState(0);
	const [totalKG, setTotalKG] = useState(0);
	const [showIva, setShowIva] = useState({});
	const [showTotalSoloIVA, setShowTotalSoloIVA] = useState(0)
	const [totalSinIVA, setTotalSinIVA] = useState(0);
	const dayjs = useDayjs(); 

	const payments = JSON.parse(localStorage.getItem('paymentInPrint')) || [];

	// const convertUserName = (userID) => {
	// 	const u = users.find(user => user.usuario_id == userID);
	// 	return `${u?.nombre}`;
	// }

	// const convertLastName = (userID) => {
	// 	const u = users.find(user => user.usuario_id == userID);
	// 	return `${u?.apellido}`;
	// }

	// const convertClientName = (clientID) => {
	// 	let c = null;

	// 	if (clientID) {
	// 		c = clients.find(client => client.cliente_id == clientID);
	// 	} else {
	// 		c = clients.find(client => client.cliente_id == 1);
	// 	}

	// 	return `${c?.nombre} ${c?.apellidos}`;
	// }

	// const convertClientNit = (clientID) => {
	// 	let c = null;

	// 	if (clientID) {
	// 		c = clients.find(client => client.cliente_id == clientID);
	// 	} else {
	// 		c = clients.find(client => client.cliente_id == 1);
	// 	}

	// 	return `${c?.documento}`;
	// }

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

	useEffect(() => {
		// const newProducts = productsDocument.map(product => {

		// 	const pct = parseFloat(discountTotal) / 100;
		// 	const pctValueParcial = parseFloat(product.parcial) * pct;
		// 	const pctValueUnit = parseFloat(product.unitario) * pct;
		// 	const productPeso = productsOpt.find(item => item.producto_id == product.producto_id)

		// 	return {
		// 		...product,
		// 		parcial: parseFloat(product.parcial) + parseFloat(pctValueParcial),
		// 		unitario: parseFloat(product.unitario) + parseFloat(pctValueUnit),
		// 	}
		// });
		
		if(!invoice) return;

		const operator = discountTotal > 0 ? 1 : -1

		const newProducts = productsDocument.map(product => {
			const pct = Math.abs(discountTotal) / 100;
			const pctValueParcial = Number(product.parcial) * Number(pct);
			const pctValueUnit = Number(product.unitario) * Number(pct);
			// const productPeso = productsOpt.find(item => item.producto_id === product.producto_id);
			
			return {
				...product,
				parcial: operator === -1  ? (Number(product.parcial) - Number(pctValueParcial)) : (Number(product.parcial) + Number(pctValueParcial)),
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

		productsDocument.forEach(product => {
			const productPeso = productsOpt.find(item => item.producto_id == product.producto_id)
			pesoTotal += productPeso?.peso ? parseFloat(productPeso.peso) * parseFloat(product.cantidad) : 0;
		});

		setAllProducts(newProducts);
		setTotal(totalProducts);
		setTotalKG(pesoTotal);
		setShowIva(parcialesIVA);
		setShowTotalSoloIVA(totalIVA);
		setTotalSinIVA(totalNoIVA);
	}, [document, invoice])


	return (
		<div style={{ fontSize: '2px', width: '60px' }}>
			<div style={{ textAlign: 'center' }}>
				<img
					src={LogoFactura}
					alt="Logo-factura"
					width="70%"
				/>

				<h5 style={{ fontWeight: '800' }}>
					{'<<' + businessData[0]?.nombre  +  '>>'}
				</h5>
				<span>NIT. {businessData[0]?.nit} - {businessData[0]?.digito_verificacion} - {businessData[0]?.regimen}</span><br />
				<span>{businessData[0]?.direccion} - {businessData[0]?.barrio}</span><br />
				<span>{businessData[0]?.ciudad} ({businessData[0]?.departamento})</span><br />
				<span>
					<strong>
						{
							document.tipo_documento_id == 10 ? 'FACTURA ELECTRONICA DE VENTA' :
								document.tipo_documento_id == 9 ? 'NO DE GUIA' :
								document.tipo_documento_id == 4 ? 'COTIZACIÓN' :
									'FACTURA'
						} : {resolutions?.letra_consecutivo}{resolutions.consecutivo + 1}
					</strong>
				</span><br />
			</div>
			<span>
				Fecha: 
				{
					dayjs.utc(document?.fecha_registro)
					// .subtract(5, 'hours')
					.tz(dayjs.tz.guess())
					.format("YYYY-MM-DD HH:mm:ss")
				}
			</span><br />
			<span>Senor(a): {document.c_nombre} {document.c_apellido} </span><br />
			<span>C.C./NIT: {document.doc_cliente}</span><br />
			<span>TEL: {businessData[0]?.cel} - {businessData[0]?.telefono_fijo || ""}</span><br />
			{/* <span>{ businessData[0]?.slogan || ""}</span><br /> */}
			<span>
				{businessData[0]?.represente}
			</span><br />
			<span>{businessData[0]?.regimen}</span><br />

			<span>Cajero: {document.u_nombre} {document.u_apellido}</span><br />
			<span>Caja: </span><br />
			<div style={{ display: 'flex', flexWrap: 'wrap', width: '60px', fontSize: '2px', marginBottom: '2px' }}>
				<div style={{ flex: '1', textAlign: 'center', borderTop: '0.2px dashed', borderBottom: '0.2px dashed' }}>
					Cod id -Cant
				</div>
				<div style={{ flex: '1', textAlign: 'center', borderTop: '0.2px dashed', borderBottom: '0.2px dashed' }}>
					Descripción
				</div>
				<div style={{ flex: '1', textAlign: 'center', borderTop: '0.2px dashed', borderBottom: '0.2px dashed' }}>
					Unida
				</div>
				<div style={{ flex: '1', textAlign: 'center', borderTop: '0.2px dashed', borderBottom: '0.2px dashed' }}>
					IVA
				</div>
			</div>
			{
				allProducts.length ? allProducts.map((item, index) => (
					<div key={index} style={{ display: 'flex', flexWrap: 'wrap', width: '60px', fontSize: '2px', alignItems: 'center', }}>
						<div style={{ flex: '1', textAlign: 'center', minHeight: 'auto' }}>
							<span>
								{item.producto_id}
							</span>
							<br />
							<span>
								{Number(item.cantidad).toFixed(2)}
							</span>
						</div>
						<div style={{ flex: '2', textAlign: 'center', minHeight: 'auto' }}>
							{item.descripcion}
							<br />
							<span>
							{new Intl.NumberFormat('es-ES').format(Number(item.parcial))}
							</span>
						</div>
						<div style={{ flex: '1', textAlign: 'center', minHeight: 'auto' }}>
							{new Intl.NumberFormat('es-ES').format(Number(item.unitario))}
						</div>
						<div style={{ flex: '1', textAlign: 'center', minHeight: 'auto' }}>
							{item.impuesto_producto}
						</div>
					</div>
				)) : null}
			
			<div style={{ borderTop: '0.5px dashed', marginTop: '2px' }}></div>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>Total antes de IVA:</span>
				<span>{new Intl.NumberFormat('es-ES').format(Number(totalSinIVA))}</span>
			</div>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>Total IVA:</span>
				<span>{new Intl.NumberFormat('es-ES').format(showTotalSoloIVA)}</span>
			</div>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>ImpoConsumo:</span>
				<span>0</span>
			</div>
			{/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>Valor Exento:</span>
				<span>{total.toFixed(2)}</span><br />
			</div> */}
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>Total documento:</span>
				<span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('es-ES').format(total)}</span>
			</div>
			{/* <span>Valor descuento: {discountTotal}%</span><br />
			<span>Peso total: {totalKG}</span><br /> */}
			<span>
				**** FORMA DE PAGO ****
			</span><br />
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>Descripcion:</span>
				<span>Valor</span>
			</div>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>
					{
						payments.length ? payments.map((item, index) => (
							<span key={index}>{equalTypePayment(item.type)}:</span>
						)) : ""
					}
				</span>
				<span>
					{
						payments.length ? payments.map((item, index) => (
							<span key={index}>{new Intl.NumberFormat('es-ES').format(item.cost)}</span>
						)) : ""
					}
				</span>
			</div>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>Cambio:</span>
				<span>{parseFloat(totalToPay) - parseFloat(total)}</span>
			</div>
			<div style={{ borderTop: '0.5px dashed' }}>
				<span>Discriminacion de tarifas de IVA</span>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<span>Tarifa</span>
					<span>Vr. Base</span>
					<span>Vr. IVA</span>
				</div>
				{/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<span>{showIva?.iva0 ?? 0}</span>
					<span>{showIva?.totalWithoutIVA0 ?? 0}</span>
					<span>{showIva?.onlyIVA0 ?? 0}</span>
				</div> */}
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<span>{showIva?.iva5 ?? 5}</span>
					<span>{parseFloat(showIva?.totalWithoutIVA5).toFixed(2) ?? 0}</span>
					<span>{parseFloat(showIva?.onlyIVA5).toFixed(2) ?? 0}</span>
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<span>{showIva?.iva19 ?? 19}</span>
					<span>{parseFloat(showIva?.totalWithoutIVA19).toFixed(2) ?? 0}</span>
					<span>{parseFloat(showIva?.onlyIVA19).toFixed(2) ?? 0}</span>
				</div>
			</div>
			{/* <span>Paga con {totalToPay}</span><br /> */}
			<div style={{ borderTop: '0.5px dashed', textAlign: 'center' }}>
				<span style={{ fontSize: '2px' }}>Sistema POS.</span><br />
				<span style={{ fontSize: '2px' }}>Res. {resolutions.resolucion_dian} de Fecha: {resolutions.fecha_resolucion}</span><br />
				<span style={{ fontSize: '2px' }}>Vigencia resolucion 6 meses</span><br />
				<span style={{ fontSize: '2px' }}>Rango autorizado: {resolutions.letra_consecutivo}{resolutions.autorizacion_desde} a {resolutions.letra_consecutivo}{resolutions.autorizacion_hasta}</span><br />
				<span style={{ fontSize: '2px' }}> {resolutions.t_factura}</span><br />
				<span>{document.u_apellido}</span><br />
				<span style={{ fontSize: '2px' }}>
					***** Gracias&nbsp; por su compra *****
				</span><br />
				<span style={{ fontSize: '2px' }}>
					Software desarrollado por:
				</span><br />
				<span style={{ fontSize: '2px' }}>
					Sofmate soporte software 3112864974
				</span><br />
				<span style={{ fontSize: '2px' }}>
					Lic.by Johan Ordoñez nit. 10305527-6
				</span><br />
			</div>
		</div>
	)
}

export default PrintComponent;