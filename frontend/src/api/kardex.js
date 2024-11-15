import api from "../utils/api"

export const getKardexApi = async (
    dateInit, dateEnd, product, group, subgroup, supplier, typeDocument, businessID
) => {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const url = 'documentoDetalle/getKardex'
    + '?fechaInicial=' + dateInit
    + '&fechaFinal=' + dateEnd
    + '&productoId=' + product
    + '&grupoId=' + group
    + '&subgrupoId=' + subgroup
    + '&proveedorId=' + supplier
    + '&tipoDocumentoId=' + typeDocument
    + '&nombreParcial='
    + '&empresaId=' + businessID;

const { data } = await api.get(url, params);


    return data;
}