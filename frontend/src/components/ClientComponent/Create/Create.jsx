import { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, Select, Radio } from 'antd';
import { toast } from 'react-toastify';
import { useForm } from '../../../hooks/useForm';

import { validateClient1, validateClient2 } from '../../../validations/client';
import { storeClient, updateClient } from '../../../api/client';

function Create(props) {

	const {
		showModal,
		setShowModal,
		factTipoEmpresa,
		tiposIdentificacion,
		loggedUser,
		index,
		clientEdit = null,
		ciudades
	} = props;

	const [form] = Form.useForm();

	let [formValues, handleInputChange, , formReset] = useForm(clientEdit ? ClientEditForm(clientEdit) : ClientForm);

	const [currentTipoEmpresaF, setCurrentTipoEmpresaF] = useState(1);
	const [currentIdentificationType, setCurrentIdentificationType] = useState(1);
	const [currentCiudad, setCurrentCiudad] = useState(null);
	const [currentDepartamento, setCurrentDepartamento] = useState(null);

	useEffect(() => {
		if (clientEdit) {
			changeCurrentTipoEmpresaF(clientEdit.fact_tipo_empresa_id);
			setCurrentIdentificationType(clientEdit.tipo_identificacion_id);
			setCurrentCiudad(clientEdit?.ciudad_id);
			form.setFieldsValue({ ciudad_id: clientEdit?.ciudad_id });
		} else {
			resetForm();
			setCurrentIdentificationType(1);
			setCurrentTipoEmpresaF(1);
		}
	}, [clientEdit])

	useEffect(() => {
	  if(currentCiudad) {
		const departamento = ciudades.find(item => item.ciudad_id == currentCiudad);

		form.setFieldsValue({ departamento: departamento.nombre_departamento });

		setCurrentDepartamento({
			nombre: departamento.nombre_departamento,
			codigo: departamento.codigo_departamento
		});
	  }
	}, [currentCiudad])
	


	const resetForm = () => {
		form.resetFields();
		formReset();
	}

	const onSubmit = async (e) => {
		e.preventDefault();
		const data = {
			...formValues,
			ciudad_id: currentCiudad,
			tipo_identificacion_id: currentIdentificationType,
			empresa_id: loggedUser.empresa_id,
			fact_tipo_empresa_id: currentTipoEmpresaF
		}

		if (currentTipoEmpresaF == 1) {
			if (!validateClient1(data)) {
				return;
			}
		}

		if (currentTipoEmpresaF == 2) {
			if (!validateClient2(data)) {
				return;
			}
		}

		try {
			await storeClient(data);
			toast.success('Cliente almacenado correctamente.');
			resetForm();
			index(loggedUser.empresa_id);
			setShowModal(false);
		} catch (err) {
			toast.warning('Ha ocurrido un error interno al intentar guardar el cliente.');
		}

	}

	const onUpdate = async (e) => {
		e.preventDefault();
		const data = {
			...formValues,
			ciudad_id: currentCiudad || clientEdit?.ciudad_id,
			cliente_id: clientEdit?.cliente_id || "",
			tipo_identificacion_id: currentIdentificationType,
			empresa_id: loggedUser.empresa_id,
			fact_tipo_empresa_id: currentTipoEmpresaF
		}

		if (currentTipoEmpresaF == 1) {
			if (!validateClient1(data)) {
				return;
			}
		}

		if (currentTipoEmpresaF == 2) {
			if (!validateClient2(data)) {
				return;
			}
		}

		try {
			await updateClient(data);
			toast.success('Cliente actualizado correctamente.');
			resetForm();
			index(loggedUser.empresa_id);
			setShowModal(false);
		} catch (err) {
			toast.warning('Ha ocurrido un error interno al intentar actualizar el cliente.');
		}

	}

	const changeCurrentTipoEmpresaF = (val) => {
		setCurrentTipoEmpresaF(val);
		resetForm();
	}

	return (
		<div>
			<Modal
				title={clientEdit ? "Modificar cliente" : "Crea un nuevo cliente"}
				visible={showModal}
				onCancel={() => setShowModal(false)}
				onOk={e => clientEdit ? onUpdate(e) : onSubmit(e)}
				okText="Guardar"
				forceRender
			>
				<Form form={form} layout="vertical" initialValues={clientEdit ? ClientEditForm(clientEdit) : { tipo_identificacion_id: 1 }}>
					<Row gutter={24}>
						<Col
							span={24}
							style={{ width: '100%', marginBottom: '2em', textAlign: 'center' }}
						>
							<Radio.Group
								options={factTipoEmpresa}
								value={currentTipoEmpresaF}
								onChange={({ target }) => changeCurrentTipoEmpresaF(target.value)}
								optionType="button"
							/>
						</Col>

						{
							currentTipoEmpresaF == 1 ? (
								<FormOption1
									tiposIdentificacion={tiposIdentificacion}
									currentIdentificationType={currentIdentificationType}
									setCurrentIdentificationType={setCurrentIdentificationType}
									setCurrentCiudad={ setCurrentCiudad }
									currentCiudad={ currentCiudad }
									handleInputChange={handleInputChange}
									ciudades={ciudades}
									currentDepartamento={ currentDepartamento }
								/>
							) : (
								<FormOption2
									tiposIdentificacion={tiposIdentificacion}
									currentIdentificationType={currentIdentificationType}
									setCurrentIdentificationType={setCurrentIdentificationType}
									setCurrentCiudad={ setCurrentCiudad }
									currentCiudad={ currentCiudad }
									handleInputChange={handleInputChange}
									ciudades={ciudades}
									currentDepartamento={ currentDepartamento }
								/>
							)
						}

					</Row>
				</Form>
			</Modal>
		</div>
	)
}

