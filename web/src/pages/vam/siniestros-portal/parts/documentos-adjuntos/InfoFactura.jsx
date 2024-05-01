import React, {useEffect, useRef, useState} from "react";
import {Label, Modal, ModalBody, ModalFooter} from "reactstrap";
import {UqaiModalHeader} from "../../../../../components/UqaiModal";
import {useFormikContext} from "formik";
import axios from "axios";
import {routes} from "../../../../gen/UtilsGeneral";
import Alerts from "../../../../../components/Alerts";
import {
    cloneObject,
    convertDecimal,
    getImporteTotalSeleccionado,
    getKeysFromObject,
    getTotalImpuestos,
    getValorMasImpuestos
} from "./util";
import {CustomNumberFormat} from "../../../../../components/CustomNumberFormat";
import {useLoadingContext} from "./context/LoadingContextProvider";
import {
    ESTADOS_DOC_VALUES,
    findOneInEstadosLista,
    isEjecutivoOrAdminAbleToEditByEstadoSiniestro
} from "../../estados_edicion";
import {useSelector} from "react-redux";
import {fetchVerFactura} from "./services/fetchs";
import UqaiTooltip from "../../../../../components/UqaiTooltip";

export const InfoFactura = ({preffixName, idx, facturaJsonState}) => {

    const [facturaJson, setFacturaJson] = facturaJsonState;

    const alert = useRef(null);
    const facturaJsonNoChangesRef = useRef(cloneObject(facturaJson));

    const [isLoading, setIsLoading] = useLoadingContext();
    const user = useSelector(state => state.user);
    const {values, setFieldValue, initialValues} = useFormikContext();

    const [open, setOpen] = useState(false);
    const [todos, setTodos] = useState((facturaJson?.detalle || [])?.length > 0 && (facturaJson?.detalle || []).every(detalle => detalle?.seleccionado));
    const [hasError, setHasError] = useState(false);

    const isAutoComplete = values[preffixName][idx]?.documentoDigital?.detalleDocumento?.autocompletado;
    const ejecutivoOrAdminCanEdit = isEjecutivoOrAdminAbleToEditByEstadoSiniestro(user, initialValues.estadoPortal);
    const isDisabled = isLoading || !ejecutivoOrAdminCanEdit;
    const documentoDigital = values[preffixName][idx]?.documentoDigital;
    const estado = documentoDigital?.estado;

    useEffect(() => {
        const keys = getKeysFromObject(facturaJson);
        const path = documentoDigital?.pathFile;
        if (open && path && keys.length === 0) getData(path);
    }, [open, values[preffixName][idx]]);

    useEffect(() => {
        setTodos(selectAll(facturaJson))
    }, [facturaJson?.detalle])

    useEffect(() => {
        if (open) {
            facturaJsonNoChangesRef.current = cloneObject(facturaJson);
            return;
        }
        setHasError(false);
    }, [open]);

    const selectAll = fact => {
        return (fact?.detalle || [])?.length > 0 && (fact?.detalle || []).every(x => x?.seleccionado)
    }

    const toogleModal = () => {
        setOpen(!open);
    }
    const getData = (nm) => {
        fetchVerFactura(nm)
            .then(({data}) => {
                setFacturaJson(data);
                facturaJsonNoChangesRef.current = cloneObject(data);
            })
            .catch(console.log);
    }

    const saveFacturaAndUpdateValue = () => {
        if (isEstadoIngresado() && !facturaJson?.detalle?.some(d => d.seleccionado)) {
            setHasError(true);
            return;
        }
        const pathFile = values[preffixName][idx]?.documentoDigital?.pathFile;
        setIsLoading(true);
        axios.post(`${routes.api}/documentos-digitales/actualizar-valor-factura`, facturaJson,
            {params: {pathFile}})
            .then(() => {
                setFieldValue(`${preffixName}[${idx}].documentoDigital.detalleDocumento.valor`, facturaJson?.importeTotalSeleccionado || 0);
                toogleModal();
            })
            .catch(alert.current.handle_error)
            .finally(() => setIsLoading(false));
    }

    const isEstadoIngresado = () => {
        return estado === ESTADOS_DOC_VALUES.ingresado;
    }

    const handleSelectAll = (all) => {
        const list = facturaJson?.detalle?.slice() || [];
        let total = facturaJson?.importeTotalSeleccionado || 0;
        if (all) {
            let newList = list.map(det => {
                if (!det?.seleccionado) {//suma solo si aun no esta seleccionado
                    let valSinImp = det?.precioTotalSinImpuesto;
                    let impuestos = det?.impuesto;
                    let precioTotalConImpuestos = getValorMasImpuestos(valSinImp, impuestos);
                    total = getImporteTotalSeleccionado(total, precioTotalConImpuestos, true);
                    return {...det, seleccionado: true}
                } else {
                    return {...det};
                }
            })
            setFacturaJson({...facturaJson, detalle: newList, importeTotalSeleccionado: total});
        } else {
            setFacturaJson({
                ...facturaJson, detalle: list.map(det => {
                    return {...det, seleccionado: false}
                }), importeTotalSeleccionado: 0
            });
        }
    }
    const onClose = () => {
        setFacturaJson(facturaJsonNoChangesRef.current);
        setOpen(false);
    }

    return (
        <div>
            <Alerts ref={alert}/>
            {isAutoComplete && user.hasPrivileges &&
                <>
                    <i className={"btn-document-action p-0 m-0 icon-uqai uqai-documentos c-pointer"}
                       onClick={() => setOpen(!open)}
                       title={"Información de Factura"}/>
                    <UqaiTooltip message={<>Para pasar el documento a estado
                        de {findOneInEstadosLista(ESTADOS_DOC_VALUES.ingresado)?.label} debe aprobar al menos un
                        item. El valor mostrado es la suma de los detalles aprobados.</>}/>
                </>
            }
            <Modal isOpen={open} size="xl" centered>
                <UqaiModalHeader title="Información de Factura" toggle={onClose}/>
                <ModalBody>
                    <div className="container-fluid mt-3">
                        <div className="row">
                            <CabeceraItems label={"Código Principal"}/>
                            <CabeceraItems label={"Código Auxiliar"}/>
                            <CabeceraItems label={"Cantidad"}/>
                            <CabeceraItems label={"Descripción"} colLabel={"col-2"}/>
                            <CabeceraItems label={"Detalle Adicional"}/>
                            <CabeceraItems label={"Precio Unitario"}/>
                            <CabeceraItems label={"Descuento"}/>
                            <CabeceraItems label={"Precio total no impuestos"}/>
                            <CabeceraItems label={"Impuestos"}/>
                            <CabeceraItems label={"Precio total con impuestos"}/>
                            <div className={"col-1 text-center py-2 card-factura-checkbox"} title={"Seleccionar todo"}
                                 style={{border: "1px solid black"}}>
                                <fieldset disabled={isDisabled}>
                                    <Label className="form-label fw-bold text-secondary fs-7 my-1">Aprobado</Label>
                                    <input className={"form-check-input"} type="checkbox" checked={todos}
                                           onChange={() => {
                                               let all = !todos;
                                               setTodos(all);
                                               handleSelectAll(all);
                                           }}
                                    />
                                </fieldset>
                            </div>
                        </div>
                        {(facturaJson?.detalle || []).map((det, idx) => (
                            <PrintDetalle key={det?.codigoPrincipal} det={det}>
                                <fieldset disabled={isDisabled}>
                                    <DetalleCheckBox key={det?.codigoPrincipal} index={idx} detalleItem={det}
                                                     facturaJson={facturaJson} setFacturaJson={setFacturaJson}
                                                     documentoDigital={documentoDigital} setTodos={setTodos}
                                                     selectAll={selectAll}
                                    />
                                </fieldset>
                            </PrintDetalle>
                        ))}
                        <div className="row mt-4">
                            <Label className={"px-0 form-label fw-bold text-secondary fs-7"}>Valor de la
                                factura:</Label>
                            <div className={"d-flex px-0"}>
                                <CustomNumberFormat value={facturaJson?.importeTotalSeleccionado}
                                                    prefix={"$. "}/> &nbsp;/&nbsp;
                                <CustomNumberFormat value={facturaJson?.infoFactura?.importeTotal} prefix={""}/>
                            </div>
                        </div>
                    </div>
                    {isEstadoIngresado() &&
                        <div className={`mt-3 text-end ${hasError ? "text-danger" : ""}`}>*El documento se encuentra en
                            estado {findOneInEstadosLista(ESTADOS_DOC_VALUES.ingresado)?.label} por lo que debe existir
                            al menos un item aprobado.
                        </div>
                    }
                </ModalBody>
                <ModalFooter>
                    <div className="d-flex w-100 justify-content-center">
                        <button type="button" className="btn btn-primary" onClick={saveFacturaAndUpdateValue}
                                disabled={isDisabled}>
                            Actualizar valor
                        </button>
                    </div>
                </ModalFooter>
            </Modal>
        </div>
    )
}

