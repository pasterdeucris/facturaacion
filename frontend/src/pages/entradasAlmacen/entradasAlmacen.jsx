import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import {
	getDocumentsTypeApi,
	getDocumentsApi,
	getProductsByDocumentID,
	getDocumentOptionsApi
} from '../../api/document';
import { getSuppliesApi } from '../../api/supplies';
import { getUsersApi } from '../../api/user';
import { getPreciosByProductoID } from '../../api/sales';
import useAuth from '../../hooks/useAuth';

import AdminLayout from "../../layouts/AdminLayout";
import BtnActionsComponent from '../../components/EntriesWarehouseComponent/BtnActions';
import FormActionComponent from '../../components/EntriesWarehouseComponent/FormActions';
import FormUpdateActionComponent from '../../components/EntriesWarehouseComponent/FormUpdateActions';
import TableActionsComponent from '../../components/EntriesWarehouseComponent/TableActions';
import { useActivations } from '../../hooks/useActivations';

function entradasAlmacen() {

	const logged = useAuth();
	const Navigate = useNavigate();

	const { editInvoice } = useActivations(logged);

	const [documentsTypes, setDocumentsTypes] = useState([]);
	const [suppliers, setSuppliers] = useState([]);
	const [optionsDoc, setOptionsDoc] = useState([]);
	const [currentDoc, setCurrentDoc] = useState(null);
	const [currentProducts, setCurrentProducts] = useState([]);
	const [allUsers, setAllUsers] = useState([]);
	const [currentTypeD, setCurrentTypeD] = useState(null);
	const [currentDocumentID, setCurrentDocumentID] = useState(null);
	const [showModalPrintEntry, setShowModalPrintEntry] = useState(false);
	const [showModalSearchDocument, setShowModalSearchDocument] = useState(false);
	const [showModalEditProduct, setShowModalEditProduct] = useState(false);
	const [currentPricesByProduct, setCurrentPricesByProduct] = useState([]);

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

	const nextDocument = async () => {
		const response = await getDocuments();
		const len = response.length - 1;

		if (currentDoc) {
			if (currentDoc?.key == len) {
				return;
			}

			const data = {
				key: currentDoc?.key + 1,
				content: response[currentDoc?.key + 1]
			}
			setCurrentDoc(data);

		} else {
			const data = {
				key: len,
				content: response[len]
			}
			setCurrentDoc(data);
		}
	}

	const previousDocument = async () => {
		const response = await getDocuments();

		if (currentDoc) {
			if (currentDoc?.key == 0) {
				return;
			}

			const data = {
				key: currentDoc?.key - 1,
				content: response[currentDoc?.key - 1]
			}
			setCurrentDoc(data);

		} else {
			const data = {
				key: 0,
				content: response[0]
			}
			setCurrentDoc(data);
		}
	}

	const firstDocument = async () => {
		const response = await getDocuments();

		const data = {
			key: 0,
			content: response[0]
		}

		setCurrentDoc(data);

	}

	const lastDocument = async () => {
		const response = await getDocuments();
		const len = response.length - 1;

		const data = {
			key: len,
			content: response[len]
		}
		setCurrentDoc(data);
		// modifyEntry();
		// setShowUpdateForm(true);
	}

	const reloadDocument = async (documentID, document) => {
		const response = await getDocuments();
		// console.log(document)
		// const document = getProductsByDocumentID(documentID);
		const find = response.findIndex(item => item.documento_id == documentID);

		const data = {
			key: find != -1 ? find : response.length - 1,
			content: document
		}
		setCurrentDoc(data);
	}

	const getProductsByDocument = async (documentID) => {
		try {
			setCurrentProducts([]);
			const response = await getProductsByDocumentID(documentID);
			setCurrentProducts(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los productos por id de documento.');
		}
	}

	const formatTipoDocumentoID = (documentID) => {
		return documentsTypes.find(item => item.tipo_documento_id == documentID)?.nombre;
	}

	const getProveedores = async () => {
		try {	
			const response = await getSuppliesApi(logged?.empresa_id);
			setSuppliers(response);
			
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los proveedores por id de empresa.');
		}
	}

	const formatProveedor = (id) => {
		const proveedor = suppliers.find(item => item.proveedor_id == id);
		return `${proveedor?.nombre} ${proveedor?.apellidos}`;
	}

	const pageOut = () => {
		Navigate("/");
	}

	const modifyEntry = () => {
		if (!currentDoc) {
			toast.warning('Necesitas seleccionar un documento primero.');
			return;
		} else {
			setShowCreateForm(false);
			setShowUpdateForm(true);
		}
	}

	const selectSpecificDocument = async (documentID, document) => {
		const response = await getDocuments();

		// const document = response.find(item => item.documento_id == documentID);
		const idx = response.findIndex(item => item.documento_id == documentID);

		// const len = response.length - 1;

		const documentsValid = [1,2,6]; 

		if(!document) {
			// toast.warning('Para poder editar este producto debe ser una entrada de almacen, de guía o salida de almacen.');
			toast.warning('Ha ocurrido un error al intentar editar el documento.');
			return;
		}

		const data = {
			key: idx != -1 ? idx : response.length - 1,
			content: document
		}
		setCurrentDoc(data);
	// }
	}

	useEffect(() => {
		getDocumentsType();
	}, []);
	

	useEffect(() => {
		if (logged) {
			getDocumentOptions(logged?.userID);
			getProveedores();
			getUsers(logged?.empresa_id);
		}
	}, [logged])


	useEffect(() => {

		if (currentDoc && currentDoc?.content?.documento_id) {
			getProductsByDocument(currentDoc?.content?.documento_id);
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

	return (
		<AdminLayout>
			<strong>Entradas de Almacén</strong>

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
				logged={logged}
				setFormUpdateActive={setFormUpdateActive}
				setShowFormCosts={ setShowFormCosts }
				selectSpecificDocument={ selectSpecificDocument }
				currentDoc={ currentDoc }
			/>

			{
				showCreateForm && (
					<FormActionComponent
						logged={logged}
						setShowCreateForm={setShowCreateForm}
						setCurrentDocumentID={setCurrentDocumentID}
						currentTypeD={currentTypeD}
						setCurrentTypeD={setCurrentTypeD}
						lastDocument={lastDocument}
						showCreateForm={showCreateForm}
						setShowUpdateForm={setShowUpdateForm}
						setFormUpdateActive={setFormUpdateActive}
						setShowFormCosts={ setShowFormCosts }
						showModalSearchDocument={ showModalSearchDocument }
						getPricesByProduct={ getPricesByProduct }
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
						reloadDocument={reloadDocument}
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
					/>
				)
			}

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
				Fecha registro: {currentDoc ? new Date(currentDoc?.content?.fecha_registro).toDateString() : ""
				}
			</strong>
			<br />
			<strong>
				Proveedor: {currentDoc ? formatProveedor(currentDoc?.content?.proveedor_id) : ""
				}
			</strong>

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
				editInvoice={editInvoice}
				allUsers={ allUsers }
			/>
		</AdminLayout>
	)
}

export default entradasAlmacen;