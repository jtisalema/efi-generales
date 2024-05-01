import axios from "axios";
import {routes} from "../../../../../gen/UtilsGeneral";
import Compressor from "compressorjs";


const endpoint = "/documentos-digitales";

export function saveFileToMinio(values, file, user) {
    let formData = new FormData();
    formData.append("item", new Blob([JSON.stringify(values)], {type: "application/json"}));
    formData.append("file", file, file.name);
    return axios.post(routes.api + endpoint + `/documento?isUser=${user.isUser}`, formData, {
        headers: {
            'content-Type': 'multipart/form-data'
        }
    });
}

export async function deleteFile(values) {
    await axios.post(routes.api + endpoint + "/delete-file", values);
}

export async function deleteMulitpleFiles(values) {
    await axios.post(routes.api + endpoint + "/delete-multiplefiles", values);
}

export function saveSubdocuments(values, user) {
    return axios.post(routes.api + endpoint + `/subdocumentos?isUser=${user.isUser}`, values, {
        headers: {
            'content-Type': 'multipart/form-data'
        }
    });
}

export function optimizeImage(file, maxWidth, convertSize) {
    return new Promise((resolve, reject) => {
        new Compressor(file, {
            maxWidth: maxWidth,
            convertSize: convertSize,
            success(result) {
                resolve(result);
            },
            error(error) {
                reject(error);
            }
        });
    });
}

export const getBtnClassAndIcon = (documento = {}, isLoading = false, isOtroDocumento = false) => {
    const documentoDigital = documento.documentoDigital ?? {};
    const isNew = !documentoDigital.url;
    if (isLoading) return ["without-document", "uqai-carga"];
    if (isOtroDocumento) return ["without-document", "uqai-agregar"];
    if (isNew) return ["without-document", "uqai-subir-archivo"];
    return ["with-document", ""];
}