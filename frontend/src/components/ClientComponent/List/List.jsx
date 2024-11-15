import { useState, useEffect } from 'react';
import { Table, Input, Select, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { useForm } from '../../../hooks/useForm';

import "./List.scss";

function List({ clients, modifyClient }) {

	const { Search } = Input;
	const { Option } = Select;

	let [ formValues, handleInputChange, reset ] = useForm({
		search: '',
	});

	const [searchSelect, setSearchSelect] = useState("nombre");
	const [items, setItems] = useState([]);

	const columns = [
		{
			title: 'Razón Social',
			dataIndex: 'razon_social',
			key: 'razon_social'
		},
		{
			title: 'Nombre y apellido',
			dataIndex: 'nombre',
			key: 'nombre',
			render: (_, record, index) => {
				return (
					<div>{`${record.nombre} ${record.apellidos}`}</div>
				)
			}
		},
		{
			title: 'Identificación',
			dataIndex: 'documento',
			key: 'documento',
		},
		{
			title: 'Celular',
			dataIndex: 'celular',
			key: 'celular',
		},
		{
			title: 'Tipo de persona',
			dataIndex: 'fact_tipo_empresa_id',
			key: 'fact_tipo_empresa_id',
			render: (_, record, index) => {
				const person_type = record.fact_tipo_empresa_id == 1 ? 'Jurídica y asimiladas' : 'Natural y asimiladas';
				return (
					<>
						{person_type}
					</>
				)
			}
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
							onClick={ () => modifyClient(record) }
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
    setItems(clients.filter((item) => item[searchSelect].toLowerCase().includes(search)));
	}

	useEffect(() => {
		setItems( clients );
	}, [clients])
	
	

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
				rowKey="cliente_id"
				key="list_clients"
				// pagination={{ pageSize: 2}}
			/>
		</div>
	)
}

export default List;