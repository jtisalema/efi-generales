import {UqaiField} from "../../../../components/UqaiField";
import React, {useEffect, useState} from "react";
import {useFormikContext} from "formik";
import {EstadosSelect} from "./documentos-adjuntos/EstadoSelect";
import {useIsSomeOrEveryDocumentInEstado} from "./documentos-adjuntos/hooks/useIsSomeDocumentInEstado";
import UqaiTooltip from "../../../../components/UqaiTooltip";
import {
    ESTADOS_DOC_VALUES,
    ESTADOS_PORTAL_LISTA,
    ESTADOS_SINI_TRANCISIONES,
    ESTADOS_SINI_VALUES,
    findOneInEstadosLista,
    getEstadosTransicionesByEstado
} from "../estados_edicion";
import {useLoadingContext} from "./documentos-adjuntos/context/LoadingContextProvider";

export const SiniestroEstadosSelect = ({estadoPortal, onChange, children}) => {

    const {values, setFieldValue} = useFormikContext();
    const [isLoading] = useLoadingContext();
    const isSomeDocToReview = useIsSomeOrEveryDocumentInEstado(values, ESTADOS_DOC_VALUES.porRevisar);
    const habilitarIngresado = [ESTADOS_DOC_VALUES.ingresado];
    const isAllDocInIngresadoAndRechazado = useIsSomeOrEveryDocumentInEstado(values, habilitarIngresado, "every");
    const isDisabled = isLoading || values?.isNew || isSomeDocToReview;

    const [optionsSiniestro, setOptionsSiniestro] = useState([]);

    useEffect(() => {
        const estaditos = isAllDocInIngresadoAndRechazado ?
            ESTADOS_PORTAL_LISTA : ESTADOS_PORTAL_LISTA.filter(e => e.value !== ESTADOS_SINI_VALUES.ingresado);
        setOptionsSiniestro(getEstadosTransicionesByEstado(estaditos, ESTADOS_SINI_TRANCISIONES[estadoPortal]));
    }, [isAllDocInIngresadoAndRechazado, estadoPortal]);

    return (<>
        <div className={"document-select react-select z-index-999"}>
            <label className="form-label fw-bold text-secondary fs-7">Estado:{isSomeDocToReview ?
                <TooltipSomeDocumentInState estado={ESTADOS_DOC_VALUES.porRevisar}/>
                : null}
                {!isAllDocInIngresadoAndRechazado ? <TooltipHabilitarIngresado estados={habilitarIngresado}/> : null}
            </label>
            <UqaiField type="text" className={"w-100"} name={'estadoPortal'} component={EstadosSelect}
                       isDisabled={isDisabled}
                       options={optionsSiniestro}
                       menuPlacement={"top"}
                       value={findOneInEstadosLista(values?.estadoPortal, optionsSiniestro)}
                       onChange={e => onChange(e, setFieldValue)}/>
            {children}
        </div>
    </>);
}

export const TooltipSomeDocumentInState = ({estado}) => {
    return (<UqaiTooltip
        message={`No debe existir ningún documento en estado ${findOneInEstadosLista(estado)?.label} para actualizar el siniestro.`}/>);

}

const TooltipHabilitarIngresado = ({estados = []}) => {
    const estadosToShow = estados.filter(e => !e.hide).map(e => findOneInEstadosLista(e, ESTADOS_PORTAL_LISTA)?.label);
    return (<UqaiTooltip message={`
        Para actualizar el siniestro a estado
        de ${findOneInEstadosLista(ESTADOS_SINI_VALUES.ingresado, ESTADOS_PORTAL_LISTA)?.label} todos los documentos
        deben estar ${estadosToShow?.length > 1 ? "en alguno de los siguientes estados: " : "en estado"} ${estadosToShow?.join(", ")}
    `}
    />);
}