import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useDayjs from '../../hooks/useDays';

import {
	getDocumentsTypeApi,
	// getDocumentsApi,
	getProductsByDocumentID,
	getDocumentOptionsApi,
	updateDocumentoApi
} from '../../api/document';

import { getDocumentsApi, getPreciosByProductoID, getProductsByBusinessApi, getProductByProductoId } from '../../api/sales';
import { getUsersApi, getProporcionApi } from '../../api/user';
import useAuth from '../../hooks/useAuth';

import AdminLayout from "../../layouts/AdminLayout";
import BtnActionsComponent from '../../components/SalesDayComponent/BtnActions';
import FormActionComponent from '../../components/SalesDayComponent/FormActions';
import FormUpdateActionComponent from '../../components/SalesDayComponent/FormUpdateActions';
import TableActionsComponent from '../../components/SalesDayComponent/TableActions';
import { useActivations } from '../../hooks/useActivations';

import { getByDocumentoIdApi } from '../../api/nota';

function ventasDia() {

	const logged = useAuth();
	const Navigate = useNavigate();
	const dayjs = useDayjs(); 

	const { editInvoice } = useActivations(logged);
	const [allDocuments, setAllDocuments] = useState([]);

	const [documentsTypes, setDocumentsTypes] = useState([]);
	const [optionsDoc, setOptionsDoc] = useState([]);
	const [currentDoc, setCurrentDoc] = useState(null);
	const [currentProducts, setCurrentProducts] = useState([]);
	const [currentPricesByProduct, setCurrentPricesByProduct] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const [currentTypeD, setCurrentTypeD] = useState(null);
	const [currentDocumentID, setCurrentDocumentID] = useState(null);
	const [showModalPrintSale, setShowModalPrintSale] = useState(false);
	const [showModalSearchDocument, setShowModalSearchDocument] = useState(false);
	const [showModalBoxSquare, setShowModalBoxSquare] = useState(false);
	const [showModalEditProduct, setShowModalEditProduct] = useState(false);
	const [productsOpt, setProductsOpt] = useState([]);
	const [valuePublicCost, setValuePublicCost] = useState(0);
	const [loadCurrentDoc, setLoadCurrentDoc] = useState(false);
	const [dataProporcion, setDataProporcion] = useState(null);

	/** Refs tables states */
	const [qtyReferenceTable, setQtyReferenceTable] = useState(false);
	const [unitCostReferenceTable, setUnitCostReferenceTable] = useState(false);
	const [deleteReferenceTable, setDeleteReferenceTable] = useState(false);

	/** show forms */
	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showUpdateForm, setShowUpdateForm] = useState(false);
	const [formUpdateActive, setFormUpdateActive] = useState(false);
	const [showFormCosts, setShowFormCosts] = useState(false);

	const onDeleteButtonFocus = () => {
		setDeleteReferenceTable(!deleteReferenceTable);
	}

	const getDocumentsType = async () => {
		try {
			const response = await getDocumentsTypeApi();
			setDocumentsTypes(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los tipos de documentos.');
		}
	}

	const getProporcion = async (businessID) => {
		try {
			const response = await getProporcionApi(businessID);
			setDataProporcion(response[0]);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer la proporcion.');
		}
	}

	const getPricesByProduct = async (productID) => {
		try {
			const response = await getPreciosByProductoID(productID);
			setCurrentPricesByProduct(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los tipos de documentos.');
		}
	}

	const getUsers = async (businessID) => {
		try {
			const response = await getUsersApi(businessID);
			setAllUsers(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los usuarios.');
		}
	}

	const getDocumentOptions = async (userID) => {
		try {
			const response = await getDocumentOptionsApi(userID);
			setOptionsDoc(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las opciones de documento por ID de usuario.');
		}
	}

	const getDocuments = async () => {
		try {
			return await getDocumentsApi(logged?.empresa_id, logged?.userID);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los documentos.');
		}
	}

	const getAllDocuments = async () => {
		try {
			const response = await getDocumentsApi(logged?.empresa_id, logged?.userID);
			setAllDocuments(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los documentos.');
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


	const nextDocument = async () => {
		if(loadCurrentDoc || showModalPrintSale) {
			return
		}
		let response = [];
		if(allDocuments.length == 0) {
			response = await getDocuments();
		} else {
			response = allDocuments;
		}
		// const response = await getDocuments();
		const len = response.length - 1;

		if (currentDoc) {
			if (currentDoc?.key == len || currentDoc?.key > len) {
				toast.warn('No hay mas documentos');
				return;
			}

			const data = {
				key: currentDoc?.key + 1,
				content: response[currentDoc?.key + 1]
			}
			getProductsByDocument(response[currentDoc?.key + 1].documento_id);
			setCurrentDoc(data);

		} else {
			const data = {
				key: 0,
				content: response[0]
			}
			setCurrentDoc(data);
			getProductsByDocument(response[0].documento_id);
			setCurrentDocumentID(response[0].documento_id);
		}
		
	}

	const previousDocument = async () => {
		if(loadCurrentDoc || showModalPrintSale) {
			return
		}
		let response = [];
		if(allDocuments.length == 0) {
			response = await getDocuments();
		} else {
			response = allDocuments;
		}
		// const response = await getDocuments();
		const len = response.length - 1;

		if (currentDoc && currentProducts.length > 0) {
			if (currentDoc?.key == 0) {
				toast.warn('No hay mas documentos');
				return;
			}

			const data = {
				key: currentDoc?.key - 1,
				content: response[currentDoc?.key - 1]
			}
			getProductsByDocument(response[currentDoc?.key - 1].documento_id);
			setCurrentDoc(data);

		} else {
			const data = {
				key: len,
				content: response[len]
			}
			setCurrentDoc(data);
			getProductsByDocument(response[len].documento_id);
			setCurrentDocumentID(response[len].documento_id);
		}
	}

	const firstDocument = async () => {
		let response = [];
		if(allDocuments.length == 0) {
			response = await getDocuments();
		} else {
			response = allDocuments;
		}

		const data = {
			key: 0,
			content: response[0]
		}

		getProductsByDocument(response[0].documento_id);
		setCurrentDocumentID(response[0].documento_id);
		setCurrentDoc(data);

	}

	const lastDocument = async () => {
		let response = [];
		if(allDocuments.length == 0) {
			response = await getDocuments();
		} else {
			response = allDocuments;
		}
		
		const len = response.length;

		const data = {
			key: len,
			content: response[len - 1]
		}
		getProductsByDocument(response[len - 1].documento_id);
		setCurrentDocumentID(response[len - 1].documento_id);
		setCurrentDoc(data);
	}

	// const reloadDocument = async (documentID, document) => {
	// 	const response = await getDocuments();
	// 	// console.log(document)
	// 	// const document = getProductsByDocumentID(documentID);
	// 	const find = response.findIndex(item => item.documento_id == documentID);

	// 	const data = {
	// 		key: find != -1 ? find : response.length - 1,
	// 		content: document
	// 	}
	// 	setCurrentDoc(data);
	// }

	const loadDocumentFromUpdateAction = async (documentID, document) => {
		// const response = await getDocuments();
		const response = allDocuments;
		const find = response.findIndex(item => item.documento_id == documentID);

		const data = {
			key: find != -1 ? find : response.length - 1,
			content: document
		}

		await defineTotalValues(data);

		setCurrentDoc(data);
		// setAllDocuments(response);
		getProductsByDocument(documentID);
	}

	const reloadDocument = async (documentID, document, deleteLastProduct = false) => {
		let response = [];
		// await documentByDocumentID(documentID);
		// if(document && deleteLastProduct) {
		// 	const idx = allDocuments.findIndex(item => item.documento_id === documentID);
		// 	response = allDocuments.splice(1, idx);
		// } else {
			response = await getDocuments();
		// }

		// const all = document.length > 0 ? allDocuments : allDocuments.pop();
		const len = response.length > 0 ? response.length - 1 : 0;
		// const document = getProductsByDocumentID(documentID);
	
		const data = {
			// key: find != -1 ? find : response.length - 1,
			key: response.length > 0 && !deleteLastProduct ? response.findIndex(el => el.documento_id == documentID) : len,
			content: response.length > 0 && !deleteLastProduct ? document : response[len]
		}

		if(response.length > 0) {
			setCurrentDoc(data);
			getProductsByDocument(response[response.length - 1].documento_id);
			setAllDocuments(response);
		} else {
			setCurrentDocumentID(null);
			setCurrentTypeD(null);
			setCurrentDoc(null);
			setCurrentProducts([]);
			setAllDocuments([]);
		}
		
		if(!deleteLastProduct) await defineTotalValues(data);
	}

	const recientDocument = async ( documentID ) => {
		const response = await documentByDocumentID(documentID);
		const all = allDocuments;
		const len = all.length;
		
		const data = {
			key: len,
			content: response[0]
		}
		
		setCurrentDoc(data);
		setCurrentDocumentID(response[0].documento_id);
		// await getAllDocuments();
		all.push(response[0]);
		setAllDocuments(all);
		getProductsByDocument(documentID);
		await defineTotalValues(data);
	}

	const getProductsByDocument = async (documentID) => {
		try {
			// setCurrentProducts([]);
			const response = await getProductsByDocumentID(documentID);
			const res = response.sort((a,b) => {
				return new Date(b.fecha_registro) - new Date(a.fecha_registro);
			});
			setCurrentProducts(res);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los productos por id de documento.');
		}
	}

	const documentByDocumentID = async (documentID) => {
		try {
			return await getByDocumentoIdApi(documentID);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer el documento por id de documento.');
		}
	}

	const formatTipoDocumentoID = (documentID) => {
		return documentsTypes.find(item => item.tipo_documento_id == documentID)?.nombre;
	}

	const pageOut = () => {
		Navigate("/");
	}

	const modifyEntry = (doc) => {
		if(doc) {
			setShowCreateForm(false);
			setShowUpdateForm(true);
		}
	}

	const resetListSales = async () => {
		setCurrentDocumentID(null);
		setCurrentTypeD(null);
		setCurrentDoc(null);
		setCurrentProducts([]);
		setLoadCurrentDoc(true);
		await getDocuments();
		setLoadCurrentDoc(false);
		await getProporcion(logged?.empresa_id);
	}

	const selectSpecificDocument = async (documentID, document) => {
		// const response = await getDocuments();

		// const document = response.find(item => item.documento_id == documentID);
		// const idx = response.findIndex(item => item.documento_id == documentID);
		const response = await documentByDocumentID(documentID);
		await getProductsByDocument(documentID);
		const idx = allDocuments.findIndex(doc => doc.documento_id == documentID);

		// const len = response.length - 1;

		const documentsValid = [4,9,10]; 

		if(!document) {
			// toast.warning('Para poder editar este producto debe ser una factura de venta, nro de guía o contización.');
			toast.warning('Ha ocurrido un error al intentar editar el documento.');
			return;
		}

		const data = {
			key: idx != -1 ? idx : response.length - 1,
			content: document
		}
		setCurrentDocumentID(document.documento_id);
		setCurrentDoc(data);
	// }
	}

	const loadProductByProductId = async (productId) =>  {
		const data = await getProductByProductoId(productId, logged?.empresa_id);
		return data[0];
	}

	const updateDoc = async (data) => {
		try {
			await updateDocumentoApi(data);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al actualizar el documento.');
		}
	}

	const defineTotalValues = async (params = currentDoc) => {
		let totalKG = 0;
		let vrExento = 0;
		let vrGravado = 0;
		let vrIva = 0;
		let totalParcial = 0;

		const productsCurrent = await getProductsByDocumentID(params.content.documento_id);

		// const productPromises = productsCurrent.map(async (cp) => {
		// 	const product = await loadProductByProductId(cp.producto_id);
		// 	return product;
		// });
		
		// const products = await Promise.all(productPromises);
		
		productsCurrent.forEach((product, index) => {
			const cp = productsCurrent[index];
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

		const data =  {
			...params.content,
			peso_total: parseFloat(totalKG),
			excento: parseFloat(vrExento).toFixed(2),
			gravado: parseFloat(vrGravado).toFixed(2),
			iva: parseFloat(vrIva).toFixed(2),
			total: parseFloat(totalParcial).toFixed(2)
		};

		await updateDoc(data);
	}
	  
	useEffect(() => {
		getDocumentsType();
	}, []);
	

	useEffect(() => {
		if (logged) {
			getDocumentOptions(logged?.userID);
			getUsers(logged?.empresa_id);
			getProporcion(logged?.empresa_id);
			//getProductsByBusiness(logged?.empresa_id);
			getAllDocuments();
		}
	}, [logged])
	
	
	useEffect(() => {
		
		if (currentDoc && currentDoc?.content?.documento_id) {
			// getProductsByDocument(currentDoc?.content?.documento_id);
			setCurrentTypeD(currentDoc?.content?.tipo_documento_id);
			setCurrentDocumentID(currentDoc?.content?.documento_id);
			setShowCreateForm(false);
		}
	}, [currentDoc]);

	useEffect(() => {
		if (showCreateForm) {
			setCurrentDocumentID(null);
			setCurrentTypeD(null);
			setCurrentDoc(null);
			setCurrentProducts([]);
		}
	}, [showCreateForm])

	useEffect(() => {
	  if(!showModalPrintSale) {
		// getProductsByBusiness(logged?.empresa_id);
		getAllDocuments();
	  }
	}, [showModalPrintSale])

	return (
		<AdminLayout>
			<strong>Punto de venta Día</strong>

			<BtnActionsComponent
				nextDocument={nextDocument}
				previousDocument={previousDocument}
				firstDocument={firstDocument}
				lastDocument={lastDocument}
				setShowCreateForm={setShowCreateForm}
				setShowUpdateForm={setShowUpdateForm}
				pageOut={pageOut}
				optionsDoc={optionsDoc}
				modifyEntry={modifyEntry}
				showModalSearchDocument={showModalSearchDocument}
				setShowModalSearchDocument={setShowModalSearchDocument}
				showModalEditProduct={showModalEditProduct}
				setShowModalEditProduct={setShowModalEditProduct}
				showModalBoxSquare={ showModalBoxSquare }
				setShowModalBoxSquare={ setShowModalBoxSquare }
				showModalPrintSale={ showModalPrintSale }
				setShowModalPrintSale={ setShowModalPrintSale }
				logged={logged}
				setFormUpdateActive={setFormUpdateActive}
				setShowFormCosts={ setShowFormCosts }
				selectSpecificDocument={ selectSpecificDocument }
				currentDoc={ currentDoc }
				currentDocumentID={currentDocumentID}
				resetListSales={ resetListSales }
				getAllDocuments={ getAllDocuments }
				productsOpt={ productsOpt }
				currentProducts={currentProducts}
				dataProporcion={dataProporcion}
			/>


			<div style={{ height: '13em' }}>
			{
				showCreateForm && (
					<FormActionComponent
						logged={logged}
						setShowCreateForm={setShowCreateForm}
						setCurrentDocumentID={setCurrentDocumentID}
						currentTypeD={currentTypeD}
						setCurrentTypeD={setCurrentTypeD}
						recientDocument={recientDocument}
						showCreateForm={showCreateForm}
						setShowUpdateForm={setShowUpdateForm}
						setFormUpdateActive={setFormUpdateActive}
						setShowFormCosts={ setShowFormCosts }
						showModalSearchDocument={ showModalSearchDocument }
						getPricesByProduct={ getPricesByProduct }
						setValuePublicCost={ setValuePublicCost }
						currentPricesByProduct={ currentPricesByProduct }
					/>
				)
			}

			{
				showUpdateForm && currentDoc && (
					<FormUpdateActionComponent
						logged={logged}
						setCurrentDocumentID={setCurrentDocumentID}
						currentTypeD={currentTypeD}
						setCurrentTypeD={setCurrentTypeD}
						setShowUpdateForm={setShowUpdateForm}
						currentDoc={currentDoc}
						reloadDocument={loadDocumentFromUpdateAction}
						setQtyReferenceTable={setQtyReferenceTable}
						setUnitCostReferenceTable={setUnitCostReferenceTable}
						setDeleteReferenceTable={setDeleteReferenceTable}
						formUpdateActive={formUpdateActive}
						setFormUpdateActive={setFormUpdateActive}
						showFormCosts={ showFormCosts }
						setShowFormCosts={ setShowFormCosts }
						onDeleteButtonFocus={ onDeleteButtonFocus }
						showModalSearchDocument={ showModalSearchDocument }
						getPricesByProduct={ getPricesByProduct }
						currentPricesByProduct={currentPricesByProduct}
						setValuePublicCost={ setValuePublicCost }
						valuePublicCost={ valuePublicCost }
					/>
				)
			}

			</div>

			<strong>
				Documento: {currentDocumentID || ""}
			</strong>
			<br />
			<strong>
				Tipo: {currentTypeD ? formatTipoDocumentoID(currentTypeD) : ""
				}
			</strong>
			<br />
			<strong>
				Fecha registro: 
				{ currentDoc?.content ? 
					dayjs.utc(currentDoc?.content?.fecha_registro)
					.tz(dayjs.tz.guess())
					.format("YYYY-MM-DD HH:mm:ss") : "" }
			</strong>
			{/* <br /> */}
			{/* <strong>
				Proveedor: {currentDoc ? formatProveedor(currentDoc?.content?.proveedor_id) : ""
				}
			</strong> */}

			<TableActionsComponent
				currentProducts={currentProducts}
				reloadDocument={reloadDocument}
				logged={logged}
				currentDoc={currentDoc}
				setQtyReferenceTable={setQtyReferenceTable}
				qtyReferenceTable={qtyReferenceTable}
				setUnitCostReferenceTable={setUnitCostReferenceTable}
				unitCostReferenceTable={unitCostReferenceTable}
				setDeleteReferenceTable={setDeleteReferenceTable}
				deleteReferenceTable={deleteReferenceTable}
				editInvoice={ editInvoice }
				allUsers={ allUsers }
				currentPricesByProduct={currentPricesByProduct}
				setLoadCurrentDoc={setLoadCurrentDoc}
			/>
		</AdminLayout>
	)
}

export default ventasDia;