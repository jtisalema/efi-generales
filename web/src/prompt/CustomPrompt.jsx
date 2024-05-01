import useExitPrompt from "./useExitPrompt";
import React, {useEffect} from "react";
import {Prompt} from "react-router-dom/cjs/react-router-dom";
import {useFormikContext} from "formik";
import {useSelector} from "react-redux";

export const CustomPrompt = ({regexPath, showPopup = false, isActivePrompt = true}) => {

    // muestra una alerta cuando se quiere recargar o cerrar la ventana si el formik tiene cambios pendientes
    const actions = useFormikContext();
    const {dirty, values} = actions
    const user = useSelector(state => state.user);
    const isLogged = user?.id || false;

    const setExitPrompt = useExitPrompt(dirty)[1];

    useEffect(() => {
        const show = showAlertByPath();
        setExitPrompt(isLogged && dirty && isActivePrompt && show);

        return () => {
            setExitPrompt(false);
        }
    }, [dirty, isActivePrompt, regexPath, isLogged]);

    const showAlertByPath = () => {
        const currentPath = window.location.pathname;
        return regexPath.test(currentPath);
    }

    return (
        <>
            <Prompt when={isLogged && dirty && isActivePrompt && showAlertByPath()}
                    message={"¿Estás seguro que quieres salir?"}/>
            {values.id && dirty && showPopup &&
                <div className="is-dirty" title={"Finaliza los pasos para guardar"}>
                    <span className={"fa-fade"}>Hay cambios pendientes...</span>
                </div>
            }
        </>)
}
