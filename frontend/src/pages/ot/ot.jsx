import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';

import AdminLayout from "../../layouts/AdminLayout";
import ButtonBarComponent from "../../components/OtComponent/ButtonBarComponent";
import FormOtComponent from "../../components/OtComponent/FormComponent";

import { getDocumentosByTipoApi } from '../../api/orderWork';
import { getUsersApi } from '../../api/user';

function ot() {
	const logged = useAuth();

	const [currentDocument, setCurrentDocument] = useState(null);
	const [users, setUsers] = useState([]);

	const getDocuments = async (businessID) => {
		try {
			const response = await getDocumentosByTipoApi(11, businessID);
			return response;
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los documentos');
		}
	}

	const getUsers = async (businessID) => {
		try {
			const response = await getUsersApi(businessID);
			setUsers(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los usuarios');
		}
	}

	const nextDocument = async (businessID) => {
		const response = await getDocuments(businessID);
		const len = response.length - 1;
		if (currentDocument) {
			if (currentDocument?.key == len) {
				return;
			}

			const data = {
				key: currentDocument?.key + 1,
				content: response[currentDocument?.key + 1]
			}
			setCurrentDocument(data);

		} else {
			const data = {
				key: len,
				content: response[len]
			}
			setCurrentDocument(data);
		}
	}

	const previousDocument = async (businessID) => {
		const response = await getDocuments(businessID);

		if (currentDocument) {
			if (currentDocument?.key == 0) {
				return;
			}

			const data = {
				key: currentDocument?.key - 1,
				content: response[currentDocument?.key - 1]
			}
			setCurrentDocument(data);

		} else {
			const data = {
				key: 0,
				content: response[0]
			}
			setCurrentDocument(data);
		}
	}

	useEffect(() => {
		getUsers( logged?.empresa_id );
	}, [logged])
	
	
	
	return (
		<AdminLayout>
			<strong>Orden de trabajo</strong>

			<ButtonBarComponent 
				logged={ logged }
				nextDocument={ nextDocument }
				previousDocument={ previousDocument }
			/>

			<FormOtComponent 
				logged={ logged }
				currentDocument={ currentDocument }
				users={ users }
			/>
		</AdminLayout>
	)
}

export default ot;