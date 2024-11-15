import { useState, useEffect } from 'react';
import { Modal, Table } from 'antd';
import { toast } from 'react-toastify';
import { getDocumentsByTipoDetalle } from "../../../api/invoices";

function DetailComponent({ showModalDetail, setShowModalDetail, init, end, logged, pressRelation }) {

    const [dataDetail, setDataDetail] = useState([]);

    const getTipoDetalle = async (dateInit, dateEnd) => {
        const typeDoc = pressRelation ? 2 : '';

        try {
            const response = await getDocumentsByTipoDetalle(dateInit, dateEnd, logged?.empresa_id, typeDoc);
            setDataDetail(response);
        } catch (err) {
            console.log(err);
            toast.warning('Ocurrió un error al traer el informe diaro detalle.');
        }
    }

    useEffect(() => {
        if (showModalDetail) {
            getTipoDetalle(init, end);
        }
    }, [showModalDetail])

    const columns = [
        {
            title: 'Fecha',
            dataIndex: 'fecha_registro',
            key: 'fecha_registro',
        },
        {
            title: 'Cliente',
            dataIndex: 'cliente_id',
            key: 'cliente_id',
            render: (_, record, index) => {
                return (
                    <>
                        {!record.cliente_id ? 'varios varios' : record.cliente_id}
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
            title: 'Consecutivo DIAN',
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
                        {parseFloat(record?.total).toFixed(2)}
                    </>
                )
            }
        },
        {
            title: 'Gravables 5%',
            dataIndex: 'gravables5',
            key: 'gravables5',
            render: (_, record, index) => {
                return (
                    <>
                        {parseFloat(record?.base_5).toFixed(2)}
                    </>
                )
            }
        },
        {
            title: 'Gravables 19%',
            dataIndex: 'gravables19',
            key: 'gravables19',
            render: (_, record, index) => {
                return (
                    <>
                        {parseFloat(record?.base_19).toFixed(2)}
                    </>
                )
            }
        },
        {
            title: 'Iva 5%',
            dataIndex: 'iva5',
            key: 'iva5',
            render: (_, record, index) => {
                return (
                    <>
                        {parseFloat(record?.iva_5).toFixed(2)}
                    </>
                )
            }
        },
        {
            title: 'Iva 19%',
            dataIndex: 'iva19',
            key: 'iva19',
            render: (_, record, index) => {
                return (
                    <>
                        {parseFloat(record?.iva_19).toFixed(2)}
                    </>
                )
            }
        },
        {
            title: 'Excento',
            dataIndex: 'excento',
            key: 'excento',
            render: (_, record, index) => {
                return (
                    <>
                        {parseFloat(record?.excento).toFixed(2)}
                    </>
                )
            }
        },
    ];


    return (
        <Modal
            title="Detalle del día"
            visible={showModalDetail}
            onCancel={() => { setShowModalDetail(false); }}
            width={1000}
            forceRender
        >

            <Table
                columns={columns}
                dataSource={dataDetail}
                rowKey="documento_id"
                key="detalle_informe_diario"
            // pagination={{ pageSize: 5}}
            />

        </Modal>
    )
}

export default DetailComponent;