import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import TableComponent from "../../components/ClientWallet/TableComponent/TableComponent";
import AdminLayout from "../../layouts/AdminLayout";
import { getDocumentsByDateAndType, getDocumentsByTipoPago, getUserByRole, getDocumentsByTipoDetalle } from "../../api/invoices";
import useAuth from '../../hooks/useAuth';

function carteraClientes() {

	const logged = useAuth();

	const searchWithDates = () => {
		if(dateInit > dateEnd) {
			toast.warning('La fecha inicial no puede ser mayor  a la final.');
			return;
		}

		getInformeDiario();
		getInformeDiarioCompras();
	}

	return (
		<AdminLayout>
			<strong>Cartera clientes</strong>

			<br />
			<br />

			<TableComponent 
				logged={logged}
			/>
		</AdminLayout>
	)
}

export default carteraClientes;