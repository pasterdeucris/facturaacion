import { useState, useEffect } from 'react';
import { Row, Col, Input, Button } from 'antd';

import TableFacturaComponent from '../TableComponent';

import "./FormComponent.scss";

function FormComponent() {

	const { TextArea } = Input;
	
	return (
		<div className='form-component-factura'>
			<Row gutter={24}>
				<Col span={6}>
					<Input 
						type="text"
						placeholder='Cliente'
					/>
				</Col>
				<Col span={6}>
					<strong>
						Fecha Documento:
					</strong>
				</Col>
				<Col span={6}>
					<p>
						<strong>
							Nro documento interno:
						</strong>
					</p>
					<p>
						<strong>
							Consecutivo DIAN:
						</strong>
					</p>
					<p>
						<strong>
							Tipo documento:
						</strong>
					</p>
				</Col>
				<Col span={6}>
					<p>
						<strong>
							Vr. Exento: $0
						</strong>
					</p>
					<p>
						<strong>
							Vr. Gravado: $0
						</strong>
					</p>
					<p>
						<strong>
							Vr. IVA: $0
						</strong>
					</p>
					<p>
						<strong>
							Vr. Total: $0
						</strong>
					</p>
				</Col>

				<Col span={24}>
					<Button
						type='primary'
					>
						Agregar ordenes de trabajo
					</Button>
				</Col>

				<Col span={24}>
					<TableFacturaComponent />
				</Col>

				<Col span={24}>
					<TextArea 
						type="text"
						className='pt-2'
						placeholder='Observación'
						rows="4"
					/>
				</Col>

			</Row>
		</div>
	)
}

export default FormComponent;