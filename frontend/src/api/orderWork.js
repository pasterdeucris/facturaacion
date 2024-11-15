import api from "../utils/api";

export async function getTrademarksApi() {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`/marca/getMarcas`, params);

    return data;
}

export async function getDocumentosByTipoApi(typeDocumentID, businessID) {
    const params = {
        headers: {
            "content-type": "application/json"
        }
    }
    
    const { data } = await api.get(`/documento/getDocumentoByTipo?tipoDocumentoId=${typeDocumentID}&empresaId=${businessID}&usuarioId=&cerrado=&impreso=`, params);
    
    return data;
}