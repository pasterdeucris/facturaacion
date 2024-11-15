import { useEffect, useState } from "react";
import { Button } from 'antd';

import AdminLayout from "../../layouts/AdminLayout";
import ClientList from '../../components/ClientComponent/List';
import ClientCreate from '../../components/ClientComponent/Create';
import useAuth from "../../hooks/useAuth";

import { getClientsApi, getIdentificationsTypeApi, getCiudadesApi } from '../../api/client';
import { getBusinessTypeApi } from '../../api/business';

import "./cliente.scss";

function cliente() {

	const loggedUser = useAuth();

	const [clients, setClients] = useState([]);
	const [factTipoEmpresa, setFactTipoEmpresa] = useState([]);
	const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
	const [ciudades, setCiudades] = useState([]);
	const [clientEdit, setClientEdit] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const index = async (businessID) => {
		try {
			const response = await getClientsApi(businessID);
			setClients( response );
		} catch (err) {
			console.log(err)
		}
	}

	const getBusinessType = async () => {
		try {
			const response = await getBusinessTypeApi();
			const res = response.map(item => {
				return { label: item.nombre, value: item.fact_tipo_empresa_id }
			});

			setFactTipoEmpresa( res );
		} catch (err) {
			console.log(err)
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

	const getCiudades = async () => {
		try {
			const response = await getCiudadesApi();
			setCiudades( response );
		} catch (err) {
			console.log(err)
		}
	}

	const modifyClient = (item) => {
		setShowModal( true );
		setClientEdit( item );
	}

	useEffect(() => {
		index(loggedUser?.empresa_id);
		getBusinessType();
		getIdentificationsType();
		getCiudades();
	}, [loggedUser?.empresa_id])
	

	return (
		<AdminLayout>
			<div className="cliente">
				<h3>
					<strong>Listado de clientes</strong>
				</h3>

				<Button
					type="primary"
					onClick={ () => { setShowModal( !showModal ); setClientEdit(null); }}
				>
					Crear nuevo cliente
				</Button>
			</div>

			<br />

			<ClientCreate 
				showModal={ showModal }
				setShowModal={ setShowModal }
				factTipoEmpresa={ factTipoEmpresa }
				tiposIdentificacion={ tiposIdentificacion }
				clientEdit={ clientEdit }
				loggedUser={ loggedUser }
				index={ index }
				ciudades={ ciudades }
			/>

			<ClientList 
				clients={ clients }
				modifyClient={ modifyClient }
			/>
		</AdminLayout>
	)
}

export default cliente;