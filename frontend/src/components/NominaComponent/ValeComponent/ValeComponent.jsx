import { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Input, Select } from 'antd';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';
import { storeDocumentApi } from '../../../api/nomina';

function ValeComponent({ showModalVale, setShowModalVale, allEmployees, logged, clickCierreNomina }) {

	const { Option } = Select;
	const { TextArea } = Input
	const [form] = Form.useForm();

	const [ formValues, handleInputChange, setValues, reset ] = useForm();

	const [employeeVale, setEmployeeVale] = useState(null);

	const resetForm = () => {
    form.resetFields();
		reset();
  }

	const onSubmit = async (e) => {
		const data = {
			...formValues,
			empleado_id: employeeVale,
			usuario_id: logged?.userID,
			empresa_id: logged?.empresa_id
		}

		if(!validForm(data)) {
			return;
		}

		try {
			await storeDocumentApi( data );
			toast.success('Vale guardado correctamente.');
			resetForm();
			clickCierreNomina();
			setShowModalVale( false );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar guardar el vale');
		}
	}

	const validForm = ({ empleado_id, valor, concepto }) => {
		if(empleado_id == "" || !empleado_id) {
			toast.warning('El campo empleado es obligatorio.');
			return false;
		}

		if(valor == "" || valor == 0) {
			toast.warning('El campo valor es obligatorio.');
			return false;
		}

		if(concepto == "") {
			toast.warning('El campo concepto es obligatorio.');
			return false;
		}

		return true;
	}

	return (
		<Modal
			title="Crear vale"
			visible={ showModalVale }
			onCancel={() => { setShowModalVale(false); resetForm(); }}
			onOk={ (e) => onSubmit(e) }
			okText="Crear vale"
			forceRender
		>
			<Form form={form} layout='vertical'>
				<Row gutter={24}>
					<Col span={12}>
						<Form.Item name="empleado_id" label="Empleado">
							<Select 
								style={{ width: '100%', marginBottom: '12px' }}
								name="empleado_id"
								onChange={ ( value ) => setEmployeeVale(value) }
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
						<Form.Item name="concepto" label="Concepto">
							<TextArea 
								name='concepto'
								rows={4}
								onChange={ handleInputChange }
								placeholder='Concepto del vale'
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	)
}

export default ValeComponent;