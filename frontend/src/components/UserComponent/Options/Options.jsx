import { useState, useEffect } from 'react';
import { Modal, Transfer } from 'antd';
import { toast } from 'react-toastify';

import { 
	getActivationAllApi, 
	getInventoryAllApi, 
	getSubmenuAllApi, 
	getActivationUserIDApi, 
	getSubmenuUserIDApi, 
	getInventoryUserIDApi,
	storeActivationsByUser,
	storeSubmenusByUser,
	storeInventoryByUser } from '../../../api/user';

function OptionsUser({ showModalOptions, setShowModalOptions, userEdit }) {

	const [usersActivations, setUsersActivations] = useState([]);
	const [usersInventory, setUsersInventory] = useState([]);
	const [usersSubmenus, setUsersSubmenus] = useState([]);

	const [currentUsersActivations, setCurrentUsersActivations] = useState([]);
	const [currentUsersInventory, setCurrentUsersInventory] = useState([]);
	const [currentUsersSubmenus, setCurrentUsersSubmenus] = useState([]);

	const getActivationAll = async () => {
		try {
			const response = await getActivationAllApi();
			setUsersActivations( response );
			// localStorage.setItem("activaciones", JSON.stringify(response));
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al obtener los datos de activación.');
		}
	} 

	const getInventoryAll = async () => {
		try {
			const response = await getInventoryAllApi();
			setUsersInventory( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al obtener los datos de inventario físico.');
		}
	} 

	const getSubmenuAll = async () => {
		try {
			const response = await getSubmenuAllApi();
			setUsersSubmenus( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al obtener los datos de submenus.');
		}
	}

	const getOptionsByUserID = async (userID) => {
		try {
			const currentAct = await getActivationUserIDApi(userID);
			const currentSub = await getSubmenuUserIDApi(userID);
			const currentInv = await getInventoryUserIDApi(userID);

			const activesAct = currentAct.map(item => item.activacion_id);
			const activesSub = currentSub.map(item => item.sub_menu_id);
			const activesInv = currentInv.map(item => item.campo_inventario_id);

			setCurrentUsersActivations( activesAct );
			setCurrentUsersSubmenus( activesSub );
			setCurrentUsersInventory( activesInv );
			localStorage.setItem("activaciones", JSON.stringify(currentAct));

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al obtener los datos de las opciones según user ID.');
		}
	}
	
	const onChangeActivations = (nextTargetKeys, direction, moveKeys) => {
		// console.log('targetKeys:', nextTargetKeys);
    // console.log('direction:', direction);
    // console.log('moveKeys:', moveKeys);
    setCurrentUsersActivations(nextTargetKeys);
	}

	const onChangeSubmenus = (nextTargetKeys, direction, moveKeys) => {
		// console.log('targetKeys:', nextTargetKeys);
    // console.log('direction:', direction);
    // console.log('moveKeys:', moveKeys);
    setCurrentUsersSubmenus(nextTargetKeys);
	}

	const onChangeInventory = (nextTargetKeys, direction, moveKeys) => {
		// console.log('targetKeys:', nextTargetKeys);
    // console.log('direction:', direction);
    // console.log('moveKeys:', moveKeys);
    setCurrentUsersInventory(nextTargetKeys);
	}

	const onSubmitKeys = async () => {
		if(currentUsersActivations.length == 0 && currentUsersSubmenus.length == 0 && currentUsersInventory.length == 0) {
			toast.warning('Para poder usar las opciones debes pasar alguna para activos.');
			return;
		}

		// localStorage.removeItem('activaciones');

		try {
			if(currentUsersActivations.length > 0) {
				await storeActivationsByUser(userEdit?.usuario_id, currentUsersActivations.toString());
			}
			if(currentUsersSubmenus.length > 0) {
				await storeSubmenusByUser(userEdit?.usuario_id, currentUsersSubmenus.toString());
			}
			if(currentUsersInventory.length > 0) {
				await storeInventoryByUser(userEdit?.usuario_id, currentUsersInventory.toString());
			}

			toast.success('Opciones guardados para este usuario éxitosamente.');
			setShowModalOptions(false);
			getOptionsByUserID(userEdit?.usuario_id);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar guardar los datos de las opciones según user ID.');
		}
	}


	useEffect(() => {
		if(userEdit) {
			getActivationAll();
			getInventoryAll();
			getSubmenuAll();

			getOptionsByUserID(userEdit?.usuario_id);
		}

		if(!userEdit) {
			getActivationAll();
		}

	}, [userEdit])
	

	return (
		<Modal
		title="Opciones de usuario"
		visible={showModalOptions}
		onCancel={() => setShowModalOptions(false)}
		okText="Guardar"
		width={1000}
		onOk={ onSubmitKeys }
		forceRender
		>

			<h3>Rutas</h3>

			<Transfer 
				dataSource={usersSubmenus}
				targetKeys={currentUsersSubmenus}
				titles={['Inactivos','Activos']}
				onChange={ onChangeSubmenus }
				render={ (item) => item.nombre}
				rowKey={ (item) => item.sub_menu_id }
				oneWay={false}
				listStyle={{ width: '100%' }}
			/>

			<h3 style={{ marginTop: '1em' }}>Activaciones</h3>

			<Transfer 
				dataSource={usersActivations}
				targetKeys={currentUsersActivations}
				titles={['Inactivos','Activos']}
				onChange={ onChangeActivations }
				render={ (item) => item.nombre}
				rowKey={ (item) => item.activacion_id }
				oneWay={false}
				listStyle={{ width: '100%' }}
			/>

			<h3 style={{ marginTop: '1em' }}>Campos inventario físico</h3>

			<Transfer 
				dataSource={usersInventory}
				targetKeys={currentUsersInventory}
				titles={['Inactivos','Activos']}
				onChange={ onChangeInventory }
				render={ (item) => item.nombre}
				rowKey={ (item) => item.campo_inventario_id }
				oneWay={false}
				listStyle={{ width: '100%' }}
			/>

		</Modal>
	)
}

export default OptionsUser;