import { useState, useEffect, useRef } from 'react';
import { Form, Input, DatePicker, Select, InputNumber, Button } from 'antd';
import { toast } from 'react-toastify';

import {
	getSuppliersByBusinessApi,
	getProductsByBusinessApi,
	storeDocumentApi,
	storeDocumentoDetalleApi,
	updateProductCantidadApi,
	updateDocumentoApi,
	updateProductFromInventoryApi
} from '../../../api/document';

import { validationEntryUpdate } from '../../../validations/document';
import { useForm } from '../../../hooks/useForm';
import { useActivations } from '../../../hooks/useActivations';
import NameProductSelect from '../../Commons/NameProductSelect/NameProductSelect';

import FormEditCostComponent from '../FormEditCosts';
import CreateProduct from '../CreateProduct';

import "./FormUpdateAction.scss";
import { saveAuditoriaApi } from '../../../api/inventory';

function FormUpdateActions({
	logged,
	setShowUpdateForm,
	currentTypeD,
	setCurrentTypeD,
	currentDoc,
	reloadDocument,
	setQtyReferenceTable,
	setUnitCostReferenceTable,
	setDeleteReferenceTable,
	formUpdateActive,
	setFormUpdateActive,
	showFormCosts,
	setShowFormCosts,
	onDeleteButtonFocus,
	showModalSearchDocument,
	getPricesByProduct,
	currentPricesByProduct
}) {

	const { barcodeActive, activateStock, priceChange, suggestedPrices } = useActivations(logged);

	const barcodeRef = useRef(null);
	const productCodeRef = useRef(null);
	const clickInsertRef = useRef(null);

	const [suppliersOpt, setSuppliersOpt] = useState([]);
	const [productsOpt, setProductsOpt] = useState([]);

	const [currentIvaProduct, setCurrentIvaProduct] = useState(null);

	const getListSuppliers = async (businessID) => {
		try {
			const response = await getSuppliersByBusinessApi(businessID);
			setSuppliersOpt(response)
		} catch (err) {
			console.log(err);
			toast.warning('Error al obtener los proveedores de mi empresa.');
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

	useEffect(() => {
		getListSuppliers(logged?.empresa_id);
		getProductsByBusiness(logged?.empresa_id);
	}, [logged])

	useEffect(() => {
		if (formUpdateActive) {
			setTimeout(() => {
				if (barcodeActive) {
					barcodeRef.current.focus();
				} else {
					productCodeRef.current.focus();
				}
			}, 200);
		}
	}, [formUpdateActive])

	useEffect(() => {
		window.addEventListener('keypress', e => {

			let focussedTag = document.activeElement && document.activeElement.nodeName;

			if (focussedTag == 'INPUT' || focussedTag == 'TEXTAREA') {
				return;
			}

			//Cambiar cantidad de entrada
			if (e.key.toLocaleLowerCase() == 'c') {
				e.preventDefault();
				setQtyReferenceTable(true);
				setFormUpdateActive(false);
				setShowFormCosts(false);
			}

			//Borrar producto de entrada
			if (e.key.toLocaleLowerCase() == 'b') {
				// e.preventDefault();
				onDeleteButtonFocus();
				setFormUpdateActive(false);
				setShowFormCosts(false);
			}

			//Cambiar valor unitario de producto en una entrada.
			if (e.key.toLocaleLowerCase() == 'u') {
				e.preventDefault();
				setUnitCostReferenceTable(true);
				setFormUpdateActive(false);
				setShowFormCosts(false);
			}

			//Insertar nuevo producto.
			if (e.key.toLocaleLowerCase() == 'i') {
				e.preventDefault();
				if (clickInsertRef.current) {
					clickInsertRef.current.click();
				}
			}
		});
	}, [])

	useEffect(() => {
		if (!showModalSearchDocument) {
			getProductsByBusiness(logged?.empresa_id);
		}
	}, [showModalSearchDocument])

	return (
		<>
			<div style={{ margin: '3em 3em', textAlign: 'center' }}>
				<Button
					type="default"
					onClick={() => {
						setQtyReferenceTable(true);
						setFormUpdateActive(false);
						setShowFormCosts(false);
					}}
				>
					Cambiar cantidad
				</Button>
				<Button
					type="default"
					ref={clickInsertRef}
					onClick={() => {
						setFormUpdateActive(!formUpdateActive);
						setShowFormCosts(false);
						setTimeout(() => {
							if (barcodeActive) {
								barcodeRef.current.focus();
							} else {
								productCodeRef.current.focus();
							}
						}, 200);
					}}
				>
					Insertar
				</Button>
				<Button
					type="default"
					onClick={() => {
						setDeleteReferenceTable(true);
						setFormUpdateActive(false);
						setShowFormCosts(false);
					}}
				>
					Borrar
				</Button>
				<Button
					type="default"
					onClick={() => {
						setUnitCostReferenceTable(true);
						setFormUpdateActive(false);
						setShowFormCosts(false);
					}}
				>
					Unitario
				</Button>
			</div>

			{formUpdateActive && (
				<UpdateForm
					suppliersOpt={suppliersOpt}
					productsOpt={productsOpt}
					currentTypeD={currentTypeD}
					setCurrentTypeD={setCurrentTypeD}
					validationEntryUpdate={validationEntryUpdate}
					logged={logged}
					setShowUpdateForm={setShowUpdateForm}
					updateProductCantidadApi={updateProductCantidadApi}
					currentDoc={currentDoc?.content}
					updateDocumentoApi={updateDocumentoApi}
					reloadDocument={reloadDocument}
					barcodeRef={barcodeRef}
					productCodeRef={productCodeRef}
					currentIvaProduct={currentIvaProduct}
					setCurrentIvaProduct={setCurrentIvaProduct}
					setShowFormCosts={setShowFormCosts}
					setFormUpdateActive={setFormUpdateActive}
					setProductsOpt={setProductsOpt}
					barcodeActive={barcodeActive}
					activateStock={activateStock}
					priceChange={priceChange}
					clickInsertRef={clickInsertRef}
					suggestedPrices={suggestedPrices}
					getPricesByProduct={getPricesByProduct}
					currentPricesByProduct={currentPricesByProduct}
				/>
			)}
			{
				showFormCosts && (
					<FormEditCostComponent
						currentDoc={currentDoc}
						showFormCosts={showFormCosts}
						productsOpt={productsOpt}
						reloadDocument={reloadDocument}
						getProductsByBusiness={getProductsByBusiness}
						logged={logged}
						clickInsertRef={clickInsertRef}
					/>
				)
			}

			{
				currentIvaProduct && (
					<h5> <strong> IVA: {currentIvaProduct}</strong> </h5>
				)
			}
		</>
	)
}

function UpdateForm({
	suppliersOpt,
	productsOpt,
	currentTypeD,
	setCurrentTypeD,
	validationEntryUpdate,
	logged,
	setShowUpdateForm,
	currentDoc,
	updateDocumentoApi,
	reloadDocument,
	barcodeRef,
	productCodeRef,
	currentIvaProduct,
	setCurrentIvaProduct,
	setShowFormCosts,
	setFormUpdateActive,
	setProductsOpt,
	barcodeActive,
	activateStock,
	priceChange,
	clickInsertRef,
	suggestedPrices,
	getPricesByProduct,
	currentPricesByProduct }) {
	const [form] = Form.useForm();
	const { Option } = Select;

	const [formValues, handleInputChange, setValues, formReset] = useForm({
		fecha_registro: "",
		proveedor: "",
		tipo_documento: "",
		detalle_entrada: "",
		codigo_barras: "",
		codigo_producto: "",
		nombre_producto: "",
		cantidad: 1,
		costo_unitario: 0,
		costo_publico: 0,
		empresa_id: "",
		usuario_id: "",
	});

	const [registerDate, setRegisterDate] = useState(null);
	const [currentSupplier, setCurrentSupplier] = useState(null);
	const [currentProduct, setCurrentProduct] = useState(null);
	const [qty, setQty] = useState(1);
	const [unitCost, setUnitCost] = useState(0);
	const [publicCost, setPublicCost] = useState(0);
	const nameProductRef = useRef(null);
	const [productNewCreate, setProductNewCreate] = useState({
		barcode: "",
		product: "",
	});

	const [currentSuggestedPrices, setCurrentSuggestedPrices] = useState([]);

	const [showModalCreateProduct, setShowModalCreateProduct] = useState(false)

	/** Refs Focus inputs */
	const documentTypeRef = useRef(null);
	// const productCodeRef = useRef(null);
	const productIdRef = useRef(null);
	const quantityRef = useRef(null);
	const unitCostRef = useRef(null);
	const publicCostRef = useRef(null);

	useEffect(() => {
		if (currentPricesByProduct.length && suggestedPrices) {
			let prices = [];
			prices.push({ price: publicCost });
			currentPricesByProduct.forEach(item => {
				prices.push({ price: item.precio_2 });
				prices.push({ price: item.precio_3 });
				prices.push({ price: item.precio_4 });
				prices.push({ price: item.precio_5 });
				prices.push({ price: item.precio_6 });
				prices.push({ price: item.precio_7 });
				prices.push({ price: item.precio_8 });
				prices.push({ price: item.precio_9 });
				prices.push({ price: item.precio_10 || 0 });
			});
			setCurrentSuggestedPrices(prices)
			form.setFieldsValue({
				costo_publico: null
			});
			setValues({
				costo_publico: null
			});
		}
	}, [currentPricesByProduct])

	const resetForm = () => {
		form.resetFields();
		formReset();
	}

	useEffect(() => {
		if (currentProduct) {
			let prod = productsOpt.find(item => item.producto_id == currentProduct);
			setCurrentIvaProduct(prod.impuesto);
		}
	}, [currentProduct])

	useEffect(() => {
		form.setFieldsValue({
			proveedor: currentDoc?.proveedor_id,
			tipo_documento: currentDoc?.tipo_documento_id == 2 ? 'e' : currentDoc?.tipo_documento_id == 6 ? 's' : 'r',
			detalle_entrada: currentDoc?.detalle_entrada,
		});

		setCurrentSupplier(currentDoc?.proveedor_id);
		setCurrentTypeD(currentDoc?.tipo_documento_id);

	}, [currentDoc])

	const handleKeyEnter = (e) => {
		if (e.key === 'Enter') {
			if (activateStock) {
				const { stock_min, stock_max, cantidad } = productsOpt.find(product => product.producto_id == currentProduct);
				if (parseFloat(cantidad) + parseFloat(qty) >= parseFloat(stock_max)) {
					const isConfirm = confirm("Se ha igualado o sobrepasado el stock máximo para este producto, ¿Seguro deseas continuar?");
					if (!isConfirm) {
						return false;
					}
				}
			}

			e.preventDefault();
			onSubmit();
		}
	}

	const setPricesSuggestedOptions = async (val) => {
		setPublicCost(val);
		// setSendInProcess(true);
		form.setFieldsValue({
			costo_publico: val
		});
		setValues({
			costo_publico: val
		});

		await onSubmit(val)
	}

	const getProductAfterCreate = async (businessID, productID) => {
		const updating = await getProductsByBusinessApi(businessID);
		setProductsOpt(updating);

		const find = updating.find(item => item.producto_id == productID);
		if (find) {
			form.setFieldsValue({
				detalle_entrada: formValues.detalle_entrada,
				codigo_barras: find.codigo_barras,
				codigo_producto: find.producto_id,
				nombre_producto: find.producto_id,
				cantidad: 1,
				costo_unitario: find.costo,
				costo_publico: find.costo_publico
			});
			setValues({
				detalle_entrada: formValues.detalle_entrada,
				codigo_barras: find.codigo_barras,
				codigo_producto: find.producto_id,
				nombre_producto: find.producto_id,
				cantidad: 1,
				costo_unitario: find.costo,
				costo_publico: find.costo_publico
			});
			setCurrentProduct(find.producto_id);
			setUnitCost(find.costo);
			setPublicCost(find.costo_publico);
			quantityRef.current.focus();

			setProductNewCreate({
				barcode: "",
				product: "",
			});
		}
	}

	const handleSetTypeDocument = (e) => {
		if (e.key.toLowerCase() === 'r') {
			setCurrentTypeD(1);
			return
		}

		if (e.key.toLowerCase() === 'e') {
			setCurrentTypeD(2);
			return;
		}

		if (e.key.toLowerCase() === 's') {
			setCurrentTypeD(6);
			return
		}

		if (e.key === 'Enter') {
			return;
		}

		else {
			setCurrentTypeD(null);
			toast.warn('Tipo de documento inválido.');
		}
	}

	const setProductBarcode = (e) => {
		const data = e.target.value;
		const find = productsOpt.find(item => item.codigo_barras == data);

		if (e.key === 'Enter') {
			if (data == "") {
				// productIdRef.current.focus();
				nameProductRef.current.focus();
				return;
			}

			if (find) {
				if (formValues.nombre_producto != find.producto_id) {
					form.setFieldsValue({
						detalle_entrada: formValues.detalle_entrada,
						codigo_barras: find.codigo_barras,
						codigo_producto: find.producto_id,
						nombre_producto: find.producto_id,
						// cantidad: 1,
						costo_unitario: find.costo,
						costo_publico: find.costo_publico
					});
					setValues({
						detalle_entrada: formValues.detalle_entrada,
						codigo_barras: find.codigo_barras,
						codigo_producto: find.producto_id,
						nombre_producto: find.producto_id,
						// cantidad: 1,
						costo_unitario: find.costo,
						costo_publico: find.costo_publico
					});
					setQty(1);
					setCurrentProduct(find.producto_id);
					setUnitCost(find.costo);
					setPublicCost(find.costo_publico);
				}
				quantityRef.current.focus();
				quantityRef.current.select();
			} else {
				setProductNewCreate({ barcode: formValues.codigo_barras, product: "" });
				form.setFieldsValue({
					codigo_barras: "",
					codigo_producto: "",
					nombre_producto: "",
					cantidad: 1,
					costo_unitario: 0,
					costo_publico: 0
				});
				toast.warning('Producto no encontrado con este codigo de barra.');
				setShowModalCreateProduct(val => !val);
				return;
			}
		}

		if (e.key == 'Backspace') {
			form.setFieldsValue({
				codigo_barras: "",
				codigo_producto: "",
				nombre_producto: null,
				cantidad: 1,
				costo_unitario: 0,
				costo_publico: 0
			});

			setCurrentProduct(null);
			setUnitCost(0);
			setPublicCost(0);
		}
	}

	const setProductCode = (e) => {
		const data = e.target.value;
		const find = productsOpt.find(item => item.codigo_barras == data);

		if (e.key === 'Enter') {
			if (data == "") {
				if (barcodeActive) {
					barcodeRef.current.focus();
					return;
				} else {
					nameProductRef.current.focus();
					// productIdRef.current.focus();
					return;
				}
			}

			if (data == 999999) {
				setShowModalCreateProduct(val => !val);
				return;
			}

			const find = productsOpt.find(item => item.producto_id == data);
			getPricesByProduct(find.producto_id);
			if (find) {
				if (formValues.nombre_producto != find.producto_id) {
					form.setFieldsValue({
						detalle_entrada: formValues.detalle_entrada,
						codigo_barras: find.codigo_barras,
						codigo_producto: find.producto_id,
						nombre_producto: find.producto_id,
						cantidad: 1,
						costo_unitario: find.costo,
						costo_publico: find.costo_publico
					});
					setValues({
						detalle_entrada: formValues.detalle_entrada,
						codigo_barras: find.codigo_barras,
						codigo_producto: find.producto_id,
						nombre_producto: find.producto_id,
						cantidad: 1,
						costo_unitario: find.costo,
						costo_publico: find.costo_publico
					});
					setCurrentProduct(find.producto_id);
					setUnitCost(find.costo);
					setPublicCost(find.costo_publico);
					setQty(1);
				}
				quantityRef.current.focus();
				quantityRef.current.select();
			} else {
				form.setFieldsValue({
					codigo_barras: "",
					codigo_producto: "",
					nombre_producto: "",
					cantidad: 1,
					costo_unitario: 0,
					costo_publico: 0
				});
				toast.warning('Producto no encontrado con este codigo.');
				setShowModalCreateProduct(val => !val);
				return;
			}
		}

		if (e.key == 'Backspace') {
			form.setFieldsValue({
				codigo_barras: "",
				codigo_producto: "",
				nombre_producto: null,
				cantidad: 1,
				costo_unitario: 0,
				costo_publico: 0
			});

			setCurrentProduct(null);
			setUnitCost(0);
			setPublicCost(0);
		}
	}

	// const setProductEntry = (type, e) => {
	// 	const data = e.target.value;

	// 	if (e.key === 'Enter') {
	// 		if (type == 'barcode') {
	// 			if (data == "") {
	// 				productIdRef.current.focus();
	// 				return;
	// 			}
	// 			const find = productsOpt.find(item => item.codigo_barras == data);
	// 			if (find) {
	// 				if (formValues.nombre_producto != find.producto_id) {
	// 					form.setFieldsValue({
	// 						codigo_barras: find.codigo_barras,
	// 						codigo_producto: find.producto_id,
	// 						nombre_producto: find.producto_id,
	// 						// cantidad: 1,
	// 						costo_unitario: find.costo,
	// 						costo_publico: find.costo_publico
	// 					});
	// 					setValues({
	// 						codigo_barras: find.codigo_barras,
	// 						codigo_producto: find.producto_id,
	// 						nombre_producto: find.producto_id,
	// 						// cantidad: 1,
	// 						costo_unitario: find.costo,
	// 						costo_publico: find.costo_publico
	// 					});
	// 					setQty(1);
	// 					setCurrentProduct(find.producto_id);
	// 					setUnitCost(find.costo);
	// 					setPublicCost(find.costo_publico);
	// 				}
	// 				quantityRef.current.focus();
	// 				quantityRef.current.select();
	// 			} else {
	// 				setProductNewCreate({ barcode: formValues.codigo_barras, product: "" });
	// 				form.setFieldsValue({
	// 					codigo_barras: "",
	// 					codigo_producto: "",
	// 					nombre_producto: "",
	// 					cantidad: 1,
	// 					costo_unitario: 0,
	// 					costo_publico: 0
	// 				});
	// 				toast.warning('Producto no encontrado con este codigo de barra.');
	// 				setShowModalCreateProduct(val => !val);
	// 				return;
	// 			}
	// 		}

	// 		if (type == 'code') {
	// 			if (data == "") {
	// 				barcodeRef.current.focus();
	// 				barcodeRef.current.select();
	// 				return;
	// 			}

	// 			if (data == 999999) {
	// 				setShowModalCreateProduct(val => !val);
	// 				return;
	// 			}

	// 			const find = productsOpt.find(item => item.producto_id == data);
	// 			if (find) {
	// 				if (formValues.nombre_producto != find.producto_id) {
	// 					form.setFieldsValue({
	// 						codigo_barras: find.codigo_barras,
	// 						codigo_producto: find.producto_id,
	// 						nombre_producto: find.producto_id,
	// 						cantidad: 1,
	// 						costo_unitario: find.costo,
	// 						costo_publico: find.costo_publico
	// 					});
	// 					setValues({
	// 						codigo_barras: find.codigo_barras,
	// 						codigo_producto: find.producto_id,
	// 						nombre_producto: find.producto_id,
	// 						cantidad: 1,
	// 						costo_unitario: find.costo,
	// 						costo_publico: find.costo_publico
	// 					});
	// 					setQty(1);
	// 					setCurrentProduct(find.producto_id);
	// 					setUnitCost(find.costo);
	// 					setPublicCost(find.costo_publico);
	// 				}
	// 				quantityRef.current.focus();
	// 				quantityRef.current.select();
	// 			} else {
	// 				form.setFieldsValue({
	// 					codigo_barras: "",
	// 					codigo_producto: "",
	// 					nombre_producto: "",
	// 					cantidad: 1,
	// 					costo_unitario: 0,
	// 					costo_publico: 0
	// 				});
	// 				toast.warning('Producto no encontrado con este codigo.');
	// 				setShowModalCreateProduct(val => !val);
	// 				return;
	// 			}
	// 		}
	// 	}

	// 	if (e.key == 'Backspace') {
	// 		form.setFieldsValue({
	// 			codigo_barras: "",
	// 			codigo_producto: "",
	// 			nombre_producto: null,
	// 			cantidad: 1,
	// 			costo_unitario: 0,
	// 			costo_publico: 0
	// 		});

	// 		setCurrentProduct(null);
	// 		setUnitCost(0);
	// 		setPublicCost(0);
	// 	}
	// }

	const setProductSelect = (value) => {
		if (value == "") {
			productCodeRef.current.focus();
			return;
		}

		setCurrentProduct(value);
		getPricesByProduct(value);

		const find = productsOpt.find(item => item.producto_id == value);
		form.setFieldsValue({
			codigo_barras: find.codigo_barras,
			codigo_producto: find.producto_id,
			nombre_producto: find.producto_id,
			cantidad: 1,
			costo_unitario: find.costo,
			costo_publico: find.costo_publico
		});
		setValues({
			codigo_barras: find.codigo_barras,
			codigo_producto: find.producto_id,
			nombre_producto: find.producto_id,
			cantidad: 1,
			costo_unitario: find.costo,
			costo_publico: find.costo_publico
		});

		setQty(1);
		setUnitCost(find.costo);
		setPublicCost(find.costo_publico);
		// productCodeRef.current.focus();
		quantityRef.current.focus();
		quantityRef.current.select();

		//Si existe un producto seleccionado y todo sale bien, no hay porque abrir el modal de crear productos
		setShowModalCreateProduct(false);
		setProductNewCreate({ barcode: "", product: "" });
	}

	const onChangeSupplier = async (val) => {
		const data = {
			...currentDoc,
			proveedor_id: val,
		}

		try {
			await updateDocumentoApi(data);
			reloadDocument(currentDoc?.documento_id, data);
			setShowUpdateForm(false);
			toast.success('Documento modificado correctamente');
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar actualizar el documento');
		}
	}

	const onChangeFecha = async (val) => {
		const data = {
			...currentDoc,
			fecha_registro: val,
			fecha_entrega: val,
			fecha_vencimiento: val
		}

		try {
			await updateDocumentoApi(data);
			reloadDocument(currentDoc?.documento_id, data);
			setShowUpdateForm(false);
			toast.success('Documento modificado correctamente');
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar actualizar el documento');
		}
	}

	const onPublicCost = (e) => {

		if (qty == 0) {
			form.setFieldsValue({
				codigo_barras: "",
				codigo_producto: "",
				nombre_producto: "",
				cantidad: 1,
				costo_unitario: 0,
				costo_publico: 0
			});

			setValues({
				detalle_entrada: "",
				codigo_barras: "",
				codigo_producto: "",
				nombre_producto: "",
				cantidad: 1,
				costo_unitario: 0,
				costo_publico: 0
			});

			setCurrentProduct(null);
			setUnitCost(0);
			setPublicCost(0);
		}

		productIdRef.current.focus();
	}

	const onSubmit = async () => {

		if (qty == 0) {
			unitCostRef.current.focus();
			unitCostRef.current.select();
			return;
		}

		const currentProductOpt = productsOpt.find(item => item.producto_id == currentProduct);

		const data = {
			...formValues,
			fecha_registro: registerDate,
			tipo_documento: currentTypeD,
			proveedor: currentSupplier,
			empresa_id: logged?.empresa_id,
			usuario_id: logged?.userID,
			nombre_producto: currentProduct,
			cantidad: qty,
			costo_unitario: unitCost,
			costo_publico: publicCost,
			product: currentProductOpt
		}

		const productUpdate = {
			...currentProductOpt,
			costo: unitCost,
			costo_publico: publicCost
		}

		if (Number(publicCost) >= 1000000 || (Number(publicCost) * Number(qty)) >= 100000000) {
			const res = window.confirm('El costo es incorrecto y puede dar problemas, por favor verifica el precio colocado.');
			if(!res) return;
		}

		if (!validationEntryUpdate(data)) {
			return;
		}

		try {

			const dataPromises = [
				storeDocumentoDetalleApi(data, currentDoc?.documento_id),
				updateProductCantidadApi(data, currentDoc?.documento_id),
				updateProductFromInventoryApi(productUpdate, data)
			];

			await Promise.all(dataPromises);
			if(Number(currentProductOpt?.costo) != Number(unitCost)) {
				const detail = `Se modificó el precio desde entradas del producto id ${currentProductOpt.producto_id} llamado ${currentProductOpt.nombre}`;
				const params = {
					businessID: logged?.empresa_id, 
					detail, 
					userID: logged?.userID, 
					currentValue: unitCost, 
					latestValue: currentProductOpt.costo, 
					aplicativo: 'Entradas almacen',
					accion_auditoria: 2,
					tipo_documento_id: null
				}
				saveAuditoriaApi(params);
			}

			// const response = await storeDocumentApi(data);
			// await storeDocumentoDetalleApi(data, currentDoc?.documento_id);
			// await updateProductCantidadApi(data, currentDoc?.documento_id);
			// await updateProductFromInventoryApi(productUpdate, data);
			resetForm();
			// setShowUpdateForm(false);
			reloadDocument(currentDoc?.documento_id, currentDoc);
			// setFormUpdateActive(false);
			// setShowFormCosts(true);
			// if (priceChange) {
			// 	setShowFormCosts(true);
			// 	setFormUpdateActive(false);
			// } else {
				setFormUpdateActive(true);
				setShowFormCosts(false);
			// }
			toast.success('Entrada almacenado satisfactoriamente.');
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al guardar la entrada.');
		} finally {
			setTimeout(() => {
				if (barcodeActive) {
					barcodeRef.current.focus();
					return;
				} else {
					productIdRef.current.focus();
					return;
				}
			}, 200);
		}
	}

	const productEnter = (e) => {
		if (!e.target.value) {
			productCodeRef.current.focus();
			return;
		}

		const find = productsOpt.some(el => el.nombre.toLowerCase() == e.target.value.toLowerCase());

		if (!find) {
			setProductNewCreate({ barcode: "", product: e.target.value });
			setShowModalCreateProduct(val => !val);
			return;
		}
	}

	const nextInput = (objectRef, e) => {
		if (e.key === 'Enter') {
			if(qty > 1500) {
				quantityRef?.current?.select();
				alert('La cantidad no puede ser mayor a 1500.');
				return;
			}

			objectRef?.current?.focus();
			if (!suggestedPrices) objectRef?.current?.select();
		}
	}

	// useEffect(() => {
	// 	if(showModalCreateProduct && currentProduct) {
	// 		setShowModalCreateProduct( false );
	// 		setProductNewCreate({ barcode: "", product: "" });
	// 	}
	// }, [currentProduct])


	return (
		<>
			<Form
				form={form}
				layout="inline"
				size='small'
				className='form-actions-entries'
				initialValues={{ cantidad: 1 }}
			>
				<Form.Item >
					{/* name="fecha_registro" */}
					<DatePicker
						placeholder='Fecha'
						size="middle"
						name='fecha_registro'
						onChange={(date, dateString) => onChangeFecha(date)}
					/>
					<p style={{ fontSize: '10px' }}>{currentDoc?.fecha_registro}</p>
				</Form.Item>

				<Form.Item name="proveedor">
					<Select
						showSearch
						name="proveedor"
						size="middle"
						placeholder="Proveedor"
						onChange={(val) => onChangeSupplier(val)}
						style={{ width: 200 }}
						filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
						allowClear
					>
						{
							suppliersOpt.length > 0 &&
							suppliersOpt.map((item, idx) => (
								<Option
									key={idx}
									value={item.proveedor_id}
								>
									{item.nombre}
								</Option>
							))
						}
					</Select>
				</Form.Item>
				<Form.Item name="tipo_documento">
					<Input
						type="text"
						name="tipo_documento"
						size="middle"
						onKeyPress={e => handleSetTypeDocument(e)}
						autoComplete="off"
						onChange={handleInputChange}
						maxLength={1}
						placeholder="Tipo documento"
						disabled={true}
					/>
				</Form.Item>
				<Form.Item name="detalle_entrada">
					<Input
						type="text"
						name="detalle_entrada"
						size="middle"
						onChange={handleInputChange}
						placeholder="Detalle entrada"
						disabled={true}
					/>
				</Form.Item>
				{barcodeActive && (
					<Form.Item name="codigo_barras">
						<Input
							type="text"
							name="codigo_barras"
							size="middle"
							className='input-form'
							ref={barcodeRef}
							onChange={handleInputChange}
							// onKeyPress={ e => e.key == 'Enter' && quantityRef.current.focus() }
							onKeyDown={(e) => setProductBarcode(e)}
							placeholder="Código de barras"
						/>
					</Form.Item>
				)}

				<Form.Item name="codigo_producto">
					<Input
						type="text"
						name="codigo_producto"
						size="middle"
						ref={productCodeRef}
						onChange={handleInputChange}
						placeholder="Código del producto"
						onKeyDown={(e) => setProductCode(e)}
					/>
				</Form.Item>

				<NameProductSelect
					setProductSelect={setProductSelect}
					nameProductRef={nameProductRef}
					productEnter={productEnter}
					barcodeRef={barcodeRef}
					productCodeRef={productCodeRef}
					logged={logged}
				/>

				<Form.Item name="cantidad" label="Cantidad">
					<InputNumber
						name="cantidad"
						size="middle"
						ref={quantityRef}
						min={0}
						onChange={(val) => setQty(val)}
						// onKeyDown={(e) => handleKeyEnter(e)}
						onKeyDown={e => nextInput(unitCostRef, e)}
					/>
				</Form.Item>

				<Form.Item name="costo_unitario" label="Costo unitario">
					<InputNumber
						name="costo_unitario"
						size="middle"
						ref={unitCostRef}
						min={0}
						onKeyDown={e => nextInput(publicCostRef, e)}
						// onKeyPress={e => { e.key == 'Enter' && publicCostRef.current.focus(); publicCostRef.current.select(); }}
						onChange={(val) => setUnitCost(val)}
					/>
				</Form.Item>

				{/* <Form.Item name="costo_publico" label="Costo público">
					<InputNumber
						name="costo_publico"
						size="middle"
						ref={publicCostRef}
						min={0}
						// onKeyPress={e => { e.key == 'Enter' && productIdRef.current.focus() }}
						onKeyPress={e => { e.key == 'Enter' && onPublicCost(e) }}
						onChange={(val) => setPublicCost(val)}
					/>
				</Form.Item> */}

				{/* {!suggestedPrices && */}
					<Form.Item name="costo_publico" label="Costo público">
						<InputNumber
							name="costo_publico"
							ref={publicCostRef}
							min={0}
							size="middle"
							readOnly={ priceChange ? false : true }
							onChange={val => setPublicCost(val)}
							onKeyDown={(e) => handleKeyEnter(e)}
						/>
					</Form.Item>
				{/* } */}

				{/* {suggestedPrices &&
					<Form.Item name="costo_publico">
						<Select
							showSearch
							name="costo_publico"
							size="middle"
							ref={publicCostRef}
							placeholder="Precio"
							onChange={(val) => setPricesSuggestedOptions(val)}
							defaultOpen={false}
							defaultActiveFirstOption={true}
							style={{ width: 200 }}
							allowClear
						>
							<Option>Mantener precio actual</Option>
							{
								currentSuggestedPrices.length > 0 &&
								currentSuggestedPrices.map((item, idx) => (
									<Option
										key={idx}
										value={item.price}
									>
										{item.price}
									</Option>
								))
							}
						</Select>
					</Form.Item>
				} */}

			</Form>

			<CreateProduct
				showModalCreateProduct={showModalCreateProduct}
				setShowModalCreateProduct={setShowModalCreateProduct}
				logged={logged}
				getProductAfterCreate={getProductAfterCreate}
				productNewCreate={productNewCreate}
			/>
		</>
	)
}

export default FormUpdateActions