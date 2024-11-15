import { useState, useEffect } from 'react';
import { Modal, Button, Upload, Descriptions } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import "./UploadProducts.scss";

function UploadProducts({showModalUploadProducts, setShowModalUploadProducts }) {
	return (
		<Modal
			title="Cargue masivo de productos"
			visible={showModalUploadProducts}
			onCancel={() => setShowModalUploadProducts(false)}
			okButtonProps={{ style: { display: 'none' } }}
			cancelButtonProps={{ style: { display: 'none' } }}
			forceRender
		>

		<Upload>
			<Button 
				icon={<UploadOutlined />}
			>
					Seleccionar archivo
				</Button>
		</Upload>

		<div className='buttons-upload-actions'>
			<Button
				type='primary'
			>
				Cargar 
			</Button>
			<Button
				type='primary'
			>
				Descargar plantilla 
			</Button>
		</div>

		<Descriptions 
			title=""
			bordered
			size='small'
			column={1}
		>
			<Descriptions.Item label="Total registros">0</Descriptions.Item>
			<Descriptions.Item label="Registros nuevos cargados">0</Descriptions.Item>
			<Descriptions.Item label="Registros actualizados">0</Descriptions.Item>
			<Descriptions.Item label="Registros erróneos">0</Descriptions.Item>
		</Descriptions>

			<div className='buttons-upload-actions'>
				<Button
					type='default'
				>
					Ver detalle
				</Button>
		</div>
		
		</Modal>
	)
}

export default UploadProducts