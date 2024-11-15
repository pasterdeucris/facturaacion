import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import useAuth from '../../hooks/useAuth';
import { getProductsInventoryApi } from '../../api/inventory';
import { getInventoryUserIDApi } from '../../api/user';

import AdminLayout from "../../layouts/AdminLayout";
import TopComponent from '../../components/InventoryComponent/TopComponent';
import TableInventory from '../../components/InventoryComponent/TableComponent';

function inventarioFisico() {

	const logged = useAuth();

	const [products, setProducts] = useState([]);
	const [inventoryActives, setInventoryActives] = useState([]);

	const getProductsInventory = async (businessID) => {
		try {
			const response = await getProductsInventoryApi(businessID);
			setProducts( response );
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar devolver los datos del inventario.');
		}
	}

	const getInventoryByUser = async (userID) => {
		try {
			const response = await getInventoryUserIDApi(userID);
			setInventoryActives( response );
			console.log(response)
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al intentar devolver los datos de campos de inventario del usuario.');
		}
	}

	useEffect(() => {
		getProductsInventory( logged?.empresa_id );
		getInventoryByUser( logged?.userID );
	}, [logged])
	

	return (
		<AdminLayout>
			<div className='inventory'>
				<h3>
					<strong>Inventario físico</strong>
				</h3>

				<br />

				<TopComponent 
					logged={ logged }
					getProductsInventory={ getProductsInventory }
				/>

				<TableInventory 
					products={ products }
					setProducts={ setProducts }
					logged={ logged }
					getProductsInventory={ getProductsInventory }
					inventoryActives={ inventoryActives }
				/>

			</div>
		</AdminLayout>
	)
}

export default inventarioFisico;