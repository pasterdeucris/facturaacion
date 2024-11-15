import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { toast } from 'react-toastify';

import AdminLayout from "../../layouts/AdminLayout";
import ListUsers from '../../components/UserComponent/List';
import CreateUser from '../../components/UserComponent/Create';
import ListEmployees from '../../components/UserComponent/Employees';
import UploadUsers from '../../components/UserComponent/Upload';
import OptionsUser from '../../components/UserComponent/Options';
import { getUsersApi } from '../../api/user';
import { getRolesApi } from '../../api/auth';
import useAuth from '../../hooks/useAuth';

import "./usuario.scss";

function usuario() {

	const loggedUser = useAuth();
	const [showModal, setShowModal] = useState(false);
	const [showModalEmpleado, setShowModalEmpleado] = useState(false);
	const [showModalUpload, setShowModalUpload] = useState(false);
	const [showModalOptions, setShowModalOptions] = useState(false);
	const [users, setUsers] = useState([]);
	const [roles, setRoles] = useState([]);
	const [userEdit, setUserEdit] = useState(null);


	const index = async(businessID) => {
		try {
			const response = await getUsersApi(businessID);
			setUsers( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos de usuarios.');
		}
	}

	const getRoles = async () => {
		try {
			const response = await getRolesApi();
			setRoles( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos de roles de usuarios.');
		}
	}

	const modalEmpleados = (item) => {
		setShowModalEmpleado( !showModalEmpleado );
		setUserEdit( item );
	}

	const modalOptions = (item) => {
		setShowModalOptions( !showModalOptions );
		setUserEdit( item );
	}

	const onUserEdit = (item) => {
		setUserEdit( item );
		setShowModal( true );
	}

	useEffect(() => {
		index( loggedUser?.empresa_id );
		getRoles();
	}, [loggedUser?.empresa_id])
	

	return (
		<AdminLayout>
			<div className="usuario">
				<h3>
					<strong>Listado de usuarios</strong>
				</h3>

				<div className='button-gp-users'>
					<Button
						type="primary"
						onClick={ () => { 
							setShowModal( !showModal ); 
							setUserEdit(null); 
						}}
					>
						Crear nuevo usuario
					</Button>

					<Button
						type="ghost"
						onClick={ () => { 
							setShowModalUpload( !showModalUpload ); 
						}}
					>
						Carga masiva de usuarios
					</Button>
				</div>
			</div>

			<CreateUser 
				setShowModal={ setShowModal }
				showModal={ showModal }
				userEdit={ userEdit }
				index={ index }
				roles={ roles }
				loggedUser={ loggedUser }
			/>

			<ListUsers 
				users={ users }
				onUserEdit={ onUserEdit }
				modalEmpleados={ modalEmpleados }
				modalOptions={ modalOptions }
			/>

			{
				userEdit && (
					<ListEmployees 
						setShowModalEmpleado={ setShowModalEmpleado }
						showModalEmpleado={ showModalEmpleado }
						userEdit={ userEdit }
					/>
				)
			}

			<UploadUsers 
				setShowModalUpload={ setShowModalUpload }
				showModalUpload={ showModalUpload }
			/>

			<OptionsUser 
				setShowModalOptions={ setShowModalOptions }
				showModalOptions={ showModalOptions }
				userEdit={ userEdit }
			/>

		</AdminLayout>
	)
}

export default usuario;