import { UqaiField } from "../../../../../components/UqaiField";
import { UqaiDropZone } from "./drop-zone/UqaiDropZone";
import React, { useEffect, useRef, useState } from "react";
import { UqaiCalendario } from "../../../../../components/UqaiCalendario";
import { isFactura, tiposDocumentos } from "./util";
import UqaiTooltip from "../../../../../components/UqaiTooltip";
import moment from "moment";
import { useLoadingContext } from "./context/LoadingContextProvider";
import { useSelector } from "react-redux";
import { useErrorsContext } from "./context/ErrorsContextProvider";
import { NumberFormatField } from "../../../../../components/number-format/NumberFormatField";
import { useFormikContext } from "formik";
import { isUserAbleToEditDocument } from "../../estados_edicion";
import { isBefore90Days } from "../../utils";
import jsonpath from "jsonpath";
import Alerts from "../../../../../components/Alerts";
import { InfoFactura } from "./InfoFactura";
import { NoRefoundMessage } from "../card-incap-siniestro/CardIncapSiniestro";

export const Documentos = ({
  title,
  preffixName,
  documentos,
  containerClass,
  itemClass,
  ...props
}) => {
  const [camposKey, setCamposKey] = useState(Date.now());
  const newCamposAdicionalesKey = () => setCamposKey(Date.now());
  var indiceTitulo = title && title.split(".")[0];
  indiceTitulo = indiceTitulo !== undefined ? indiceTitulo : "1";
  if (documentos && documentos.length > 0) {
    documentos.forEach((element, index) => {
      let nuevoNombreDocumento = "";
      const puntos = (element.nmDocumento.match(/\./g) || []).length;
      if (element.orden == null) {
        nuevoNombreDocumento = "0";
      }
      if (puntos != 2) {
        nuevoNombreDocumento =
          nuevoNombreDocumento +
          indiceTitulo +
          "." +
          (index + 1) +
          "." +
          element.nmDocumento;
        element.nmDocumento = nuevoNombreDocumento;
      }
    });
  }
  function aditionalOnDelete(documentoDigitalReseted) {
    props?.aditionalOnDelete?.(documentoDigitalReseted);
    newCamposAdicionalesKey();
  }

  return (
    <>
      <div className={containerClass ?? "row"}>
        {(documentos || []).map((documento, idx) => (
          <div
            key={documento.cdDocSiniestro + "-" + documento.cdSdocSiniestro}
            className={`mb-3 ${itemClass ?? "col-lg-6"}`}
          >
            <div className={"col"}>
              <UqaiField name={`${preffixName ?? ""}[${idx}]`}>
                {({ form, field }) => (
                  <UqaiDropZone
                    form={form}
                    field={field}
                    aditionalOnDelete={aditionalOnDelete}
                    alert={props?.alert}
                    autoUpdateEstado={props?.autoUpdateEstado}
                    isRequired={props?.isRequired}
                    autoUpdateArchivo={props?.autoUpdateArchivo}
                    newCamposAdicionalesKey={newCamposAdicionalesKey}
                    titulo={
                      <TituloDocumento
                        documento={documento}
                        isRequired={props?.isRequired}
                      />
                    }
                  >
                    {(facturaJsonState) => (
                      <CamposAdicionales
                        key={
                          documento.cdDocSiniestro +
                          "-" +
                          documento.cdSdocSiniestro +
                          "-" +
                          camposKey
                        }
                        name={`${preffixName ?? ""}[${idx}]`}
                        documento={documento}
                        isRequired={props?.isRequired}
                      >
                        <InfoFactura
                          preffixName={preffixName}
                          idx={idx}
                          facturaJsonState={facturaJsonState}
                        />
                      </CamposAdicionales>
                    )}
                  </UqaiDropZone>
                )}
              </UqaiField>
            </div>
          </div>
        ))}
        {props.children}
      </div>
    </>
  );
};

