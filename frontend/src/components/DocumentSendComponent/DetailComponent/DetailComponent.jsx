import { useState, useEffect } from 'react';
import { Modal, Table } from 'antd';
import { toast } from 'react-toastify';

import { getValesEmployeeApi, getProductsEmployeeApi, getOrdersEmployeeApi  } from '../../../api/nomina';

function DetailComponent({ 
	showModalDetail, 
	setShowModalDetail, 
	setCurrentNomina, 
	currentNomina 
}) {

	const [vehicleData, setVehicleData] = useState([]);
	const [valesData, setValesData] = useState([]);
	const [productsData, setProductsData] = useState([]);

	const getOrdenesByEmpleado = async (employeeID) => {
		try {
			const response = await getOrdersEmployeeApi( "", "", employeeID );
			setVehicleData(response)
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las ordenes por empleado.');
		}
	}

	const getValesByEmpleado = async (employeeID) => {
		try {
			const response = await getValesEmployeeApi( employeeID );
			setValesData(response)
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los vales por empleado.');
		}
	}

	const getProductosByEmpleado = async (employeeID) => {
		try {
			const response = await getProductsEmployeeApi(employeeID);
			setProductsData( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los productos por empleado.');
		}
	}

	const columnsVehicles = [
		{
			title: 'Orden',
			dataIndex: 'orden',
			key: 'orden',
		},
		{
			title: 'Placa',
			dataIndex: 'placa',
			key: 'placa',
		},
		{
			title: 'Valor',
			dataIndex: 'valor',
			key: 'valor',
		},
		{
			title: 'Fecha',
			dataIndex: 'fecha',
			key: 'fecha',
		},
	]

	const columnsVales = [
		{
			title: 'Concepto',
			dataIndex: 'descripcion_trabajador',
			key: 'descripcion_trabajador',
		},
		{
			title: 'Valor',
			dataIndex: 'total',
			key: 'total',
		},
		{
			title: 'Fecha',
			dataIndex: 'fecha_registro',
			key: 'fecha_registro',
		},
	]

	const columnsProducts = [
		{
			title: 'Producto',
			dataIndex: 'concepto_producto',
			key: 'concepto_producto',
		},
		{
			title: 'Valor',
			dataIndex: 'valor',
			key: 'valor',
		},
		{
			title: 'Fecha',
			dataIndex: 'fecha_registro',
			key: 'fecha_registro',
		},
	]

	useEffect(() => {
		if(currentNomina) {
			getOrdenesByEmpleado( currentNomina?.empleado_id );
			getValesByEmpleado( currentNomina?.empleado_id );
			getProductosByEmpleado( currentNomina?.empleado_id );
		}
	}, [currentNomina])
	

	return (
		<Modal
			title="Detalle nomina"
			visible={ showModalDetail }
			onCancel={() => { setShowModalDetail(false); setCurrentNomina(null); }}
			okButtonProps={{ style: { display: 'none' } }}
			forceRender
		>
			<div 
				style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}
			>
					<div>{ currentNomina?.nombre } </div>
					<div>Total: { parseFloat(currentNomina?.total).toFixed(0) } </div>
			</div>

			<br />

			<p>
				<strong>Vehículos</strong>
			</p>

			<Table 
				columns={ columnsVehicles }
				dataSource={ vehicleData }
				rowKey="vehicle_id"
				key="vehicles_list"
				pagination={{ pageSize: 5}}
			/>

			<br />

			<p>
				<strong>Vales</strong>
			</p>

			<Table 
				columns={ columnsVales }
				dataSource={ valesData }
				rowKey="documento_id"
				key="vales_list"
				pagination={{ pageSize: 5}}
			/>

			<br />

			<p>
				<strong>Productos</strong>
			</p>

			<Table 
				columns={ columnsProducts }
				dataSource={ productsData }
				rowKey="producto_empleado_id"
				key="products_list"
				pagination={{ pageSize: 5}}
			/>
		</Modal>
	)
}

export default DetailComponent;