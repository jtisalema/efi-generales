import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { routes } from "../gen/UtilsGeneral";
import { do_login } from "./redux/actions";
import { Button, CardFooter } from "reactstrap";
import background1 from "../../assets/images/plataforma_fondo1.png";
import logoLogin from "../../assets/images/logo2.png";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom";
import { Field, Form, Formik } from "formik";
import Alerts from "../../components/Alerts";
import { Link } from "react-router-dom";
import { metricasGoogle } from "../../util/General";

const roles = ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"];

export const Login = () => {
  const [item] = useState({ enki: "", perseo: "" });
  const [loading, setLoading] = useState(true);

  const alert = React.useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    checkLogin(params.hash);
  }, []);

  function checkLogin(hash) {
    let config = {};
    if (hash) {
      var texto = atob(hash);
      var informacion = texto.split(":");
      const data = { enki: informacion[0], perseo: informacion[1] };
      setLoading(true);
      //headers q lee el spring security (efi-sec)
      let headers = {
        authorization:
          "Basic " + btoa(data.enki.trim() + ":" + data.perseo.trim()),
      };
      axios
        .post(routes.base + "/enki", {}, { headers: headers })
        .then((resp) => {
          get_asociados(resp, true);
        })
        .catch((error) => {
          let msg = alert.current.handle_error(error);
          if (msg.indexOf("expirado") >= 0) {
            history.push("/renovar/" + window.btoa(data.enki));
          }
          dispatch(do_login({ username: null, id: null }));
        })
        .finally(() => {
          setLoading(false);
          history.push("/");
        });
    }
    // compruebo si previamente ya incio sesion
    axios
      .post(routes.base + "/enki", {}, config)
      .then((resp) => {
        if (resp.data.user?.id) {
          get_asociados(resp, hash);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
        dispatch(do_login({ username: null, id: null }));
      });
  }

  const onLoginSucess = (data) => {
    dispatch(do_login(data));
    metricasGoogle(data, "login", "siniestro", "list");
  };

  const onRequestAuth = (newValues, { setSubmitting }) => {
    const data = newValues;
    setLoading(true);
    //headers q lee el spring security (efi-sec)
    let headers = {
      authorization:
        "Basic " + btoa(data.enki.trim() + ":" + data.perseo.trim()),
    };

    // envio de peticion
    axios
      .post(routes.base + "/enki", {}, { headers: headers })
      .then((resp) => {
        // hay respuesta exitosa desde el server, si se inicio sesión
        //lanzo accion con los datos del usuario
        get_asociados(resp, true);
      })
      .catch((error) => {
        setSubmitting(false);

        let msg = alert.current.handle_error(error);
        if (msg.indexOf("expirado") >= 0) {
          history.push("/renovar/" + window.btoa(data.enki));
        }
        dispatch(do_login({ username: null, id: null }));
      })
      .finally(() => setLoading(false));
  };

  function get_asociados(resp, hash) {
    Promise.all([
      axios.post(routes.base + "/enki/asociados", {
        cdAdicional: resp.data.user.id,
      }),
      axios.post(routes.apiVam + "/enki/asociados", {
        cdAdicional: resp.data.user.id,
      }),
    ])
      .then(function (values) {
        setLoading(false);

        let user = resp.data.user;
        let isEjecutivo = user && resp.data.roles.includes("ROLE_EJECUTIVO");
        let isAdmin = user && roles.includes(user.rolWeb);
        const isUser = !isEjecutivo && !isAdmin;
        const hasPrivileges = isEjecutivo || isAdmin;
        user.cdCliente = null;
        user.cedula = null;
        user.fcModifica = new Date();
        const asociados = values[0].data;
        const asociadosVam = values[1].data;
        onLoginSucess({
          ...user,
          asociados,
          asociadosVam,
          roles: resp.data.roles,
          isEjecutivo,
          isAdmin,
          isUser,
          hasPrivileges,
        });
        if (hash) {
          if (asociadosVam.length > 0) {
            history.push("/vam/home");
          } else if (asociados.length > 0) {
            history.push("/gen/home");
          } else {
            history.push("/home");
          }
        }
        if (isEjecutivo) {
          history.push("/vam/siniestros-reportados");
        }
      })
      .catch((err) => {
        alert?.current?.handle_error(err);
      });
  }

  return (
    <>
      <Alerts ref={alert} />
      <div
        className="bg-fullscreen bg-texture bg-img-center"
        style={{ backgroundImage: `url(${background1})` }}
      />
      <div className="vh-100 d-flex justify-content-center align-items-center login-page">
        <div className="bg-filter-glass border border-success rounded-5 d-flex align-items-center py-4 py-xl-5 px-2 px-xl-4">
          <div className="mx-xxl-2 my-md-2 my-xxl-3">
            <div className="login-logo-container">
              <img src={logoLogin} alt="logo" className="img-fluid" />
            </div>
            <div className="d-flex gap-2 gap-xl-3 justify-content-center py-2 my-2">
              <button
                type="button"
                className="btn btn-outline-success px-3"
                style={{
                  "--bs-btn-color": "white",
                  "--bs-btn-border-color": "white",
                  display: "none",
                }}
              >
                Cotizador
              </button>
              <button
                type="button"
                className="btn btn-outline-success px-3"
                style={{
                  "--bs-btn-color": "white",
                  "--bs-btn-border-color": "white",
                  display: "none",
                }}
              >
                Consultas
              </button>
            </div>
            {!loading && (
              <Formik onSubmit={onRequestAuth} initialValues={item}>
                {({ isSubmitting }) => (
                  <Form>
                    <div className={"form-login px-3"}>
                      <div className={"mb-4 pb-xl-2"}>
                        <h4 className="form-label text-white text-center mb-3">
                          <i className="icon-uqai uqai-usuario"></i>
                        </h4>
                        <Field
                          className="form-control"
                          name="enki"
                          type="text"
                          placeholder="Usuario / correo"
                        />
                      </div>

                      <div className="mb-1">
                        <h4 className="form-label text-white text-center mb-3">
                          <i className="icon-uqai uqai-contrasena"></i>
                        </h4>
                        <Field
                          className="form-control"
                          name="perseo"
                          type="password"
                          placeholder="Contraseña"
                        />
                      </div>
                    </div>
                    <CardFooter>
                      <div className="text-center">
                        <Link
                          to="/recuperar"
                          className="link-light text-white text-decoration-none fst-italic"
                        >
                          ¿Olvidó su contraseña?
                        </Link>
                      </div>

                      <div className="d-flex justify-content-center mt-4 pt-xl-2">
                        <Button
                          color="primary"
                          className="btn btn-primary px-3"
                          type={"submit"}
                          disabled={isSubmitting}
                        >
                          Iniciar sesión
                        </Button>
                      </div>
                      <div className="text-center">
                        <span style={{ color: "white" }}>v1.0.7</span>
                      </div>
                    </CardFooter>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
      {loading && (
        <div className={"overlay"}>
          <div className="spinner" id="loader-4"></div>
        </div>
      )}
    </>
  );
};
