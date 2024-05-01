import React, {useState} from "react";
import {Offcanvas, Tab} from 'react-bootstrap';
import backgroundMenu from "../assets/images/foto_menu.jpg";
import {Link} from "react-router-dom";
import {MODULES, useCurrentModule, useModuleGen, useModuleVam} from "../hooks/useModules";
import {useSelector} from "react-redux";
import UqaiTooltip from "../components/UqaiTooltip";
import useRedirectionDBroker from "hooks/useRedirectionDBroker";


const NavSidebar = ({items}) => {
    return (
        <nav className="nav flex-column p-3">
            {items?.map((item, index) => (
                <Link key={index} to={item.to} onClick={item.onClick}
                      className="text-white text-decoration-none py-2 ps-4 pe-3 my-1">
                    <i className={`icon-uqai icon-uqai-lg ${item.icon} text-center mx-2`}
                       style={{width: 26}}></i>
                    {item.text}
                </Link> //NOSONAR
            ))}
        </nav>
    );
}

export const Sidebar = ({toggle, isOpen}) => {
    const user = useSelector(state => state.user);
    const mod = useCurrentModule();
    const redirectToDBroker = useRedirectionDBroker();

    function findTab(mod) {
        if (user.isAdmin) return 3;
        if (user.isEjecutivo) return 4;
        if (mod.includes(MODULES.GEN)) return 1;
        if (mod.includes(MODULES.VAM)) return 2;
        return 0;
    }

    const [tab, setTab] = useState(findTab(mod));
    const isVam = useModuleVam();
    const isGen = useModuleGen();

    const switchTab = (key) => {
        setTab(key);
    }

    const getTabStyle = (key) => {
        return key === tab ? 'bg-info' : 'bg-white text-light';
    }

    const linksGen = [
        {text: 'Pólizas', icon: 'uqai-poliza', to: '/gen/polizas'},
        {text: 'Siniestros Vam', icon: 'uqai-lista-siniestros-reportados', to: '/gen/siniestros-vam'},
        {text: 'Siniestros Generales', icon: 'uqai-siniestro-general', to: '/gen/siniestros-gen'},
        {text: 'Siniestros Reportados', icon: 'uqai-siniestro-reportado', to: '/gen/siniestros-reportados'},
        {
            text: 'Crear siniestro', icon: 'uqai-crear-siniestro',
            onClick: () => window.location.href = `/gen/reportar-siniestro/new/new`,
        },
    ];

    const linksVam = [
        {text: 'Pólizas', icon: 'uqai-poliza', to: '/vam/polizas'},
        {text: 'Siniestros Vam', icon: 'uqai-lista-siniestros-reportados', to: '/vam/siniestros'},
        {text: 'Siniestros Reportados', icon: 'uqai-siniestro-reportado', to: '/vam/siniestros-reportados'},
        {
            text: 'Crear siniestro', icon: 'uqai-crear-siniestro',
            onClick: () => window.location.href = `/vam/reportar-siniestro/new/new`,
        },
    ];

    const linksAdmin = [
        {text: 'Home', icon: 'uqai-poliza', to: '/home-adm'},
        {text: 'Ejecutivos', icon: 'uqai-lista-siniestros-reportados', to: '/gestor-ejecutivo'},
        {text: 'usuarios creados', icon: 'uqai-siniestro-general', to: '/gen/visor'},
        {text: 'usuarios generales', icon: 'uqai-siniestro-general', to: '/gen/usuarios-gestor'},
        {text: 'usuarios vam', icon: 'uqai-siniestro-general', to: '/vam/usuarios-gestor'},
        {text: 'Siniestros Reportados', icon: 'uqai-siniestro-reportado', to: '/vam/siniestros-reportados'},
        {text: 'DBROKER', icon: 'uqai-siniestro-reportado', onClick: () => window.location.href = redirectToDBroker},
    ];

    const linksEjecutivo = [
        {text: 'Siniestros Reportados', icon: 'uqai-siniestro-reportado', to: '/vam/siniestros-reportados'},
        {text: 'DBROKER', icon: 'uqai-siniestro-reportado', onClick: () => window.location.href = redirectToDBroker}
    ];

    return (
        <Offcanvas show={isOpen} onHide={toggle} placement={'end'} backdrop={false} scroll={true}
                   className="text-white bg-primary text-bg-primary bg-gradient border-0 shadow overflow-hidden">
            <Offcanvas.Header className="p-4">
                <Offcanvas.Title>MENÚ</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0 d-flex flex-column">
                <Tab.Container id="left-tabs-example" defaultActiveKey="first" activeKey={tab} transition={false}>
                    <div className="d-flex fw-regular">
                        {isGen && <div className={`flex-justified d-flex p-2 ${getTabStyle(1)}`} role="button"
                                       aria-label="Pólizas Contratantes" onClick={() => switchTab(1)}>
                            <i className="icon-uqai uqai-polizas-contratantes me-2 fs-4"></i>
                            <span className="lh-sm fs-7 d-flex">
                                Pólizas Contratantes <UqaiTooltip size={'fs-6'}
                                                                  message={"Pólizas que han sido contratadas o emitidas como dueño de la misma."}/>
                           </span>
                        </div>}

                        {isVam && <div className={`flex-justified d-flex p-2 ${getTabStyle(2)}`} role="button"
                                       aria-label="Pólizas Aseguradas" onClick={() => switchTab(2)}>
                            <i className="icon-uqai uqai-polizas-asegurados me-2 fs-5"></i>
                            <span className="lh-sm fs-7 d-flex">
                                Pólizas Asegurados <UqaiTooltip size={'fs-6'}
                                                                message={"Pólizas a la que pertenece como beneficiario de un seguro dentro de una empresa."}/>
                           </span>
                        </div>}
                        {user.isAdmin && <div className={`flex-justified d-flex p-2 ${getTabStyle(3)}`} role="button"
                                              aria-label="Admin" onClick={() => switchTab(3)}>
                            <i className="icon-uqai uqai-polizas-asegurados me-2 fs-4"></i>
                            <span className="lh-sm">
                                Admin
                           </span>
                        </div>}
                        {user.isEjecutivo &&
                            <div className={`flex-justified d-flex p-2 ${getTabStyle(4)}`} role="button"
                                 aria-label="Ejecutivo" onClick={() => switchTab(4)}>
                                <i className="icon-uqai uqai-polizas-asegurados me-2 fs-4"></i>
                                <span className="lh-sm">
                                Ejecutivo
                           </span>
                            </div>}
                    </div>

                    <div className="flex-grow-1 sidebar-filter-gradient bg-img-center fw-regular"
                         style={{backgroundImage: `url(${backgroundMenu})`}}>
                        <Tab.Content>
                            <Tab.Pane eventKey={1}>
                                <NavSidebar items={linksGen}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey={2}>
                                <NavSidebar items={linksVam}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey={3}>
                                <NavSidebar items={linksAdmin}/>
                            </Tab.Pane>
                            <Tab.Pane eventKey={4}>
                                <NavSidebar items={linksEjecutivo}/>
                            </Tab.Pane>
                        </Tab.Content>

                        {tab === 0 && <>
                            <p className={"px-3 mt-3"}> Seleccione el menú para ver las opciones.</p>
                        </>}
                    </div>
                </Tab.Container>
            </Offcanvas.Body>
        </Offcanvas>
    );
}