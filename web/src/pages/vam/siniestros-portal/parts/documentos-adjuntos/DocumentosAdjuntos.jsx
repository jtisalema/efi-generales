import React, {useEffect, useRef, useState} from "react";
import {useFormikContext} from "formik";
import {OtrosDocumentos} from "./OtrosDocumentos";
import {Documentos} from "./Documentos";
import axios from "axios";
import {routes} from "../../../../gen/UtilsGeneral";
import {Loader} from "./Loader";
import {getFilesSizeInBytes} from "./util";
import {ErrorsContextProvider} from "./context/ErrorsContextProvider";
import {ErrorBoundary} from "../../../../../components/error-boundary/ErrorBoundary";
import {documentosDataAdapter} from "./documentosAdjuntos.adapter";
import Alerts from "../../../../../components/Alerts";
import {CardGeneral} from "../../../../../components/card/CardGeneral";
import {Gastos} from "./Gastos";
import {UqaiModalMovil} from "../UqaiModalMovil";
import {ESTADOS_DOC_LISTA, ESTADOS_DOC_VALUES, ESTADOS_SINI_VALUES} from "../../estados_edicion";
import {useLoadingContext} from "./context/LoadingContextProvider";

const endpoint = "/documentos-siniestros";

export const DocumentosAdjuntos = () => {

    const [isLoading, setIsLoading] = useState(false);
    // separado para no afectar el componente principal
    const setIsGlobalLoading = useLoadingContext()[1];
    const alert = useRef(null);

    const {values, setFieldValue} = useFormikContext();
    const {
        documentos, gastos, otrosDocumentos, cdAseguradora, cdRamo, tpSiniestro,
        cdReclamo, cdIncSiniestro
    } = values;

    useEffect(() => {
        setFieldValue("uuid", Date.now());
    }, [])
    useEffect(() => {
        if (cdAseguradora && cdRamo && tpSiniestro) getDocumentosAdjuntos();
    }, [cdAseguradora, cdRamo, tpSiniestro, cdReclamo, cdIncSiniestro]);

    useEffect(() => {
        setFieldValue("documentosSize", getFilesSizeInBytes(values));
    }, [documentos, gastos, otrosDocumentos]);

    function getDocumentosAdjuntos() {
        setIsLoading(() => true);
        setIsGlobalLoading(() => true);
        axios.post(routes.api + endpoint, {
            cdAseguradora,
            cdRamo,
            tpSiniestro,
            cdReclamo,
            cdIncSiniestro,
            uuid: values.uuid,
        })
            .then(adjuntosAdapter)
            .catch(alert.current.handle_error)
            .finally(() => {
                setIsLoading(() => false);
                setIsGlobalLoading(() => false);
            });
    }

    function adjuntosAdapter(resp) {
        const {documentos, gastos, otrosDocumentos} = documentosDataAdapter(resp);
        setFieldValue("documentos", documentos);
        setFieldValue("gastos", gastos);
        setFieldValue("otrosDocumentos", otrosDocumentos);
    }

    if (isLoading) return <Loader/>

    return (<>
        <Alerts ref={alert}/>
        <ErrorBoundary>
            <ErrorsContextProvider>
                <CardGeneral title={
                    <>
                        Documentos
                        <UqaiModalMovil showButton/>
                    </>
                } iconClass={"uqai-documentos"}>
                    <EstadosLeyenda/>
                    <Documentos preffixName={"documentos"} documentos={documentos}>
                        {(otrosDocumentos?.length || values?.estadoPortal === ESTADOS_SINI_VALUES.documentoAdicional)
                            ? <OtrosDocumentos/> : null}
                    </Documentos>
                </CardGeneral>
                {gastos?.length > 0 &&
                    <CardGeneral title={"Tipo de gasto"} iconClass={"uqai-tipo_gasto"} className={"mt-4"}>
                        <Gastos gastos={gastos}/>
                    </CardGeneral>
                }
            </ErrorsContextProvider>
        </ErrorBoundary>
    </>);
}

const EstadosLeyenda = () => {

    const estadosDocumentos = ESTADOS_DOC_LISTA.filter(e => (!e.hide || e.value === ESTADOS_DOC_VALUES.cargado));

    return (
        <div className={"d-flex flex-wrap mt-1 mb-4"}>
            {estadosDocumentos.map(ed =>
                <div key={ed.value} className={"d-flex flex-wrap align-items-center pe-3 pb-2"}>
                    <div className={`legend-box bg-${ed.color}`}/>
                    <small className={"ps-1"}>{ed.leyenda ?? ed.label}</small>
                </div>
            )}
        </div>
    );
}