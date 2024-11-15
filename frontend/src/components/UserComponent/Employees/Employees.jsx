import { useState, useEffect } from 'react';
import { Modal, Transfer } from 'antd';
import { toast } from 'react-toastify';

import { getEmployeesApi } from '../../../api/employee';
import { getEmployeesByUserIDApi, storeEmployeesByUserIDApi } from '../../../api/user';

function Employees({
	setShowModalEmpleado,
	showModalEmpleado,
	userEdit
}) {

	const [allUsers, setAllUsers] = useState([]);
	const [usersInactive, setUsersInactive] = useState([]);
	const [usersActive, setUsersActive] = useState([]);

	const getEmployees = async (businessID, userID) => {
		try {
			const response = await getEmployeesApi(businessID);
			setAllUsers(response);
			const data = await getEmployeesByUserIDApi(userID);
			const actives = data.map(item => item.empleado_id);
			setUsersActive( actives );

			// const inactives = response.filter(item => {
			// 	return data.findIndex(val => val.empleado_id == item.empleado_id) == -1;
			// });

			setUsersInactive(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos del empleado.');
		}
	}

	const onChange = (nextTargetKeys, direction, moveKeys) => {
		// console.log('targetKeys:', nextTargetKeys);
    // console.log('direction:', direction);
    // console.log('moveKeys:', moveKeys);
    setUsersActive(nextTargetKeys);
	}

	const onSubmitKeys = async () => {
		try {
			await storeEmployeesByUserIDApi(userEdit?.usuario_id, usersActive.toString());
			toast.success('Empleados guardados para este usuario éxitosamente.');
			setShowModalEmpleado(false);
		} catch (err) {
			console.log(err);
			toast.warning('Ha ocurrido un error al intentar guardar empleados para este usuario.');
		}
	}

	/** el transfer funciona siendo que a la derecha coloco el array completo, y a la derecha solo el id o key de aquellos que ya han sido tomados, así los quita del lado izquierdo. */
	useEffect(() => {
		if(userEdit) {
			getEmployees(userEdit?.empresa_id, userEdit?.usuario_id);
		}
	}, [userEdit])
	

	return (
		<Modal
			title={"Empleados por usuario " + userEdit?.correo}
			visible={showModalEmpleado}
			onCancel={() => setShowModalEmpleado(false)}
			okText="Guardar"
			onOk={ onSubmitKeys }
			forceRender
		>

			{
				usersInactive && usersActive && (
					<Transfer 
						dataSource={usersInactive}
						targetKeys={usersActive}
						titles={['Inactivos','Activos']}
						onChange={onChange}
						render={ (item) => item.nombre}
						rowKey={ (item) => item.empleado_id }
						oneWay={false}
					/>
				)
			}

		</Modal>
	)
}

export default Employees;