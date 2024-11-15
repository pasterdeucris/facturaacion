import { useState, useEffect } from 'react';
import { Modal, Table, Input, Button, Row, Col, Form } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

import { useForm } from '../../../hooks/useForm';
import { getSubgroupsApi, storeSubgroupsApi, updateSubgroupsApi } from '../../../api/inventory';

export default function SubgroupsComponent({ setShowModalSubgroups, showModalSubgroups, logged }) {
	const [form] = Form.useForm();

	const [ formValues, handleInputChange, setValues, reset ] = useForm({
		nombre: "",
	});

	const [groups, setGroups] = useState([]);
	const [isEdit, setIsEdit] = useState(false);
	const [currentEdit, setCurrentEdit] = useState(null);

	const columns = [
		{
			title: 'Ops',
			dataIndex: 'ops',
			key: 'ops',
			render: (_, record, index) => {
				return (
					<>
						<Button 
							type="primary"
							className='button-warning'
							onClick={ () => onEditGroup(record) }
						>
							<EditOutlined />
						</Button>
					</>
				)
			}
		},
		{
			title: 'Nombre Subgrupo',
			dataIndex: 'nombre',
			key: 'nombre',
			render: (_, record, index) => {
				return (
					<>
						{
							isEdit && record.sub_grupo_id ==  currentEdit ? (
								<input 
									type="text" 
									name='nombre'
									defaultValue={ record.nombre } 
									onChange={ handleInputChange }
									onKeyPress={ (event) =>  onUpdateGroup(event, record) }
									className="td__normal"
								/>
							) : (
								<span>{ record.nombre }</span>
							)
						}
					</>
				)
			}
		},
	];

	const getGroups = async (businessID) => {
		try {
			const response = await getSubgroupsApi(businessID);
			setGroups( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los datos de subgrupos.');
		}
	}

	const onEditGroup = (currentGroup) => {
		setIsEdit( true );
		setCurrentEdit( currentGroup.sub_grupo_id );
	}

	const onSubmit = async () => {

		if(formValues.nombre == "") {
			toast.warning('El nombre del subgrupo es obligatorio');
			return;
		}

		try {
			const data = {
				empresa_id: logged?.empresa_id,
				sub_grupo_id: null,
				nombre: formValues.nombre
			}

			await storeSubgroupsApi(data);
			toast.success('Subgrupo guardado correctamente.');
			getGroups( logged?.empresa_id );
			setValues({ nombre: "" });
			form.setFieldsValue({ nombre: "" });
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar guardar el grupo.');
		}
	}

	const onUpdateGroup = async (event, currentGroup) => {
		if(event.key == 'Enter') {
			if(formValues.nombre == "") {
				toast.warning('El nombre del subgrupo es obligatorio');
				return;
			}
	
			try {
				const data = {
					...currentGroup,
					nombre: event.target.value
				}
	
				await updateSubgroupsApi(data);
				toast.success('Subrupo actualizado correctamente.');
				await getGroups( logged?.empresa_id );
				setValues({ nombre: "" });
				form.setFieldsValue({ nombre: "" });
				setIsEdit( false );
				setCurrentEdit( null );
			} catch (err) {
				console.log(err);
				toast.warning('Ocurrió un error al intentar actualizar el subgrupo.');
			}
		}
	}

	useEffect(() => {
		getGroups( logged?.empresa_id );
	}, [logged])
	

	return (
		<Modal
			title="Gestión de subgrupos"
			visible={showModalSubgroups}
			onCancel={() => setShowModalSubgroups(false)}
			okButtonProps={{ style: { display: 'none' } }}
			cancelButtonProps={{ style: { display: 'none' } }}
			forceRender
		>

			<Form form={form} >
				<Row gutter={24} style={{ marginBottom: 18 }}>
					<Col span={18}>
						<Form.Item name="nombre">
							<Input 
								name='nombre'
								onChange={ handleInputChange }
								placeholder='Inserte el nombre del grupo *'
							/>
						</Form.Item>
					</Col>
					<Col span={6}>
						<Button
							type='primary'
							onClick={ onSubmit }
						>
							Guardar
						</Button>
					</Col>
				</Row>
			</Form>

			<Table 
				columns={ columns }
				dataSource={ groups }
				rowKey="sub_grupo_id"
				key="subgroups_list"
				pagination={{ pageSize: 5}}
			/>
		</Modal>
	)
}
