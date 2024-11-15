import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const useInvoicePDF = (  ) => {

    const generatePDF = (
		payments, 
		currentDocument, 
		nameInvoiceScreen,
		orientation = 'p',
		measure = 'mm', 
		size = [297, 80]) => {
		document.querySelector("#factura").removeAttribute("hidden");
		let doc = new jsPDF(orientation, measure, size);

		// if(Number(formValues.tipo_pago) == 4 || Number(formValues.tipo_pago) == 5)
		if(payments.some(payment => Number(payment.type) === 4 || Number(payment.type) === 5))
		{
			// for (let index = 0; index < 2; index++) {
				doc.html(document.querySelector("#factura"), {
					callback: (pdf) => {
						let nameInvoice = '';
						if(currentDocument?.tipo_documento_id == 4) {
							nameInvoice = `COTIZACION_${currentDocument?.documento_id}`;
						} else {
							nameInvoice = nameInvoiceScreen ? `FACTURA_DE_VENTA_PANTALLA_${currentDocument?.documento_id}` : `FACTURA_DE_VENTA_${currentDocument?.documento_id}`;
						}

						pdf.save(`${nameInvoice}.pdf`);
						pdf.save(`${nameInvoice}(1).pdf`);
						document.querySelector("#factura").setAttribute("hidden", "true");

					},
					x: 10,
					y: 10
				});
			// }
		} else {
			doc.html(document.querySelector("#factura"), {
				callback: (pdf) => {
					let nameInvoice = '';
					if(currentDocument?.tipo_documento_id == 4) {
						nameInvoice = `COTIZACION_${currentDocument?.documento_id}`;
					} else {
						nameInvoice = nameInvoiceScreen ? `FACTURA_DE_VENTA_PANTALLA_${currentDocument?.documento_id}` : `FACTURA_DE_VENTA_${currentDocument?.documento_id}`;
					}

					pdf.save(`${nameInvoice}.pdf`);
					document.querySelector("#factura").setAttribute("hidden", "true");
				},
				x: 10,
				y: 10
			});
		}
		
	}

	const generatePDFMid = (
		payments, 
		currentDocument, 
		nameInvoiceScreen,
		orientation = 'p',
		measure = 'mm') => {
		document.querySelector("#factura").removeAttribute("hidden");
	
		html2canvas(document.querySelector("#factura"), { scale: 3 }).then(canvas => {
			let doc = new jsPDF(orientation, measure, 'a4');
			let imgData = canvas.toDataURL('image/png');
			let pageWidth = doc.internal.pageSize.getWidth();
			let pageHeight = doc.internal.pageSize.getHeight();
	
			doc.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
	
			let nameInvoice = '';
			if(currentDocument?.tipo_documento_id == 4) {
				nameInvoice = `COTIZACION_${currentDocument?.documento_id}`;
			} else {
				nameInvoice = nameInvoiceScreen ? `FACTURA_DE_VENTA_PANTALLA_${currentDocument?.documento_id}` : `FACTURA_DE_VENTA_${currentDocument?.documento_id}`;
			}
	
			doc.save(`${nameInvoice}.pdf`);
			document.querySelector("#factura").setAttribute("hidden", "true");
		});
	}

    return [ generatePDF, generatePDFMid ];

}