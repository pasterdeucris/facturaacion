import { useEffect, useState } from "react";
import { Button } from 'antd';
import AdminLayout from "../../layouts/AdminLayout";

import { getEmployeesApi } from '../../api/employee';
import useAuth from "../../hooks/useAuth";

import ListEmployees from '../../components/EmployeeComponent/List';
import CreateEmployee from '../../components/EmployeeComponent/Create';

import "./empleado.scss";

function empleado() {

	const loggedUser = useAuth();
	const [showModal, setShowModal] = useState(false);
	const [employees, setEmployees] = useState([]);
	const [employeeEdit, setEmployeeEdit] = useState(null);

	const index = async (businessID) => {
		try {
			const response = await getEmployeesApi(businessID);
			setEmployees( response );
		} catch (err) {
			console.log(err)
		}
	}

	const onEditEmployee = (employee) => {
		setEmployeeEdit( employee );
		setShowModal( true );
	}

	useEffect(() => {
		index(loggedUser?.empresa_id);
	}, [loggedUser?.empresa_id])

	return (
		<AdminLayout>
			<div className="empleado">
				<h3>
					<strong>Listado de empleados</strong>
				</h3>

				<Button
					type="primary"
					onClick={ () => { 
						setShowModal( !showModal ); 
						setEmployeeEdit(null); 
					}}
				>
					Crear nuevo empleado
				</Button>
			</div>

			<br />

			<CreateEmployee 
				showModal={ showModal }
				setShowModal={ setShowModal }
				employeeEdit={ employeeEdit }
				loggedUser={ loggedUser }
				index={ index }
			/>

			<ListEmployees 
				employees={ employees }
				onEditEmployee={ onEditEmployee }
			/>

			
		</AdminLayout>
	)
}

export default empleado;