import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

import LogoFactura from '../../../../assets/logoempresa.jpg';

import { useForm } from '../../../../hooks/useForm';
import { getClientsApi } from '../../../../api/client';
import { getUsersApi } from '../../../../api/user';
import { getDocumentoDetalleAPI } from '../../../../api/document';
import { getBusinessApi } from '../../../../api/business';
import { getByDocumentoIdApi } from '../../../../api/nota';
import {
	getResolutionByBusinessApi,
	getProductsByBusinessApi
} from '../../../../api/sales';

import useDayjs from '../../../../hooks/useDays';


function PrintPreviewComponent({ showModalPrintPreviewSale, setShowModalPrintPreviewSale, logged, currentDoc }) {

	const [users, setUsers] = useState([]);
	const [clients, setClients] = useState([])
	const [productsDocument, setProductsDocument] = useState([]);
	const [productsOpt, setProductsOpt] = useState([]);
	const [businessData, setBusinessData] = useState([]);
	const [currentDocument, setCurrentDocument] = useState(null);

	const [payments, setPayments] = useState([]);
	const [resolutions, setResolutions] = useState([]);
	const [saldo, setSaldo] = useState(0);
	const [cambio, setCambio] = useState(0);
	const [totalToPay, setTotalToPay] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const [formValues, ] = useForm({
		descuento: 0,
		impresora: 0,
		tipo_pago: 1,
		valor_pago: 0,
		resolucion: 1,
		imprimir_pantalla: "",
		continuar_pantalla: "",
	});

	const getDocumentoByID = async (documentoID) => {
		try {
			const response = await getByDocumentoIdApi(documentoID);
			setCurrentDocument(response[0]);
			setPayments(response[0].tipo_pagos || []);
		} catch (err) {
			console.log(err)
			toast.warning('Ocurrió un error al intentar traer el documento por su id.');
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

	const getProductsByBusiness = async (businessID) => {
		try {
			const response = await getProductsByBusinessApi(businessID);
			setProductsOpt(response)
		} catch (err) {
			console.log(err);
			toast.warning('Error al obtener los productos de mi empresa.');
		}
	}

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

	const listDocumentoProducts = async (documentID) => {
		try {
			const response = await getDocumentoDetalleAPI(documentID);
			setProductsDocument(response);
		} catch (err) {
			console.log(err)
			toast.warning('Ocurrió un error al intentar traer los productos del documento.');
		}
	}

	const listResolutions = async (id) => {
		try {
			const response = await getResolutionByBusinessApi(id);
			const found = response.find( res => res.resolucion_empresa_id == 1 );
			setResolutions(found);
		} catch (err) {
			console.log(err)
			toast.warning('Ocurrió un error al intentar traer la resolución.');
		}
	}

	const onSubmit = async () => {
		try {
			setIsLoading(true);
			// await listUsers(logged?.empresa_id);
			// await listClients(logged?.empresa_id);
			await listDocumentoProducts(currentDoc?.documento_id);
			await listResolutions(1);
			await getBusiness();
			await getProductsByBusiness(logged?.empresa_id);

			setIsLoading(false);
			onCloseModal();
			generatePDF();
		} catch (error) {
			
		}

	}

	const generatePDF = () => {
		document.querySelector("#factura_copy").removeAttribute("hidden");

		let doc = new jsPDF("p", "mm", [297, 80]);
		doc.html(document.querySelector("#factura_copy"), {
			callback: (pdf) => {
				let nameInvoice = `FACTURA_DE_VENTA_${currentDoc?.documento_id}_false`;
				pdf.save(`${nameInvoice}.pdf`);
				document.querySelector("#factura_copy").setAttribute("hidden", "true");
			},
			x: 10,
			y: 10
		});
	}

	const onCloseModal = () => {
		setShowModalPrintPreviewSale(false);
		setPayments([]);
		setSaldo(0);
		setCambio(0);
	}

	useEffect(() => {
		if (showModalPrintPreviewSale && currentDoc) {
			getDocumentoByID(currentDoc?.documento_id);
			onSubmit();
		}
	}, [showModalPrintPreviewSale])

	useEffect(() => {
		if(payments.length) {
			let totals = 0;
			let saldoTotal = currentDoc && currentDoc.total;

			payments.forEach(item => {
				totals += Number(item.valor);
			});

			const newSaldo = Number(saldoTotal) - Number(totals);
			setSaldo(newSaldo);
			setTotalToPay(totals);

			setCambio(payments.length > 0 ? Math.sign(newSaldo) > 0 ? '-' + newSaldo : newSaldo * -1 : 0);
		}
	}, [payments])

	useEffect(() => {
		if (currentDoc) {
			setSaldo(currentDoc.total);
		}
	}, [currentDoc])

	return (
		<Modal
			title="Imprimir"
			visible={showModalPrintPreviewSale}
			onCancel={() => { onCloseModal() }}
			onOk={(e) => onSubmit(e)}
			okButtonProps={{ style: { display: 'none' } }}
			cancelButtonProps={{ style: { display: 'none' } }}
			footer={false}
			forceRender
		>
				{currentDoc && <div id='factura_copy' hidden>
				{
					(
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
							businessData={ businessData }
						/>
					)
				}
			</div>}
		</Modal>
	)
}

function FacturaPDF({
	document,
	payments,
	cambio,
	totalToPay,
	// users,
	// clients,
	productsDocument,
	discountTotal,
	resolutions,
	productsOpt,
	businessData
}) {

	const [allProducts, setAllProducts] = useState([]);
	const [total, setTotal] = useState(0);
	const [totalKG, setTotalKG] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [showIva, setShowIva] = useState({});
	const [showTotalSoloIVA, setShowTotalSoloIVA] = useState(0)
	const [totalSinIVA, setTotalSinIVA] = useState(0)
	const [baseQR, setBaseQR] = useState(''); 
	const dayjs = useDayjs(); 

	// const convertUserName = (userID) => {
	// 	const u = users.find(user => user.usuario_id == userID);
	// 	return `${u?.apellido}`;
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

	const getBase64Img = async (url) => {
		try {
			const qrCodeDataURL = await QRCode.toDataURL(url);
			setBaseQR(qrCodeDataURL); // Retorna la imagen en base64
		} catch (err) {
			console.error(err);
			return "Error al generar el código QR";
		}
	}

	useEffect(() => {
		const newProducts = productsDocument.map(product => {

			const pct = parseFloat(discountTotal) / 100;
			const pctValueParcial = parseFloat(product.parcial) * pct;
			const pctValueUnit = parseFloat(product.unitario) * pct;
			const productPeso = productsOpt.find(item => item.producto_id == product.producto_id)

			return {
				...product,
				parcial: parseFloat(product.parcial) + parseFloat(pctValueParcial),
				unitario: parseFloat(product.unitario) + parseFloat(pctValueUnit),
			}
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
			totalProducts += item.parcial;

			if (item.impuesto_producto == 19) {
				const value19 = parseFloat(item.parcial) / 1.19;
				parcialesIVA.totalWithoutIVA19 += Number(value19);
				parcialesIVA.onlyIVA19 += parseFloat(item.parcial) - Number(value19);

				totalIVA += Number(item.parcial) - Number(value19);
				totalNoIVA += Number(value19);
			}

			if (item.impuesto_producto == 5) {
				const value5 = parseFloat(item.parcial) / 1.05;
				parcialesIVA.totalWithoutIVA5 += Number(value5);
				parcialesIVA.onlyIVA5 += parseFloat(item.parcial) - Number(value5);

				totalIVA += Number(item.parcial) - Number(value5);
				totalNoIVA += Number(value5);
			}

			if (item.impuesto_producto == 0 || item.impuesto_producto === null) {
				const value0 = parseFloat(item.parcial) * 0;
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
		if(document?.qrcode) getBase64Img(document?.qrcode);
	}, [document, productsDocument, businessData])

	useEffect(() => {
		// Carga los productos aquí
		// ...
		setIsLoading(false); // Cuando se complete la carga, establece isLoading en falso
	  }, []);
	
	  // Si isLoading es verdadero, muestra un indicador de carga o un mensaje de "Cargando..."
	  if (isLoading) {
		return <div>Cargando...</div>;
	  }
	
	  // Si allProducts está vacío, muestra un mensaje de error o un mensaje indicando que no hay productos disponibles
	  if (!allProducts.length && !businessData.length) {
		return <div>No se encontraron productos.</div>;
	  }


	return (
		<div style={{ fontSize: '2.5px', width: '60px' }}>
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
							document?.tipo_documento_id == 10 ? 'FACTURA _ ELECTRONICA_DE_VENTA_' :
								document?.tipo_documento_id == 9 ? 'NO DE GUIA' :
									'FACTURA'
						} : {document?.letra_consecutivo}{document?.consecutivo_dian}
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
			<div style={{ display: 'flex', flexWrap: 'wrap', width: '60px', fontSize: '2.5px', marginBottom: '2px' }}>
				<div style={{ flex: '1', textAlign: 'center', borderTop: '0.2px dashed', borderBottom: '0.2px dashed' }}>
					Cant
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
					<div key={index} style={{ display: 'flex', flexWrap: 'wrap', width: '60px', fontSize: '2.5px', alignItems: 'center', }}>
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
							{new Intl.NumberFormat('es-ES').format(item.parcial)}
							</span>
						</div>
						<div style={{ flex: '1', textAlign: 'center', minHeight: 'auto' }}>
						{new Intl.NumberFormat('es-ES').format(item.unitario)}
						</div>
						<div style={{ flex: '1', textAlign: 'center', minHeight: 'auto' }}>
							{item.impuesto_producto}
						</div>
					</div>
				)) : null}
			
			<div style={{ borderTop: '0.5px dashed', marginTop: '2px' }}></div>

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>Total antes de IVA:</span>
				<span>{new Intl.NumberFormat('es-ES').format(totalSinIVA)}</span>
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
							<span key={index}>{equalTypePayment(item.tipo_pago)}:</span>
						)) : ""
					}
				</span>
				<span>
					{
						payments.length ? payments.map((item, index) => (
							<span key={index}>{new Intl.NumberFormat('es-ES').format(item.valor)}</span>
						)) : ""
					}
				</span>
			</div>
			{/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>Cambio: { cambio }</span>
				<span>{parseFloat(totalToPay) - parseFloat(total)}</span>
			</div> */}
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

			{
				document?.qrcode && 
				(
					<>
						<div style={{ borderTop: '0.5px dashed', textAlign: 'center', marginTop: '2em' }}>CUFE</div>
						<div style={{ display: 'flex', width: '100%', overflowWrap: 'break-word', wordBreak: 'break-all', flexDirection: 'column', marginBottom: '2em' }}>
							{ document?.cufe }
						</div>

						<div style={{ borderTop: '0.5px dashed', textAlign: 'center', marginTop: '2em' }}>
							<img src={baseQR} alt="qrcode" width={50} />
						</div>
					</>
				)
			}

			{/* <span>Paga con {totalToPay}</span><br /> */}
			<div style={{ borderTop: '0.5px dashed', textAlign: 'center' }}>
				<span style={{ fontSize: '2.5px' }}>Sistema POS.</span><br />
				<span style={{ fontSize: '2.5px' }}>Res. {resolutions.resolucion_dian} de Fecha: {resolutions.fecha_resolucion}</span><br />
				<span style={{ fontSize: '2.5px' }}>Vigencia resolucion 6 meses</span><br />
				<span style={{ fontSize: '2.5px' }}>Rango autorizado: {resolutions.letra_consecutivo + 'FA'}{resolutions.autorizacion_desde} a {resolutions.letra_consecutivo + 'FA'}{resolutions.autorizacion_hasta}</span><br />
				<span style={{ fontSize: '2.5px' }}> {resolutions.t_factura}</span><br />
				<span>{document.u_apellido}</span><br />
				<span style={{ fontSize: '2.5px' }}>
					***** Gracias&nbsp; por su compra *****
				</span><br />
				<span style={{ fontSize: '2.5px' }}>
					Software desarrollado por:
				</span><br />
				<span style={{ fontSize: '2.5px' }}>
					Softmate soporte software 3112864974
				</span><br />
				<span style={{ fontSize: '2.5px' }}>
					Lic.by Johan Ordoñez nit. 10305527-6
				</span><br />
			</div>
		</div>
	)
}

export default PrintPreviewComponent;