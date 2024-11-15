import { useState, useEffect } from 'react';
import { SearchOutlined, PrinterOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Table, Button, DatePicker, Row, Col, Form, Select, Checkbox, Badge } from 'antd';
import * as xlsx from 'xlsx/xlsx.mjs';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import dayjs from 'dayjs';

import { getClientWalletApi, getAbonosApi } from '../../../api/client-wallet';
import { getClientsApi } from '../../../api/client';
import { getBusinessApi } from '../../../api/business';
import InvoiceDetailComponent from '../InvoiceDetailComponent';
import PassDetailComponent from '../PassDetailComponent';
import CreatePassComponent from '../CreatePassComponent';

function TableComponent({
    logged,
}) {

    const [form] = Form.useForm();
    const { Option } = Select;

    const [showModalInvoiceDetail, setShowModalInvoiceDetail] = useState(false);
    const [showModalPassDetail, setShowModalPassDetail] = useState(false);
    const [showModalCreatePass, setShowModalCreatePass] = useState(false);
    const [currentDocument, setCurrentDocument] = useState(null)
    const [clients, setClients] = useState([]);
    const [businessData, setBusinessData] = useState([]);
    const [dataAbono, setDataAbono] = useState([]);
    const [days, setDays] = useState([]);

    const [data, setData] = useState([]);
    const [client, setClient] = useState('');
	const [dateInit, setDateInit] = useState('');
	const [dateEnd, setDateEnd] = useState('');

    const getClients = async (businessID) => {
		try {
			let response = await getClientsApi(businessID);
			setClients( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos de clientes.');
		}
	}

    const searchForWallet = async () => {
        setDays([]);

		try {
			const response = await getClientWalletApi(
                client,
                dateInit,
                dateEnd,
                '',
				logged?.empresa_id,
			);

            const updatedResponse = response.map((item) => ({
                ...item,
                days_expired: calcularDiasRestantes(item.fecha_vencimiento),
                days_expired_register: calcularDiasRestantes(item.fecha_registro),
            }));

            // console.log(updatedResponse)

			setData(updatedResponse);
            getBusiness();

		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer cartera clientes.');
		}
	}

    const calcularDiasRestantes = (fechaVencimiento) => {
        if (fechaVencimiento) {
            const hoy = dayjs();
            const vencimiento = dayjs(fechaVencimiento);
            const diasRestantes = vencimiento.diff(hoy, 'day');
            return diasRestantes;
        } else {
            return null;
        }
    };

    const getBusiness = async () => {
		try {
			const response = await getBusinessApi();
			setBusinessData(response[0]);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las las empresas.');
		}
	}

    const getAbonos = async (documentID, record) => {
		try {
			const response = await getAbonosApi(documentID);
			setDataAbono(response);
            
            const blob = new Blob(getAbonoTxt(response, record), { type: 'text/plain;charset=utf-8' });
			saveAs( blob, `soporte_abonos` );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer el detalle de abono.');
		}
	}

    const closeModal = () => {
		setShowModalPassDetail(!showModalPassDetail)
	}

    // const handleCheckboxChange = (event) => {
    //     const day = Number(event.target.name);
    //     if (days.includes(day)) {
    //         setDays(days.filter(d => d !== day));
    //     } else {
    //         if (days.length < 2) {
    //             setDays([...days, day].sort((a, b) => a - b));
    //             if (days.length === 1) {
    //                 const filteredData = data.filter(item => {
    //                     const diffDays = new Date(item['days_expired']);
    //                     return diffDays >= days[0] && diffDays <= day;
    //                 });
    //                 setData(filteredData);
    //             }
    //         } else {
    //             event.preventDefault();
    //             toast.warn('Ya has seleccionado dos días. Desmarca uno para poder seleccionar otro.');
    //         }
    //     }
    // };

    const handleCheckboxChange = (event) => {
        const day = Number(event.target.name);
        if (days.includes(day)) {
            const newDays = days.filter(d => d !== day);
            setDays(newDays);
            if (newDays.length === 1) {
                searchForWallet();
            }
        } else {
            if (days.length < 2) {
                const newDays = [...days, day].sort((a, b) => a - b);
                setDays(newDays);
                if (newDays.length === 2) {
                    const filteredData = data.filter(item => {
                        const diffDays = item['days_expired'] ? new Date(item['days_expired']) : Math.abs(new Date(item['days_expired_register']));
                        return diffDays >= newDays[0] && diffDays <= newDays[1];
                    });
                    setData(filteredData);
                }
            } else {
                event.preventDefault();
                toast.warn('Ya has seleccionado dos días. Desmarca uno para poder seleccionar otro.');
            }
        }
    };
    

    const exportToExcel = () => {
		const rows = data.map(row => ({
			fecha_registro: row.fecha_registro,
			cliente: `${clients.find(item => item.cliente_id === row.cliente_id)?.nombre} ${clients.find(item => item.cliente_id === row.cliente_id)?.apellidos}`,
			numero_interno: row.documento_id,
			consecutivo_dian: row.consecutivo_dian,
			valor_factura: row.total,
			valor_credito: row.valor,
            saldo: row.saldo
		}));

		// Crea un nuevo libro de Excel
		const workbook = xlsx.utils.book_new();
	  
		const worksheet = xlsx.utils.json_to_sheet(rows);
	  
		// Añade la hoja de cálculo al libro
		xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
	  
		// Guarda el libro en un archivo
		xlsx.writeFile(workbook, 'cartera-clientes.xlsx');
	};

    const generatePDF = async () => {
		const doc = new jsPDF();
		
		const columns = [
			{ header: 'Fecha registro', dataKey: 'fecha_registro' },
			{ header: 'Cliente', dataKey: 'cliente' },
			{ header: 'numero_interno', dataKey: 'documento_id' },
			{ header: 'Consecutivo Dian', dataKey: 'consecutivo_dian' },
			{ header: 'Valor factura', dataKey: 'total' },
			{ header: 'Valor crédito', dataKey: 'valor' },
			{ header: 'Saldo', dataKey: 'saldo' }
		];

		const processedData = data.map(item => {
			const client = clients.find(row => row.cliente_id === item.cliente_id);
			return {
				...item,
				cliente: `${client?.nombre} ${client?.apellidos}`
			};
		});
	
		autoTable(doc, {
			columns,
			body: processedData,
			styles: {
				halign: 'center',
				fontSize: 10,
			}
		});
		doc.save('cartera-clientes.pdf');
	};
    
    const getAbonoTxt = (data, record) => {
        const client = clients.find( item => item.cliente_id === record.cliente_id );

        return [
            '----------------------------------------------      \n',
            '          '+ businessData?.nombre +'                \n',
            '       '+ businessData?.represente +'             \n',
            '       NIT. '+ businessData?.nit +'  - '+ businessData?.digito_verificacion +''+ businessData?.regimen +'              \n',
            '       '+ businessData?.direccion +' '+ businessData?.barrio +'                        \n',
            '           '+ businessData?.ciudad +' '+ businessData?.departamento +'                            \n',
            '           TEL:  '+ businessData?.cel +'        	 \n',
            'ABONOS A FACTURA N°: '+ record.documento_id + '     \n',
            'FECHA FACTURA: ' + record.fecha_registro + '        \n',
            'FECHA ACTUAL: ' + new Date().toLocaleString() + '   \n',
            'CLIENTE: ' + client?.nombre + ' ' + client?.apellidos + '                        \n',
            'NIT/CC:  '+ client?.documento +'                    \n',
            'DIRECCION: '+ client?.direccion +'                  \n',
            '----------------------------------------------      \n',
            'FECHA                             #              VALOR PAGADO             \n',
            '---------------------------------------------------------------------      \n',
            data.map(item => item.fecha_ingreso + '          ' + item.abono_id + '              ' + item.cantidad + '\n').join(''),
            '           Software desarrollado por:               \n ',
            '         effectivesoftware.com.co                \n ',
            '         info@effectivesoftware.com.co           \n ',
        ];
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
                            type="ghost"
                            onClick={ () => { 
                                setShowModalPassDetail(!showModalPassDetail);
                                setCurrentDocument(record.documento_id);
                            } }
                        >
                            <SearchOutlined />
                        </Button>
                        <Button
                            type="primary"
                            onClick={ () => { 
                                setShowModalInvoiceDetail(!showModalInvoiceDetail);
                                setCurrentDocument(record.documento_id);
                            } }
                        >
                            <SearchOutlined />
                        </Button>
                        <Button
                            type="ghost"
                            onClick={ () => { 
                                setShowModalCreatePass(!showModalCreatePass);
                                setCurrentDocument(record.documento_id);
                            } }
                        >
                            <PlusCircleFilled />
                        </Button>
                        <Button
                            type="ghost"
                            size='sm'
                            onClick={ () => getAbonos(record.documento_id, record) }
                        >
                            <PrinterOutlined />
                        </Button>
                    </>
                )
            }
        },
        {
            title: 'Fecha registro',
            dataIndex: 'fecha_registro',
            key: 'fecha_registro',
            render: (_, record, index) => {
                let status = 'gray';
                if(Math.abs(record.days_expired_register) >= 30 && Math.abs(record.days_expired_register) <=60) {
                    status = 'blue';
                }
                else if(Math.abs(record.days_expired_register) >= 60 && Math.abs(record.days_expired_register) <=180) {
                    status = 'orange';
                }
                else if(Math.abs(record.days_expired_register) >= 180 && Math.abs(record.days_expired_register) <= 240) {
                    status = 'red';
                }
        
                return (
                    <>
                        <Badge.Ribbon color={status} text={<span style={{ fontSize: '10px' }}>
                            {record?.fecha_registro}
                        </span>} />
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
                        {clients.find(item => item.cliente_id === record.cliente_id)?.nombre} {clients.find(item => item.cliente_id === record.cliente_id)?.apellidos}
                    </>
                )
            }
        },
        {
            title: 'N° interno',
            dataIndex: 'documento_id',
            key: 'documento_id'
        },
        {
            title: 'Consecutivo Dian',
            dataIndex: 'consecutivo_dian',
            key: 'consecutivo_dian'
        },
        {
            title: 'Valor factura',
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
            title: 'Valor crédito',
            dataIndex: 'valor',
            key: 'valor',
            render: (_, record, index) => {
                return (
                    <>
                        {parseFloat(record?.valor).toFixed(2)}
                    </>
                )
            }
        },
        {
            title: 'Fecha de vencimiento',
            dataIndex: 'fecha_vencimiento',
            key: 'fecha_vencimiento',
            render: (_, record, index) => {
                let status = 'gray';
                if(Math.abs(record.days_expired) >= 30 && Math.abs(record.days_expired) <=60) {
                    status = 'blue';
                }
                else if(Math.abs(record.days_expired) >= 60 && Math.abs(record.days_expired) <=180) {
                    status = 'orange';
                }
                else if(Math.abs(record.days_expired) >= 180 && Math.abs(record.days_expired) <= 240) {
                    status = 'red';
                }
        
                return (
                    <>
                       { record?.fecha_vencimiento ? <Badge.Ribbon color={status} text={<span style={{ fontSize: '10px' }}>
                            {record?.fecha_vencimiento}
                        </span>} /> : null
                        }
                    </>
                )
            }
        },
        {
            title: 'Saldo',
            dataIndex: 'saldo',
            key: 'saldo',
            render: (_, record, index) => {
                return (
                    <>
                        {parseFloat(record?.saldo).toFixed(2)}
                    </>
                )
            }
        }
    ];

    useEffect(() => {
        getClients(logged?.empresa_id);
      //   getReport();
      }, [])
      

    return (
        <>
            <div className='dates-ranges'>
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Row>
                                <Col span={6} style={{ marginRight: "10px" }}>
                                    <Form.Item name="clients" label="Cliente">
                                        <Select
                                            showSearch
                                            style={{ width: '100%', marginBottom: '12px' }}
                                            name="clients"
                                            onChange={ ( value ) => setClient(value) }
                                            value={client}
                                            // filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                            filterOption={(input, option) => {
                                                const regex = new RegExp(input, 'i');
                                                const { children } = option.props;
                                                let text = '';
                                            
                                                if (Array.isArray(children)) {
                                                    text = children
                                                        .map((child) => child.props.children)
                                                        .join(' ')
                                                        .replace('-', ' ');
                                                } else {
                                                    text = children;
                                                }
                                            
                                                return regex.test(text);
                                            }}                                            
                                            allowClear
                                        >
                                            <Option value="">Seleccione una opción</Option>
                                            {
                                                clients.length > 0 &&
                                                clients.map((item, idx) => (
                                                    <Option key={idx} value={item.cliente_id}>
                                                        <span>{item.nombre}</span>
                                                        <span>{' '}</span>
                                                        <span>{item.apellidos}</span>
                                                        <span>{' - '}</span>
                                                        <span>{item?.documento}</span>
                                                    </Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6} style={{ marginRight: "10px" }}>
                                    <Form.Item name="date_init" label="Fecha inicial">
                                        <DatePicker
                                            name="date_init"
                                            placeholder='Desde'
                                            style={{ width: '100%' }}
                                            onChange={(date, dateString) => setDateInit(dateString)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="date_end" label="Fecha final">
                                        <DatePicker
                                            name="date_end"
                                            placeholder='Hasta'
                                            style={{ width: '100%' }}
                                            onChange={(date, dateString) => setDateEnd(dateString)}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3}>
                                    <Button
                                        type='primary'
                                        style={{ marginBottom: '2em' }}
                                        onClick={() => searchForWallet()}
                                    >
                                        Buscar
                                    </Button>
                                </Col>
                                <Col span={3}>
                                    <Button 
                                        style={{ marginBottom: '2em', backgroundColor: 'green', color: 'white', borderColor: 'white' }}
                                        onClick={ () => exportToExcel() }
                                        disabled={ data.length > 0 ? false : true }
                                    >
                                        Exportar xls
                                    </Button>
                                </Col>
                                <Col span={3}>
                                    <Button 
                                        type='danger'
                                        style={{ marginBottom: '2em' }}
                                        onClick={ () => generatePDF() }
                                        disabled={ data.length > 0 ? false : true }
                                    >
                                        Exportar pdf
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <strong>
                                        { client && 'TOTAL CLIENTE: $' +
                                            data.reduce((total, item) => total + (Number(item.saldo)), 0) 
                                        }
                                    </strong>
                                    <strong>
                                        { !client &&
                                        'TOTAL CARTERA: $' +
                                            data.reduce((total, item) => total + (Number(item.saldo)), 0) 
                                        }
                                    </strong>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3}>
							<Checkbox 
                                name='30' 
                                onChange={handleCheckboxChange}
                                checked={days.includes(30)}
                                disabled={data.length === 0}
                            >
                                30 días
                            </Checkbox>
						</Col>
						<Col span={3}>
							<Checkbox 
                                name='60' 
                                onChange={handleCheckboxChange}
                                checked={days.includes(60)}
                                disabled={data.length === 0}
                            >
                                60 días
                            </Checkbox>
						</Col>
						<Col span={3}>
							<Checkbox 
                                name='180' 
                                onChange={handleCheckboxChange}
                                checked={days.includes(180)}
                                disabled={data.length === 0}
                            >
                                180 días
                            </Checkbox>
						</Col>
                        <Col span={3}>
							<Checkbox 
                                name='240' 
                                onChange={handleCheckboxChange}
                                checked={days.includes(240)}
                                disabled={data.length === 0}
                            >
                                240 días
                            </Checkbox>
						</Col>
                    </Row>
                </Form>
            </div>

            <br />

            <PassDetailComponent 
                showModalPassDetail={showModalPassDetail}
                closeModal={closeModal}
                currentDocument={currentDocument}
            /> 

            <InvoiceDetailComponent 
                showModalInvoiceDetail={showModalInvoiceDetail}
                setShowModalInvoiceDetail={setShowModalInvoiceDetail}
                currentDocument={currentDocument}
            /> 

            <CreatePassComponent 
                showModalCreatePass={showModalCreatePass}
                setShowModalCreatePass={setShowModalCreatePass}
                currentDocument={currentDocument}
            /> 

            <Table
                columns={columns}
                dataSource={data}
                rowKey="fecha"
                key="informe_diario"
            // pagination={{ pageSize: 5}}
            />
        </>
    )
}

export default TableComponent;