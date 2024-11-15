import { useState, useEffect } from 'react';
import { Modal, Table } from 'antd';
import { toast } from 'react-toastify';

import { getProductsByIdApi } from '../../../api/client-wallet';

function InvoiceDetailComponent({ 
	showModalInvoiceDetail, 
	setShowModalInvoiceDetail, 
	currentDocument
}) {
	const [dataInvoiceDetail, setDataInvoiceDetail] = useState([]);

	const getProductsById = async (documentID) => {
		try {
			const response = await getProductsByIdApi(documentID);
			setDataInvoiceDetail(response);

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer el detalle de abono.');
		}
	}

	const columns = [
        {
            title: 'Nombre producto',
            dataIndex: 'descripcion',
            key: 'descripcion',
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad'
        },
        {
            title: 'Valor',
            dataIndex: 'parcial',
            key: 'parcial'
        }
    ];

	useEffect(() => {
	  if(showModalInvoiceDetail && currentDocument){
		getProductsById(currentDocument);
	  }
	}, [showModalInvoiceDetail])
	

	return (
		<Modal
			title="Detalle factura"
			visible={showModalInvoiceDetail}
			onCancel={() => setShowModalInvoiceDetail(!showModalInvoiceDetail) }
			onOk={(e) => onSubmit(e)}
			okButtonProps={{ style: { display: 'none' } }}
			cancelButtonProps={{ style: { display: 'none' } }}
			width={800}
			footer={false}
			forceRender
		>
			<Table
                columns={columns}
                dataSource={dataInvoiceDetail}
                key="invoice_detail"
            />
			
		</Modal>
	)
}

export default InvoiceDetailComponent;