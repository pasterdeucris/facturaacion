import { useState, useEffect } from 'react'
import { activationsByUserApi } from '../api/auth'

export const useActivations = ( logged ) => {

    const [printScreen, setPrintScreen] = useState(false);
    const [multiPrinters, setMultiPrinters] = useState(false);
    const [barcodeActive, setBarcodeActive] = useState(false);
    const [creditDebitActive, setCreditDebitActive] = useState(false);
    const [activeEditInventory, setActiveEditInventory] = useState(false);
    const [activateCreateProducts, setActivateCreateProducts] = useState(false);
    const [activateDiscount, setActivateDiscount] = useState(false);
    const [activatePaymentType, setActivatePaymentType] = useState(false);
    const [changeDateInvoice, setChangeDateInvoice] = useState(false);
    const [clientRequired, setClientRequired] = useState(false);
    const [activateStock, setActivateStock] = useState(false);
    const [priceChange, setPriceChange] = useState(false);
    const [editInvoice, setEditInvoice] = useState(false);
    const [blockCheckBox, setBlockCheckBox] = useState(false);
    const [deleteKey, setDeleteKey] = useState(false);
    const [suggestedPrices, setSuggestedPrices] = useState(false);
    const [negativesQty, setNegativesQty] = useState(false);
    const [cuadreDeCajaRemisiones, setCuadreDeCajaRemisiones] = useState(false);
    const [onProporcion, setOnProporcion] = useState(false);
    const [clientInvoice, setClientInvoice] = useState(false);
    const [employeeInvoice, setEmployeeInvoice] = useState(false);
    const [guideTransportInvoice, setGuideTransportInvoice] = useState(false);
    const [autoElectronicInvoice, setAutoElectronicInvoice] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [activations, setActivations] = useState([]);

    useEffect(() => {
        
        if(activations.length) {
            const promises = [
                getImpresionesPantalla(),
                getMultiplesImpresoras(),
                getActivarNotaCreditoDebito(),
                getActivarCodigoBarras(),
                getEdicionInventarioFisico(),
                getCreacionProductos(),
                getActivarDescuento(),
                getTiposDePago(),
                getCambioFechaFactura(),
                getClienteObligatorio(),
                getStockActivo(),
                getCambioDePrecio(),
                getEditarFactura(),
                getBloqueoCuadreCaja(),
                getClaveBorrado(),
                getPreciosSugeridos(),
                getActivarCantidadesNegativas(),
                getRemisionesCuadreDeCaja(),
                getProporcion(),
                getClientInvoice(),
                getEmployeeInvoice(),
                getGuideTransportInvoice(),
                getSendAutoElectronicInvoice(),
            ]
    
          if(activations.length) {
            Promise.all(promises)
                .then(() => { setIsLoading(false) })
                .catch(() => console.log('Ocurrió un error mientras se obtenían las activaciones.'));
          }
        }
    }, [activations])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('activaciones'));
        if(!data) {
            getActivations( logged?.userID );
        } else {
            setActivations( data );
        }
    }, [logged])
    
    const getActivations = async (userID) => {
        try {
            const response = await activationsByUserApi(userID);
            localStorage.setItem("activaciones", JSON.stringify(response));
            setActivations(response);
        } catch (err) {
            console.log(err)
        }
    }
  
    const getImpresionesPantalla = async () => {
        try {
            setIsLoading(true);
            setPrintScreen(activations.some(item => item.activacion_id == 2));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getMultiplesImpresoras = async () => {
        try {
            setIsLoading(true);
            setMultiPrinters(activations.some(item => item.activacion_id == 4));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getActivarNotaCreditoDebito = async () => {
        try {
            setIsLoading(true);
            setCreditDebitActive(activations.some(item => item.activacion_id == 6));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getActivarCodigoBarras = async () => {
        try {
            setIsLoading(true);
            setBarcodeActive(activations.some(item => item.activacion_id == 7));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getActivarDescuento = async () => {
        try {
            setIsLoading(true);
            setActivateDiscount(activations.some(item => item.activacion_id == 10));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getEdicionInventarioFisico = async () => {
        try {
            setIsLoading(true);
            setActiveEditInventory(activations.some(item => item.activacion_id == 33));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getCreacionProductos = async () => {
        try {
            setIsLoading(true);
            setActivateCreateProducts(activations.some(item => item.activacion_id == 27));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getTiposDePago = async () => {
        try {
            setIsLoading(true);
            setActivatePaymentType(activations.some(item => item.activacion_id == 20));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getCambioFechaFactura = async () => {
        try {
            setIsLoading(true);
            setChangeDateInvoice(activations.some(item => item.activacion_id == 22));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getClienteObligatorio = async () => {
        try {
            setIsLoading(true);
            setClientRequired(activations.some(item => item.activacion_id == 14));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getStockActivo = async () => {
        try {
            setIsLoading(true);
            setActivateStock(activations.some(item => item.activacion_id == 12));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getCambioDePrecio = async () => {
        try {
            setIsLoading(true);
            setPriceChange(activations.some(item => item.activacion_id == 15));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getEditarFactura = async () => {
        try {
            setIsLoading(true);
            setEditInvoice(activations.some(item => item.activacion_id == 34));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getBloqueoCuadreCaja = async () => {
        try {
            setIsLoading(true);
            setBlockCheckBox(activations.some(item => item.activacion_id == 17));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getClaveBorrado = async () => {
        try {
            setIsLoading(true);
            setDeleteKey(activations.some(item => item.activacion_id == 9));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getPreciosSugeridos = async () => {
        try {
            setIsLoading(true);
            setSuggestedPrices(activations.some(item => item.activacion_id == 13));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getActivarCantidadesNegativas = async () => {
        try {
            setIsLoading(true);
            setNegativesQty(activations.some(item => item.activacion_id == 28));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getRemisionesCuadreDeCaja = async () => {
        try {
            setIsLoading(true);
            setCuadreDeCajaRemisiones(activations.some(item => item.activacion_id == 5));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getProporcion = async () => {
        try {
            setIsLoading(true);
            setOnProporcion(activations.some(item => item.activacion_id == 3));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getClientInvoice = async () => {
        try {
            setIsLoading(true);
            setClientInvoice(activations.some(item => item.activacion_id == 19));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getEmployeeInvoice = async () => {
        try {
            setIsLoading(true);
            setEmployeeInvoice(activations.some(item => item.activacion_id == 18));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getGuideTransportInvoice = async () => {
        try {
            setIsLoading(true);
            setGuideTransportInvoice(activations.some(item => item.activacion_id == 8));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    const getSendAutoElectronicInvoice = async () => {
        try {
            setIsLoading(true);
            setAutoElectronicInvoice(activations.some(item => item.activacion_id == 31));
        } catch (err) {
            console.log('Ocurrió un error al obtener los datos de activaciones.');
        }
    }

    return {
        printScreen,
        multiPrinters,
        barcodeActive,
        creditDebitActive,
        activeEditInventory,
        activateCreateProducts,
        activateDiscount,
        activatePaymentType,
        changeDateInvoice,
        clientRequired,
        activateStock,
        priceChange,
        editInvoice,
        blockCheckBox,
        deleteKey,
        suggestedPrices,
        negativesQty,
        isLoading,
        cuadreDeCajaRemisiones,
        onProporcion,
        clientInvoice,
        employeeInvoice,
        guideTransportInvoice,
        setOnProporcion,
        autoElectronicInvoice
    }

}
