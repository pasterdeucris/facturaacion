import { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Input, Switch } from 'antd';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';

import { storeEmployeesApi, updateEmployeesApi } from '../../../api/employee';
import { validateEmployee } from '../../../validations/employee';

function Create({
	showModal,
	setShowModal,
	employeeEdit,
	loggedUser,
	index
}) {

	const [form] = Form.useForm();

	const [ formValues, handleInputChange, editValues, formReset ] = useForm(InitialValues);
	const [estadoEmpleado, setEstadoEmpleado] = useState(false);

	useEffect(() => {
		if(employeeEdit) {
			setEstadoEmpleado(employeeEdit.estado);
			editValues(EditValues(employeeEdit));
			form.setFieldsValue(EditValues(employeeEdit));
		} else {
			resetForm();
			setEstadoEmpleado(false);
		}
	}, [employeeEdit])

	const onSubmit = async (e) => {
		e.preventDefault();

		const data = {
			...formValues,
			estado: estadoEmpleado ? 1 : 0,
			empresa_id: loggedUser?.empresa_id
		}

		if(!validateEmployee(data)) {
			return false;
		}

		try {
			await storeEmployeesApi(data);
			toast.success('Empleado almacenado correctamente.');
			resetForm();
			index(loggedUser.empresa_id);
			setShowModal(false);
		} catch (err) {
			console.log(err);
			toast.warn('Ha ocurrido un error al intentar guardar el empleado.');
		}
	}

	const onUpdate = async (e) => {
		e.preventDefault();

		const data = {
			...formValues,
			estado: estadoEmpleado ? 1 : 0,
			empleado_id: employeeEdit.empleado_id,
			empresa_id: loggedUser?.empresa_id
		}

		if(!validateEmployee(data)) {
			return false;
		}

		try {
			await updateEmployeesApi(data);
			toast.success('Empleado actualizado correctamente.');
			resetForm();
			index(loggedUser.empresa_id);
			setShowModal(false);
		} catch (err) {
			console.log(err);
			toast.warn('Ha ocurrido un error al intentar modificar el empleado.');
		}
	}

	const resetForm = () => {
    form.resetFields();
		formReset();
  }

	return (
		<div>
			<Modal
        title={ employeeEdit ? "Modificar empleado" : "Crea un nuevo empleado"}
        visible={showModal}
        onCancel={() => setShowModal(false)}
				onOk={ e => employeeEdit ? onUpdate(e) : onSubmit(e) }
				okText="Guardar"
        forceRender
      >
					<Form 
						form={form} 
						layout="vertical" 
					>
						<Row gutter={24}>
							<Col span={12}>
								<Form.Item label="Nombre *" name="nombre">
									<Input 
										type="text"
										name="nombre"
										onChange={ handleInputChange }
										placeholder="Nombre"
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Apellido *" name="apellido">
									<Input 
										type="text"
										name="apellido"
										onChange={ handleInputChange }
										placeholder="Apellido"
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Identificación *" name="identificacion">
									<Input 
										type="text"
										name="identificacion"
										onChange={ handleInputChange }
										placeholder="Identificación"
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Teléfono *" name="telefono">
									<Input 
										type="text"
										name="telefono"
										onChange={ handleInputChange }
										placeholder="Teléfono"
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								Estado * 
								<Switch 
									size='small'
									onChange={ ( value ) => setEstadoEmpleado(value)}
									checked={ estadoEmpleado }
								/>
							</Col>
						</Row>
					</Form>

			</Modal>
		</div>
	)
}

function InitialValues() {
	return {
		nombre: "",
		apellido: "",
		identificacion: "",
		empresa_id: "",
		pago_admin: 0,
		pago_empleado_id: 0,
		porcentaje_descuento: 0,
		porcentaje_pago: 0,
		sueldo: 0,
		telefono: ""
	}
}

function EditValues(employeeEdit) {
	return {
		nombre: employeeEdit?.nombre || "",
		apellido: employeeEdit?.apellido || "",
		identificacion: employeeEdit?.identificacion || "",
		empresa_id: "",
		pago_admin: 0,
		pago_empleado_id: 0,
		porcentaje_descuento: 0,
		porcentaje_pago: 0,
		sueldo: 0,
		telefono: employeeEdit?.telefono || ""
	}
}

export default Create;