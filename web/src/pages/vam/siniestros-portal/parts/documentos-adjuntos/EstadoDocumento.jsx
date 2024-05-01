import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {useFormikContext} from "formik";
import axios from "axios";
import {routes} from "../../../../gen/UtilsGeneral";
import {useLoadingContext} from "./context/LoadingContextProvider";
import {removeDocumentsFromValues} from "./documentosAdjuntos.adapter";
import {
    ESTADOS_DOC_LISTA,
    ESTADOS_DOC_VALUES,
    findOneInEstadosLista,
    isEjecutivoOrAdminAbleToEditStateOfDocument
} from "../../estados_edicion";
import {EstadosSelect} from "./EstadoSelect";
import {getKeysFromObject} from "./util";
import {fetchVerFactura} from "./services/fetchs";
import {ReactComponent as IconCargado} from "../../../../../assets/images/icon/estados/icon_estado_cargado.svg"

const endpoint = "/documentos-digitales";

export const EstadoDocumento = ({name, documento, alert, autoUpdateEstado = true, ...props}) => {

    const documentoDigital = documento?.documentoDigital;
    const docEstado = documentoDigital?.estado?.toUpperCase();
    const autocompletado = documentoDigital?.detalleDocumento?.autocompletado;

    const user = useSelector(state => state.user);
    const isEjecutivoOrAdmin = user.hasPrivileges;

    const {setFieldValue, values, initialValues} = useFormikContext();

    const [estadoActual, setEstadoActual] = useState({});
    const [isLoading, setIsLoading] = useLoadingContext();
    const [estadosOpciones, setEstadosOpciones] = useState(JSON.parse(JSON.stringify(ESTADOS_DOC_LISTA.filter(e => !e.hide))));
    const isDisabled = isLoading || values.isNew || !isEjecutivoOrAdminAbleToEditStateOfDocument(user, docEstado, initialValues?.estadoPortal);

    useEffect(() => {
        if (!isEjecutivoOrAdmin || !props?.facturaJsonState || !autocompletado) return;
        const keys = getKeysFromObject(props?.facturaJsonState[0]);
        if (autocompletado && keys.length === 0) getFacturaJson(documentoDigital?.pathFile);
        const facturaJson = props?.facturaJsonState[0];
        const detallesList = facturaJson?.detalle || [];
        if (detallesList.length === 0) return;
        const isSomeSelected = detallesList.some(detalle => detalle.seleccionado);
        const estaditos = estadosOpciones?.slice() || [];
        estaditos.forEach(estadito => {
            if (estadito.value === ESTADOS_DOC_VALUES.ingresado) estadito.isDisabled = !isSomeSelected;
        });
        setEstadosOpciones(estaditos);
    }, [props?.facturaJsonState]);

    useEffect(() => {
        const importeTotalSeleccionado = props?.facturaJsonState?.[0]?.importeTotalSeleccionado
        if (!isEjecutivoOrAdmin || !props?.facturaJsonState || !autocompletado || !importeTotalSeleccionado) return;
        setFieldValue(`${name}.documentoDigital.detalleDocumento.valor`, importeTotalSeleccionado);
    }, [props?.facturaJsonState?.[0]?.importeTotalSeleccionado]);

    useEffect(() => {
        docEstado && setEstadoActual(findOneInEstadosLista(docEstado));
    }, [docEstado])


    function onChangeEstado(e) {
        const currentState = findOneInEstadosLista(e.value);
        setEstadoActual(currentState);
        onAccept(currentState)
    }

    function onAccept(currentState) {
        const newValues = removeDocumentsFromValues({
            ...documentoDigital,
            ...documento,
            estado: currentState.value,
            idUsuarioEjecutivo: user.id,
            cdReclamo: values?.cdReclamo,
            cdIncSiniestro: values?.cdIncSiniestro,
            cdCompania: values?.cdCompania,
            poliza: values?.poliza,
            cdCliente: values?.cdCliente,
            documentoDigital: undefined,
        });
        if (autoUpdateEstado) {
            updateEstadoAndObservaciones(newValues, currentState);
        } else {
            setFields({}, currentState);
        }
    }

    function setFields(resp, currentState) {
        if (resp?.data) {
            setFieldValue(`${name}.documentoDigital`, {...resp.data});
        } else {
            setFieldValue(`${name}.documentoDigital.estado`, currentState?.value);
            setFieldValue(`${name}.documentoDigital.idUsuarioEjecutivo`, user.id);
        }
    }

    function updateEstadoAndObservaciones(newValues, currentState) {
        setIsLoading(() => true);
        axios.post(routes.api + endpoint + "/update/estado-observaciones", newValues)
            .then(resp => setFields(resp, currentState))
            .catch(alert?.current?.handle_error)
            .finally(() => {
                setTimeout(() => {
                    setIsLoading(() => false);
                }, [400]);
            });
    }

    const getFacturaJson = (nm) => {
        if (!props?.facturaJsonState || !nm) return;
        const setFacturaJson = props.facturaJsonState[1];
        fetchVerFactura(nm)
            .then(resp => setFacturaJson(resp.data))
            .catch(console.log);
    }

    return (<>
        {isEjecutivoOrAdmin ?
            <div className={"state-select-order"}>
                <EstadosSelect options={estadosOpciones} onChange={onChangeEstado}
                               isDisabled={isDisabled}
                               value={findOneInEstadosLista(docEstado)}/>
            </div>
            :
            <EstadoDocumentoLabel estadoValue={estadoActual?.value}/>
        }
    </>);
}

