import React, {useState} from 'react';
import {Header} from './Header';
import {Card, CardBody, CardHeader, Modal, ModalBody, ModalFooter} from "reactstrap";
import background1 from "../assets/images/plataforma_fondo1.png";
import background2 from "../assets/images/plataforma_fondo2.png";
import logoLogin from "../assets/images/logo2.svg";
import imgPerson from "../assets/images/plataforma_persona.png";
import imgTexture from "../assets/images/plataforma_textura1.svg";
import ReactTable from "react-table";
import {UqaiModalHeader} from "../components/UqaiModal";
import Datetime from "react-datetime";
import {ModalMultimedia} from "../pages/home/parts/ModalMultimedia";
import {useHistory} from "react-router-dom";

const tableData = [
    {
        id: 1,
        first: "Mark",
        last: "Otto",
        handle: "@mdo",
        class: "tr-primary"
    },
    {
        id: 2,
        first: "FUNDACION PARA EL DESARROLLO INTEGRAL FUNDACION",
        last: "Otto",
        handle: "@mdo",
        class: "tr-info"
    },
    {
        id: 3,
        first: "Jacob",
        last: "Otto",
        handle: "@mdo",
        class: "tr-danger"
    },
    {
        id: 4,
        first: "Larry",
        last: "Otto",
        handle: "@mdo",
        class: "tr-secondary"
    },
    {
        id: 5,
        first: "Mark",
        last: "Otto",
        handle: "@mdo",
        class: "tr-light"
    },
    {
        id: 6,
        first: "Mark",
        last: "Otto",
        handle: "@mdo",
        class: "tr-warning"
    },
    {
        id: 7,
        first: "Jacob",
        last: "Otto",
        handle: "@mdo",
        class: "tr-success"
    },
    {
        id: 8,
        first: "Larry",
        last: "Otto",
        handle: "@mdo",
    },
    {
        id: 9,
        first: "Mark",
        last: "Otto",
        handle: "@mdo",
    },
    {
        id: 10,
        first: "Jacob",
        last: "Otto",
        handle: "@mdo",
    },
    {
        id: 11,
        first: "Larry",
        last: "Otto",
        handle: "@mdo",
    },
    {
        id: 12,
        first: "Mark",
        last: "Otto",
        handle: "@mdo",
    },
]

