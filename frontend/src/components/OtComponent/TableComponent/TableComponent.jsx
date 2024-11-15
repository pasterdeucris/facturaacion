import { useState, useEffect } from 'react';
import { Table } from 'antd';

import "./TableComponent.scss";

function TableComponent() {

	const [dataTo, setDataTo] = useState([]);

	const columns = [
		{
			title: 'Opciones',
			dataIndex: 'opciones',
			key: 'opciones',
		},
		{
			title: 'Nombre',
			dataIndex: 'nombre',
			key: 'nombre',
		},
		{
			title: 'Cant.',
			dataIndex: 'cantidad',
			key: 'cantidad',
		},
		{
			title: 'Precio venta',
			dataIndex: 'precio_venta',
			key: 'precio_venta',
		},
		{
			title: 'Total',
			dataIndex: 'total',
			key: 'total',
		},
	];	

	return (
		<div className='table-component-ot'>
			<Table 
				columns={ columns }
				dataSource={ dataTo }
				key="dataToKey"
			/>
		</div>
	)
}

export default TableComponent;