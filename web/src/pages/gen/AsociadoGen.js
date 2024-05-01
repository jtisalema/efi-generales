import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {do_login} from "../sec/redux/actions";
import Alerts from "../../components/Alerts";
import {MODULES, useCurrentModule} from "../../hooks/useModules";
import {useHistory} from "react-router-dom";
import {getFromSession, storeInSession} from "../../util/General";

const KEY_GEN_ID = 'gen_id';

export const AsociadoGen = () => {
    const alert = useRef();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const isGen = useCurrentModule() === MODULES.GEN;
    const history = useHistory();

    const handleCdCliente = (cdCliente, redirect) => {
        const current = alert.current;
        if (cdCliente) {
            let usuario = JSON.parse(JSON.stringify(user));
            usuario.cdCliente = cdCliente;
            usuario.nmCliente = user.asociados.find(i => i.cdCliente === cdCliente)?.nmAsegurado;
            usuario.apCliente = user.asociados.find(i => i.cdCliente === cdCliente)?.apAsegurado;
            dispatch(do_login({...usuario}));
            if (redirect) {
                storeInSession(KEY_GEN_ID, cdCliente);
                history.push("/gen/home");
            }
        } else {
            current.show_error("Sin Código de cliente");
        }
    }

    useEffect(() => {
        if (user?.asociados?.length > 0 && !user.cdCliente && isGen) {
            const savedCdCliente = getFromSession(KEY_GEN_ID);
            const currentCdCliente = savedCdCliente || user?.asociados[0]?.cdCliente;
            handleCdCliente(parseInt(currentCdCliente));
        }
    }, [isGen]);

    if (user?.asociados?.length < 1) {// el combo no debe verse si no hay q seleccionar
        return null;
    }


    return (
        <>
            <Alerts ref={alert}/>
            <hr className={"w-100 mt-1 mb-1"}/>
            <h6 className={"text-white fs-7 text-left w-100 mb-1"}>Contratantes</h6>
            {(user?.asociados || []).map(asoc => (
                <div key={asoc.cdCliContac}
                     className={`${asoc.cdCliente === user.cdCliente ? 'bg-primary text-white' : ''} px-1 py-1 fs-7 lh-4`}
                     onClick={() => handleCdCliente(asoc.cdCliente, true)}
                     role={"button"}>{asoc.cedula} - {asoc.nmAsegurado} {asoc.apAsegurado}
                </div>
            ))}
        </>
    );
}