const DetalleCheckBox = ({index, detalleItem, facturaJson, setFacturaJson, documentoDigital, setTodos, selectAll}) => {
    const [check, setCheck] = useState(detalleItem?.seleccionado ?? false);

    useEffect(() => {
        setCheck(detalleItem.seleccionado);
    }, [detalleItem])

    const handleClick = (event) => {
        const {checked} = event.target;
        if (!checked) {//desmarca cuando alguno este unchecked
            setTodos(false);
        }
        setFacturaJson(prev => {
            const detallecitos = prev?.detalle?.slice() || [];
            detallecitos[index].seleccionado = checked;
            setCheck(checked);
            setTodos(selectAll(facturaJson));
            const importeTotalSeleccionado = prev?.importeTotalSeleccionado || 0;
            const precioTotalSinImpuesto = detallecitos[index]?.precioTotalSinImpuesto;
            const impuestosList = detallecitos[index]?.impuesto;
            const precioTotalConImpuestos = getValorMasImpuestos(precioTotalSinImpuesto, impuestosList);
            const newImporteTotalSeleccionado = getImporteTotalSeleccionado(importeTotalSeleccionado, precioTotalConImpuestos, checked);
            return {
                ...prev, detalle: detallecitos, importeTotalSeleccionado: newImporteTotalSeleccionado
            };
        });
    }

    return (
        <div className={"card-factura-checkbox"}>
            <input className={"form-check-input"} type="checkbox" checked={check} defaultChecked={check}
                   onClick={handleClick} title={"Seleccionar item"}/>
        </div>
    );
}

