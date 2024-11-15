import { useState, useEffect } from 'react';
import { SearchOutlined, PrinterOutlined } from '@ant-design/icons';
import { Table, Button, DatePicker, Row, Col, Form, Descriptions } from 'antd';
import RelationComponent from '../Relation';
import GroupPricesComponent from '../GroupPrices';
import DetailComponent from '../DetailComponent';
import PrintComponent from '../PrintComponent';

function TableComponent({
    data,
    setData,
    dataCompras,
    setDateInit,
    setDateEnd,
    searchWithDates,
    logged,
    getDocumentsTipoPago,
    getUserRole,
    getTipoDetalle,
    getVentaGrupo,
    getVentaSubGrupo,
    getTipoDetallePorFecha,
    getDocumentsTipoPagoPorFecha
    // setShowModalDetail,
}) {

    const [form] = Form.useForm();

    const [showModalRelation, setShowModalRelation] = useState(false);
    const [showModalGroups, setShowModalGroups] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false);
    const [showModalPrint, setShowModalPrint] = useState(false);
    const [todayDate, setTodayDate] = useState(null);
    const [tomorrowDate, setTomorrowDate] = useState(null)
    const [pressRelation, setPressRelation] = useState(false);
    const [groupsValues, setGroupsValues] = useState([]);
    const [subgroupsValues, setSubgroupsValues] = useState([]);
    const [currentDocument, setCurrentDocument] = useState(null);

    const [valuesCalc, setValuesCalc] = useState({
        "total": 0,
        "gravable5": 0,
        "gravable19": 0,
        "iva5": 0,
        "iva19": 0,
        "excento": 0
    });
    
    useEffect(() => {
      if(!showModalPrint) {
        setShowModalPrint(null);
      }
    }, [showModalPrint])
    

    const formatDate = (date) => {
        const today = new Date(date);
        const todayFormatted = today.toISOString().split('T')[0];
    
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    
        // console.log(todayFormatted, tomorrowFormatted);
        setTodayDate(todayFormatted);
        setTomorrowDate(tomorrowFormatted);
        setShowModalDetail(true);
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
                            onClick={ () => formatDate(record.fecha) }
                        >
                            <SearchOutlined />
                        </Button>
                        <Button
                            type="ghost"
                            onClick={ () => { setShowModalPrint(!showModalPrint); setCurrentDocument(record?.fecha) } }
                        >
                            <PrinterOutlined />
                        </Button>
                    </>
                )
            }
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
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
        {
            title: 'cant. Docu',
            dataIndex: 'cant',
            key: 'cant',
            render: (_, record, index) => {
                return (
                    <>
                        {parseFloat(record?.num).toFixed(2)}
                    </>
                )
            }
        },
    ];

    const setValuesCalculations = () => {
        let total = 0;
        let gravable5 = 0;
        let gravable19 = 0;
        let iva5 = 0;
        let iva19 = 0;
        let excento = 0;

        data.forEach(item => {

            gravable5 += parseFloat(item.base_5);
            gravable19 += parseFloat(item.base_19);
            total += parseFloat(item.total);
            iva5 += parseFloat(item.iva_5);
            iva19 += parseFloat(item.iva_19);
            excento += parseFloat(item.excento);
        });

        setValuesCalc({
            total: total,
            gravable5: gravable5,
            gravable19: gravable19,
            iva5: iva5,
            iva19: iva19,
            excento: excento
        });
    }

    useEffect(() => {
        setValuesCalculations();
    }, [data])

    useEffect(() => {
        const fetchVentaGrupo = async () => {
            if(showModalGroups) {
                const ventaGrupo = await getVentaGrupo();
                setGroupsValues(ventaGrupo);
                const ventaSubgrupo = await getVentaSubGrupo();
                setSubgroupsValues(ventaSubgrupo);
            } else {
                setGroupsValues([]);
                setSubgroupsValues([]);
            }
        };
    
        fetchVentaGrupo();
    }, [showModalGroups]);

    return (
        <>
            <div className='dates-ranges'>
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Row gutter={24}>
                        <Col span={16}>
                            <Col span={12}>
                                <Form.Item name="date_init" label="Fecha inicial">
                                    <DatePicker
                                        name="date_init"
                                        placeholder='Desde'
                                        style={{ width: '100%' }}
                                        onChange={(date, dateString) => setDateInit(dateString)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="date_end" label="Fecha final">
                                    <DatePicker
                                        name="date_end"
                                        placeholder='Hasta'
                                        style={{ width: '100%' }}
                                        onChange={(date, dateString) => setDateEnd(dateString)}
                                    />
                                </Form.Item>
                            </Col>
                            <Row>
                                <Col span={8}>
                                    <Button
                                        type='primary'
                                        style={{ marginBottom: '2em' }}
                                        onClick={() => searchWithDates()}
                                    >
                                        Buscar por fecha
                                    </Button>
                                </Col>
                                <Col span={8}>
                                    <Button
                                        type='primary'
                                        style={{ marginBottom: '2em' }}
                                        onClick={() => { setShowModalRelation(!showModalRelation); setPressRelation(true); }}
                                    >
                                        Relación Entrada/Salidas
                                    </Button>
                                </Col>
                                <Col span={8}>
                                    <Button
                                        type='primary'
                                        style={{ marginBottom: '2em' }}
                                        onClick={() => setShowModalGroups(true)}
                                    >
                                        Grupos y subgrupos
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                        <Col
                            span={8}
                            style={{ marginBottom: '2em' }}
                        >
                            <Descriptions
                                title=""
                                bordered
                                size='small'
                                column={1}
                            >
                                <Descriptions.Item label="Total">
                                    ${new Intl.NumberFormat('es-ES').format(valuesCalc?.total)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Total gravable 5%">
                                    ${new Intl.NumberFormat('es-ES').format(valuesCalc?.gravable5)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Total gravable 19%">
                                    ${new Intl.NumberFormat('es-ES').format(valuesCalc?.gravable19)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Total iva 5%">
                                    ${new Intl.NumberFormat('es-ES').format(valuesCalc?.iva5)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Total iva 19%">
                                    ${new Intl.NumberFormat('es-ES').format(valuesCalc?.iva19)}
                                </Descriptions.Item>
                                <Descriptions.Item label="Excento">
                                    ${new Intl.NumberFormat('es-ES').format(valuesCalc?.excento)}
                                </Descriptions.Item>
                            </Descriptions>
                        </Col>

                    </Row>
                </Form>
            </div>

        <RelationComponent 
            showModalRelation={showModalRelation}
            setShowModalRelation={setShowModalRelation}
            data={data}
            dataCompras={dataCompras}
        />

        <GroupPricesComponent 
            showModalGroups={showModalGroups}
            setShowModalGroups={setShowModalGroups}
            groupsValues={groupsValues}
            subgroupsValues={subgroupsValues}
        />

        <DetailComponent 
            setShowModalDetail={ setShowModalDetail }
            showModalDetail={ showModalDetail }
            init={ todayDate }
            end={ tomorrowDate }
            logged={logged}
            pressRelation={pressRelation}
        />

        <PrintComponent 
            showModalPrint={showModalPrint}
            setShowModalPrint={setShowModalPrint}
            logged={logged}
            getDocumentsTipoPago={getDocumentsTipoPagoPorFecha}
            getUserRole={getUserRole}
            getTipoDetalle={getTipoDetalle}
            pressRelation={pressRelation}
            currentDocument={currentDocument}
            getTipoDetallePorFecha={getTipoDetallePorFecha}
        />

            <Table
                columns={columns}
                dataSource={pressRelation ? dataCompras : data}
                rowKey="fecha"
                key="informe_diario"
            // pagination={{ pageSize: 5}}
            />
        </>
    )
}

export default TableComponent;