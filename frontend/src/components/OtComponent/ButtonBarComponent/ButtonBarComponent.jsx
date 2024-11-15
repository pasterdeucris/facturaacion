import { useState } from 'react';
import { Button, Dropdown } from 'antd';

import "./ButtonBar.scss";

function ButtonBarComponent(props) {

	const { logged, nextDocument, previousDocument } = props;

	const [options, setOptions] = useState([]);

	return (
		<div className='btn-bar'>
			<Button
				size='middle'
				type='primary'
				onClick={ () => previousDocument( logged?.empresa_id ) }
			>
				Anterior
			</Button>

			<Button
				size='middle'
				type='primary'
				onClick={ () => nextDocument( logged?.empresa_id ) }
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
				Nueva Orden de trabajo
			</Button>
			<Button
				size='middle'
				type='primary'
			>
				Cerrar orden
			</Button>
			<Button
				size='middle'
				type='primary'
			>
				Reapertura de orden
			</Button>

			<Dropdown
				arrow
				placement='bottom'
				overlay={options}
			>
				<Button
					type='ghost'
					size='middle'
				>
					Opciones
				</Button>
			</Dropdown>
		</div>
	)
}

export default ButtonBarComponent