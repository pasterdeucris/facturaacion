import { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Form, Select, Checkbox } from 'antd';
import { toast } from 'react-toastify';

import { getProductsReportApi } from '../../../api/products-report';
import {
	getSuppliersByBusinessApi
} from '../../../api/document';
import {
	getGroupsApi,
	getSubgroupsApi
} from '../../../api/inventory';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as xlsx from 'xlsx/xlsx.mjs';

function ListComponent({ logged }) {

	const [form] = Form.useForm();
	const { Option } = Select;

	const [AllReport, setAllReport] = useState([]);
	const [groups, setGroups] = useState([]);
	const [subgroups, setSubgroups] = useState([]);
	const [suppliersOpt, setSuppliersOpt] = useState([]);

	const [currentAgotado, setCurrentAgotado] = useState(false);
	const [currenStock, setCurrenStock] = useState(false);
	const [currentEstrella, setCurrentEstrella] = useState(false);
	const [currentGroup, setCurrentGroup] = useState("");
	const [currentSubgroup, setCurrentSubgroup] = useState("");
	const [currentSupplier, setCurrentSupplier] = useState("");

	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nombre',
			key: 'nombre',
		},
		{
			title: 'Costo público',
			dataIndex: 'costo_publico',
			key: 'costo_publico'
		},
		{
			title: 'Costo compra',
			dataIndex: 'costo',
			key: 'costo',
		},
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
			key: 'cantidad',
		},
		{
			title: 'IVA',
			dataIndex: 'iva',
			key: 'iva'
		},
		{
			title: 'Cod. Barras',
			dataIndex: 'codigo_barras',
			key: 'codigo_barras'
		}
	];

	const getGroups = async (businessID) => {
		try {
			const response = await getGroupsApi(businessID);
			setGroups( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos de grupos.');
		}
	}

	const getSubgroups = async (businessID) => {
		try {
			const response = await getSubgroupsApi(businessID);
			setSubgroups( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos de subgrupos.');
		}
	}

	const getReport = async () => {
		try {
			const response = await getProductsReportApi(
				currentAgotado, 
				currenStock, 
				currentEstrella,
				currentGroup,
				currentSubgroup,
				currentSupplier,
				logged?.empresa_id
			);
			setAllReport(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer el reporte.');
		}
	}

	const getListSuppliers = async (businessID) => {
		try {
			const response = await getSuppliersByBusinessApi(businessID);
			setSuppliersOpt(response)
		} catch (err) {
			console.log(err);
			toast.warning('Error al obtener los proveedores de mi empresa.');
		}
	}

	const searchForReport = async () => {
		try {
			const response = await getProductsReportApi(
				currentAgotado, 
				currenStock, 
				currentEstrella,
				currentGroup,
				currentSubgroup,
				currentSupplier,
				logged?.empresa_id
			);
			setAllReport(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer el reporte.');
		}
	}

	const searchDocuments = async () => {
		searchForReport();
	}

	const generatePDF = async () => {
		const doc = new jsPDF();

		let report = AllReport.map(item => {
			return {
				...item,
				iva: item.impuesto ? item.impuesto : 0,
				costo_sin_iva: Number(item.costo_publico) - Number(item.costo_publico * (item.impuesto || 0) / 100),
				total: Number(item.costo_publico) * (item.cantidad <= 0 || !item.cantidad ? 0 : item.cantidad)
			}
		});

		// Calculamos los totales
		let qtyTotal = 0;
		let unitsTotal = 0;
		let sellCostTotalWithoutIVA = 0;
		let sellCostTotal = 0;
		let allTotal = 0;
		report.forEach(product => {
			qtyTotal += Number(product.cantidad || 0);
			unitsTotal += Number(product.costo || 0) * (product.cantidad <= 0 || !product.cantidad ? 0 : product.cantidad);
			sellCostTotalWithoutIVA += Number(product.costo_sin_iva || 0) * (product.cantidad <= 0 || !product.cantidad ? 0 : product.cantidad);
			sellCostTotal += Number(product.costo_publico || 0) * (product.cantidad <= 0 || !product.cantidad ? 0 : product.cantidad);
			allTotal += Number(product.total);
		});

		report.push({
			codigo_barras: '',
			nombre: '',
			iva: '',
			cantidad: 'Total cantidades inv.: ' + qtyTotal.toLocaleString('es-CO', {minimumFractionDigits: 2}),
			costo: 'Total ìnventario a precio costo:  ' + unitsTotal.toLocaleString('es-CO', {minimumFractionDigits: 2}),
			costo_sin_iva: 'Total inv. a precio público sin IVA: ' + sellCostTotalWithoutIVA.toLocaleString('es-CO', {minimumFractionDigits: 2}),
			costo_publico: 'Total inv. a precio público con IVA: ' + sellCostTotal.toLocaleString('es-CO', {minimumFractionDigits: 2}),
			total: 'Total: ' + allTotal.toLocaleString('es-CO', {minimumFractionDigits: 2})
		});

		const today = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });

		// Creamos la tabla con jsPDF-AutoTable
		doc.autoTable({
			head: [['Cód.', 'Desc. artículo', 'iva', 'cant.', 'costo', 'costo venta (Sin IVA)', 'costo venta (IVA)', 'Total (costo venta)']],
			body: report.map(product => [
				product.codigo_barras, 
				product.nombre,
				product.iva,
				product.cantidad,
				product.costo,
				product.costo_sin_iva,
				product.costo_publico,
				product.total
			]),
			styles: {
				fontSize: 8,
			},
			didDrawPage: function (data) {
				doc.setFontSize(10);
				doc.text('SOFTMATE \n' + today, data.settings.margin.left, 10); 
				doc.text('\n\n', data.settings.margin.left, 20);
			}
		});

		// Finalmente, guardamos el PDF
		doc.save('reporte-de-productos.pdf');
	};
	
	const exportToExcel = () => {
		const rows = AllReport.map(row => ({
			nombre: row.nombre,
			costo_publico: row.costo_publico,
			costo_compra: row.costo,
			cantidad: row.cantidad,
			IVA: row.iva,
			codigo_barras: row.codigo_barras,
		}));

		// Crea un nuevo libro de Excel
		const workbook = xlsx.utils.book_new();
	  
		const worksheet = xlsx.utils.json_to_sheet(rows);
	  
		// Añade la hoja de cálculo al libro
		xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
	  
		// Guarda el libro en un archivo
		xlsx.writeFile(workbook, 'reporte-de-productos.xlsx');
	};
	  
	  
	useEffect(() => {
	  getGroups(logged?.empresa_id);
	  getSubgroups(logged?.empresa_id);
	  getListSuppliers(logged?.empresa_id);
	//   getReport();
	}, [])
	

	return (
		<>
			<div className='form'>
				<Form
					form={form} 
					layout="vertical"
				>
					<Row gutter={24}>
						<Col span={8}>
							<Form.Item name="groups" label="Grupos">
								<Select 
									style={{ width: '100%', marginBottom: '12px' }}
									name="groups"
									onChange={ ( value ) => setCurrentGroup(value) }
								>
									{
										groups.length > 0 && groups.map((grupo, index) => (
											<Option 
												value={ grupo.grupo_id }
												key={ grupo.grupo_id }
											>
												{ grupo.nombre }
											</Option>
										))
									}
								</Select>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="subgroups" label="Subgrupos">
								<Select 
									style={{ width: '100%', marginBottom: '12px' }}
									name="subgroups"
									onChange={ ( value ) => setCurrentSubgroup(value) }
								>
									{
										subgroups.length > 0 && subgroups.map((subgrupo, index) => (
											<Option 
												value={ subgrupo.sub_grupo_id }
												key={ subgrupo.sub_grupo_id }
											>
												{ subgrupo.nombre }
											</Option>
										))
									}
								</Select>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="suppliers" label="Proveedor">
								<Select 
									style={{ width: '100%', marginBottom: '12px' }}
									name="suppliers"
									onChange={ ( value ) => setCurrentSupplier(value) }
								>
									{
										suppliersOpt.length > 0 && suppliersOpt.map((proveedor, index) => (
											<Option 
												value={ proveedor.proveedor_id }
												key={ proveedor.proveedor_id }
											>
												{ proveedor.nombre } { proveedor.apellidos }
											</Option>
										))
									}
								</Select>
							</Form.Item>
						</Col>
						<Col span={5}>
							<Checkbox onChange={ (e) => setCurrentAgotado(e.target.checked) }>Agotados</Checkbox>
						</Col>
						<Col span={5}>
							<Checkbox onChange={ (e) => setCurrenStock(e.target.checked) }>Stock minimo</Checkbox>
						</Col>
						<Col span={5}>
							<Checkbox onChange={ (e) => setCurrentEstrella(e.target.checked) }>Producto estrella</Checkbox>
						</Col>
						<Col span={9}>
							<strong>
								TOTAL INVENTARIO COSTO: ${ 
									AllReport.reduce((total, item) => total + (Number(item.costo) * Number(item.cantidad <= 0 || !item.cantidad ? 0 : item.cantidad)), 0).toLocaleString('es-CO', {minimumFractionDigits: 2}) 
								}
							</strong>
							<br />
							<strong>
								TOTAL INVENTARIO PUBLICO: ${ 
									AllReport.reduce((total, item) => total + (Number(item.costo_publico) * Number(item.cantidad <= 0 || !item.cantidad ? 0 : item.cantidad)), 0).toLocaleString('es-CO', {minimumFractionDigits: 2})
								}
							</strong>
						</Col>
						<Col span={2} style={{ marginTop: '2em' }}>
							<Button 
								type='primary'
								style={{ marginBottom: '2em' }}
								onClick={ () => searchDocuments() }
							>
								Buscar
							</Button>
						</Col>
						<Col span={2} style={{ marginTop: '2em' }}>
							<Button 
								type='danger'
								style={{ marginBottom: '2em' }}
								onClick={ () => generatePDF() }
								disabled={ AllReport.length > 0 ? false : true }
							>
								PDF
							</Button>
						</Col>
						<Col span={2} style={{ marginTop: '2em' }}>
							<Button 
								style={{ marginBottom: '2em', backgroundColor: 'green', color: 'white', borderColor: 'white' }}
								onClick={ () => exportToExcel() }
								disabled={ AllReport.length > 0 ? false : true }
							>
								Excel
							</Button>
						</Col>
					</Row>
				</Form>
			</div>

			<div id="report_products_list">
				<Table
					dataSource={AllReport}
					columns={columns}
					pagination={{
						pageSizeOptions: ['10', '20', '50', '100', `${AllReport.length}`],
						showSizeChanger: true,
					}}
					key="report_products_id"
				/>
			</div>
		</>
	)
}

export default ListComponent;