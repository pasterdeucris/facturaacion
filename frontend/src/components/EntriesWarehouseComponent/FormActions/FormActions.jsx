import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Form, Input, DatePicker, Select, InputNumber } from 'antd';
import { toast } from 'react-toastify';

import {
	getSuppliersByBusinessApi,
	getProductsByBusinessApi,
	storeDocumentApi,
	storeDocumentoDetalleApi,
	updateProductCantidadApi,
	updateProductFromInventoryApi
} from '../../../api/document';
import { validationEntry } from '../../../validations/document';
import { useForm } from '../../../hooks/useForm';
import { useActivations } from '../../../hooks/useActivations';

import CreateProduct from '../CreateProduct';
import NameProductSelect from '../../Commons/NameProductSelect/NameProductSelect';

import "./FormActions.scss";
import { saveAuditoriaApi } from '../../../api/inventory';

function FormActions({
	logged,
	setShowCreateForm,
	currentTypeD,
	setCurrentTypeD,
	lastDocument,
	showCreateForm,
	setShowUpdateForm,
	setFormUpdateActive,
	setShowFormCosts,
	showModalSearchDocument,
	getPricesByProduct,
	currentPricesByProduct
}) {

	const supplierRef = useRef(null);

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
		if (showCreateForm) {
			getListSuppliers(logged?.empresa_id);
			getProductsByBusiness(logged?.empresa_id);

			setTimeout(() => {
				supplierRef?.current?.focus();
			}, 200);
		};
	}, [logged, showCreateForm])

	useEffect(() => {
		if (!showModalSearchDocument) {
			getProductsByBusiness(logged?.empresa_id);
		}
	}, [showModalSearchDocument])



	return (
		<>
			<h3>Nuevo registro</h3>
			<CreateForm
				suppliersOpt={suppliersOpt}
				productsOpt={productsOpt}
				currentTypeD={currentTypeD}
				setCurrentTypeD={setCurrentTypeD}
				validationEntry={validationEntry}
				logged={logged}
				lastDocument={lastDocument}
				setShowCreateForm={setShowCreateForm}
				updateProductCantidadApi={updateProductCantidadApi}
				getProductsByBusinessApi={getProductsByBusinessApi}
				setProductsOpt={setProductsOpt}
				supplierRef={supplierRef}
				setCurrentIvaProduct={setCurrentIvaProduct}
				setShowUpdateForm={setShowUpdateForm}
				setFormUpdateActive={setFormUpdateActive}
				setShowFormCosts={setShowFormCosts}
				getPricesByProduct={getPricesByProduct}
				currentPricesByProduct={currentPricesByProduct}
			/>
			{
				currentIvaProduct && (
					<h5> <strong> IVA: {currentIvaProduct}</strong> </h5>
				)
			}
		</>
	)
}

