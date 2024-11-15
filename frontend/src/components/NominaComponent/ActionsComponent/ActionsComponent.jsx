import { useState, useEffect } from 'react';
import { Button } from 'antd';

import ValeComponent from "../ValeComponent";
import AssocProductComponent from "../AssocProductComponent";
import CierreComponent from '../CierreComponent';
import ConfigEmployeeComponent from '../ConfigEmployeeComponent';

import "./ActionsComponent.scss";

function ActionsComponent({ allEmployees, logged, clickCierreNomina, nomina }) {

	const [showModalVale, setShowModalVale] = useState(false);
	const [showModalAProduct, setShowModalAProduct] = useState(false);
	const [showModalConfigEmpleado, setShowModalConfigEmpleado] = useState(false);
	const [showModalCierre, setShowModalCierre] = useState(false);
	const [showModalConfigEmployee, setShowModalConfigEmployee] = useState(false);

	return (
		<div className='buttons-actions__nomina'>
			<Button
				type='primary'
				onClick={ () => setShowModalVale( !showModalVale ) }
			>
				Crear Vale
			</Button>
			<Button
				type='primary'
				onClick={ () => setShowModalAProduct( !showModalAProduct ) }
			>
				Asociar producto
			</Button>
			<Button
				type='primary'
				onClick={ () => setShowModalConfigEmployee( !showModalConfigEmployee ) }
			>
				Configuración de empleado
			</Button>
			<Button
				type='primary'
				onClick={ () => setShowModalCierre( !showModalCierre ) }
			>
				Hacer cierre
			</Button>


			<ValeComponent 
				showModalVale={ showModalVale }
				setShowModalVale={ setShowModalVale }
				allEmployees={ allEmployees }
				logged={ logged }
				clickCierreNomina={ clickCierreNomina }
			/>

			<AssocProductComponent 
				showModalAProduct={ showModalAProduct }
				setShowModalAProduct={ setShowModalAProduct }
				allEmployees={ allEmployees }
				logged={ logged }
				clickCierreNomina={ clickCierreNomina }
			/>

			<ConfigEmployeeComponent 
				nomina={ nomina }
				showModalConfigEmployee={ showModalConfigEmployee }
				setShowModalConfigEmployee={ setShowModalConfigEmployee }
				allEmployees={ allEmployees }
				clickCierreNomina={ clickCierreNomina }
			/>

			<CierreComponent 
				showModalCierre={ showModalCierre }
				setShowModalCierre={ setShowModalCierre }
				clickCierreNomina={ clickCierreNomina }
			/>

		</div>
	)
}

export default ActionsComponent;