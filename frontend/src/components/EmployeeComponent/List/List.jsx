import { useState, useEffect } from 'react';
import { Table, Input, Select, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { useForm } from '../../../hooks/useForm';

import "./List.scss";

function List({ employees, onEditEmployee }) {

	const { Search } = Input;
	const { Option } = Select;

	let [ formValues, handleInputChange, reset ] = useForm({
    search: '',
  });

	const [searchSelect, setSearchSelect] = useState("nombre");
	const [items, setItems] = useState([]);

	const columns = [
		{
			title: 'Nombre y apellido',
			dataIndex: 'nombre',
			key: 'nombre',
			render: (_, record, index) => {
				return (
					<div>{`${record.nombre} ${record.apellido}`}</div>
				)
			}
		},
		{
			title: 'Identificación',
			dataIndex: 'identificacion',
			key: 'identificacion',
		},
		{
			title: 'Teléfono',
			dataIndex: 'telefono',
			key: 'telefono',
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
							onClick={ () => onEditEmployee(record) }
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
			<Option value="identificacion">Identificación</Option>
		</Select>
	);

	const onSearch = () => {
		const search = formValues.search.toLowerCase();
    setItems(employees.filter((item) => item[searchSelect].toLowerCase().includes(search)));
	}

	useEffect(() => {
		setItems( employees );
	}, [employees])
	
	

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
				rowKey="empleado_id"
				key="list_employees"
				// pagination={{ pageSize: 2}}
			/>
		</div>
	)
}

export default List;