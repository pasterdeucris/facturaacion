import { useState, useEffect } from 'react';
import { Descriptions, Button, Modal } from 'antd';
import { toast } from 'react-toastify';

import "./ClosingComponent.scss";

function ClosingComponent({ cierres, logged, getCierres, cierreDiario }) {

	const [confirmCierreDiario, setConfirmCierreDiario] = useState(false);

	const cierreDiarioModalStatus = () => {
		setConfirmCierreDiario(true);
	}

	const hacerCierreDiario = async () => {
		await cierreDiario(logged?.empresa_id);
		await getCierres(logged?.empresa_id);
		setConfirmCierreDiario(false);
		toast.success('Cierre diario culminado.');
	}

  return (
    <>
			<Descriptions className='cierres' title="" layout="vertical">
				<Descriptions.Item label="Cierre Diario">
				<div className='cierre'>
						<div className='cierre-valor'>
							<span>Ventas:</span>
							<span>{ cierres?.total_ventas ?? 0 }</span>
						</div>
						<div className='cierre-valor'>
							<span>Costo Ventas:</span>
							<span>{ cierres?.costo_ventas ?? 0 }</span>
						</div>
						<div className='cierre-valor'>
							<span>Ganancias:</span>
							<span>{ cierres?.ganancias ?? 0 }</span>
						</div>
						<div className='cierre-valor'>
							<span>Total IVA:</span>
							<span>{ cierres?.iva_ventas ?? 0 }</span>
						</div>
						<div className='cierre-valor'>
							<span>IVA 5%:</span>
							<span>{ cierres?.iva_5 ?? 0 }</span>
						</div>
						<div className='cierre-valor'>
							<span>IVA 19%:</span>
							<span>{ cierres?.iva_19 ?? 0 }</span>
						</div>
						<div className='cierre-valor'>
							<span>Base 5%:</span>
							<span>{ cierres?.base_5 ?? 0 }</span>
						</div>
						<div className='cierre-valor'>
							<span>Base 19%:</span>
							<span>{ cierres?.base_19 ?? 0 }</span>
						</div>
						<div className='cierre-valor'>
							<span>Exento:</span>
							<span>{ cierres?.excento ?? 0 }</span>
						</div>
						<div className='cierre-valor'>
							<Button 
								type='primary' 
								onClick={ cierreDiarioModalStatus }
							>
								Cierre diario
							</Button>
						</div>
					</div>
				</Descriptions.Item>
				<Descriptions.Item label="Cierre Mensual">
					<div className='cierre'>
						<div className='cierre-valor'>
							<span>Ventas:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Costo Ventas:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Ganancias:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Total IVA:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>IVA 5%:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>IVA 19%:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Base 5%:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Base 19%:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Exento:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<Button type='primary'>Cierre mensual</Button>
						</div>
					</div>
				</Descriptions.Item>
				<Descriptions.Item label="Cierre Anual">
				<div className='cierre'>
						<div className='cierre-valor'>
							<span>Ventas:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Costo Ventas:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Ganancias:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Total IVA:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>IVA 5%:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>IVA 19%:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Base 5%:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Base 19%:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<span>Exento:</span>
							<span>0</span>
						</div>
						<div className='cierre-valor'>
							<Button type='primary'>Cierre anual</Button>
						</div>
					</div>
				</Descriptions.Item>
			</Descriptions>
			<Modal
				title="Cierre diario"
				visible={ confirmCierreDiario }
				onCancel={() => { setConfirmCierreDiario(false); }}
				onOk={ () => hacerCierreDiario() }
				forceRender
			>
				¿Estás seguro de realizar el cierre diario?
			</Modal>
    </>
  )
}

export default ClosingComponent;