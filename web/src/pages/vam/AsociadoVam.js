import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {do_login} from "../sec/redux/actions";
import Alerts from "../../components/Alerts";
import {MODULES, useCurrentModule} from "../../hooks/useModules";
import {useHistory} from "react-router-dom";
import {getFromSession, storeInSession} from "../../util/General";

const KEY_VAM_ID = 'vam_id';
export const AsociadoVam = () => {

    const alert = useRef();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const isVam = useCurrentModule() === MODULES.VAM;
    const history = useHistory();
    const handleCedula = (cedula, redirect) => {
        const current = alert.current;
        if (cedula !== "") {
            let usuario = JSON.parse(JSON.stringify(user));
            usuario.cedula = cedula;
            usuario.nmAsegurado = user.asociadosVam.find(i => i.cedula === cedula)?.nmCliente;
            usuario.apAsegurado = user.asociadosVam.find(i => i.cedula === cedula)?.apCliente;
            dispatch(do_login({...usuario}));
            if (redirect) {
                storeInSession(KEY_VAM_ID, cedula);
                history.push("/vam/home");
            }
        } else {
            current.show_error("Sin cédula");
        }
    }

    useEffect(() => {
        if (user?.asociadosVam?.length > 0 && !user.cedula && isVam) {
            const savedCedula = getFromSession(KEY_VAM_ID);
            const currentCedula = savedCedula || user.asociadosVam[0].cedula;
            handleCedula(currentCedula);
        }
    }, [isVam]);

    if (user?.asociadosVam?.length < 1) {
        return null;
    }

    return (
        <>
            <Alerts ref={alert}/>
            <hr className={"w-100 mt-1 mb-1"}/>
            <h6 className={"text-white fs-7 text-left w-100 mb-1"}>Asegurados</h6>
            {(user?.asociadosVam || []).map(asoc => (
                <div key={asoc.cedula}
                     className={`${asoc.cedula === user.cedula ? 'bg-primary text-white' : ''} px-1 py-1 fs-7 lh-4`}
                     onClick={() => handleCedula(asoc.cedula, true)}
                     role={"button"}>{asoc.cedula} - {asoc.nmCliente} {asoc.apCliente}
                </div>
            ))}
        </>
    );
}