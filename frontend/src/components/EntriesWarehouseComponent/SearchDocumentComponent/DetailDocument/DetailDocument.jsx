import { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';

import { getDocumentoDetalleAPI } from "../../../../api/document";

function DetailDocument({ showModalInvoice, setShowModalInvoice, document, setCurrentDocument }) {

	const [tableFill, setTableFill] = useState([]);


	const getTableFill = async (documentID) => {
		try {
			const response = await getDocumentoDetalleAPI(documentID);
			setTableFill(response)
		} catch (err) {
			console.log(err);
		}
	}

	useEffect(() => {
		if(showModalInvoice) {
			getTableFill( document.documento_id );
		}
	}, [showModalInvoice])

	const columns = [
		{
			title: 'Nombre producto',
			dataIndex: 'descripcion',
			key: 'descripcion',
		},
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
			key: 'cantidad',
		},
		{
			title: 'Valor',
			dataIndex: 'parcial',
			key: 'parcial',
		},
	]
	

	return (
		<Modal
			title="Detalle factura"
			visible={ showModalInvoice }
			onCancel={() => { setShowModalInvoice(false); setCurrentDocument(null); }}
			width={300}
			cancelText="Cerrar"
			okButtonProps={{ style: { display: 'none' } }}
			forceRender
		>

			<div>
				<br />

				<p>
					<strong>
						Consecutivo Dian: { document?.consecutivo_dian }
					</strong>
				</p>
				<p>
					<strong>
						Número interno: { document?.documento_id }
					</strong>
				</p>
				<p>
					<strong>
						Fecha: { new Date(document?.fecha_registro).toLocaleDateString() }
					</strong>
				</p>
				<p>
					<strong>
						Total: { document?.total }
					</strong>
				</p>
				<p>
					<strong>
						Saldo: { document?.saldo }
					</strong>
				</p>
				<p>
					<strong>
						Cliente: { document?.descripcion_cliente }
					</strong>
				</p>
				<p>
					<strong>
						Proveedor:
					</strong>
				</p>

				<hr />

				<p>
					<strong>
						Detalle factura
					</strong>
				</p>
			</div>

			<Table 
				columns={ columns }
				dataSource={ tableFill }
				rowKey="documento_detalle_id"
				key="productos_detalle_factura"
				pagination={{ pageSize: 5}}
			/>

		</Modal>
	)
}

export default DetailDocument