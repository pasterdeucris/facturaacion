import { useState, useEffect,useRef } from 'react';
import { Row, Col, Descriptions, Button, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { useActivations } from '../../../hooks/useActivations';
import { 
	deleteProductFromDocument, 
	updateProductFromDocumentApi, 
	getProductsByBusinessApi,
	modifyProductCantidadApi,
	updateDocumentoApi } from '../../../api/document';

import { saveAuditoriaApi } from '../../../api/inventory';

import "./TableActions.scss";

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
	allUsers={ allUsers }
}) {

	/** Refs table */
	const qtyRefTable = useRef([]);
	const unitRefTable = useRef([]);
	const deleteRefTable = useRef([]);

	const pswRef = useRef(null);

	const { deleteKey } = useActivations(logged);

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

	const deleteProductFromEntry = async (product) => {	
		try {

			if(deleteKey) {
				// let keyAdmin = prompt('Ingresa una clave de administrador para poder realizar esta acción.')
				// if(keyAdmin == null) {
				// 	return;
				// }

				// const resultPsw = allUsers.some( item => item.clave == keyAdmin );

				// if(!resultPsw) {
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
			
			await deleteProductFromDocument(product);
			const setQuantity = productsOpt.find(it => it.producto_id == product.producto_id);

			if(setQuantity) {
				const updtProduct = {
					...setQuantity,
					cantidad: parseFloat(setQuantity.cantidad) - parseFloat(product.cantidad)
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
				aplicativo: 'Entradas almacen',
				accion_auditoria: 4,
				tipo_documento_id: currentDoc?.content?.tipo_documento_id
			}
			await saveAuditoria(params);
			//Termina guardado de auditoria
			
			reloadDocument(product.documento_id, currentDoc?.content);
			toast.success('Producto eliminado para este documento.');
		} catch (err) {
			console.log(err);
			toast.warning('Error al eliminar el producto para el documento.');
		}
	}

	const deleteFromInput = async (product) => {	
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
			
			await deleteProductFromDocument(product);
			const setQuantity = productsOpt.find(it => it.producto_id == product.producto_id);

			if(setQuantity) {
				const updtProduct = {
					...setQuantity,
					cantidad: parseFloat(setQuantity.cantidad) - parseFloat(product.cantidad)
				}
				modifyProductInv(updtProduct);
			}

			console.log(product)

			//Guardado de auditoria eliminado
			const detail = `Se eliminó el producto ${product.descripcion} desde entradas del producto id ${product.producto_id} llamado ${product.descripcion}`;
			const params = {
				businessID: logged?.empresa_id, 
				detail, 
				userID: logged?.userID, 
				currentValue: product.parcial, 
				latestValue: product.parcial, 
				aplicativo: 'Entradas almacen',
				accion_auditoria: 4,
				tipo_documento_id: currentDoc?.content?.tipo_documento_id
			}
			await saveAuditoria(params);
			//Termina guardado de auditoria
			
			reloadDocument(product.documento_id, currentDoc?.content);
			setShowDeleteKey(false);
			setProductDeleteKey(null);
			setPswString("");
			toast.success('Producto eliminado para este documento.');
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
			// reloadDocument(product.documento_id);
			// toast.success('Producto actualizado para este documento.');
		} catch (err) {
			console.log(err);
			toast.warning('Error al actualizar el producto del inventario.');
		}
	}

	const getProductsByBusiness = async (businessID) => {
		try {
			const response = await getProductsByBusinessApi(businessID);
			setProductsOpt(response)
		} catch (err) {
			console.log(err);
			toast.warning('Error al obtener los productos de mi empresa.');
		}
	}

	const saveAuditoria = async (params) => {
		try {
			await saveAuditoriaApi(params);
		} catch (err) {
			console.log(err);
		}
	}

	const handleSubmitKey = (e, product, type) => {
		const { content } = currentDoc;

		if (e.key === 'Enter') {
			if(type == 'qty') {
				let cantidadOLD = product.cantidad;
				product = {
					...product,
					cantidad: e.target.value,
					parcial: parseFloat(e.target.value) * parseFloat(product.unitario)
				};

				const prodOpt = productsOpt.find(it => it.producto_id == product.producto_id);

				updateProductFromEntry(product);
				let cantidadDefinitiva = content?.tipo_documento_id <= 2 ? 
				parseFloat(prodOpt.cantidad) - parseFloat(cantidadOLD) + parseFloat(e.target.value) :
				parseFloat(prodOpt.cantidad) + parseFloat(cantidadOLD) - parseFloat(e.target.value)
				
				if(prodOpt) {
					const updtProduct = {
						...prodOpt,
						cantidad: cantidadDefinitiva
					}
					modifyProductInv(updtProduct);
				}
			}
			if(type == 'unit') {
				product = {
					...product,
					unitario: e.target.value,
					parcial: parseFloat(product.cantidad) * parseFloat(e.target.value)
				};

				updateProductFromEntry(product);
				
				// const detail = `Se modificó el precio desde entradas del producto id ${product.producto_id} llamado ${product.nombre}`;
				
				// const params = {
				// 	businessID: logged?.empresa_id, 
				// 	detail, 
				// 	userID: logged?.userID, 
				// 	currentValue: e.target.value, 
				// 	latestValue: product.unitario, 
				// 	aplicativo: 'Entradas almacen',
				// 	accion_auditoria: 2,
				// 	tipo_documento_id: currentDoc?.content?.tipo_documento_id
				// }
				
				// saveAuditoria(params);
			}
		}
	}

	const defineTotalValues = (productsCurrents) => {
		let totalKG = 0;
		let vrExento = 0;
		let vrGravado = 0;
		let vrIva = 0;
		let totalParcial = 0;

		productsCurrents.forEach(cp => {

			const product = productsOpt.find(item => item.producto_id == cp.producto_id);

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

		setValuesCalculate({
			totalKG: parseFloat(totalKG),
			vrExento: parseFloat(vrExento).toFixed(2),
			vrGravado: parseFloat(vrGravado).toFixed(2),
			vrIva: parseFloat(vrIva).toFixed(2),
			totalParcial: parseFloat(totalParcial).toFixed(2)
		});
	}

	const updateDoc = async(data) => {
		try {
			await updateDocumentoApi(data);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al actualizar el documento.');
		}
	}

	//Inicio Atajos de modificacion de productos de entrada

	//Focus Cantidad
	const onFocusQty = (key = 0) => {
		qtyRefTable?.current[key]?.focus();
		qtyRefTable?.current[key]?.select();
	}

	const onChangeKeyQty = (e, idx) => {
		
		if(e.key == 'ArrowUp') {
			e.preventDefault();
			onFocusQty(idx-1);
		} 

		if(e.key == 'ArrowDown') {
			e.preventDefault();
			onFocusQty(idx+1);
		}
	}

	useEffect(() => {
		if(qtyReferenceTable) {
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
		if(e.key == 'ArrowUp') {
			e.preventDefault();
			onFocusUnitCost(idx-1);
		} 

		if(e.key == 'ArrowDown') {
			e.preventDefault();
			onFocusUnitCost(idx+1);
		}
	}

	useEffect(() => {
		if(unitCostReferenceTable) {
			onFocusUnitCost();
		}

		return () => {
			setUnitCostReferenceTable(false);
		}
	}, [unitCostReferenceTable])

	//Focus boton eliminar
	const onFocusDeleteBtn = (key = 0) => {
		deleteRefTable?.current[key]?.focus();
	}

	const onChangeKeyDeleteBtn = (e, idx) => {
		if(e.key == 'ArrowUp') {
			e.preventDefault();
			onFocusDeleteBtn(idx-1);
		} 

		if(e.key == 'ArrowDown') {
			e.preventDefault();
			onFocusDeleteBtn(idx+1);
		}
	}

	useEffect(() => {
		if(deleteReferenceTable) {
			onFocusDeleteBtn();
		}

		return () => {
			setDeleteReferenceTable(false);
		}
	}, [deleteReferenceTable])

	//Fin Atajos de modificación de productos entrada

	useEffect(() => {
		getProductsByBusiness( logged?.empresa_id );
		qtyRefTable.current = [];
		unitRefTable.current = [];
		deleteRefTable.current = [];
	}, [logged, currentProducts])

	useEffect(() => {
		defineTotalValues( currentProducts );	
	}, [currentProducts])

	const calculateValues = () => {
		let vrExcento = 0;
		let vrGravado = 0;
		let vrIva = 0;
		let vrBaseIva5 = 0;
		let vrBaseIva19 = 0;
		let vrIva5 = 0;
		let vrIva19 = 0;

		if(currentProducts.length) {
			currentProducts.forEach(element => {
				const gravado = element.impuesto_producto == 5 ? parseFloat(element.parcial) / 1.05 
				: element.impuesto_producto == 19 ? parseFloat(element.parcial) / 1.19 
				: 0;
	
				const totalOnlyIVA = parseFloat(element.parcial) 
						* (element.impuesto_producto == '19' ? 0.19 : 
						element.impuesto_producto == '5' ? 0.05 : 0);
	
				const totalWithoutIva = parseFloat(element.parcial) - parseFloat(totalOnlyIVA);
	
				vrExcento += element.impuesto_producto == 0 ? parseFloat(element.parcial) : 0;
				vrGravado += element.impuesto_producto == 0 ? 0 : totalWithoutIva;
				vrIva += totalOnlyIVA;
				vrBaseIva5 += element.impuesto_producto == 5 ? parseFloat(element.parcial) / 1.05 : 0;
				vrBaseIva19 += element.impuesto_producto == 19 ? parseFloat(element.parcial) / 1.19 : 0;
				vrIva5 += element.impuesto_producto == 5 && parseFloat(element.parcial) - parseFloat(gravado);
				vrIva19 += element.impuesto_producto == 19 && parseFloat(element.parcial) - parseFloat(gravado);
			});
		}

		return {
			vrExcento,
			vrGravado,
			vrIva,
			vrBaseIva5,
			vrBaseIva19,
			vrIva5,
			vrIva19
		}
	}

	useEffect(() => {
	  if(currentDoc) {

		const {
			vrExcento,
			vrGravado,
			vrIva,
			vrBaseIva5,
			vrBaseIva19,
			vrIva5,
			vrIva19
		} = calculateValues();

			const data = {
				...currentDoc.content,
				peso_total: valuesCalculate?.totalKG,
				excento: parseFloat(vrExcento).toFixed(2),
				gravado: parseFloat(vrGravado).toFixed(2),
				iva: parseFloat(vrIva).toFixed(2),
				iva_5: parseFloat(vrIva5).toFixed(2),
				iva_19: parseFloat(vrIva19).toFixed(2),
				base_5: parseFloat(vrBaseIva5).toFixed(2),
				base_19: parseFloat(vrBaseIva19).toFixed(2),
				total: valuesCalculate?.totalParcial
			}
			
			updateDoc(data);
		}
	}, [valuesCalculate])
	

	return (
		<Row gutter={24}>
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
							<th>% iva</th>
						</tr>
					</thead>
					<tbody>
					{
						currentProducts.length > 0 && 
							currentProducts.map( (product, index) => (
								<tr
									key={index}
								>
									<td>
										<Button
											size='small'
											ref={ ( element => deleteRefTable.current[index] = element ) }
											type='primary'
											className='button-danger-entry'
											onKeyDown={ e => onChangeKeyDeleteBtn(e, index) }
											onClick={ () => deleteProductFromEntry(product) }
										>
											<DeleteOutlined />
										</Button>
									</td>
									<td>{ product.producto_id }</td>
									<td>{ product.descripcion }</td>
									<td>
										<Input
											type="text"
											ref={ ( element => qtyRefTable.current[index] = element ) }
											style={{ width: 100 }}
											name='cantidad'
											autoComplete='false'
											onKeyDown={ e => onChangeKeyQty(e, index) }
											onKeyPress={ (e) => handleSubmitKey(e, product, 'qty') }
											min="1"
											defaultValue={ product.cantidad }
										/>
									</td>
									<td>
										<Input
											type="text"
											ref={ ( element => unitRefTable.current[index] = element ) }
											style={{ width: 100 }}
											name='costo_unitario'
											onKeyDown={ e =>  onChangeKeyUnitCost(e, index)}
											onKeyPress={ (e) => handleSubmitKey(e, product, 'unit') }
											min="1"
											disabled={ editInvoice ? false : true }
											defaultValue={ product.unitario }
										/>
									</td>
									<td>{new Intl.NumberFormat('es-ES').format(product.parcial)}</td>
									<td>{ product.impuesto_producto }</td>
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