import { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Select , Switch} from 'antd';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';
import { storeUserApi, updateUserApi, getRolesByUserIDApi } from '../../../api/user';
import { validateUser } from '../../../validations/user';

function Create({
	setShowModal,
	showModal,
	roles,
	loggedUser,
	index,
	userEdit
}) {

	const [form] = Form.useForm();
	const { Option } = Select;
	const [currentRoles, setCurrentRoles] = useState([]);
	const [estadoUsuario, setEstadoUsuario] = useState(false);

	const [ formValues, handleInputChange, editValues, formReset ] = useForm(InitialValues);

	useEffect(() => {
		if(userEdit) {
			getRolesByUserID();
		} else {
			resetForm();
			setCurrentRoles([]);
			setEstadoUsuario(false);
		}
	}, [userEdit])
	

	const resetForm = () => {
    form.resetFields();
		formReset();
  }

	const onSubmit = async () => {
		const data = {
			...formValues,
			rolId: currentRoles.toString(),
			empresa_id: loggedUser?.empresa_id,
			estado: estadoUsuario ? 1 : 0,
			fecha_registro: new Date().toISOString(),
		}

		if(!validateUser(data, currentRoles)) {
			return false;
		}

		try {
			await storeUserApi(data);
			toast.success('Usuario almacenado correctamente.');
			resetForm();
			index(loggedUser.empresa_id);
			setShowModal(false);
		} catch (err) {
			console.log(err);
			toast.warn('Ha ocurrido un error al intentar guardar el usuario.');
		}
	}

	const onUpdate = async () => {
		const data = {
			...formValues,
			rolId: currentRoles.toString(),
			empresa_id: loggedUser?.empresa_id,
			estado: estadoUsuario ? 1 : 0,
			usuario_id: userEdit?.usuario_id
		}

		if(!validateUser(data, currentRoles)) {
			return false;
		}

		try {
			await updateUserApi(data);
			toast.success('Usuario actualizado correctamente.');
			resetForm();
			index(loggedUser.empresa_id);
			setShowModal(false);
		} catch (err) {
			console.log(err);
			toast.warn('Ha ocurrido un error al intentar modificar el usuario.');
		}
	}

	const getRolesByUserID = async () => {
		try {
			const response = await getRolesByUserIDApi(userEdit?.usuario_id);
			let res = response.map(item => item.rol_id);
			setCurrentRoles( res );
			setEstadoUsuario(userEdit?.estado);
			editValues(EditValues(userEdit));
			form.setFieldsValue({ ...EditValues(userEdit), roles: res });
		} catch (err) {
			console.log(err);
			toast.warn('Ha ocurrido un error al intentar obtener los roles del usuario.');
		}
	}

	return (
		<div>
			<Modal
        title={ userEdit ? "Modificar usuario" : "Crea un nuevo usuario"}
        visible={showModal}
        onCancel={() => setShowModal(false)}
				onOk={ e => userEdit ? onUpdate(e) : onSubmit(e) }
				okText="Guardar"
        forceRender
      >
				<Form
					form={form} 
					layout="vertical" 
				>
					<Row gutter={24}>
						<Col span={12}>
							<Form.Item 
								label="Nombre *" 
								name="nombre"
							>
								<Input 
									type="text"
									name="nombre"
									onChange={ handleInputChange }
									placeholder="Nombre"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item 
								label="Correo *" 
								name="correo"
							>
								<Input 
									type="email"
									name="correo"
									onChange={ handleInputChange }
									placeholder="Correo"
								/>
							</Form.Item>
						</Col>

						<Col span={24} style={{ marginBottom: '1em' }}>
							<Form.Item
								label="Roles *" 
								name="roles"
							>
								<Select
									mode="multiple"
									name="roles"
									style={{ width: '100%' }}
									placeholder="Selecciona roles"
									onChange={ (value) => setCurrentRoles(value) }
									optionLabelProp="label"
								>
									{
										roles.map((role, key) => (
											<Option 
												value={role.rol_id}
												label={role.nombre}
												key={key}
											>
												<div>
													{ role.nombre } 
												</div>
											</Option>
										))
									}
								</Select>
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item 
								label="Identificación *" 
								name="identificacion"
							>
								<Input 
									type="text"
									name="identificacion"
									onChange={ handleInputChange }
									placeholder="Identificación"
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item 
								label="Clave *" 
								name="clave"
							>
								<Input 
									type="password"
									name="clave"
									onChange={ handleInputChange }
									placeholder="Clave"
								/>
							</Form.Item>
						</Col>

						<Col span={24}>
								Estado * 
								<Switch 
									size='small'
									onChange={ ( value ) => setEstadoUsuario(value)}
									checked={ estadoUsuario }
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
		correo: "",
		identificacion: "",
		clave: "",
		apellido: "",
		area: "",
		empresa_id: "",
		fecha_registro: "",
		puesto: "",
		sede: "",
		supervisor: "",
		tipoVinculacion: ""
	}
}

function EditValues(item) {
	return {
		nombre: item?.nombre || "",
		correo: item?.correo || "",
		identificacion: item?.identificacion || "",
		clave: item?.clave || "",
		fecha_registro: item?.fecha_registro || ""
	}
}

export default Create;