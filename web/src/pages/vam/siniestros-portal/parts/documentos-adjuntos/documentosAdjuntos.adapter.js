import {getKeysFromObject} from "./util";

export const removeDocumentsFromValues = (values) => {
    return {
        ...values,
        documentos: undefined,
        gastos: undefined,
        otrosDocumentos: undefined,
        subdocumentosEstructura: undefined,
        subdocumentosItems: undefined,
        subdocumentosItemsAux: undefined,
    }
}
export const documentosDataAdapter = (resp) => {
    let {documentos, gastos, otrosDocumentos} = resp.data
    // otros documentos
    const newOtrosDocumentos = otrosDocumentos?.map(otroDocumento => (
        {documentoDigital: {...otroDocumento}}
    ));
    // documentos
    documentos = filterActivesAndDocuments(documentos);
    sortByOrdenAsc(documentos);
    sortByOrdenAsc(gastos);
    gastos.forEach(gasto => {
        sortByOrdenAsc(gasto.subdocumentosEstructura);
        (gasto.subdocumentosEstructura || []).forEach(se => {
            se.subdocumento = gasto.subdocumento;
            if (!gasto.activo) { // si el padre no esta activo se desactivan todos
                se.activo = gasto.activo;
            }
        });
        getKeysFromObject(gasto.subdocumentosItems).forEach(key => {
            gasto.subdocumentosItems[key] = sortByOrdenAsc(gasto.subdocumentosItems[key]);
        });
    });
    return {documentos, gastos, otrosDocumentos: newOtrosDocumentos};
}

function sortByOrdenAsc(array) {
    (array || []).sort((a, b) => a?.orden - b?.orden);
    return array;
}

function filterActivesAndDocuments(documentos) {
    return documentos?.filter(documento => (documento?.activo || documento?.documentoDigital?.url));
}