import { useState, useEffect } from 'react';
import { Table, Button, Input, Select } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';
import { useActivations } from '../../../hooks/useActivations';
import { saveAuditoriaApi, updateProductInventoryApi, inactiveProductInventoryApi } from '../../../api/inventory';

import "./TableComponent.scss"

function TableComponent({ products, setProducts, logged, getProductsInventory, inventoryActives }) {

	const [formValues, handleInputChange, editdefaultValues, reset] = useForm({
		search: '',
	});

	const { activeEditInventory } = useActivations(logged);

	const { Search } = Input;
	const { Option } = Select;

	const [items, setItems] = useState([]);
	const [searchSelect, setSearchSelect] = useState("nombre");


	const onModifyProduct = async (event, currentProduct, field) => {
		let msg = `El campo ${field} ha sido modificado de ${currentProduct[field]} a ${event.target.value}`;
		if (event.key == "Enter") {
			const data = {
				...currentProduct,
				[field]: event.target.value
			}

			const index = items.findIndex(item => item.producto_id === currentProduct.producto_id);
			// Crea una copia de items
			const newItems = [...items];
			// Actualiza el producto en la copia de la lista de items
			newItems[index] = {
				...newItems[index],
				[field]: event.target.value
			}
			// Actualiza el estado de items
			setItems(newItems);
	
			const detail = `Se cambia datos del producto id ${currentProduct.producto_id} llamado ${currentProduct.nombre}`;

			await updateProductInventoryApi(data);
			const params = {
				businessID: logged?.empresa_id, 
				detail, 
				userID: logged?.userID, 
				currentValue: event.target.value, 
				latestValue: currentProduct[field], 
				aplicativo: 'Inventario físico',
				accion_auditoria: 1
			}
			await saveAuditoriaApi(params);
			// getProductsInventory(logged?.empresa_id);
			toast.success(msg);
		}
	}

	const onDeleteProduct = async (currentProduct) => {
		try {
			const data = {
				...currentProduct,
				estado: 0
			}

			const detail = `Se elimina el producto id ${currentProduct.producto_id} llamado ${currentProduct.nombre}`;

			await inactiveProductInventoryApi(data);
			getProductsInventory(logged?.empresa_id);
			const params = {
				businessID: logged?.empresa_id, 
				detail, 
				userID: logged?.userID, 
				currentValue: currentProduct.cantidad, 
				latestValue: currentProduct.cantidad, 
				aplicativo: 'Inventario físico',
				accion_auditoria: 4
			}
			await saveAuditoriaApi(params);
			toast.success('Producto eliminado correctamente.');
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al inhabilitar producto del inventario.');
		}
	}

	const onSearchFields = (field) => {
		return inventoryActives.some(item => item.nombre == field);
	}

	const columns = [
		{
			title: '',
			dataIndex: 'ops',
			key: 'ops',
			width: '3.5em',
			render: (_, record, index) => {
				return (
					<>
						<Button
							type="primary"
							className='button-danger'
							disabled={activeEditInventory ? false : true}
							onClick={() => onDeleteProduct(record)}
						>
							<DeleteOutlined />
						</Button>
					</>
				)
			}
		},
		{
			title: 'Producto',
			dataIndex: 'nombre',
			key: 'nombre',
			width: '12em',
			render: (_, record, index) => {
				return (
					<>
						<input
							type="text"
							name='nombre'
							defaultValue={record.nombre}
							onChange={handleInputChange}
							onKeyPress={(event) => onModifyProduct(event, record, 'nombre')}
							className="td__normal"
							disabled={activeEditInventory ? false : true}
						/>
					</>
				)
			}
		},
		{
			title: 'Pub. promo',
			dataIndex: 'pub_promo',
			key: 'pub_promo',
			render: (_, record, index) => {
				return (
					<>
						<input
							type="text"
							name='pub_promo'
							onChange={handleInputChange}
							onKeyPress={(event) => onModifyProduct(event, record, 'pub_promo')}
							defaultValue={record.pub_promo}
							className="td__number"
							disabled={activeEditInventory ? false : true}
						/>
					</>
				)
			}
		},
		{
			title: 'KG promo',
			dataIndex: 'kg_promo',
			key: 'kg_promo',
			render: (_, record, index) => {
				return (
					<>
						<input
							type="text"
							name='kg_promo'
							onChange={handleInputChange}
							onKeyPress={(event) => onModifyProduct(event, record, 'kg_promo')}
							defaultValue={record.kg_promo}
							className="td__number"
							disabled={activeEditInventory ? false : true}
						/>
					</>
				)
			}
		},
	];

	const searchableOptions = (
		<Select defaultValue="nombre" onChange={(val) => setSearchSelect(val)}>
			<Option value="nombre">Nombre</Option>
			<Option value="codigo_barras">Codigo de barras</Option>
		</Select>
	);

	const onSearch = () => {
		const search = formValues.search.toLowerCase();
		setItems(products.filter((item) => item[searchSelect].toLowerCase().includes(search)));
	}

	useEffect(() => {
		if (products.length) {
			setItems(products);
		}
	}, [products])

	if (onSearchFields('Cantidad')) {
		columns.push(
			{
				title: 'Cant.',
				dataIndex: 'cantidad',
				key: 'cantidad',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='cantidad'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'cantidad')}
								defaultValue={record.cantidad}
								className="td__number"
								disabled={activeEditInventory ? false : true}
							/>
						</>
					)
				}
			},
		);
	}

	if (onSearchFields('Costo')) {
		columns.push(
			{
				title: 'Costo',
				dataIndex: 'costo',
				key: 'costo',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='costo'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'costo')}
								defaultValue={record.costo}
								className="td__barcode"
								disabled={activeEditInventory ? false : true}
							/>
						</>
					)
				}
			}
		);
	}

	if (onSearchFields('Costo publico')) {
		columns.push(
			{
				title: 'Público',
				dataIndex: 'costo_publico',
				key: 'costo_publico',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='costo_publico'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'costo_publico')}
								defaultValue={record.costo_publico}
								className="td__barcode"
								disabled={activeEditInventory ? false : true}
							/>
						</>
					)
				}
			}
		);
	}

	if (onSearchFields('IVA')) {
		columns.push(
			{
				title: 'IVA',
				dataIndex: 'impuesto',
				key: 'impuesto',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='impuesto'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'impuesto')}
								defaultValue={record.impuesto}
								className="td__number"
								disabled={activeEditInventory ? false : true}
							/>
						</>
					)
				}
			}
		);
	}

	if (onSearchFields('Pesado')) {
		columns.push(
			{
				title: 'Pesado',
				dataIndex: 'balanza',
				key: 'balanza',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='balanza'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'balanza')}
								defaultValue={record.balanza}
								className="td__number"
								disabled={activeEditInventory ? false : true}
							/>
						</>
					)
				}
			}
		);
	}

	if (onSearchFields('Cod. Barras')) {
		columns.push(
			{
				title: 'Cod. Barras',
				dataIndex: 'codigo_barras',
				key: 'codigo_barras',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='codigo_barras'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'codigo_barras')}
								defaultValue={record.codigo_barras}
								className="td__barcode"
								disabled={activeEditInventory ? false : true}
							/>
						</>
					)
				}
			}
		);
	}

	if (onSearchFields('Promociones')) {
		columns.push(
			{
				title: 'Prom',
				dataIndex: 'promo',
				key: 'promo',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='promo'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'promo')}
								defaultValue={record.promo}
								className="td__number"
								disabled={activeEditInventory ? false : true}
							/>
						</>
					)
				}
			}
		);
	}

	if (onSearchFields('Utilidad')) {
		columns.push(
			{
				title: 'Utilidad',
				dataIndex: 'utilidad',
				key: 'utilidad',
			}
		);
	}

	if (onSearchFields('Diferencia')) {
		columns.push(
			{
				title: 'Diferencia',
				dataIndex: 'diferencia',
				key: 'utilidad_sugerida',
				render: (_, record, index) => {
					return (
						<>
							{Number(record.costo_publico) - Number(record.costo)}
						</>
					)
				}
			}
		);
	}



	return (
		<>
			<Search
				addonBefore={searchableOptions}
				placeholder="Buscar"
				name='search'
				size='large'
				onChange={handleInputChange}
				onSearch={onSearch}
				className='list__searchable'
			/>
			<Table
				columns={columns}
				dataSource={items}
				rowKey="producto_id"
				key="inventory_products"
				sticky={true}
				scroll={{ y: 1200 }}
				pagination={{ defaultPageSize: 500, showSizeChanger: true, pageSizeOptions: ['500', '1000', '2000', '3000'] }}
			/>
		</>
	)
}

export default TableComponent