/**
 *  ESTADOS DOCUMENTOS
 */

const getDefaultsDocumentoObject = (value) => ({"": value, undefined: value, null: value});
export const ESTADOS_DOC_VALUES = {
    cargado: "CARGADO",
    porRevisar: "POR_REVISAR",
    ingresado: "INGRESADO",
    devuelto: "DEVUELTO",
    rechazado: "RECHAZADO",
    porEliminar: "POR_ELIMINAR",
    ...getDefaultsDocumentoObject(""),
}

const ESTADOS_ICONS = {
    porRevisar: "uqai-estado-revisar",
    rechazado: "uqai-estado-rechazado",
    ingresado: "uqai-estado-aprobado",
    devuelto: "uqai-estado-devuelto",
    cargado: "uqai-carga",
    porEliminar: "uqai-estado-rechazado",
    sinDocumento: "uqai-check-vacio",
    porRegularizar: "uqai-estado-devuelto",
    documentoAdicional: "uqai-estado_doc_adicional",
}

const ESTADOS_COLORS = {
    porRevisar: "secondary",
    rechazado: "danger",
    ingresado: "alternative",
    devuelto: "warning",
    cargado: "primary",
    porEliminar: "danger",
    sinDocumento: "info",
    porRegularizar: "warning",
    documentoAdicional: "success",
}

export const ESTADOS_DOC_TRANSICIONES = {
    [ESTADOS_DOC_VALUES.cargado]: [ESTADOS_DOC_VALUES.cargado, ESTADOS_DOC_VALUES.devuelto, ESTADOS_DOC_VALUES.rechazado],
    [ESTADOS_DOC_VALUES.porRevisar]: [ESTADOS_DOC_VALUES.porRevisar, ESTADOS_DOC_VALUES.ingresado, ESTADOS_DOC_VALUES.devuelto, ESTADOS_DOC_VALUES.rechazado],
    [ESTADOS_DOC_VALUES.ingresado]: [ESTADOS_DOC_VALUES.ingresado, ESTADOS_DOC_VALUES.devuelto],
    [ESTADOS_DOC_VALUES.devuelto]: [ESTADOS_DOC_VALUES.devuelto],
    [ESTADOS_DOC_VALUES.rechazado]: [ESTADOS_DOC_VALUES.rechazado],
    ...getDefaultsDocumentoObject(["", ESTADOS_DOC_VALUES.devuelto, ESTADOS_DOC_VALUES.rechazado]),
}
export const ESTADOS_DOC_LISTA = [
    {
        inicial: "C", label: "CARGADO", value: ESTADOS_DOC_VALUES.cargado, color: ESTADOS_COLORS.cargado, hide: true,
        titulo: "Cargado por", icon: ESTADOS_ICONS.cargado,
    },
    {
        inicial: "PR", label: "POR REVISAR", value: ESTADOS_DOC_VALUES.porRevisar, color: ESTADOS_COLORS.porRevisar,
        commentOptional: true, titulo: "En revisión por", icon: ESTADOS_ICONS.porRevisar,
    },
    {
        inicial: "I", label: "INGRESADO", value: ESTADOS_DOC_VALUES.ingresado, color: ESTADOS_COLORS.ingresado,
        commentOptional: true, titulo: "Ingresado por", icon: ESTADOS_ICONS.ingresado,
    },
    {
        inicial: "R", label: "RECHAZADO", value: ESTADOS_DOC_VALUES.rechazado, color: ESTADOS_COLORS.rechazado,
        titulo: "Rechazado por", icon: ESTADOS_ICONS.rechazado, hide: true
    },
    {
        inicial: "PE", label: "POR ELIMINAR", value: ESTADOS_DOC_VALUES.porEliminar, color: ESTADOS_COLORS.porEliminar,
        hide: true, icon: ESTADOS_ICONS.porEliminar
    },
    {
        inicial: "SD", label: "SIN DOCUMENTO", value: "", color: ESTADOS_COLORS.sinDocumento, hide: true, default: true,
    },
    {
        inicial: "D", label: "DEVUELTO", value: ESTADOS_DOC_VALUES.devuelto, color: ESTADOS_COLORS.devuelto,
        titulo: "Devuelto por", icon: ESTADOS_ICONS.devuelto, leyenda: "DEVUELTO (Ingresar a cambiar)"
    },
]

/**
 * ESTADO SINIESTRO
 */
export const ESTADOS_SINI_VALUES = {
    porRegularizar: "POR_REGULARIZAR",
    porRevisar: ESTADOS_DOC_VALUES.porRevisar,
    rechazado: ESTADOS_DOC_VALUES.rechazado,
    ingresado: ESTADOS_DOC_VALUES.ingresado,
    documentoAdicional: "DOCUMENTO_ADICIONAL",
}

