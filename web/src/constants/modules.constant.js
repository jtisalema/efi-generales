import {routes} from "../pages/gen/UtilsGeneral";


export const ENDPOINT_GEN = {
    getRamosNoAdmin: `${routes.api}/siniestros-gen/aseguradora`,
    listSiniestrosReported: `${routes.api}/siniestros-portal/search`,
    getMatrix: `${routes.api}/siniestros-gen/aseguradora`
};

export const ENDPOINT_VAM = {
    getRamosNoAdmin: `${routes.apiVam}/siniestro/deducible/matrix`,
    listSiniestrosReported: `${routes.apiVam}/siniestros-portal/search`,
    getMatrix: `${routes.apiVam}/siniestro/deducible/matrix`
};