import useAuth from '../../hooks/useAuth';

import AdminLayout from "../../layouts/AdminLayout";
import ListKardexComponent from '../../components/KardexComponent/ListComponent';

function kardex() {

	const logged = useAuth();

	return (
		<AdminLayout>
			<div className="kardex">
				<h3>
					<strong>Kardex</strong>
				</h3>
			</div>

			<br />

			<ListKardexComponent 
				logged={logged}
			/>

		</AdminLayout>
	)
}

export default kardex;