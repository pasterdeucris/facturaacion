import { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';
import { useActivations } from '../../../hooks/useActivations';
import {
	getProductsByDocumentID,
	updateProductFromDocumentApi,
	updateProductCostFromInventoryApi
} from '../../../api/document';

export default function FormEditCosts({ 
	currentDoc, 
	showFormCosts, 
	productsOpt, 
	reloadDocument,
	getProductsByBusiness,
	logged,
	clickInsertRef
}) {

	const [form] = Form.useForm();
	const { priceChange, isLoading } = useActivations(logged);
	
	const [lastDocument, setLastDocument] = useState(null);
	const [unitCost, setUnitCost] = useState(0);
	const [lastUnitPrice, setLastUnitPrice] = useState(0);
	const [publicCost, setPublicCost] = useState(0);

	const [formValues, handleInputChange, setValues, formReset] = useForm({
		nombre_producto: "",
		codigo_producto: "",
		costo_unitario: 0,
		costo_publico: 0,
	});
	
	useEffect(() => {
		if(showFormCosts) {
			getProductsByBusiness(logged?.empresa_id);
			let documentID = currentDoc?.content?.documento_id;

			getProductsByDocument(documentID);
			setTimeout(() => {
				unitCostRef?.current?.focus();
				unitCostRef?.current?.select();
			}, 600);
		}
	}, [showFormCosts])

	useEffect(() => {
		if(lastDocument && productsOpt && !isLoading) {
			const find = productsOpt.find(product => product.producto_id == lastDocument?.producto_id);
			setLastUnitPrice(find?.costo);

			if(find) {
				form.setFieldsValue({
					nombre_producto: find?.nombre,
					codigo_producto: find?.producto_id,
					costo_unitario: find?.costo,
					costo_publico: find?.costo_publico
				});
	
				setValues({
					nombre_producto: find?.nombre,
					codigo_producto: find?.producto_id,
					costo_unitario: find?.costo,
					costo_publico: find?.costo_publico
				});
	
				setUnitCost(find?.costo);
				setPublicCost(find?.costo_publico);
				unitCostRef.current.focus();
				unitCostRef.current.select();
			}
		}
	}, [lastDocument, productsOpt])

	/** Refs Focus inputs */
	const productCodeRef = useRef(null);
	const unitCostRef = useRef(null);
	const publicCostRef = useRef(null);

	const getProductsByDocument = async (documentID) => {
		try {
			setLastDocument(null);
			const response = await getProductsByDocumentID(documentID);
			if(response.length == 1) {
				setLastDocument(response[0])
			} else {
				setLastDocument(response.at(-1))
			}
			
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los productos por id de documento.');
		}
	}

	const resetForm = () => {
		form.resetFields();
		formReset();
	}

	const onClickCostPublic = () => {
		const findProduct = productsOpt.find(product => product.producto_id == lastDocument?.producto_id);

		if(findProduct?.costo_publico == publicCost) {
			clickInsertRef.current.click();
		} else {
			unitCostRef.current.focus();
			unitCostRef.current.select();
		}
	}

	const onSubmit = async () => {

		
		if(!priceChange) {
			alert('No está habilitada la opción de cambio de precios.');
			return;
		}
		const findProduct = productsOpt.find(product => product.producto_id == lastDocument?.producto_id);
		
		if(lastUnitPrice == unitCost && findProduct?.costo_publico == publicCost) {
			publicCostRef.current.focus();
			publicCostRef.current.select();

			return;
		}

		let productDocument = {
			...lastDocument,
			unitario: unitCost,
			parcial: parseFloat(lastDocument?.cantidad) * parseFloat(unitCost)
		}

		let product = {
			...findProduct,
			costo: unitCost,
			costo_publico: publicCost
		}

		try {
			await updateProductFromEntry(productDocument);
			await updateProductCostFromInventoryApi(product);
			getProductsByBusiness(logged?.empresa_id);
			setLastUnitPrice(unitCost);

			toast.success('Costo de producto actualizado para este documento.');
		} catch (err) {
			console.log(err);
			toast.warning('Error al actualizar el último producto del documento.');
		}
	}

	const updateProductFromEntry = async (product) => {
		try {
			await updateProductFromDocumentApi(product);
			reloadDocument(product.documento_id, currentDoc?.content);
		} catch (err) {
			console.log(err);
			toast.warning('Error al actualizar el producto para el documento.');
		}
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
					disabled={ true }
					placeholder="Nombre producto"
				/>
			</Form.Item>

			<Form.Item name="codigo_producto">
				<Input
					type="text"
					name="codigo_producto"
					size="middle"
					ref={productCodeRef}
					disabled={ true }
					onChange={handleInputChange}
					placeholder="Código del producto"
				/>
			</Form.Item>

			<Form.Item name="costo_unitario" label="Costo unitario">
				<InputNumber
					name="costo_unitario"
					size="middle"
					ref={unitCostRef}
					min={0}
					onKeyPress={e => { e.key == 'Enter' && onSubmit() }}
					onChange={(val) => setUnitCost(val)}
				/>
			</Form.Item>

			<Form.Item name="costo_publico" label="Costo público">
				<InputNumber
					name="costo_publico"
					size="middle"
					ref={publicCostRef}
					min={0}
					onKeyPress={e => { e.key == 'Enter' && onClickCostPublic(); }}
					onChange={(val) => setPublicCost(val)}
				/>
			</Form.Item>

		</Form>
	)
}
