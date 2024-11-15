import { useState, useEffect } from 'react';
import { Modal } from 'antd';

function PrintComponent() {

	const onSubmit = () => {
		console.log('Imprimiendo...');
	}

	return (
		<Modal
			title="Imprimir"
			visible={ showModalPrintEntry }
			onCancel={() => { setShowModalPrintEntry(false); }}
			onOk={ (e) => onSubmit(e) }
			okText="Imprimir"
			forceRender
		>
			PrintComponent
		</Modal>
	)
}

export default PrintComponent