function FormOption1({
	tiposIdentificacion,
	currentIdentificationType,
	setCurrentIdentificationType,
	setCurrentCiudad,
	currentCiudad,
	handleInputChange,
	ciudades,
	currentDepartamento
}) {
	const { Option } = Select;

	return (
		<>
			<Col span={24}>
				<Form.Item label="Razón social *" name="razon_social">
					<Input
						type="text"
						name="razon_social"
						onChange={handleInputChange}
						placeholder="Razón social"
					/>
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item name="tipo_identificacion_id" label="Tipo Identificación *">
					<Select
						style={{ width: '100%', marginBottom: '12px' }}
						name="tipo_identificacion_id"
						onChange={(value) => setCurrentIdentificationType(value)}
					>
						{
							tiposIdentificacion.map((ti, index) => (
								<Option
									value={ti.tipo_identificacion_id}
									key={index}
								>
									{ti.nombre}
								</Option>
							))
						}
					</Select>
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item label="Nro. Identificación *" name="documento">
					<Input
						type="text"
						name="documento"
						onChange={handleInputChange}
						placeholder="Nro. Identificación"
					/>
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item label="Dígito verificación *" name="digito_verificacion">
					<Input
						type="text"
						maxLength={1}
						name="digito_verificacion"
						onChange={handleInputChange}
						placeholder="Dígito verificación"
					/>
				</Form.Item>
			</Col>

			<Col span={12}>
				<Form.Item label="Dirección cliente *" name="direccion">
					<Input
						type="text"
						name="direccion"
						onChange={handleInputChange}
						placeholder="Dirección cliente"
					/>
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item label="Fijo" name="fijo">
					<Input
						type="text"
						name="fijo"
						onChange={handleInputChange}
						placeholder="Teléfono fijo"
					/>
				</Form.Item>
			</Col>

			<Col span={12}>
				<Form.Item label="Celular" name="celular">
					<Input
						type="text"
						name="celular"
						onChange={handleInputChange}
						placeholder="Teléfono celular"
					/>
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item label="Email *" name="mail">
					<Input
						type="email"
						name="mail"
						onChange={handleInputChange}
						placeholder="Correo cliente"
					/>
				</Form.Item>
			</Col>
			
			<Col span={12}>
				<Form.Item label="Ciudad" name="ciudad_id">
					<Select
						showSearch
						defaultActiveFirstOption={false}
						style={{ width: '100%', marginBottom: '12px' }}
						name="ciudad_id"
						onChange={(value) => setCurrentCiudad(value)}
						filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
					>
						{
							ciudades.map((ciudad, index) => (
								<Option
									value={ciudad.ciudad_id}
									key={index}
								>
									{ciudad.nombre}
								</Option>
							))
						}
					</Select>
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item label="Departamento" name="departamento">
					<Input
						type="text"
						readOnly
						name="departamento"
						placeholder="Departamento"
						value={currentDepartamento?.nombre}
					/>
				</Form.Item>
			</Col>
		</>
	)
}



