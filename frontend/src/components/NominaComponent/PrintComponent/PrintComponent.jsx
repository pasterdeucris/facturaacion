import { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';

function PrintComponent({ showModalPrint, setShowModalPrint, printOptions }) {

	const [values, setValues] = useState({});

	const onChangeText = (event) => {
		setValues({
			...values,
			[ event.target.name ]: event.target.value
		});
	}

	const onSubmit = () => {
		alert('No tiene un tipo de impresión.');
	}

	return (
		<Modal
			title="Imprimir desprendible"
			visible={ showModalPrint }
			onCancel={() => { setShowModalPrint(false); }}
			onOk={ (e) => onSubmit(e) }
			okText="Imprimir"
			forceRender
		>

				{
					printOptions.map((print, idx) => (
						<li key={idx}>
							<strong>
								{ idx + 1 }. { print.nombre_impresora }
							</strong>
						</li>
					))
				}

				<Input 
					name='print_number'
					maxLength={1}
					placeholder='Digite el nro de la impresora'
					style={{ margin: '2em 0' }}
					onChange={ onChangeText }
				/>


		</Modal>
	)
}

export default PrintComponent