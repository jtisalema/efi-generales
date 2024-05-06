import { ButtonModal } from "../../../../../components/button-modal/ButtonModal";
import React, { useEffect, useRef, useState } from "react";
import { Documentos, TituloDocumento } from "./Documentos";
import { useFormikContext } from "formik";
import UqaiFormik from "../../../../../components/UqaiFormik";
import { removeDocumentsFromValues } from "./documentosAdjuntos.adapter";
import { CustomNumberFormat } from "../../../../../components/CustomNumberFormat";
import {
  getEntriesFromObject,
  getKeysFromObject,
  getSubTotalFacturas,
  getValorReclamo,
  isFactura,
  tiposDocumentos,
} from "./util";
import { deleteMulitpleFiles, saveSubdocuments } from "./drop-zone/utils";
import { useLoadingContext } from "./context/LoadingContextProvider";
import { useSelector } from "react-redux";
import { AccionesAdjuntos } from "./AccionesAdjuntos";
import { useErrorsContext } from "./context/ErrorsContextProvider";
import Alerts from "../../../../../components/Alerts";
import { DocumentLabelName } from "./OtrosDocumentos";
import { EstadoDocumentoLabel } from "./EstadoDocumento";

export const Gastos = ({ gastos, containerClass, itemClass }) => {
  const principalFormik = useFormikContext();
  const { values, setFieldValue } = principalFormik;

  useEffect(() => {
    filterGastos();
  }, [values?.gastos]);

  function filterGastos() {
    if (!values?.gastos) return;
    const { gastos } = values;
    let idxsGastosToDelete = [];
    gastos.forEach((gasto, idx) => {
      const { subdocumentosEstructura, subdocumentosItems } = gasto;
      const isNeededToShow =
        subdocumentosEstructura?.some((se) => se.activo) ||
        getKeysFromObject(subdocumentosItems)?.length;
      if (!isNeededToShow || !subdocumentosEstructura?.length)
        idxsGastosToDelete.push(idx);
    });
    const newGastos = gastos.filter(
      (_, idx) => !idxsGastosToDelete.includes(idx)
    );
    if (gastos.length !== newGastos.length) setFieldValue("gastos", newGastos);
  }

  /* Cuidado con anidar formiks dejarselo a nosotros los senior xD */
  const initialAux = removeDocumentsFromValues(principalFormik.values);
  const [initialValuesAux, setInitialValuesAux] = useState(initialAux);
  return (
    <>
      <UqaiFormik
        initialValues={initialValuesAux}
        onSubmit={() => null}
        enableReinitialize={true}
        validateOnChange={false}
        validateOnBlur={false}
      >
        <div className={containerClass ?? "row"}>
          {(gastos || []).map((gasto, idxGasto) => (
            <SubdocumentosWrapper
              key={gasto.cdDocSiniestro + "-" + gasto.cdSdocSiniestro}
              itemClass={itemClass}
              setInitialValuesAux={setInitialValuesAux}
              principalFormik={principalFormik}
              idxGasto={idxGasto}
              gasto={gasto}
            />
          ))}
        </div>
      </UqaiFormik>
    </>
  );
};

const SubdocumentosWrapper = ({
  itemClass,
  setInitialValuesAux,
  principalFormik,
  idxGasto,
  gasto,
}) => {
  return (
    <>
      {
        <div className={itemClass ?? "col-12 mb-5"}>
          <div className={"mb-3"}>
            <b>
              <TituloDocumento
                documento={{
                  nmDocumento: `${idxGasto + 1}. ${gasto.nmDocumento}`,
                }}
                isRequired={gasto?.obligatorio}
              />
            </b>
            <small className={"ms-2"}>
              Sub total facturas:/&nbsp;
              <b>
                <CustomNumberFormat
                  value={gasto?.subTotalFacturas ?? 0}
                  prefix={"$. "}
                />
              </b>
            </small>
          </div>
          <div
            className={
              "d-flex gap-3 gasto flex-wrap flex-lg-nowrap justify-content-center"
            }
          >
            <Subdocumentos
              setInitialValuesAux={setInitialValuesAux}
              principalFormik={principalFormik}
              idxGasto={idxGasto}
              subdocumentosEstructura={gasto?.subdocumentosEstructura}
              subdocumentosItems={gasto?.subdocumentosItems}
            />
          </div>
        </div>
      }
    </>
  );
};

