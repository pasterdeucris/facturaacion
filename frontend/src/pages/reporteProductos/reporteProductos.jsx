import useAuth from '../../hooks/useAuth';

import AdminLayout from "../../layouts/AdminLayout";
import ListKardexComponent from '../../components/ProductsReportComponents/ListComponent';

function reporteProducto() {

	const logged = useAuth();

	return (
		<AdminLayout>
			<strong>Reporte de producto</strong>

			<br />

			<ListKardexComponent 
				logged={logged}
			/>
		</AdminLayout>
	)
}

export default reporteProducto;