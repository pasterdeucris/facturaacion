import { Modal } from 'antd';
import { toast } from 'react-toastify';

import { cierreNominaApi } from '../../../api/nomina';

function CierreComponent({ 
	showModalCierre, 
	setShowModalCierre, 
	clickCierreNomina
}) {

	const cierreNomina = async () => {
		try {
			await cierreNominaApi();
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar cerrar la nómina.');
		}
	}

	const onSubmit = async (event) => {
		try {
			await cierreNomina();
			clickCierreNomina();
			setShowModalCierre( false );
			toast.success('Cierre de nómina realizado con éxito.');

		} catch (error) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar cerrar la nómina y recuperar nomina.');
		}
	}

	return (
		<Modal
			title="Cierre total"
			visible={ showModalCierre }
			onCancel={() => { setShowModalCierre(false); }}
			onOk={ (e) => onSubmit(e) }
			okText="Entregar"
			forceRender
		>
			Estás seguro de hacer el cierre total de nómina?
		</Modal>
	)
}

export default CierreComponent;