import { useState, useEffect } from 'react';
import { Table, Input, Select, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { useForm } from '../../../hooks/useForm';

// import "./List.scss";

function List({ suppliers, onSupplierEdit }) {

	const { Search } = Input;
	const { Option } = Select;

	let [ formValues, handleInputChange, reset ] = useForm({
    search: '',
  });

	const [searchSelect, setSearchSelect] = useState("nombre");
	const [items, setItems] = useState([]);

	const columns = [
		{
			title: 'Nombres',
			dataIndex: 'nombre',
			key: 'nombre',
			render: (_, record, index) => {
				return (
					<div>{`${record.nombre} ${record.segundo_nombre}`}</div>
				)
			}
		},
		{
			title: 'Apellidos',
			dataIndex: 'apellidos',
			key: 'apellidos',
			render: (_, record, index) => {
				return (
					<div>{`${record.apellidos} ${record.segundo_apellido}`}</div>
				)
			}
		},
		{
			title: 'Identificación',
			dataIndex: 'documento',
			key: 'documento',
		},
		{
			title: 'Teléfono',
			dataIndex: 'celular',
			key: 'celular',
		},
		{
			title: 'Opciones',
			dataIndex: 'opciones',
			key: 'opciones',
			render: (_, record, index) => {
				return (
					<>
						<Button 
							type="primary"
							className='button-warning'
							onClick={ () => onSupplierEdit(record) }
						>
							<EditOutlined />
						</Button>
						{/* <Button 
							type="primary"
							className='button-danger'
						>
							<DeleteOutlined />
						</Button> */}
					</>
				)
			}
		},
	];
	

	const searchableOptions = (
		<Select defaultValue="nombre" onChange={ (val) => setSearchSelect(val) }>
			<Option value="nombre">Nombre</Option>
			<Option value="documento">Identificación</Option>
		</Select>
	);

	const onSearch = () => {
		const search = formValues.search.toLowerCase();
    setItems(suppliers.filter((item) => item[searchSelect].toLowerCase().includes(search)));
	}

	useEffect(() => {
		setItems( suppliers );
	}, [suppliers])
	
	

	return (
		<div className='list'>
			<Search 
				addonBefore={searchableOptions} 
				placeholder="Buscar"
				name='search'
				size='large'
				onChange={ handleInputChange }
				onSearch={ onSearch }
				className='list__searchable'
			/>
			<Table 
				columns={columns}
				dataSource={ items }
				rowKey="proveedor_id"
				key="list_suppliers"
				// pagination={{ pageSize: 2}}
			/>
		</div>
	)
}

export default List;