import {useMemo} from "react";
import {isSomeOrEveryDocumentInEstado} from "../../../estados_edicion";

export const useIsSomeOrEveryDocumentInEstado = (values, estados, option) => {

    //paso values porque hay distintos formiks
    return useMemo(() => isSomeOrEveryDocumentInEstado(values, estados, option),
        [values?.documentos, values?.gastos, values?.otrosDocumentos]
    );

}