export const DemoLogin = () => {
    return (
        <>
            <div className="bg-fullscreen bg-texture bg-img-center" style={{backgroundImage: `url(${background1})`}}/>
            <div className="vh-100 d-flex justify-content-center align-items-center" style={{minHeight: '660px'}}>
                <div
                    className="login-filter-glass border border-success rounded-5 d-flex align-items-center py-4 py-xl-5 px-2 px-xl-4">
                    <div className="mx-xl-2 my-xl-3">
                        <div className="login-logo-container">
                            <img src={logoLogin} alt="logo" className="img-fluid"/>
                        </div>
                        <div className="d-flex gap-2 gap-xl-3 justify-content-center py-4 my-2">
                            <button type="button" className="btn btn-outline-success px-3"
                                    style={{'--bs-btn-color': 'white', '--bs-btn-border-color': 'white'}}>Cotizador
                            </button>
                            <button type="button" className="btn btn-outline-success px-3"
                                    style={{'--bs-btn-color': 'white', '--bs-btn-border-color': 'white'}}>Consultas
                            </button>
                        </div>
                        <form className="form-login px-3">
                            <div className="mb-4 pb-xl-2">
                                <h4 className="form-label text-white text-center mb-3">
                                    <i className="icon-uqai uqai-usuario"></i>
                                </h4>
                                <input type="email" className="form-control border-success"
                                       placeholder="Usuario/correo"/>
                            </div>
                            <div className="mb-1">
                                <h4 className="form-label text-white text-center mb-3">
                                    <i className="icon-uqai uqai-contrasena"></i>
                                </h4>
                                <input type="password" className="form-control border-success"
                                       placeholder="Contraseña"/>
                            </div>

                            <div className="text-center">
                                <a href="#" className="link-light text-white text-decoration-none fst-italic">
                                    ¿Olvido su contraseña?
                                </a>
                            </div>

                            <div className="d-flex justify-content-center mt-4 pt-xl-2">
                                <button type="submit" className="btn btn-primary px-3">Iniciar sesión</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

const HomeOption = ({icon, text, to}) => {
    const history = useHistory();

    return (
        <div onClick={() => history.push(to)}
             className="home-option text-center text-xl-start flex-justified py-1 p-sm-2 px-1 px-xl-2 rounded-3"
             role="button"
             aria-label={text}>
            <i className={`icon-uqai ${icon} mb-1`}/>
            <p className="m-0 lh-sm">{text}</p>
        </div>
    );
}

export const DemoPage = () => {

    return (
        <>
            <div className="bg-fullscreen bg-img-center" style={{backgroundImage: `url(${background1})`}}/>
            <div className="vh-100 d-flex flex-column">
                <Header transparent={true}/>
                <section className="flex-grow-1">
                    <div className="h-100">
                        <div className="row flex-column flex-xl-row h-100 g-0 align-items-stretch">
                            <div className="col-12 col-xl-auto order-2 order-xl-1">
                                <section
                                    className="home-aside border-end-xl border-top border-top-xl-0 border-white h-100 px-3 py-xl-4 p-xxl-4">
                                    <div className="h-100 d-flex justify-content-between flex-xl-column py-2 px-xxl-2">
                                        <div className="me-4 me-xl-0">
                                            <div className="text-white d-none d-xl-block mb-3">
                                                <p className="fs-4 my-0 lh-sm">Conoce nuetras</p>
                                                <p className="fs-4 my-0 lh-sm fw-bold text-success">novedades</p>
                                            </div>
                                            <div className="home-media-container pb-xl-3">
                                                <ModalMultimedia
                                                    item={{
                                                        tipo: 'VIDEO',
                                                        url: 'https://www.youtube.com/embed/wBKT2KN_Y9s?controls=0&autoplay=1'
                                                    }}/>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 gap-md-3 text-white">
                                            <HomeOption icon="uqai-polizas-asegurados" text="Polizas asegurados"
                                                        to="/"/>
                                            <HomeOption icon="uqai-crear-siniestro" text="Crear siniestro" to="/"/>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="col order-1 order-xl-2">
                                <main className="h-100 row flex-column flex-xl-row g-0">
                                    <div className="col-xl-6 col-xxl-5 align-self-center">
                                        <div className="flex text-white px-4 px-md-5 py-xxl-3 px-xxl-4 ms-xxl-5">
                                            <h1 className="display-2 fw-normal mt-4 mt-xl-0 mb-3 mb-xl-5">Bienbenido</h1>
                                            <h2 className="fw-bold m-0">
                                                Este es tu sistema para realizar tus <span className="text-success">cotizaciones en linea</span>
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-xxl-7 flex-grow-1">
                                        <div className="home-assets min-vh-40">
                                            <div className="home-person">
                                                <img src={imgPerson} alt="person"/>
                                            </div>
                                            <div className="home-texture">
                                                <img src={imgTexture} alt="texture"/>
                                            </div>
                                        </div>
                                    </div>
                                </main>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export const DemoCards = () => {
    const [isOpenModal1, setIsOpenModal1] = useState(false);
    const [isOpenModal2, setIsOpenModal2] = useState(false);
    const [isChecked, setIsChecked] = useState(true);

    const toggleModal1 = () => setIsOpenModal1(prev => !prev);
    const toggleModal2 = () => setIsOpenModal2(prev => !prev);
    const toggleIsChecked = () => setIsChecked(prev => !prev);

    return (
        <>
            <div className="bg-fullscreen bg-img-center" style={{backgroundImage: `url(${background2})`}}/>
            <div className="vh-100 d-flex flex-column">
                <Header transparent={false}/>
                <section className="p-1 p-md-2 p-xl-4 flex-grow-1">
                    <div className="container-fluid">
                        <div className="row align-items-stretch">
                            <div className="col-xl-6 py-2">
                                <Card className="shadow h-100">
                                    <CardHeader className="d-flex align-items-center border-bottom border-primary">
                                        <h5 className="my-0 fw-bold">
                                            <i className="icon-uqai align-middle uqai-documentos text-primary me-2"></i>
                                            Forms
                                        </h5>
                                    </CardHeader>
                                    <CardBody>
                                        <form className="row gy-3">
                                            <div className="col-md-6">
                                                <label htmlFor="inputEmail4"
                                                       className="form-label fw-bold text-secondary fs-7">Email</label>
                                                <input type="email" className="form-control" id="inputEmail4"/>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="inputPassword4"
                                                       className="form-label fw-bold text-secondary fs-7">Password</label>
                                                <input type="password" className="form-control" id="inputPassword4"/>
                                            </div>
                                            <div className="col-6">
                                                <label htmlFor="inputAddress"
                                                       className="form-label fw-bold text-secondary fs-7">Address</label>
                                                <div className="d-flex align-items-center">
                                                    <input type="text" className="form-control" id="inputAddress"
                                                           placeholder="1234 Main St"/>
                                                    <i className="icon-uqai uqai-ayuda ms-1 text-light fs-5"></i>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label fw-bold text-secondary fs-7">Date
                                                    time</label>
                                                <div className="d-flex align-items-center">
                                                    <Datetime timeFormat={false}/>
                                                    <i className="icon-uqai uqai-ayuda ms-1 text-light fs-5"></i>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="inputAddress2"
                                                       className="form-label fw-bold text-secondary fs-7">Address
                                                    2</label>
                                                <input type="text" className="form-control" id="inputAddress2"
                                                       placeholder="Apartment, studio, or floor"/>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="inputCity"
                                                       className="form-label fw-bold text-secondary fs-7">City</label>
                                                <div className="d-flex align-items-center">
                                                    <input type="text" className="form-control" id="inputCity"/>
                                                    <i className="icon-uqai uqai-ayuda ms-1 text-light fs-5"></i>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="inputState"
                                                       className="form-label fw-bold text-secondary fs-7">State</label>
                                                <div className="d-flex align-items-center">
                                                    <select id="inputState" className="form-select">
                                                        <option selected>--TODOS--</option>
                                                        <option>opc1</option>
                                                        <option>opc1</option>
                                                        <option>opc1</option>
                                                    </select>
                                                    <i className="icon-uqai uqai-ayuda ms-1 text-light fs-5"></i>
                                                </div>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="inputZip"
                                                       className="form-label fw-bold text-secondary fs-7">Zip</label>
                                                <input type="text" className="form-control" id="inputZip"/>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="gridCheck"/>
                                                    <label className="form-check-label" htmlFor="gridCheck">
                                                        Check me out
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <button type="submit" className="btn btn-primary">Sign in</button>
                                            </div>
                                        </form>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-xl-6 py-2">
                                <Card className="shadow h-100">
                                    <CardHeader className="d-flex align-items-center border-bottom border-primary">
                                        <h5 className="my-0 fw-bold">Text</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="row row-cols-3">
                                            <div className="col">
                                                <p className="text-secondary fw-bold fs-7">Colors:</p>
                                                <div>
                                                    <p className="text-primary">.text-primary</p>
                                                    <p className="text-secondary">.text-secondary</p>
                                                    <p className="text-alternative">.text-alternative</p>
                                                    <p className="text-success">.text-success</p>
                                                    <p className="text-danger">.text-danger</p>
                                                    <p className="text-warning">.text-warning</p>
                                                    <p className="text-info">.text-info</p>
                                                    <p className="text-light bg-dark">.text-light</p>
                                                    <p className="text-dark">.text-dark</p>
                                                    <p className="text-body">.text-body</p>
                                                    <p className="text-muted">.text-muted</p>
                                                    <p className="text-white bg-dark">.text-white</p>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <p className="text-secondary fw-bold fs-7">Sizes:</p>
                                                <div>
                                                    <p className="fs-1">.fs-1 text</p>
                                                    <p className="fs-2">.fs-2 text</p>
                                                    <p className="fs-3">.fs-3 text</p>
                                                    <p className="fs-4">.fs-4 text</p>
                                                    <p className="fs-5">.fs-5 text</p>
                                                    <p className="fs-6">.fs-6 text</p>
                                                    <p className="fs-7">.fs-7 text</p>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <p className="text-secondary fw-bold fs-7">Weight and italics:</p>
                                                <div>
                                                    <p className="fw-bold">Bold text.</p>
                                                    <p className="fw-semibold">Semibold weight text.</p>
                                                    <p className="fw-regular">Regular weight text.</p>
                                                    <p className="fw-normal">Normal weight text.</p>
                                                    <p className="fw-light">Light weight text.</p>
                                                    <p className="fst-italic">Italic text.</p>
                                                    <p className="fst-normal">Text with normal font style</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-4 py-2">
                                <Card className="shadow">
                                    <CardHeader className="d-flex align-items-center border-bottom border-primary">
                                        <h5 className="my-0 fw-bold">Buttons</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <div
                                            className="d-flex flex-wrap gap-2 mb-3 justify-content-between align-items-baseline">
                                            <button type="button" className="btn btn-primary">Primary</button>
                                            <button type="button" className="btn btn-secondary">Secondary</button>
                                            <button type="button" className="btn btn-alternative">Alternative</button>
                                            <button type="button" className="btn btn-success">Success</button>
                                            <button type="button" className="btn btn-danger">Danger</button>
                                            <button type="button" className="btn btn-warning">Warning</button>
                                            <button type="button" className="btn btn-info">Info</button>
                                            <button type="button" className="btn btn-light">Light</button>
                                            <button type="button" className="btn btn-dark">Dark</button>
                                            <button type="button" className="btn btn-link">Link</button>
                                        </div>

                                        <p className="text-secondary fw-bold fs-7">
                                            Outline buttons:
                                            <i className="icon-uqai uqai-ayuda ms-1 text-light"></i>
                                        </p>
                                        <div
                                            className="d-flex flex-wrap gap-2 mb-3 justify-content-between align-items-baseline">
                                            <button type="button" className="btn btn-outline-primary">Primary</button>
                                            <button type="button" className="btn btn-outline-secondary">Secondary
                                            </button>
                                            <button type="button" className="btn btn-outline-success">Success</button>
                                            <button type="button" className="btn btn-outline-danger">Danger</button>
                                            <button type="button" className="btn btn-outline-warning">Warning</button>
                                            <button type="button" className="btn btn-outline-info">Info</button>
                                            <button type="button" className="btn btn-outline-light">Light</button>
                                            <button type="button" className="btn btn-outline-dark">Dark</button>
                                        </div>

                                        <p className="text-secondary fw-bold fs-7">
                                            Icon buttons:
                                            <i className="icon-uqai uqai-ayuda ms-1 text-light"></i>
                                        </p>
                                        <div
                                            className="d-flex flex-wrap gap-2 mb-3 justify-content-between align-items-baseline">
                                            <button type="button" className="btn btn-primary btn-lg">
                                                <i className="icon-uqai uqai-documentos me-1"></i>
                                                Large
                                            </button>
                                            <button type="button" className="btn btn-primary">
                                                <i className="icon-uqai uqai-contrasena me-1"></i>
                                                Regualar
                                            </button>
                                            <button type="button" className="btn btn-primary btn-sm">
                                                <i className="icon-uqai uqai-filtros me-1"></i>
                                                Small
                                            </button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="col-xl-8 py-2">
                                <Card className="shadow">
                                    <CardHeader className="d-flex align-items-center border-bottom border-primary">
                                        <h5 className="my-0 fw-bold">Icons</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="d-flex flex-wrap justify-content-between gap-2">
                                            <div className="text-center">
                                                <i className="icon-uqai uqai-video"></i>
                                                <p className="js-classname">uqai-video</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-ver"></i>
                                                <p className="js-classname">uqai-ver</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-valor-reclamo"></i>
                                                <p className="js-classname">uqai-valor-reclamo</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-usuario"></i>
                                                <p className="js-classname">uqai-usuario</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-subir-archivo"></i>
                                                <p className="js-classname">uqai-subir-archivo</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-siniestro-reportado"></i>
                                                <p className="js-classname">uqai-siniestro-reportado</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-siniestro-general"></i>
                                                <p className="js-classname">uqai-siniestro-general</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-regresar"></i>
                                                <p className="js-classname">uqai-regresar</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-pregunta"></i>
                                                <p className="js-classname">uqai-pregunta</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-polizas-contratantes"></i>
                                                <p className="js-classname">uqai-polizas-contratantes</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-polizas-asegurados"></i>
                                                <p className="js-classname">uqai-polizas-asegurados</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-poliza"></i>
                                                <p className="js-classname">uqai-poliza</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-organizar"></i>
                                                <p className="js-classname">uqai-organizar</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-notificacion"></i>
                                                <p className="js-classname">uqai-notificacion</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-menu"></i>
                                                <p className="js-classname">uqai-menu</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-lista-siniestros-reportados"></i>
                                                <p className="js-classname">uqai-lista-siniestros-reportados</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-flecha-izquierda"></i>
                                                <p className="js-classname">uqai-flecha-izquierda</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-flecha-derecha"></i>
                                                <p className="js-classname">uqai-flecha-derecha</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-flecha-arriba"></i>
                                                <p className="js-classname">uqai-flecha-arriba</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-flecha-abajo"></i>
                                                <p className="js-classname">uqai-flecha-abajo</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-filtros"></i>
                                                <p className="js-classname">uqai-filtros</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-estado-revisar"></i>
                                                <p className="js-classname">uqai-estado-revisar</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-estado-rechazado"></i>
                                                <p className="js-classname">uqai-estado-rechazado</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-estado-devuelto"></i>
                                                <p className="js-classname">uqai-estado-devuelto</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-estado-aprobado"></i>
                                                <p className="js-classname">uqai-estado-aprobado</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-enviar"></i>
                                                <p className="js-classname">uqai-enviar</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-editar"></i>
                                                <p className="js-classname">uqai-editar</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-documentos"></i>
                                                <p className="js-classname">uqai-documentos</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-crear-siniestro"></i>
                                                <p className="js-classname">uqai-crear-siniestro</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-contrasena"></i>
                                                <p className="js-classname">uqai-contrasena</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-comentario"></i>
                                                <p className="js-classname">uqai-comentario</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-check-vacio"></i>
                                                <p className="js-classname">uqai-check-vacio</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-check"></i>
                                                <p className="js-classname">uqai-check</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-cerrar-sesion"></i>
                                                <p className="js-classname">uqai-cerrar-sesion</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-cerrar"></i>
                                                <p className="js-classname">uqai-cerrar</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-carga"></i>
                                                <p className="js-classname">uqai-carga</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-borrar"></i>
                                                <p className="js-classname">uqai-borrar</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-ayuda"></i>
                                                <p className="js-classname">uqai-ayuda</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-agregar"></i>
                                                <p className="js-classname">uqai-agregar</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-abrir-carpeta"></i>
                                                <p className="js-classname">uqai-abrir-carpeta</p>
                                            </div>

                                            <div className="text-center">
                                                <i className="icon-uqai uqai-estado_doc_adicional"></i>
                                                <p className="js-classname">uqai-estado_doc_adicional</p>
                                            </div>
                                            <div className="text-center">
                                                <i className="icon-uqai uqai-tipo_gasto"></i>
                                                <p className="js-classname">uqai-tipo_gasto</p>
                                            </div>
                                            <div className="text-center">
                                                <i className="icon-uqai uqai-icon_foto"></i>
                                                <p className="js-classname">uqai-icon_foto</p>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-6">
                                <div className="row">
                                    <div className="col-12 py-2">
                                        <Card className="shadow">
                                            <CardHeader
                                                className="d-flex align-items-center border-bottom border-primary">
                                                <h5 className="my-0 fw-bold">Bootstrap Table</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox"
                                                                   checked={isChecked} id="tableCheck"
                                                                   onClick={toggleIsChecked}/>
                                                            <label className="form-check-label" htmlFor="tableCheck">
                                                                white
                                                            </label>
                                                        </div>

                                                        <table
                                                            className={`table table-borderless table-hover ${isChecked ? 'table-white' : ''}`}>
                                                            <thead>
                                                            <tr className="text-secondary">
                                                                <th className="bg-white" scope="col">#</th>
                                                                <th className="bg-white" scope="col">First</th>
                                                                <th className="bg-white" scope="col">Last</th>
                                                                <th className="bg-white" scope="col">Handle</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {tableData.slice(0, 8).map(data => (
                                                                <tr key={data.id} className={data.class}>
                                                                    <td>{data.id}</td>
                                                                    <td width={220}>{data.first}</td>
                                                                    <td>{data.last}</td>
                                                                    <td>{data.handle}</td>
                                                                </tr>
                                                            ))}
                                                            </tbody>
                                                        </table>

                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                    <div className="col-12 py-2">
                                        <Card className="shadow">
                                            <CardHeader
                                                className="d-flex align-items-center border-bottom border-primary">
                                                <h5 className="my-0 fw-bold">Modal</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="d-flex gap-2">
                                                    <button type="button" className="btn btn-primary "
                                                            onClick={toggleModal1}>
                                                        Modal 1
                                                    </button>
                                                    <button type="button" className="btn btn-primary"
                                                            onClick={toggleModal2}>
                                                        Modal 2
                                                    </button>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-6 py-2">
                                <Card className="shadow">
                                    <CardHeader className="d-flex align-items-center border-bottom border-primary">
                                        <h5 className="my-0 fw-bold">React Table</h5>
                                    </CardHeader>
                                    <CardBody className="pt-0">
                                        <div className="row">
                                            <div className="col">
                                                <ReactTable
                                                    noDataText={"No hay datos..."}
                                                    loadingText={"Cargando..."}
                                                    rowsText={"filas"}
                                                    ofText={"de"}
                                                    previousText={"Anterior"}
                                                    nextText={"Siguiente"}
                                                    pageText={"Página"}
                                                    columns={[
                                                        {
                                                            Header: "#",
                                                            accessor: 'id',
                                                            width: 100,
                                                            filterable: false,
                                                            sortable: false,
                                                            minResizeWidth: 30
                                                        },
                                                        {
                                                            Header: "First",
                                                            accessor: "first",
                                                            maxWidth: 220,
                                                        },
                                                        {
                                                            Header: "Last",
                                                            accessor: "last",
                                                        },
                                                        {
                                                            Header: "Handle",
                                                            accessor: "handle",
                                                            minResizeWidth: 10,
                                                        }
                                                    ]}
                                                    data={tableData}
                                                    pages={2}
                                                    loading={false}
                                                    defaultPageSize={10}
                                                    filterable={true}
                                                    showPaginationTop
                                                    showPaginationBottom={false}
                                                    getTrProps={(_, rowInfo) => {
                                                        if (rowInfo) {
                                                            return {
                                                                className: rowInfo?.row?._original?.class ?? ''
                                                            };
                                                        }
                                                        return {};
                                                    }}
                                                    className="-highlight">
                                                </ReactTable>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Modal isOpen={isOpenModal1} toggle={toggleModal1} centered>
                <UqaiModalHeader toggle={toggleModal1}/>
                <ModalBody>
                    <div className="d-flex flex-column">
                        <div className="text-center mb-2"><i className="icon-uqai uqai-pregunta fs-1 text-primary"></i>
                        </div>
                        <h4 className="text-secondary text-center mb-3 fw-bold">Modal de confirmacion</h4>
                        <p className="m-0 text-center">asdasdasdasdasasdasdasdasdasasd awdsdasdasdsd</p>
                    </div>
                </ModalBody>
                <ModalFooter className="d-flex justify-content-center gap-2">
                    <button type="button" className="btn btn-primary"
                            onClick={toggleModal1}>
                        Do Something
                    </button>
                    <button type="button" className="btn btn-secondary"
                            onClick={toggleModal1}>
                        Cancel
                    </button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={isOpenModal2} toggle={toggleModal2} size="xl" centered>
                <UqaiModalHeader toggle={toggleModal2} title="Modal 2 title"/>
                <ModalBody>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. A consequuntur iste natus quam saepe,
                    sint? Architecto consequuntur, dolore dolores esse, ipsa libero mollitia neque porro quisquam
                    repellat sint unde vitae.
                </ModalBody>
                <ModalFooter>
                    <button type="button" className="btn btn-primary"
                            onClick={toggleModal2}>
                        Do Something
                    </button>
                    <button type="button" className="btn btn-secondary"
                            onClick={toggleModal2}>
                        Cancel
                    </button>
                </ModalFooter>
            </Modal>
        </>
    );
}
