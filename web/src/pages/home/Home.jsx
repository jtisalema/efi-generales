import React, {useEffect, useState} from 'react';
import {routes} from "../../util/General";
import axios from "axios";
import background1 from "../../assets/images/plataforma_fondo1.png";
import {Header} from "../../layouts/Header";
import {ModalMultimedia} from "./parts/ModalMultimedia";
import {canViewModule, MODULES, useCurrentModule, useModuleVam} from "../../hooks/useModules";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import imgPerson from "../../assets/images/plataforma_persona.png";
import imgTexture from "../../assets/images/plataforma_textura1.svg";

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

export const Home = () => {
    const [config, setConfig] = useState({});
    const user = useSelector(state => state.user);

    const canViewVam = useModuleVam();
    const isVam = useCurrentModule() === MODULES.VAM;
    const canCreateSiniestro = canViewModule(MODULES.CREA_SINIESTROS, user);

    useEffect(getConfig, [])

    function getConfig() {
        axios.get(routes.api + '/config-home').then(resp => {
            setConfig(resp.data);
        }).catch(error => {
            console.log(error);
        });
    }


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
                                    <div className="h-100 d-flex justify-content-between flex-xl-column py-2 px-xl-2">
                                        <div className="me-4 me-xl-0">
                                            <div className="text-white d-none d-xl-block mb-3">
                                                <p className="fs-4 my-0 lh-sm">Conoce nuestras</p>
                                                <p className="fs-4 my-0 lh-sm fw-bold text-success">novedades</p>
                                            </div>
                                            <div className="home-media-container pb-xl-3">
                                                <ModalMultimedia item={config}/>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 gap-md-3 text-white">
                                            {canViewVam &&
                                                <HomeOption icon="uqai-polizas-asegurados" text="Pólizas asegurados"
                                                            to="/vam/polizas"/>}
                                            {canCreateSiniestro &&
                                                <HomeOption icon="uqai-crear-siniestro" text="Reportar Siniestro"
                                                            to={`/${isVam ? 'vam' : 'gen'}/reportar-siniestro/new/new`}/>}
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="col order-1 order-xl-2">
                                <main className="h-100 row flex-column flex-xl-row g-0">
                                    <div className="col-xl-6 col-xxl-5 align-self-center">
                                        <div
                                            className="home-text-container flex text-white px-4 px-md-5 py-xxl-3 px-xxl-4 ms-xxl-5">
                                            <h1 className="display-3 fw-normal mt-4 mt-xl-0 mb-3 mb-md-4 mb-xxl-5">Bienvenido</h1>
                                            <h2 className="fw-bold m-0">
                                                Este es tu portal para realizar tus movimientos <span
                                                className="text-success">y consultas en línea</span>
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