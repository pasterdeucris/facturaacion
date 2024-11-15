import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import TableComponent from "../../components/DailyReport/TableComponent/TableComponent";
import AdminLayout from "../../layouts/AdminLayout";
import { getDocumentsByDateAndType, getDocumentsByTipoPago, getUserByRole, getDocumentsByTipoDetalle, getSalesByGroupApi, getSalesBySubGroupApi } from "../../api/invoices";
import useAuth from '../../hooks/useAuth';

function informeDiario() {

	const logged = useAuth();

	const [data, setData] = useState([]);
	const [dataCompras, setDataCompras] = useState([]);
	const [dateInit, setDateInit] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
	const [dateEnd, setDateEnd] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]);

	const getInformeDiario = async () => {
		try {
			const response = await getDocumentsByDateAndType(`${dateInit}T00:00:00`, `${dateEnd}T23:59:00`, logged?.empresa_id, "");
			setData(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer el informe diario.');
		}
	}

	const getInformeDiarioCompras = async () => {
		try {
			const response = await getDocumentsByDateAndType(dateInit, dateEnd, logged?.empresa_id, 2);
			setDataCompras(response);
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer el informe diario compras.');
		}
	}

	const getTipoDetalle = async (typeDoc) => {
        try {
            const response = await getDocumentsByTipoDetalle(dateInit, dateEnd, logged?.empresa_id, typeDoc);
            return response;
        } catch (err) {
            console.log(err);
            toast.warning('Ocurrió un error al traer el informe diaro detalle.');
        }
    }

	const getTipoDetallePorFecha = async (typeDoc, dateSelected) => {


        try {
            const response = await getDocumentsByTipoDetalle(`${dateSelected}T00:00:00`, `${dateSelected}T23:59:00`, logged?.empresa_id, typeDoc);
            return response;
        } catch (err) {
            console.log(err);
            toast.warning('Ocurrió un error al traer el informe diaro detalle.');
        }
    }

	const getDocumentsTipoPago = async () => {
		try {
			const response = await getDocumentsByTipoPago(`${dateInit}T00:00:00`, `${dateEnd}T23:59:00`, logged?.empresa_id);
			return response
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los documentos por tipo de pago.');
		}
	}

	const getDocumentsTipoPagoPorFecha = async (dateSelected) => {
		try {
			const response = await getDocumentsByTipoPago(`${dateSelected}T00:00:00`, `${dateSelected}T23:59:00`, logged?.empresa_id);
			return response
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los documentos por tipo de pago.');
		}
	}

	const getUserRole = async () => {
		try {
			const response = await getUserByRole(`${dateInit}T00:00:00`, `${dateEnd}T23:59:00`, logged?.empresa_id, 2);
			return response;
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer los usuarios por rol.');
		}
	}

	// const getTipoDetalle = async (dateInit, dateEnd) => {
	// 	try {
	// 		const response = await getDocumentsByTipoDetalle(dateInit, dateEnd, logged?.empresa_id);
	// 		setDataCompras(response);
	// 	} catch (err) {
	// 		console.log(err);
	// 		toast.warning('Ocurrió un error al traer el informe diaro detalle.');
	// 	}
	// }

	const searchWithDates = () => {
		if(dateInit > dateEnd) {
			toast.warning('La fecha inicial no puede ser mayor  a la final.');
			return;
		}

		getInformeDiario();
		getInformeDiarioCompras();
	}

	const getVentaGrupo = async () => {
		try {
			const response = await getSalesByGroupApi(`${dateInit}T00:00:00`, `${dateEnd}T23:59:00`);
			return response;
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las ventas por grupo.');
		}
	}

	const getVentaSubGrupo = async () => {
		try {
			const response = await getSalesBySubGroupApi(`${dateInit}T00:00:00`, `${dateEnd}T23:59:00`);
			return response;
		} catch (err) {
			console.log(err);
			toast.warning('Ocurrió un error al traer las ventas por grupo.');
		}
	}

	useEffect(() => {
	  if(logged) {
		getInformeDiario();
		getInformeDiarioCompras();
	  }
	}, [logged])
	

	return (
		<AdminLayout>
			<strong>Informe diario</strong>

			<br />
			<br />

			<TableComponent 
				data={data}
				setData={setData}
				dataCompras={dataCompras}
				setDateInit={setDateInit}
				setDateEnd={setDateEnd}
				searchWithDates={searchWithDates}
				logged={logged}
				getDocumentsTipoPago={getDocumentsTipoPago}
				getUserRole={getUserRole}
				getTipoDetalle={getTipoDetalle}
				getVentaGrupo={getVentaGrupo}
				getVentaSubGrupo={getVentaSubGrupo}
				getTipoDetallePorFecha={getTipoDetallePorFecha}
				getDocumentsTipoPagoPorFecha={getDocumentsTipoPagoPorFecha}
			/>
		</AdminLayout>
	)
}

export default informeDiario;