function FormOption2({
	tiposIdentificacion,
	currentIdentificationType,
	setCurrentIdentificationType,
	setCurrentCiudad,
	currentCiudad,
	handleInputChange,
	ciudades,
	currentDepartamento
}) {
	const { Option } = Select;

	return (
		<>
			<Col span={12}>
				<Form.Item label="Primer nombre *" name="nombre">
					<Input
						type="text"
						name="nombre"
						onChange={handleInputChange}
						placeholder="Primer nombre"
					/>
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item label="Segundo nombre" name="segundo_nombre">
					<Input
						type="text"
						name="segundo_nombre"
						onChange={handleInputChange}
						placeholder="Segundo nombre"
					/>
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item label="Primer apellido *" name="apellidos">
					<Input
						type="text"
						name="apellidos"
						onChange={handleInputChange}
						placeholder="Primer apellido"
					/>
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item label="Segundo apellido" name="segundo_apellido">
					<Input
						type="text"
						name="segundo_apellido"
						onChange={handleInputChange}
						placeholder="Segundo apellido"
					/>
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item name="tipo_identificacion_id" label="Tipo Identificación *">
					<Select
						style={{ width: '100%', marginBottom: '12px' }}
						name="tipo_identificacion_id"
						onChange={(value) => setCurrentIdentificationType(value)}
					>
						{
							tiposIdentificacion.map((ti, index) => (
								<Option
									value={ti.tipo_identificacion_id}
									key={index}
								>
									{ti.nombre}
								</Option>
							))
						}
					</Select>
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item label="Nro. Identificación *" name="documento">
					<Input
						type="text"
						name="documento"
						onChange={handleInputChange}
						placeholder="Nro. Identificación"
					/>
				</Form.Item>
			</Col>
			<Col span={24}>
				<Form.Item label="Dígito verificación *" name="digito_verificacion">
					<Input
						type="text"
						name="digito_verificacion"
						onChange={handleInputChange}
						placeholder="Dígito verificación"
						maxLength={1}
					/>
				</Form.Item>
			</Col>

			<Col span={12}>
				<Form.Item label="Dirección cliente *" name="direccion">
					<Input
						type="text"
						name="direccion"
						onChange={handleInputChange}
						placeholder="Dirección cliente"
					/>
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item label="Fijo" name="fijo">
					<Input
						type="text"
						name="fijo"
						onChange={handleInputChange}
						placeholder="Teléfono fijo"
					/>
				</Form.Item>
			</Col>

			<Col span={12}>
				<Form.Item label="Celular" name="celular">
					<Input
						type="text"
						name="celular"
						onChange={handleInputChange}
						placeholder="Teléfono celular"
					/>
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item label="Email *" name="mail">
					<Input
						type="email"
						name="mail"
						onChange={handleInputChange}
						placeholder="Correo cliente"
					/>
				</Form.Item>
			</Col>

			<Col span={12}>
				<Form.Item label="Ciudad" name="ciudad_id">
					<Select
						showSearch
						defaultActiveFirstOption={false}
						style={{ width: '100%', marginBottom: '12px' }}
						name="ciudad_id"
						onChange={(value) => setCurrentCiudad(value)}
						filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
					>
						{
							ciudades.map((ciudad, index) => (
								<Option
									value={ciudad.ciudad_id}
									key={index}
								>
									{ciudad.nombre}
								</Option>
							))
						}
					</Select>
				</Form.Item>
			</Col>
			<Col span={12}>
				<Form.Item label="Departamento" name="departamento">
					<Input
						type="text"
						readOnly
						name="departamento"
						placeholder="Departamento"
						value={currentDepartamento?.nombre}
					/>
				</Form.Item>
			</Col>
		</>
	)
}

function ClientForm() {
	return {
		nombre: "",
		apellidos: "",
		segundo_nombre: "",
		segundo_apellido: "",
		razon_social: "",
		documento: "",
		digito_verificacion: "",
		direccion: "",
		fijo: "",
		celular: "",
		mail: "",
		barrio: "",
		ciudad_id: null,
		departamento: null,
		//empresa_id, fact_tipo_empresa_id,fecha_registro
	}
}

function ClientEditForm(clientEdit) {
	return {
		nombre: clientEdit?.nombre || "",
		apellidos: clientEdit?.apellidos || "",
		segundo_nombre: clientEdit?.segundo_nombre || "",
		segundo_apellido: clientEdit?.segundo_apellido || "",
		razon_social: clientEdit?.razon_social || "",
		tipo_identificacion_id: clientEdit?.tipo_identificacion_id || "",
		documento: clientEdit?.documento || "",
		digito_verificacion: clientEdit?.digito_verificacion || "",
		direccion: clientEdit?.direccion || "",
		fijo: clientEdit?.fijo || "",
		celular: clientEdit?.celular || "",
		mail: clientEdit?.mail || "",
		barrio: "",
		ciudad_id: clientEdit?.ciudad_id || "",
		departamento: null,
		//empresa_id, fact_tipo_empresa_id,fecha_registro
	}
}

export default Create;