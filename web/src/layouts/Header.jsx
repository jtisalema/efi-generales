import React, {useState} from "react";
import {Sidebar} from "./Sidebar";
import {Container, Navbar} from "react-bootstrap";
import logo from "../assets/images/logo1.svg";
import logoSmall from "../assets/images/logo3.svg";
import defaultAvatar from "../assets/images/avatar.png";
import {Dropdown, DropdownMenu, DropdownToggle} from "reactstrap";
import axios from "axios";
import {app, metricasGoogle, routes} from "../util/General";
import {do_logout} from "../pages/sec/redux/actions";
import {useDispatch, useSelector} from "react-redux";
import {Helmet} from "react-helmet/es/Helmet";
import {Link} from "react-router-dom";
import {MODULES, useCurrentModule} from "../hooks/useModules";
import {AsociadoGen} from "../pages/gen/AsociadoGen";
import {AsociadoVam} from "../pages/vam/AsociadoVam";


const NavbarUser = ({firstName, lastName, role, avatar}) => {
    const user = useSelector(state => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(prev => !prev);
    const dispatch = useDispatch();
    const module = useCurrentModule();
    const hasMod = module !== 'main';

    const onAvatarError = ({currentTarget}) => {
        currentTarget.onerror = null;
        currentTarget.src = defaultAvatar;
    }

    const logout = () => {
        let toRedirect = "https://consultas.segurossuarez.com/";
        axios.post(routes.root + '/logout').then(ignored => {
        }).catch(error => {
            console.log(error);
        }).then(() => {
            metricasGoogle(user,  "logout", "siniestro", "list");
            dispatch(do_logout());
            if (!app.prod) toRedirect = '/';
        }).finally(() => {
            window.location.href = toRedirect;
        });
    };

    return (
        <Dropdown isOpen={isOpen} toggle={toggle}>
            <DropdownToggle data-toggle="dropdown" tag="div">
                <div className="d-flex py-1 px-2" role="button" aria-label="avatar">
                    <div className="d-flex flex-column justify-content-center">
                        <span className="text-white text-end lh-sm">{firstName}</span>
                        <span className="text-success fw-bold text-end lh-1">{lastName}</span>
                    </div>
                    <div className="px-2 navbar-user-avatar">
                        <img src={avatar} className="rounded-circle" alt="avatar" onError={onAvatarError}
                             style={{objectFit: 'cover'}}/>
                    </div>
                    <div className="d-flex align-items-center text-white">
                        <i className="icon-uqai icon-uqai-sm uqai-flecha-derecha"></i>
                    </div>
                </div>
            </DropdownToggle>
            <DropdownMenu end className="px-2 py-3 bg-primary bg-gradient border-0 shadow">
                <div className="d-flex flex-column align-items-center">
                    <div className="px-4 navbar-user-avatar-dropdown">
                        <img src={avatar} className="rounded-circle shadow" alt="avatar"
                             onError={onAvatarError} style={{objectFit: 'cover'}}/>
                    </div>
                    {hasMod && <Link to={`/${module}/perfil`} className="mt-2 text-white text-decoration-none">
                        <i className="icon-uqai icon-uqai-sm uqai-usuario me-1"></i>
                        Mi cuenta
                    </Link>}
                    <p className="mt-2 mb-0 fs-5 d-none">
                        <span className="text-white text-end lh-sm">{firstName}</span>
                        <span className="text-success fw-bold text-end lh-1">{lastName}</span>
                    </p>
                    <AsociadoGen/>
                    <AsociadoVam/>
                    <span className="fs-6 fst-italic text-white d-none">{role}</span>
                    <button className="btn btn-info mt-2" onClick={logout}>
                        <i className="icon-uqai uqai-cerrar-sesion me-1"></i>
                        Cerrar sesión
                    </button>
                </div>
            </DropdownMenu>
        </Dropdown>
    );
};

export const Header = ({transparent, title}) => {
    const user = useSelector(state => state.user);
    const isGen = useCurrentModule() === MODULES.GEN;

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(prev => !prev);

    const bgColor = transparent ? '' : 'bg-primary bg-gradient';

    return (
        <>
            {title && <Helmet><title>{title}</title></Helmet>}
            <Navbar variant="dark" className={`border-bottom border-2 border-success py-1 ${bgColor}`}>
                <Container fluid className="ps-2 ps-xl-4 ms-md-2 pe-0">
                    <Navbar.Brand href={`${isGen ? '/gen' : '/vam'}/home`} className="p-0">
                        <img src={logo} className="d-none d-md-block" alt="logo"/>
                        <img src={logoSmall} className="d-block d-md-none" alt="logo"/>
                    </Navbar.Brand>
                    <Navbar.Collapse className="border-end border-1 border-white py-1 py-xxl-2">
                        <div className="d-none d-xl-flex align-items-center ms-5 py-1 py-md-2">
                            <Link to={`${isGen ? '/gen' : '/vam'}/home`} className="text-white text-decoration-none">
                                <h2 className="my-0 fw-bold">SS Online</h2>
                            </Link>
                            {title && <>
                                <h3 className="my-0 mx-2 text-white">/</h3>
                                <span className="text-white text-decoration-none">
                                    <h4 className="my-0">{title}</h4>
                                </span>
                            </>}
                        </div>
                        <div className="pe-2 pe-xl-4 ms-auto d-flex justify-content-center align-items-center">
                            <NavbarUser firstName={isGen ? user.nmCliente : user.nmAsegurado}
                                        lastName={isGen ? user.apCliente : user.apAsegurado} role="Rol Usuario"
                                        avatar={`${routes.api}/user/img/${user.id}?v=${user.fcModifica}`}/>
                        </div>
                    </Navbar.Collapse>
                    <div onClick={toggle} className="text-white fs-4 px-3 px-xl-4 mx-md-2" role="button"
                         aria-label="menu"
                         style={{zIndex: 1046}}>
                        <i className={`icon-uqai icon-uqai-sm ${isOpen ? "uqai-cerrar" : "uqai-menu"}`}></i>
                    </div>
                </Container>
            </Navbar>
            <Sidebar toggle={toggle} isOpen={isOpen}/>
        </>
    );
}