export const ESTADOS_SINI_TRANCISIONES = {
    [ESTADOS_SINI_VALUES.porRevisar]: [ESTADOS_SINI_VALUES.porRevisar, ESTADOS_SINI_VALUES.porRegularizar, ESTADOS_SINI_VALUES.ingresado, ESTADOS_SINI_VALUES.documentoAdicional, ESTADOS_SINI_VALUES.rechazado],
    [ESTADOS_SINI_VALUES.porRegularizar]: [ESTADOS_SINI_VALUES.porRegularizar],
    [ESTADOS_SINI_VALUES.ingresado]: [ESTADOS_SINI_VALUES.ingresado, ESTADOS_SINI_VALUES.documentoAdicional],
    [ESTADOS_SINI_VALUES.documentoAdicional]: [ESTADOS_SINI_VALUES.documentoAdicional, ESTADOS_SINI_VALUES.porRevisar],
    [ESTADOS_SINI_VALUES.rechazado]: [ESTADOS_SINI_VALUES.rechazado],
}
export const ESTADOS_PORTAL_LISTA = [
    {
        value: ESTADOS_SINI_VALUES.porRevisar, label: "POR REVISAR", hide: false, isDisabled: true, default: true,
        titulo: "En revisión por", icon: ESTADOS_ICONS.porRevisar, color: ESTADOS_COLORS.porRevisar,
    },
    {
        value: ESTADOS_SINI_VALUES.porRegularizar, label: "POR REGULARIZAR", titulo: "En regularización por",
        icon: ESTADOS_ICONS.porRegularizar, color: ESTADOS_COLORS.porRegularizar,
    },
    {
        value: ESTADOS_SINI_VALUES.rechazado, label: "RECHAZADO", titulo: "Rechazado por",
        icon: ESTADOS_ICONS.rechazado, color: ESTADOS_COLORS.rechazado,
    },
    {
        value: ESTADOS_SINI_VALUES.ingresado, label: "INGRESADO", titulo: "Ingresado por",
        icon: ESTADOS_ICONS.ingresado, color: ESTADOS_COLORS.ingresado, commentOptional: true,
    },
    {
        value: ESTADOS_SINI_VALUES.documentoAdicional,
        label: "DOCUMENTO ADICIONAL", titulo: "Documento adicional requerido por",
        icon: ESTADOS_ICONS.documentoAdicional, color: ESTADOS_COLORS.documentoAdicional,
    },
];

export const PERMISOS_EDICION_SINIESTRO = {
    [ESTADOS_SINI_VALUES.porRevisar]: obtenerPermisosEdicion(false, true),
    [ESTADOS_SINI_VALUES.porRegularizar]: obtenerPermisosEdicion(true, false),
    [ESTADOS_SINI_VALUES.ingresado]: obtenerPermisosEdicion(false, true),
    [ESTADOS_SINI_VALUES.rechazado]: obtenerPermisosEdicion(false, false),
    [ESTADOS_SINI_VALUES.documentoAdicional]: obtenerPermisosEdicion(true, false),
}


/**
 * FUNCIONES ESTADOS
 */
export const defaultEstadoSiniestro = (estado, user, com = '') => {
    return {
        estado,
        userId: user.id,
        fecha: new Date(),
        comentario: com
    }
}
export const getEstadosTransicionesByEstado = (arrayEstados, arrayTransiciones) => {
    const arrayEstadosFiltered = [];
    (arrayTransiciones || []).forEach(estado => {
        const estadito = arrayEstados.find(de => de.value === estado && !de.hide)
        if (estadito) arrayEstadosFiltered.push(estadito);
    });
    return arrayEstadosFiltered;
}
export const findOneInEstadosLista = (value, arrayEstados = ESTADOS_DOC_LISTA) => {
    if (!value) return arrayEstados.find(d => d.default);
    return arrayEstados.find(de => de.value === value) ?? value;
}

export const isSomeOrEveryDocumentInEstado = (values = {}, estado = [ESTADOS_DOC_VALUES.porRevisar], option = "some") => {
    const isSome = option === "some";
    const {documentos, gastos, otrosDocumentos} = values;

    const isDocumentitos = isThereSomeOrEveryByEstado(documentos, estado, option);
    if (isDocumentitos && isSome) return true;

    const isOtrosDocumentitos = isThereSomeOrEveryByEstado(otrosDocumentos, estado, option);
    if (isOtrosDocumentitos && isSome) return true;

    const isGastitos = (gastos || [])[option]?.(gasto =>
        Object.entries(gasto.subdocumentosItems || {})[option](([_, itemsArray]) =>
            isThereSomeOrEveryByEstado(itemsArray, estado, option)
        )
    );
    if (isGastitos && isSome) return true;

    return isDocumentitos && isOtrosDocumentitos && isGastitos; // cuando es every
}

function isThereSomeOrEveryByEstado(arrayDocumentos, estado, option = "some") {
    const arrayWithDocumentsPresent = (arrayDocumentos || []).filter(doc => doc?.estado || doc?.documentoDigital?.estado);
    return arrayWithDocumentsPresent[option]?.(doc => (estado.includes(doc?.estado?.toUpperCase()) || estado.includes(doc?.documentoDigital?.estado?.toUpperCase())));
}

export const isEjecutivoOrAdminAbleToEditByEstadoSiniestro = (user, estadoSiniestro) => {
    return user.hasPrivileges && PERMISOS_EDICION_SINIESTRO[estadoSiniestro]?.ejecutivo;
}
export const isUserAbleToEditByEstadoSiniestro = (user, estadoSiniestro) => {
    return user.isUser && PERMISOS_EDICION_SINIESTRO[estadoSiniestro]?.user;
}
export const isUserAbleToEditDocument = (user, estadoDocumento, estadoSiniestro) => {
    return isUserAbleToEditByEstadoSiniestro(user, estadoSiniestro) && includesToUppercase([ESTADOS_DOC_VALUES.cargado, ESTADOS_DOC_VALUES.devuelto], estadoDocumento);
}
export const isEjecutivoOrAdminAbleToEditStateOfDocument = (user, estadoDocumento, estadoSiniestro) => {
    return isEjecutivoOrAdminAbleToEditByEstadoSiniestro(user, estadoSiniestro) && !includesToUppercase([ESTADOS_DOC_VALUES.cargado], estadoDocumento);
}

function obtenerPermisosEdicion(user, ejecutivo) {
    return {user, ejecutivo};
}

function includesToUppercase(elements, value) {
    return (elements || []).includes(value?.toUpperCase());
}