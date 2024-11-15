import { useState, useEffect } from 'react';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { Table, Button, DatePicker, Row, Col, Form, Input, Checkbox, Select } from 'antd';
import { toast } from 'react-toastify';
import { getPDF } from "../../../api/soap"
import { saveAs } from 'file-saver';

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
	setStatusInvoice,
	clientsData,
	documentsTypeData,
	actionSelectedDocuments,
	documentsCheckbox,
	setCheckboxDocuments,
	getFacturacionElectronica,
	onExportJSON,
	sendXML,
	businessData,
	logged
}) {

	const [form] = Form.useForm();
	const { Option } = Select;

	const [showModalFacturacionElectronica, setShowModalFacturacionElectronica] = useState(false);
	const [indeterminate, setIndeterminate] = useState(false);
	const [checkAll, setCheckAll] = useState(false);

	const statusAvailables = [
		{ value: "", text: 'Seleccione una opción' },
		{ value: 3, text: 'Descartados' },
		{ value: 4, text: 'En error' },
		{ value: 2, text: 'Enviados' },
		{ value: 5, text: 'OK' },
		{ value: 1, text: 'Sin enviar' },
	];

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

  const downloadPDFInvoice = async (doc) => {
	try {
		const business = businessData.find( item => item.empresa_id == logged?.empresa_id );
		
		const response = await getPDF(business.nit, doc.letra_consecutivo, doc.consecutivo_dian);
		// console.log(response.data)
		const blob = new Blob([response.data], { type: 'application/pdf' });
		const url = window.URL.createObjectURL(blob);

		const tempLink = document.createElement("a");
		tempLink.href = url;
		tempLink.setAttribute(
			"download",
			`Factura_Electronica_${doc.letra_consecutivo}${doc.consecutivo_dian}.pdf`
		);

		document.body.appendChild(tempLink);
		tempLink.click();

		document.body.removeChild(tempLink);
		window.URL.revokeObjectURL(url);
		// saveAs(blob, 'asd.pdf');
		toast.success('Documento generado éxitosamente.');
	} catch (err) {
		console.log(err);
		toast.warning("Ha ocurrido un error al intentar obtener el PDF de facturación electronica");
	}
  }

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
						<Button 
							type="danger"
							disabled={ record.letra_consecutivo && record.invoice_id != 2 ? true : false }
							onClick={ () => downloadPDFInvoice(record) }
						>
							<DownloadOutlined />
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
			title: 'Consecutivo',
			dataIndex: 'consecutivo_dian',
			key: 'consecutivo_dian',
		},
		{
			title: 'Estado final',
			dataIndex: 'invoice_id',
			key: 'invoice_id',
			render: (_, record, index) => {
				return (
					<>
						{ statusAvailables.find( item => item.value == record.invoice_id ).text }
					</>
				)
			}
		},
		{
			title: 'Total factura',
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
						{ clientsData.find(el => el.cliente_id == record.cliente_id)?.nombre } { clientsData.find(el => el.cliente_id == record.cliente_id)?.apellidos }
					</>
				)
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
			title: 'Fecha de generación',
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
				if(Number(find.invoice_id == 2)) {
					alert(`El documento de ID ${find.documento_id} no se descartó porque es status enviado.`);
					continue;
				}
				if(Number(find.invoice_id == 3)) {
					alert(`El documento de ID ${find.documento_id} ya tiene status descartado.`);
					continue;
				}

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
			toast.success('Descartar documentos finalizado.');
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
										onChange={({target}) => setConsecutivoDian(target.value)}
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name="document" label="Número documento interno">
									<Input 
										name="document"
										placeholder='Número documento interno'
										onChange={({target}) => setDocument(target.value)}
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
							<Form.Item name="estado_documento" label="Estado documento">
								<Select
									showSearch
									name="estado_documento"
									size="middle"
									placeholder="Estado documento"
									onChange={(val) => setStatusInvoice(val)}
									defaultOpen={false}
									defaultActiveFirstOption={true}
									allowClear
								>
									{
										statusAvailables.length > 0 &&
										statusAvailables.map((item, idx) => (
											<Option
												key={idx}
												value={item.value}
												disabled={idx === statusAvailables.length - 1}
											>
												{item.text}
											</Option>
										))
									}
								</Select>
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