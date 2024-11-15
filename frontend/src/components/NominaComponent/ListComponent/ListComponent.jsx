import { useState, useEffect } from 'react';
import { Table, Button, DatePicker, Row, Col, Form, Descriptions } from 'antd';

function ListComponent({ 
	data, 
	setDateInit, 
	setDateEnd, 
	searchWithDates, 
	setShowModalPrint, 
	setShowModalDetail,
	setCurrentNomina }) {

	const [form] = Form.useForm();

	const [valuesCalc, setValuesCalc] = useState({
		"subtotal": 0,
		"vales": 0,
		"productos": 0,
		"total": 0,
		"orders": 0
	});

	const columns = [
		{
			title: 'Ops',
			dataIndex: 'ops',
			key: 'ops',
			render: (_, record, index) => {
				return (
					<>
						<Button 
							type="primary"
							onClick={ () => { setShowModalDetail(value => !value); setCurrentNomina(record);  }}
						>
							Detalle
						</Button>
						<Button 
							type="ghost"
							onClick={ () => setShowModalPrint( value => !value ) }
						>
							Imprimir
						</Button>
					</>
				)
			}
		},
		{
			title: 'Nombre',
			dataIndex: 'nombre',
			key: 'nombre',
		},
		{
			title: 'Subtotal',
			dataIndex: 'subtotal',
			key: 'subtotal',
			render: (_, record, index) => {
				return (
					<>
						{ parseFloat(record?.subtotal).toFixed(2) }
					</>
				)
			}
		},
		{
			title: 'Vales',
			dataIndex: 'vales',
			key: 'vales',
		},
		{
			title: 'Productos',
			dataIndex: 'productos',
			key: 'productos',
		},
		{
			title: 'Ahorro',
			dataIndex: 'ahorro',
			key: 'ahorro',
			render: (_, record, index) => {
				return (
					<>
						{ parseFloat(record?.ahorro).toFixed(2) }
					</>
				)
			}
		},
		{
			title: 'Admon',
			dataIndex: 'admon',
			key: 'admon',
		},
		{
			title: 'Total',
			dataIndex: 'total',
			key: 'total',
			render: (_, record, index) => {
				return (
					<>
						{ parseFloat(record?.total).toFixed(2) }
					</>
				)
			}
		},
	];

	const setValuesCalculations = () => {
		let subtotal = 0;
		let vales = 0;
		let productos = 0;
		let total = 0;
		let orders = 0;

		data.forEach(item => {
			vales += parseFloat(item.vales);
			productos += parseFloat(item.productos);
			total += parseFloat(item.total);
		});

		// total += total - vales - productos
		setValuesCalc({
			subtotal: subtotal,
			vales: vales,
			productos: productos,
			total: total,
			orders: orders
		});
	}

	useEffect(() => {
		setValuesCalculations();
	}, [data])
	

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
								<Form.Item name="date_init" label="Desde">
									<DatePicker 
										name="date_init"
										placeholder='Desde'
										style={{ width: '100%' }}
										onChange={ (date, dateString) =>  setDateInit(dateString) }
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item name="date_end" label="Hasta">
									<DatePicker 
										name="date_end"
										placeholder='Hasta'
										style={{ width: '100%' }}
										onChange={ (date, dateString) =>  setDateEnd(dateString) }
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Button 
									type='primary'
									style={{ marginBottom: '2em' }}
									onClick={ () => searchWithDates() }
								>
									Buscar por fecha
								</Button>
							</Col>
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
								<Descriptions.Item label="Sub-total">
									${ valuesCalc?.subtotal }
									</Descriptions.Item>
								<Descriptions.Item label="Vales">
									${ valuesCalc?.vales }
								</Descriptions.Item>
								<Descriptions.Item label="Productos">
									${ valuesCalc?.productos }
								</Descriptions.Item>
								<Descriptions.Item label="Total">
									${ valuesCalc?.total }
								</Descriptions.Item>
								<Descriptions.Item label="Cantidad de ordenes">
									{ valuesCalc?.orders }
								</Descriptions.Item>
							</Descriptions>
						</Col>
							
					</Row>
				</Form>
			</div>
			<Table 
				columns={ columns }
				dataSource={ data }
				rowKey="empleado_id"
				key="nomina_list"
				// pagination={{ pageSize: 5}}
			/>
		</>
	)
}

export default ListComponent;