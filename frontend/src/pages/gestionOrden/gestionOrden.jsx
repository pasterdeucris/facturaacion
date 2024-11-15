import AdminLayout from "../../layouts/AdminLayout";

import ButtonBarComponent from "../../components/GestionOrdenComponent/ButtonBarComponent";
import FormFacturaComponent from "../../components/GestionOrdenComponent/FormComponent";

function GestionOrdenFactura() {
	return (
		<AdminLayout>
			<strong>Orden de Factura</strong>

			<ButtonBarComponent />
			<FormFacturaComponent />
		</AdminLayout>
	)
}

export default GestionOrdenFactura;