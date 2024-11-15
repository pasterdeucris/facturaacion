import { useState, useEffect } from 'react';

import LogoFactura from '../../assets/logoempresa.jpg';
import useDayjs from '../../hooks/useDays';

function InvoicePDFLittle({
    document,
	totalToPay,
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
	const [qrcode, setQrcode] = useState(null);
    const [cufe, setCufe] = useState(null);  
    
	const payments = JSON.parse(localStorage.getItem('paymentInPrint')) || [];

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
		if (document?.qrcode) {
			setQrcode(document.qrcode);
        }
		if (document?.cufe) {
			setCufe(document.cufe);
		}
	}, [document, invoice])


	return (
		<div style={{ fontSize: '2.8px', width: '60px' }}>
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
							document.tipo_documento_id == 10 ? 'FACTURA ELECTRONICA DE EVENTA' :
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

			<span>Cajero: {document.u_nombre} </span><br />
			<span>Caja:{document.u_apellido} </span><br />
			<div style={{ display: 'flex', flexWrap: 'wrap', width: '60px', fontSize: '2.8px', marginBottom: '2px' }}>
				<div style={{ flex: '1', textAlign: 'center', borderTop: '0.2px dashed', borderBottom: '0.2px dashed' }}>
					cod id
				</div>	
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
					<div key={index} style={{ display: 'flex', flexWrap: 'wrap', width: '60px', fontSize: '2.8px', alignItems: 'center', }}>
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

			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>Total documento:</span>
				<span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('es-ES').format(total)}</span>
			</div>

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
					<>{qrcode && (
						<div>
							<QRCodeCanvas value={qrcode} />
						</div>
					)}
					{cufe && (
						<div>
							<span>CUFE: {cufe}</span>
						</div>
					)}
					 <span>QR Code: {qrcode}</span><br />
						<div style={{ borderTop: '0.5px dashed', textAlign: 'center', marginTop: '2em' }}>CUFE</div>
						<div style={{ display: 'flex', width: '100%', overflowWrap: 'break-word', wordBreak: 'break-all', flexDirection: 'column', marginBottom: '2em' }}>
							{ document?.cufe }
						</div>
						<span>CUFE: {cufe}</span><br />
						<div style={{ borderTop: '0.5px dashed', textAlign: 'center', marginTop: '2em' }}>
							<img src={baseQR} alt="qrcode" width={50} />
						</div>
					</>
				)
			}
			{/* <span>Paga con {totalToPay}</span><br /> */}
			<div style={{ borderTop: '0.5px dashed', textAlign: 'center' }}>
				<span style={{ fontSize: '2.8px' }}>Sistema POS.</span><br />
				<span style={{ fontSize: '2.8px' }}>Res. {resolutions.resolucion_dian} de Fecha: {resolutions.fecha_resolucion}</span><br />
				<span style={{ fontSize: '2.8px' }}>Vigencia resolucion 6 meses</span><br />
				<span style={{ fontSize: '2.8px' }}>Rango autorizado: {resolutions.letra_consecutivo}{resolutions.autorizacion_desde} a {resolutions.letra_consecutivo}{resolutions.autorizacion_hasta}</span><br />
				<span style={{ fontSize: '2.8px' }}> {resolutions.t_factura}</span><br />
				<span>{document.u_apellido}</span><br />
				<span style={{ fontSize: '2.8px' }}>
					***** Gracias&nbsp; por su compra *****
				</span><br />
				<span style={{ fontSize: '2.8px' }}>
					Software desarrollado por:
				</span><br />
				<span style={{ fontSize: '2.8px' }}>
					Sofmate soporte software 3112864974
				</span><br />
				<span style={{ fontSize: '2.8px' }}>
					Lic.by Johan Ordoñez nit. 10305527-6
				</span><br />
			</div>
		</div>
	)
}

export default InvoicePDFLittle