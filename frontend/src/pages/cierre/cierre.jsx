import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import AdminLayout from "../../layouts/AdminLayout";
import ClosingComponent from "../../components/ClosingComponent";
import { getCierreInforme, setCierreDiario } from '../../api/closing';
import useAuth from "../../hooks/useAuth";

function cierre() {

	const loggedUser = useAuth();
	const [cierresData, setCierresData] = useState(null);


	const getCierres = async (businessID) => {
		try {
			const response = await getCierreInforme(businessID);
			setCierresData(response[0]);
		} catch (err) {
			console.log(err);
			toast.warning("Ocurrió un error al obtener los cierres.");
		}
	}

	const cierreDiario = async (businessID) => {
		try {
			const response = await setCierreDiario(businessID);
			setCierresData(response[0]);
		} catch (err) {
			console.log(err);
			toast.warning("Ocurrió un error al hacer el cierre diario.");
		}
	}

	useEffect(() => {
		getCierres(loggedUser?.empresa_id);
	}, [loggedUser])


	return (
		<AdminLayout>
			<strong>Cierre diario/mensual/anual</strong>
			<ClosingComponent
				cierres={cierresData}
				logged={ loggedUser }
				getCierres={ getCierres }
				cierreDiario={ cierreDiario }
			/>
		</AdminLayout>
	)
}

export default cierre;