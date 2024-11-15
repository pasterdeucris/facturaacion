import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';

import LogoFactura from '../../../assets/logoempresa.jpg';
import './DailyReportInvoice.scss';

import { getBusinessApi } from '../../../api/business';
// import { useForm } from '../../../../hooks/useForm';
// import { getClientsApi } from '../../../../api/client';
// import { getUsersApi } from '../../../../api/user';
// import { getDocumentoDetalleAPI } from '../../../../api/document';
// import { getBusinessApi } from '../../../../api/business';
// import {
// 	getResolutionByBusinessApi,
// 	getProductsByBusinessApi
// } from '../../../../api/sales';

function PrintComponent({ 
	showModalPrint, 
	setShowModalPrint, 
	logged, 
	getDocumentsTipoPago, 
	getUserRole,
	getTipoDetalle,
	pressRelation,
	currentDocument,
	getTipoDetallePorFecha
}) {

	const [dataTipoPago, setdataTipoPago] = useState([]);
	const [dataUserRole, setDataUserRole] = useState([]);
	const [dataDetail, setDataDetail] = useState([]);
	const [businessData, setBusinessData] = useState([]);
	const [numInvoices, setNumInvoices] = useState(0);

	const [valuesCalc, setValuesCalc] = useState({
        "total": 0,
        "gravable5": 0,
        "gravable19": 0,
        "iva5": 0,
        "iva19": 0,
        "excento": 0
    });

	const getBusiness = async () => {
		try {
			const response = await getBusinessApi();
			setBusinessData(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las las empresas.');
		}
	}

	const generatePDF = () => {
		// document.querySelector("#informe_diario").removeAttribute("hidden");

		let doc = new jsPDF();
		const width = 215.9; // Ancho del documento en mm (8.5 pulgadas)
		const height = 279.4; // Altura del documento en mm (11 pulgadas)
		const marginX = 10; // Margen en el eje X en mm

		doc.setProperties({
			width: width,
			height: height
		});

		// Obtener el elemento HTML que deseas imprimir
		const element = document.querySelector("#informe_diario");

		// Utilizar html2canvas para capturar el contenido HTML en un lienzo
		html2canvas(element).then(function (canvas) {
			// Convertir el lienzo capturado en una imagen base64
			const imgData = canvas.toDataURL('image/png');

			// Calcular las coordenadas para agregar la imagen con margen en el eje X
			const x = marginX;
			const y = 0;
			const imgWidth = width - (2 * marginX);
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			// Agregar la imagen al documento jsPDF con las coordenadas y dimensiones calculadas
			doc.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

			// Guardar o mostrar el documento
			let nameInvoice = `informe_diario`;
			doc.save(`${nameInvoice}.pdf`);
		});


		setShowModalPrint(false);
	}

	const getData = async () => {
		const typeDoc = pressRelation ? 2 : '';
		const fecha = dayjs(currentDocument).format("YYYY-MM-DD");
		
		await getBusiness();
		const tipoPago = await getDocumentsTipoPago(fecha);
		const userRole = await getUserRole();
		const tipoDetalle = await getTipoDetallePorFecha(typeDoc, fecha);

		const numTotal = tipoPago.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue.num), 0);

		if(tipoPago.length) setdataTipoPago(tipoPago);
		if(userRole.length) setDataUserRole(userRole);
		if(tipoDetalle.length) setDataDetail(tipoDetalle);
		setNumInvoices(numTotal);
	}

	useEffect(() => {
		if (logged && showModalPrint) {
			getData();

			toast.success('Imprimiendo informe diario, espera unos segundos...');

			setTimeout(() => {
				generatePDF();
			}, 3000);
		}
	}, [showModalPrint])

	const setValuesCalculations = () => {
        let total = 0;
        let gravable5 = 0;
        let gravable19 = 0;
        let iva5 = 0;
        let iva19 = 0;
        let excento = 0;

        dataDetail.forEach(item => {

            gravable5 += parseFloat(item.base_5);
            gravable19 += parseFloat(item.base_19);
            total += parseFloat(item.total);
            iva5 += parseFloat(item.iva_5);
            iva19 += parseFloat(item.iva_19);
            excento += parseFloat(item.excento);
        });

        setValuesCalc({
            total: total,
            gravable5: gravable5,
            gravable19: gravable19,
            iva5: iva5,
            iva19: iva19,
            excento: excento
        });
    }

    useEffect(() => {
        if(dataDetail.length > 0) {
			setValuesCalculations();
		}
    }, [dataDetail])


	return (
		<Modal
			title="Imprimir"
			visible={showModalPrint}
			onCancel={() => { setShowModalPrint(!showModalPrint) }}
			okButtonProps={{ style: { display: 'none' } }}
			cancelButtonProps={{ style: { display: 'none' } }}
			width={800}
			footer={false}
			forceRender
		>
			{
				(
					<div id="informe_diario">
						<FacturaPDF
							dataTipoPago={dataTipoPago}
							dataUserRole={dataUserRole}
							dataDetail={dataDetail}
							valuesCalc={valuesCalc}
							businessData={businessData}
							numInvoices={numInvoices}
						/>
					</div>
				)
			}
		</Modal>
	)
}

