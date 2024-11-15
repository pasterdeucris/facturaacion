import { useState, useEffect } from 'react';
import { Table } from 'antd';

import "./TableComponent.scss";

function TableComponent() {

	const [dataTo, setDataTo] = useState([]);
	const [dataFactura, setDataFactura] = useState([]);

	const columnsTo = [
		{
			title: 'Opciones',
			dataIndex: 'opciones',
			key: 'opciones',
		},
		{
			title: 'N° Orden',
			dataIndex: 'orden',
			key: 'orden',
		},
		{
			title: 'Cliente',
			dataIndex: 'cliente',
			key: 'cliente',
		},
		{ 
			title: 'Placa',
			dataIndex: 'placa',
			key: 'placa',
		},
		{
			title: 'Total',
			dataIndex: 'total',
			key: 'total',
		},
	];	

	const columnsFactura = [
		{
			title: 'Nombre',
			dataIndex: 'nombre',
			key: 'nombre',
		},
		{
			title: 'Order',
			dataIndex: 'orden',
			key: 'orden',
		},
		{
			title: 'cantidad',
			dataIndex: 'cantidad',
			key: 'cantidad',
		},
		{ 
			title: 'Unitario',
			dataIndex: 'unitario',
			key: 'unitario',
		},
		{
			title: '% Impuesto',
			dataIndex: 'impuesto',
			key: 'impuesto',
		},
		{
			title: 'Parcial',
			dataIndex: 'parcial',
			key: 'parcial',
		},
	];	

	return (
		<div className='table-component-factura'>
			<h4>Ordenes de trabajo</h4>
			<Table 
				columns={ columnsTo }
				dataSource={ dataTo }
				key="dataToKey"
			/>

			<Table 
				columns={ columnsFactura }
				dataSource={ dataFactura }
				className="pt-2"
				key="dataFacturaKey"
			/>
		</div>
	)
}

export default TableComponent;