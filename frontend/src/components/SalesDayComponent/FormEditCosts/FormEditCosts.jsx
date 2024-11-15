import { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Button, Select } from 'antd';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';
import { useActivations } from '../../../hooks/useActivations';
import {
	getProductsByDocumentID,
	updateProductFromDocumentApi,
	updateProductCostFromInventoryApi
} from '../../../api/document';

import {
	getProductByProductoCodeBar,
	getProductByProductoId
} from '../../../api/sales';

export default function FormEditCosts({
	currentDoc,
	showFormCosts,
	reloadDocument,
	logged,
	clickInsertRef,
	currentPricesByProduct,
	valuePrice,
}) {

	const [form] = Form.useForm();
	const { Option } = Select;

	const { priceChange, suggestedPrices, isLoading } = useActivations(logged);

	const [lastDocument, setLastDocument] = useState(null);
	const [unitCost, setUnitCost] = useState(0);
	const [publicCost, setPublicCost] = useState(0);
	const [currentSuggestedPrices, setCurrentSuggestedPrices] = useState([]);

	const [formValues, handleInputChange, setValues, formReset] = useForm({
		nombre_producto: "",
		codigo_producto: "",
		costo_unitario: 0,
		costo_publico: 0,
	});

	useEffect(() => {
		if (showFormCosts) {
			//getProductsByBusiness(logged?.empresa_id);
			let documentID = currentDoc?.content?.documento_id;

			getProductsByDocument(documentID);
			if(!suggestedPrices) {
				//setPublicCost(publicCostRef.current.value);
				//onSubmit(publicCostRef.current.value);
			} else {
				setTimeout(() => {
					publicCostRef?.current?.focus();
				}, 600);
			}
		}
	}, [showFormCosts])

	useEffect(() => {
		if (lastDocument && !isLoading) {
			loadProductByProductId(lastDocument?.producto_id)
			.then(find => {

				if (find) {
					const valorpublico = valuePrice && valuePrice != 0
										? valuePrice
										: (suggestedPrices ? null : find?.costo_publico)
					setPublicCost(valorpublico);

					form.setFieldsValue({
						nombre_producto: find?.nombre,
						codigo_producto: find?.producto_id,
						costo_unitario: find?.costo,
						costo_publico: valorpublico
					});

					setValues({
						nombre_producto: find?.nombre,
						codigo_producto: find?.producto_id,
						costo_unitario: find?.costo,
						costo_publico: valorpublico
					});

					setUnitCost(find?.costo);

					setTimeout(() => {
						publicCostRef?.current?.focus();
						if (!suggestedPrices) publicCostRef?.current?.select();
					}, 500);
				}

			})
		}
	}, [lastDocument])

	/** Refs Focus inputs */
	const productCodeRef = useRef(null);
	// const unitCostRef = useRef(null);
	const publicCostRef = useRef(null);

	const getProductsByDocument = async (documentID) => {
		try {
			setLastDocument(null);
			const response = await getProductsByDocumentID(documentID);

			setLastDocument(response.at(-1))
			let prices = [];
			prices.push({ price: response.at(-1)?.unitario });
			currentPricesByProduct.forEach(item => {
				prices.push({ price: item.precio_2 });
				prices.push({ price: item.precio_3 });
				prices.push({ price: item.precio_4 });
				prices.push({ price: item.precio_5 });
				prices.push({ price: item.precio_6 });
				prices.push({ price: item.precio_7 });
				prices.push({ price: item.precio_8 });
				prices.push({ price: item.precio_9 });
				prices.push({ price: item.precio_10 || 0 });
			});

			setCurrentSuggestedPrices(prices)
			// }

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los productos por id de documento.');
		}
	}

	const resetForm = () => {
		form.resetFields();
		formReset();
	}

	const setPricesSuggestedOptions = async (val) => {
		setPublicCost(val);
		await onSubmit(val)
	}

	const onSubmit = async (val = publicCost) => {
		if (suggestedPrices && !priceChange) {
			alert('No está habilitada la opción de cambio de precios.');
			return;
		}

		const findProduct = await loadProductByProductId(lastDocument?.producto_id);

		if (findProduct?.costo_publico == val) {
			clickInsertRef.current.click();
			return;
		}

		let productDocument = {
			...lastDocument,
			unitario: val,
			parcial: parseFloat(lastDocument?.cantidad) * parseFloat(val)
		}

		try {
			await updateProductFromSale(productDocument);
			// await updateProductCostFromInventoryApi(product);
			//getProductsByBusiness(logged?.empresa_id);
			clickInsertRef.current.click();

			toast.success('Costo de producto actualizado para este documento.');
		} catch (err) {
			console.log(err);
			toast.warning('Error al actualizar el último producto del documento.');
		}
	}

	const updateProductFromSale = async (product) => {
		try {
			await updateProductFromDocumentApi(product);
			reloadDocument(product.documento_id, currentDoc?.content);
		} catch (err) {
			console.log(err);
			toast.warning('Error al actualizar el producto para el documento.');
		}
	}

	useEffect(() => {
	  if(suggestedPrices) {
		setTimeout(() => {
			publicCostRef?.current?.select();
		}, 500);
	  }
	}, [suggestedPrices])

	const loadProductByCodeBar = async (codeBar) => {
		const data = await getProductByProductoCodeBar(codeBar, logged?.empresa_id);
		return data[0];
	}

	const loadProductByProductId = async (productId) =>  {
		const data = await getProductByProductoId(productId, logged?.empresa_id);
		return data[0];
	}

	const loadProductByName = async (nombre) =>  {
		const data = await getProductByName(nombre, logged?.empresa_id);
		return data[0];
	}

	if (isLoading) {
		return null;
	}


	return (
		<Form
			form={form}
			layout="inline"
			size='small'
			className='form-actions-entries'
			// initialValues={{ cantidad: 1 }}
			title='Modificar costo de último producto.'
		>
			<Form.Item name="nombre_producto">
				<Input
					type="text"
					name="nombre_producto"
					size="middle"
					// ref={barcodeRef}
					onChange={handleInputChange}
					disabled={true}
					placeholder="Nombre producto"
				/>
			</Form.Item>

			<Form.Item name="codigo_producto">
				<Input
					type="text"
					name="codigo_producto"
					size="middle"
					ref={productCodeRef}
					disabled={true}
					onChange={handleInputChange}
					placeholder="Código del producto"
				/>
			</Form.Item>

			{/* <Form.Item name="costo_unitario" label="Costo unitario">
				<InputNumber
					name="costo_unitario"
					size="middle"
					ref={unitCostRef}
					min={0}
					onKeyPress={e => { e.key == 'Enter' && onSubmit() }}
					onChange={(val) => setUnitCost(val)}
				/>
			</Form.Item> */}

			{!suggestedPrices &&
				<Form.Item name="costo_publico" label="Precio3">
					<InputNumber
						name="costo_publico"
						size="middle"
						ref={publicCostRef}
						min={0}
						onKeyPress={e => { e.key == 'Enter' && onSubmit() }}
						onChange={(val) => setPublicCost(val)}
					/>
				</Form.Item>
			}

			{suggestedPrices &&
				<Form.Item name="costo_publico">
					<Select
						showSearch
						name="costo_publico"
						size="middle"
						ref={publicCostRef}
						placeholder="Precio"
						onChange={(val) => setPricesSuggestedOptions(val)}
						defaultOpen={false}
						defaultActiveFirstOption={false}
						style={{ width: 200 }}
						allowClear
					>
						{
							currentSuggestedPrices.length > 0 &&
							currentSuggestedPrices.map((item, idx) => (
								<Option
									key={idx}
									value={item.price}
								>
									{item.price}
								</Option>
							))
						}
					</Select>
				</Form.Item>
			}

		</Form>
	)
}