function CreateForm({
	suppliersOpt,
	setProductsOpt,
	productsOpt,
	currentTypeD,
	setCurrentTypeD,
	validationEntry,
	logged,
	lastDocument,
	setShowCreateForm,
	updateProductCantidadApi,
	getProductsByBusinessApi,
	supplierRef,
	setCurrentIvaProduct,
	setShowUpdateForm,
	setFormUpdateActive,
	setShowFormCosts,
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
		cantidad: 0,
		costo_unitario: 0,
		costo_publico: 0,
		empresa_id: "",
		usuario_id: "",
	});

	const { barcodeActive, activateStock, priceChange, suggestedPrices } = useActivations(logged);

	/** Refs Focus inputs */
	const detailEntryRef = useRef(null);
	const barcodeRef = useRef(null);
	const nameProductRef = useRef(null);
	const documentTypeRef = useRef(null);
	const productCodeRef = useRef(null);
	const productIdRef = useRef(null);
	const quantityRef = useRef(null);
	const unitCostRef = useRef(null);
	const publicCostRef = useRef(null);

	const [registerDate, setRegisterDate] = useState(null);
	const [currentSupplier, setCurrentSupplier] = useState(null);
	const [currentProduct, setCurrentProduct] = useState(null);
	const [qty, setQty] = useState(1);
	const [unitCost, setUnitCost] = useState(0);
	const [publicCost, setPublicCost] = useState(0);
	const [productNewCreate, setProductNewCreate] = useState({
		barcode: "",
		product: "",
	});

	const [currentSuggestedPrices, setCurrentSuggestedPrices] = useState([]);

	const [showModalCreateProduct, setShowModalCreateProduct] = useState(false)

	useEffect(() => {
		if (currentProduct) {
			let prod = productsOpt.find(item => item.producto_id == currentProduct);
			setCurrentIvaProduct(prod.impuesto);
		}
	}, [currentProduct])

	useEffect(() => {
		setTimeout(() => {
			const getFocusRef = () => {
				if (documentTypeRef?.current) return documentTypeRef;
				if (barcodeRef?.current) return barcodeRef;
				return nameProductRef;
			};
	
			const focusRef = getFocusRef();
			focusRef?.current?.focus();
		}, 50);
	}, [logged]);

	useEffect(() => {
		if(currentPricesByProduct.length && suggestedPrices) {
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
		}

		else if (e.key.toLowerCase() === 'e') {
			setCurrentTypeD(2);
		}

		else if (e.key.toLowerCase() === 's') {
			setCurrentTypeD(6);
		}

		else if (e.key === 'Enter') {
			if (e.target.value == "") setCurrentTypeD(2);
			detailEntryRef.current.focus();
			return;
		}

		else {
			setCurrentTypeD(null);
			toast.warn('Tipo de documento inválido.');
		}
	}

	const clickDetailEntry = (e) => {
		if (e.key == 'Enter') {
			if (barcodeActive) {
				barcodeRef.current.focus();
			} else {
				productCodeRef.current.focus();
			}
		}
	}

	const setProductBarcode = useCallback((e) => {
		if (e.key === 'Enter') {
			const data = e.target.value;
			const find = productsOpt.find(item => item.codigo_barras == data);
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
	}, [productsOpt],);

	const setProductCode = (e) => {
		const data = e.target.value;
		const find = productsOpt.find(item => item.codigo_barras == data);

		if (e.key === 'Enter') {
			if (data == "") {
				if (barcodeActive) {
					barcodeRef.current.focus();
					return;
				} else {
					// productIdRef.current.focus();
					nameProductRef.current.focus();
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
	// 	const find = productsOpt.find(item => item.codigo_barras == data);

	// 	if (e.key === 'Enter') {
	// 		if (type == 'barcode') {
	// 			if (data == "") {
	// 				productIdRef.current.focus();
	// 				return;
	// 			}

	// 			if (find) {
	// 				if (formValues.nombre_producto != find.producto_id) {
	// 				form.setFieldsValue({
	// 					detalle_entrada: formValues.detalle_entrada,
	// 					codigo_barras: find.codigo_barras,
	// 					codigo_producto: find.producto_id,
	// 					nombre_producto: find.producto_id,
	// 					// cantidad: 1,
	// 					costo_unitario: find.costo,
	// 					costo_publico: find.costo_publico
	// 				});
	// 				setValues({
	// 					detalle_entrada: formValues.detalle_entrada,
	// 					codigo_barras: find.codigo_barras,
	// 					codigo_producto: find.producto_id,
	// 					nombre_producto: find.producto_id,
	// 					// cantidad: 1,
	// 					costo_unitario: find.costo,
	// 					costo_publico: find.costo_publico
	// 				});
	// 				setQty(1);
	// 				setCurrentProduct(find.producto_id);
	// 				setUnitCost(find.costo);
	// 				setPublicCost(find.costo_publico);
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
	// 						detalle_entrada: formValues.detalle_entrada,
	// 						codigo_barras: find.codigo_barras,
	// 						codigo_producto: find.producto_id,
	// 						nombre_producto: find.producto_id,
	// 						cantidad: 1,
	// 						costo_unitario: find.costo,
	// 						costo_publico: find.costo_publico
	// 					});
	// 					setValues({
	// 						detalle_entrada: formValues.detalle_entrada,
	// 						codigo_barras: find.codigo_barras,
	// 						codigo_producto: find.producto_id,
	// 						nombre_producto: find.producto_id,
	// 						cantidad: 1,
	// 						costo_unitario: find.costo,
	// 						costo_publico: find.costo_publico
	// 					});
	// 					setCurrentProduct(find.producto_id);
	// 					setUnitCost(find.costo);
	// 					setPublicCost(find.costo_publico);
	// 					setQty(1);
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

	// 		// setValues({
	// 		// 	detalle_entrada: "",
	// 		// 	codigo_barras: "",
	// 		// 	codigo_producto: "",
	// 		// 	nombre_producto: null,
	// 		// 	cantidad: 1,
	// 		// 	costo_unitario: 0,
	// 		// 	costo_publico: 0
	// 		// });

	// 		setCurrentProduct(null);
	// 		setUnitCost(0);
	// 		setPublicCost(0);
	// 	}
	// }

	const setProductSelect = (value) => {
		if (value == "" || !value) {
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
		quantityRef.current.focus();
		quantityRef.current.select();

		//Si existe un producto seleccionado y todo sale bien, no hay porque abrir el modal de crear productos
		setShowModalCreateProduct(false);
		setProductNewCreate({ barcode: "", product: "" });
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
			fecha_registro: registerDate ? registerDate : new Date().toLocaleDateString,
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

		if (!validationEntry(data)) {
			return;
		}

		if (Number(publicCost) >= 1000000 || (Number(publicCost) * Number(qty)) >= 100000000) {
			const res = window.confirm('El costo es incorrecto y puede dar problemas, por favor verifica el precio colocado.');
			console.log(res)
			if(!res) return;
		}

		try {
			const response = await storeDocumentApi(data);

			const dataPromises = [
				storeDocumentoDetalleApi(data, response.documento_id),
				updateProductCantidadApi(data, response.documento_id),
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

			// await storeDocumentoDetalleApi(data, response.documento_id);
			// await updateProductCantidadApi(data, response.documento_id);
			// await updateProductFromInventoryApi(productUpdate, data);
			resetForm();
			setShowCreateForm(false);
			lastDocument();
			setShowUpdateForm(true);
			// setFormUpdateActive(false);
			// setShowFormCosts(true);
			// if (priceChange) {
			// 	// setShowFormCosts(true);
			// 	setFormUpdateActive(true);
			// } else {
				setFormUpdateActive(true);
				setShowUpdateForm(true);
				// setShowFormCosts(false);
			// }
			toast.success('Entrada almacenado satisfactoriamente.');
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al guardar la entrada.');
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
	// }, [showModalCreateProduct])


	return (
		<>
			<Form
				form={form}
				layout="inline"
				size='small'
				className='form-actions-entries'
				initialValues={{ cantidad: 1 }}
			>
				<Form.Item name="fecha">
					<DatePicker
						placeholder='Fecha'
						size="middle"
						onChange={(date, dateString) => setRegisterDate(dateString)}
						disabled={true}
					/>
				</Form.Item>

				<Form.Item name="proveedor">
					<Select
						showSearch
						name="proveedor"
						size="middle"
						ref={supplierRef}
						placeholder="Proveedor"
						onChange={(val) => { setCurrentSupplier(val); documentTypeRef.current.focus(); }}
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
						ref={documentTypeRef}
						onKeyPress={e => handleSetTypeDocument(e)}
						autoComplete="off"
						onChange={handleInputChange}
						maxLength={1}
						size="middle"
						placeholder="Tipo documento"
					/>
				</Form.Item>
				<Form.Item name="detalle_entrada">
					<Input
						type="text"
						name="detalle_entrada"
						size="middle"
						ref={detailEntryRef}
						onKeyPress={e => clickDetailEntry(e)}
						onChange={handleInputChange}
						placeholder="Detalle entrada"
					/>
				</Form.Item>
				{barcodeActive && (
					<Form.Item name="codigo_barras">
						<Input
							type="text"
							size="middle"
							name="codigo_barras"
							ref={barcodeRef}
							className='input-form'
							onChange={handleInputChange}
							onKeyDown={(e) => setProductBarcode(e)}
							placeholder="Código de barras"
						/>
					</Form.Item>
				)}

				<Form.Item name="codigo_producto">
					<Input
						type="text"
						size="middle"
						name="codigo_producto"
						ref={productCodeRef}
						onChange={handleInputChange}
						placeholder="Código del producto"
						onKeyDown={(e) => setProductCode(e)}
					/>
				</Form.Item>

				{/* <Form.Item name="nombre_producto">
					<Select
						showSearch
						name="nombre_producto"
						size="middle"
						ref={productIdRef}
						placeholder="Nombre producto"
						onInputKeyDown={(e) => e.key == 'Enter' && productEnter(e)}
						onChange={(val) => setProductSelect(val)}
						defaultOpen={false}
						defaultActiveFirstOption={false}
						style={{ width: 300 }}
						// filterOption={(input, option) => option.children[0].toLowerCase().includes(input.toLowerCase())}
						filterOption={(input, option) => {
							const inputNormalized = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
							const optionTextNormalized = option.props.children[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

							// Buscar la palabra ingresada como una palabra completa en la opción
							const inputFullWordMatch = new RegExp(`\\b${inputNormalized}\\b`, 'i').test(optionTextNormalized);

							// Si la palabra ingresada coincide exactamente con la opción, mostrar solo esa opción
							if (inputFullWordMatch && inputNormalized === optionTextNormalized) {
								return true;
							}

							// Si no se encuentra la palabra ingresada como una palabra completa, buscar cada palabra de la cadena de búsqueda como una subcadena en el texto de la opción
							const inputWords = inputNormalized.split(' ');
							const wordMatches = inputWords.every(word => optionTextNormalized.includes(word));

							// Si hay coincidencias cercanas y no hay coincidencia exacta, mostrar solo las opciones que contengan la palabra ingresada
							if (wordMatches && !inputFullWordMatch) {
								return true;
							}

							return false;
						}}
					>
						{/* <Option value="">Seleccione una opción</Option> */}
						{/* {
							productsOpt.length > 0 &&
							productsOpt.map((item, idx) => (
								<Option
									key={idx}
									value={item.producto_id}
								>
									{item.nombre}
									<br />
									<small style={{ fontSize: '12px' }} >
										Costo: {item.costo} |
										Público: {item.costo_publico} |
										Cantidad: {item.cantidad} |
										ID: {item.producto_id}
									</small>
								</Option>
							))
						} */}
					{/* </Select> */}
				{/* </Form.Item> */}

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
						ref={quantityRef}
						size="middle"
						min={0}
						onChange={(val) => setQty(val)}
						// onKeyDown={(e) => handleKeyEnter(e)}
						onKeyDown={e => nextInput(unitCostRef, e)}
					/>
				</Form.Item>

				<Form.Item name="costo_unitario" label="Costo unitario">
					<InputNumber
						name="costo_unitario"
						ref={unitCostRef}
						min={0}
						size="middle"
						onKeyDown={e => nextInput(publicCostRef, e)}
						// onKeyPress={e => { e.key == 'Enter' && publicCostRef.current.focus(); publicCostRef.current.select(); }}
						onChange={(val) => setUnitCost(val)}
					/>
				</Form.Item>

				{/* <Form.Item name="costo_publico" label="Costo público">
					<InputNumber
						name="costo_publico"
						ref={publicCostRef}
						min={0}
						size="middle"
						onKeyPress={e => { e.key == 'Enter' && onPublicCost(e) }}
						onChange={(val) => setPublicCost(val)}
					/>
				</Form.Item> */}
				{/* <Form.Item name="id_cotero">
					<Input 
						type="text"
						name="id_cotero"
						// onChange={ handleInputChange }
						placeholder="ID del cotero"
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
							<Option>Mantener  precio actual</Option>
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

export default memo(FormActions)