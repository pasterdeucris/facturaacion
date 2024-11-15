import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import useAuth from '../../hooks/useAuth';
import { getEmployeesApi } from '../../api/employee';
import { getNominaApi, getOrdersEmployeeApi, getPrinterBusinessApi } from '../../api/nomina';

import AdminLayout from "../../layouts/AdminLayout";
import ListNominaComponent from '../../components/NominaComponent/ListComponent';
import ActionsNominaComponent from '../../components/NominaComponent/ActionsComponent';
import PrintComponent from '../../components/NominaComponent/PrintComponent';
import DetailComponent from '../../components/NominaComponent/DetailComponent';

function nomina() {

	const logged = useAuth();

	const [employeesIDS, setEmployeesIDS] = useState([]);
	const [allEmployees, setAllEmployees] = useState([]);
	const [printOptions, setPrintOptions] = useState([]);
	const [currentNomina, setCurrentNomina] = useState(null);
	const [dateInit, setDateInit] = useState("");
	const [dateEnd, setDateEnd] = useState("");
	const [nomina, setNomina] = useState([]);

	const [showModalPrint, setShowModalPrint] = useState(false);
	const [showModalDetail, setShowModalDetail] = useState(false);

	const getEmployees = async (businessID) => {
		try {
			const response = await getEmployeesApi(businessID);
			const filtered = response.map( res => res.empleado_id );
			setEmployeesIDS( filtered );
			setAllEmployees( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los empleados.');
		}
	}

	const getPrinters = async (businessID) => {
		try {
			const response = await getPrinterBusinessApi(businessID);
			setPrintOptions( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las impresoras.');
		}
	}

	const getNomina = async (employeesString) => {
		try {
			const response = await getNominaApi(dateInit, dateEnd, employeesString);
			setNomina( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los empleados de la nómina.');
		}
	}

	const getOrdersByEmployee = async (employeesString) => {
		try {
			const response = await getOrdersEmployeeApi(dateInit, dateEnd, employeesString);
			console.log(response)
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las ordenes de empleados de la nómina.');
		}
	}

	const searchWithDates = async () => {
		try {
			
			if(dateInit == '' || dateEnd == '') {
				toast.warning('Los campos de fechas no pueden quedar vacíos.');
				return;
			}

			if(dateInit >= dateEnd) {
				toast.warning('La fecha inicial no puede ser mayor  a la final.');
				return;
			}

			let employeesString = employeesIDS.toString();

			const response = await getNominaApi(dateInit, dateEnd, employeesString);
			setNomina( response );
			toast.success('Búsqueda realizada con éxito.');

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los empleados de la nómina por fecha.');
		}
	}

	const clickCierreNomina = async () => {
		if(employeesIDS.length) {
			let employessFiltered = employeesIDS.toString();
			getNomina( employessFiltered );
			getOrdersByEmployee( employessFiltered );
		}
	}

	useEffect(() => {
		getEmployees(logged?.empresa_id);
		getPrinters(logged?.empresa_id);
	}, [logged])

	useEffect(() => {
		if(employeesIDS.length) {
			let employessFiltered = employeesIDS.toString();
			getNomina( employessFiltered );
		}
	}, [employeesIDS])
	

	return (
		<AdminLayout>
			<div className="nomina">
				<h3>
					<strong>Nómina</strong>
				</h3>
			</div>

			<br />

			<ActionsNominaComponent 
				allEmployees={ allEmployees }
				logged={ logged }
				clickCierreNomina={ clickCierreNomina }
				nomina={ nomina }
			/>

			<ListNominaComponent 
				data={ nomina }
				setDateInit={ setDateInit }
				setDateEnd={ setDateEnd }
				searchWithDates={ searchWithDates }
				setShowModalPrint={ setShowModalPrint }
				setShowModalDetail={ setShowModalDetail }
				setCurrentNomina={ setCurrentNomina }
			/>

			<DetailComponent 
				setShowModalDetail={ setShowModalDetail }
				showModalDetail={ showModalDetail }
				setCurrentNomina={ setCurrentNomina }
				currentNomina={ currentNomina }
			/>

			<PrintComponent 
				showModalPrint={ showModalPrint }
				setShowModalPrint={ setShowModalPrint }
				printOptions={ printOptions }
			/>

		</AdminLayout>
	)
}

export default nomina;