import { useState, useEffect } from 'react';
import { Modal, Form, Input, Col, Row, Select } from 'antd';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';
import { storeSuppliersApi, updateSupplierApi } from '../../../api/supplies';
import { validateSupplier } from '../../../validations/supplier';

function Create({
	setShowModal,
	showModal,
	tiposIdentificacion,
	loggedUser,
	index,
	supplieEdit,
}) {

	const [form] = Form.useForm();
	const { Option } = Select;

	const [ formValues, handleInputChange, editValues, formReset ] = useForm(InitialValues);
	const [currentIdentificationType, setCurrentIdentificationType] = useState(1);

	useEffect(() => {
		if(supplieEdit) {
			editValues( EditValues(supplieEdit) );
			setCurrentIdentificationType(supplieEdit?.tipo_identificacion_id);
			form.setFieldsValue(
				{
					...EditValues(supplieEdit), 
					tipo_identificacion_id: supplieEdit.tipo_identificacion_id 
				}
			);
		} else {
			resetForm();
			setCurrentIdentificationType(1);
		}
	}, [supplieEdit])
	

	const resetForm = () => {
    form.resetFields();
		formReset();
  }

	const onSubmit = async () => {
		const data = {
			...formValues,
			empresa_id: loggedUser?.empresa_id,
			fecha_registro: new Date().toISOString(),
			tipo_identificacion_id: currentIdentificationType,
		}

		if(!validateSupplier(data)) {
			return false;
		}

		try {
			await storeSuppliersApi(data);
			toast.success('Proveedor almacenado correctamente.');
			resetForm();
			index(loggedUser.empresa_id);
			setShowModal(false);
		} catch (err) {
			console.log(err);
			toast.warn('Ha ocurrido un error al intentar guardar el proveedor.');
		}
	}

	const onUpdate = async () => {
		const data = {
			...formValues,
			empresa_id: loggedUser?.empresa_id,
			tipo_identificacion_id: currentIdentificationType,
			proveedor_id: supplieEdit?.proveedor_id,
			fijo: formValues.fijo != '' ? formValues.fijo : null 
		}

		if(!validateSupplier(data)) {
			return false;
		}

		try {
			await updateSupplierApi(data);
			toast.success('Proveedor actualizado correctamente.');
			resetForm();
			index(loggedUser.empresa_id);
			setShowModal(false);
		} catch (err) {
			console.log(err);
			toast.warn('Ha ocurrido un error al intentar actualizar el proveedor.');
		}
	}

	return (
		<div>
			<Modal
        title={ supplieEdit ? "Modificar proveedor" : "Crea un nuevo proveedor"}
        visible={showModal}
        onCancel={() => setShowModal(false)}
				onOk={ e => supplieEdit ? onUpdate(e) : onSubmit(e) }
				okText="Guardar"
        forceRender
      >
				<Form 
						form={form} 
						layout="vertical" 
						initialValues={ { tipo_identificacion_id: 1 } }
					>
						<Row gutter={24}>
							<Col span={12}>
								<Form.Item 
									label="Primer nombre *" 
									name="nombre"
								>
									<Input 
										type="text"
										name="nombre"
										onChange={ handleInputChange }
										placeholder="Primer nombre"
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Segundo nombre" name="segundo_nombre">
									<Input 
										type="text"
										name="segundo_nombre"
										onChange={ handleInputChange }
										placeholder="Segundo nombre"
									/>
								</Form.Item>
							</Col>

							<Col span={12}>
								<Form.Item label="Primer apellido *" name="apellidos">
									<Input 
										type="text"
										name="apellidos"
										onChange={ handleInputChange }
										placeholder="Primer apellido"
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Segundo apellido" name="segundo_apellido">
									<Input 
										type="text"
										name="segundo_apellido"
										onChange={ handleInputChange }
										placeholder="Segundo apellido"
									/>
								</Form.Item>
							</Col>

							<Col span={12}>
								<Form.Item name="tipo_identificacion_id" label="Tipo Identificación *">
									<Select 
										style={{ width: '100%', marginBottom: '12px' }}
										name="tipo_identificacion_id"
										onChange={ ( value ) => setCurrentIdentificationType(value) }
									>
										{
											tiposIdentificacion.map((ti, index) => (
												<Option 
													value={ ti.tipo_identificacion_id }
													key={ index }
												>
													{ ti.nombre }
												</Option>
											))
										}
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Nro. identificación *" name="documento">
									<Input 
										type="text"
										name="documento"
										onChange={ handleInputChange }
										placeholder="Nro. Identificación"
									/>
								</Form.Item>
							</Col>

							<Col span={12}>
								<Form.Item label="Dirección *" name="direccion">
									<Input 
										type="text"
										name="direccion"
										onChange={ handleInputChange }
										placeholder="Dirección"
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Fijo" name="fijo">
									<Input 
										type="text"
										name="fijo"
										onChange={ handleInputChange }
										placeholder="Fijo"
									/>
								</Form.Item>
							</Col>

							<Col span={12}>
								<Form.Item label="Celular" name="celular">
									<Input 
										type="text"
										name="celular"
										onChange={ handleInputChange }
										placeholder="Celular"
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Mail *" name="mail">
									<Input 
										type="email"
										name="mail"
										onChange={ handleInputChange }
										placeholder="Mail"
									/>
								</Form.Item>
							</Col>

							<Col span={24}>
								<Form.Item label="% de retención" name="retencion">
									<Input 
										type="number"
										min="0"
										name="retencion"
										onChange={ handleInputChange }
										placeholder="% de retención"
									/>
								</Form.Item>
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
		segundo_nombre: "",
		apellidos: "",
		segundo_apellido: "",
		barrio: "",
		celular: "",
		documento: "",
		direccion: "",
		fijo: "",
		mail: "",
		fecha_registro: "",
		retencion: null,
		proveedor_id: null,
		credito_activo: 0
	}
}

function EditValues(item) {
	return {
		nombre: item.nombre || "",
		segundo_nombre: item.segundo_nombre || "",
		apellidos: item.apellidos || "",
		segundo_apellido: item.segundo_apellido || "",
		barrio: "",
		celular: item.celular || "",
		documento: item.documento || "",
		direccion: item.direccion || "",
		fijo: item.fijo || "",
		mail: item.mail || "",
		fecha_registro: item.fecha_registro || "",
		retencion: item.retencion || null,
		credito_activo: 0
	}
}

export default Create;