import { useState, useEffect } from 'react';
import { Table, Button, DatePicker, Row, Col, Form, Select, Pagination } from 'antd';
import { toast } from 'react-toastify';

import { getUsersApi } from '../../../api/user';
import { getAuditoriasApi } from '../../../api/inventory';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as xlsx from 'xlsx/xlsx.mjs';

function ListComponent({ logged }) {

	const [form] = Form.useForm();
	const { Option } = Select;

	const [accionAuditoria, setAccionAuditoria] = useState("");
	const [allUsers, setAllUsers] = useState([]);
	const [allAuditorias, setAllAuditorias] = useState([]);
	const [dateInit, setDateInit] = useState("");
	const [dateEnd, setDateEnd] = useState("");
	const [currentUser, setCurrentUser] = useState("");

	const columns = [
		{
			title: 'Formulario',
			dataIndex: 'aplicativo',
			key: 'aplicativo',
		},
		{
			title: 'Acción',
			dataIndex: 'observacion',
			key: 'observacion'
		},
		{
			title: 'Fecha',
			dataIndex: 'fecha_registro',
			key: 'fecha_registro',
		},
		{
			title: 'Usuario',
			dataIndex: 'usuario_id',
			key: 'usuario_id',
			render: (_, record, index) => {
				return (
					<>
						{ record?.nombre_usuario } { record?.apellido_usuario }
					</>
				)
			}
		},
		{
			title: 'Valor anterior',
			dataIndex: 'valor_anterior',
			key: 'valor_anterior'
		},
		{
			title: 'Valor actual',
			dataIndex: 'valor_actual',
			key: 'valor_actual'
		},
		{
			title: 'Empresa',
			dataIndex: 'empresa_id',
			key: 'empresa_id',
			render: (_, record, index) => {
				return (
					<>
						{ record?.nombre_empresa } 
					</>
				)
			}
		},
		// {
		// 	title: 'Producto',
		// 	dataIndex: 'producto',
		// 	key: 'producto',
		// },
	];

	const accion_auditoria = [
		{ id: 1, name: 'Cambio de precio inventario fisico' },
		{ id: 2, name: 'Cambio de precio entrada de almacen' },
		{ id: 3, name: 'Cambio de precio edicion de producto' },
		{ id: 4, name: 'eliminacion de producto' },
		{ id: 5, name: 'creacion de productoo' },
		{ id: 7, name: 'Descuento' },
	];

	const getUsers = async (businessID) => {
		try {
			const response = await getUsersApi(businessID);
			setAllUsers(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los usuarios.');
		}
	}

	const getAuditorias = async () => {
		try {
			const response = await getAuditoriasApi(dateInit, dateEnd, accionAuditoria, currentUser);
			setAllAuditorias(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las auditorias.');
		}
	}

	const searchForAuditorias = async () => {

		if(dateInit != '' && dateEnd == '') {
			toast.warning('Si seleccionas una fecha `desde`, `hasta` no puede quedar vacío.');
			return;
		}

		if(dateInit == '' && dateEnd != '') {
			toast.warning('Si seleccionas una fecha `hasta`, `desde` no puede quedar vacío.');
			return;
		}

		if(dateInit != '' && dateEnd != '' && dateInit >= dateEnd) {
			toast.warning('La fecha inicial no puede ser mayor  a la final.');
			return;
		}

		try {
			const response = await getAuditoriasApi(dateInit, dateEnd, accionAuditoria, currentUser);
			setAllAuditorias(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las auditorias.');
		}
	}

	const searchDocuments = async () => {
		searchForAuditorias();
	}

	const generatePDF = async () => {
		const doc = new jsPDF();
		
		const columns = [
			{ header: 'Formulario', dataKey: 'aplicativo' },
			{ header: 'Acción', dataKey: 'observacion' },
			{ header: 'Fecha', dataKey: 'fecha_registro' },
			{ header: 'Usuario' },
			{ header: 'Valor anterior', dataKey: 'valor_anterior' },
			{ header: 'Valor actual', dataKey: 'valor_actual' },
			{ header: 'Empresa', dataKey: 'nombre_empresa' },
		];
	
		autoTable(doc, {
			columns,
			body: allAuditorias,
			styles: {
				halign: 'center',
				fontSize: 10,
			},
			didParseCell: function(data) {
				if (data.column.index === 3) {
				  const nombreUsuario = data.row.raw.nombre_usuario || 'Usuario';
				  const apellidoUsuario = data.row.raw.apellido_usuario || '';
				  data.cell.text[0] = nombreUsuario + ' ' + apellidoUsuario;
				}
			  },
		});
		doc.save('auditorias.pdf');
	};
	
	const exportToExcel = () => {
		const rows = allAuditorias.map(row => ({
			formulario: row.aplicativo,
			accion: row.observacion,
			fecha: row.fecha_registro,
			usuario: row.nombre_usuario + " " + row.apellido_usuario,
			valor_anterior: row.valor_anterior,
			valor_actual: row.valor_actual,
			empresa: row.nombre_empresa
		}));

		// Crea un nuevo libro de Excel
		const workbook = xlsx.utils.book_new();
	  
		const worksheet = xlsx.utils.json_to_sheet(rows);
	  
		// Añade la hoja de cálculo al libro
		xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
	  
		// Guarda el libro en un archivo
		xlsx.writeFile(workbook, 'auditorias.xlsx');
	};
	  
	  
	useEffect(() => {
	  getUsers(logged?.empresa_id);
	  getAuditorias();
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
						<Col span={8}>
							<Form.Item name="accion_auditoria" label="Acción auditoria">
								<Select 
									style={{ width: '100%', marginBottom: '12px' }}
									name="accion_auditoria"
									onChange={ ( value ) => setAccionAuditoria(value) }
								>
									{
										accion_auditoria.map((e, index) => (
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
						<Col span={4}>
							<Form.Item name="users" label="Usuario">
								<Select 
									style={{ width: '100%', marginBottom: '12px' }}
									name="users"
									onChange={ ( value ) => setCurrentUser(value) }
								>
									{
										allUsers.map((e, index) => (
											<Option 
												value={ e.usuario_id }
												key={ e.usuario_id }
											>
												{ e.nombre } { e.apellido }
											</Option>
										))
									}
								</Select>
							</Form.Item>
						</Col>
						<Col span={2}>
							<Button 
								type='primary'
								style={{ marginBottom: '2em' }}
								onClick={ () => searchDocuments() }
							>
								Buscar
							</Button>
						</Col>
						<Col span={2}>
							<Button 
								type='danger'
								style={{ marginBottom: '2em' }}
								onClick={ () => generatePDF() }
							>
								PDF
							</Button>
						</Col>
						<Col span={1}>
							<Button 
								style={{ marginBottom: '2em', backgroundColor: 'green', color: 'white', borderColor: 'white' }}
								onClick={ () => exportToExcel() }
							>
								Excel
							</Button>
						</Col>
					</Row>
				</Form>
			</div>

			<div id="auditorias_list">
				<Table
					dataSource={allAuditorias}
					columns={columns}
					pagination={{
						pageSizeOptions: ['10', '20', '50', '100', `${allAuditorias.length}`],
						showSizeChanger: true,
					}}
					key="auditoria_id"
				/>
			</div>
		</>
	)
}

export default ListComponent;