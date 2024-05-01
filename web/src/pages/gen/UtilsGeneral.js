import {api_url} from "../../util/General";

export const routes = {
    base: api_url() + '/gen',
    api: api_url() + '/gen',
    apiVam: api_url() + '/vam',
    root: api_url()
};

export const app = {
    name: "Asistencia Médica",
    prod: window.prod,
};
