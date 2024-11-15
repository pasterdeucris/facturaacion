import { useState, useEffect } from 'react';
import { Form, Modal, DatePicker } from 'antd';
import { toast } from 'react-toastify';

import { updateDocumentoApi } from '../../../../api/nota';

function UpdateDateDocument({
	showModalUpdateDate,
	setShowModalUpdateDate,
	onSubmit,
	setCurrentDocument,
	document
}) {

	const [form] = Form.useForm();

	const [dateEdit, setDateEdit] = useState(null);

	const onUpdateDate = async () => {

		if (!dateEdit) {
			toast.warning('Por favor inserta una fecha válida.');
			return;
		}

		// const date = new Date(dateEdit);
		// const formatdate = date.setDate(date.getDate() - 1)

		const data = {
			...document,
			fecha_registro: dateEdit
		}

		try {
			await updateDocumentoApi(data);
			toast.success('Fecha modificada éxitosamente.');
			onSubmit();
			setShowModalUpdateDate(false);
			setCurrentDocument(null);
			setDateEdit(null);
			form.setFieldsValue({ fecha: null });
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al actualizar la fecha del documento.');
		}
	}

	return (
		<Modal
			title="Cambio de fecha de documento"
			visible={showModalUpdateDate}
			onCancel={() => { setShowModalUpdateDate(false); setCurrentDocument(null); }}
			cancelText="Cerrar"
			onOk={() => onUpdateDate()}
			forceRender
		>
			<Form
				form={form}
				layout="vertical"
			>
				<Form.Item label="Nueva Fecha" name="fecha">
					<DatePicker
						placeholder='Fecha'
						size="middle"
						style={{ width: '100%' }}
						onChange={(date, dateString) => setDateEdit(dateString)}
					/>
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default UpdateDateDocument;