import { useState } from 'react';
import { Button } from 'antd';

import "./ButtonBar.scss";

function ButtonBarComponent() {

	const [options, setOptions] = useState([]);

	return (
		<div className='btn-bar'>
			<Button
				size='middle'
				type='primary'
			>
				Anterior
			</Button>

			<Button
				size='middle'
				type='primary'
			>
				Siguiente
			</Button>

			<Button
				size='middle'
				type='primary'
			>
				Buscar
			</Button>
			<Button
				size='middle'
				type='primary'
			>
				Imprimir
			</Button>

			<Button
				size='middle'
				type='primary'
			>
				Nueva Factura
			</Button>
			<Button
				size='middle'
				type='primary'
			>
				Nueva cotización
			</Button>
			<Button
				size='middle'
				type='primary'
				disabled={ true }
			>
				Imprimir copia
			</Button>
		</div>
	)
}

export default ButtonBarComponent