import { useState, useEffect } from 'react';
import { Modal, Form, Row, Col, Input, Select, Collapse, DatePicker, Button, Table } from 'antd';
import { PlusOutlined, DeleteFilled } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';

import { 
	getGroupsApi, 
	getSubgroupsApi,
	getProductsInventoryApi,
	createProductPriceInventoryApi,
	saveAuditoriaApi } from '../../../api/inventory';

import { 
	updateProductApi,
	updateProductoPrecioApi } from '../../../api/document';

import { getPreciosByProductoID } from '../../../api/sales';
import { getSuppliesApi } from '../../../api/supplies';


function UpdateProduct({ 
	setShowModalEditProduct, 
	showModalEditProduct,
	logged,
	setShowCreateForm,
	setShowUpdateForm
}) {

	const [form] = Form.useForm();
	const { Option } = Select;
	const { Panel } = Collapse;

	const [ formValues, handleInputChange, setValues, formReset ] = useForm(InitialValues);

	const [groupsOpt, setGroupsOpt] = useState([]);
	const [subgroupsOpt, setSubgroupsOpt] = useState([]);
	const [productsOpt, setProductsOpt] = useState([]);

	const [subproductsCollection, setSubproductsCollection] = useState([]);

	const [currentProduct, setCurrentProduct] = useState(null);
	const [currentGrupo, setCurrentGrupo] = useState(null);
	const [currentSubgrupo, setCurrentSubgrupo] = useState(null);
	const [currentMarca, setCurrentMarca] = useState(null);
	const [currentProveedor, setCurrentProveedor] = useState(null);
	const [currentDateExpired, setCurrentDateExpired] = useState(null);
	const [productPricesID, setProductPricesID] = useState(null);
	const [proveedoresOpt, setProveedoresOpt] = useState([]);

	const [currentSubproduct, setCurrentSubproduct] = useState(null);
	const [currentNewQty, setCurrentNewQty] = useState(0);
	const [dataSubproducts, setDataSubproducts] = useState([]);
	const [isAddSubproduct, setIsAddSubproduct] = useState(false);

	const resetForm = () => {
    form.resetFields();
		formReset();
  }
	const getAllProducts = async (businessID) => {
		try {
			const response = await getProductsInventoryApi(businessID);
			setProductsOpt( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos de los productos.');
		}
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

	const getProductsPricesById = async (productID, updatedValues) => {
		try {
			const response = await getPreciosByProductoID(productID);
			if(response) {
				setProductPricesID(response[0].producto_precios_id);

				console.log(updatedValues)

				setValues({
					...updatedValues,
					precio_2: response[0].precio_2 || 0,
					precio_3: response[0].precio_3 || 0,
					precio_4: response[0].precio_4 || 0,
					precio_5: response[0].precio_5 || 0,
					precio_6: response[0].precio_6 || 0,
					precio_7: response[0].precio_7 || 0,
					precio_8: response[0].precio_8 || 0,
					precio_9: response[0].precio_9 || 0,
					precio_10: response[0].precio_10 || 0,
				});

				form.setFieldsValue({
					...updatedValues,
					precio_2: response[0].precio_2 || 0,
					precio_3: response[0].precio_3 || 0,
					precio_4: response[0].precio_4 || 0,
					precio_5: response[0].precio_5 || 0,
					precio_6: response[0].precio_6 || 0,
					precio_7: response[0].precio_7 || 0,
					precio_8: response[0].precio_8 || 0,
					precio_9: response[0].precio_9 || 0,
					precio_10: response[0].precio_10 || 0,
				});
			}
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los precios del producto.');
		}
	}

	const onSubmit = async (e) => {
		e.preventDefault();

		if(!currentProduct) {
			toast.warning('El producto es obligatorio para poder actualizar.');
			return;
		}

		const product = productsOpt.find(item => item.producto_id == currentProduct );
		
		const data = {
			...formValues,
			nombre: product.nombre,
			fecha_vencimiento: currentDateExpired ? currentDateExpired : product.fecha_vencimiento,
			grupo_id: currentGrupo,
			sub_grupo_id: currentSubgrupo,
			marca_id: currentMarca,
			proveedor_id: currentProveedor,
			empresa_id: logged.empresa_id,
			fecha_registro: new Date().toISOString()
		}

		const data2 = {
			precio_2: parseInt(formValues.precio_2) ?? 0,
			precio_3: parseInt(formValues.precio_3) ?? 0,
			precio_4: parseInt(formValues.precio_4) ?? 0,
			precio_5: parseInt(formValues.precio_5) ?? 0,
			precio_6: parseInt(formValues.precio_6) ?? 0,
			precio_7: parseInt(formValues.precio_7) ?? 0,
			precio_8: parseInt(formValues.precio_8) ?? 0,
			precio_9: parseInt(formValues.precio_9) ?? 0,
			precio_10: parseInt(formValues.precio_10) ?? 0,
			producto_id: parseInt(product.producto_id),
			producto_precios_id: parseInt(productPricesID)
		}

		try {
			const response = await updateProductApi(data);
			if(productPricesID) {
				await updateProductoPrecioApi(data2);
			} else {
				await createProductPriceInventoryApi(data2, product.producto_id);
			}

			const detail = `Se modificó el precio del producto id ${product.producto_id} llamado ${product.nombre}`;

			const params = {
				businessID: logged?.empresa_id, 
				detail, 
				userID: logged?.userID, 
				currentValue: formValues.costo_publico, 
				latestValue: product.costo_publico,
				aplicativo: 'Edición de productos',
				accion_auditoria: 3
			}
			await saveAuditoriaApi(params);

			setShowModalEditProduct( false );
			resetForm();
			setShowCreateForm(false);
			setShowUpdateForm(false);
			toast.success('Producto actualizado correctamente');
		} catch (err) {
			console.log(err);
			toast.warning('No se puedo guardar el producto correctamente.');
		}
	}

	const onChangeProduct = (val) => {
		if(!val || val == undefined) {
			resetForm();
			setCurrentGrupo( null );
			setCurrentSubgrupo( null );
			setCurrentProveedor( null );
			setCurrentDateExpired( null );
			setCurrentProduct(null);
			return;
		}
		
		setCurrentProduct(val);

		const product = productsOpt.find(item => item.producto_id == val );

		// form.setFieldsValue({...product});
		// setValues({...product});

		const updatedValues = {
			...InitialValues(),
			...product,
		};

		setValues(updatedValues);
  		form.setFieldsValue(updatedValues);
		
		getProductsPricesById(val, updatedValues);
		
		setCurrentGrupo( product.grupo_id );
		setCurrentSubgrupo( product.sub_grupo_id );
		setCurrentProveedor( product.proveedor_id );
		setCurrentDateExpired( product.fecha_vencimiento );
	}

	const addSubproduct = () => {
		if(!currentProduct) {
			toast.warning('Primero debes seleccionar el producto a editar');
			return;
		}

		if(!currentSubproduct) {
			toast.warning('Subproducto es requerido');
			return;
		}

		if(currentNewQty < 1 || !currentNewQty) {
			toast.warning('Cantidad de subproducto es requerido');
			return;
		}

		if(dataSubproducts.length > 0 && dataSubproducts.some(vl => vl.sub_producto_id == currentSubproduct)) {
			toast.warning('Este producto ya ha sido añadido.');
			return;
		}

		setIsAddSubproduct( true );
	}

	const deleteSubproductFromList = (ID) => {
		const data = dataSubproducts;
		const idx = data.findIndex(d => d.sub_producto_id == ID );
		data.splice(idx, 1);

		setDataSubproducts([ ...data ]);
	}

	useEffect(() => {
		if(isAddSubproduct) {
			const cs = productsOpt.find(it => it.producto_id == currentSubproduct);

			let data = [];

			if(dataSubproducts.length > 0) {
				data = dataSubproducts;
			}

			const subprod = { 
				sub_producto_id: currentSubproduct,
				subproduct: cs.nombre, 
				cantidad: currentNewQty 
			};

			setDataSubproducts([ ...data, subprod ]);

			setIsAddSubproduct(false);
		}

	}, [isAddSubproduct])
	

	const columns = [
		{
			title: 'Opciones',
			dataIndex: 'opciones',
			key: 'opciones',
			render: (_, record, index) => {
				return (
					<>
						<Button 
							type='default' 
							size='small'
							onClick={ () => deleteSubproductFromList(record.sub_producto_id) }
						>
							<DeleteFilled />
						</Button>
					</>
				)
			}
		},
		{
			title: 'Sub producto',
			dataIndex: 'subproduct',
			key: 'subproduct',
		},
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
			key: 'cantidad',
		},
	]

	useEffect(() => {
		if(showModalEditProduct) {
			getGroups(logged?.empresa_id);
			getSubgroups(logged?.empresa_id);
			getAllProducts(logged?.empresa_id);
			getProveedores(logged?.empresa_id);
		}
	}, [showModalEditProduct])
	

	return (
		<Modal
			title="Editar producto"
			visible={showModalEditProduct}
			onCancel={() => { setShowModalEditProduct(false); form.resetFields(); }}
			onOk={ e => onSubmit(e) }
			okText="Editar"
			forceRender
		>

			<Form
				form={form} 
				layout="vertical"
			>
				<Row gutter={24}>
					<Col span={12}>
						<Form.Item label="Nombre *" name="nombre">
							<Select 
								showSearch
								style={{ width: '100%', marginBottom: '12px' }}
								name="nombre"
								onChange={ ( value ) => onChangeProduct(value) }
								filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
								allowClear
							>

								{
									productsOpt.map((p, index) => (
										<Option 
											value={ p.producto_id }
											key={ index }
										>
											{ p.nombre }
										</Option>
									))
								}
							</Select>
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
							<Panel header="Precios por productos" key="3">
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
					
					<Col span={24}>
						<Collapse>
							<Panel header="Sub productos" key="2">
								<Row gutter={24}>
									<Col span={8}>
										<Form.Item label="Subproducto" name="subproducto">
											<Select 
												style={{ width: '100%', marginBottom: '12px' }}
												name="nombre"
												onChange={ ( value ) => setCurrentSubproduct(value) }
											>

												{
													productsOpt.map((p, index) => (
														<Option 
															value={ p.producto_id }
															key={ index }
														>
															{ p.nombre }
														</Option>
													))
												}
											</Select>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item label="Cantidad" name="newcantidad">
											<Input 
												type="text"
												name="newcantidad"
												onChange={ ({ target }) =>  setCurrentNewQty(target.value)}
												placeholder="Cantidad"
											/>
										</Form.Item>
									</Col>

									<Col span={8}>
										<Form.Item>
											<Button 
												type="primary" 
												style={{ marginTop: '2em' }} 
												onClick={ addSubproduct }
											>
												<PlusOutlined />
											</Button>
										</Form.Item>
									</Col>
									<Col span={24}>
										{/* <pre>{ JSON.stringify(dataSubproducts, 2) }</pre> */}
										<Table 
											columns={ columns }
											dataSource={ dataSubproducts }
											rowKey="sub_producto_id"
											pagination={{ pageSize: 5}}
										/>
									</Col>
								</Row>
							</Panel>
						</Collapse>
					</Col>

				</Row>
			</Form>


		</Modal>
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
		fecha_registro: null,
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
		unidad: null,
		utilidad_sugerida: 0,
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

export default UpdateProduct;