import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Input, Select, DatePicker, Table } from 'antd';
import { SearchOutlined, PrinterOutlined, DeleteOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { getUsersApi } from '../../../api/user';
import { getEmployeesApi } from '../../../api/employee';
import { getClientsApi } from '../../../api/client';
import { getSuppliesApi } from '../../../api/supplies';
import { getDocumentsTypeApi, searchDocumentApi } from '../../../api/document';
import { useActivations } from '../../../hooks/useActivations';

import { useForm } from '../../../hooks/useForm';
import DetailDocument from './DetailDocument';
import CreateDC from './CreateDC';
import UpdateDateDocument from './UpdateDateDocument';
import PrintPreviewComponent from './PrintPreviewComponent';

function SearchDocumentComponent({ showModalSearchDocument, setShowModalSearchDocument, logged, selectSpecificDocument }) {

	const { Option } = Select;
	const [form] = Form.useForm();

	const [formValues, handleInputChange, setValues, reset] = useForm({
		cajero: '',
		empleado: '',
		fecha_inicial: '',
		fecha_final: '',
		dian: '',
		documento_interno: '',
		cliente: '',
		proveedor: '',
		tipo_documento: 10,
	});

	const [cajerosOpts, setCajerosOpt] = useState([]);
	const [empleadosOpts, setEmpleadosOpt] = useState([]);
	const [clientesOpt, setClientesOpt] = useState([]);
	const [proveedoresOpt, setProveedoresOpt] = useState([]);
	const [tipoDocumentosOpt, setTipoDocumentosOpt] = useState([]);

	const [currentCajero, setCurrentCajero] = useState(null);
	const [currentEmpleado, setCurrentEmpleado] = useState(null);
	const [currentFechaInit, setCurrentFechaInit] = useState(null);
	const [currentFechaEnd, setCurrentFechaEnd] = useState(null);
	const [currentCliente, setCurrentCliente] = useState(null);
	const [currentProveedor, setCurrentProveedor] = useState(null);
	const [currentTipoDocumento, setCurrentTipoDocumento] = useState(null);

	const [showModalInvoice, setShowModalInvoice] = useState(false);
	const [showModalCreateDC, setShowModalCreateDC] = useState(false);
	const [showModalUpdateDate, setShowModalUpdateDate] = useState(false);
	const [currentDocument, setCurrentDocument] = useState(10);

	const [documentsFound, setDocumentsFound] = useState([]);
	const [showModalPrintPreviewSale, setShowModalPrintPreviewSale] = useState(false);

	const { creditDebitActive, changeDateInvoice, editInvoice } = useActivations(logged);

	const resetForm = () => {
		form.resetFields();
		reset();
	}

	const getCajeros = async (businessID) => {
		try {
			const response = await getUsersApi(businessID);
			setCajerosOpt(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los usuarios para la búsqueda de documento.');
		}
	}

	const getEmpleados = async (businessID) => {
		try {
			const response = await getEmployeesApi(businessID);
			setEmpleadosOpt(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los empleados para la búsqueda de documento.');
		}
	}

	const getClientes = async (businessID) => {
		try {
			const response = await getClientsApi(businessID);
			setClientesOpt(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los clientes para la búsqueda de documento.');
		}
	}

	const getProveedores = async (businessID) => {
		try {
			const response = await getSuppliesApi(businessID);
			setProveedoresOpt(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los proveedores para la búsqueda de documento.');
		}
	}

	const getTipoDocumentos = async () => {
		try {
			const response = await getDocumentsTypeApi();
			setTipoDocumentosOpt(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los tipo de documentos para la búsqueda de documento.');
		}
	}

	const printPreview = () => {
		setShowModalPrintPreviewSale(!showModalPrintPreviewSale);
	}

	const columns = [
		{
			title: 'Opciones',
			dataIndex: 'opciones',
			key: 'opciones',
			render: (_, record, index) => {
				return (
					<>
						<Button
							type='primary'
							size='middle'
							onClick={() => { setShowModalInvoice(val => !val); setCurrentDocument(record); }}
						>
							<SearchOutlined />
						</Button>
						<Button
							type='primary'
							size='middle'
							disabled={editInvoice ? false : true}
							onClick={() => { selectSpecificDocument(record.documento_id, record); setShowModalSearchDocument(false); resetForm(); }}
						>
							<EditOutlined />
						</Button>
						<Button
							type='primary'
							size='middle'
							onClick={() => { printPreview(); setCurrentDocument(record); }}
						>
							<PrinterOutlined />
						</Button>
						<Button
							type='primary'
							size='middle'
							disabled={creditDebitActive ? false : true}
							onClick={() => { setShowModalCreateDC(val => !val); setCurrentDocument(record); }}
						>
							<DeleteOutlined />
						</Button>
						<Button
							type='primary'
							size='middle'
							disabled={ changeDateInvoice ? false : true }
							onClick={() => { setShowModalUpdateDate(val => !val); setCurrentDocument(record); }}
						>
							<CalendarOutlined />
						</Button>
					</>
				)
			}
		},
		{
			title: '# interno',
			dataIndex: 'documento_id',
			key: 'documento_id',
		},
		{
			title: 'DIAN',
			dataIndex: 'consecutivo_dian',
			key: 'consecutivo_dian',
		},
		{
			title: 'Valor Total',
			dataIndex: 'total',
			key: 'total',
		},
		{
			title: 'Saldo',
			dataIndex: 'saldo',
			key: 'saldo',
		},
		{
			title: 'Fecha',
			dataIndex: 'fecha_registro',
			key: 'fecha_registro',
			render: (_, record, index) => {
				return (
					<>
						{new Date(record.fecha_registro).toLocaleDateString()}
					</>
				)
			}
		},
	];

	const onSubmit = async (e) => {

		const data = {
			...formValues,
			cajero: currentCajero ? currentCajero : "",
			empleado: currentEmpleado ? currentEmpleado : "",
			fecha_inicial: currentFechaInit ? currentFechaInit : "",
			fecha_final: currentFechaEnd ? currentFechaEnd : "",
			cliente: currentCliente ? currentCliente : "",
			proveedor: currentProveedor ? currentProveedor : "",
			tipo_documento: currentTipoDocumento ? currentTipoDocumento : 10,
			empresa_id: logged?.empresa_id
		}

		try {
			const response = await searchDocumentApi(data);
			setDocumentsFound(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar buscar el documento.');
		}
	}

	useEffect(() => {
		if (showModalSearchDocument) {
			getCajeros(logged?.empresa_id);
			getEmpleados(logged?.empresa_id);
			getClientes(logged?.empresa_id);
			getProveedores(logged?.empresa_id);
			getTipoDocumentos();
			setCurrentTipoDocumento(10);
			setDocumentsFound([]);
		}
	}, [showModalSearchDocument])


	return (
		<Modal
			title="Buscar documentos por fecha"
			visible={showModalSearchDocument}
			onCancel={() => { setShowModalSearchDocument(false); resetForm(); }}
			onOk={(e) => onSubmit(e)}
			width={800}
			cancelText="Cerrar"
			okText="Buscar"
			forceRender
		>
			<Form form={form} layout='vertical' initialValues={{ tipo_documento_id: 10 }}>
				<Row gutter={24}>
					<Col span={12}>
						<Form.Item name="cajero_id" label="Cajero">
							<Select
								style={{ width: '100%', marginBottom: '12px' }}
								name="cajero_id"
								onChange={(value) => setCurrentCajero(value)}
							>
								{
									cajerosOpts.map((e, index) => (
										<Option
											value={e.usuario_id}
											key={index}
										>
											{e.nombre} {e.apellido}
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="empleado_id" label="Empleado">
							<Select
								style={{ width: '100%', marginBottom: '12px' }}
								name="empleado_id"
								onChange={(value) => setCurrentEmpleado(value)}
							>
								{
									empleadosOpts.map((e, index) => (
										<Option
											value={e.empleado_id}
											key={index}
										>
											{e.nombre} {e.apellido}
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name="Fecha inicial">
							<DatePicker
								placeholder='Fecha inicial'
								name='fecha_inicial'
								style={{ width: '100%' }}
								onChange={(date, dateString) => setCurrentFechaInit(dateString)}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="Fecha final">
							<DatePicker
								placeholder='Fecha final'
								name='fecha_final'
								style={{ width: '100%' }}
								onChange={(date, dateString) => setCurrentFechaEnd(dateString)}
							/>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name="consecutivo_dian" label="Consecutivo Dian">
							<Input
								name='consecutivo_dian'
								onChange={handleInputChange}
								placeholder='Consecutivo Dian'
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="numero_documento_interno" label="Número documento interno">
							<Input
								name='numero_documento_interno'
								onChange={handleInputChange}
								placeholder='Número documento interno'
							/>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name="cliente_id" label="Cliente">
							<Select
								style={{ width: '100%', marginBottom: '12px' }}
								name="cliente_id"
								onChange={(value) => setCurrentCliente(value)}
							>
								{
									clientesOpt.map((e, index) => (
										<Option
											value={e.cliente_id}
											key={index}
										>
											{e.nombre} {e.apellidos}
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="proveedor_id" label="Proveedor">
							<Select
								style={{ width: '100%', marginBottom: '12px' }}
								name="proveedor_id"
								onChange={(value) => setCurrentProveedor(value)}
							>
								{
									proveedoresOpt.map((e, index) => (
										<Option
											value={e.proveedor_id}
											key={index}
										>
											{e.nombre} {e.apellidos}
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name="tipo_documento_id" label="Tipo documento">
							<Select
								style={{ width: '100%', marginBottom: '12px' }}
								name="tipo_documento_id"
								onChange={(value) => setCurrentTipoDocumento(value)}
							>
								{
									tipoDocumentosOpt.map((e, index) => (
										<Option
											value={e.tipo_documento_id}
											key={index}
										>
											{e.nombre}
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>

				</Row>

				<Table
					columns={columns}
					dataSource={documentsFound}
					rowKey="documento_id"
					key="busqueda_documentos_fecha"
					pagination={{ pageSize: 5 }}
				/>

				<DetailDocument
					showModalInvoice={showModalInvoice}
					setShowModalInvoice={setShowModalInvoice}
					document={currentDocument}
					setCurrentDocument={setCurrentDocument}
				/>

				<CreateDC
					showModalCreateDC={showModalCreateDC}
					setShowModalCreateDC={setShowModalCreateDC}
					document={currentDocument}
					setCurrentDocument={setCurrentDocument}
					logged={logged}
				/>

				<UpdateDateDocument
					showModalUpdateDate={showModalUpdateDate}
					setShowModalUpdateDate={setShowModalUpdateDate}
					setCurrentDocument={setCurrentDocument}
					document={currentDocument}
					onSubmit={onSubmit}
				/>

				<PrintPreviewComponent 
					showModalPrintPreviewSale={ showModalPrintPreviewSale }
					setShowModalPrintPreviewSale={ setShowModalPrintPreviewSale }
					logged={ logged }
					currentDoc={ currentDocument }
				/>
			</Form>
		</Modal>
	)
}

export default SearchDocumentComponent;