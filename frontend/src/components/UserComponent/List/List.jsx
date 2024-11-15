import { useState, useEffect } from 'react';
import { Table, Input, Select, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { useForm } from '../../../hooks/useForm';

// import "./List.scss";

function List({ users, onUserEdit, modalEmpleados, modalOptions }) {

	const { Search } = Input;
	const { Option } = Select;

	let [ formValues, handleInputChange,, reset ] = useForm({
    search: '',
  });

	const [searchSelect, setSearchSelect] = useState("nombre");
	const [items, setItems] = useState([]);

	const columns = [
		{
			title: 'Nombre',
			dataIndex: 'nombre',
			key: 'nombre'
		},
		{
			title: 'Roles',
			dataIndex: 'role',
			key: 'role'
		},
		{
			title: 'Correo',
			dataIndex: 'correo',
			key: 'correo',
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
							onClick={ () => onUserEdit(record) }
						>
							<EditOutlined />
						</Button>

						<Button 
							type="primary"
							className='button-danger'
							onClick={ () => modalOptions(record) }
						>
							Opciones
						</Button>

						<Button 
							type="default"
							onClick={ () => modalEmpleados(record) }
						>
							Empleados
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
			<Option value="correo">Email</Option>
		</Select>
	);

	const onSearch = () => {
		const search = formValues.search.toLowerCase();
    setItems(users.filter((item) => item[searchSelect].toLowerCase().includes(search)));
	}

	useEffect(() => {
		setItems( users );
	}, [users])
	
	

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
				rowKey="usuario_id"
				key="list_users"
				// pagination={{ pageSize: 2}}
			/>
		</div>
	)
}

export default List;