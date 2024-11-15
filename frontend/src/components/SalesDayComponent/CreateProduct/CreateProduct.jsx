import { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Input, Select, Collapse, DatePicker, Button } from 'antd';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';

import { 
	getGroupsApi, 
	getSubgroupsApi,
	createProductInventoryApi, 
	createProductPriceInventoryApi,
	saveAuditoriaApi } from '../../../api/inventory';
import { getSuppliesApi } from '../../../api/supplies';

function CreateProduct({ 
	setShowModalCreateProduct, 
	showModalCreateProduct,
	logged,
	getProductAfterCreate,
	productNewCreate
}) {

	const [form] = Form.useForm();

	const [showFormCreate, setShowFormCreate] = useState(false);

	return (
		<Modal
			title="Crear producto"
			visible={showModalCreateProduct}
			onCancel={() => { setShowModalCreateProduct(false); form.resetFields(); setShowFormCreate(false) }}
			// onOk={ e => onSubmit(e) }
			// okText="Guardar"
			okButtonProps={{ style: { display: 'none' } }}
			cancelButtonProps={{ style: { display: 'none' } }}
			forceRender
		>

			{
				!showFormCreate ? (
					<>
						El producto no existe, desea crearlo? &nbsp;
						<Button 
							type="default"
							onClick={() => { setShowModalCreateProduct(false); form.resetFields(); }}
						>
							No
						</Button>
						<Button 
							type="primary"
							onClick={() => { setShowFormCreate(true) }}
						>
							Si
						</Button>
					</>
				) : (
					<>
						<FormCreate
							logged={logged}
							setShowModalCreateProduct={ setShowModalCreateProduct }
							showModalCreateProduct={ showModalCreateProduct }
							setShowFormCreate={ setShowFormCreate }
							form={ form }
							getProductAfterCreate={ getProductAfterCreate }
							productNewCreate={ productNewCreate }
						>

						</FormCreate>
					</>
				)
			}


		</Modal>
	)
}

