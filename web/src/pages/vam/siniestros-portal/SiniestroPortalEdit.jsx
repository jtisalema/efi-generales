import { useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import Alerts from "../../../components/Alerts";
import UqaiFormik from "../../../components/UqaiFormik";
import axios from "axios";
import { TIPOS, TIPOS_RECLAMO, v_siniestro } from "./utils";
import { routes as routesVam } from "../UtilsVam";
import { routes } from "../../gen/UtilsGeneral";
import { useHistory, useParams } from "react-router-dom";
import { CustomNumberFormat } from "../../../components/CustomNumberFormat";
import moment from "moment";
import { Comentario } from "./parts/Comentario";
import { DocumentosAdjuntos } from "./parts/documentos-adjuntos/DocumentosAdjuntos";
import Humanize from "humanize-plus";
import { CustomPrompt } from "../../../prompt/CustomPrompt";
import {
  bytesToMb,
  getKeysFromObject,
  MAX_ADJUNTOS_SIZE,
} from "./parts/documentos-adjuntos/util";
import {
  LoadingContextProvider,
  useLoadingContext,
} from "./parts/documentos-adjuntos/context/LoadingContextProvider";
import { SiniestroEnviarButton } from "./parts/SiniestroEnviarButton";
import { SiniestroEstadosSelect } from "./parts/SiniestroEstadosSelect";
import { searchTpNotificacion } from "../../home/utils";
import { CardIncapSiniestro } from "./parts/card-incap-siniestro/CardIncapSiniestro";
import {
  defaultEstadoSiniestro,
  ESTADOS_DOC_VALUES,
  ESTADOS_PORTAL_LISTA,
  ESTADOS_SINI_VALUES,
} from "./estados_edicion";
import Pages from "../../../layouts/Pages";
import { JedaiCalendarioViewText } from "../../../components/UqaiCalendario";
import { useFormikContext } from "formik";
import { IncapacidadLabel } from "./parts/card-incap-siniestro/IncapacidadSelect";
import { EstadoDocumentoLabel } from "./parts/documentos-adjuntos/EstadoDocumento";
import PropTypes from "prop-types";

const SiniestroPortal = ({
  open,
  setOpen,
  aseguradoras,
  findRamos,
  setTitulares,
  setPacientes,
  ...props
}) => {
  const setGlobalLoading = useLoadingContext()[1];
  const user = useSelector((state) => state.user);
  const params = useParams();
  const history = useHistory();
  const alert = useRef();

  const [viewCard, setViewCard] = useState(false);
  const [openComentario, setOpenComentario] = useState(false);
  const [isActivePrompt, setIsActivePrompt] = useState(true);

  const isUser = user.isUser;

  const onSubmit = (newValues, actions) => {
    console.log("Este es el Submit");
    setIsActivePrompt(() => false);
    setGlobalLoading(() => true);
    const id = newValues.cdIncSiniestro;
    if (!id || id < 1) {
      props.comentario.fecha = new Date();
    }

    if (props.comentario.hasOwnProperty("estado")) {
      props?.comentarios.push(props.comentario);
    }

    let commentString = JSON.stringify(props?.comentarios);
    while (commentString.length >= 3000) {
      props?.comentarios.shift();
      commentString = JSON.stringify(props?.comentarios);
    }
    const estado = props?.item.estadoPortal;
    newValues.observacionesEstados = JSON.stringify(props?.comentarios);
    newValues.user = user.id;
    console.log("Submit:" + id);
    axios
      .post(routesVam.api + "/siniestros-portal", newValues)
      .then((resp) => {
        console.log(JSON.stringify(resp));
        const data = resp.data;
        props?.setItem(data);
        props.setEdit(props.isEditable(data));
        alert.current?.show_info("Guardado con éxito");
        if (id !== data.cdIncSiniestro) {
          //siniestro nuevo
          sendMessage(
            data.cdCompania,
            data.cdReclamo,
            data.cdIncSiniestro,
            searchTpNotificacion("nuevo")
          );
        }
        if (estado !== data.estadoPortal) {
          //siniestro modificado
          sendMessage(
            data.cdCompania,
            data.cdReclamo,
            data.cdIncSiniestro,
            searchTpNotificacion("cambio")
          );
        }
        history.push(props.pathSiniestrosReported);
      })
      .catch((error) => {
        alert.current?.show_error("Error al guardar " + error);
      })
      .finally(() => {
        setIsActivePrompt(() => true);
        setGlobalLoading(() => false);
        actions.setSubmitting(false);
      });
  };

  const findList = (list, id) => {
    return (list || []).find((x) => x.value === id)?.label;
  };

  const findPoliza = (list, values) => {
    return (list || []).find(
      (x) => x.value === `${values.cdUbicacion}_${values.cdCompania}`
    )?.label;
  };

  const changeEstadoCliente = ({ values, setFieldValue, submitForm }) => {
    if (
      isUser &&
      (validateRequiredDocuments(values) ||
        validateRequiredDocuments(values, "gastos"))
    )
      return;
    if (
      isUser &&
      [
        ESTADOS_SINI_VALUES.porRegularizar,
        ESTADOS_SINI_VALUES.documentoAdicional,
      ].includes(values.estadoPortal)
    ) {
      setFieldValue("estadoPortal", ESTADOS_SINI_VALUES.porRevisar);
      props.setComentario(
        defaultEstadoSiniestro(
          ESTADOS_SINI_VALUES.porRevisar,
          user,
          "Modificación de siniestro por parte de usuario"
        )
      ); //estado inicial de siniestro
    }
    changeSubdocumentsState({ values }).finally(submitForm);
  };

  const changeSubdocumentsState = async ({ values }) => {
    console.log(values);
    if (!isUser) return;
    const cdsArchivos = [];
    values?.gastos?.forEach((gasto) => {
      const subdocumentosEstructura = gasto?.subdocumentosEstructura || [];
      gasto?.subdocumentosItems?.forEach((subdocumentos) => {
        subdocumentos?.forEach((subdocumento) => {
          const estructura = subdocumentosEstructura.find(
            (estructura) =>
              estructura.cdDocSiniestro === subdocumento.cdDocSiniestro &&
              estructura.cdSdocSiniestro === subdocumento.cdSdocSiniestro
          );
          if (estructura && !estructura.obligatorio && !subdocumento.pathFile)
            cdsArchivos.push(subdocumento.cdArchivo);
        });
      });
    });
    console.log("cdsArchivos" + !cdsArchivos.length);
    if (!cdsArchivos.length) return;
    return axios.post(
      routes.api + "/documentos-digitales/update/estado",
      { values: cdsArchivos },
      {
        params: {
          estado: ESTADOS_DOC_VALUES.ingresado,
        },
      }
    );
  };

  function validateRequiredDocuments(values, tipo = "documentos") {
    const isGastos = tipo === "gastos";
    const { documentos, gastos } = values;
    const documentosObligatorios = [];
    const gastosObligatorios = [];
    const array = isGastos ? gastos : documentos;
    array?.forEach((doc) => {
      if (isGastos) {
        doc.obligatorio &&
          getKeysFromObject(doc?.subdocumentosItems).length < 1 &&
          gastosObligatorios.push(doc.nmDocumento);
      } else {
        doc.obligatorio &&
          !doc?.documentoDigital?.url &&
          documentosObligatorios.push(doc.nmDocumento);
      }
    });
    const isRequiredDocsNeeded = documentosObligatorios.length > 0;
    if (isRequiredDocsNeeded)
      alert.current.show_error(
        `Los documentos: ${documentosObligatorios.join(", ")} son obligatorios.`
      );

    const isRequiredGastosNeeded = gastosObligatorios.length > 0;
    if (isRequiredGastosNeeded)
      alert.current.show_error(
        `Los gastos: ${gastosObligatorios.join(
          ", "
        )} deben tener al menos un grupo de documentos.`
      );
    return isRequiredDocsNeeded || isRequiredGastosNeeded;
  }

  const sendMessage = (cdCompania, cdReclamo, cdIncSiniestro, tipo) => {
    axios
      .post(routes.api + "/siniestros-portal/send-message", {
        cdCompania,
        cdReclamo,
        cdIncSiniestro,
        tipo,
      })
      .catch((error) => {
        alert.current.show_error("Error al enviar mensaje a whatsapp " + error);
      });
  };

  function onChangeSelect(e) {
    props.setComentario(defaultEstadoSiniestro(e.value, user));
    setOpenComentario(true);
  }

  const onRetryEmail = (setAction) => {
    setAction(true);
    axios
      .post(routesVam.api + "/siniestros-portal/retry-email", props?.item)
      .then(() => {
        alert.current?.show_info("Enviado con éxito");
      })
      .catch((error) => {
        alert.current?.show_error("Error al enviar " + error);
      })
      .finally(() => {
        setAction(false);
      });
  };

  const showBtnEstado = !isUser && props.edit;
  return (
    <Pages title={"Siniestros"} key={params?.cdReclamo}>
      <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
        <div className="container-fluid">
          <Alerts ref={alert} />
          <UqaiFormik
            initialValues={props?.item}
            onSubmit={onSubmit}
            enableReinitialize={true}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={v_siniestro}
          >
            {({ values }) => (
              <>
                <IsNewItem />
                <CardIncapSiniestro
                  viewCard={viewCard}
                  setViewCard={setViewCard}
                  aseguradoras={aseguradoras}
                  findRamos={findRamos}
                  setPacientes={setPacientes}
                  open={open}
                  setOpen={setOpen}
                  setTitulares={setTitulares}
                  {...props}
                />
                {!open && (
                  <>
                    <div className="row">
                      <div className="col-lg-4 col-md-3 col-sm-12">
                        <div className="position-sticky sticky-top">
                          <Card className="shadow">
                            <CardHeader className="d-flex align-items-center border-bottom border-primary">
                              <h5 className="my-0 fw-bold">
                                <i className="icon-uqai align-middle uqai-filtros text-primary me-2"></i>
                                Parámetros
                              </h5>
                            </CardHeader>
                            <div className="container">
                              <CardBody>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <label className="form-label fw-bold text-secondary fs-7">
                                      Aseguradora:{" "}
                                    </label>
                                    <br />
                                    <span>
                                      {values?.numSiniestro
                                        ? props?.polizaData?.aseguradora
                                        : findList(
                                            aseguradoras,
                                            Number(values?.cdAseguradora)
                                          )}
                                    </span>
                                  </div>
                                  <div className="col-lg-6">
                                    <label className="form-label fw-bold text-secondary fs-7">
                                      Póliza:{" "}
                                    </label>
                                    <br />
                                    <span>
                                      {values?.numSiniestro
                                        ? `${props?.polizaData?.ramo} / ${values?.poliza} / ${props?.polizaData?.plan}`
                                        : findPoliza(props.ramos, values)}
                                    </span>
                                  </div>
                                  <div className="col-lg-6">
                                    <label className="form-label fw-bold text-secondary fs-7">
                                      Tipo de reclamo:{" "}
                                    </label>
                                    <br />
                                    <span>
                                      {findList(TIPOS, values?.tpSiniestro)}
                                    </span>
                                  </div>
                                  <div className="col-lg-6">
                                    <label className="form-label fw-bold text-secondary fs-7">
                                      Paciente:{" "}
                                    </label>
                                    <br />
                                    <span>{values?.dscObjeto}</span>
                                  </div>
                                  <div className="col-lg-6">
                                    <IncapacidadLabel input={false} />
                                    <br />
                                    <span>{props?.incapacidad?.label}</span>
                                  </div>
                                  <div className="col-lg-6">
                                    <label className="form-label fw-bold text-secondary fs-7">
                                      {values.tpSiniestro ===
                                      TIPOS_RECLAMO.preAutorizacion
                                        ? "Fc. de procedimiento:"
                                        : "Fc. de incurrencia:"}
                                    </label>
                                    <br />
                                    <span>
                                      {values.tpSiniestro ===
                                      TIPOS_RECLAMO.preAutorizacion
                                        ? moment(values?.fcProcedimiento)
                                            .locale("moment/locale/es")
                                            .format("DD/MMM/YYYY")
                                        : moment(values.fcAlcance)
                                            .locale("moment/locale/es")
                                            .format("DD/MMM/YYYY")}
                                    </span>
                                  </div>

                                  {values.tpSiniestro ===
                                    TIPOS_RECLAMO.preAutorizacion && (
                                    <div
                                      className="col-lg-6"
                                      style={{ display: "none" }}
                                    >
                                      <label className="form-label fw-bold text-secondary fs-7">
                                        Fc. de procedimiento:
                                      </label>
                                      <br />
                                      <JedaiCalendarioViewText
                                        value={values.fcProcedimiento}
                                      />
                                    </div>
                                  )}

                                  {values.numSiniestro && (
                                    <div className="col-lg-6">
                                      <label className="form-label fw-bold text-secondary fs-7">
                                        Num. Siniestro:{" "}
                                      </label>
                                      <br />
                                      <span>{`${props?.item.numSiniestro}.${props?.item.item}`}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="row mt-3">
                                  <div className="col-12">
                                    <h5>Almacenamiento</h5>
                                    <span>
                                      {bytesToMb(values?.documentosSize)} /{" "}
                                      {Humanize.fileSize(MAX_ADJUNTOS_SIZE)}
                                    </span>
                                  </div>
                                </div>
                              </CardBody>
                            </div>
                          </Card>

                          <Card className="my-4 shadow">
                            <CardHeader className="d-flex align-items-center border-bottom border-primary">
                              <h5 className="my-0 fw-bold">
                                <i className="icon-uqai align-middle uqai-valor-reclamo text-primary me-2"></i>
                                {values.tpSiniestro ===
                                TIPOS_RECLAMO.preAutorizacion
                                  ? "Valor del procedimiento"
                                  : "Valor de su reclamo"}
                              </h5>
                            </CardHeader>
                            <div className="container">
                              <CardBody>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <span className="fs-2 fw-bold text-secondary">
                                      <CustomNumberFormat
                                        value={
                                          values.tpSiniestro ===
                                          TIPOS_RECLAMO.preAutorizacion
                                            ? values?.valCirugia
                                            : values?.valorReclamoPortal
                                        }
                                      />
                                    </span>
                                  </div>
                                </div>
                              </CardBody>
                            </div>
                          </Card>
                          <div className="" align="left">
                            <button
                              type={"button"}
                              className="btn btn-active-border-0 p-0 text-secondary mx-2"
                              onClick={() => {
                                if (values.numSiniestro) {
                                  history.push(props.pathSiniestrosReported);
                                } else {
                                  setOpen(true);
                                }
                              }}
                            >
                              <i
                                className={
                                  "icon-uqai uqai-regresar fs-5 fw-bolder pl-2"
                                }
                              >
                                <span className={"ms-1"}>{`Regresar ${
                                  !values.numSiniestro ? "a parámetros" : ""
                                }`}</span>
                              </i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-8 col-md-9 col-sm-12">
                        <div>
                          <DocumentosAdjuntos />
                          {values.documentos && (
                            <div className="card w-100 btn-enviar-siniestro">
                              <div className="card-header">
                                <div
                                  className={
                                    "d-flex gap-3 justify-content-start align-porps?.items-end"
                                  }
                                >
                                  {showBtnEstado ? (
                                    <SiniestroEstadosSelect
                                      estadoPortal={props?.item.estadoPortal}
                                      onChange={onChangeSelect}
                                    >
                                      <Comentario
                                        open={openComentario}
                                        comentario={props.comentario}
                                        setComentario={props.setComentario}
                                        item={props?.item}
                                        setOpen={setOpenComentario}
                                      />
                                    </SiniestroEstadosSelect>
                                  ) : (
                                    values.numSiniestro && (
                                      <EstadoDocumentoLabel
                                        estadoValue={props?.item?.estadoPortal}
                                        isSiniestro
                                        estadoLista={ESTADOS_PORTAL_LISTA}
                                      />
                                    )
                                  )}
                                  <SiniestroEnviarButton
                                    changeEstadoCliente={changeEstadoCliente}
                                    onRetryEmail={onRetryEmail}
                                    initialValues={props?.item}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <CustomPrompt
                      regexPath={/^\/vam\/reportar-siniestro\/.+\/.+(\/\d+)?$/}
                      isActivePrompt={isActivePrompt}
                    />
                  </>
                )}
              </>
            )}
          </UqaiFormik>
        </div>
      </section>
    </Pages>
  );
};

SiniestroPortal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  aseguradoras: PropTypes.array.isRequired,
  findRamos: PropTypes.func.isRequired,
  setTitulares: PropTypes.func,
  setPacientes: PropTypes.func.isRequired,
  item: PropTypes.object,
  setItem: PropTypes.func,
  comentario: PropTypes.object.isRequired,
  setComentario: PropTypes.func.isRequired,
  incapacidad: PropTypes.object,
  comentarios: PropTypes.array,
  data: PropTypes.object,
  edit: PropTypes.bool.isRequired,
  setEdit: PropTypes.func.isRequired,
  ramos: PropTypes.array.isRequired,
  isEditable: PropTypes.func.isRequired,
  pathSiniestrosReported: PropTypes.string.isRequired,
};

export const SiniestroPortalEdit = (props) => {
  return (
    <LoadingContextProvider>
      <SiniestroPortal {...props} />
    </LoadingContextProvider>
  );
};

const IsNewItem = () => {
  const { values, setFieldValue } = useFormikContext();
  useEffect(() => {
    setFieldValue("isNew", !values?.cdIncSiniestro);
  }, [values.cdIncSiniestro]);
  return <></>;
};
