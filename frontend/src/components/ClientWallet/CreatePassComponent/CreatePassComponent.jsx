import { useState, useEffect } from 'react';
import { Modal, Row, Col, Form, Select, Input } from 'antd';
import { toast } from 'react-toastify';

import { getByDocumentoIdApi, saveAbonoApi, getAbonosApi } from '../../../api/client-wallet';
import { updateDocumentoApi } from '../../../api/document';

function CreatePassComponent({ 
	showModalCreatePass, 
	setShowModalCreatePass, 
	currentDocument
}) {

	const { Option } = Select;
	const [form] = Form.useForm();

	const [dataPass, setDataPass] = useState([]);
	const [dataAbono, setDataAbono] = useState([]);

	const [currentPaymentType, setCurrentPaymentType] = useState(null);
	const [valuePass, setValuePass] = useState('');

	const getByDocumentoId = async (documentID) => {
		try {
			const response = await getByDocumentoIdApi(documentID);
			setDataPass(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer el detalle.');
		}
	}

	const getAbonos = async (documentID) => {
		try {
			const response = await getAbonosApi(documentID);
			setDataAbono(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer el detalle de abono.');
		}
	}

	const resetForm = () => {
		form.resetFields();
		setValuePass('');
		setCurrentPaymentType(null);
	}

	useEffect(() => {
	  if(showModalCreatePass && currentDocument){
		getByDocumentoId(currentDocument);
		getAbonos(currentDocument);
	  }
	}, [showModalCreatePass])

	const tipos_pagos = [
		{ id: 1, name: 'Efectvo' },
		{ id: 2, name: 'Crédito' },
		{ id: 3, name: 'Cehque' },
		{ id: 4, name: 'Consignación' },
		{ id: 5, name: 'Tarjeta' },
		{ id: 6, name: 'vale' }
	]

	const onSubmit = async () => {

		if(!valuePass || !currentPaymentType) {
			toast.warn('Los campos son obligatorios.');
			return;
		}

		const data = {
			documento_id: currentDocument,
			tipo_pago_id: currentPaymentType,
			usuario_id: dataPass?.length > 0 && dataPass[0]?.usuario_id,
			cantidad: valuePass,
			fecha_ingreso: dataPass?.length > 0 && dataPass[0]?.fecha_registro,
			cierre_diario: dataPass?.length > 0 && dataPass[0]?.cierre_diario
		}
		
		const totalAbonos = Number(valuePass);

		if(Number(totalAbonos) > (dataPass?.length > 0 && dataPass[0]?.saldo)) {
			toast.warn('El monto del abono no puede ser mayor al saldo.');
			return;
		}

		const documentoData = {
			...dataPass[0],
			saldo: Number(dataPass[0]?.saldo) - Number(valuePass) 
		}

		try {
			await saveAbonoApi(data);
			await updateDocumentoApi(documentoData);
			toast.success('Abono guardado éxitosamente.');
			setShowModalCreatePass(!showModalCreatePass)
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al almacenar el abono.');
		} finally {
			resetForm();
		}
		
	}

	return (
		<Modal
			title="Crear Abono"
			visible={showModalCreatePass}
			onCancel={() => { setShowModalCreatePass(!showModalCreatePass); resetForm(); } }
			onOk={(e) => onSubmit(e)}
			width={800}
			forceRender
		>
			<h4>
				N° interno: { dataPass?.length > 0 && dataPass[0]?.documento_id }
			</h4>

			<h4>
				Total Factura: { dataPass?.length > 0 && dataPass[0]?.total }
			</h4>

			<Form form={form} layout="vertical">
				<Row gutter={24}>
					<Col span={12}>
						<Form.Item name="tipo_pagos" label="Tipo de pago">
							<Select 
								style={{ width: '100%', marginBottom: '12px' }}
								name="tipo_pagos"
								onChange={ ( value ) => setCurrentPaymentType(value) }
								defaultValue={''}
								required
							>
								{
									tipos_pagos.length > 0 && tipos_pagos.map((tp, index) => (
										<Option 
											value={ tp.id }
											key={ tp.id }
										>
											{ tp.name }
										</Option>
									))
								}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label="Valor" name="Valor">
							<Input
								type="text"
								name="value"
								onChange={ (e) => setValuePass(e.target.value) }
								placeholder="Valor"
								required
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			
		</Modal>
	)
}

export default CreatePassComponent;