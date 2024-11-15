import { useState, useEffect } from 'react';
import { Modal, Table } from 'antd';
import { toast } from 'react-toastify';

import { getByDocumentoIdApi, getAbonosApi } from '../../../api/client-wallet';

function PassDetailComponent({ 
	showModalPassDetail, 
	closeModal, 
	currentDocument
}) {
	const [dataPassDetail, setDataPassDetail] = useState([]);
	const [dataAbono, setDataAbono] = useState([]);

	const tipos_pagos = [
		{ id: 1, name: 'Efectvo' },
		{ id: 2, name: 'Crédito' },
		{ id: 3, name: 'Cehque' },
		{ id: 4, name: 'Consignación' },
		{ id: 5, name: 'Tarjeta' },
		{ id: 6, name: 'vale' }
	]

	const getByDocumentoId = async (documentID) => {
		try {
			const response = await getByDocumentoIdApi(documentID);
			setDataPassDetail(response);

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

	const columns = [
        {
            title: 'Fecha registro',
            dataIndex: 'fecha_ingreso',
            key: 'fecha_ingreso',
        },
        {
            title: 'N° interno abono',
            dataIndex: 'abono_id',
            key: 'abono_id'
        },
        {
            title: 'Tipo de pago',
            dataIndex: 'tipo_pago_id',
            key: 'tipo_pago_id',
			render: (_, record, index) => {
                return (
                    <>
                        {tipos_pagos.find(item => item.id === record.tipo_pago_id)?.name}
                    </>
                )
            }
        },
		{
            title: 'Valor pagado',
            dataIndex: 'cantidad',
            key: 'cantidad'
        }
    ];

	useEffect(() => {
	  if(showModalPassDetail && currentDocument){
		getByDocumentoId(currentDocument);
		getAbonos(currentDocument);
	  }
	}, [showModalPassDetail])

	return (
		<Modal
			title="Detalle de abonos"
			visible={showModalPassDetail}
			onCancel={() => closeModal() }
			okButtonProps={{ style: { display: 'none' } }}
			cancelButtonProps={{ style: { display: 'none' } }}
			width={800}
			footer={false}
			forceRender
		>
			<h4>
				N° interno: { dataPassDetail?.length > 0 && dataPassDetail[0]?.documento_id }
			</h4>

			<br />

			<h4>
				Total Factura: { dataPassDetail?.length > 0 && dataPassDetail[0]?.total }
			</h4>

			<br />

			<h4>
				Saldo: { dataPassDetail?.length > 0 && dataPassDetail[0]?.saldo }
			</h4>

			<Table
                columns={columns}
                dataSource={dataAbono}
                key="pass_detail"
            />
			
		</Modal>
	)
}

export default PassDetailComponent;