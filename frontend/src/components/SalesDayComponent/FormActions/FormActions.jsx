import { useState, useEffect, useRef } from 'react';
import { Form, Input, DatePicker, Select, InputNumber } from 'antd';
import { toast } from 'react-toastify';
import {
	storeDocumentApi,
	storeDocumentoDetalleApi,
	updateProductCantidadApi,
	getProductByProductoCodeBar,
	getProductByProductoId,
	getProductByName
} from '../../../api/sales';
import { getClientsApi } from '../../../api/client';
import { getEmployeesApi } from '../../../api/employee';
import { validationEntry } from '../../../validations/sales';
import { useForm } from '../../../hooks/useForm';
import { useActivations } from '../../../hooks/useActivations';

import CreateProduct from '../CreateProduct';
import CreateClient from '../CreateClient';
import NameProductSelect from '../../Commons/NameProductSelect/NameProductSelect';

import "./FormActions.scss";
import './FormActionsInputs.scss'
import { saveAuditoriaApi } from '../../../api/inventory';
import { socket } from '../../../hooks/useSocket';

function FormActions({
	logged,
	setShowCreateForm,
	currentTypeD,
	setCurrentTypeD,
	recientDocument,
	showCreateForm,
	setShowUpdateForm,
	setFormUpdateActive,
	setShowFormCosts,
	showModalSearchDocument,
	getPricesByProduct,
	setValuePublicCost,
	currentPricesByProduct
}) {

	const clientRef = useRef(null);

	const [clientsOpt, setClientsOpt] = useState([]);
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

	useEffect(() => {
		if (showCreateForm) {
			getListClients(logged?.empresa_id);
			getListEmployees(logged?.empresa_id);

			// setTimeout(() => {
			// 	clientRef?.current?.focus();
			// }, 50);
		};
	}, [logged, showCreateForm])

	useEffect(() => {
		if (!showModalSearchDocument) {
			//getProductsByBusiness(logged?.empresa_id);
		}
	}, [showModalSearchDocument])



	return (
		<>
			<h3>Nueva venta</h3>
			<CreateForm
				clientsOpt={clientsOpt}
				setClientsOpt={setClientsOpt}
				employessOpt={employessOpt}
				productsOpt={productsOpt}
				currentTypeD={currentTypeD}
				setCurrentTypeD={setCurrentTypeD}
				validationEntry={validationEntry}
				logged={logged}
				recientDocument={recientDocument}
				setShowCreateForm={setShowCreateForm}
				updateProductCantidadApi={updateProductCantidadApi}
				setProductsOpt={setProductsOpt}
				clientRef={clientRef}
				setCurrentIvaProduct={setCurrentIvaProduct}
				setShowUpdateForm={setShowUpdateForm}
				setFormUpdateActive={setFormUpdateActive}
				setShowFormCosts={setShowFormCosts}
				getClientsApi={getClientsApi}
				getPricesByProduct={getPricesByProduct}
				setValuePublicCost={setValuePublicCost}
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
	clientsOpt,
	setClientsOpt,
	employessOpt,
	setProductsOpt,
	currentTypeD,
	setCurrentTypeD,
	validationEntry,
	logged,
	recientDocument,
	setShowCreateForm,
	updateProductCantidadApi,
	clientRef,
	setCurrentIvaProduct,
	setShowUpdateForm,
	setFormUpdateActive,
	setShowFormCosts,
	getClientsApi,
	getPricesByProduct,
	setValuePublicCost,
	currentPricesByProduct
}) {
	const [form] = Form.useForm();
	const { Option } = Select;

	const [formValues, handleInputChange, setValues, formReset] = useForm({
		fecha_registro: "",
		fecha_vencimiento: "",
		cliente: "",
		empleado: "",
		tipo_documento: "",
		detalle_entrada: "",
		codigo_barras: "",
		codigo_producto: "",
		nombre_producto: "",
		cantidad: 0,
		// costo_unitario: 0,
		costo_publico: 0,
		empresa_id: "",
		usuario_id: "",
	});

	const { barcodeActive, activateCreateProducts, clientRequired, activateStock, priceChange, negativesQty, suggestedPrices, clientInvoice, employeeInvoice, guideTransportInvoice } = useActivations(logged);

	/** Refs Focus inputs */
	const employeeRef = useRef(null);
	const barcodeRef = useRef(null);
	const nameProductRef = useRef(null);

	const documentTypeRef = useRef(null);
	const productCodeRef = useRef(null);
	const productIdRef = useRef(null);
	const quantityRef = useRef(null);
	const publicCostRef = useRef(null);
	const priceVariosRef = useRef(null);
	const facturarRef = useRef(null);

	const [clientNotExist, setClientNotExist] = useState("");

	const [sendInProcess, setSendInProcess] = useState(false);
	const [registerDate, setRegisterDate] = useState(null);
	const [expireDate, setExpireDate] = useState(null);
	const [currentClient, setCurrentClient] = useState(null);
	const [currentEmployee, setCurrentEmployee] = useState(null);
	const [currentProduct, setCurrentProduct] = useState(null);
	const [productVarios, setProductVarios] = useState(false);
	const [priceProductVarios, setPriceProductVarios] = useState(null);
	const [qty, setQty] = useState(1);
	const [publicCost, setPublicCost] = useState(0);
	const [productNewCreate, setProductNewCreate] = useState({
		barcode: "",
		product: "",
	});
	const [currentSuggestedPrices, setCurrentSuggestedPrices] = useState([]);
	const [isBalanza, setIsBalanza] = useState(0);
	const [pesoBalanza, setPesoBalanza] = useState(0);

	const [showModalCreateProduct, setShowModalCreateProduct] = useState(false);
	const [showModalCreateClient, setShowModalCreateClient] = useState(false);

	useEffect(() => {
		if (currentProduct) {
			loadProductByProductId(currentProduct)
				.then(prod => {
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
		setTimeout(() => {
			const getFocusRef = () => {
				if (clientRef?.current) return clientRef;
				if (documentTypeRef?.current) return documentTypeRef;
				if (employeeRef?.current) return employeeRef;
				if (barcodeRef?.current) return barcodeRef;
				return nameProductRef;
			};
	
			const focusRef = getFocusRef();
			focusRef?.current?.focus();
		}, 50);
	}, [logged]);
	

	useEffect(() => {	
		if (productVarios) {
			setTimeout(() => {
				priceVariosRef.current.focus();
			}, 200);
		}
	}, [productVarios])


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
			onSubmit();
		}
	}

	const nextRefClient = () => {
		const getFocusRef = () => {
			if (documentTypeRef?.current) return documentTypeRef;
			if (employeeRef?.current) return employeeRef;
			if (barcodeRef?.current) return barcodeRef;
			return nameProductRef;
		};

		const focusRef = getFocusRef();
		focusRef?.current?.focus();
	}

	const nextRefDocumentType = () => {
		const getFocusRef = () => {
			if (employeeRef?.current) return employeeRef;
			if (barcodeRef?.current) return barcodeRef;
			return nameProductRef;
		};

		const focusRef = getFocusRef();
		focusRef?.current?.focus();
	}

	const nextRefEmployee = () => {
		const getFocusRef = () => {
			if (barcodeRef?.current) return barcodeRef;
			return nameProductRef;
		};

		const focusRef = getFocusRef();
		focusRef?.current?.focus();
	}

	const setPricesSuggestedOptions = async (val) => {
		if(!priceChange && Number(publicCost) != Number(val)) {
			alert('No está habilitada la opción de cambio de precios.');
			return;
		}

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
				costo_publico: find.costo_publico
			});
			setValues({
				detalle_entrada: formValues.detalle_entrada,
				codigo_barras: find.codigo_barras,
				codigo_producto: find.producto_id,
				nombre_producto: find.producto_id,
				cantidad: 1,
				costo_publico: find.costo_publico
			});
			setCurrentProduct(find.producto_id);
			setPublicCost(find.costo_publico);

			setTimeout(() => {
				quantityRef.current.focus();
			}, 200);

			setProductNewCreate({
				barcode: "",
				product: "",
			});
		}
	}

	const getClientsAfterCreate = async (businessID, clientID) => {
		const response = await getClientsApi(businessID);
		setClientsOpt(response);
		const client = response.find(item => item.cliente_id == clientID);

		form.setFieldsValue({
			cliente: client.nombre,
		});
		setValues({
			cliente: clientID,
		});
		setCurrentClient(clientID);

		setTimeout(() => {
			documentTypeRef.current.focus();
		}, 300);

		setClientNotExist("");
	}

	const handleSetTypeDocument = (e) => {

		if (e.key.toLowerCase() === 'f') {
			setCurrentTypeD(10);
		}

		else if (e.key.toLowerCase() === 'c') {
			setCurrentTypeD(4);
		}

		else if (e.key.toLowerCase() === 'r') {
			setCurrentTypeD(9);
		}

		else if (e.key === 'Enter') {
			if (e.target.value == "") setCurrentTypeD(10);
			// employeeRef.current.focus();
			nextRefDocumentType();
			return;
		}

		else {
			setCurrentTypeD(null);
			toast.warn('Tipo de documento inválido.');
		}
	}

	const setProductBarcode = (e) => {

		if (e.key == 'Enter') {

			const codigoBarras = e.target.value.trim();
			handleInputChange({ target: e.target })

			if (codigoBarras === "") {
				// productCodeRef.current.focus();
				nameProductRef.current.focus();
				return;
			}

			loadDataBarCode(codigoBarras)

		} else if (e.key == 'Backspace') {
			deleteBackspace()
		}

		return true;

	}

	const loadDataBarCode = async (codigoBarras) => {

		const find = await loadProductByCodeBar(codigoBarras);

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

	}

	const deleteBackspace = () => {

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

	const setProductCode = async (e) => {
		const data = e.target.value;

		if (e.key === 'Enter') {
			if (data == "") {
				// nameProductRef.current.focus();
				if (barcodeActive) {
					barcodeRef.current.focus();
					return;
				} else {
					nameProductRef.current.focus();
				}
				return;
				//}
			}

			if (data == 999999 && activateCreateProducts) {
				setShowModalCreateProduct(val => !val);
				return;
			}

			const find = await loadProductByProductId(data);
			getPricesByProduct(find.producto_id);
			if (find) {
				if (formValues.nombre_producto != find.producto_id) {
					form.setFieldsValue({
						detalle_entrada: formValues.detalle_entrada,
						codigo_barras: find.codigo_barras,
						codigo_producto: find.producto_id,
						nombre_producto: find.producto_id,
						cantidad: 1,
						costo_publico: find.costo_publico
					});
					setValues({
						detalle_entrada: formValues.detalle_entrada,
						codigo_barras: find.codigo_barras,
						codigo_producto: find.producto_id,
						nombre_producto: find.producto_id,
						cantidad: 1,
						costo_publico: find.costo_publico
					});
					setCurrentProduct(find.producto_id);
					setPublicCost(find.costo_publico);
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
		if (value == "" || !value) {
			productCodeRef.current.focus();
			return;
		}

		setCurrentProduct(value);
		getPricesByProduct(value);

		const find = await loadProductByProductId(value);
		form.setFieldsValue({
			codigo_barras: find.codigo_barras,
			codigo_producto: find.producto_id,
			nombre_producto: find.producto_id,
			cantidad: 1,
			costo_publico: find.costo_publico
		});
		setValues({
			codigo_barras: find.codigo_barras,
			codigo_producto: find.producto_id,
			nombre_producto: find.producto_id,
			cantidad: 1,
			costo_publico: find.costo_publico
		});

		setQty(1);
		// setUnitCost(find.costo);
		setPublicCost(find.costo_publico);
		setTimeout(() => {
			quantityRef?.current?.focus();
			quantityRef?.current?.select();
		}, 200);

		//Si existe un producto seleccionado y todo sale bien, no hay porque abrir el modal de crear productos
		setShowModalCreateProduct(false);
		setProductNewCreate({ barcode: "", product: "" });
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

	const setNewClient = (e) => {
		const text = clientRef?.current?.value;

		if (e.key == "Enter") {
			if (text == undefined && clientRequired) {
				alert('No has seleccionado ningún cliente y el mismo es obligatorio.');
				clientRef?.current?.focus();
				return;
			}
			// documentTypeRef?.current?.focus();
			nextRefClient();
		}

		if (e.key == 'ArrowRight') {
			setClientNotExist(text);
			setShowModalCreateClient(!showModalCreateClient);
		}
	}

	const onSubmit = async (val = publicCost) => {
		setSendInProcess(true);
		const productById = await loadProductByProductId(currentProduct);
		const { cantidad } = productById;

		if (qty == 0 && isBalanza === 0) {
			resetAll();
			setSendInProcess(false);
			return;
		}

		if (!negativesQty) {
			const currentProductQty = parseInt(cantidad) - parseInt(qty);
			if (currentProductQty < 0) {
				toast.warning("No puedes añadir este producto debido a que no se posee la cantidad necesaria.");
				setSendInProcess(false);
				return;
			}
		}

		let data = {
			...formValues,
			fecha_registro: registerDate ? registerDate : null,
			fecha_vencimiento: expireDate ? expireDate : "",
			tipo_documento: currentTypeD,
			cliente_id: currentClient ? currentClient : 1,
			empleado_id: currentEmployee,
			empresa_id: logged?.empresa_id,
			usuario_id: logged?.userID,
			nombre_producto: currentProduct,
			cantidad: qty,
			costo_publico: priceProductVarios != null ? priceProductVarios : val,
			product: productById,
			currentQty: cantidad,
		}

		if(isBalanza > 0) data.cantidad = pesoBalanza;

		setValuePublicCost(data.costo_publico)
		if (!validationEntry(data, clientRequired)) {
			return;
		}

		try {
			const response = await storeDocumentApi(data);
			if (productVarios) {
				setFormUpdateActive(true);
				setShowFormCosts(false);
				setShowUpdateForm(true);
			} else {
				// if (priceChange) {
				// 	setShowFormCosts(true);
				// 	setFormUpdateActive(false);
				// 	setShowUpdateForm(true);
				// } else {
					setFormUpdateActive(true);
					setShowUpdateForm(true);
					setShowFormCosts(false);
				// }
			}

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
					tipo_documento_id: null
				}
				saveAuditoriaApi(params);
			}

			// await updateProductFromInventoryApi(productUpdate, data);
			recientDocument(response.documento_id);
			setShowCreateForm(false);
			setPriceProductVarios(null);
			setProductVarios(false);
			setSendInProcess(false);
			// setShowUpdateForm(true);
			resetForm();

			const promisesSubmit = [
				storeDocumentoDetalleApi(data, response.documento_id),
				updateProductCantidadApi(data, response.documento_id, negativesQty)
			];

			await Promise.all(promisesSubmit);
			
			toast.success('Venta realizada satisfactoriamente.');
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al guardar la venta.');
			setSendInProcess(false);
		}
	}

	const employeeClick = (e) => {
		if (!e.target.value) {
			nextRefEmployee();
		}
	}

	const productEnter = async (e) => {
		if (!e.target.value) {
			productCodeRef.current.focus();
			return;
		}

		const find = await loadProductByName(e.target.value.toLowerCase())

		if (!find && activateCreateProducts) {
			setProductNewCreate({ barcode: "", product: e.target.value });
			setShowModalCreateProduct(val => !val);
			return;
		}
	}

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
			if(!suggestedPrices) objectRef?.current?.select();
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
				<Form.Item name="fecha">
					<DatePicker
						placeholder='Fecha'
						size="middle"
						onChange={(date, dateString) => setRegisterDate(date)}
					/>
				</Form.Item>

				<Form.Item name="fecha_vencimiento">
					<DatePicker
						placeholder='Fecha de vencimiento'
						size="middle"
						onChange={(date, dateString) => setExpireDate(dateString)}
						disabled={true}
					/>
				</Form.Item>

				{clientInvoice &&
					<Form.Item name="cliente">
						<Select
							showSearch
							name="cliente"
							size="middle"
							ref={clientRef}
							placeholder="Cliente"
							onKeyUp={setNewClient}
							onChange={(val) => { setCurrentClient(val); nextRefClient(); }}
							defaultActiveFirstOption={false}
							style={{ width: 200 }}
							value={currentClient}
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
							ref={documentTypeRef}
							onKeyPress={e => handleSetTypeDocument(e)}
							autoComplete="off"
							onChange={handleInputChange}
							maxLength={1}
							size="middle"
							placeholder="Tipo documento"
						/>
					</Form.Item>
				}
				{employeeInvoice &&
					<Form.Item name="employee">
						<Select
							showSearch
							name="empleado"
							size="middle"
							ref={employeeRef}
							placeholder="Empleado"
							onChange={(val) => { setCurrentEmployee(val); }}
							onInputKeyDown={(e) => e.key == 'Enter' && employeeClick(e)}
							defaultActiveFirstOption={false}
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
					<Form.Item name="codigo_producto">
						<Input
							type="text"
							className="input-form"
							name="codigo_barras"
							autoComplete='off'
							ref={barcodeRef}
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
						autoComplete='off'
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
							onChange={(val) => setQty(val) }
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
							onChange={(val) => setPriceProductVarios(val)}
							onKeyDown={(e) => handleKeyEnter(e)}
						/>
					</Form.Item>
				}

				{(!suggestedPrices && isBalanza === 0) &&
					<Form.Item name="costo_publico" label="Costo público">
						<InputNumber
							name="costo_publico"
							ref={publicCostRef}
							min={0}
							size="middle"
							disabled={sendInProcess}
							readOnly={ priceChange ? false : true }
							onChange={val => setPublicCost(val)}
							onKeyDown={(e) => handleKeyEnter(e)}
						/>
					</Form.Item>
				}

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
							style={{ width: 200 }}
							disabled={sendInProcess}
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
				productNewCreate={productNewCreate}
			/>

			<CreateClient
				showModal={showModalCreateClient}
				setShowModal={setShowModalCreateClient}
				loggedUser={logged}
				index={getClientsAfterCreate}
				clientNotExist={clientNotExist}
			/>
		</>
	)
}

export default FormActions