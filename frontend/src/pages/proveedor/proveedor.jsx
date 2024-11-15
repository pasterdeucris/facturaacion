import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { toast } from 'react-toastify';
import AdminLayout from "../../layouts/AdminLayout";

import SuppliersList from '../../components/SupplierComponent/List';
import SuppliersCreate from '../../components/SupplierComponent/Create';
import { getSuppliesApi } from '../../api/supplies';
import { getIdentificationsTypeApi } from '../../api/client';
import useAuth from '../../hooks/useAuth';

import "./proveedor.scss";
import _ from 'lodash';

function proveedor() {


	const loggedUser = useAuth();

	const [showModal, setShowModal] = useState(false);
	const [suppliers, setSuppliers] = useState([]);
	const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
	const [supplieEdit, setSupplieEdit] = useState(null);

	const index = async (businessID) => {
		try {
			const response = await getSuppliesApi(businessID);
			setSuppliers( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos de proveedores.');
		}
	}

	const getIdentificationsType = async () => {
		try {
			const response = await getIdentificationsTypeApi();
			setTiposIdentificacion( response );
		} catch (err) {
			console.log(err)
		}
	}

	const onSupplierEdit = (item) => {
		setSupplieEdit( item );
		setShowModal( true );
	}

	useEffect(() => {
		index( loggedUser?.empresa_id );
		getIdentificationsType();
	}, [loggedUser?.empresa_id])
	

	return (
		<AdminLayout>
			<div className="proveedor">
				<h3>
					<strong>Listado de proveedores</strong>
				</h3>

				<Button
					type="primary"
					onClick={ () => { 
						setShowModal( !showModal ); 
						setSupplieEdit(null); 
					}}
				>
					Crear nuevo proveedor
				</Button>
			</div>

			<SuppliersCreate 
				setShowModal={ setShowModal }
				showModal={ showModal }
				supplieEdit={ supplieEdit }
				tiposIdentificacion={ tiposIdentificacion }
				loggedUser={ loggedUser }
				index={ index }
			/>

			<SuppliersList 
				suppliers={ suppliers }
				onSupplierEdit={ onSupplierEdit }
			/>

			<br />
		</AdminLayout>
	)
}

export default proveedor;