export const PrintDetalle = ({det, children}) => {
    const totalImpuestos = getTotalImpuestos(det?.impuesto);
    const totalConImpuestos = getValorMasImpuestos(det?.precioTotalSinImpuesto, det?.impuesto);
    return (
        <div className={"row"}>
            <PrintDato dato={det?.codigoPrincipal} justify={"start"}/>
            <PrintDato dato={det?.codigoAuxiliar} justify={"start"}/>
            <PrintDato dato={det?.cantidad}/>
            <PrintDato dato={det?.descripcion} col={"col-2"} justify={"start"}/>
            <PrintDato dato={det?.detAdicional ? det?.detAdicional[0]?.valor : ''} justify={"start"}/>
            <PrintDato dato={det?.precioUnitario}/>
            <PrintDato dato={convertDecimal(det?.descuento)}/>
            <PrintDato dato={det?.precioTotalSinImpuesto}/>
            <PrintDato dato={totalImpuestos}/>
            <PrintDato dato={totalConImpuestos}/>
            <PrintDato dato={children} justify={"center"}/>
        </div>
    )
}

export const CabeceraItems = ({label, colLabel = "col-1"}) => {
    return (
        <div className={`${colLabel} card-fact`}>
            <Label
                className="form-label fw-bold text-secondary fs-7" dangerouslySetInnerHTML={{__html: label}}/>
        </div>
    )
}
export const PrintDato = ({dato, col = "col-1", justify = "center"}) => {
    return (
        <div className={`justify-content-${justify} ${col} card-fact fs-7`}>
            {dato}
        </div>
    )
}

export const PrintDatoLabel = ({label, dato, colLabel = "col-4", colDato = "col-8"}) => {
    return (
        <>
            <div className={colLabel}>
                <Label className="form-label fw-bold text-secondary fs-6">{label}</Label>
            </div>
            <div className={colDato}>
                <Label
                    className="form-label text-secondary fs-6">{dato}</Label>
            </div>
        </>
    )
}

export const DatoLabelAdicional = ({list, colLabel = "col-4", colDato = "col-8"}) => {
    return (
        <>
            {(list || []).map((adi) => (
                <>
                    <div className={colLabel}>
                        <Label className="form-label fw-bold text-secondary fs-6">{adi?.nombre}</Label>
                    </div>
                    <div className={colDato}>
                        <Label className="form-label text-secondary fs-6">{adi?.value}</Label>
                    </div>
                </>
            ))}
        </>
    )
}