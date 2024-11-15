import { useEffect, useState } from 'react';
import { Modal, Table, Input, Form, Button, Row, Col, Select } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { getDocumentoDetalleAPI, updateProductApi } from "../../../../api/document";
import { getByDocumentoIdApi, 
	storeDocumentApi, 
	storeDocumentoNotaApi, 
	storeInvoiceApi,
	storeDocumentoDetalleApi,
	updateDocumentoApi } from '../../../../api/nota';
import { getProductsInventoryApi } from "../../../../api/inventory";
import { getDifference } from '../../../../utils/helper';

function CreateDC({ showModalCreateDC, setShowModalCreateDC, document, setCurrentDocument, logged }) {

	const { TextArea } = Input;
	const { Option } = Select;
	const [form] = Form.useForm();

	const [tableFill, setTableFill] = useState([]);
	const [documentoDetallesInit, setDocumentoDetallesInit] = useState([]);
	const [productsOpt, setProductsOpt] = useState([]);
	const [description, setDescription] = useState("");
	const [currentProduct, setCurrentProduct] = useState(null);
	const [qtyProduct, setQtyProduct] = useState(0);
	const [total, setTotal] = useState(0)

	const getTableFill = async (documentID) => {
		try {
			const response = await getDocumentoDetalleAPI(documentID);
			setTableFill(response)
			setDocumentoDetallesInit(response);
		} catch (err) {
			console.log(err);
		}
	}

	const getProductsInventory = async () => {
		try {
			const response = await getProductsInventoryApi(logged?.empresa_id);
			setProductsOpt(response);
		} catch (err) {
			console.log(err)
		}
	}

	const modifyTableValues = (value, product, type) => {
		if(type == 'quantity') {
			if(value != '' || !value) {
				setTableFill(tableFill.map(item => {
					return {
						...item,
						oldCantidad: documentoDetallesInit.find(dd=> dd.producto_id == item.producto_id)?.cantidad,
						cantidad: item.producto_id == product.producto_id ? value : item.cantidad,
						parcial: item.producto_id == product.producto_id ? value * item.unitario : item.parcial
					}
				}));
			}
		}

		if(type == 'unit') {
			if(value != '' || !value) {
				setTableFill(tableFill.map(item => {
					return {
						...item,
						unitario: item.producto_id == product.producto_id ? value : item.unitario,
						parcial: item.producto_id == product.producto_id ? value * item.cantidad : item.parcial
					}
				}));
			}
		}

		// getProductsInventory();
	}

	const addProduct = () => {
		if(!currentProduct || !qtyProduct || qtyProduct == 0) {
			toast.warning('Es necesario un producto y una cantidad.');
			return;
		}

		const find = productsOpt.find(opt => opt.producto_id == currentProduct);
		const documentoDetalle = {
			"documento_id": document.documento_id,
			"producto_id": currentProduct,
			"fecha_registro": new Date().toLocaleString(),
			"cantidad": qtyProduct,
			"estado": 1,
			"parcial": find.costo * qtyProduct,
			"unitario": find.costo,
			"impreso_comanda": null,
			"descripcion": find.nombre,
			"url_foto": null,
			"impuesto_producto": find.costo.impuesto,
			"saldo": null,
			"peso_cotero": null,
			"cotero_id": null
		}

		const found = tableFill.find(item => item.producto_id == currentProduct);
		if(found) {
			toast.warning('Producto ya existente.');
			return;
		}
		
			setTableFill([ ...tableFill, documentoDetalle ]);
		
		setCurrentProduct(null);
		setQtyProduct(0);
		form.setFieldsValue({
			product_name: "",
			product_qty: 0
		});

	}

	const removeProduct = (id) => {
		setTableFill(tableFill.filter(item => item.producto_id != id));
	}
	
	useEffect(() => {
		if(showModalCreateDC) {
			getTableFill( document.documento_id );
			getProductsInventory();
		}
	}, [showModalCreateDC])

	useEffect(() => {
		let total = 0;
		if(tableFill) {
			tableFill.forEach(item => {
				total += parseFloat(item.cantidad) * parseFloat(item.unitario);
			});

			setTotal(total);
		}
	}, [tableFill])

	const handleProducts = () => {
		let productsModified = [];

		if(document?.tipo_documento_id == 2 || document?.tipo_documento_id == 13) { //Si es una entrada o nota debito. 
			if(tableFill.length) {
				tableFill.forEach(p => { //Recorro los productos actuales.
					const findProd = productsOpt.find(el => el.producto_id == p.producto_id); //Busco el producto
					const oldCantidad = p.oldCantidad ? p.oldCantidad : p.cantidad;
	
					if(findProd) { // Si el producto existe
						productsModified.push({
							...findProd, //Guardamos todo el producto
							cantidad: Number(findProd.cantidad) - Number(oldCantidad) + Number(p.cantidad)
							//Y a su cantidad decimos que es menor a la antigua mas la actual.
					});
					}
				});
			}

			const productsDifference = getDifference(documentoDetallesInit, tableFill, 'producto_id');
			//Buscamos los productos diferentes a los actuales, es decir, los eliminados.
			if(productsDifference.length) { //Si encontramos..
				productsDifference.forEach(pd => { //Recorremos..
					const findProd = productsOpt.find(el => el.producto_id == pd.producto_id); //Buscamos dicho producto

					if(findProd) { //Y si existe
						productsModified.push({
							...findProd, //Insertamos todo el producto tal.
							cantidad: Number(findProd.cantidad) - Number(pd.cantidad)
							//Y restamos la de la cantidad total, la cantidad de todo el producto eliminado.
					});
					}
				});
			}
		}

		if(document?.tipo_documento_id == 12) { //Si es una nota credito. 
			if(tableFill.length) {
				tableFill.forEach(p => { //Recorro los productos actuales.
					const findProd = productsOpt.find(el => el.producto_id == p.producto_id); //Busco el producto
					const oldCantidad = p.oldCantidad ? p.oldCantidad : p.cantidad;
	
					if(findProd) { // Si el producto existe
						productsModified.push({
							...findProd, //Guardamos todo el producto
							cantidad: Number(findProd.cantidad) + Number(oldCantidad) - Number(p.cantidad)
							//Y a su cantidad decimos que es menor a la antigua mas la actual.
						});
					}
				});
			}

			const productsDifference = getDifference(documentoDetallesInit, tableFill, 'producto_id');
			//Buscamos los productos diferentes a los actuales, es decir, los eliminados.
			if(productsDifference.length) { //Si encontramos..
				productsDifference.forEach(pd => { //Recorremos..
					const findProd = productsOpt.find(el => el.producto_id == pd.producto_id); //Buscamos dicho producto

					if(findProd) { //Y si existe
						productsModified.push({
							...findProd, //Insertamos todo el producto tal.
							cantidad: Number(findProd.cantidad) + Number(pd.cantidad)
							//Y restamos la de la cantidad total, la cantidad de todo el producto eliminado.
						});
					}
				});
			}
		}

		return productsModified;
	}

	// const updateProductInv = async (items) => {
	// 	try {
	// 		const response = await updateProductApi(items);
	// 		console.log(response);
	// 	} catch (err) {
	// 		console.log(err);
	// 		toast.warning('Ocurrió un error al intentar actualizar productos del inventario.');
	// 	}
	// }

	/** Lógica para Crear nota crédito y débito */
	const verifyDocument = async () => {
		if(description == "" || !description) {
			toast.warning('La descripción es obligatoria.');
			return;
		}

		let vrExcento = 0;
		let vrGravado = 0;
		let vrIva = 0;
		let vrBaseIva5 = 0;
		let vrBaseIva19 = 0;
		let vrIva5 = 0;
		let vrIva19 = 0;

		tableFill.forEach(element => {
			const gravado = element.impuesto_producto == 5 ? parseFloat(element.parcial) / 1.05 
			: element.impuesto_producto == 19 ? parseFloat(element.parcial) / 1.19 
			: 0;

			vrExcento += element.impuesto_producto == 0 ? parseFloat(element.parcial) : 0;
			vrGravado += element.impuesto_producto == 5 ? parseFloat(element.parcial) / 1.05 
			: element.impuesto_producto == 19 ? parseFloat(element.parcial) / 1.19 
			: 0;
			vrIva += element.impuesto_producto > 0 && parseFloat(element.parcial) - parseFloat(gravado);
			vrBaseIva5 += element.impuesto_producto == 5 ? parseFloat(element.parcial) / 1.05 : 0;
			vrBaseIva19 += element.impuesto_producto == 19 ? parseFloat(element.parcial) / 1.19 : 0;
			vrIva5 += element.impuesto_producto == 5 && parseFloat(element.parcial) - parseFloat(gravado);
			vrIva19 += element.impuesto_producto == 19 && parseFloat(element.parcial) - parseFloat(gravado);
		});

		try {
			const response = await getByDocumentoIdApi( document?.documento_id );
			if(response) {
				if(Number(response[0].total) == Number(total)) {
					toast.warning( 'Los valores totales de la factura y de la nota son iguales, por lo cual no se creará la Nota.' );
					return;
				}

				const item = {
					empresa_id: logged?.empresa_id,
					usuario_id: logged?.userID,
					proveedor_id: document?.proveedor_id,
					fecha_registro: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString(),
					total: total,
					excento: vrExcento,
					gravado: vrGravado,
					saldo: total,
					iva: vrIva,
					base_5: vrBaseIva5,
					base_19: vrBaseIva19,
					iva_5: vrIva5,
					iva_19: vrIva19,
					descripcion_trabajador: description,
					tipo_documento: parseFloat(total) > parseFloat(document?.total) ? 13 : 
						parseFloat(total) < parseFloat(document?.total) ? 12 : 0,
				}

				const prods = handleProducts();

				const newDocument = await storeDocumentApi(item);
				await storeDocumentoNotaApi( document?.documento_id );
				await storeInvoiceApi( newDocument?.documento_id );
				tableFill.forEach( async (detalle) => {
					const p = prods.find(item => item.producto_id === detalle.producto_id);
					detalle.documento_id = newDocument?.documento_id;
					detalle.grupo_id = p?.grupo_id;
					detalle.sub_grupo_id = p?.sub_grupo_id;
					await storeDocumentoDetalleApi(detalle);
				})
				const formatted = prods;
				formatted.forEach( async (f)=> {
					await updateProductApi(f);
				});
				await updateDocumentoApi( document );
				
				toast.success('Operación realizada éxitosamente.');
				clearDescription();
				setShowModalCreateDC(false); 
				setCurrentDocument(null);

			}

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al obtener el documento mediante su ID.');
		}
	}
	
	const clearDescription = () => {
		setDescription("");
		form.setFieldsValue({
			description: "",
		});
		setTableFill([]);
	}

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
							onClick={ (e) => removeProduct(record.producto_id) }
						>
							<DeleteOutlined />
						</Button>
					</>
				)
			}
		},
		{
			title: 'producto',
			dataIndex: 'descripcion',
			key: 'descripcion',
		},
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
			key: 'cantidad',
			render: (_, record, index) => {
				return (
					<Input
						type="text"
						style={{ width: 100 }}
						name='cantidad'
						autoComplete='false'
						onChange={ (e) => modifyTableValues(e.target.value, record, 'quantity') }
						min="1"
						defaultValue={ record.cantidad }
					/>
				)
			}
		},
		{
			title: 'Valor unitario',
			dataIndex: 'unitario',
			key: 'unitario',
			render: (_, record, index) => {
				return (
					<Input
						type="text"
						style={{ width: 100 }}
						name='unitario'
						autoComplete='false'
						onChange={ (e) => modifyTableValues(e.target.value, record, 'unit') }
						min="1"
						defaultValue={ record.unitario }
					/>
				)
			}
		},
		{
			title: 'Valor total',
			dataIndex: 'parcial',
			key: 'parcial',
			render: (_, record, index) => {
				return (
					<>
						{ record.cantidad * record.unitario }
					</>
				)
			}
		},
	]
	

	return (
		<Modal
			title="Crear Nota Crédito / Débito"
			visible={ showModalCreateDC }
			onCancel={() => { setShowModalCreateDC(false); setCurrentDocument(null); clearDescription(); }}
			width={600}
			cancelText="Salir"
			okButtonProps={{ style: { display: 'none' } }}
			forceRender
		>

			<div>
				<br />

				<p>
					<strong>
						Factura relacionada: 
					</strong>
				</p>
				<p>
					<strong>
						# Interno factura relacionada: { document?.documento_id }
					</strong>
				</p>
				<p>
					<strong>
						Total nota: { total }
					</strong>
				</p>

				<Form form={form}>
					<Form.Item name="description">
						<TextArea 
							name='description'
							rows={4}
							placeholder="Descripción corrección"
							onChange={ (event) =>  setDescription( event.target.value )}
						/>
					</Form.Item>

					<Button
						type='primary'
						onClick={ () => verifyDocument() }
					>
						Confirmar
					</Button>

					<hr />

				
					<Row gutter={24} style={{ marginTop: '2em' }}>
						<Col span={8}>
							<Form.Item name="product_name">
								<Select
									name="product"
									placeholder="Artículo"
									onChange={ (val) => setCurrentProduct(val) }
								>
									{
										productsOpt.length > 0 &&
										productsOpt.map((item, idx) => (
											<Option
												key={idx}
												value={item.producto_id}
											>
												{item.nombre}
											</Option>
										))
									}
								</Select>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name="product_qty">
								<Input 
									name='cantidad'
									placeholder='Cantidad'
									onChange={ (event) => setQtyProduct(event.target.value) }
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Button type='primary' onClick={ addProduct }>
								<PlusOutlined />
							</Button>
						</Col>
					</Row>
				</Form>

				<hr />
			</div>

			<Table 
				columns={ columns }
				dataSource={ tableFill }
				rowKey="documento_detalle_id"
				key="productos_detalle_factura"
				pagination={{ pageSize: 5}}
			/>

		</Modal>
	)
}

export default CreateDC;