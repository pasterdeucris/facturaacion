import api from "../utils/api"

export const getProductsReportApi = async (
    agotado = false, stock = false, estrella = false, group, subgroup, supplier, businessID
) => {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const url = '/producto/getProductosByGrupo'
    + '?empresaId=' + businessID
    + '&grupoId=' + group
    + '&subGrupoId=' + subgroup
    + '&proveedorId=' + supplier
    + '&agotado=' + agotado
    + '&stock=' + stock
    + '&estrella=' + estrella;

const { data } = await api.get(url, params);


    return data;
}