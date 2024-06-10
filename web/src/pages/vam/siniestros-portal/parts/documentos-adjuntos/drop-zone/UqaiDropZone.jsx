import {useDropzone} from 'react-dropzone'
import {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import {useFormikContext} from "formik";
import Humanize from "humanize-plus"
import styles from "./UqaiDropZone.module.scss"
import {deleteFile, getBtnClassAndIcon, optimizeImage, saveFileToMinio} from "./utils";
import PropTypes from "prop-types";
import {AccionesAdjuntos} from "../AccionesAdjuntos";
import {removeDocumentsFromValues} from "../documentosAdjuntos.adapter";
import {bytesToMb, getCumulativeSizes, isFactura, MAX_ADJUNTOS_SIZE, MAX_SIZE_IMAGEN} from "../util";
import Alerts from "../../../../../../components/Alerts";
import {useLoadingContext} from "../context/LoadingContextProvider";
import {useSelector} from "react-redux";
import {EstadoDocumento} from "../EstadoDocumento";

import {ESTADOS_DOC_VALUES, isUserAbleToEditDocument} from "../../../estados_edicion";
import {DocumentLabelName} from "../OtrosDocumentos";

export const UqaiDropZone = forwardRef(function UqaiDropZone({
                                                                 form, field, maxSize, showMaxSize, accept,
                                                                 multiple, label, showActions, isSaving,
                                                                 autoUpdateArchivo = true,
                                                                 ...props
                                                             }, ref) {

    const alert = useRef(null);
    const isObligatory = field.value != null && field.value.obligatorio;

    const {values, isSubmitting} = form;
    let {name, value} = field;
    const documentoDigital = value?.documentoDigital;

    const {setFieldValue, setFieldTouched} = useFormikContext();
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useLoadingContext();
    const facturaJsonState = useState({});

    const user = useSelector(state => state.user);
    const isEjecutivoOrAdmin = user.hasPrivileges;
    const showEstadoDocumento = ((documentoDigital?.estado && documentoDigital?.cdArchivo) || isEjecutivoOrAdmin) &&
        (documentoDigital?.cdDocSiniestro || documentoDigital?.cdSdocSiniestro); // que no sea de tipo "otros documentos"
    const isAbleToEdit = values.isNew || isUserAbleToEditDocument(user, documentoDigital?.estado, values.estadoPortal);
    const isButtonDisabled = isLoading || (!props?.forceAble && (isSubmitting || isEjecutivoOrAdmin || !isAbleToEdit));

    let {dropzoneButton} = styles;
    // migrado a hook solo por diversion |m|
    const {getRootProps, getInputProps, isDragAccept, isDragReject, open} = useDropzone({
        // Disable click and keydown behavior
        noClick: true,
        noKeyboard: true,
        accept, multiple, onDrop, onDropRejected, onBlur
    });
    dropzoneButton = isDragAccept ? styles.acceptStyle : dropzoneButton;
    dropzoneButton = isDragReject ? styles.rejectStyle : dropzoneButton;
    const [btnClass, icon] = getBtnClassAndIcon(value, isLoading, props?.ignoreFileName);
    useEffect(() => {
        if (preview) setError("");
    }, [preview])

    useImperativeHandle(ref, () => {
        return {
            open() {
                open();
            },
        };
    }, [])

    function onDrop(acceptedFiles) {
        if (acceptedFiles && acceptedFiles.length > 0) {
            // imageBase64Data
            let file = acceptedFiles[0];
            //se optimiza solo imagenes para que cuando se valide el tamaño con la optimización la imagen pueda ser cargada
            if (file.type.toString().toLowerCase().indexOf('image') >= 0 && file.size > MAX_SIZE_IMAGEN) {
                optimizeImage(file, 2000, MAX_SIZE_IMAGEN).then((result) => {
                    continueOnDrop(result);
                }).catch((error) => {
                    console.error("Error", error);
                    alert.current.show_error("Ha ocurrido un error al cargar la imagen.");
                });
            } else if (file.size <= maxSize) {
                continueOnDrop(file);
            } else {
                showIndividualFileMaxSize();
            }
        }
    }

    function continueOnDrop(file) {
        const nextTotalSize = (values?.documentosSize || 0) + (getCumulativeSizes(0, values.subdocumentosItemsAux)) + file.size - (documentoDigital?.tamanio || 0);
        if (nextTotalSize > MAX_ADJUNTOS_SIZE) {
            alert.current.show_info(`El tamaño ${Humanize.fileSize(file.size)} del archivo que intenta subir hace que se supere el almacenamiento permitido: ${bytesToMb(nextTotalSize)} / ${Humanize.fileSize(MAX_ADJUNTOS_SIZE)}.
             Ha superado el tamaño de carga, por favor comuníquese con su Ejecutivo para la carga del documento`);
            return;
        }
        Object.assign(file, {
            preview: URL.createObjectURL(file)
        });
        setPreview(file.preview);
        const newValues = removeDocumentsFromValues({
            documentoDigital: {cdRamo: values?.cdRamo, orden: props?.indice},
            idUsuario: user.id,
            ...values, ...value,
            uuid: (value?.subdocumento && !value?.documentoDigital?.uuid) ? undefined : values?.uuid,
        });
        savingFile({newValues, file});
    }

    const handleErrorSri = (documentoDigital) => {
        const isSriError = documentoDigital?.detalleDocumento?.sriError;
        const isAutocompletado = documentoDigital?.detalleDocumento?.autocompletado;
        const isTipoFactura = isFactura(documentoDigital?.tipo);
        if (isTipoFactura && (isSriError || !isAutocompletado))
            alert?.current?.show_error("No se encuentra el documento, por favor completar la información manualmente");
    }

    function savingFile({newValues, file}) {
        if (autoUpdateArchivo) {
            setIsLoading(true);
            saveFileToMinio(newValues, file, user)
                .then(resp => {
                    const metadato = JSON.parse(resp.data.metadato);
                    const detalleDocumento = resp.data.detalleDocumento;
                    if (detalleDocumento) detalleDocumento.fcCaducDocumento = null;
                    setFieldValue(`${name}.documentoDigital`, {
                        ...resp.data, metadato, detalleDocumento
                    });
                    handleErrorSri(resp.data);
                })
                .catch(error => {
                    setPreview(null);
                    alert.current.handle_error(error);
                })
                .finally(() => setIsLoading(false));
        } else {
            setFieldValue(`${name}.documentoDigital.nombre`, file.name);
            setFieldValue(`${name}.documentoDigital.url`, file.preview);
            setFieldValue(`${name}.documentoDigital.tamanio`, file.size);
            setFieldValue(`${name}.documentoDigital.estado`, ESTADOS_DOC_VALUES.cargado);
            setFieldValue(`${name}.file`, file);
        }
    }

    function onDropRejected(files) {
        if (files?.length > 0) {
            if (files[0].file.size > maxSize) {
                showIndividualFileMaxSize();
            } else {
                setError('Archivo no permitido');
            }
        }
    }

    function onBlur() {
        setFieldTouched(name, true);
    }

    const onDelete = useCallback(() => {
        if (documentoDigital?.cdArchivo && !value?.subdocumento) {
            setIsLoading(true);
            deleteFile(documentoDigital)
                .then(() => {
                    setPreview(undefined);
                    const docReseted = resetFields();
                    props?.aditionalOnDelete?.(docReseted);
                })
                .catch(console.log)
                .finally(() => setIsLoading(false));
        } else if (documentoDigital?.cdArchivo) {
            setFieldValue(`${name}.documentoDigital.estado`, ESTADOS_DOC_VALUES.porEliminar);
        } else {
            resetFields();
            setFieldValue(`${name}.file`, undefined);
            props?.newCamposAdicionalesKey?.();
        }
    }, [documentoDigital, value?.subdocumento]);

    const onError = () => {
        setPreview(undefined);
    };

    function getLabelName() {
        let labelName = user.isUser ? "Cargando archivo" : "Espere";
        const maxSizeLabel = (showMaxSize && !isLoading) ? ` (${Humanize.fileSize(documentoDigital?.tamanio || maxSize)})` : "";
        if (isLoading) return <>{labelName}</>;
        if (props?.ignoreFileName) return <>{label} {maxSizeLabel}</>;
        if (documentoDigital?.nombre) return <>{documentoDigital?.nombre} {maxSizeLabel}</>;
        return <>{label} {maxSizeLabel}</>;
    }

    function resetFields() {
        const {cdArchivo, cdCobertura, cdDocSiniestro, cdSdocSiniestro, tipo, numGrupo, orden} = documentoDigital;
        const documentoDigitalReseted = {
            cdCobertura, cdDocSiniestro, cdSdocSiniestro, tipo, numGrupo, orden, detalleDocumento: {},
        };
        setFieldValue(`${name}.documentoDigital`, documentoDigitalReseted);
        return {cdArchivo, ...documentoDigitalReseted};
    }

    function showIndividualFileMaxSize() {
        const maxSizeError = (maxSize && showMaxSize) ? ` (máximo ${Humanize.fileSize(maxSize)})` : "";
        alert.current.show_info(`El tamaño del archivo supera lo admitido ${maxSizeError}, por favor comuníquese con su Ejecutivo para la carga del documento`);
    }

    return (
        <>
            <div>
                <Alerts ref={alert}/>
                {preview && props.showPreview &&
                    <div className={styles.thumb}>
                        <img src={preview} className={styles.img} onError={onError} alt={""}/>
                    </div>
                }
                {props?.titulo && <div className={"d-inline-block mb-2"}><b>{props.titulo}</b></div>}
                <>
                    <div
                        className={`d-flex flex-wrap gap-2 ${isEjecutivoOrAdmin ? "actions-document-no-user" : "actions-document-user"} 
                ${(value?.subdocumento === true) ? "subdocumento" : ""} ${(value?.subdocumento === false) ? "documento" : ""}`}>
                        <div className={"d-flex document-name-order"}>
                            <input {...getInputProps()} />
                            <div {...getRootProps()} className={styles.dropzoneContainer}>
                                <button type={"button"} onClick={props?.onClick ?? open}
                                        disabled={isButtonDisabled}
                                        className={[dropzoneButton, "btn-document", btnClass].join(" ")}>
                                    <div className={"d-inline-flex align-items-center"}>
                                        {icon ?
                                            <i className={`btn-icon text-primary icon-uqai ${icon} ${isLoading ? "icon-uqai-is-spinning" : ""} `}/>
                                            : null
                                        }
                                        &nbsp;
                                        <DocumentLabelName text={getLabelName()} estado={documentoDigital?.estado}
                                                           noBorder={props?.noBorder || !documentoDigital?.url}/>
                                    </div>
                                </button>
                            </div>
                        </div>
                        {documentoDigital?.cdArchivo && !isLoading && showActions ?
                            <AccionesAdjuntos documentoDigital={documentoDigital} onDelete={isObligatory?null:onDelete} onEdit={open}
                                              name={name} isSubdocumento={value?.subdocumento}
                                              isRequired={props?.isRequired}
                            />
                            : null
                        }
                        {showEstadoDocumento ?
                            // envio props?.alert para tener la referencia de un componente más arriba
                            <EstadoDocumento name={name} documento={value} alert={props?.alert}
                                             autoUpdateEstado={props?.autoUpdateEstado}
                                             facturaJsonState={facturaJsonState}/>
                            : null
                        }
                    </div>
                </>
                {error && <small>{error}</small>}
            </div>
            {props?.children instanceof Function ? props.children(facturaJsonState) : props.children}
        </>
    )
});

UqaiDropZone.propTypes = {
    /**
     * nombre del field (formik name)
     */
    name: PropTypes.string,
    /**
     * El tamaño máximo (en bytes) permito para el archivo
     */
    maxSize: PropTypes.number,
    /**
     * Si se muestra o no el tamaño máximo permitido
     */
    showMaxSize: PropTypes.bool,
    /**
     * Las extensiones de archivos permitidos separados por comas
     */
    accept: PropTypes.string,
    /**
     * Si se va a cargar múltiples archivos
     */
    multiple: PropTypes.bool,
    /**
     * Título a mostrar encima del botón
     */
    titulo: PropTypes.any,
    /**
     * Ícono que acompaña al label
     */
    icon: PropTypes.string,
    /**
     * Label a mostrar en el botón
     */
    label: PropTypes.string,
    /**
     * Si se muestra la previsualización (en imágenes)
     */
    showPreview: PropTypes.bool,
    /**
     * Si se muestra las acciones en el botón
     */
    showActions: PropTypes.bool,
    /**
     * Si se debe ignorar el nombre del archivo y mostrar siempre el label
     */
    ignoreFileName: PropTypes.bool,
    /**
     * Función que se quiera realizar al dar click en el botón antes de abrir el File Dialog
     */
    onClick: PropTypes.func,

}

UqaiDropZone.defaultProps = {
    maxSize: MAX_ADJUNTOS_SIZE, // MB
    accept: "application/pdf, image/jpg, image/jpeg, image/png",
    multiple: false,
    label: "Subir archivo: pdf, jpg, png",
    showMaxSize: true,
    showPreview: false,
    showActions: true,
    ignoreFileName: false,
}
