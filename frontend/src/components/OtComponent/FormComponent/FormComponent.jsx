import { useState, useEffect } from 'react';
import { Row, Col, Input, Button, Select } from 'antd';
import { toast } from 'react-toastify';

import {  getClientsApi } from '../../../api/client';
import {  getTrademarksApi } from '../../../api/orderWork';
import {  getEmployeesApi } from '../../../api/employee';
import TableOtComponent from '../TableComponent';

import "./FormComponent.scss";

function FormComponent({ logged, currentDocument, users }) {
	
	const { Option } = Select;
	const { TextArea } = Input;

	const [clients, setClients] = useState([]);
	const [trademarks, setTrademarks] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [current, setCurrent] = useState({
		user: "",
		order_id: "",
		fecha_entrada: "",
	})

	const getClientsByBusiness = async (businessID) => {
		try {
			const response = await getClientsApi(businessID);
			setClients(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los clientes.');
		}
	}

	const getEmployeesByBusiness = async (businessID) => {
		try {
			const response = await getEmployeesApi(businessID);
			setEmployees(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los empleados.');
		}
	}


	const getTrademarks = async () => {
		try {
			const response = await getTrademarksApi();
			setTrademarks(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las marcas.');
		}
	}

	const getUserName = (userID) => {
		const user = users.find(el => el.usuario_id == userID);
		return user.nombre;
	}

	useEffect(() => {
		getClientsByBusiness( logged?.empresa_id );
		getEmployeesByBusiness( logged?.empresa_id );
		getTrademarks();
	}, [logged])

	useEffect(() => {
		setCurrent({
			user: "",
			order_id: "",
			fecha_entrada: "",
		});

		if(currentDocument) {
			setCurrent({
				user: currentDocument?.content.usuario_id,
				order_id: currentDocument?.content.documento_id,
				fecha_entrada: currentDocument?.content.fecha_registro,
			});
		}
	}, [currentDocument])
	
	
	
	return (
		<div className='form-component-ot'>
			<Row gutter={24}>
				<Col span={12}>
					<strong>
						Usuario que crea: { current?.user && getUserName(current?.user) }
					</strong>
				</Col>
				<Col span={12}>
					<strong>
						Telefono cliente: 
					</strong>
				</Col>

				<Col span={8}>
					<strong>
						#Orden de pedido: { current?.order_id }
					</strong>
				</Col>
				<Col span={8}>
					<strong>
						Fecha entrada: { new Date(current?.fecha_entrada).toLocaleString() }
					</strong>
				</Col>
				<Col span={8}></Col>

				<Col span={8}>
					<strong>
						Fecha entrega: 
					</strong>
				</Col>
				<Col span={8}>
					<Input 
						type="text"
						className='pt-2'
						placeholder='* PLACA'
					/>
				</Col>
				<Col span={8}>
					<Select 
						showSearch
						name="cliente"
						size="middle"
						placeholder="Cliente"
						className='pt-2'
						// onChange={(val) => { setCurrentSupplier(val); documentTypeRef.current.focus(); }}
						style={{ width: '100%' }}
						filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
						allowClear
					>
						{
							clients.length > 0 &&
							clients.map((item, idx) => (
								<Option
									key={idx}
									value={item.cliente_id}
								>
									{item.nombre} { item.apellidos }
								</Option>
							))
						}
					</Select>
				</Col>

				<Col span={8}>
					<Select 
						showSearch
						name="marca"
						size="middle"
						placeholder="Marca"
						className='pt-2'
						// onChange={(val) => { setCurrentSupplier(val); documentTypeRef.current.focus(); }}
						style={{ width: '100%' }}
						filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
						allowClear
					>
						{
							trademarks.length > 0 &&
							trademarks.map((item, idx) => (
								<Option
									key={idx}
									value={item.marca_vehiculo_id}
								>
									{item.nombre}
								</Option>
							))
						}
					</Select>
				</Col>
				<Col span={8}>
					<Input 
						type="text"
						className='pt-2'
						placeholder='Modelo'
					/>
				</Col>
				<Col span={8}>
					<Select 
						showSearch
						name="linea"
						size="middle"
						placeholder="Seleccione línea"
						className='pt-2'
						// onChange={(val) => { setCurrentSupplier(val); documentTypeRef.current.focus(); }}
						style={{ width: '100%' }}
						filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
						allowClear
					>
						<Option value="null">Seleccione línea</Option>
						<Option value="automovil">Automovil</Option>
						<Option value="camioneta">Camioneta - Campero</Option>
						<Option value="moto">Moto</Option>
					</Select>
				</Col>

				<Col span={24}>
					<TextArea 
						type="text"
						className='pt-2'
						placeholder='Descripción cliente'
						rows="4"
					/>
				</Col>

				<Col span={24}>
					<TextArea 
						type="text"
						className='pt-2'
						placeholder='Observación'
						rows="4"
					/>
				</Col>

				<Col span={24}>
				<Select 
						showSearch
						name="empleado"
						size="middle"
						placeholder="Empleado"
						className='pt-2'
						// onChange={(val) => { setCurrentSupplier(val); documentTypeRef.current.focus(); }}
						style={{ width: '100%' }}
						filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
						allowClear
					>
						{
							employees.length > 0 &&
							employees.map((item, idx) => (
								<Option
									key={idx}
									value={item.empleado_id}
								>
									{item.nombre} { item.apellido }
								</Option>
							))
						}
					</Select>
				</Col>

				<Col span={12}>
					<Button 
						type="primary"
						className='pt-2'
						size='middle'
					>
						Agregar repuesto
					</Button>
				</Col>
				<Col span={12} className="pt-2">
					<strong>
						Total orden: $0
					</strong>
				</Col>
			</Row>

			<TableOtComponent />
		</div>
	)
}

export default FormComponent;