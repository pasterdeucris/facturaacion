import { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Table, Button, DatePicker, Row, Col, Form, Input, Checkbox } from 'antd';
import { toast } from 'react-toastify';

import { updateDocumentoApi } from '../../../api/document';
import { saveInvoiceApi } from '../../../api/invoices';

import ModalComponent from '../ModalComponent';

function ListComponent({ 
	data, 
	setDateInit, 
	setDateEnd, 
	searchDocuments,
	setConsecutivoDian,
	setDocument,
	clientsData,
	documentsTypeData,
	actionSelectedDocuments,
	documentsCheckbox,
	setCheckboxDocuments,
	getFacturacionElectronica,
	onExportJSON,
	sendXML
}) {

	const [form] = Form.useForm();

	const [showModalFacturacionElectronica, setShowModalFacturacionElectronica] = useState(false);
	const [indeterminate, setIndeterminate] = useState(false);
	const [checkAll, setCheckAll] = useState(false);

	const onCheckAllChange = (e) => {
		if(e.target.checked == true) {
			const ids = data.map(item => item.documento_id);
			setCheckboxDocuments(ids);
		} else {
			setCheckboxDocuments( [] );
		}

    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

	const columns = [
		{
			title: 'Opciones',
			dataIndex: 'ops',
			key: 'ops',
			render: (_, record, index) => {
				return (
					<>
						<Button 
							type="primary"
						>
							<SearchOutlined />
						</Button>
						<Checkbox 
							style={{ marginLeft: '2em' }} 
							onChange={ (e) => actionSelectedDocuments(record.documento_id, e.target.checked) } 
							checked={documentsCheckbox.includes(record.documento_id)}
						/>
					</>
				)
			}
		},
		{
			title: '# Interno',
			dataIndex: 'documento_id',
			key: 'documento_id',
		},
		{
			title: 'Consecutivo',
			dataIndex: 'consecutivo_dian',
			key: 'consecutivo_dian',
		},
		{
			title: 'Total',
			dataIndex: 'total',
			key: 'total',
			render: (_, record, index) => {
				return (
					<>
						${ record.total }
					</>
				)
			}
		},
		{
			title: 'Cliente',
			dataIndex: 'cliente_id',
			key: 'cliente_id',
			render: (_, record, index) => {
				return (
					<>
						{ clientsData.find(el => el.cliente_id == (record.cliente_id ? record.cliente_id : 1))?.nombre } 
						&nbsp;
						{ clientsData.find(el => el.cliente_id == (record.cliente_id ? record.cliente_id : 1))?.apellidos } 
					</>
					);
			}
		},
		{
			title: 'Tipo documento',
			dataIndex: 'tipo_documento_id',
			key: 'tipo_documento_id',
			render: (_, record, index) => {
				return (
					<>
						{ documentsTypeData.find(el => el.tipo_documento_id == record.tipo_documento_id)?.nombre } 
					</>
				)
			}
		},
		{
			title: 'Fecha',
			dataIndex: 'fecha_registro',
			key: 'fecha_registro',
			render: (_, record, index) => {
				return (
					<>
						{ new Date(record.fecha_registro).toLocaleString() }
					</>
				)
			}
		}
	];

	const ruleOutDocuments = async (event) => {
		try {
			for (const doc of documentsCheckbox) {
				const find = data.find(item => item.documento_id == doc);
				const data1 = {
					...find,
					invoice_id: 3
				}
				const data2 = {
					document_id: doc,
					documento_invoice_id: null,
					fecha_registro: new Date().toISOString(),
					invoice_id: 3,
					mensaje: "Descartado",
					status: "descartar"
				}

				await updateDocumentoApi(data1);
				await saveInvoiceApi(data2);

				await getFacturacionElectronica();
			}
			toast.success('Documentos descartados correctamente.');
			setShowModalFacturacionElectronica( false );
		} catch (error) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar descartar los documentos seleccionados.');
		}
	}
	
	return (
		<>
			<div className='dates-ranges'>
				<Form
					form={form} 
					layout="vertical"
				>
					<Row gutter={24}>

							<Col span={12}>
								<Form.Item name="date_init" label="Fecha inicial">
									<DatePicker 
										name="date_init"
										placeholder='Fecha inicial'
										style={{ width: '100%' }}
										onChange={ (date, dateString) =>  setDateInit(dateString) }
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name="date_end" label="Fecha final">
									<DatePicker 
										name="date_end"
										placeholder='Fecha final'
										style={{ width: '100%' }}
										onChange={ (date, dateString) =>  setDateEnd(dateString) }
									/>
								</Form.Item>
							</Col>

							<Col span={12}>
								<Form.Item name="dian" label="Consecutivo DIAN">
									<Input 
										name="dian"
										placeholder='Consecutivo DIAN'
										onChange={ (event) => setConsecutivoDian(event.target.value) }
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name="document" label="Número documento interno">
									<Input 
										name="document"
										placeholder='Número documento interno'
										onChange={(event) => setDocument(event.target.value)}
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>

							<Col span={3}>
								<Button 
									type='primary'
									style={{ marginBottom: '2em' }}
									onClick={ () => searchDocuments() }
								>
									Buscar
								</Button>
							</Col>
							<Col span={3}>
								<Button 
									type='primary'
									style={{ marginBottom: '2em' }}
									onClick={ () => sendXML() }
								>
									Enviar
								</Button>
							</Col>
							<Col span={3}>
								<Button 
									type='primary'
									style={{ marginBottom: '2em' }}
									onClick={ () => setShowModalFacturacionElectronica(!showModalFacturacionElectronica) }
								>
									Descartar
								</Button>
							</Col>
							<Col span={3}>
								<Button 
									type='primary'
									style={{ marginBottom: '2em' }}
									onClick={ () => onExportJSON() }
								>
									Exportar
								</Button>
							</Col>
							<Col span={3}>
							<Checkbox 
								style={{ marginLeft: '2em' }}
								indeterminate={indeterminate} 
								onChange={onCheckAllChange} 
								checked={checkAll}
							>
								Seleccionar todos
							</Checkbox>
							</Col>
					</Row>
				</Form>
			</div>
			<ModalComponent
				showModalFacturacionElectronica={ showModalFacturacionElectronica }
				setShowModalFacturacionElectronica={setShowModalFacturacionElectronica}
				text={"Los documentos seleccionados serán descartados y NO serán enviados a la DIAN mediante facturación electrónica, está seguro de descartarlos?"}
				ruleOutDocuments={ ruleOutDocuments }
			/>
			<Table 
				columns={ columns }
				dataSource={ data }
				rowKey="documento_id"
				key="envio_documento_list"
				// pagination={{ pageSize: 5}}
			/>
		</>
	)
}

export default ListComponent;