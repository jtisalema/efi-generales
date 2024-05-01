import {useSelector} from "react-redux";
import {useFormikContext} from "formik";
import React, {useEffect, useState} from "react";
import {MAX_ADJUNTOS_SIZE} from "./documentos-adjuntos/util";
import {useIsSomeOrEveryDocumentInEstado} from "./documentos-adjuntos/hooks/useIsSomeDocumentInEstado";
import {
    ESTADOS_DOC_VALUES,
    ESTADOS_SINI_VALUES,
    isEjecutivoOrAdminAbleToEditByEstadoSiniestro,
    isUserAbleToEditByEstadoSiniestro
} from "../estados_edicion";
import UqaiTooltip from "../../../../components/UqaiTooltip";
import {useLoadingContext} from "./documentos-adjuntos/context/LoadingContextProvider";
import {TooltipSomeDocumentInState} from "./SiniestroEstadosSelect";
import {Modal, ModalBody} from "reactstrap";
import {UqaiModalHeader} from "../../../../components/UqaiModal";
import axios from "axios";
import {routes as routesVam} from "../../UtilsVam";
import {TIPOS_RECLAMO} from "../utils";
import {metricasGoogle} from "../../../../util/General";

export const SiniestroEnviarButton = ({changeEstadoCliente, onRetryEmail}) => {

    const user = useSelector(state => state.user);
    const isEjecutivoOrAdmin = user.hasPrivileges;
    const actions = useFormikContext();
    const {
        values, isSubmitting, initialValues
    } = actions;
    const {cdIncSiniestro, documentosSize} = values;
    const [isLoading] = useLoadingContext();
    const itemEstadoPortal = initialValues.estadoPortal;

    const ejecutivoOrAdminCanEdit = isEjecutivoOrAdminAbleToEditByEstadoSiniestro(user, itemEstadoPortal);
    const userCanEdit = isUserAbleToEditByEstadoSiniestro(user, itemEstadoPortal);
    const isSomeDocToReview = useIsSomeOrEveryDocumentInEstado(values, ESTADOS_DOC_VALUES.porRevisar);
    const isOthersDocumentsEmpty = values?.estadoPortal === ESTADOS_SINI_VALUES.documentoAdicional && !values?.otrosDocumentos?.length;

    const isSomeDocDevuelto = useIsSomeOrEveryDocumentInEstado(values, ESTADOS_DOC_VALUES.devuelto);
    const isDisabledUser = (cdIncSiniestro && !isEjecutivoOrAdmin) && (isSomeDocDevuelto || (documentosSize > MAX_ADJUNTOS_SIZE) || !userCanEdit);
    const isDisabledEjecutivoOrAdmin = isEjecutivoOrAdmin && (isSomeDocToReview || !ejecutivoOrAdminCanEdit);
    const isSameStatesPortalForNoUser = initialValues?.estadoPortal === values?.estadoPortal && !isDisabledEjecutivoOrAdmin && isEjecutivoOrAdmin;
    const isDisabled = isLoading || isSubmitting || isDisabledUser || isDisabledEjecutivoOrAdmin || (isOthersDocumentsEmpty && userCanEdit) || isSameStatesPortalForNoUser;

    const [validateTotal, setValidateTotal] = useState(false);
    const [disabledRetry, setDisabledRetry] = useState(false);

    const onEnviar = () => {
        const hasToValidate = user.isUser && values?.tpSiniestro !== TIPOS_RECLAMO.preAutorizacion && values?.isNew;
        hasToValidate ? setValidateTotal(true) : changeEstadoCliente(actions);
        metricasGoogle(user, "siniestro_send", "siniestro", "list");
    }

    return (
        <>
            <div className={"d-flex gap-2 align-items-center"}>
                <button type={"button"} className="btn btn-primary btn-md" onClick={onEnviar}
                        disabled={!!isDisabled}>
                    Enviar&nbsp;<i className={"icon-uqai uqai-enviar"}/>
                </button>
                {(!isEjecutivoOrAdmin && isSomeDocDevuelto && userCanEdit) ?
                    <TooltipSomeDocumentInState estado={ESTADOS_DOC_VALUES.devuelto}/>
                    : null
                }
                {isSameStatesPortalForNoUser &&
                    <UqaiTooltip message={"Debe cambiar el estado del siniestro para poder actualizarlo."}/>}

                {isEjecutivoOrAdmin && itemEstadoPortal === ESTADOS_DOC_VALUES.ingresado &&
                    <button type={"button"} className="btn btn-secondary btn-md"
                            onClick={() => onRetryEmail(setDisabledRetry)} disabled={disabledRetry}>
                        {`${disabledRetry ? 'Enviando...' : 'Retry Email'}`}
                    </button>}
            </div>
            {
                (!isEjecutivoOrAdmin && isOthersDocumentsEmpty && userCanEdit) ?
                    <UqaiTooltip message={"Debe cargar el documento adicional solicitado"}/> : null
            }
            <ModalTotalSiniestros validateTotal={validateTotal} setValidateTotal={setValidateTotal}
                                  changeEstadoCliente={changeEstadoCliente}/>
        </>
    )
}

const ModalTotalSiniestros = ({validateTotal, setValidateTotal, changeEstadoCliente}) => {

    const [isOpen, setIsOpen] = useState(false);
    const actions = useFormikContext();
    const {poliza, dscObjeto} = actions.values;
    useEffect(() => {
        if (validateTotal) {
            axios.get(routesVam.api + '/siniestros-portal/total-siniestros',
                {params: {poliza, dscObjeto}})
                .then(resp => resp.data >= 3 ? changeEstadoCliente(actions) : setIsOpen(true))
                .finally(() => setValidateTotal(false));
        }
    }, [validateTotal]);

    const toggle = () => {
        changeEstadoCliente(actions);
        setIsOpen(false);
    }

    return (
        <Modal isOpen={isOpen} centered>
            <UqaiModalHeader toggle={toggle} title="Observación"/>
            <ModalBody>
                <div className="row my-4">
                    <div className="col">
                        Los primeros reembolsos ingresados van a ingresar al deducible de la póliza anual.
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}