function FormCreate({ logged, setShowModalCreateProduct, showModalCreateProduct, form, setShowFormCreate, getProductAfterCreate, productNewCreate }) {

	// const [form] = Form.useForm();
	const { Option } = Select;
	const { Panel } = Collapse;

	const [ formValues, handleInputChange, setValues, formReset ] = useForm(InitialValues);

	const [groupsOpt, setGroupsOpt] = useState([]);
	const [subgroupsOpt, setSubgroupsOpt] = useState([]);
	const [proveedoresOpt, setProveedoresOpt] = useState([]);

	const [currentGrupo, setCurrentGrupo] = useState(null);
	const [currentSubgrupo, setCurrentSubgrupo] = useState(null);
	const [currentMarca, setCurrentMarca] = useState(null);
	const [currentProveedor, setCurrentProveedor] = useState(null);
	const [currentDateExpired, setCurrentDateExpired] = useState(null);

	const resetForm = () => {
    form.resetFields();
		formReset();
  }

	const getGroups = async (businessID) => {
		try {
			const response = await getGroupsApi(businessID);
			setGroupsOpt( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos del grupo');
		}
	}

	const getSubgroups = async (businessID) => {
		try {
			const response = await getSubgroupsApi(businessID);
			setSubgroupsOpt( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos del grupo');
		}
	}

	const getProveedores = async (businessID) => {
		try {
			const response = await getSuppliesApi(businessID);
			setProveedoresOpt( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos de proveedores.');
		}
	}

	const onSubmit = async (e) => {
		e.preventDefault();

		const data = {
			...formValues,
			fecha_vencimiento: currentDateExpired,
			grupo_id: currentGrupo,
			sub_grupo_id: currentSubgrupo,
			marca_id: currentMarca,
			proveedor_id: currentProveedor,
			empresa_id: logged.empresa_id,
			fecha_registro: new Date().toDateString()
		}

		const data2 = {
			precio_2: formValues.precio_2,
			precio_3: formValues.precio_3,
			precio_4: formValues.precio_4,
			precio_5: formValues.precio_5,
			precio_6: formValues.precio_6,
			precio_7: formValues.precio_7,
			precio_8: formValues.precio_8,
			precio_9: formValues.precio_9,
			priecio10: formValues.precio_10,
		}

		try {
			const response = await createProductInventoryApi(data);
			await createProductPriceInventoryApi(data2, response.producto_id);
			getProductAfterCreate(logged?.empresa_id, response.producto_id);

			const detail = `Se creó el producto llamado ${formValues.nombre}`;

			const params = {
				businessID: logged?.empresa_id, 
				detail, 
				userID: logged?.userID, 
				currentValue: "", 
				latestValue: formValues.nombre,
				aplicativo: 'Creación de producto',
				accion_auditoria: 5
			}
			await saveAuditoriaApi(params);

			setShowModalCreateProduct( false );
			resetForm();
			toast.success('Producto guardado correctamente');
		} catch (err) {
			console.log(err);
			toast.warning('No se puedo guardar el producto correctamente.');
		}

		// console.log(data);
	}

	useEffect(() => {
		if(showModalCreateProduct && logged) {
			getGroups(logged?.empresa_id);
			getSubgroups(logged?.empresa_id);
			getProveedores(logged?.empresa_id);

			form.setFieldsValue({ codigo_barras: productNewCreate.barcode  });
			formValues.codigo_barras = productNewCreate.barcode;

			form.setFieldsValue({ nombre: productNewCreate.product  });
			formValues.nombre = productNewCreate.product;
		}
	}, [showModalCreateProduct])
	

	return (
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
						<Form.Item name="grupo_id" label="Grupo">
							<Select 
								style={{ width: '100%', marginBottom: '12px' }}
								name="grupo_id"
								onChange={ ( value ) => setCurrentGrupo(value) }
							>
								<Option value="">Selecciona un grupo</Option>

								{
									groupsOpt.map((group, index) => (
										<Option 
											value={ group.grupo_id }
											key={ index }
										>
											{ group.nombre }
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name="sub_grupo_id" label="Subgrupo">
							<Select 
								style={{ width: '100%', marginBottom: '12px' }}
								name="sub_grupo_id"
								onChange={ ( value ) => setCurrentSubgrupo(value) }
							>
								<Option value="">Selecciona un subgrupo</Option>

								{
									subgroupsOpt.map((subgroup, index) => (
										<Option 
											value={ subgroup.sub_grupo_id }
											key={ index }
										>
											{ subgroup.nombre }
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="marca_id" label="Marca">
							<Select 
								style={{ width: '100%', marginBottom: '12px' }}
								name="marca_id"
								onChange={ ( value ) => setCurrentMarca(value) }
							>
								<Option value="">Selecciona una marca</Option>
							</Select>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="Precio de compra" name="costo">
							<Input 
								type="text"
								name="costo"
								onChange={ handleInputChange }
								placeholder="Precio de compra"
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label="Precio de venta" name="costo_publico">
							<Input 
								type="text"
								name="costo_publico"
								onChange={ handleInputChange }
								placeholder="Precio de venta"
							/>
						</Form.Item>
					</Col>
					
					<Col span={12}>
						<Form.Item label="Impuesto" name="impuesto">
							<Input 
								type="text"
								name="impuesto"
								onChange={ handleInputChange }
								placeholder="Impuesto"
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label="Stock mínimo" name="stock_min">
							<Input 
								type="text"
								name="stock_min"
								onChange={ handleInputChange }
								placeholder="Stock mínimo"
							/>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="Stock máximo" name="stock_max">
							<Input 
								type="text"
								name="stock_max"
								onChange={ handleInputChange }
								placeholder="Stock máximo"
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label="Código de barras" name="codigo_barras">
							<Input 
								type="text"
								name="codigo_barras"
								onChange={ handleInputChange }
								placeholder="Código de barras"
							/>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="% Ganancia" name="porcentaje_venta">
							<Input 
								type="text"
								name="porcentaje_venta"
								onChange={ handleInputChange }
								placeholder="% Ganancia"
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="fecha_vencimiento" label="Fecha de vencimiento">
							<DatePicker 
								name="fecha_vencimiento"
								placeholder='Fecha de vencimiento'
								style={{ width: '100%' }}
								onChange={ (date, dateString) =>  setCurrentDateExpired(date) }
							/>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="Peso" name="peso">
							<Input 
								type="text"
								name="peso"
								onChange={ handleInputChange }
								placeholder="Peso"
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="proveedor_id" label="Proveedor">
							<Select 
								style={{ width: '100%', marginBottom: '12px' }}
								name="proveedor_id"
								onChange={ ( value ) => setCurrentProveedor(value) }
							>
								<Option value="">Selecciona un proveedor</Option>

								{
									proveedoresOpt.map((pr, index) => (
										<Option 
											value={ pr.proveedor_id }
											key={ index }
										>
											{ pr.nombre }
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>

					<Col span={6}>
						<Form.Item label="Balanza" name="balanza">
							<Input 
								type="text"
								name="balanza"
								onChange={ handleInputChange }
								placeholder="Balanza"
							/>
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item label="Varios" name="varios">
							<Input 
								type="text"
								name="varios"
								onChange={ handleInputChange }
								placeholder="Varios"
							/>
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item label="Sub producto" name="sub_producto">
							<Input 
								type="text"
								name="sub_producto"
								onChange={ handleInputChange }
								placeholder="Sub producto"
							/>
						</Form.Item>
					</Col>
					<Col span={6}>
						<Form.Item label="Granel" name="granel">
							<Input 
								type="text"
								name="granel"
								onChange={ handleInputChange }
								placeholder="Granel"
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Collapse>
							<Panel header="Campos droguería" key="1">
								<Row gutter={24}>
									<Col span={12}>
										<Form.Item label="Lote" name="lote">
											<Input 
												type="text"
												name="lote"
												onChange={ handleInputChange }
												placeholder="Lote"
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label="CUM" name="cum">
											<Input 
												type="text"
												name="cum"
												onChange={ handleInputChange }
												placeholder="CUM"
											/>
										</Form.Item>
									</Col>

									<Col span={12}>
										<Form.Item label="Registro invima" name="registro_sanitario">
											<Input 
												type="text"
												name="registro_sanitario"
												onChange={ handleInputChange }
												placeholder="Registro invima"
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label="Laboratorio" name="laboratorio">
											<Input 
												type="text"
												name="laboratorio"
												onChange={ handleInputChange }
												placeholder="Laboratorio"
											/>
										</Form.Item>
									</Col>
								</Row>
							</Panel>
						</Collapse>
					</Col>

					<Col span={24}>
						<Collapse>
							<Panel header="Precios por productos" key="2">
								<Row gutter={24}>
									<Col span={12}>
										<Form.Item label="Precio 2" name="precio_2">
											<Input 
												type="text"
												name="precio_2"
												onChange={ handleInputChange }
												placeholder="Precio 2"
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label="Precio 3" name="precio_3">
											<Input 
												type="text"
												name="precio_3"
												onChange={ handleInputChange }
												placeholder="Precio 3"
											/>
										</Form.Item>
									</Col>

									<Col span={12}>
										<Form.Item label="Precio 4" name="precio_4">
											<Input 
												type="text"
												name="precio_4"
												onChange={ handleInputChange }
												placeholder="Precio 4"
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label="Precio 5" name="precio_5">
											<Input 
												type="text"
												name="precio_5"
												onChange={ handleInputChange }
												placeholder="Precio 5"
											/>
										</Form.Item>
									</Col>

									<Col span={12}>
										<Form.Item label="Precio 6" name="precio_6">
											<Input 
												type="text"
												name="precio_6"
												onChange={ handleInputChange }
												placeholder="Precio 6"
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label="Precio 7" name="precio_7">
											<Input 
												type="text"
												name="precio_7"
												onChange={ handleInputChange }
												placeholder="Precio 7"
											/>
										</Form.Item>
									</Col>

									<Col span={12}>
										<Form.Item label="Precio 8" name="precio_8">
											<Input 
												type="text"
												name="precio_8"
												onChange={ handleInputChange }
												placeholder="Precio 8"
											/>
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item label="Precio 9" name="precio_9">
											<Input 
												type="text"
												name="precio_9"
												onChange={ handleInputChange }
												placeholder="Precio 9"
											/>
										</Form.Item>
									</Col>

									<Col span={12}>
										<Form.Item label="Precio 10" name="precio_10">
											<Input 
												type="text"
												name="precio_10"
												onChange={ handleInputChange }
												placeholder="Precio 10"
											/>
										</Form.Item>
									</Col>
								</Row>
							</Panel>
						</Collapse>
					</Col>

					<Col span={24} style={{ marginTop: '2em', display: 'flex', justifyContent: 'flex-end' }}>
						<Button 
							type='default'
							onClick={ () => { setShowModalCreateProduct(false); form.resetFields(); setShowFormCreate(false) }}
						>
							Cancel
						</Button>
						<Button 
							type='primary'
							onClick={ (e) => onSubmit(e) }
						>
							Crear
						</Button>
					</Col>

				</Row>
			</Form>
	)
}

function InitialValues() {
	return {
		balanza: 0,
		cantidad: 0,
		codigo_barras: "",
		costo: 0,
		costo_publico: 0,
		cum: "",
		empresa_id: "",
		estado: 1,
		fecha_registro: "",
		fecha_vencimiento: null,
		granel: 0,
		grupo_id: null,
		impuesto: 0,
		kg_promo: 0,
		laboratorio: 0,
		lote: 0,
		marca_id: null,
		nombre: "",
		peso: 0,
		porcentaje_venta: 0,
		producto_id: null,
		promo: 0,
		proveedor_id: null,
		pub_promo: 0,
		registro_sanitario: "",
		stock_min: 0,
		stock_max: 0,
		sub_grupo_id: null,
		sub_producto: 0,
		utilidad_sugeridad: 0,
		varios: 0,
		precio_2: 0,
		precio_3: 0,
		precio_4: 0,
		precio_5: 0,
		precio_6: 0,
		precio_7: 0,
		precio_8: 0,
		precio_9: 0,
		precio_10: 0,
	}
}

export default CreateProduct