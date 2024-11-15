import { useEffect, useRef } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import hotkeys from 'hotkeys-js';
import { toast } from 'react-toastify';

import SearchDocumentComponent from '../SearchDocumentComponent';
import BoxSquareComponent from '../BoxSquareComponent';
import PrintComponent from '../PrintComponent';
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
	showModalBoxSquare,
	setShowModalBoxSquare,
	setShowUpdateForm,
	showUpdateForm,
	showModalPrintSale,
	setShowModalPrintSale,
	logged,
	setFormUpdateActive,
	setShowFormCosts,
	selectSpecificDocument,
	currentDoc,
	resetListSales,
	getAllDocuments,
	productsOpt,
	currentDocumentID,
	currentProducts,
	dataProporcion
}) {

	const nextRef = useRef(null);
	const prevRef = useRef(null);
	const printRef = useRef(null);

	const lastRef = useRef(null);
	const firstRef = useRef(null);
	const modifiedRef = useRef(null);

	// useEffect(() => {
	// 	let focussedTag = document.activeElement && document.activeElement.nodeName;
	
	// 	if (focussedTag === 'INPUT' || focussedTag === 'TEXTAREA') {
	// 		if (keysPressed['Escape']) {
	// 			setShowUpdateForm(false);
	// 			setShowCreateForm(false);
	// 			setFormUpdateActive(false);
	// 			setShowFormCosts(false);
	// 			getAllDocuments();
			
	// 			document.activeElement.blur();
	// 		}
	// 	  	return;
	// 	}
	
	// 	//Nueva venta
	// 	if (keysPressed['n']) {
	// 	  setShowCreateForm(true);
	// 	  setShowUpdateForm(false);
	// 	}
	
	// 	//entrada anterior
	// 	if (keysPressed['a']) {
	// 	  prevRef.current?.click();
	// 	}
	
	// 	//entrada siguiente
	// 	if (keysPressed['s']) {
	// 	  nextRef.current?.click();
	// 	}
	
	// 	//modificar entrada
	// 	if (keysPressed['m']) {
	// 	  modifiedRef.current?.click();
	// 	}
	
	// 	//Abrir modal de impresión
	// 	if (keysPressed['p']) {
	// 	  printRef.current?.click();
	// 	}

	// 	if (keysPressed['Escape']) {
	// 		setShowUpdateForm(false);
	// 		setShowCreateForm(false);
	// 		setFormUpdateActive(false);
	// 		setShowFormCosts(false);
	  
	// 		document.activeElement.blur();
	// 	  }
	//   }, [keysPressed]);

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
			modifyEntry(currentDoc);
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
								: opt.nombre == 'Cuadre de caja' ?
									() => setShowModalBoxSquare(value => !value)
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
			className='buttons-group-sales'
			id='buttons-sales'
		>
			<Button
				type='primary'
				size='middle'
				ref={nextRef}
				onClick={nextDocument}
			>
				Siguiente
			</Button>
			<Button
				type='primary'
				size='middle'
				ref={prevRef}
				onClick={previousDocument}
			>
				Anterior
			</Button>
			<Button
				type='primary'
				size='middle'
				ref={firstRef}
				onClick={firstDocument}
			>
				Primera
			</Button>
			<Button
				type='primary'
				size='middle'
				ref={lastRef}
				onClick={lastDocument}
			>
				Última
			</Button>
			<Button
				type='primary'
				size='middle'
				onClick={() => setShowModalSearchDocument(value => !value)}
			>
				Buscar
			</Button>
			<Button
				type='primary'
				size='middle'
				ref={modifiedRef}
				onClick={() => modifyEntry(currentDoc)}
			>
				Modificar
			</Button>
			<Button
				type='primary'
				size='middle'
				onClick={() => setShowCreateForm(true)}
			>
				Nueva
			</Button>
			<Button
				type='primary'
				size='middle'
				ref={printRef}
				onClick={() => !currentDocumentID ? 
					toast.warn('Debes primero crear una factura.') : 
					setShowModalPrintSale(true)}
			>
				Imprimir
			</Button>
			<Dropdown
				arrow
				placement='bottom'
				overlay={options}
			>
				<Button
					type='ghost'
					size='middle'
				>
					Opciones
				</Button>
			</Dropdown>
			<Button
				type='primary'
				size='middle'
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

			<BoxSquareComponent
				showModalBoxSquare={showModalBoxSquare}
				setShowModalBoxSquare={setShowModalBoxSquare}
				logged={logged}
			/>

			<PrintComponent
				showModalPrintSale={showModalPrintSale}
				setShowModalPrintSale={setShowModalPrintSale}
				logged={logged}
				currentDocumentID={ currentDocumentID }
				resetListSales={ resetListSales }
				getAllDocuments={getAllDocuments}
				productsOpt={ productsOpt }
				currentProducts={currentProducts}
				dataProporcion={dataProporcion}
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