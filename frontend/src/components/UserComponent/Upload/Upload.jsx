import { Modal , Upload, Button, Descriptions } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import "./Upload.scss";

function UploadUsers({ showModalUpload, setShowModalUpload }) {
	return (
		<Modal
			title="Cargue masivo de Usuarios"
			visible={showModalUpload}
			onCancel={() => setShowModalUpload(false)}
			okButtonProps={{ style: { display: 'none' } }}
			// okText="Guardar"
			// onOk={ onSubmitKeys }
			forceRender
		>

		<Upload
			name="file"
		>
			<Button icon={<UploadOutlined />}>Carga tu archivo</Button>
		</Upload>

		<div className='button-upload'>
			<Button
				type='primary'
				block
			>
				Cargar				
			</Button>
			<Button
				type='primary'
				block
			>
				Descargar plantilla				
			</Button>
		</div>

		<Descriptions 
			title="User Info" 
			bordered
			column={1}
		>

			<Descriptions.Item 
				label="Total registros"
				
			>
				0
			</Descriptions.Item>
			<Descriptions.Item 
				label="Registros nuevos cargados"
				
			>
				0
			</Descriptions.Item>
			<Descriptions.Item 
				label="Registros actualizados"
				
			>
				0
			</Descriptions.Item>
			<Descriptions.Item 
				label="Registros erroneos"
				
			>
				0
			</Descriptions.Item>

		</Descriptions>

		<Button
			type='link'
			style={{ marginTop: "1em" }}
		>
			Ver detalles
		</Button>

		</Modal>
	)
}

export default UploadUsers;