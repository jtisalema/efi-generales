import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {routes} from "../../util/General";
import Alerts from "../../components/Alerts";
import {CardBody, CardHeader, Col, Label, Row} from "reactstrap";
import {getDefaultHome, ListTipos, ListTiposNotificacion, v_home} from "./utils";
import UqaiFormik from "../../components/UqaiFormik";
import {UqaiField} from "../../components/UqaiField";
import {UqaiModalBorrarItem} from "../../components/UqaiModalBorrarItem";
import UqaiTooltip from "../../components/UqaiTooltip";
import {FieldArray} from "formik";
import Pages from "../../layouts/Pages";

export const AdminHome = () => {
    const [item, setItem] = useState(getDefaultHome());
    const alert = useRef(null);
    const msm_img = 'La URL de la imagen debe ser pública';
    const msm_video = 'La URL del video debe ser pública y no debe ser de ninguna red social (Youtube, Facebook, etc.) ya que tienen restringido el acceso a sus videos y recursos'
    const [borrar, setBorrar] = useState(false);

    useEffect(() => {
        getConfig();
    }, []);

    const getConfig = () => {
        axios.get(routes.api + '/config-home').then(resp => {
            setItem(resp.data)
        }).catch(error => {
                alert.current.handle_error(error);
            }
        );
    }

    const submit = (values, actions) => {
        axios.post(routes.api + '/config-home', values).then(resp => {
            setItem(resp.data);
            alert.current.show_info('Guardado con éxito');
        }).catch(error => {
                alert.current.handle_error(error);
            }
        ).finally(() => actions.setSubmitting(false));
    }

    const msm = (tipo = '') => {
        return (tipo === '' || tipo === null || tipo === Object.values(ListTipos)[0].value) ? msm_img : msm_video
    }

    const verificarTipos = (value, list = []) => {
        return list.find(x => x.tipo === value);
    }

    return (
        <Pages title={'Configuración Home'}>
            <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
                <div className="container-fluid">
                    <Alerts ref={alert}/>
                    <div className={"card shadow"}>
                        <CardHeader className="d-flex align-items-center border-bottom border-primary">
                            <h5 className="my-0 fw-bold">Configuración Home</h5>
                        </CardHeader>
                        <CardBody>
                            <div className="container-fluid">
                                <UqaiFormik initialValues={item} onSubmit={submit} enableReinitialize={true}
                                            validateOnChange={false} validationSchema={v_home}>
                                    {({submitForm, values, setFieldValue}) => (
                                        <>
                                            <Row>
                                                <h4>{"Home"}</h4>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <Label className={"form-label fw-bold text-secondary fs-7"}>Tipo de
                                                        recurso*</Label>
                                                    <UqaiField className={"form-control"} name={"tipo"}
                                                               component={"select"} type={"text"} onChange={(e) => {
                                                        setFieldValue('tipo', e.target.value);
                                                        setFieldValue('url', '');

                                                    }
                                                    }>
                                                        {Object.values(ListTipos).map(tp => (
                                                            <option key={tp.value} value={tp.value}>{tp.label}</option>
                                                        ))}
                                                    </UqaiField>
                                                </Col>
                                                <Col md={6}>
                                                    <Label className={"form-label fw-bold text-secondary fs-7"}>URL del
                                                        recurso* &nbsp;
                                                        <UqaiTooltip
                                                            message={msm(values.tipo)}>
                                                            <i className={"fa fa-info-circle"}/>
                                                        </UqaiTooltip>
                                                    </Label>
                                                    <UqaiField className={"form-control"} name={"url"} type={"text"}/>
                                                    <br/>
                                                    <div className="form-check">
                                                        <UqaiField className="form-check-input" type="checkbox"
                                                                   component={"input"} name={"show"}
                                                                   checked={values.show} id="show"/>
                                                        <label className="form-check-label" htmlFor="show">
                                                            Mostrar Video
                                                        </label>
                                                    </div>

                                                </Col>
                                            </Row>
                                            <br/>
                                            <div className="row mb-3">
                                                <h4>{"Envío de mensajes"}</h4>
                                                <div className="col-md-6">
                                                    <div className="form-check mb-2">
                                                        <UqaiField className="form-check-input" type="checkbox"
                                                                   component={"input"} name={"sendWhatsapp"}
                                                                   checked={values.sendWhatsapp} id="sendWhatsapp"/>
                                                        <label className="form-check-label" htmlFor="sendWhatsapp">
                                                            Enviar Whatsapp
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <UqaiField className="form-check-input" type="checkbox"
                                                                   component={"input"} name={"sendSms"}
                                                                   checked={values.sendSms} id="sendSms"/>
                                                        <label className="form-check-label" htmlFor="sendSms">
                                                            Enviar SMS
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <br/>
                                            <Row>
                                                <h4>{"Plantillas Whatsapp"}</h4>
                                            </Row>
                                            <Row>
                                                <Col md={6}>
                                                    <Label className={"form-label fw-bold text-secondary fs-7"}>Url de
                                                        la Instancia* &nbsp;
                                                        <UqaiTooltip message={'Url de la plantilla de Whatsapp'}/>
                                                    </Label>
                                                    <UqaiField className={"form-control"} name={"urlTemplate"}
                                                               type={"text"}/>
                                                </Col>
                                                <Col md={6}>
                                                    <FieldArray name={"templates"}>
                                                        {({push, remove}) => (
                                                            <>
                                                                <div className="table-responsive">
                                                                    <div className={"btn btn-primary c-pointer"}
                                                                         onClick={() => push({
                                                                             tipo: "",
                                                                             idTemplate: ""
                                                                         })}>
                                                                        <i className={"fas fa-plus"}> Agregar</i>
                                                                    </div>
                                                                    <table
                                                                        className="table table-borderless table-hover">
                                                                        <thead>
                                                                        <tr className={"text-secondary"}>
                                                                            <th className="bg-white" scope="col">#</th>
                                                                            <th className="bg-white" scope="col">Tipo de
                                                                                Notificación
                                                                            </th>
                                                                            <th className="bg-white" scope="col">Id
                                                                                Template
                                                                            </th>
                                                                            <th className="bg-white" scope="col"></th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {(values.templates || []).map((not, index) => (
                                                                            <tr key={not.value}>
                                                                                <td>{index + 1}</td>
                                                                                <td><UqaiField
                                                                                    className={"form-control"}
                                                                                    name={`templates[${index}].tipo`}
                                                                                    component={"select"}
                                                                                    type={"text"}
                                                                                    onChange={(e) => {
                                                                                        if (verificarTipos(e.target.value, values?.templates)) {
                                                                                            alert.current.show_error('Este tipo de notificación ya fue agregada');
                                                                                            setFieldValue(`templates[${index}].tipo`, '')
                                                                                        } else {
                                                                                            setFieldValue(`templates[${index}].tipo`, e.target.value);
                                                                                        }
                                                                                    }}>
                                                                                    <option key={0}
                                                                                            value={""}>{"--Seleccione--"}</option>
                                                                                    {ListTiposNotificacion.map(tp => (
                                                                                        <option key={tp.value}
                                                                                                value={tp.value}>{tp.label}</option>
                                                                                    ))}
                                                                                </UqaiField></td>
                                                                                <td><UqaiField
                                                                                    className={"form-control"}
                                                                                    name={`templates[${index}].idTemplate`}
                                                                                    type={"text"}/>
                                                                                </td>
                                                                                <td className="text-center">
                                                                                    <div className={"click"}
                                                                                         style={{margin: "5px"}}
                                                                                         title={"Eliminar"}
                                                                                         onClick={() => setBorrar(true)}>
                                                                                        <i className="fas fa-trash-alt custom-icon"/>
                                                                                    </div>

                                                                                    <UqaiModalBorrarItem
                                                                                        title={"Eliminar"}
                                                                                        text={"¿Deseas eliminar este tipo de notificación?"}
                                                                                        isOpen={borrar}
                                                                                        toggle={() => setBorrar(false)}
                                                                                        remove={() => remove(index)}/>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </>)}
                                                    </FieldArray>
                                                </Col>
                                            </Row>
                                            <br/>
                                            <Row>
                                                <Col md={6}>
                                                    <button className={"btn btn-primary"}
                                                            onClick={submitForm}>Guardar
                                                    </button>
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                </UqaiFormik>
                            </div>
                        </CardBody>
                    </div>
                </div>
            </section>
        </Pages>
    )
}