function FacturaPDF({
	dataTipoPago,
	dataUserRole,
	dataDetail,
	valuesCalc,
	businessData,
	numInvoices
}) {

	return (
		<div className='report-invoice'>
			<div className='container-report-invoice'>
				<div className='grid-1'>
					<img
						src={LogoFactura}
						alt="Logo-factura"
						width="100%"
					/>
					<br />
					<div className='post-img'>
						<span className="font-i-subtitle fw-700">Comprobante de informe diario</span><br />
						<span className="font-i-subtitle fw-700">Fecha de informe: { dataDetail.length > 0 && dataDetail[dataDetail.length - 1].fecha_registro}</span>
					</div>
				</div>
				<div className='grid-2'>
					<span className='font-i-title upper'>{businessData[0]?.nombre}</span><br />
					<span className='font-i-title'>NIT: {businessData[0]?.nit}</span><br />
					<span className="font-i-subtitle upper">Somos simplificado</span><br />
					<span className="font-i-subtitle">Representante legal: {businessData[0]?.represente}</span><br />
					<span className="font-i-subtitle">Dirección: {businessData[0]?.direccion} - {businessData[0]?.barrio}</span><br />
					<span className="font-i-subtitle">Telefono: {businessData[0]?.cel} - {businessData[0]?.telefono_fijo || ""}</span>
				</div>
			</div>

			<div className='container-report-table'>
				<table
					className='table-invoice'
				>
					<thead>
						<tr>
							<th>#</th>
							<th>Fact. Inicial</th>
							<th>Cant. Facturas</th>
							<th>Valor Total Facturado</th>
						</tr>
					</thead>
					<tbody className='body-table-invoice'>
						<tr>
							<td>{ dataDetail.length > 0 && dataDetail[0].documento_id }</td>
							<td>{ dataDetail.length > 0 && dataDetail[dataDetail.length - 1].documento_id }</td>
							<td>{ numInvoices ?? 0 }</td>
							<td>{ valuesCalc?.total }</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className='container-report-table'>
				<span className="font-i-subtitle fw-700">Discriminación de ventas atendidas por cajero </span>
				<table
					className='table-invoice'
				>
					<thead>
						<tr>
							<th>Cajero</th>
							<th>Canti. Fact</th>
							<th>Vr. Total facturado</th>
						</tr>
					</thead>
					<tbody className='body-table-invoice'>
						{
							dataUserRole.length > 0 && dataUserRole.map((item) => (
								<tr>
									<td></td>
									<td></td>
									<td></td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>

			<div className='container-report-table'>
				<span className="font-i-subtitle fw-700">Discriminación de ventas por forma de pago </span>
				<table
					className='table-invoice'
				>
					<thead>
						<tr>
							<th>Forma de pago</th>
							<th>Cantidad de facturas</th>
							<th>Valor facturado</th>
						</tr>
					</thead>
					<tbody className='body-table-invoice'>
						{
							dataTipoPago.length > 0 && dataTipoPago.map((item, index) => (
								<tr key={index}>
									<td>{item.nombre}</td>
									<td>{item.num}</td>
									<td>{item.total}</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</div>

			<div className='report-prices'>
				<span className="font-i-subtitle fw-700">Resumen informe diario</span><br />
				<span className="font-i-subtitle fw-700">Total ventas: ${new Intl.NumberFormat('es-ES').format(valuesCalc?.total)}</span><br />
				<span className="font-i-subtitle fw-700">IVA total: { (parseFloat(valuesCalc?.iva19) + parseFloat(valuesCalc?.iva5)).toFixed(2)}</span><br />
				<span className="font-i-subtitle fw-700">IVA 19%: ${new Intl.NumberFormat('es-ES').format(valuesCalc?.iva19)}</span><br />
				<span className="font-i-subtitle fw-700">IVA 5%: ${new Intl.NumberFormat('es-ES').format(valuesCalc?.iva5)}</span><br />
				<span className="font-i-subtitle fw-700">Base 19%: ${new Intl.NumberFormat('es-ES').format(valuesCalc?.gravable19)}</span><br />
				<span className="font-i-subtitle fw-700">Base 5%: ${new Intl.NumberFormat('es-ES').format(valuesCalc?.gravable5)}</span><br />
				<span className="font-i-subtitle fw-700">Excluído: ${new Intl.NumberFormat('es-ES').format(valuesCalc?.excento)}</span><br />
				<span className="font-i-subtitle fw-700">Costos en ventas: ${new Intl.NumberFormat('es-ES').format(valuesCalc?.total)}</span><br />
				<span className="font-i-subtitle fw-700">Ganancias: 0,00</span><br />
			</div>
		</div>
	)
}

export default PrintComponent;