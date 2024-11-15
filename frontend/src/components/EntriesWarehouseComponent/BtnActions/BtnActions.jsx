import { useEffect, useRef } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import hotkeys from 'hotkeys-js';

import SearchDocumentComponent from '../SearchDocumentComponent';
import UpdateProduct from '../UpdateProduct';

import "./BtnActions.scss";

function BtnActions({
	nextDocument,
	previousDocument,
	firstDocument,
	lastDocument,
	setShowCreateForm,
	pageOut,
	optionsDoc,
	modifyEntry,
	showModalSearchDocument,
	setShowModalSearchDocument,
	showModalEditProduct,
	setShowModalEditProduct,
	setShowUpdateForm,
	logged,
	setFormUpdateActive,
	setShowFormCosts,
	selectSpecificDocument,
	currentDoc
}) {

	const nextRef = useRef(null);
	const prevRef = useRef(null);

	const lastRef = useRef(null);
	const firstRef = useRef(null);
	const modifiedRef = useRef(null);

	// useEffect(() => {
	// 	window.addEventListener('keypress', e => {
	// 		// console.log(e.key);

	// 		let focussedTag = document.activeElement && document.activeElement.nodeName;

	// 		if (focussedTag == 'INPUT' || focussedTag == 'TEXTAREA') {
	// 			return;
	// 		}

	// 		//Nueva entrada
	// 		if (e.key == 'n') {
	// 			setShowCreateForm(true);
	// 			setShowUpdateForm(false);
	// 		}

	// 		// if(e.key == 'u') {
	// 		// 	lastRef.current?.click();
	// 		// }

	// 		//entrada anterior
	// 		if (e.key == 'a') {
	// 			prevRef.current?.click();
	// 		}

	// 		// if(e.key == 'p') {
	// 		// 	firstRef.current?.click();
	// 		// }

	// 		//entrada siguiente
	// 		if (e.key == 's') {
	// 			nextRef.current?.click();
	// 		}

	// 		//modificar entrada
	// 		if (e.key == 'm') {
	// 			modifiedRef.current?.click();
	// 		}
	// 	});

	// 	window.addEventListener('keydown', e => {
	// 		// let focussedTag = document.activeElement && document.activeElement.nodeName;

	// 		// if( focussedTag == 'INPUT' || focussedTag == 'TEXTAREA' ) {
	// 		// 	return;
	// 		// }

	// 		if (e.key == 'Escape') {
	// 			setShowUpdateForm(false);
	// 			setShowCreateForm(false);
	// 			setFormUpdateActive(false);
	// 			setShowFormCosts(false);

	// 			document.activeElement.blur();
	// 		}
	// 	});
	// }, [])

	useEffect(() => {
		const handleHotkey = (event, handler) => {
			event.preventDefault();
			handler();
		};

		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				setShowUpdateForm(false);
				setShowCreateForm(false);
				setFormUpdateActive(false);
				setShowFormCosts(false);
				document.activeElement.blur();
			}
		};

		hotkeys('n', (event) => (event.key.toLowerCase() === 'n') && handleHotkey(event, () => {
			setShowCreateForm(true);
			setShowUpdateForm(false);
		}));

		hotkeys('a', (event) => (event.key.toLowerCase() === 'a') && handleHotkey(event, () => {
			prevRef.current?.click();
		}));

		hotkeys('s', (event) => (event.key.toLowerCase() === 's') && handleHotkey(event, () => {
			nextRef.current?.click();
		}));

		hotkeys('m', (event) => (event.key.toLowerCase() === 'm') && handleHotkey(event, () => {
			modifiedRef.current?.click();
			// modifyEntry();
		}));

		hotkeys('p', (event) => (event.key.toLowerCase() === 'p') && handleHotkey(event, () => {
			printRef.current?.click();
		}));

		document.addEventListener('keydown', handleEscape);

		return () => {
			hotkeys.unbind('n');
			hotkeys.unbind('a');
			hotkeys.unbind('s');
			hotkeys.unbind('m');
			hotkeys.unbind('p');
			// hotkeys.unbind('Escape');
			document.removeEventListener('keydown', handleEscape);
		};
	}, []);

	const opts = optionsDoc.length ?
		optionsDoc.map((opt, idx) => {
			return {
				key: idx, label: (
					<a
						onClick={opt.nombre == 'Buscar Documentos Por Fecha' ?
							() => setShowModalSearchDocument(value => !value)
							: opt.nombre == 'Edición de productos' ?
								() => setShowModalEditProduct(value => !value)
								: null
						}
					>
						{opt.nombre}
					</a>)
			}
		})
		: [];

	const options = (
		<Menu
			items={opts}
		/>
	)

	return (
		<div
			className='buttons-group-entries'
		>
			<Button
				type='primary'
				size='small'
				ref={nextRef}
				onClick={nextDocument}
			>
				Siguiente
			</Button>
			<Button
				type='primary'
				size='small'
				ref={prevRef}
				onClick={previousDocument}
			>
				Anterior
			</Button>
			<Button
				type='primary'
				size='small'
				ref={firstRef}
				onClick={firstDocument}
			>
				Primera
			</Button>
			<Button
				type='primary'
				size='small'
				ref={lastRef}
				onClick={lastDocument}
			>
				Última
			</Button>
			<Button type='primary' size='small'>Buscar</Button>
			<Button type='primary' size='small'>Enviar a cartera</Button>
			<Button
				type='primary'
				size='small'
				ref={modifiedRef}
				onClick={() => modifyEntry()}
			>
				Modificar
			</Button>
			<Button
				type='primary'
				size='small'
				onClick={() => setShowCreateForm(true)}
			>
				Nueva
			</Button>
			<Button type='primary' size='small'>Imprimir</Button>
			<Dropdown
				arrow
				placement='bottom'
				overlay={options}
			>
				<Button
					type='ghost'
					size='small'
				>
					Opciones
				</Button>
			</Dropdown>
			<Button type='primary' size='small'>Costo sin iva</Button>
			<Button
				type='primary'
				size='small'
				onClick={pageOut}
			>
				Fin
			</Button>


			<SearchDocumentComponent
				setShowModalSearchDocument={setShowModalSearchDocument}
				showModalSearchDocument={showModalSearchDocument}
				logged={logged}
				selectSpecificDocument={selectSpecificDocument}
			/>

			<UpdateProduct
				setShowModalEditProduct={setShowModalEditProduct}
				showModalEditProduct={showModalEditProduct}
				logged={logged}
				setShowCreateForm={setShowCreateForm}
				setShowUpdateForm={setShowUpdateForm}
			/>
		</div>
	)
}

export default BtnActions;