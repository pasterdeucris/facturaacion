import { useEffect } from 'react';
import { Button } from 'antd';
import { toast } from 'react-toastify';

import LayoutAdmin from '../../layouts/AdminLayout';
import useAuth from '../../hooks/useAuth';

import { getRolesApi, activationsByUserApi } from '../../api/auth';
import { getBusinessApi } from '../../api/business';
import { resetTotalDocumentsToZeroApi } from '../../api/document';

function Home() {
	
	const { name: nameUser, userID } = useAuth();

	const getRoles = async() => {
		try {
			const response = await getRolesApi();
			console.log(response)
		} catch (err) {
			console.log(err)
		}
	}

	const getBusiness = async() => {
		try {
			const response = await getBusinessApi();
			console.log(response)
		} catch (err) {
			console.log(err)
		}
	}

	const getActivaciones = async(userID) => {
		try {
			localStorage.removeItem('activaciones');
			const response = await activationsByUserApi(userID);
			localStorage.setItem("activaciones", JSON.stringify(response));
		} catch (err) {
			console.log(err)
		}
	}

	const resetTotalDocumentsToZero = async() => {
		try {
			const response = await resetTotalDocumentsToZeroApi();
			toast.success('Precios alineados a productos.');
		} catch (err) {
			console.log(err)
		}
	}
	
	
	useEffect(() => {
		getRoles();
		getBusiness();
	}, [])

	useEffect(() => {
	  getActivaciones(userID);
	}, [userID])
	
	

	return (
		<LayoutAdmin>
			<div>Bienvenido al Sistema de facuración Effective Software</div>
			<h3>{ nameUser }</h3>
			<hr />
			<a href="https://www.youtube.com/channel/UCFNW6X7RQHzJonlDgPlVyPA" target='_blank'>
				Tutoriales
			</a>
			<br />
			<hr />
			<Button
				onClick={ () => resetTotalDocumentsToZero() }
			>
				Reset Totales de productos
			</Button>
		</LayoutAdmin>
	)
}

export default Home;