export const EstadoDocumentoLabel = ({
                                         estadoValue, documentosDigitales, estadoLista, isSiniestro
                                     }) => {

    const currentEstate = findOneInEstadosLista(estadoValue, estadoLista);
    const documentosDigitalesLength = documentosDigitales?.length;

    function getCountByEstado(estado) {
        let count = 0;
        documentosDigitales.forEach(dd => {
            if (dd?.estado?.toUpperCase() === estado) count++;
        });
        return count;
    }

    return (
        <div className={"d-inline-flex z-index-999 flex-column"}>
            {isSiniestro && <div className={"w-auto"}><small><b>Siniestro:</b></small></div>}
            <div
                className={`d-inline-flex align-items-center ${documentosDigitalesLength ? "gap-2" : ""} z-index-999`}>
                {documentosDigitalesLength ?
                    <>
                        {Object.entries(ESTADOS_DOC_VALUES).map(([key, estadoValue]) =>
                            <SimpleLabel key={key} estado={findOneInEstadosLista(estadoValue)}
                                         conteo={getCountByEstado(estadoValue)} showInicial/>
                        )}
                    </>
                    :
                    <SimpleLabel estado={currentEstate}/>
                }
            </div>
        </div>
    );
}

function SimpleLabel({
                         estado, showInicial, conteo
                     }) {
    if (showInicial && !conteo) return null;
    const isEstadoCargado = ESTADOS_DOC_VALUES.cargado === estado.value;

    return (<>
        {showInicial ?
            <span className={`pt-0 pe-0 badge text-${estado.color} position-relative`}
                  {...(showInicial && {
                      title: `${estado.label}: ${conteo}`
                  })}
            >
                {conteo ?
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill
            bg-light text-dark">{conteo}</span> : null}
                {isEstadoCargado ? <IconCargado/> :
                    <i className={`icon-uqai ${estado.icon} fs-4`}/>
                }
                < /span>
            :
            <span className={"d-inline-flex align-items-center"}>
                {isEstadoCargado ? <IconCargado/> :
                    <i className={`icon-uqai ${estado.icon} text-${estado.color}`}/>
                }
                &nbsp;<span>{estado.label}</span>
            </span>
        }
    </>);
}
