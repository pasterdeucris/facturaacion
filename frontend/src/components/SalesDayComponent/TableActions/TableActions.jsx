import { useState, useEffect, useRef } from 'react';
import { Row, Col, Descriptions, Button, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import IndexedDBService from '../../../service/indexedDB'


import { useActivations } from '../../../hooks/useActivations';
import { saveAuditoriaApi } from '../../../api/inventory';

import {
	getProductByProductoCodeBar,
	getProductByProductoId
} from '../../../api/sales';

import {
	getProductsByIdApi
} from '../../../api/client-wallet';

import {
	deleteProductFromDocument,
	updateProductFromDocumentApi,
	modifyProductCantidadApi,
	updateDocumentoApi
} from '../../../api/document';

import "./TableActions.scss";

const db = IndexedDBService;
function TableActions({ 
	currentProducts, 
	reloadDocument, 
	logged, 
	currentDoc,
	setQtyReferenceTable,
	qtyReferenceTable,
	setUnitCostReferenceTable,
	unitCostReferenceTable,
	setDeleteReferenceTable,
	deleteReferenceTable,
	editInvoice,
	allUsers,
	currentPricesByProduct,
	setLoadCurrentDoc
}) {

	/** Refs table */
	const qtyRefTable = useRef([]);
	const unitRefTable = useRef([]);
	const deleteRefTable = useRef([]);

	const pswRef = useRef(null);

	const table = "tblProducts"

	const { deleteKey, suggestedPrices } = useActivations(logged);
	const [productos, setProductos] = useState([]);
	const [productsOld, setProductsOld] = useState([]);

	const [productsOpt, setProductsOpt] = useState([]);
	const [valuesCalculate, setValuesCalculate] = useState({
		totalKG: 0,
		vrExento: 0,
		vrGravado: 0,
		vrIva: 0,
		totalParcial: 0,
	});

	const [showDeleteKey, setShowDeleteKey] = useState(false);
	const [productDeleteKey, setProductDeleteKey] = useState(null);
	const [pswString, setPswString] = useState("");

	const deleteProductFromSale = async (product) => {
		try {

			let isLastProduct = false;

			if (deleteKey) {
				// let keyAdmin = prompt('Ingresa una clave de administrador para poder realizar esta acción.')
				// console.log(keyAdmin);
				// if (keyAdmin == null) {
				// 	return;
				// }

				// const resultPsw = allUsers.some(item => item.clave == keyAdmin);

				// if (!resultPsw) {
				// 	alert('La clave no coincide.');
				// 	return;
				// }
				setShowDeleteKey(true);
				setProductDeleteKey(product);
				setTimeout(() => {
					pswRef?.current?.focus();
				}, 100);
				return;
			}

			if(currentProducts.length == 1) {
				const data = {
					...currentDoc.content,
					peso_total: 0,
					excento: 0,
					gravado: 0,
					iva: 0,
					total: 0,
				}

				isLastProduct = true;
	
				await updateDoc(data);
			}

			await deleteProductFromDocument(product);
			const setQuantity = await loadProductByProductId(product.producto_id)

			if (setQuantity) {
				const updtProduct = {
					...setQuantity,
					cantidad: parseFloat(setQuantity.cantidad) + parseFloat(product.cantidad)
				}
				modifyProductInv(updtProduct);
			}

			//Guardado de auditoria eliminado
			const detail = `Se eliminó el producto ${product.descripcion} desde entradas del producto id ${product.producto_id} llamado ${product.descripcion}`;
			const params = {
				businessID: logged?.empresa_id, 
				detail, 
				userID: logged?.userID, 
				currentValue: product.costo_publico, 
				latestValue: product.costo_publico, 
				aplicativo: 'Ventas del día',
				accion_auditoria: 4,
				tipo_documento_id: currentDoc?.content?.tipo_documento_id
			}
			await saveAuditoria(params);
			//Termina guardado de auditoria

			reloadDocument(product.documento_id, currentDoc?.content, isLastProduct);
			toast.success('Producto eliminado para este documento.');
			onFocusDeleteBtn();
		} catch (err) {
			console.log(err);
			toast.warning('Error al eliminar el producto para el documento.');
		}
	}

	const deleteFromInput = async () => {
		try {

			if(!productDeleteKey) {
				setShowDeleteKey(false);
				setProductDeleteKey(null);
				setPswString("");
				return;
			}

			const resultPsw = allUsers.some(item => item.clave == pswString);

			if (!resultPsw) {
				alert('La clave no coincide.');
				setShowDeleteKey(false);
				setProductDeleteKey(null);
				setPswString("");
				return;
			}

			const product = productDeleteKey;

			let isLastProduct = false;

			if(currentProducts.length == 1) {
				const data = {
					...currentDoc.content,
					peso_total: 0,
					excento: 0,
					gravado: 0,
					iva: 0,
					total: 0,
				}

				isLastProduct = true;
	
				await updateDoc(data);
			}

			await deleteProductFromDocument(product);
			const setQuantity = await loadProductByProductId(product.producto_id)

			if (setQuantity) {
				const updtProduct = {
					...setQuantity,
					cantidad: parseFloat(setQuantity.cantidad) + parseFloat(product.cantidad)
				}
				modifyProductInv(updtProduct);
			}

			//Guardado de auditoria eliminado
			const detail = `Se eliminó el producto ${product.descripcion} desde entradas del producto id ${product.producto_id} llamado ${product.descripcion}`;
			const params = {
				businessID: logged?.empresa_id, 
				detail, 
				userID: logged?.userID, 
				currentValue: product.parcial, 
				latestValue: product.parcial, 
				aplicativo: 'Ventas del día',
				accion_auditoria: 4,
				tipo_documento_id: currentDoc?.content?.tipo_documento_id
			}
			await saveAuditoria(params);
			//Termina guardado de auditoria

			reloadDocument(product.documento_id, currentDoc?.content, isLastProduct);
			toast.success('Producto eliminado para este documento.');
			setShowDeleteKey(false);
			setProductDeleteKey(null);
			setPswString("");
			onFocusDeleteBtn();
		} catch (err) {
			console.log(err);
			setShowDeleteKey(false);
			setProductDeleteKey(null);
			setPswString("");
			toast.warning('Error al eliminar el producto para el documento.');
		}
	}

	const updateProductFromEntry = async (product) => {
		try {
			await updateProductFromDocumentApi(product);
			reloadDocument(product.documento_id, currentDoc?.content);
			toast.success('Producto actualizado para este documento.');
		} catch (err) {
			console.log(err);
			toast.warning('Error al actualizar el producto para el documento.');
		}
	}

	const modifyProductInv = async (productInv) => {
		try {
			await modifyProductCantidadApi(productInv);
		} catch (err) {
			console.log(err);
			toast.warning('Error al actualizar el producto del inventario.');
		}
	}

	const handleSubmitKey = async (e, product, type) => {
		const { content } = currentDoc;

		if (e.key === 'Enter') {
			if (type == 'qty') {
				const detalles = await getProductsByIdApi(product.documento_id);
				const productOld = detalles.find(item => item.documento_detalle_id === product.documento_detalle_id);
				let cantidadOLD = productOld.cantidad
				product = {
					...product,
					cantidad: e.target.value,
					parcial: parseFloat(e.target.value) * parseFloat(product.unitario)
				};

				const prodOpt = await loadProductByProductId(product.producto_id);

				let cantidadDefinitiva = content?.tipo_documento_id == 10 ?
					parseFloat(prodOpt.cantidad) + parseFloat(cantidadOLD) - parseFloat(e.target.value) :
					parseFloat(prodOpt.cantidad) - parseFloat(cantidadOLD) + parseFloat(e.target.value)

				updateProductFromEntry(product);

				if (prodOpt) {
					const updtProduct = {
						...prodOpt,
						cantidad: cantidadDefinitiva
					}
					modifyProductInv(updtProduct);
				}
			}
			if (type == 'unit') {
				product = {
					...product,
					unitario: e.target.value,
					parcial: parseFloat(product.cantidad) * parseFloat(e.target.value)
				};
				updateProductFromEntry(product);
			}
		}
	}

	const defineTotalValues = async (productsCurrents) => {
		let totalKG = 0;
		let vrExento = 0;
		let vrGravado = 0;
		let vrIva = 0;
		let totalParcial = 0;

		// const productPromises = productsCurrents.map(async (cp) => {
		// 	const product = await loadProductByProductId(cp.producto_id);
		// 	return product;
		// });

		// const products = await Promise.all(productPromises);

		if(productsCurrents.length)
		{
			productsCurrents.forEach((product, index) => {
				const cp = productsCurrents[index];
				const gravado = cp.impuesto_producto == 5 ? parseFloat(cp.parcial) / 1.05
					: cp.impuesto_producto == 19 ? parseFloat(cp.parcial) / 1.19
						: 0;
	
				totalKG += product?.peso ? parseFloat(product.peso) * parseFloat(cp.cantidad) : 0;
				vrExento += cp.impuesto_producto == 0 ? parseFloat(cp.parcial) : 0;
				vrGravado += cp.impuesto_producto == 5 ? parseFloat(cp.parcial) / 1.05
					: cp.impuesto_producto == 19 ? parseFloat(cp.parcial) / 1.19
						: 0;
				vrIva += cp.impuesto_producto > 0 && parseFloat(cp.parcial) - parseFloat(gravado);
				totalParcial += parseFloat(cp.parcial);
			});
		}

		setValuesCalculate({
			totalKG: parseFloat(totalKG),
			vrExento: parseFloat(vrExento).toFixed(2),
			vrGravado: parseFloat(vrGravado).toFixed(2),
			vrIva: parseFloat(vrIva).toFixed(2),
			totalParcial: parseFloat(totalParcial).toFixed(2)
		});
	}

	const updateDoc = async (data) => {
		try {
			setLoadCurrentDoc(true);
			await updateDocumentoApi(data);
			setLoadCurrentDoc(false);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al actualizar el documento.');
			setLoadCurrentDoc(false);
		}
	}

	const saveAuditoria = async (params) => {
		try {
			await saveAuditoriaApi(params);
		} catch (err) {
			console.log(err);
		}
	}

	//Inicio Atajos de modificacion de productos de entrada

	//Focus Cantidad
	const onFocusQty = (key = 0) => {
		qtyRefTable?.current[key]?.focus();
		qtyRefTable?.current[key]?.select();
	}

	const onChangeKeyQty = (e, idx) => {

		if (e.key == 'ArrowUp') {
			e.preventDefault();
			onFocusQty(idx - 1);
		}

		if (e.key == 'ArrowDown') {
			e.preventDefault();
			onFocusQty(idx + 1);
		}
	}

	useEffect(() => {
		if (qtyReferenceTable) {
			onFocusQty();
		}

		return () => {
			setQtyReferenceTable(false);
		}
	}, [qtyReferenceTable])

	//Focus Costo unitario
	const onFocusUnitCost = (key = 0) => {
		unitRefTable?.current[key]?.focus();
		unitRefTable?.current[key]?.select();
	}

	const onChangeKeyUnitCost = (e, idx) => {
		if (e.key == 'ArrowUp') {
			e.preventDefault();
			onFocusUnitCost(idx - 1);
		}

		if (e.key == 'ArrowDown') {
			e.preventDefault();
			onFocusUnitCost(idx + 1);
		}
	}

	useEffect(() => {
		if (unitCostReferenceTable) {
			onFocusUnitCost();
		}

		return () => {
			setUnitCostReferenceTable(false);
		}
	}, [unitCostReferenceTable])

	//Focus boton eliminar
	const onFocusDeleteBtn = (key = 0) => {
		console.log('focus')
		setTimeout(() => {
			deleteRefTable?.current[key]?.focus();
		}, 100);
	}

	const onChangeKeyDeleteBtn = (e, idx) => {
		if (e.key == 'ArrowUp') {
			e.preventDefault();
			onFocusDeleteBtn(idx - 1);
		}

		if (e.key == 'ArrowDown') {
			e.preventDefault();
			onFocusDeleteBtn(idx + 1);
		}
	}

	useEffect(() => {
		if (deleteReferenceTable) {
			onFocusDeleteBtn();
		}

		return () => {
			setDeleteReferenceTable(false);
		}
	}, [deleteReferenceTable])

	//Fin Atajos de modificación de productos entrada

	useEffect(() => {
		//getProductsByBusiness( logged?.empresa_id );
		qtyRefTable.current = [];
		unitRefTable.current = [];
		deleteRefTable.current = [];
	}, [logged])

	useEffect(() => {
		if(currentProducts.length)
		{
			defineTotalValues(currentProducts);
			setProductos(currentProducts);
			setProductsOld(currentProducts);
		} else {
			setProductos([]);
			defineTotalValues(currentProducts);
		}
	}, [currentProducts])

	const handleChange = (index, event) => {
		const { name, value } = event.target;
		const newFields = [...productos];
		newFields[index][name] = value;
		setProductos(newFields);
	};

	const loadProductByCodeBar = async (codeBar) => {
		const data = await getProductByProductoCodeBar(codeBar, logged?.empresa_id);
		return data[0];
	}

	const loadProductByProductId = async (productId) =>  {
		const data = await getProductByProductoId(productId, logged?.empresa_id);
		return data[0];
	}

	const loadProductByName = async (nombre) =>  {
		const data = await getProductByName(nombre, logged?.empresa_id);
		return data[0];
	}

	return (
		<Row gutter={24}>
			{
				currentPricesByProduct.length > 0 && suggestedPrices && (
					<Col span={18} style={{ marginTop: '2em', fontSize: '16px', fontWeight: '600' }}>
						<table cellPadding={2}>
							<thead>
								<tr>
									<td>Precio 2: {currentPricesByProduct[0].precio_2}</td>
									<td>Precio 3: {currentPricesByProduct[0].precio_3}</td>
									<td>Precio 4: {currentPricesByProduct[0].precio_4}</td>
									<td>Precio 5: {currentPricesByProduct[0].precio_5}</td>
									<td>Precio 6: {currentPricesByProduct[0].precio_6}</td>
									<td>Precio 7: {currentPricesByProduct[0].precio_7}</td>
									<td>Precio 8: {currentPricesByProduct[0].precio_8}</td>
									<td>Precio 9: {currentPricesByProduct[0].precio_9}</td>
									<td>Precio 10: {currentPricesByProduct[0].precio_10 || 0}</td>
								</tr>
							</thead>
						</table>
					</Col>
				)
			}
			{ showDeleteKey && (
				<div>
					<span style={{ marginLeft: '12px', fontWeight: 'bold' }}>
						Ingresa una clave de administrador para poder realizar esta acción.
					</span>
					<input 
						type="password"
						placeholder='Contraseña'
						ref={pswRef}
						onChange={ (e) => setPswString(e.target.value) }
						onKeyDown={ (e) => e.key == 'Enter' && deleteFromInput() }
						style={{ 
							// width: '100%', 
							marginLeft: '1em',
							backgroundColor: '#FFF',
							padding: '4px 11px',
							lineHeight: '1.5715',
							border: '1px solid #d9d9d9',
							borderRadius: '2px'
						}}
					/>
				</div>
				)
			}
			<br />
			<Col span={18}>
				<table
					border={1}
					className="table-entries"
				>
					<thead>
						<tr>
							<th>Op</th>
							<th>Cod</th>
							<th>Artículo</th>
							<th>Cant</th>
							<th>Unit</th>
							<th>Parcial</th>
						</tr>
					</thead>
					<tbody>
						{
							productos.length > 0 &&
							productos.map((product, index) => (
								<tr
									key={index}
								>
									<td>
										<Button
											size='small'
											ref={(element => deleteRefTable.current[index] = element)}
											type='primary'
											className='button-danger-entry'
											onKeyDown={e => onChangeKeyDeleteBtn(e, index)}
											onClick={() => deleteProductFromSale(product)}
										>
											<DeleteOutlined />
										</Button>
									</td>
									<td>{product.producto_id}</td>
									<td>{product.descripcion}</td>
									<td>
										<Input
											type="text"
											ref={(element => qtyRefTable.current[index] = element)}
											style={{ width: 100 }}
											name='cantidad'
											onChange={e => handleChange(index, e)}
											autoComplete='false'
											onKeyDown={e => onChangeKeyQty(e, index)}
											onKeyPress={(e) => handleSubmitKey(e, product, 'qty')}
											min="1"
											value={product.cantidad}
										/>
									</td>
									<td>
										<Input
											type="text"
											ref={ ( element => unitRefTable.current[index] = element ) }
											style={{ width: 100 }}
											name='unitario'
											onChange={e => handleChange(index, e)}
											onKeyDown={e => onChangeKeyUnitCost(e, index)}
											onKeyPress={(e) => handleSubmitKey(e, product, 'unit')}
											min="1"
											defaultValue={ product.unitario }
											value={ product.unitario }
										/>
									</td>
									<td>{new Intl.NumberFormat('es-ES').format(product.parcial)}</td>
								</tr>
							))
						}
					</tbody>
				</table>
			</Col>
			<Col span={6}>
				<Descriptions
					title=""
					bordered
					size='small'
					column={1}
				>
					<Descriptions.Item label="Peso KG">{new Intl.NumberFormat('es-ES').format(valuesCalculate?.totalKG)}</Descriptions.Item>
					<Descriptions.Item label="Vr Exento">{new Intl.NumberFormat('es-ES').format(valuesCalculate?.vrExento)}</Descriptions.Item>
					<Descriptions.Item label="Vr Grabado">{new Intl.NumberFormat('es-ES').format(valuesCalculate?.vrGravado)}</Descriptions.Item>
					<Descriptions.Item label="Vr IVA">{new Intl.NumberFormat('es-ES').format(valuesCalculate?.vrIva)}</Descriptions.Item>
					<Descriptions.Item label="Total"><strong>${new Intl.NumberFormat('es-ES').format(valuesCalculate?.totalParcial)}</strong></Descriptions.Item>
				</Descriptions>
			</Col>
		</Row>
	)
}

export default TableActions;