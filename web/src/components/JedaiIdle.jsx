import React, {useRef, useState} from "react";
import {useIdleTimer} from 'react-idle-timer'
import axios from "axios";
import {routes} from "../util/General";
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import {do_logout} from "../pages/sec/redux/actions";
import {useDispatch} from "react-redux";
import {Modal, ModalBody, ModalFooter} from "reactstrap";
import {UqaiModalHeader} from "./UqaiModal";

export const JedaiIdle = () => {

    const [open, setOpen] = useState(false);
    const time = useRef(null);
    const history = useHistory();
    const dispatch = useDispatch();
    const timeClose = 5;//tiempo(minutos) en el q despues q aparece alerta debe cerrarse

    function handleOnIdle() {
        setOpen(true);
        time.current = setTimeout(doLogout, 60 * 1000 * timeClose);
    }

    const {getRemainingTime} = useIdleTimer({
        timeout: 1000 * 60 * 55, // 55m
        onIdle: handleOnIdle,
        debounce: 500
    })

    function doLogout() {
        clearTimeoutId();
        sessionStorage.clear();
        let url = '/';
        axios.post(routes.root + '/logout').then(() => dispatch(do_logout())).then(() => {
            history.push(url)
        }).catch(() => {
            dispatch(do_logout());
            history.push(url);
        });
    }

    function clearTimeoutId() {
        if (time.current) {
            clearTimeout(time.current)
        }
    }

    function reactivate() {
        // check if already died, in mobile for some reaseon, this time no crurent run after timeout
        if (getRemainingTime() < 1 && open) {
            doLogout();
            return;
        }
        // make fake call to server to mantain alive
        axios.post(routes.api)
        clearTimeoutId();
        setOpen(false);
    }


    return (<>
        {open && <Modal isOpen={open}>
            <UqaiModalHeader/>
            <ModalBody className={"pt-2 mb-3"}>
                <div className="d-flex flex-column">
                    <div className="text-center mb-2">
                        <i className="icon-uqai uqai-pregunta fs-1 text-primary"></i>
                    </div>
                    <h4 className="text-secondary text-center mb-3 fw-bold">Inactividad de sesión</h4>
                    <p className="m-0 text-center">Hemos detectado inactividad en la página. Da clic en Continuar para
                        conservar tus cambios, caso contrario en 5 minutos toda la información que hayas generado será
                        eliminada</p>
                </div>
            </ModalBody>
            <ModalFooter>
                <button className={"btn btn-primary mx-auto"} onClick={reactivate}>Continuar</button>
            </ModalFooter>
        </Modal>}
    </>)
};