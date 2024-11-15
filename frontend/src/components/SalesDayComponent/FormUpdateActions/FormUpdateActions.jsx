import { useState, useEffect, useRef } from 'react';
import { Form, Input, DatePicker, Select, InputNumber, Button } from 'antd';
import { toast } from 'react-toastify';
import { storeDocumentoDetalleApi, updateProductCantidadApi, getProductsByBusinessApi, updateDocumentoApi, updateFechaRegistro } from '../../../api/sales';
import { getClientsApi } from '../../../api/client';
import { getEmployeesApi } from '../../../api/employee';
import { validationEntryUpdate } from '../../../validations/sales';
import { useForm } from '../../../hooks/useForm';
import { useActivations } from '../../../hooks/useActivations';

import FormEditCostComponent from '../FormEditCosts';
import NameProductSelect from '../../Commons/NameProductSelect/NameProductSelect';
import CreateProduct from '../CreateProduct';
import {
	getProductByProductoCodeBar,
	getProductByProductoId,
	getProductByName
} from '../../../api/sales';

import useDayjs from '../../../hooks/useDays';

import "./FormUpdateAction.scss";
import { saveAuditoriaApi } from '../../../api/inventory';
import { socket } from '../../../hooks/useSocket';

function FormUpdateActions({
	logged,
	setCurrentDocumentID,
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
	currentPricesByProduct,
	setValuePublicCost,
	valuePublicCost,
}) {

	const { barcodeActive, activateCreateProducts, clientRequired, activateStock, priceChange, negativesQty, suggestedPrices, clientInvoice, employeeInvoice, guideTransportInvoice, isLoading } = useActivations(logged);
	const barcodeRef = useRef(null);
	const productCodeRef = useRef(null);
	const clickInsertRef = useRef(null);
	// const isExecutingRef = useRef(false);
	const [clientsOpt, setClientsOpt] = useState([]);
	const [publicCost, setPublicCost] = useState(0);
	const [employessOpt, setemployessOpt] = useState([]);
	const [productsOpt, setProductsOpt] = useState([]);

	const [currentIvaProduct, setCurrentIvaProduct] = useState(null);

	const getListClients = async (businessID) => {
		try {
			const response = await getClientsApi(businessID);
			setClientsOpt(response)
		} catch (err) {
			console.log(err);
			toast.warning('Error al obtener los clientes de mi empresa.');
		}
	}

	const getListEmployees = async (businessID) => {
		try {
			const response = await getEmployeesApi(businessID);
			setemployessOpt(response)
		} catch (err) {
			console.log(err);
			toast.warning('Error al obtener los empleados de mi empresa.');
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
		getListClients(logged?.empresa_id);
		getListEmployees(logged?.empresa_id);
		//getProductsByBusiness(logged?.empresa_id);
	}, [logged])

	useEffect(() => {
		if (formUpdateActive && !isLoading) {
			setTimeout(() => {
				if (barcodeActive) {
					barcodeRef.current.focus();
				} else {
					productCodeRef.current.focus();
				}
			}, 200);
		}
	}, [formUpdateActive, isLoading])


	useEffect(() => {
		function handleKeypressEvent(e) {
			let focussedTag = document.activeElement && document.activeElement.nodeName;
			let isExecuting = false;

			if (focussedTag == 'INPUT' || focussedTag == 'TEXTAREA') {
				return;
			}

			//Cambiar cantidad de entrada
			if (e.key.toLowerCase() == 'c') {
				e.preventDefault();
				setQtyReferenceTable(true);
				setFormUpdateActive(false);
				setShowFormCosts(false);
			}

			//Borrar producto de entrada
			if (e.key.toLowerCase() == 'b') {
				// isExecutingRef.current = true;

				// e.preventDefault();
				onDeleteButtonFocus();
				setFormUpdateActive(false);
				setShowFormCosts(false);

				// setTimeout(() => {
				// 	isExecutingRef.current = false;
				// }, 200);
			}


			//Cambiar valor unitario de producto en una entrada.
			if (e.key.toLowerCase() == 'u') {
				e.preventDefault();
				setUnitCostReferenceTable(true);
				setFormUpdateActive(false);
				setShowFormCosts(false);
			}

			//Insertar nuevo producto.
			if (e.key.toLowerCase() == 'i') {
				e.preventDefault();
				if (clickInsertRef.current) {
					clickInsertRef.current.click();
				}
			}
		}

		window.addEventListener('keypress', handleKeypressEvent);

		return () => {
			window.removeEventListener('keypress', handleKeypressEvent);
		};
	}, [])

	useEffect(() => {
		if (!showModalSearchDocument) {
			//getProductsByBusiness(logged?.empresa_id);
		}
	}, [showModalSearchDocument]);

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
						// setTimeout(() => {
						// 	if (barcodeActive) {
						// 		barcodeRef.current.focus();
						// 	} else {
						// 		productCodeRef.current.focus();
						// 	}
						// }, 200);
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
					clientsOpt={clientsOpt}
					employessOpt={employessOpt}
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
					activateCreateProducts={activateCreateProducts}
					clientRequired={clientRequired}
					activateStock={activateStock}
					negativesQty={negativesQty}
					getPricesByProduct={getPricesByProduct}
					priceChange={priceChange}
					setValuePublicCost={setValuePublicCost}
					setPublicCost={setPublicCost}
					publicCost={publicCost}
					currentPricesByProduct={currentPricesByProduct}
					suggestedPrices={suggestedPrices}
					clientInvoice={clientInvoice}
					guideTransportInvoice={guideTransportInvoice}
					employeeInvoice={employeeInvoice}
				/>
			)}
			{
				showFormCosts && (
					<FormEditCostComponent
						currentDoc={currentDoc}
						showFormCosts={showFormCosts}
						productsOpt={productsOpt}
						reloadDocument={reloadDocument}
						logged={logged}
						clickInsertRef={clickInsertRef}
						currentPricesByProduct={currentPricesByProduct}
						valuePrice={valuePublicCost}
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
	clientsOpt,
	employessOpt,
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
	activateCreateProducts,
	clientRequired,
	activateStock,
	negativesQty,
	getPricesByProduct,
	priceChange,
	setValuePublicCost,
	setPublicCost,
	publicCost,
	currentPricesByProduct,
	suggestedPrices,
	clientInvoice,
	guideTransportInvoice,
	employeeInvoice
}) {
	const [form] = Form.useForm();
	const { Option } = Select;
	const dayjs = useDayjs(); 

	const [formValues, handleInputChange, setValues, formReset] = useForm({
		fecha_registro: "",
		cliente: "",
		empleado_id: "",
		tipo_documento: "",
		detalle_entrada: "",
		codigo_barras: "",
		codigo_producto: "",
		nombre_producto: "",
		cantidad: 1,
		// costo_unitario: 0,
		costo_publico: 0,
		empresa_id: "",
		usuario_id: "",
	});

	const [sendInProcess, setSendInProcess] = useState(false);
	const [registerDate, setRegisterDate] = useState(null);
	const [expireDate, setExpireDate] = useState(null)
	const [currentClient, setCurrentClient] = useState(null);
	const [currentEmployee, setCurrentEmployee] = useState(null);
	const [currentProduct, setCurrentProduct] = useState(null);
	const [productVarios, setProductVarios] = useState(false);
	const [priceProductVarios, setPriceProductVarios] = useState(null);
	const [qty, setQty] = useState(1);
	const nameProductRef = useRef(null);
	const [hideForm, setHideForm] = useState(false);

	// const [unitCost, setUnitCost] = useState(0);
	const [productNewCreate, setProductNewCreate] = useState({
		barcode: "",
		product: "",
	});
	const [currentSuggestedPrices, setCurrentSuggestedPrices] = useState([]);
	const [isBalanza, setIsBalanza] = useState(0);
	const [pesoBalanza, setPesoBalanza] = useState(0);

	const [showModalCreateProduct, setShowModalCreateProduct] = useState(false)

	/** Refs Focus inputs */
	const employeeRef = useRef(null);
	// const productCodeRef = useRef(null);
	const productIdRef = useRef(null);
	const quantityRef = useRef(null);
	const publicCostRef = useRef(null);
	const priceVariosRef = useRef(null);
	const facturarRef = useRef(null);

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

	const setInititalData = () => {
		form.setFieldsValue({
			cliente: currentDoc?.cliente_id,
			empleado: currentDoc?.empleado_id,
			tipo_documento: currentDoc?.tipo_documento_id == 2 ? 'e' : currentDoc?.tipo_documento_id == 6 ? 's' : 'r',
			detalle_entrada: currentDoc?.detalle_entrada,
		});

		setCurrentClient(currentDoc?.cliente_id);
		setCurrentEmployee(currentDoc?.empleado_id);
		setCurrentTypeD(currentDoc?.tipo_documento_id);
		setExpireDate(currentDoc?.fecha_vencimiento);
		setPesoBalanza(0);
		setIsBalanza(0);
	}

	useEffect(() => {
		if (currentProduct) {
			loadProductByProductId(currentProduct)
				.then((prod) => {
					setCurrentIvaProduct(prod.impuesto);
					setIsBalanza(prod.balanza || 0);
					if(socket) socket.emit("gramera", prod.balanza);
					if (prod.varios == 1) {
						setProductVarios(true);
					} else {
						setProductVarios(false);
						setPriceProductVarios(null);
					}
				})
		}
	}, [currentProduct])

	useEffect(() => {
		if(isBalanza > 0) {
			createWebSocketConnection();
			facturarRef?.current?.select();
		}
	}, [isBalanza])

	useEffect(() => {
		if (productVarios) {
			setTimeout(() => {
				priceVariosRef.current.focus();
			}, 200);
		}
	}, [productVarios])

	useEffect(() => {
		setInititalData();

	}, [currentDoc])

	const createWebSocketConnection = async () => {
		
		if(socket)
		{
			socket.on("gramera", (data) => {
				setPesoBalanza(data);
			});
		
			return socket;
		}
	
		return null;
	};

	const handleKeyEnter = async (e) => {
		if (e.key === 'Enter') {
			setFormUpdateActive(false);
			setValuePublicCost(publicCost)
			const { stock_min, stock_max, cantidad } = await loadProductByProductId(currentProduct);

			if (!negativesQty) {
				const currentProductQty = parseInt(cantidad) - parseInt(qty);
				if (currentProductQty < 0) {
					toast.warning("No puedes añadir este producto debido a que no se posee la cantidad necesaria.");
					return;
				}
			}

			if (activateStock) {
				if (parseFloat(cantidad) - parseFloat(qty) <= parseFloat(stock_min)) {
					const isConfirm = confirm("Se ha igualado o sobrepasado el stock mínimo para este producto, ¿Seguro deseas continuar?");
					if (!isConfirm) {
						return false;
					}
				}
			}

			e.preventDefault();
			await onSubmit();
		}
	}

	const setPricesSuggestedOptions = async (val) => {
		if(!priceChange && Number(publicCost) != Number(val)) {
			alert('No está habilitada la opción de cambio de precios.');
			return;
		}

		setPublicCost(val);
		setSendInProcess(true);
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
		const publicCostValue = find.costo_publico
		if (find) {
			form.setFieldsValue({
				detalle_entrada: formValues.detalle_entrada,
				codigo_barras: find.codigo_barras,
				codigo_producto: find.producto_id,
				nombre_producto: find.producto_id,
				cantidad: 1,
				costo_publico: publicCostValue
			});
			setValues({
				detalle_entrada: formValues.detalle_entrada,
				codigo_barras: find.codigo_barras,
				codigo_producto: find.producto_id,
				nombre_producto: find.producto_id,
				cantidad: 1,
				costo_publico: publicCostValue
			});
			setCurrentProduct(find.producto_id);
			setPublicCost(publicCostValue);

			setTimeout(() => {
				quantityRef.current.focus();
			}, 200);

			setProductNewCreate({
				barcode: "",
				product: "",
			});
		}
	}

	const handleSetTypeDocument = (e) => {
		if (e.key === 'f') {
			setCurrentTypeD(10);
		}

		else if (e.key === 'c') {
			setCurrentTypeD(4);
		}

		else if (e.key === 'r') {
			setCurrentTypeD(9);
		}

		else if (e.key === 'Enter') {
			if (e.target.value == "") setCurrentTypeD(10);
			employeeRef.current.focus();
			return;
		}

		else {
			setCurrentTypeD(null);
			toast.warn('Tipo de documento inválido.');
		}
	}

	const setProductBarcode = async (e) => {

		const keysValues = ['Enter', 'Backspace'];
		if (!keysValues.includes(e.key)) {
			return;
		}

		// const data = e.target.value;
		// const find = productsOpt.find(item => item.codigo_barras == data);

		if (e.key === 'Enter') {
			// const codigoBarras = formValues.codigo_barras.trim();
			const codigoBarras = e.target.value.trim();

			if (codigoBarras === "") {
				// productCodeRef.current.focus();
				nameProductRef.current.focus();
				return;
			}

			const find = await loadProductByCodeBar(codigoBarras)

			if (!find && activateCreateProducts) {
				setProductNewCreate({ barcode: codigoBarras, product: "" });
				form.setFieldsValue({
					codigo_barras: "",
					codigo_producto: "",
					nombre_producto: "",
					cantidad: 1,
					costo_publico: 0
				});
				toast.warning('Producto no encontrado con este código de barras.');
				setShowModalCreateProduct(val => !val);
				return;
			}

			form.setFieldsValue({
				detalle_entrada: formValues.detalle_entrada,
				codigo_barras: find.codigo_barras,
				codigo_producto: find.producto_id,
				nombre_producto: find.producto_id,
				costo_publico: find.costo_publico
			});

			setValues({
				detalle_entrada: formValues.detalle_entrada,
				codigo_barras: find.codigo_barras,
				codigo_producto: find.producto_id,
				nombre_producto: find.producto_id,
				costo_publico: find.costo_publico
			});

			setQty(1);
			setCurrentProduct(find.producto_id);
			setPublicCost(find.costo_publico);
			// }
			setTimeout(() => {
				quantityRef?.current.focus();
				quantityRef?.current.select();
			}, 200);
		} else if (e.key == 'Backspace') {
			form.setFieldsValue({
				codigo_barras: "",
				codigo_producto: "",
				nombre_producto: null,
				cantidad: 1,
				costo_unitario: 0,
				costo_publico: 0
			});

			setValues({
				detalle_entrada: "",
				codigo_barras: "",
				codigo_producto: "",
				nombre_producto: null,
				costo_publico: 0
			});

			setCurrentProduct(null);
			setPublicCost(0);
		}
	}

	const setProductCode = async (e) => {
		const data = e.target.value;

		if (e.key === 'Enter') {
			if (data == "") {
				// nameProductRef.current.focus();
				// nameProductRef.current.focus();
				if (barcodeActive) {
					barcodeRef.current.focus();
					return;
				} else {
					nameProductRef.current.focus();
				}
				return;
			}

			if (data == 999999 && activateCreateProducts) {
				setShowModalCreateProduct(val => !val);
				return;
			}

			const find = await loadProductByProductId(data)

			getPricesByProduct(find.producto_id);
			if (find) {
				const publicCostValue = find.costo_publico;
				if (formValues.nombre_producto != find.producto_id) {
					form.setFieldsValue({
						detalle_entrada: formValues.detalle_entrada,
						codigo_barras: find.codigo_barras,
						codigo_producto: find.producto_id,
						nombre_producto: find.producto_id,
						cantidad: 1,
						costo_publico: publicCostValue
					});
					setValues({
						detalle_entrada: formValues.detalle_entrada,
						codigo_barras: find.codigo_barras,
						codigo_producto: find.producto_id,
						nombre_producto: find.producto_id,
						cantidad: 1,
						costo_publico: publicCostValue
					});
					setCurrentProduct(find.producto_id);
					setPublicCost(publicCostValue);
					setQty(1);
				}
				setTimeout(() => {
					quantityRef.current.focus();
					quantityRef.current.select();
				}, 200);
			} else {
				form.setFieldsValue({
					codigo_barras: "",
					codigo_producto: "",
					nombre_producto: "",
					cantidad: 1,
					costo_publico: 0
				});
				setValues({
					detalle_entrada: "",
					codigo_barras: "",
					codigo_producto: "",
					nombre_producto: null,
					costo_publico: 0
				});
				toast.warning('Producto no encontrado con este codigo.');
				if (activateCreateProducts) {
					setShowModalCreateProduct(val => !val);
					return;
				}
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
			setPublicCost(0);
		}
	}

	const setProductSelect = async (value) => {
		if (value == "") {
			productCodeRef.current.focus();
			return;
		}

		setCurrentProduct(value);
		getPricesByProduct(value);

		const find = await loadProductByProductId(value);
		const publicCostValue = find.costo_publico;
		form.setFieldsValue({
			codigo_barras: find.codigo_barras,
			codigo_producto: find.producto_id,
			nombre_producto: find.producto_id,
			cantidad: 1,
			costo_publico: publicCostValue
		});
		setValues({
			codigo_barras: find.codigo_barras,
			codigo_producto: find.producto_id,
			nombre_producto: find.producto_id,
			cantidad: 1,
			costo_publico: publicCostValue
		});

		setQty(1);
		setPublicCost(publicCostValue);
		setTimeout(() => {
			quantityRef.current.focus();
			quantityRef.current.select();
		}, 200);

		//Si existe un producto seleccionado y todo sale bien, no hay porque abrir el modal de crear productos
		setShowModalCreateProduct(false);
		setProductNewCreate({ barcode: "", product: "" });
	}

	const onChangeClient = async (val) => {
		const data = {
			...currentDoc,
			cliente_id: val,
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

	const onChangeEmployee = async (val) => {
		const data = {
			...currentDoc,
			empleado_id: val,
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
		}

		try {
			await updateFechaRegistro(data);
			reloadDocument(currentDoc?.documento_id, data);
			setShowUpdateForm(false);
			toast.success('Documento modificado correctamente');
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar actualizar el documento');
		}
	}

	const onChangExpireDate = async (val) => {
		const data = {
			...currentDoc,
			fecha_vencimiento: new Date(val).toISOString().replace('T', ' ').slice(0, 23)
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

	const resetAll = () => {

		if (qty == 0) {
			form.setFieldsValue({
				codigo_barras: "",
				codigo_producto: "",
				nombre_producto: "",
				cantidad: 1,
				costo_publico: ""
			});

			setValues({
				detalle_entrada: "",
				codigo_barras: "",
				codigo_producto: "",
				nombre_producto: "",
				cantidad: 1,
				costo_publico: ""
			});

			setCurrentProduct(null);
			setPublicCost(0);
		}

		if (barcodeActive) {
			barcodeRef.current.focus();
		} else {
			productCodeRef.current.focus();
		}
	}

	const onSubmit = async (val = publicCost) => {

		setSendInProcess(true);

		const productById = await loadProductByProductId(currentProduct);
		const { cantidad } = productById;

		if (qty == 0 && isBalanza === 0) {
			// publicCostRef.current.focus();
			// publicCostRef.current.select();
			resetAll();
			return;
		}

		if (!negativesQty) {
			const currentProductQty = parseInt(cantidad) - parseInt(qty);
			if (currentProductQty < 0) {
				toast.warning("No puedes añadir este producto debido a que no se posee la cantidad necesaria.");
				return;
			}
		}

		const publicCostValue = priceProductVarios != null ? priceProductVarios : val;
		const data = {
			...formValues,
			fecha_registro: registerDate,
			fecha_vencimiento: expireDate,
			tipo_documento: currentTypeD,
			cliente_id: currentClient ? currentClient : 1,
			empleado_id: currentEmployee,
			empresa_id: logged?.empresa_id,
			usuario_id: logged?.userID,
			nombre_producto: currentProduct,
			cantidad: qty,
			costo_publico: publicCostValue,
			product: productById,
			currentQty: cantidad
		}

		if(isBalanza > 0) data.cantidad = pesoBalanza;

		if (!validationEntryUpdate(data, clientRequired)) {
			return;
		}

		try {
			// const response = await storeDocumentApi(data);
			// await storeDocumentoDetalleApi(data, currentDoc?.documento_id);
			// await updateProductCantidadApi(data, currentDoc?.documento_id);
			const promisesSubmit = [
				storeDocumentoDetalleApi(data, currentDoc?.documento_id),
				updateProductCantidadApi(data, currentDoc?.documento_id)
			];
			await Promise.all(promisesSubmit);
			if(Number(productById?.costo_publico) != Number(publicCost)) {
				const detail = `Se modificó el precio desde ventas del producto id ${productById.producto_id} llamado ${productById.nombre}`;
				const params = {
					businessID: logged?.empresa_id, 
					detail, 
					userID: logged?.userID, 
					currentValue: publicCost, 
					latestValue: productById.costo_publico, 
					aplicativo: 'Ventas del día',
					accion_auditoria: 2,
					tipo_documento_id: currentDoc?.tipo_documento_id
				}
				saveAuditoriaApi(params);
			}
			
			reloadDocument(currentDoc?.documento_id, currentDoc);
			if (productVarios) {
				setFormUpdateActive(true);
				setShowFormCosts(false);
			} else {
				// if (priceChange) {
				// 	setShowFormCosts(true);
				// 	setFormUpdateActive(false);
				// } else {
				setFormUpdateActive(true);
				setShowFormCosts(false);
				// }
			}
			resetForm();
			setInititalData();

			toast.success('Venta realizada satisfactoriamente.');

			setPriceProductVarios(null);
			setProductVarios(false);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al guardar la venta.');
		} finally {
			setSendInProcess(false);
		}
	}

	const productEnter = async (e) => {
		if (!e.target.value) {
			productCodeRef.current.focus();
			return;
		}

		const find = await loadProductByName(e.target.value.toLowerCase());

		if (!find && activateCreateProducts) {
			setProductNewCreate({ barcode: "", product: e.target.value });
			setShowModalCreateProduct(val => !val);
			return;
		}
	}

	// useEffect(() => {
	// 	if(showModalCreateProduct && currentProduct) {
	// 		setShowModalCreateProduct( false );
	// 		setProductNewCreate({ barcode: "", product: "" });
	// 	}
	// }, [currentProduct])


	const loadProductByCodeBar = async (codeBar) => {
		const data = await getProductByProductoCodeBar(codeBar, logged?.empresa_id);
		return data[0];
	}

	const loadProductByProductId = async (productId) => {
		const data = await getProductByProductoId(productId, logged?.empresa_id);
		return data[0];
	}

	const loadProductByName = async (nombre) => {
		const data = await getProductByName(nombre, logged?.empresa_id);
		return data[0];
	}

	const filterName = async (input, option) => {
		console.log('filtrando', input)

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
	}

	useEffect(() => {
		if (sendInProcess) {
			barcodeRef?.current?.focus();
			setHideForm(true);
		} else {
			setHideForm(false);
			setTimeout(() => {
				if (barcodeActive) {
					barcodeRef?.current?.focus();
					return;
				} else {
					productIdRef?.current?.focus();
					return;
				}
			}, 50);
		}
	}, [sendInProcess])


	const nextInput = (objectRef, e) => {
		if (e.key === 'Enter') {
			if(qty > 1500) {
				quantityRef?.current?.select();
				alert('La cantidad no puede ser mayor a 1500.');
				return;
			}

			if(qty === '' || !qty) {
				quantityRef?.current?.select();
				alert('La cantidad no puede estar vacía.');
				return;
			}

			objectRef?.current?.focus();
			if (!suggestedPrices) objectRef?.current?.select();
		}
	}

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
						onChange={(date, dateString) => onChangeFecha(dateString)}
					/>
					<p style={{ fontSize: '10px' }}>
						{
							dayjs.utc(currentDoc?.fecha_registro)
							.tz(dayjs.tz.guess())
							.format("YYYY-MM-DD HH:mm:ss")
						}
					</p>
				</Form.Item>

				<Form.Item >
					{/* name="fecha_registro" */}
					<DatePicker
						placeholder='Fecha de vencimiento'
						size="middle"
						name='fecha_vencimiento'
						onChange={(date, dateString) => onChangExpireDate(dateString)}
					/>
					<p style={{ fontSize: '10px' }}>{currentDoc?.fecha_vencimiento}</p>
				</Form.Item>
				
				{clientInvoice &&
					<Form.Item name="cliente">
						<Select
							showSearch
							name="cliente"
							size="middle"
							placeholder="Cliente"
							onChange={(val) => onChangeClient(val)}
							style={{ width: 200 }}
							// filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
							filterOption={(input, option) => {
								const regex = new RegExp(input, 'i');
								const { children } = option.props;
								const text = children
									.map((child) => child.props.children)
									.join(' ')
									.replace('-', ' ');

								return regex.test(text);
							}}
							allowClear
						>
							{
								clientsOpt.length > 0 &&
								clientsOpt.map((item, idx) => (
									<Option key={idx} value={item.cliente_id}>
										<span>{item.nombre}</span>
										<span>{' '}</span>
										<span>{item.apellidos}</span>
										<span>{' - '}</span>
										<span>{item?.documento}</span>
									</Option>
								))
							}
						</Select>
					</Form.Item>
				}

				{guideTransportInvoice &&
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
				}

				{employeeInvoice &&
					<Form.Item name="empleado">
						<Select
							showSearch
							name="empleado"
							ref={employeeRef}
							size="middle"
							placeholder="Empleado"
							onChange={(val) => onChangeEmployee(val)}
							style={{ width: 200 }}
							// filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
							filterOption={(input, option) => {
								const regex = new RegExp(input, 'i');
								const { children } = option.props;
								const text = children
									.map((child) => child.props.children)
									.join(' ')
									.replace('-', ' ');

								return regex.test(text);
							}}
							allowClear
						>
							{
								employessOpt.length > 0 &&
								employessOpt.map((item, idx) => (
									<Option key={idx} value={item.empleado_id}>
										<span>{item.nombre}</span>
										<span>{' '}</span>
										<span>{item.apellido}</span>
										<span>{' - '}</span>
										<span>{item?.identificacion}</span>
									</Option>
								))
							}
						</Select>
					</Form.Item>
				}
				{barcodeActive && (
					<Form.Item name="codigo_barras">
						<Input
							type="text"
							name="codigo_barras"
							autoComplete='off'
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
						autoComplete='off'
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

				{(!productVarios && isBalanza === 0) &&
					<Form.Item name="cantidad" label="Cantidad">
						<InputNumber
							name="cantidad"
							ref={quantityRef}
							size="middle"
							min={0}
							onChange={(val) => setQty(val)}
							disabled={sendInProcess}
							onKeyDown={e => nextInput(publicCostRef, e)}
						/>
					</Form.Item>
				}

				{isBalanza > 0 && 
					<Form.Item label="Peso">
						<h3 style={{ color: "red" }}>{ pesoBalanza.toFixed(3) }</h3>
					</Form.Item>
				}

				{productVarios &&
					<Form.Item name="price" label="Precio">
						<InputNumber
							name="price"
							ref={priceVariosRef}
							size="middle"
							min={0}
							disabled={sendInProcess}
							onChange={(val) => setPriceProductVarios(val)}
							onKeyDown={(e) => handleKeyEnter(e)}
						/>
					</Form.Item>
				}

				{(!suggestedPrices && isBalanza === 0) &&
					<Form.Item name="costo_publico" label="Costo público">
						<InputNumber
							name="costo_publico"
							size="middle"
							ref={publicCostRef}
							readOnly={ priceChange ? false : true }
							onChange={e => setPublicCost(e)}
							disabled={hideForm}
							min={0}
							onKeyDown={(e) => handleKeyEnter(e)}
						/>
					</Form.Item>
				}


				{/* <Form.Item name="costo_unitario" label="Costo unitario">
					<InputNumber
						name="costo_unitario"
						size="middle"
						ref={unitCostRef}
						min={0}
						onKeyPress={e => { e.key == 'Enter' && publicCostRef.current.focus(); publicCostRef.current.select(); }}
						onChange={(val) => setUnitCost(val)}
					/>
				</Form.Item> */}

				{isBalanza > 0 && 
					<Form.Item label="Precio">
						<h3 style={{ color: "red" }}>{ Number(pesoBalanza) * Number(publicCost) }</h3>
					</Form.Item>
				}

				{/* {isBalanza > 0 &&
					<Form.Item name="pesoBalanza" label="Peso Balanza">
						<InputNumber
							name="pesoBalanza"
							min={0}
							size="middle"
							onChange={val => setPesoBalanza(val)}
						/>
					</Form.Item>
				} */}


				{isBalanza > 0 &&
					<Form.Item name="facturar" label="Facturar">
						<Input
							name="facturar"
							ref={facturarRef}
							size="middle"
							defaultValue="s" 
							onKeyDown={e => {
								if (e.key === 'Enter' && (e.target.value === 's' || e.target.value === 'S')) {
									onSubmit();
								}
							}}
						/>
					</Form.Item>
				}

				{suggestedPrices &&
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
							disabled={hideForm}
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
				}

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