const CamposAdicionales = ({ name, documento, isRequired, children }) => {
  const { values, setFieldValue, validateField } = useFormikContext();
  const { isNew, estadoPortal } = values;
  const tipo = documento?.tipo?.toLowerCase() ?? documento?.tipo;
  const isTipoFactura = isFactura(tipo);
  const [isLoading] = useLoadingContext();
  const user = useSelector((state) => state.user);
  const hasPrivileges = user.hasPrivileges;
  const setErrors = useErrorsContext()[1];
  const [showNoRefund, setShowNoRefund] = useState(false);
  const alert = useRef(null);

  const nameDocumentoDigital = name + ".documentoDigital";
  const nameDetalle = nameDocumentoDigital + ".detalleDocumento";
  const fechaProperty = `fc${isTipoFactura ? "Documento" : "CaducDocumento"}`;
  const nameFecha = `${nameDetalle}.${fechaProperty}`;
  const nameNumDocumento = nameDetalle + ".numDocumento";
  const nameValor = nameDetalle + ".valor";
  const isAutoComplete = jsonpath.value(
    values,
    `$.${nameDetalle}.autocompletado`
  );
  const url = jsonpath.value(values, `$.${nameDocumentoDigital}.url`);

  const fechaValue = jsonpath.value(values, `$.${nameFecha}`);
  const isDisabled =
    isLoading ||
    (!isNew &&
      (hasPrivileges ||
        !isUserAbleToEditDocument(
          user,
          documento?.documentoDigital?.estado,
          estadoPortal
        ))) ||
    (isTipoFactura && isAutoComplete) ||
    !url;
  const now = moment();

  useEffect(() => {
    updateShowRefund(fechaValue);
  }, [fechaValue]);

  const isValidDate = (currentDate) => {
    return currentDate.isBefore(now);
  };
  const updateShowRefund = (dateSelected) => {
    setShowNoRefund(() => isBefore90Days(dateSelected));
  };
  const onChangeValidate = (e, propertyName) => {
    const name = e?.target?.name || propertyName;
    const value = e?.target?.value ?? e?.floatValue;
    if (!name) return;
    setFieldValue(name, value);
    if (typeof value === "number" && value === 0) return;
    setTimeout(() => {
      validateField(name);
    }, 500);
  };
  const getTitle = (title) =>
    title + `${isRequired ?? documento?.obligatorio ? "*" : ":"}`;
  const validate = (
    value,
    property,
    message = "Campo requerido",
    hasError = false,
    fromFormik = false
  ) => {
    if (!value && isRequired) {
      setErrors((prev) => ({ ...prev, [property]: message }));
    } else if (hasError) {
      setErrors((prev) => ({ ...prev, [property]: hasError }));
    } else {
      setErrors((prev) => ({ ...prev, [property]: "" }));
    }
  };

  return (
    <>
      <Alerts ref={alert} />
      {(isTipoFactura ||
        (tiposDocumentos.RECETA.tipos.includes(tipo) &&
          documento.reqFecha)) && (
        <div className="form-group col mb-3 mt-4">
          <label className="form-label fw-bold text-secondary fs-7">
            {getTitle(`Fc. de ${isTipoFactura ? "factura" : "emisión"}`)}
          </label>
          <FieldWrapper
            name={nameFecha}
            placeholder="DD/MM/AAAA"
            component={UqaiCalendario}
            getValidatedDate={(value, hasError) =>
              validate(value, nameFecha, undefined, hasError)
            } // custom validation
            validate={(v) => validate(v, nameFecha, undefined, undefined, true)} // formik validation
            isValidDate={isValidDate}
            maxValue={now}
            readOnly={isDisabled}
          />
          {showNoRefund ? <NoRefoundMessage /> : null}
        </div>
      )}
      {isTipoFactura && (
        <>
          <div className="col mb-3">
            <label className="form-label fw-bold text-secondary fs-7">
              {getTitle("Número de factura")}
            </label>
            <FieldWrapper
              name={nameNumDocumento}
              validate={(v) => validate(v, nameNumDocumento)}
              className="form-control"
              type="text"
              placeholder="Nº factura"
              disabled={isDisabled}
              onChange={onChangeValidate}
            />
          </div>
          <div className="col mb-3">
            <label className="d-flex form-label fw-bold text-secondary fs-7 align-items-center gap-2">
              {getTitle("Valor de factura")}
              {children}
            </label>
            <FieldWrapper name={nameValor}>
              <NumberFormatField
                name={nameValor}
                disabled={isDisabled}
                validate={(v) =>
                  validate(v, nameValor, "Requerido valor mayor a cero")
                }
                className={"form-control"}
                onValueChange={(e) => onChangeValidate(e, nameValor)}
              />
            </FieldWrapper>
          </div>
          {isAutoComplete && (
            <small>
              {
                "Los datos de esta factura han sido autocompletados, por lo tanto no podrán ser editados."
              }
            </small>
          )}
        </>
      )}
    </>
  );
};

const FieldWrapper = ({ name, validate, ...props }) => {
  const [errors] = useErrorsContext();

  return (
    <>
      {props?.children || (
        <UqaiField name={name} validate={validate} {...props} />
      )}
      <small className={"text-danger"}>{errors?.[name]}</small>
    </>
  );
};

export const TituloDocumento = ({ documento, isRequired }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  useEffect(() => {
    setShowTooltip(!!documento?.ayuda);
  }, [documento]);

  return (
    <>
      <label className="title-document form-label fw-bold text-secondary fs-7">
        {documento.nmDocumento}
        {isRequired ?? documento?.obligatorio ? "*" : ":"}
      </label>
      <div className={showTooltip ? "d-inline" : "d-none"}>
        &nbsp;
        <UqaiTooltip message={documento.ayuda} />
      </div>
    </>
  );
};
