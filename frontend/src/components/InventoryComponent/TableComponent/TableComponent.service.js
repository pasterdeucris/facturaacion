export function validFields(columns) {
	if(onSearchFields('Cantidad')) {
		columns.push(
			{
				title: 'Cant.',
				dataIndex: 'cantidad',
				key: 'cantidad',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='cantidad'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'cantidad')}
								defaultValue={record.cantidad}
								className="td__number"
							/>
						</>
					)
				}
			},
		);
	}

	if(onSearchFields('Costo')) {
		columns.push(
			{
				title: 'Costo',
				dataIndex: 'costo',
				key: 'costo',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='costo'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'costo')}
								defaultValue={record.costo}
								className="td__barcode"
							/>
						</>
					)
				}
			}
		);
	}

	if(onSearchFields('Costo público')) {
		columns.push(
			{
				title: 'Público',
				dataIndex: 'costo_publico',
				key: 'costo_publico',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='costo_publico'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'costo_publico')}
								defaultValue={record.costo_publico}
								className="td__barcode"
							/>
						</>
					)
				}
			}
		);
	}

	if(onSearchFields('IVA')) {
		columns.push(
			{
				title: 'IVA',
				dataIndex: 'impuesto',
				key: 'impuesto',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='impuesto'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'impuesto')}
								defaultValue={record.impuesto}
								className="td__number"
							/>
						</>
					)
				}
			}
		);
	}

	if(onSearchFields('Pesado')) {
		columns.push(
			{
				title: 'Pesado',
				dataIndex: 'balanza',
				key: 'balanza',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='balanza'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'balanza')}
								defaultValue={record.balanza}
								className="td__number"
							/>
						</>
					)
				}
			}
		);
	}

	if(onSearchFields('Cod. Barras')) {
		columns.push(
			{
				title: 'Cod. Barras',
				dataIndex: 'codigo_barras',
				key: 'codigo_barras',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='codigo_barras'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'codigo_barras')}
								defaultValue={record.codigo_barras}
								className="td__barcode"
							/>
						</>
					)
				}
			}
		);
	}

	if(onSearchFields('Promociones')) {
		columns.push(
			{
				title: 'Prom',
				dataIndex: 'promo',
				key: 'promo',
				render: (_, record, index) => {
					return (
						<>
							<input
								type="text"
								name='promo'
								onChange={handleInputChange}
								onKeyPress={(event) => onModifyProduct(event, record, 'promo')}
								defaultValue={record.promo}
								className="td__number"
							/>
						</>
					)
				}
			}
		);
	}
}