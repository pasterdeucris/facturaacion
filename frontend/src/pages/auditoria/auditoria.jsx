import useAuth from '../../hooks/useAuth';

import AdminLayout from "../../layouts/AdminLayout";
import ListAuditoriaComponent from '../../components/AuditoriaComponent/ListComponent';

function auditoria() {

	const logged = useAuth();

	return (
		<AdminLayout>
			<div className="auditoria">
				<h3>
					<strong>Auditoría</strong>
				</h3>
			</div>

			<br />

			<ListAuditoriaComponent 
				logged={logged}
			/>

		</AdminLayout>
	)
}

export default auditoria;