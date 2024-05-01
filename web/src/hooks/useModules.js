import {useSelector} from "react-redux";

/**
 *
 * @param module   gen|vam|crea-siniestro
 * @param user user
 */
export const canViewModule = (module, user) => {

    switch (module) {
        case MODULES.GEN:
            return (user.asociados || []).length > 0;
        case MODULES.VAM:
            return (user.asociadosVam || []).length > 0;
        case MODULES.CREA_SINIESTROS:
            return !user.hasPrivileges;
    }

}

export const useModuleVam = () => {
    const user = useSelector(state => state.user);
    return canViewModule(MODULES.VAM, user);
}

export const useCurrentModule = () => {
    const path = window.location.pathname;
    if (path.includes(MODULES.GEN)) return MODULES.GEN;
    if (path.includes(MODULES.VAM)) return MODULES.VAM;
    return "main";
};

export const useModuleGen = () => {
    const user = useSelector(state => state.user);
    return canViewModule(MODULES.GEN, user);
}

export const MODULES = {
    GEN: 'gen', VAM: 'vam', CREA_SINIESTROS: 'ss-crea'
}