import { useState, useEffect, useRef } from 'react';
import { Table, Button, DatePicker, Row, Col, Form, Select, Pagination } from 'antd';
import { toast } from 'react-toastify';

import { getUsersApi } from '../../../api/user';
import { getKardexApi } from '../../../api/kardex';
import {
	getProductsByBusinessApi,
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

	const [productsOpt, setProductsOpt] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const [AllKardex, setAllKardex] = useState([]);
	const [groups, setGroups] = useState([]);
	const [subgroups, setSubgroups] = useState([]);
	const [suppliersOpt, setSuppliersOpt] = useState([]);
	
	const [dateInit, setDateInit] = useState("");
	const [dateEnd, setDateEnd] = useState("");
	const [currentProductValue, setCurrentProductValue] = useState("");
	const [currentGroup, setCurrentGroup] = useState("");
	const [currentSubgroup, setCurrentSubgroup] = useState("");
	const [currentSupplier, setCurrentSupplier] = useState("");
	const [currentDocumentType, setCurrentDocumentType] = useState("");

	const productIdRef = useRef(null);

	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'descripcion',
			key: 'descripcion',
		},
		{
			title: 'Documento',
			dataIndex: 'documento',
			key: 'documento'
		},
		{
			title: 'Detalle',
			dataIndex: 'detalle',
			key: 'detalle',
		},
		{
			title: '# doc. interno',
			dataIndex: 'documento_id',
			key: 'documento_id',
		},
		{
			title: 'Fecha',
			dataIndex: 'fecha_registro',
			key: 'fecha_registro'
		},
		{
			title: 'Tipo Doc.',
			dataIndex: 'tipo_documento_id',
			key: 'tipo_documento_id',
			render: (_, record, index) => {
				return (
					<>
						{ tipo_documentos.find( item => item.id === record.tipo_documento_id ).name } 
					</>
				)
			}
		},
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
			key: 'cantidad',
		},
		{
			title: 'Saldo',
			dataIndex: 'saldo',
			key: 'saldo',
		},
		{
			title: 'Parcial',
			dataIndex: 'parcial',
			key: 'parcial',
		},
		{
			title: 'Unitario',
			dataIndex: 'unitario',
			key: 'unitario',
		},
	];

	const tipo_documentos = [
		{ id: 1, name: 'Entrada por guía' },
		{ id: 2, name: 'Entrada almacen' },
		{ id: 3, name: 'Entrada x bajas' },
		{ id: 4, name: 'Cotización' },
		{ id: 5, name: 'Avance efectivo' },
		{ id: 6, name: 'Salidas Almacen' },
		{ id: 7, name: 'Salidas x bajas' },
		{ id: 8, name: 'Vales' },
		{ id: 9, name: 'No. guia' },
		{ id: 10, name: 'Factura de venta' },
		{ id: 11, name: 'Orden de trabajo' },
		{ id: 12, name: 'Nota crédito' },
		{ id: 13, name: 'Nota débito' }
	];

	const clearFields = () => {
		setDateInit("");
		setDateEnd("");
		setCurrentProductValue("");
		setCurrentDocumentType("");
		setCurrentGroup("");
		setCurrentSubgroup("");
		setCurrentSupplier("");

		form.resetFields();
	}

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

	const getKardex = async () => {
		try {
			const response = await getKardexApi(
				dateInit, 
				dateEnd, 
				currentProductValue,
				currentGroup,
				currentSubgroup,
				currentSupplier,
				currentDocumentType,
				logged?.empresa_id
			);
			setAllKardex(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer el kardex.');
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

	const getListSuppliers = async (businessID) => {
		try {
			const response = await getSuppliersByBusinessApi(businessID);
			setSuppliersOpt(response)
		} catch (err) {
			console.log(err);
			toast.warning('Error al obtener los proveedores de mi empresa.');
		}
	}

	const searchForKardex = async () => {

		if(dateInit != '' && dateEnd == '') {
			toast.warning('Si seleccionas una fecha `desde`, `hasta` no puede quedar vacío.');
			return;
		}

		if(dateInit == '' && dateEnd != '') {
			toast.warning('Si seleccionas una fecha `hasta`, `desde` no puede quedar vacío.');
			return;
		}

		if(dateInit != '' && dateEnd != '' && dateInit > dateEnd) {
			toast.warning('La fecha inicial no puede ser mayor  a la final.');
			return;
		}

		try {
			const response = await getKardexApi(
				dateInit, 
				dateEnd, 
				currentProductValue,
				currentGroup,
				currentSubgroup,
				currentSupplier,
				currentDocumentType,
				logged?.empresa_id);
			setAllKardex(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer el kardex.');
		}
	}

	const searchDocuments = async () => {
		searchForKardex();
	}

	const generatePDF = async () => {
		const doc = new jsPDF();
		
		const columns = [
			{ header: 'Nombre', dataKey: 'descripcion' },
			{ header: 'Documento', dataKey: 'documento' },
			{ header: 'Detalle', dataKey: 'detalle' },
			{ header: 'Fecha', dataKey: 'fecha_registro' },
			{ header: 'Tipo Doc.', dataKey: 'tipo_documento_id' },
			{ header: 'Cantidad', dataKey: 'cantidad' },
			{ header: 'Saldo', dataKey: 'saldo' },
			{ header: 'Parcial', dataKey: 'parcial' },
			{ header: 'Unitario', dataKey: 'unitario' },
		];

		const processedData = AllKardex.map(item => {
			const tipoDocumento = tipo_documentos.find(doc => doc.id === item.tipo_documento_id);
			return {
				...item,
				tipo_documento_id: tipoDocumento ? tipoDocumento?.name : ''
			};
		});
	
		autoTable(doc, {
			columns,
			body: processedData,
			styles: {
				halign: 'center',
				fontSize: 10,
			}
		});
		doc.save('kardex.pdf');
	};
	
	const exportToExcel = () => {
		const rows = AllKardex.map(row => ({
			nombre: row.descripcion,
			documento: row.documento,
			detalle: row.detalle,
			fecha: row.fecha_registro,
			tipo_doc: tipo_documentos.find(doc => doc.id === row.tipo_documento_id)?.name,
			cantidad: row.cantidad,
			saldo: row.saldo,
			parcial: row.parcial,
			unitario: row.unitario
		}));

		// Crea un nuevo libro de Excel
		const workbook = xlsx.utils.book_new();
	  
		const worksheet = xlsx.utils.json_to_sheet(rows);
	  
		// Añade la hoja de cálculo al libro
		xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
	  
		// Guarda el libro en un archivo
		xlsx.writeFile(workbook, 'kardex.xlsx');
	};
	  
	  
	useEffect(() => {
	  getProductsByBusiness(logged?.empresa_id);
	  getGroups(logged?.empresa_id);
	  setSubgroups(logged?.empresa_id);
	  getListSuppliers(logged?.empresa_id);
	//   getKardex();
	  getSubgroups(logged?.empresa_id);
	}, [])
	

	return (
		<>
			<div className='dates-ranges'>
				<Form
					form={form} 
					layout="vertical"
				>
					<Row gutter={24}>
						<Col span={6}>
							<Form.Item name="date_init" label="Desde">
								<DatePicker 
									name="date_init"
									placeholder='Desde'
									style={{ width: '100%' }}
									onChange={ (date, dateString) =>  setDateInit(dateString) }
								/>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name="date_end" label="Hasta">
								<DatePicker 
									name="date_end"
									placeholder='Hasta'
									style={{ width: '100%' }}
									onChange={ (date, dateString) =>  setDateEnd(dateString) }
								/>
							</Form.Item>
						</Col>
						<Col span={8} style={{ marginTop: '2em' }}>
							<Form.Item name="nombre_producto">
								<Select
									showSearch
									name="nombre_producto"
									size="middle"
									ref={productIdRef}
									placeholder="Nombre producto"
									onChange={(val) => setCurrentProductValue(val)}
									defaultOpen={false}
									defaultActiveFirstOption={false}
									filterOption={(input, option) => {
										const inputNormalized = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
										const optionTextNormalized = option.props.children[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

										// Buscar la palabra ingresada como una palabra completa en la opción
										const inputFullWordMatch = new RegExp(`\\b${inputNormalized}\\b`, 'i').test(optionTextNormalized);

										// Si la palabra ingresada coincide exactamente con la opción, mostrar solo esa opción
										if (inputFullWordMatch && inputNormalized === optionTextNormalized) {
											return true;
										}

										// Si no se encuentra la palabra ingresada como una palabra completa, buscar cada palabra de la cadena de búsqueda como una subcadena en el texto de la opción
										const inputWords = inputNormalized.split(' ');
										const wordMatches = inputWords.every(word => optionTextNormalized.includes(word));

										// Si hay coincidencias cercanas y no hay coincidencia exacta, mostrar solo las opciones que contengan la palabra ingresada
										if (wordMatches && !inputFullWordMatch) {
											return true;
										}

										return false;
									}}
								>
									{/* <Option value="">Seleccione una opción</Option> */}
									{
										productsOpt.length > 0 &&
										productsOpt.map((item, idx) => (
											<Option
												key={idx}
												value={item.producto_id}
											>
												{item.nombre}
												<br />
												<small style={{ fontSize: '12px' }} >
													Costo: {item.costo} |
													Público: {item.costo_publico} |
													Cantidad: {item.cantidad} |
													ID: {item.producto_id}
												</small>
											</Option>
										))
									}
								</Select>
							</Form.Item>
						</Col>
						<Col span={4}>
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
						<Col span={4}>
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
						<Col span={4}>
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
						<Col span={6}>
							<Form.Item name="tipo_documento" label="Tipo documento">
								<Select 
									style={{ width: '100%', marginBottom: '12px' }}
									name="tipo_documento"
									onChange={ ( value ) => setCurrentDocumentType(value) }
								>
									{
										tipo_documentos.map((e, index) => (
											<Option 
												value={ e.id }
												key={ e.id }
											>
												{ e.name }
											</Option>
										))
									}
								</Select>
							</Form.Item>
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
							>
								PDF
							</Button>
						</Col>
						<Col span={2} style={{ marginTop: '2em' }}>
							<Button 
								style={{ marginBottom: '2em', backgroundColor: 'green', color: 'white', borderColor: 'white' }}
								onClick={ () => exportToExcel() }
							>
								Excel
							</Button>
						</Col>
						<Col span={2} style={{ marginTop: '2em' }}>
							<Button 
								type='default'
								style={{ marginBottom: '2em' }}
								onClick={ () => clearFields() }
							>
								Limpiar
							</Button>
						</Col>
					</Row>
				</Form>
			</div>

			<div id="kardex_list">
				<Table
					dataSource={AllKardex}
					columns={columns}
					pagination={{
						pageSizeOptions: ['10', '20', '50', '100', `${AllKardex.length}`],
						showSizeChanger: true,
					}}
					key="kardex_id"
				/>
			</div>
		</>
	)
}

export default ListComponent;