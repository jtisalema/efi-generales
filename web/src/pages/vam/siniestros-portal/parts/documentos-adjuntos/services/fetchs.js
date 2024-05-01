import axios from "axios";
import {routes} from "../../../../../gen/UtilsGeneral";

export const fetchVerFactura = (pathFile) => (
    axios.get(routes.api + '/documentos-digitales/ver-factura', {
        transformResponse: approveReceiptDetails,
        params: {nm: pathFile}
    })
)

const approveReceiptDetails = (receipt) => {
    const newReceipt = JSON.parse(receipt);
    newReceipt.detalle?.forEach(detalle => {
        detalle.seleccionado = detalle.seleccionado ?? true;
    });
    newReceipt.importeTotalSeleccionado = newReceipt.importeTotalSeleccionado ?? (newReceipt?.infoFactura?.importeTotal || 0);
    return newReceipt;
}