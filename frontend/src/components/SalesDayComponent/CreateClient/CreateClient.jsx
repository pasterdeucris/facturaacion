import { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Row, Col, Select, Radio } from 'antd';
import { toast } from 'react-toastify';
import { useForm } from '../../../hooks/useForm';

import { validateClient1, validateClient2 } from '../../../validations/client';
import { storeClient, updateClient, getIdentificationsTypeApi, getCiudadesApi } from '../../../api/client';
import { getBusinessTypeApi } from "../../../api/business";

function Create(props) {

	const {
		showModal,
		setShowModal,
		loggedUser,
		index,
		clientNotExist
		// clientEdit = null,
	} = props;

	const [form] = Form.useForm();

	let [formValues, handleInputChange, editValues, formReset] = useForm(ClientForm(clientNotExist));

	const [currentTipoEmpresaF, setCurrentTipoEmpresaF] = useState(1);
	const [currentIdentificationType, setCurrentIdentificationType] = useState(1);
	const [factTipoEmpresa, setFactTipoEmpresa] = useState([]);
	const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
	const [ciudades, setCiudades] = useState([]);
	const [fieldSave, setFieldSave] = useState(false);

	const [currentCiudad, setCurrentCiudad] = useState(null);
	const [currentDepartamento, setCurrentDepartamento] = useState(null);

	const nameClientRef = useRef(null);
	const saveClientRef = useRef(null);

	// useEffect(() => {
	// 	if (clientEdit) {
	// 		changeCurrentTipoEmpresaF(clientEdit.fact_tipo_empresa_id);
	// 		setCurrentIdentificationType(clientEdit.tipo_identificacion_id);
	// 	} else {
	// 		resetForm();
	// 		setCurrentIdentificationType(1);
	// 		setCurrentTipoEmpresaF(1);
	// 	}
	// }, [clientEdit])

	useEffect(() => {
		if(showModal) {
			resetForm();
			setCurrentIdentificationType(1);
			setCurrentTipoEmpresaF(2);

			getIdentificationsType();
			getBusinessType();
			getCiudades();

			setTimeout(() => {
				nameClientRef.current.focus();
				form.setFieldsValue({
					nombre: clientNotExist
				});
			}, 200);
		}
	}, [showModal])

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

	const getIdentificationsType = async () => {
		try {
			const response = await getIdentificationsTypeApi();
			setTiposIdentificacion( response );
		} catch (err) {
			console.log(err)
		}
	}

	const getCiudades = async () => {
		try {
			const response = await getCiudadesApi();
			setCiudades( response );
		} catch (err) {
			console.log(err)
		}
	}

	const getBusinessType = async () => {
		try {
			const response = await getBusinessTypeApi();
			const res = response.map(item => {
				return { label: item.nombre, value: item.fact_tipo_empresa_id }
			});

			setFactTipoEmpresa( res );
		} catch (err) {
			console.log(err)
		}
	}

	const onSubmit = async () => {
		// e.preventDefault();
		const data = {
			...formValues,
			ciudad_id: currentCiudad,
			tipo_identificacion_id: currentIdentificationType,
			empresa_id: loggedUser.empresa_id,
			fact_tipo_empresa_id: currentTipoEmpresaF
		}

		try {
			const response = await storeClient(data);
			toast.success('Cliente almacenado correctamente.');
			resetForm();
			index(loggedUser.empresa_id, response.cliente_id);
			setShowModal(false);
			setFieldSave(false);
		} catch (err) {
			toast.warning('Ha ocurrido un error interno al intentar guardar el cliente.');
		}

	}

	const onUpdate = async (e) => {
		e.preventDefault();
		const data = {
			...formValues,
			cliente_id: "",
			tipo_identificacion_id: currentIdentificationType,
			empresa_id: loggedUser.empresa_id,
			fact_tipo_empresa_id: currentTipoEmpresaF
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

	const handleKeyRetencion = (e) => {
		if(e.key == 'Escape') {
			setFieldSave(!fieldSave);
			setTimeout(() => {
				saveClientRef?.current?.focus();
			}, 300);
		}
	}
	
	const onSaveClient = (e) => {
		const value = e.target.value;
	
		if(e.key == 'Enter') {
			if(value == 's' || value == 'S') {
				onSubmit();
			}
		}
	}

	return (
		<div>
			<Modal
				title={"Crea un nuevo cliente"}
				visible={showModal}
				okButtonProps={{ style: { display: 'none' } }}
				cancelButtonProps={{ style: { display: 'none' } }}
				onCancel={(e) => { e.key == 'Escape' ? setShowModal(true) : setShowModal(false)}}
				onOk={(e) => onSubmit(e)}
				okText="Guardar"
				forceRender
			>
				<Form form={form} layout="vertical" initialValues={{ tipo_identificacion_id: 1, fact_tipo_empresa_id: 2 }}>
					<Row gutter={24}>
								<FormOption2
									tiposIdentificacion={tiposIdentificacion}
									currentIdentificationType={currentIdentificationType}
									setCurrentIdentificationType={setCurrentIdentificationType}
									handleInputChange={handleInputChange}
									setCurrentTipoEmpresaF={ setCurrentTipoEmpresaF }
									currentTipoEmpresaF={ currentTipoEmpresaF }
									factTipoEmpresa={ factTipoEmpresa }
									nameClientRef={ nameClientRef }
									fieldSave={ fieldSave }
									handleKeyRetencion={ handleKeyRetencion }
									onSaveClient={ onSaveClient }
									saveClientRef={ saveClientRef }
									ciudades={ciudades}
									currentDepartamento={currentDepartamento}
									setCurrentCiudad={setCurrentCiudad}
								/>
							{/* )
						} */}

					</Row>
				</Form>
			</Modal>
		</div>
	)
}

function FormOption2({
	tiposIdentificacion,
	currentIdentificationType,
	setCurrentIdentificationType,
	handleInputChange,
	setCurrentTipoEmpresaF,
	currentTipoEmpresaF,
	factTipoEmpresa,
	nameClientRef,
	fieldSave,
	handleKeyRetencion,
	onSaveClient,
	saveClientRef,
	ciudades,
	currentDepartamento,
	setCurrentCiudad
}) {
	const { Option } = Select;

	

	return (
		<>
			<Col span={12}>
				<Form.Item label="Primer nombre *" name="nombre">
					<Input
						type="text"
						name="nombre"
						ref={nameClientRef}
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
				<Form.Item name="fact_tipo_empresa_id" label="Tipo Empresa *">
					<Select
						style={{ width: '100%', marginBottom: '12px' }}
						name="fact_tipo_empresa_id"
						onChange={(value) => setCurrentTipoEmpresaF(value)}
					>
						{
							factTipoEmpresa.map((ti, index) => (
								<Option
									value={ti.value}
									key={index}
								>
									{ti.label}
								</Option>
							))
						}
					</Select>
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

			<Col span={12}>
				<Form.Item label="% de retención *" name="retencion">
					<Input
						type="text"
						autoComplete='off'
						name="retencion"
						onChange={handleInputChange}
						onKeyDown={ e => handleKeyRetencion(e) }
						placeholder="% de retención"
					/>
				</Form.Item>
			</Col>
			{
				fieldSave && (
					<Col span={24}>
						<Form.Item label="" name="guardar">
							<Input
								type="text"
								ref={ saveClientRef }
								name="guardar"
								onChange={handleInputChange}
								onKeyDown={ e => onSaveClient(e) }
								placeholder="Deseas guardar este cliente? S/N"
							/>
						</Form.Item>
					</Col>
				)
			}
		</>
	)
}

function ClientForm(name) {
	return {
		nombre: name,
		apellidos: "",
		segundo_nombre: "",
		segundo_apellido: "",
		razon_social: "",
		documento: "",
		ciudad_id: "",
		digito_verificacion: "",
		direccion: "",
		fijo: "",
		celular: "",
		mail: "",
		barrio: "",
		retencion: ""
		//empresa_id, fact_tipo_empresa_id,fecha_registro
	}
}

export default Create;