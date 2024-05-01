import {useFormikContext} from "formik";
import React, {useRef, useState} from "react";
import {deleteFile} from "./drop-zone/utils";
import {UqaiField} from "../../../../../components/UqaiField";
import {UqaiDropZone} from "./drop-zone/UqaiDropZone";
import {useLoadingContext} from "./context/LoadingContextProvider";
import {useSelector} from "react-redux";

import {findOneInEstadosLista, isUserAbleToEditByEstadoSiniestro} from "../../estados_edicion";
import {TituloDocumento} from "./Documentos";
import {AccionesAdjuntos} from "./AccionesAdjuntos";
import {EstadoDocumento} from "./EstadoDocumento";
import Alerts from "../../../../../components/Alerts";
import {useAutoTitle} from "./hooks/useAutoTitle";
import {ListObservaciones} from "../../../../../components/FiltrosSiniestros";

export const OtrosDocumentos = () => {
    const {values, setFieldValue} = useFormikContext();
    const {otrosDocumentos} = values;
    const [indice, setIndice] = useState(otrosDocumentos?.length || 0);
    const dropZoneBtnRef = useRef(null);
    const setIsloading = useLoadingContext()[1];

    const user = useSelector(state => state.user);
    const {isNew, estadoPortal} = values;
    const forceAble = (!user.hasPrivileges && isNew) || isUserAbleToEditByEstadoSiniestro(user, estadoPortal);
    const alert = useRef(null);

    const onDelete = (idx, value) => {
        setIsloading(true);
        deleteFile(value)
            .then(() => {
                let newArray = otrosDocumentos.slice();
                newArray?.splice(idx, 1);
                setFieldValue(`otrosDocumentos`, newArray)
            })
            .catch(alert.current.handle_error)
            .finally(() => setIsloading(false));
    }

    const onClickEdit = (_, idx) => {
        let currentIndex = idx ?? (otrosDocumentos?.length || 0);
        setIndice(() => currentIndex);
        dropZoneBtnRef.current.open();
    }

    return (
        <div className={"col-12 mt-3 d-flex flex-wrap align-items-start justify-content-center"}>
            <Alerts ref={alert}/>
            <div className={"col-lg-4"}>
                <TituloDocumento documento={{nmDocumento: "Otros documentos"}}/>
                <div className={"d-flex flex-wrap align-items-center"}>
                    <UqaiField name={`otrosDocumentos[${indice}]`}>
                        {({form, field}) => (
                            <UqaiDropZone form={form} field={field} ref={dropZoneBtnRef}
                                          label={<>Agregar documento: <br/> pdf, jpg, png</>}
                                          showActions={false} showMaxSize={true} titulo={" "} ignoreFileName={true}
                                          onClick={onClickEdit} indice={indice} forceAble={forceAble} noBorder/>
                        )}
                    </UqaiField>
                    <ListObservaciones txt={values?.observacionesEstados} icon={"comentario"}
                                       className={"w-auto ms-2 mt-2"}
                    />
                </div>
            </div>
            <div className={`col-lg my-3 ${user.isUser ? "" : "actions-document-no-user"}`}>
                {(otrosDocumentos || []).map((documento, idx) =>
                    <div key={"otrosDocumentos" + documento.documentoDigital?.cdArchivo}
                         className={`d-flex flex-wrap flex-lg-nowrap gap-2 my-3 ${user.hasPrivileges ? "my-md-2" : "my-md-1"}`}>
                        <div className={"col-8 col-sm-4 col-lg-5 p-0 align-items-center document-name-order d-flex"}>
                            <DocumentLabelName estado={documento.documentoDigital?.estado}
                                               text={documento.documentoDigital?.nombre}
                            />
                        </div>
                        <AccionesAdjuntos documentoDigital={documento.documentoDigital}
                                          onDelete={() => onDelete(idx, documento.documentoDigital)}
                                          onEdit={(e) => onClickEdit(e, idx)}>
                            <EstadoDocumento name={`otrosDocumentos[${idx}]`} documento={documento} alert={alert}/>
                        </AccionesAdjuntos>
                    </div>)}
            </div>
        </div>)

}

export const DocumentLabelName = ({estado, text, color, title, ...props}) => {

    const [isLoading] = useLoadingContext();
    const noBorder = props?.noBorder || isLoading;
    const labelRef = useRef(null);
    useAutoTitle(labelRef);

    return <>
        <span ref={labelRef}
              className={`label-with-document border-state-${estado ? findOneInEstadosLista(estado).color : color} 
              ${noBorder ? "border-0 ps-0" : ""} ${props?.className ?? ""} ${props?.isBtn ? "btn-document" : ""}`}>
            {text}
        </span>
    </>
}