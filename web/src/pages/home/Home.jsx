import React, { useEffect, useState, useRef } from 'react';
import { app, routes } from "../../util/General";
import axios from "axios";
import background1 from "../../assets/images/plataforma_fondo1.png";
import { Header } from "../../layouts/Header";
import { ModalMultimedia } from "./parts/ModalMultimedia";
import { canViewModule, MODULES, useCurrentModule, useModuleVam } from "../../hooks/useModules";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import imgPerson from "../../assets/images/plataforma_persona.png";
import imgTexture from "../../assets/images/plataforma_textura1.svg";
import { Modal } from "reactstrap";
import { UqaiModalHeader } from "../../components/UqaiModal";
import { do_logout } from "../../pages/sec/redux/actions";

const HomeOption = ({ icon, text, to }) => {
    const history = useHistory();

    return (
        <div onClick={() => history.push(to)}
            className="home-option text-center text-xl-start flex-justified py-1 p-sm-2 px-1 px-xl-2 rounded-3"
            role="button"
            aria-label={text}>
            <i className={`icon-uqai ${icon} mb-1`} />
            <p className="m-0 lh-sm">{text}</p>
        </div>
    );
}

export const Home = () => {
    const [open, setOpen] = useState(false);
    const [config, setConfig] = useState({});
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const modalBodyRef = useRef(null); // Referencia para el contenedor del modal

    const canViewVam = useModuleVam();
    const isVam = useCurrentModule() === MODULES.VAM;
    const canCreateSiniestro = canViewModule(MODULES.CREA_SINIESTROS, user);
    // Usamos useState para que las variables conserven su valor entre renders
    const [cedula, setCedula] = useState('');
    const [nombreApellido, setNombreApellido] = useState('');
    const [correoElectronico, setCorreoElectronico] = useState('');
    const [isScrollEnd, setIsScrollEnd] = useState(false); // Estado para controlar la habilitación del botón

    const toggleModal = () => {
        setOpen(!open);
    };

    useEffect(() => {
        let cedulaActual = '';

        if (user.cedula == null && user.asociadosVam && user.asociadosVam.length > 0) {
            cedulaActual = user.asociadosVam[0].cedula;
            setNombreApellido(user.asociadosVam[0].nmCliente + ' ' + user.asociadosVam[0].apCliente);
            setCorreoElectronico(user.asociadosVam[0].usuarioWeb);
        } else {
            cedulaActual = user.cedula;
            setNombreApellido(user.nmAsegurado + ' ' + user.apAsegurado);
            setCorreoElectronico(user.email);
        }

        // Establece la cédula en el estado
        setCedula(cedulaActual);

        // Hacer la llamada a la API solo después de establecer la cédula
        if (cedulaActual && !cedula.endsWith('001')) {
            axios.get(`https://cotizador.segurossuarez.com/apiclientes/ConsentimientoTratamiento/obtenerUltimoEstadoPorCedula/${cedulaActual}`, {
                withCredentials: false
            })
                .then(resp => {
                    let estadoConsentimiento = resp.data.resultado.estado ?? '';
                    if (estadoConsentimiento !== 'aceptado') {
                        setOpen(true);
                    }
                })
                .catch(error => {
                    alert('Error al consultar: ' + error);
                });
        }

        getConfig();
    }, []);

    const getConfig = () => {
        axios.get(routes.api + '/config-home').then(resp => {
            setConfig(resp.data);
        }).catch(error => {
            console.log(error);
        });
    };

    const logout = () => {
        alert("El consentimiento para el tratamiento de datos personales es obligatorio para continuar.");
        let toRedirect = "https://consultas.segurossuarez.com/";
        axios.post(routes.root + '/logout').then(ignored => {
        }).catch(error => {
            console.log(error);
        }).then(() => {
            dispatch(do_logout());
            if (!app.prod) toRedirect = '/';
        }).finally(() => {
            window.location.href = toRedirect;
        });
    };

    const aceptacionTratamiento = async () => {
        try {
            // Obtener la IP pública
            const response = await axios.get('https://api.ipify.org/?format=json', {
                withCredentials: false
            });
            const ipPublica = response.data.ip ?? '';
            const userAgent = navigator.userAgent;

            // Datos a enviar en la solicitud POST
            const data = {
                consentimientoId: 0,
                cedula: cedula, // Reemplaza con el valor real
                estado: 'aceptado', // Reemplaza con el valor real
                fechaAccion: new Date().toISOString(), // Fecha actual
                direccionIP: ipPublica,
                userAgent: userAgent,
                correoElectronico: correoElectronico,// Reemplaza con el valor real
                nombresApellidos: nombreApellido
            };

            // Realizar la solicitud POST
            await axios.post('https://cotizador.segurossuarez.com/apiclientes/ConsentimientoTratamiento/crearConsentimientoInformacion', data, {
                withCredentials: false,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            window.location.reload();
        } catch (error) {
            alert('Error al obtener IP o al enviar el consentimiento:', error);
        }
    };

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
        const tolerance = 1; // Ajusta este valor según sea necesario
        // Compara con una tolerancia
        if (scrollTop + clientHeight >= scrollHeight - tolerance) {
            setIsScrollEnd(true);
        } else {
            setIsScrollEnd(false);
        }
    };

    return (
        <>
            <div className="bg-fullscreen bg-img-center" style={{ backgroundImage: `url(${background1})` }} />
            <div className="vh-100 d-flex flex-column">
                <Header transparent={true} />
                <section className="flex-grow-1">
                    <div className="h-100">
                        <div className="row flex-column flex-xl-row h-100 g-0 align-items-stretch">
                            <div className="col-12 col-xl-auto order-2 order-xl-1">
                                <section className="home-aside border-end-xl border-top border-top-xl-0 border-white h-100 px-3 py-xl-4 p-xxl-4">
                                    <div className="h-100 d-flex justify-content-between flex-xl-column py-2 px-xl-2">
                                        <div className="me-4 me-xl-0">
                                            <div className="text-white d-none d-xl-block mb-3">
                                                <p className="fs-4 my-0 lh-sm">Conoce nuestras</p>
                                                <p className="fs-4 my-0 lh-sm fw-bold text-success">novedades</p>
                                            </div>
                                            <div className="home-media-container pb-xl-3">
                                                <ModalMultimedia item={config} />
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 gap-md-3 text-white">
                                            {canViewVam &&
                                                <HomeOption icon="uqai-polizas-asegurados" text="Pólizas asegurados"
                                                    to="/vam/polizas" />}
                                            {canCreateSiniestro &&
                                                <HomeOption icon="uqai-crear-siniestro" text="Reportar Siniestro"
                                                    to={`/${isVam ? 'vam' : 'gen'}/reportar-siniestro/new/new`} />}
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="col order-1 order-xl-2">
                                <main className="h-100 row flex-column flex-xl-row g-0">
                                    <div className="col-xl-6 col-xxl-5 align-self-center">
                                        <div className="home-text-container flex text-white px-4 px-md-5 py-xxl-3 px-xxl-4 ms-xxl-5">
                                            <h1 className="display-3 fw-normal mt-4 mt-xl-0 mb-3 mb-md-4 mb-xxl-5">Bienvenido</h1>
                                            <h2 className="fw-bold m-0">
                                                Este es tu portal para realizar tus movimientos <span className="text-success">y consultas en línea</span>
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-xxl-7 flex-grow-1">
                                        <div className="home-assets min-vh-40">
                                            <div className="home-person">
                                                <img src={imgPerson} alt="person" />
                                            </div>
                                            <div className="home-texture">
                                                <img src={imgTexture} alt="texture" />
                                            </div>
                                        </div>
                                    </div>
                                </main>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            {/* Modal */}
            <Modal isOpen={open} toggle={toggleModal} size="xl" keyboard={false} backdrop="static">
                <UqaiModalHeader title="AUTORIZACIÓN DE TRATAMIENTO DE DATOS PERSONALES" />
                <div
                    className="modal-body">
                    <div
                        className="modal-body"
                        style={{
                            maxHeight: '75vh',
                            overflowY: 'auto',
                            borderRadius: '10px',
                            border: '1px solid black',
                            boxSizing: 'border-box', // Asegúrate de que el borde no afecte el tamaño
                            padding: '10px', // Agregar un poco de padding para evitar que el contenido toque el borde
                        }}
                        ref={modalBodyRef}
                        onScroll={handleScroll}
                    >
                        <div style={{ style: 'maxHeight:100px', textAlign: 'center' }}>
                            <p style={{ textAlign: 'justify', margin: '10px' }}>
                                Con fin de cumplir con la LEY ORGÁNICA DE PROTECCIÓN DE DATOS PERSONALES (LOPDP); SEGUSUAREZ AGENCIA
                                ASESORA PRODUCTORA DE SEGUROS con nombre comercial Seguros Suárez, domiciliada en Ambato, Av. Rodrigo
                                Pachano y Montalvo, actuando como RESPONSABLE de los datos, informa el tratamiento que realizará a sus datos
                                personales, garantizándole la protección de éstos conforme a la normativa vigente y que se encuentra estipulado en
                                nuestra Política de Privacidad.
                            </p>
                            <p style={{ textAlign: 'justify', margin: '10px', }}>
                                Los datos por tratar para la provisión de nuestros servicios en las pólizas de:
                            </p>
                            <p style={{ textAlign: 'justify', margin: '10px', }}>
                                <ul>
                                    <li>Seguros Generales son: nombre, cédula, correo electrónico, teléfono, dirección, fecha de nacimiento y licencia de
                                        conducir y certificados bancarios y datos financieros sobre su capacidad de pago. Es necesario recopilar los datos
                                        de discapacidad, en caso de tenerla, para proveerle el servicio adecuado y los beneficios de ley.</li>
                                    <li>Seguros de Asistencia médica y/o vida son: nombre, cédula, correo electrónico, teléfono, dirección, fecha de
                                        nacimiento y licencia de conducir y certificados bancarios y datos financieros sobre su capacidad de pago. Es
                                        necesario recopilar los datos de salud como diagnósticos y antecedentes médicos físicos y mentales, para evaluar
                                        el riesgo del asegurado y datos de discapacidad, en caso de tenerla, para proveerle el servicio adecuado y los
                                        beneficios de ley. </li>
                                    <li>Fianzas son: nombre, cédula, correo electrónico, teléfono, dirección, fecha de nacimiento, licencia de conducir,
                                        planillas de servicios básicos y experiencia laboral. Adicionalmente, es necesario recopilar datos de discapacidad.</li>
                                </ul>
                            </p>
                            <p style={{ textAlign: 'justify', margin: '10px', }}>
                                Para cubrir pólizas, en caso de ejecutarse, es posible que se necesite el tratamiento de datos especiales como: partida
                                de defunción, datos de exámenes médicos, historia clínica, datos biométricos de autopsia, además, es posible que se
                                necesite los mismos datos previamente mencionado de sus tutelados o hijos menores de edad, solo en caso de que
                                estos sean beneficiarios o dependientes de la póliza.
                            </p>
                            <p style={{ textAlign: 'justify', margin: '10px', }}>
                                Para fines de mercadotecnia y servicio postventa, se utilizarán sus datos exclusivamente para contacto, prospección
                                y encuestas o medición de satisfacción.
                            </p>
                            <p style={{ textAlign: 'justify', margin: '10px', }}>
                                Estos datos serán almacenados en nuestros sistemas informáticos, los cuales Seguros Suárez mantiene con estricta
                                confidencialidad y garantizando la protección de su información, con el fin de gestionar la relación comercial y
                                contractual. Adicionalmente, dichos datos, dependiendo del servicio, deberán ser transferidos a proveedores de
                                seguros, entidades financieras, ajustadores, servicios de salud y a las Autoridades respectivas.
                            </p>
                            <p style={{ textAlign: 'justify', margin: '10px', }}>
                                En caso de duda sobre el tratamiento de sus datos o acerca de sus derechos de acceder, portabilizar, rectificar o
                                actualizar, opositar, eliminar, limitar o suspender el consentimiento del uso de los datos, puede revisar como ejercerlos
                                en la política de privacidad disponible en la página web: <a href="https://www.segurossuarez.com/politica-de-privacidad/">https://www.segurossuarez.com/politica-de-privacidad/</a> o
                                puede acudir al delegado de protección de datos de Seguros Suárez, a través del siguiente correo:
                                <a href="mailto:protecciondatos@segurossuarez.com">protecciondatos@segurossuarez.com</a> o de manera presencial en su oficina Matriz en Ambato.
                            </p>
                            <p style={{ textAlign: 'justify', margin: '10px', }}>
                                Expuesto esto, yo, <strong>{nombreApellido}</strong> con CI <strong>{cedula}</strong>, de forma consiente, libre y voluntaria, autorizo el uso, tratamiento, almacenamiento,
                                clasificación, modificación, actualización y transferencia, de los datos para los fines
                                mencionados previamente y los demás fines estipulados en la Política de Privacidad de Seguros Suárez y entiendo que
                                el revocar dicho consentimiento implica que Seguros Suárez no podrá ofrecerme el servicio adecuado, por ello, acepto
                                la necesidad de su tratamiento mientras mantenga una relación comercial u obligación contractual con Seguros Suárez
                                o mientras lo requiera algún requisito legal.
                            </p>
                        </div>
                    </div>
                    <p style={{ textAlign: 'justify', marginTop: '10px' }}>
                        Al <strong>Aceptar</strong>, usted AUTORIZA de manera libre, consciente y voluntaria el uso,
                        almacenamiento, actualización y transferencia de sus datos, garantizando la
                        confidencialidad y protección de los mismos bajo la normativa vigente.
                    </p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-success" onClick={() => { aceptacionTratamiento(); toggleModal(); }} disabled={!isScrollEnd}>Aceptar</button>
                </div>
            </Modal>
        </>
    );
};
