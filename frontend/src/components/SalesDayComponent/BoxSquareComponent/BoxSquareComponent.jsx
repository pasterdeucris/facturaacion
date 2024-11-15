import { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Divider } from 'antd';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';

import "./BoxSquareComponent.scss";
import { useActivations } from '../../../hooks/useActivations';
import { useForm } from '../../../hooks/useForm';
import { getEmployeesApi } from '../../../api/employee';
import { getBusinessApi } from '../../../api/business';
import { getCuadreDeCaja, getVentasPorGrupo, getNominaPorEmpleado } from '../../../api/sales';

export default function BoxSquareComponent({ 
	showModalBoxSquare, 
	setShowModalBoxSquare, 
	logged 
}) {

	const [form] = Form.useForm();
	const [vGrupos, setVGrupos] = useState([]);
	const [employeesIDS, setEmployeesIDS] = useState([]);
	const [employeesNomina, setEmployeesNomina] = useState([]);
	const [businessData, setBusinessData] = useState([]);

	const { blockCheckBox, isLoading, cuadreDeCajaRemisiones } = useActivations(logged);

	const [ formValues, handleInputChange, setValues, reset ] = useForm({
		otros: 0,
		base: 0,

		vr_fajos: 0,
		moneda: 0,
		efectivo: 0,
		varios: 0,
		gastado: 0,
		nomina: 0,
		descuento: 0,
		propina: 0,
		total_ingresos: 0,
		total_caja: 0,
		diferencia: 0,
		consignaciones: 0
	});

	const resetForm = () => {
    	form.resetFields();
		reset();
  	}

	const getBusiness = async () => {
		try {
			const response = await getBusinessApi();
			setBusinessData(response[0]);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las las empresas.');
		}
	}

	const onSubmit = () => {
		const fields = form.getFieldsValue();

		if(formValues?.doc_impresos < 1) {
			const blob = new Blob(getCuadreTxt(fields), { type: 'text/plain;charset=utf-8' });
			
			saveAs( blob, `Cuadre_caja_${logged?.name}_${formValues?.total_facturas}` );
		} else {
			alert('No puedes usar cuadre de caja con documentos no impresos.');
		}
	}

	const getVentasGrupo = async (userID) => {
		try {
			const response = await getVentasPorGrupo(userID);
			setVGrupos(response)
		} catch (err) {
			console.log(err);
			toast.warning('Ha ocurrido un error interno al intentar recupera los datos de ventas por grupo.');
		}
	}

	const getEmployees = async (businessID) => {
		try {
			const response = await getEmployeesApi(businessID);
			const filtered = response.map( res => res.empleado_id );
			setEmployeesIDS( filtered );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los empleados.');
		}
	}

	const getEmployeesNomina = async () => {
		try {
			const response = await getNominaPorEmpleado(employeesIDS);
			setEmployeesNomina(response)
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los empleados nomina.');
		}
	}

	const getCuadreTxt = (fields) => {
		return [
			'----------------------------------------------      \n',
			'          '+ businessData?.nombre +'                \n',
			'               EFECTIVO                         	\n',
			'       '+ businessData?.represente +'             \n',
			'       NIT. '+ businessData?.nit +'  - '+ businessData?.digito_verificacion +''+ businessData?.regimen +'              \n',
			'       '+ businessData?.direccion +' '+ businessData?.barrio +'                        \n',
			'           '+ businessData?.ciudad +' '+ businessData?.departamento +'                            \n',
			'           TEL:  '+ businessData?.cel +'        	 \n',
			'CUADRE DE CAJA                                      \n',
			'FECHA: ' + new Date().toLocaleString() + '          \n',
			'CAJERO: ' + logged?.name + '                        \n',
			'CAJA:                                               \n',
			'ENTREGO: _____________________________________      \n',
			'Factura inicial: ..........                         \n',
			'Factura final: .............                        \n',
			'----------------------------------------------      \n',
			'DESCRIPCION                              TOTAL      \n',
			'----------------------------------------------      \n',
			'Total facturas: ...........: '+fields.total_facturas +'\n',
			'Abonos: ...................: '+fields.abono_dia +'\n',
			'Base: .....................: '+fields.base +'\n',
			'Cheques recogidos: ........: '+fields.cheques_recogido +'\n',
			'Otros: ....................: '+fields.otros +'\n',
			'Recargas: .................: 0 \n',
			'TOTAL MOV. DEL DIA: .......: '+fields.total_ingresos +'\n',
			'----------------------------------------------      \n',
			'VR. EN FAJOS: ...........: '+fields.vr_fajos +'\n',
			'MONEDA: ...................: '+fields.moneda +'\n',
			'EFECTIVO: .....................: '+fields.efectivo +'\n',
			'Cheques: ........: '+fields.cheques +'\n',
			'DOC. ESPECIALES: ....................: 0 \n',
			'TARJ. DEB/CRED: .................: '+fields.tarjetas +'\n',
			'CONSIGNACIONES: .................: '+fields.consignaciones +'\n',
			'VARIOS: .......: '+fields.varios +'\n',

			'VALES: ...........: '+fields.vales +'\n',
			'NOMINA: ...................: '+fields.nomina +'\n',
			'GASTOS: .....................: '+fields.gastado +'\n',
			'PROPINAS: ........: '+fields.propina +'\n',
			'VENTAS A CREDITO: ....................: 0 \n',
			'RETIROS DE CAJA: .................: '+fields.retiros_caja +'\n',
			'----------------------------------------------      \n',
			'FALTANTE: .................: $'+fields.diferencia +'\n',
			'----------------------------------------------      \n',
			'Ventas por grupo \n',
			vGrupos.map(item => item.nombre + '....$     ' + item.total + '\n'),
			employeesNomina.map(item => item.nombre + '....$     ' + item.subtotal + '\n'),
		]
	}

	const getCuadre = async (userID, businessID) => {
		try {
			const response = await getCuadreDeCaja(userID, businessID, cuadreDeCajaRemisiones);
			setValues({
				...formValues,
				total_facturas: parseFloat(response[0].total_facturas) + parseFloat(response[0].total_notas),
				doc_impresos: response[0].documentos_no_impresos,
				abono_dia: response[0].abonos,
				avance_efectivo: response[0].efectivo,
				cheques: response[0].cheques,
				efectivo: 0,//response[0].efectivo, TODO Siempre se deja en cero segun requerimientos
				cartera: response[0].cartera,
				retiros_caja: response[0].retiro_caja,
				tarjetas: response[0].tarjetas,
				vales: response[0].vales,
				total_notas: response[0].total_notas,
				consignaciones: response[0].consignacion || 0,
				// total_ingresos: parseFloat(response[0].total_facturas) + parseFloat(response[0].total_notas),
				// total_caja: parseFloat(response[0].cheques) + parseFloat(response[0].cartera)

			});

			form.setFieldsValue({
				...formValues,
				total_facturas: parseFloat(response[0].total_facturas),
				doc_impresos: response[0].documentos_no_impresos,
				abono_dia: response[0].abonos,
				avance_efectivo: response[0].efectivo,
				cheques: response[0].cheques,
				efectivo: response[0].efectivo,
				cartera: response[0].cartera,
				retiros_caja: response[0].retiro_caja,
				tarjetas: response[0].tarjetas,
				vales: response[0].vales,
				total_notas: response[0].total_notas,
				// total_ingresos: parseFloat(response[0].total_facturas) + parseFloat(response[0].total_notas),
				// total_caja: parseFloat(response[0].cheques) + parseFloat(response[0].cartera)

			});
		} catch (err) {
			console.log(err);
			toast.warning('Ha ocurrido un error interno al intentar recupera los datos del cuadre.');
		}
	}

	useEffect(() => {
		if(!blockCheckBox && !isLoading) {
			const totalIngreso = 
			parseFloat(formValues?.otros== "" ? 0 : formValues.otros) + 
			parseFloat(formValues?.base== "" ? 0 : formValues.base) + 
			parseFloat(formValues?.total_facturas== "" ? 0 : formValues.total_facturas);

			const totalCaja = 
			parseFloat(formValues?.vr_fajos== "" ? 0 : formValues.vr_fajos) +
			parseFloat(formValues?.moneda== "" ? 0 : formValues.moneda) + 
			parseFloat(formValues?.efectivo== "" ? 0 : formValues.efectivo) +
			parseFloat(formValues?.cheques== "" ? 0 : formValues.cheques) +
			parseFloat(formValues?.tarjetas== "" ? 0 : formValues.tarjetas) +
			parseFloat(formValues?.varios== "" ? 0 : formValues.varios) +
			parseFloat(formValues?.vales== "" ? 0 : formValues.vales) +
			parseFloat(formValues?.cartera== "" ? 0 : formValues.cartera) +
			parseFloat(formValues?.retiros_caja== "" ? 0 : formValues.retiros_caja) +
			parseFloat(formValues?.gastado== "" ? 0 : formValues.gastado) +
			parseFloat(formValues?.nomina== "" ? 0 : formValues.nomina) +
			parseFloat(formValues?.descuento== "" ? 0 : formValues.descuento) +
			parseFloat(formValues?.propina== "" ? 0 : formValues.propina) +
			parseFloat(formValues?.consignaciones== "" ? 0 : formValues.consignaciones);

			const consignaciones = Number( formValues?.consignaciones || 0 );

			const diferencia =
				parseFloat(totalIngreso == "" ? 0 : totalIngreso) -
				parseFloat(totalCaja == "" ? 0 : totalCaja);

			form.setFieldsValue({
				...formValues,
				total_ingresos: totalIngreso,
				total_caja: totalCaja,
				diferencia
			});

			// setValues({
			// 	...formValues,
			// 	total_ingresos: totalIngreso,
			// 	total_caja: totalCaja,
			// 	diferencia
			// });
		}
		
	}, [formValues])

	useEffect(() => {
		if(showModalBoxSquare && !blockCheckBox && !isLoading) {
			getCuadre(logged?.userID, logged?.empresa_id);
			getVentasGrupo(logged?.userID);
			getEmployees(logged?.empresa_id);
			getBusiness();
		}

		if(!blockCheckBox && !isLoading) {
			form.setFieldsValue({
				...formValues,
				total_ingresos: 0,
				total_caja: 0,
				diferencia: 0
			});
		}
	}, [showModalBoxSquare])

	useEffect(() => {
		if(employeesIDS.length) {
			getEmployeesNomina(employeesIDS);
		}
	}, [employeesIDS])
	

	return (
		<Modal
			title="Cuadre de caja"
			visible={ showModalBoxSquare }
			onCancel={() => { setShowModalBoxSquare(false); resetForm(); }}
			onOk={ (e) => onSubmit(e) }
			okText="Imprimir"
			cancelText="Cerrar"
			forceRender
			className='modal-boxsquare'
		>
			<Form 
				form={form} 
				layout='horizontal'
				initialValues={{
					total_facturas: 0,
					doc_impresos: 0,
					abono_dia: 0,
					avance_efectivo: 0,
					cheques_recogido: 0,
					otros: 0,
					base: 0,
					consignaciones: 0,
					total_ingresos: 0,
					vr_fajos: 0,
					moneda: 0,
					efectivo: 0,
					cheques: 0,
					tarjetas: 0,
					varios: 0,
					vales: 0,
					cartera: 0,
					retiros_caja: 0,
					gastado: 0,
					nomina: 0,
					descuento: 0,
					propina: 0,
					total_caja: 0,
					diferencia: 0
				}}
			>
				<Row 
					gutter={24}
					id="cuadrecaja"
				>

					<Col span={24}>
						<Form.Item name="total_facturas" label="Total facturas">
							<Input 
								name='total_facturas'
								onChange={ handleInputChange }
								placeholder='Total'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="doc_impresos" label="Doc. No impresos">
							<Input 
								name='doc_impresos'
								onChange={ handleInputChange }
								placeholder='Doc. No impresos'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="abono_dia" label="Abonos del día">
							<Input 
								name='abono_dia'
								onChange={ handleInputChange }
								placeholder='Abonos del día'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="avance_efectivo" label="Avance Efectivo">
							<Input 
								name='avance_efectivo'
								onChange={ handleInputChange }
								placeholder='Avance Efectivo'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="cheques_recogido" label="Cheques recogidos">
							<Input 
								name='cheques_recogido'
								onChange={ handleInputChange }
								placeholder='Cheques recogidos'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="otros" label="Otros">
							<Input 
								name='otros'
								onChange={ handleInputChange }
								placeholder='Otros'
								style={{ width: '50%', margin: '0px 30px' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="base" label="Base">
							<Input 
								name='base'
								onChange={ handleInputChange }
								placeholder='Base'
								style={{ width: '50%', margin: '0px 30px' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="consignaciones" label="Consignaciones">
							<Input 
								name='consignaciones'
								onChange={ handleInputChange }
								placeholder='Consignaciones'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="total_ingresos" label="Total ingresos">
							<Input 
								name='total_ingresos'
								onChange={ handleInputChange }
								placeholder='Total ingresos'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>

					<Divider />

					<Col span={24}>
						<Form.Item name="vr_fajos" label="Vr. en fajos">
							<Input 
								name='vr_fajos'
								onChange={ handleInputChange }
								placeholder='Vr. en fajos'
								style={{ width: '50%', margin: '0px 30px' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="moneda" label="Moneda">
							<Input 
								name='moneda'
								onChange={ handleInputChange }
								placeholder='Moneda'
								style={{ width: '50%', margin: '0px 30px' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="efectivo" label="Efectivo">
							<Input 
								name='efectivo'
								onChange={ handleInputChange }
								placeholder='Efectivo'
								style={{ width: '50%', margin: '0px 30px' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="cheques" label="Cheques">
							<Input 
								name='cheques'
								onChange={ handleInputChange }
								placeholder='Cheques'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="tarjetas" label="Tarjetas de credito y débito">
							<Input 
								name='tarjetas'
								onChange={ handleInputChange }
								placeholder='Tarjetas de credito y débito'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="varios" label="Varios">
							<Input 
								name='varios'
								onChange={ handleInputChange }
								placeholder='Varios'
								style={{ width: '50%', margin: '0px 30px' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="vales" label="Vales">
							<Input 
								name='vales'
								onChange={ handleInputChange }
								placeholder='Vales'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="cartera" label="Cartera">
							<Input 
								name='cartera'
								onChange={ handleInputChange }
								placeholder='Cartera'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="retiros_caja" label="Retiros Caja">
							<Input 
								name='retiros_caja'
								onChange={ handleInputChange }
								placeholder='Retiros Caja'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="gastado" label="Gastado">
							<Input 
								name='gastado'
								onChange={ handleInputChange }
								placeholder='Gastado'
								style={{ width: '50%', margin: '0px 30px' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="nomina" label="Nomina">
							<Input 
								name='nomina'
								onChange={ handleInputChange }
								placeholder='Nomina'
								style={{ width: '50%', margin: '0px 30px' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="descuento" label="Descuento">
							<Input 
								name='descuento'
								onChange={ handleInputChange }
								placeholder='Descuento'
								style={{ width: '50%', margin: '0px 30px' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="propina" label="Propina">
							<Input 
								name='propina'
								onChange={ handleInputChange }
								placeholder='Propina'
								style={{ width: '50%', margin: '0px 30px' }}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name="total_caja" label="Total en caja">
							<Input 
								name='total_caja'
								onChange={ handleInputChange }
								placeholder='Total en caja'
								style={{ width: '50%', margin: '0px 30px' }}
								disabled={ true }
							/>
						</Form.Item>
					</Col>

					<Divider />

					<Col span={24}>
						<Form.Item name="diferencia" label="Diferencia">
							<Input 
								name='diferencia'
								onChange={ handleInputChange }
								placeholder='Diferencia'
								style={{ width: '50%', margin: '0px 30px' }}
							/>
						</Form.Item>
					</Col>

				</Row>
			</Form>
		</Modal>
	)
}
