import { useState, useEffect } from 'react';
import { Button } from 'antd';

import CreateProductComponent from '../CreateProduct';
import GroupsComponent from '../GroupsComponent';
import SubgroupsComponent from '../SubgroupsComponent';
import UploadProductsComponent from '../UploadProducts';

import "./TopComponent.scss";

function TopComponent({ logged, getProductsInventory }) {

	const [showModalCreateProduct, setShowModalCreateProduct] = useState(false);
	const [showModalGroups, setShowModalGroups] = useState(false);
	const [showModalSubgroups, setShowModalSubgroups] = useState(false);
	const [showModalUploadProducts, setShowModalUploadProducts] = useState(false);

	return (
		<div className='top-component-inventory'>
			<Button
				type='primary'
				onClick={ () => setShowModalCreateProduct( !showModalCreateProduct ) }
			>
				Crear Producto
			</Button>
			<Button
				type='primary'
				onClick={ () => setShowModalGroups( !showModalGroups ) }
			>
				Gestión de grupos
			</Button>
			<Button
				type='primary'
				onClick={ () => setShowModalSubgroups( !showModalSubgroups ) }
			>
				Gestión de SUB Grupos
			</Button>
			<Button
				type='primary'
				onClick={ () => setShowModalUploadProducts( !showModalUploadProducts ) }
			>
				Cargue masivos de productos
			</Button>


			<CreateProductComponent 
				setShowModalCreateProduct={ setShowModalCreateProduct }
				showModalCreateProduct={ showModalCreateProduct }
				logged={ logged }
				getProductsInventory={ getProductsInventory }
			/>

			<GroupsComponent 
				showModalGroups={ showModalGroups }
				setShowModalGroups={ setShowModalGroups }
				logged={ logged }
			/>

			<SubgroupsComponent 
				showModalSubgroups={ showModalSubgroups }
				setShowModalSubgroups={ setShowModalSubgroups }
				logged={ logged }
			/>

			<UploadProductsComponent 
				showModalUploadProducts={ showModalUploadProducts }
				setShowModalUploadProducts={ setShowModalUploadProducts }
			/>
		</div>
	)
}

export default TopComponent