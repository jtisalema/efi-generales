import React, {useState} from 'react';
import axios from 'axios';
import {routes} from "../../util/General";
import {Button, CardFooter, Form, Row} from "reactstrap";

import Alerts from "../../components/Alerts";
import background1 from "../../assets/images/plataforma_fondo1.png";
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import logoLogin from "../../assets/images/logo2.svg";
import {ErrorMessage, Field, Formik} from "formik";
import {v_reset} from "./utils";

export const Recuperar = () => {
    const [item] = useState({user: ''});
    const [loading, setLoading] = useState(false);

    const alert = React.useRef(null);
    const history = useHistory();


    const onSubmit = (values, actions) => {
        setLoading(true);

        axios.defaults.withCredentials = true;
        axios.post(routes.base + '/resetpass', values).then(() => {
            setLoading(false);
            actions.setSubmitting(false);
            alert.current.show_info("Si el correo electrónico ingresado existe en nuestro registro de usuarios, recibirá en su Bandeja de entrada o en Correo no deseado su nueva contraseña");
        }).catch(error => alert.current.handle_error(error)).finally(() => {
            setTimeout(() => {
                history.replace('/');
            }, 12000);
        });
    }

    return (
        <div>
            <Alerts ref={alert}/>
            <div className="bg-fullscreen bg-texture bg-img-center"
                 style={{backgroundImage: `url(${background1})`}}/>
            <div className="vh-100 d-flex justify-content-center align-items-center login-page">

                <div
                    className="bg-filter-glass border border-success rounded-5 d-flex align-items-center py-4 py-xl-5 px-2 px-xl-4">
                    <div className="mx-xxl-2 my-md-2 my-xxl-3">
                        <div className="login-logo-container">
                            <img src={logoLogin} alt="logo" className="img-fluid"/>
                        </div>
                        <div className="d-flex gap-2 gap-xl-3 justify-content-center py-2 my-2">
                            <button type="button" className="btn btn-outline-success px-3"
                                    style={{
                                        '--bs-btn-color': 'white',
                                        '--bs-btn-border-color': 'white',
                                        display: "none"
                                    }}>Cotizador
                            </button>
                            <button type="button" className="btn btn-outline-success px-3"
                                    style={{
                                        '--bs-btn-color': 'white',
                                        '--bs-btn-border-color': 'white',
                                        display: "none"
                                    }}>Consultas
                            </button>
                        </div>
                        {!loading &&
                            <Formik onSubmit={onSubmit} initialValues={item} validationSchema={v_reset}>
                                {({isSubmitting, submitForm}) => (
                                    <Form>
                                        <div className={"form-login px-3"}>
                                            <div className={"mb-4 pb-xl-2"}>
                                                <h4 className="form-label text-white text-center mb-3"
                                                    title={"Ingresa tu usuario/correo"}>
                                                    <i className="icon-uqai uqai-usuario"></i>
                                                </h4>
                                                <Field className="form-control" name="user" type="text"
                                                       placeholder="Correo"/>
                                                <ErrorMessage name={'user'}>
                                                    {(error) => (
                                                        <span
                                                            className={'text-center invalid-feedback d-block'}>{error}</span>
                                                    )}
                                                </ErrorMessage>
                                            </div>
                                        </div>
                                        <CardFooter>
                                            <Row className={"justify-content-center"}>
                                                <div className="col-auto mt-2">
                                                    <Button color="secondary" className="btn btn-primary px-3"
                                                            onClick={() => history.replace('/')}>
                                                        Regresar
                                                    </Button>
                                                </div>
                                                <div className="col-auto mt-2">
                                                    <Button color="primary" className="btn btn-primary px-3"
                                                            onClick={() => submitForm()} disabled={isSubmitting}>
                                                        Enviar
                                                    </Button>
                                                </div>
                                            </Row>
                                        </CardFooter>
                                    </Form>
                                )}
                            </Formik>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}