const Subdocumentos = ({
  setInitialValuesAux,
  principalFormik,
  idxGasto,
  subdocumentosEstructura,
  subdocumentosItems,
}) => {
  const user = useSelector((state) => state.user);
  const hasPrivileges = user.hasPrivileges;
  const alert = useRef(null);

  const [indice, setIndice] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [isLoading, setIsLoading] = useLoadingContext();
  const [subdocumentosEstructuraFiltered, setSubdocumentosEstructuraFiltered] =
    useState(subdocumentosEstructura || []);
  const [hasError, setHasError] = useState(false);
  const [globalErrors, setGlobalErrors] = useErrorsContext();

  const { values, setFieldValue } = principalFormik;
  // si uno es obligatorio todos se vuelven obligatorios
  const isSomeRequired = subdocumentosEstructuraFiltered.some(
    (se) => se.obligatorio
  );

  const {
    initialValues: initialValuesAux,
    values: valuesAux,
    setFieldValue: setFieldValueAux,
    dirty: dirtyAux,
    submitForm: submitFormAux,
    setSubmitting: setSubmittingAux,
  } = useFormikContext();

  const currentPricipalSubitemsNameArray = `gastos[${idxGasto}].subdocumentosItems`;
  const currentPricipalSubitemsValueArray =
    values?.gastos?.at?.(idxGasto)?.subdocumentosItems?.[indice];
  const currentAuxiliarSubitemsName = `subdocumentosItemsAux`;
  const currentAuxiliarSubitemsValue = valuesAux?.subdocumentosItemsAux;

  useEffect(() => {
    setFieldValue(
      `gastos[${idxGasto}].subTotalFacturas`,
      getSubTotalFacturas(subdocumentosItems)
    );
  }, [subdocumentosItems, idxGasto, values.gastos?.length]);

  useEffect(() => {
    setFieldValue(`valorReclamoPortal`, getValorReclamo(values.gastos));
  }, [values.gastos?.at?.(idxGasto)?.subTotalFacturas]);

  useEffect(() => {
    if (!subdocumentosItems) return;
    let keysToDelete = [];
    const newSubdocumentosItems = JSON.parse(
      JSON.stringify(subdocumentosItems)
    ); // deepClone
    getEntriesFromObject(newSubdocumentosItems).forEach(([key, items]) => {
      const isAllEmpty = items?.every((docDigital) => !docDigital?.cdArchivo);
      if (isAllEmpty) keysToDelete.push(key);
    });
    if (keysToDelete.length > 0) {
      keysToDelete.forEach((key) => delete newSubdocumentosItems?.[key]);
      setFieldValue(currentPricipalSubitemsNameArray, newSubdocumentosItems);
    }
  }, [subdocumentosItems]);

  function getNextIndice() {
    const keys = getKeysFromObject(subdocumentosItems);
    if (!keys.length) return 0;
    return Math.max(...keys.map((key) => parseInt(key))) + 1 || 0;
  }

  function setNumGrupoAndOrden(items, idx) {
    (items || []).forEach((item, orden) => {
      if (item) {
        try {
          item.documentoDigital.numGrupo =
            item.documentoDigital.numGrupo ?? idx;
          item.documentoDigital.orden = item.documentoDigital.orden ?? orden;
        } catch (ex) {
          item.numGrupo = item.numGrupo ?? idx;
          item.orden = item.orden ?? orden;
        }
      }
    });
  }

  function filterSubdocuments(newArray) {
    const subdocumentosTmp = [];
    newArray?.forEach((se) => {
      if (
        se.activo ||
        se?.documentoDigital?.url ||
        se?.documentoDigital?.cdReclamo
      ) {
        subdocumentosTmp.push(se);
      }
    });
    setSubdocumentosEstructuraFiltered(subdocumentosTmp);
    return subdocumentosTmp;
  }

  function setDatosAux({ currentSubdocsItems, idx, justEditting }) {
    const estructuras = subdocumentosEstructura?.slice();
    const array = currentSubdocsItems ?? estructuras;
    let newArray = array?.map?.((item) => {
      const estructuraSubDoc = estructuras?.find(
        (e) => e.cdSdocSiniestro === item?.documentoDigital?.cdSdocSiniestro
      );
      return removeDocumentsFromValues({
        ...estructuraSubDoc, // props de subdocumento
        cdReclamo: justEditting ? valuesAux?.cdReclamo : undefined,
        documentoDigital: {
          ...item.documentoDigital,
          detalleDocumento:
            item.documentoDigital?.detalleDocumento || undefined,
        },
      });
    });
    newArray = filterSubdocuments(newArray);
    setNumGrupoAndOrden(newArray, idx);
    //documentosSize: para hacer referencias en los subdocumentos del modal
    setInitialValuesAux({
      ...valuesAux,
      documentosSize: values?.documentosSize,
      subdocumentosItemsAux: newArray,
    });
    setFieldValueAux(`subdocumentosItemsAux`, newArray);
  }

  function onClose(withConfirmation = true) {
    if (
      withConfirmation &&
      dirtyAux &&
      !window.confirm("Tiene cambios sin agregar ¿Desea Salir?")
    )
      return;
    setIsOpen(false);
    setIsEditting(false);
    setInitialValuesAux({ ...valuesAux, subdocumentosItemsAux: [] });
    setFieldValueAux(`subdocumentosItemsAux`, []);
    setGlobalErrors({});
  }

  function onOpenNew() {
    const key = getNextIndice();
    setIndice(key);
    setDatosAux({ idx: key });
    setIsOpen(true);
    setHasError(false);
  }

  function touchForm() {
    // en este form secundario solo quiero mandar a validar los campos no se hace ningun proceso de envio
    submitFormAux();
    setSubmittingAux(false);
  }

  function onAgregar() {
    if (!dirtyAux) {
      onClose(false);
      return;
    }
    let newArray = currentAuxiliarSubitemsValue?.slice() || [];
    !hasPrivileges && touchForm();
    if (areThereErrors(newArray)) return;
    if (isEditting) newArray = filterItemsDirty(newArray);
    savingFiles(newArray);
  }

  function savingFiles(newArray) {
    let formData = new FormData();
    newArray.forEach((item) => {
      item.file = undefined;
    });
    formData.append(
      "item",
      new Blob(
        [
          JSON.stringify({
            siniestro: removeDocumentsFromValues(valuesAux),
            items: newArray,
          }),
        ],
        { type: "application/json" }
      )
    );
    setIsLoading(() => true);
    saveSubdocuments(formData, user)
      .then(setDocumentosToPrincipalFormik)
      .catch(alert.current.handle_error)
      .finally(() => setIsLoading(false));
  }

  function filterItemsDirty(newArray) {
    return newArray.filter(
      (documento, idx) =>
        JSON.stringify(documento) !==
        JSON.stringify(initialValuesAux.subdocumentosItemsAux.at(idx))
    );
  }

  function setDocumentosToPrincipalFormik({ data }) {
    let currentSubitems = data;
    if (currentPricipalSubitemsValueArray) {
      currentSubitems = currentPricipalSubitemsValueArray.slice();
      (currentPricipalSubitemsValueArray || []).forEach((docDigital, idx) => {
        const docDigitalUpdated = data.find(
          (d) =>
            (d.cdArchivo && d.cdArchivo === docDigital.cdArchivo) ||
            (d.orden === docDigital.orden && d.numGrupo === docDigital.numGrupo)
        );
        if (docDigitalUpdated) currentSubitems[idx] = docDigitalUpdated;
      });
    }
    setFieldValue(
      `${currentPricipalSubitemsNameArray}[${indice}]`,
      currentSubitems
    );
    onClose(false);
  }

  const onEdit = (key) => {
    setIndice(() => key);
    let currentArray = subdocumentosItems?.[key]?.slice();
    currentArray = currentArray?.map((docDigital) => ({
      documentoDigital: { ...docDigital },
    }));
    setDatosAux({
      currentSubdocsItems: currentArray,
      justEditting: true,
      idx: key,
    });
    setIsEditting(() => true);
    setIsOpen(() => true);
  };

  const onDelete = (key) => {
    const newSubdocumentosItems = { ...subdocumentosItems };
    setIsLoading(true);
    deleteMulitpleFiles({ archivos: newSubdocumentosItems?.[key] })
      .then(() => {
        delete newSubdocumentosItems?.[key];
        setFieldValue(currentPricipalSubitemsNameArray, newSubdocumentosItems);
      })
      .catch(console.log)
      .finally(() => setIsLoading(false));
  };

  function getModalSize(items) {
    const itemsLength = items?.length ?? 0;
    if (itemsLength >= 3) return "xl";
    if (itemsLength > 1) return "lg";
    return "md";
  }

  function getCols(items) {
    const itemsLength = items?.length ?? 0;
    if (itemsLength >= 3) return "col-lg-4";
    if (itemsLength > 1) return "col-lg-6";
    return "col";
  }

  function areThereErrors(newArray) {
    if (hasPrivileges) return false;
    const obligatorios =
      newArray?.filter((subdocumento) => subdocumento?.obligatorio) || [];
    let errorFounded = false;
    obligatorios.some((subdocumento) => {
      const { documentoDigital } = subdocumento;
      const tipo = documentoDigital?.tipo;
      if (!documentoDigital?.url) errorFounded = true;
      const isReceta = tiposDocumentos.RECETA.tipos.includes(tipo);
      const campos = tiposDocumentos[tipo?.toUpperCase()].campos;
      campos?.forEach((campo) => {
        if (!isReceta || (isReceta && subdocumento.reqFecha)) {
          if (!documentoDigital?.detalleDocumento?.[campo]) errorFounded = true;
        }
      });
      return errorFounded;
    });
    errorFounded =
      getKeysFromObject(globalErrors).some((key) => globalErrors[key]) ||
      errorFounded;
    setHasError(errorFounded);
    return errorFounded;
  }

  function aditionalOnDelete(docDigitalReseted) {
    const { numGrupo, cdArchivo } = docDigitalReseted;
    const nulos = [null, undefined];
    if (
      nulos.includes(numGrupo) ||
      nulos.includes(cdArchivo) ||
      nulos.includes(subdocumentosItems)
    )
      return;
    const idxArchivoToReset = subdocumentosItems[numGrupo]?.findIndex(
      (doc) => doc.cdArchivo === cdArchivo
    );
    if (idxArchivoToReset < 0) return;
    setFieldValue(
      `${currentPricipalSubitemsNameArray}[${numGrupo}][${idxArchivoToReset}]`,
      docDigitalReseted
    );
  }

  return (
    <>
      <Alerts ref={alert} />
      <div>
        <ButtonModal
          isOpen={isOpen}
          onOpen={onOpenNew}
          onClose={onClose}
          title={`${idxGasto + 1}. ${values?.gastos?.at?.(idxGasto)?.nmDocumento}`}
          modalProps={{ size: getModalSize(subdocumentosEstructuraFiltered) }}
          icon={"uqai-agregar text-primary fs-3"}
          hoverIcon={"uqai-abrir-carpeta"}
        >
          <div className="modal-body">
            {subdocumentosEstructuraFiltered.length > 0 ? (
              <Documentos
                title={`${idxGasto + 1}. ${values?.gastos?.at?.(idxGasto)?.nmDocumento}`}
                preffixName={currentAuxiliarSubitemsName}
                alert={alert}
                aditionalOnDelete={aditionalOnDelete}
                autoUpdateEstado={false}
                autoUpdateArchivo={true}
                documentos={subdocumentosEstructuraFiltered}
                itemClass={getCols(subdocumentosEstructuraFiltered)}
              />
            ) : (
              <h5 className={"py-4"}>
                No se encontraron documentos activos para este grupo
              </h5>
            )}
          </div>
          <div className="modal-footer">
            {hasError ? (
              <small className={"text-danger d-block w-100 text-right"}>
                {` ${
                  isSomeRequired
                    ? "Recuerde adjuntar todos los documentos y llenar todos los campos de aquellos marcados con *"
                    : "Debe corregir los errores"
                }`}
              </small>
            ) : null}
            <div className="d-flex w-100 justify-content-center">
              <button
                type={"button"}
                className={"btn btn-primary"}
                onClick={onAgregar}
                disabled={isLoading || !dirtyAux}
              >
                {isEditting ? "Guardar cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </ButtonModal>
      </div>
      <div
        className={`d-flex flex-column w-100 ${
          user.hasPrivileges ? "order-minus-1" : ""
        }`}
      >
        {getKeysFromObject(subdocumentosItems)?.length ? (
          <></>
        ) : (
          <div>No se han subido grupos de documentos</div>
        )}
        {(Object.entries(subdocumentosItems || {}) || []).map(
          ([key, items], idx) => (
            <div key={key} className={"d-flex flex-wrap mb-3 mb-md-2 gap-2"}>
              <button
                type={"button"}
                className={`btn p-0 border-0 d-flex flex-wrap flex-md-nowrap col-8 col-sm-4
                                ${
                                  user.isUser
                                    ? "cursor-default col-md-5 col-lg-9"
                                    : "btn-hover-document col-md-10"
                                }`}
                onClick={() => (user.hasPrivileges ? onEdit(key) : null)}
              >
                <span className={"indice-gasto"}>{idx + 1}.&nbsp;</span>
                <FacturaData idx={idx + 1} items={items} />
              </button>
              {!hasPrivileges ? (
                <AccionesAdjuntos
                  onDelete={() => onDelete(key)}
                  onEdit={() => onEdit(key)}
                  forceShowEdit
                />
              ) : null}
              <EstadoDocumentoLabel documentosDigitales={items} />
            </div>
          )
        )}
      </div>
    </>
  );
};

const FacturaData = ({ idx, items, ...props }) => {
  const itemFactura = items?.find?.((s) => isFactura(s?.tipo));
  const detalleDocumento = itemFactura?.detalleDocumento;

  return (
    <>
      <DocumentLabelName
        color={"light"}
        className={"btn-hover-light pe-0"}
        text={
          <>
            G. Documentos {idx} ({items?.filter?.((i) => i.url)?.length || 0}{" "}
            Documentos)
          </>
        }
        {...props}
      />
      {itemFactura ? (
        <DocumentLabelName
          color={""}
          text={
            <>
              &nbsp;Fac. # {detalleDocumento?.numDocumento}
              {detalleDocumento?.valor ? (
                <>
                  /
                  <b>
                    &nbsp;
                    <CustomNumberFormat
                      value={detalleDocumento?.valor}
                      prefix={"$. "}
                    />
                  </b>
                </>
              ) : (
                ""
              )}
            </>
          }
        />
      ) : null}
    </>
  );
};
