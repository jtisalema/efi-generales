const defaultTipoDocumento = (tipos, campos) => ({
    DOCUMENTO: {tipos, campos},
    null: {tipos, campos},
    undefined: {tipos, campos},
    "": {tipos, campos},
});

export const tiposDocumentos = {
    FACTURA: {
        tipos: ["FACTURA", "factura"],
        campos: ["fcDocumento", "numDocumento", "valor"],
    },
    RECETA: {
        tipos: ["RECETA", "receta"],
        campos: ["fcCaducDocumento"]
    },
    ...defaultTipoDocumento(["DOCUMENTO", "documento"], []),
}

export function isFactura(tipo) {
    const tipoLowerCase = tipo?.toLowerCase() ?? tipo;
    return tiposDocumentos.FACTURA.tipos.includes(tipoLowerCase);
}

export const getSubTotalFacturas = (subdocumentosItems) => {
    let sumaFacturas = 0;
    Object.entries(subdocumentosItems || {})?.forEach(([key, items]) => {
        const currentValue = items?.find?.(item => isFactura(item?.tipo))?.detalleDocumento?.valor || 0;
        sumaFacturas += currentValue;
    })
    return sumaFacturas;
}

// calcula el size de todos los documentos en bytes
export const getFilesSizeInBytes = (values) => {
    let totalSize = 0;
    const {documentos, otrosDocumentos, gastos} = values;

    totalSize = getCumulativeSizes(totalSize, documentos);
    totalSize = getCumulativeSizes(totalSize, otrosDocumentos);

    (gastos || [])?.forEach?.(({subdocumentosItems}) => {
        Object.entries(subdocumentosItems || {})?.forEach(([_, items]) => {
            totalSize = getCumulativeSizes(totalSize, items);
        });
    });
    return totalSize || 0;
}

export function getCumulativeSizes(totalSize = 0, items = []) {
    (items || [])?.forEach?.((item) => {
        totalSize += (item?.documentoDigital?.tamanio || item?.tamanio || 0);
    });
    return totalSize
}

export function bytesToMb(bytes) {
    try {
        const mb = bytes / (1024 ** 2);
        const redondeado = Math.ceil(mb * 100) / 100; // redondea hacia arriba a dos dígitos
        return redondeado.toFixed(2);
    } catch (e) {
        return bytes;
    }
}

export function getValorReclamo(gastos = []) {
    let valorReclamo = 0;
    gastos.forEach(gasto => {
        valorReclamo += (gasto?.subTotalFacturas ?? 0)
    })
    return valorReclamo;
}

export const MAX_ADJUNTOS_SIZE = 20 * 1024 * 1024; // 30 mb
export const MAX_SIZE_IN_GROUP = 10 * 1024 * 1024; // 30 mb
export const MAX_SIZE_IMAGEN = 2 * 1024 * 1024; // 30 mb

export const getKeysFromObject = (object) => {
    return Object.keys(object || {});
}

export const getEntriesFromObject = (object) => {
    return Object.entries(object || {});
}

export const convertDecimal = (val) => {
    let valor = val ?? 0.00;
    return parseFloat(valor).toFixed(2)
}
export const formasPago = codigo => {
    let formas = {
        "01": "SIN UTILIZACION DEL SISTEMA FINANCIERO",
        "15": "COMPENSACION DE DEUDAS",
        "16": "TARJETAS DE DÉBITO",
        "17": "DINERO ELECTRÓNICO",
        "18": "TARJETA PREPAGO",
        "19": "TARJETA DE CRÉDITO",
        "20": "OTROS CON UTILIZACIÓN DEL SISTEMA FINANCIERO",
        "21": "ENDOSO DE TÍTULOS",
        "default": ""
    };
    return formas[codigo] ?? formas["default"];
}

export const to2Decimals = (num) => {
    return Number(Number.parseFloat(num).toFixed(2));
}


export const getTotalImpuestos = (impuestosList) => {
    let impuestos = 0;
    (impuestosList || []).forEach(imp => {
        impuestos += to2Decimals(imp?.valor || 0);
    });
    return impuestos;
}

export const getValorMasImpuestos = (valor, impuestosList) => {
    const impuestos = getTotalImpuestos(impuestosList);
    const resultado = to2Decimals(valor || 0) + to2Decimals(impuestos);
    return to2Decimals(resultado);
}

export const getImporteTotalSeleccionado = (importeTotalSeleccionado, precioConImpuesto, isSuma = false) => {
    const importeTotalSeleccionadoFormated = to2Decimals(importeTotalSeleccionado);
    const precioConImpuestoFormated = to2Decimals(precioConImpuesto);
    const resultado = isSuma ?
        importeTotalSeleccionadoFormated + precioConImpuestoFormated :
        importeTotalSeleccionadoFormated - precioConImpuestoFormated;
    return to2Decimals(resultado);
}

export const cloneObject = (object) => JSON.parse(JSON.stringify(object))