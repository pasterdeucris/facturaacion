import { Modal } from 'antd';

function CierreComponent({ 
	showModalFacturacionElectronica, 
	setShowModalFacturacionElectronica, 
	text,
	ruleOutDocuments
}) {

	return (
		<Modal
			title="Descartar documentos seleccionados"
			visible={ showModalFacturacionElectronica }
			onCancel={() => { setShowModalFacturacionElectronica(false); }}
			onOk={ (e) => ruleOutDocuments(e) }
			okText="Descartar"
			forceRender
		>
			{ text }
		</Modal>
	)
}

export default CierreComponent;