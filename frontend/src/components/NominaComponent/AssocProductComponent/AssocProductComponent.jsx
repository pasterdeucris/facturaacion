import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Input, Select } from 'antd';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';
import { storeDocumentApi, productAssociateApi } from '../../../api/nomina';

function AssocProductComponent({ showModalAProduct, setShowModalAProduct, allEmployees, logged, clickCierreNomina }) {

	const { Option } = Select;
	const { TextArea } = Input
	const [form] = Form.useForm();

	const [ formValues, handleInputChange, setValues, reset ] = useForm({
		empleado_id: "",
		valor: "",
		concepto_producto: "",
	});

	const [employeeAProduct, setemployeeAProduct] = useState(null);

	const resetForm = () => {
    form.resetFields();
		reset();
  }

	const onSubmit = async (e) => {
		const data = {
			...formValues,
			cierre_diario: 0,
			empleado_id: employeeAProduct,
			fecha_registro: new Date().toDateString(),
		}

		if(!validForm(data)) {
			return;
		}

		try {
			await productAssociateApi( data );
			toast.success('Producto asociado correctamente.');
			resetForm();
			clickCierreNomina();
			setShowModalAProduct( false );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar asociar el producto.');
		}
	}

	const validForm = ({ empleado_id, valor, concepto_producto }) => {
		if(empleado_id == "" || !empleado_id) {
			toast.warning('El campo empleado es obligatorio.');
			return false;
		}

		if(valor == "" || valor == 0) {
			toast.warning('El campo valor es obligatorio.');
			return false;
		}

		if(concepto_producto == "") {
			toast.warning('El campo concepto de producto es obligatorio.');
			return false;
		}

		return true;
	}

	return (
		<Modal
			title="Asociar producto"
			visible={ showModalAProduct }
			onCancel={() => { setShowModalAProduct(false); resetForm(); }}
			onOk={ (e) => onSubmit(e) }
			okText="Asociar"
			forceRender
		>
			<Form form={form} layout='vertical'>
				<Row gutter={24}>
					<Col span={12}>
						<Form.Item name="empleado_id" label="Empleado">
							<Select 
								style={{ width: '100%', marginBottom: '12px' }}
								name="empleado_id"
								onChange={ ( value ) => setemployeeAProduct(value) }
							>
								{
									allEmployees.map((e, index) => (
										<Option 
											value={ e.empleado_id }
											key={ index }
										>
											{ e.nombre } { e.apellido }
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name="valor" label="Valor">
							<Input 
								name='valor'
								onChange={ handleInputChange }
								placeholder='Valor'
							/>
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name="concepto_producto" label="Concepto">
							<TextArea 
								name='concepto_producto'
								rows={4}
								onChange={ handleInputChange }
								placeholder='Producto asociado'
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export default AssocProductComponent;