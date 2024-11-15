import { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Input, Select } from 'antd';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';
import { updateEmpleadoApi, getPaymentsEmployeesApi } from '../../../api/nomina';

function ConfigEmployeeComponent({
	showModalConfigEmployee,
	setShowModalConfigEmployee,
	nomina,
	allEmployees,
	clickCierreNomina
}) {

	const { Option } = Select;
	const [form] = Form.useForm();

	const [ formValues, handleInputChange, setValues, reset ] = useForm({
		empleado_id: "",
		pago_empleado_id: "",
		porcentaje_pago: 0,
		ahorro: 0,
		pago_admin: 0,
		sueldo: 0
	});

	const [paymentsEmp, setPaymentsEmp] = useState([]);
	const [employeeID, setEmployeeID] = useState(null);
	const [paymentEmployeeID, setPaymentEmployeeID] = useState(null);
	const [infoEmployee, setInfoEmployee] = useState(null);

	const resetForm = () => {
    form.resetFields();
		reset();
  }

	const getPayments = async () => {
		try {
			const res = await getPaymentsEmployeesApi();
			setPaymentsEmp(res);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al obtener los tipos de pagos de empleados.');
		}
	}

	const onSubmit = async () => {
		const data = {
			...formValues,
			empleado_id: employeeID,
			pago_empleado_id: paymentEmployeeID,
		}

		if(!isValid(data)) {
			return;
		}

		try {
			await updateEmpleadoApi(infoEmployee, data);
			toast.success('Configuración de empleado realizada éxitosamente.');
			resetForm();
			clickCierreNomina();
			setShowModalConfigEmployee( false );
		} catch (err) {
			console.log(err);
			toast.warn('Ocurrió un error al actualizar los datos del empleado.');
		}
	}

	const isValid = (form) => {
		if(form.empleado_id == "" || !form.empleado_id) {
			toast.warning('El campo empleado es obligatorio.');
			return false;
		}

		if(form.pago_empleado_id == "" || !form.pago_empleado_id) {
			toast.warning('El campo pago empleado es obligatorio.');
			return false;
		}

		if(form.sueldo == "" || !form.sueldo) {
			toast.warning('El campo sueldo es obligatorio.');
			return false;
		}

		return true;
	}

	useEffect(() => {
		getPayments();
	}, [nomina])

	useEffect(() => {
		if(employeeID) {
			const currentEmp = allEmployees.find(item => {
				return item.empleado_id == employeeID
			});

			setInfoEmployee( currentEmp );

		}
	}, [employeeID])
	
	

	return (
		<Modal
			title="Configuración de empleado"
			visible={ showModalConfigEmployee }
			onCancel={() => { setShowModalConfigEmployee(false); }}
			onOk={ (e) => onSubmit(e) }
			okText="Guardar"
			forceRender
		>

			<Form form={form} layout='vertical'>
				<Row gutter={24}>
					<Col span={12}>
						<Form.Item name="empleado_id" label="Empleado">
							<Select 
								style={{ width: '100%', marginBottom: '12px' }}
								name="empleado_id"
								onChange={ ( value ) => setEmployeeID(value) }
							>
								{
									nomina.map((e, index) => (
										<Option 
											value={ e.empleado_id }
											key={ index }
										>
											{ e.nombre }
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="pago_empleado_id" label="Pago Empleado">
							<Select 
								style={{ width: '100%', marginBottom: '12px' }}
								name="pago_empleado_id"
								onChange={ ( value ) => setPaymentEmployeeID(value) }
							>
								{
									paymentsEmp.map((e, index) => (
										<Option 
											value={ e.pago_empleado_id }
											key={ index }
										>
											{ e.nombre }
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name="porcentaje_pago" label="% pago">
							<Input 
								name='porcentaje_pago'
								onChange={ handleInputChange }
								placeholder='% Pago'
								disabled={true}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="ahorro" label="% Ahorro">
							<Input 
								name='ahorro'
								onChange={ handleInputChange }
								placeholder='% Ahorro'
							/>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name="pago_admin" label="Pago admin">
							<Input 
								name='pago_admin'
								onChange={ handleInputChange }
								placeholder='Pago admin'
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="sueldo" label="Sueldo">
							<Input 
								name='sueldo'
								onChange={ handleInputChange }
								placeholder='Sueldo'
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>

		</Modal>
	)
}

export default ConfigEmployeeComponent